import { NextRequest, NextResponse } from 'next/server';
import { loginViewer } from '@/lib/auth/user';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    const result = await loginViewer(email, password);

    if (!result.success) {
      if (result.requireOtp) {
        return NextResponse.json(
          {
            error: result.error,
            requireOtp: true,
            email: result.email,
          },
          { status: 403 }
        );
      }
      return NextResponse.json({ error: result.error || 'Login gagal.' }, { status: 401 });
    }

    return NextResponse.json({
      success: true,
      user: result.user,
    });
  } catch {
    return NextResponse.json(
      { error: 'Terjadi kesalahan server saat memproses login penonton.' },
      { status: 500 }
    );
  }
}
