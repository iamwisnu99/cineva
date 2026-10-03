import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';
import { getSupabaseServerClient } from '@/lib/supabase/server';

export interface AdminUser {
  id: string;
  nama: string;
  email: string;
  role: string;
}

export const ADMIN_COOKIE_NAME = 'cineva_admin_session';

// Pre-computed bcrypt hash of "Cineva@99" (salt cost factor 10)
const DEFAULT_ADMIN_HASH = '$2b$10$mXfUuTQV6yuFgjwgCoo9PeRfQCx5XcZWlsQoKPcFqg5wv3G5Kbfqq';
const DEFAULT_ADMIN_EMAIL = 'primawisnu99@gmail.com';
const DEFAULT_ADMIN_NAME = 'Prima Wisnu';

const SESSION_SECRET =
  process.env.ADMIN_SESSION_SECRET || 'cineva_secure_secret_fallback_key_2026';

/**
 * Signs a payload with HMAC SHA-256
 */
function signToken(payload: string): string {
  const signature = crypto
    .createHmac('sha256', SESSION_SECRET)
    .update(payload)
    .digest('hex');
  return `${Buffer.from(payload).toString('base64url')}.${signature}`;
}

/**
 * Verifies and decodes an HMAC SHA-256 signed token
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
      // Check expiration (7 days)
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
 * Authenticates admin against Supabase database table `admin_users`
 * with SQL injection immunity (parameterized queries) and bcrypt hashing.
 */
export async function authenticateAdmin(
  emailInput: string,
  plainPasswordInput: string
): Promise<{ success: boolean; user?: AdminUser; error?: string; isDbConnected?: boolean }> {
  const email = emailInput.trim().toLowerCase();
  const password = plainPasswordInput.trim();

  if (!email || !password) {
    return { success: false, error: 'Email dan password wajib diisi.' };
  }

  const supabase = getSupabaseServerClient();

  if (supabase) {
    try {
      // 1. Query Supabase table `admin_users` safely via parameterized query builder
      const { data: user, error: dbError } = await supabase
        .from('admin_users')
        .select('id, nama, email, password, role')
        .eq('email', email)
        .maybeSingle();

      if (dbError) {
        console.error('[Cineva Auth] Supabase query error:', dbError.message);
      }

      if (user && user.password) {
        // Compare entered password with stored bcrypt hash
        const isMatch = await bcrypt.compare(password, user.password);
        if (isMatch) {
          return {
            success: true,
            isDbConnected: true,
            user: {
              id: user.id,
              nama: user.nama,
              email: user.email,
              role: user.role || 'superadmin',
            },
          };
        }
      }

      // If user not yet seeded into Supabase table, check if default credentials match
      // and automatically seed the admin into the Supabase database!
      if (email === DEFAULT_ADMIN_EMAIL.toLowerCase()) {
        const isDefaultMatch = await bcrypt.compare(password, DEFAULT_ADMIN_HASH);
        if (isDefaultMatch) {
          // Attempt automatic background seed into Supabase table
          try {
            await supabase.from('admin_users').upsert({
              nama: DEFAULT_ADMIN_NAME,
              email: DEFAULT_ADMIN_EMAIL,
              password: DEFAULT_ADMIN_HASH,
              role: 'superadmin',
            });
          } catch (seedErr) {
            console.warn('[Cineva Auth] Auto-seed warning:', seedErr);
          }

          return {
            success: true,
            isDbConnected: true,
            user: {
              id: 'supa-admin-prima',
              nama: DEFAULT_ADMIN_NAME,
              email: DEFAULT_ADMIN_EMAIL,
              role: 'superadmin',
            },
          };
        }
      }

      return { success: false, error: 'Email atau password yang Anda masukkan salah.' };
    } catch (err: any) {
      console.error('[Cineva Auth] Database connection error:', err?.message);
    }
  }

  // Fallback: If Supabase credentials are not yet configured in .env.local,
  // verify using the securely pre-hashed bcrypt credentials on server-side
  if (email === DEFAULT_ADMIN_EMAIL.toLowerCase()) {
    const isMatch = await bcrypt.compare(password, DEFAULT_ADMIN_HASH);
    if (isMatch) {
      return {
        success: true,
        isDbConnected: false,
        user: {
          id: 'admin-local-1',
          nama: DEFAULT_ADMIN_NAME,
          email: DEFAULT_ADMIN_EMAIL,
          role: 'superadmin',
        },
      };
    }
  }

  return { success: false, error: 'Email atau password salah.' };
}

/**
 * Sets HTTP-Only secure session cookie
 */
export async function setAdminSession(user: AdminUser) {
  const cookieStore = await cookies();
  const payload = JSON.stringify({
    ...user,
    exp: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days validity
  });
  const token = signToken(payload);

  cookieStore.set({
    name: ADMIN_COOKIE_NAME,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 7 * 24 * 60 * 60,
  });
}

/**
 * Verifies currently active admin session from cookies
 */
export async function getAdminSession(): Promise<AdminUser | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
    if (!token) return null;

    const data = verifyToken(token);
    if (!data || !data.email) return null;

    return {
      id: data.id,
      nama: data.nama,
      email: data.email,
      role: data.role || 'superadmin',
    };
  } catch {
    return null;
  }
}

/**
 * Destroys admin session cookie on logout
 */
export async function clearAdminSession() {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_COOKIE_NAME);
}
