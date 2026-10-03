import { NextRequest, NextResponse } from 'next/server';
import { resendViewerOtp } from '@/lib/auth/user';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    const result = await resendViewerOtp(email);

    if (!result.success) {
      return NextResponse.json({ error: result.error || 'Gagal mengirim ulang OTP.' }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      message: 'Kode OTP baru telah dikirimkan ke email Anda.',
    });
  } catch {
    return NextResponse.json(
      { error: 'Terjadi kesalahan server saat mengirim ulang OTP.' },
      { status: 500 }
    );
  }
}
