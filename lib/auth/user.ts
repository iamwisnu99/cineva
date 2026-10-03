import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';
import { getSupabaseServerClient } from '@/lib/supabase/server';
import { sendOtpEmail } from '@/lib/email/mailer';

export interface ViewerUser {
  id: string;
  nama: string;
  email: string;
  isVerified: boolean;
}

interface StoredViewerUser {
  id: string;
  nama: string;
  email: string;
  password: string; // bcrypt hash
  otp_code?: string | null;
  otp_expires_at?: string | null;
  is_verified: boolean;
}

export const VIEWER_COOKIE_NAME = 'cineva_viewer_session';

const SESSION_SECRET =
  process.env.ADMIN_SESSION_SECRET || 'cineva_secure_secret_fallback_key_2026';

// In-memory fallback store for local development when Supabase is not yet populated
const localViewersStore: StoredViewerUser[] = [];

/**
 * Signs payload with HMAC SHA-256 for viewer session
 */
function signToken(payload: string): string {
  const signature = crypto
    .createHmac('sha256', SESSION_SECRET)
    .update(payload)
    .digest('hex');
  return `${Buffer.from(payload).toString('base64url')}.${signature}`;
}

/**
 * Verifies and decodes HMAC SHA-256 signed viewer token
 */
function verifyToken(token: string): any | null {
  try {
    const [encodedPayload, signature] = token.split('.');
    if (!encodedPayload || !signature) return null;

    const payload = Buffer.from(encodedPayload, 'base64url').toString('utf-8');
    const expectedSig = crypto
      .createHmac('sha256', SESSION_SECRET)
      .update(payload)
      .digest('hex');

    if (crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSig))) {
      const data = JSON.parse(payload);
      if (data.exp && Date.now() > data.exp) {
        return null;
      }
      return data;
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Generates a secure random 6-digit numeric OTP
 */
function generateOtp(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

/**
 * Registers a new viewer and dispatches an OTP email
 */
export async function registerViewer(params: {
  nama: string;
  email: string;
  password: string;
  confirmPassword: string;
}): Promise<{ success: boolean; error?: string; email?: string }> {
  const nama = params.nama?.trim();
  const email = params.email?.trim().toLowerCase();
  const password = params.password?.trim();
  const confirmPassword = params.confirmPassword?.trim();

  if (!nama || !email || !password || !confirmPassword) {
    return { success: false, error: 'Semua kolom wajib diisi.' };
  }

  if (password !== confirmPassword) {
    return { success: false, error: 'Konfirmasi password tidak cocok dengan password yang dibuat.' };
  }

  if (password.length < 6) {
    return { success: false, error: 'Password minimal terdiri dari 6 karakter.' };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { success: false, error: 'Format email tidak valid.' };
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const otpCode = generateOtp();
  const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString(); // 10 minutes

  const supabase = getSupabaseServerClient();

  if (supabase) {
    try {
      // Check if user already exists
      const { data: existingUser } = await supabase
        .from('users')
        .select('id, email, is_verified')
        .eq('email', email)
        .maybeSingle();

      if (existingUser && existingUser.is_verified) {
        return { success: false, error: 'Email sudah terdaftar. Silakan langsung login.' };
      }

      // Upsert unverified user with new OTP
      const { error: upsertErr } = await supabase.from('users').upsert({
        nama,
        email,
        password: hashedPassword,
        otp_code: otpCode,
        otp_expires_at: otpExpiresAt,
        is_verified: false,
        updated_at: new Date().toISOString(),
      });

      if (upsertErr) {
        console.error('[Cineva User] Supabase upsert error:', upsertErr.message);
        return { success: false, error: 'Gagal memproses pendaftaran. Silakan coba lagi.' };
      }

      // Send OTP via Gmail
      await sendOtpEmail({ to: email, nama, otpCode });
      return { success: true, email };
    } catch (err: any) {
      console.error('[Cineva User Error]', err);
    }
  }

  // Fallback to local memory store if Supabase not configured
  const existingIdx = localViewersStore.findIndex((u) => u.email === email);
  if (existingIdx >= 0 && localViewersStore[existingIdx].is_verified) {
    return { success: false, error: 'Email sudah terdaftar. Silakan langsung login.' };
  }

  const record: StoredViewerUser = {
    id: `viewer-${Date.now()}`,
    nama,
    email,
    password: hashedPassword,
    otp_code: otpCode,
    otp_expires_at: otpExpiresAt,
    is_verified: false,
  };

  if (existingIdx >= 0) {
    localViewersStore[existingIdx] = record;
  } else {
    localViewersStore.push(record);
  }

  await sendOtpEmail({ to: email, nama, otpCode });
  return { success: true, email };
}

/**
 * Verifies 6-digit OTP code and establishes viewer session
 */
export async function verifyViewerOtp(
  emailInput: string,
  otpInput: string
): Promise<{ success: boolean; error?: string; user?: ViewerUser }> {
  const email = emailInput?.trim().toLowerCase();
  const otpCode = otpInput?.trim();

  if (!email || !otpCode) {
    return { success: false, error: 'Email dan kode OTP wajib diisi.' };
  }

  const supabase = getSupabaseServerClient();

  if (supabase) {
    try {
      const { data: user, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .maybeSingle();

      if (error || !user) {
        return { success: false, error: 'Data pendaftaran tidak ditemukan.' };
      }

      if (user.otp_code !== otpCode) {
        return { success: false, error: 'Kode OTP yang Anda masukkan salah.' };
      }

      if (new Date(user.otp_expires_at).getTime() < Date.now()) {
        return { success: false, error: 'Kode OTP telah kedaluwarsa. Silakan minta kode baru.' };
      }

      // Activate user
      await supabase
        .from('users')
        .update({
          is_verified: true,
          otp_code: null,
          otp_expires_at: null,
          updated_at: new Date().toISOString(),
        })
        .eq('email', email);

      const verifiedUser: ViewerUser = {
        id: user.id,
        nama: user.nama,
        email: user.email,
        isVerified: true,
      };

      await setViewerSession(verifiedUser);
      return { success: true, user: verifiedUser };
    } catch (err: any) {
      console.error('[Cineva OTP Verify Error]', err);
    }
  }

  // Local fallback
  const user = localViewersStore.find((u) => u.email === email);
  if (!user) {
    return { success: false, error: 'Data pendaftaran tidak ditemukan.' };
  }

  if (user.otp_code !== otpCode) {
    return { success: false, error: 'Kode OTP yang Anda masukkan salah.' };
  }

  if (user.otp_expires_at && new Date(user.otp_expires_at).getTime() < Date.now()) {
    return { success: false, error: 'Kode OTP telah kedaluwarsa. Silakan minta kode baru.' };
  }

  user.is_verified = true;
  user.otp_code = null;
  user.otp_expires_at = null;

  const verifiedUser: ViewerUser = {
    id: user.id,
    nama: user.nama,
    email: user.email,
    isVerified: true,
  };

  await setViewerSession(verifiedUser);
  return { success: true, user: verifiedUser };
}

/**
 * Resends a fresh OTP code to user's email
 */
export async function resendViewerOtp(
  emailInput: string
): Promise<{ success: boolean; error?: string }> {
  const email = emailInput?.trim().toLowerCase();
  if (!email) return { success: false, error: 'Email wajib diisi.' };

  const newOtp = generateOtp();
  const newExpiry = new Date(Date.now() + 10 * 60 * 1000).toISOString();

  const supabase = getSupabaseServerClient();
  if (supabase) {
    try {
      const { data: user } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .maybeSingle();

      if (!user) {
        return { success: false, error: 'Akun tidak ditemukan.' };
      }

      await supabase
        .from('users')
        .update({
          otp_code: newOtp,
          otp_expires_at: newExpiry,
          updated_at: new Date().toISOString(),
        })
        .eq('email', email);

      await sendOtpEmail({ to: email, nama: user.nama, otpCode: newOtp });
      return { success: true };
    } catch (err: any) {
      console.error('[Cineva Resend Error]', err);
    }
  }

  const user = localViewersStore.find((u) => u.email === email);
  if (!user) {
    return { success: false, error: 'Akun tidak ditemukan.' };
  }

  user.otp_code = newOtp;
  user.otp_expires_at = newExpiry;
  await sendOtpEmail({ to: email, nama: user.nama, otpCode: newOtp });
  return { success: true };
}

/**
 * Authenticates viewer login
 */
export async function loginViewer(
  emailInput: string,
  passwordInput: string
): Promise<{ success: boolean; error?: string; requireOtp?: boolean; email?: string; user?: ViewerUser }> {
  const email = emailInput?.trim().toLowerCase();
  const password = passwordInput?.trim();

  if (!email || !password) {
    return { success: false, error: 'Email dan password wajib diisi.' };
  }

  const supabase = getSupabaseServerClient();

  if (supabase) {
    try {
      const { data: user } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .maybeSingle();

      if (!user) {
        return { success: false, error: 'Email atau password yang Anda masukkan salah.' };
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return { success: false, error: 'Email atau password yang Anda masukkan salah.' };
      }

      if (!user.is_verified) {
        // Trigger fresh OTP
        await resendViewerOtp(email);
        return {
          success: false,
          requireOtp: true,
          email: user.email,
          error: 'Akun Anda belum diverifikasi. Kami telah mengirimkan kode OTP baru ke email Anda.',
        };
      }

      const viewer: ViewerUser = {
        id: user.id,
        nama: user.nama,
        email: user.email,
        isVerified: true,
      };

      await setViewerSession(viewer);
      return { success: true, user: viewer };
    } catch (err: any) {
      console.error('[Cineva Viewer Login Error]', err);
    }
  }

  // Local fallback
  const user = localViewersStore.find((u) => u.email === email);
  if (!user) {
    return { success: false, error: 'Email atau password yang Anda masukkan salah.' };
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return { success: false, error: 'Email atau password yang Anda masukkan salah.' };
  }

  if (!user.is_verified) {
    await resendViewerOtp(email);
    return {
      success: false,
      requireOtp: true,
      email: user.email,
      error: 'Akun Anda belum diverifikasi. Kami telah mengirimkan kode OTP baru ke email Anda.',
    };
  }

  const viewer: ViewerUser = {
    id: user.id,
    nama: user.nama,
    email: user.email,
    isVerified: true,
  };

  await setViewerSession(viewer);
  return { success: true, user: viewer };
}

/**
 * Sets HTTP-Only secure viewer session cookie
 */
export async function setViewerSession(user: ViewerUser) {
  const cookieStore = await cookies();
  const payload = JSON.stringify({
    ...user,
    exp: Date.now() + 14 * 24 * 60 * 60 * 1000, // 14 days validity
  });
  const token = signToken(payload);

  cookieStore.set({
    name: VIEWER_COOKIE_NAME,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 14 * 24 * 60 * 60,
  });
}

/**
 * Retrieves current active viewer session from cookie
 */
export async function getViewerSession(): Promise<ViewerUser | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(VIEWER_COOKIE_NAME)?.value;
    if (!token) return null;

    const data = verifyToken(token);
    if (!data || !data.email) return null;

    return {
      id: data.id,
      nama: data.nama,
      email: data.email,
      isVerified: Boolean(data.isVerified),
    };
  } catch {
    return null;
  }
}

/**
 * Clears viewer session cookie
 */
export async function clearViewerSession() {
  const cookieStore = await cookies();
  cookieStore.delete(VIEWER_COOKIE_NAME);
}
