import { NextRequest, NextResponse } from 'next/server';
import { registerViewer } from '@/lib/auth/user';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { nama, email, password, confirmPassword } = body;

    const result = await registerViewer({
      nama,
      email,
      password,
      confirmPassword,
    });

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      email: result.email,
      message: 'Kode OTP telah dikirimkan ke email Anda.',
    });
  } catch {
    return NextResponse.json(
      { error: 'Terjadi kesalahan server saat mendaftarkan akun.' },
      { status: 500 }
    );
  }
}
