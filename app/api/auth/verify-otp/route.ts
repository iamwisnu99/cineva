import { NextRequest, NextResponse } from 'next/server';
import { verifyViewerOtp } from '@/lib/auth/user';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, otpCode } = body;

    const result = await verifyViewerOtp(email, otpCode);

    if (!result.success || !result.user) {
      return NextResponse.json({ error: result.error || 'Verifikasi OTP gagal.' }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      user: result.user,
      message: 'Akun berhasil diverifikasi!',
    });
  } catch {
    return NextResponse.json(
      { error: 'Terjadi kesalahan server saat memverifikasi OTP.' },
      { status: 500 }
    );
  }
}
