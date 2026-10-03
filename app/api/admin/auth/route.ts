import { NextRequest, NextResponse } from 'next/server';
import { authenticateAdmin, setAdminSession, clearAdminSession } from '@/lib/auth/admin';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    const result = await authenticateAdmin(email, password);

    if (!result.success || !result.user) {
      return NextResponse.json(
        { error: result.error || 'Autentikasi gagal. Silakan periksa kembali data Anda.' },
        { status: 401 }
      );
    }

    // Set secure HTTP-only session cookie
    await setAdminSession(result.user);

    return NextResponse.json({
      success: true,
      user: {
        nama: result.user.nama,
        email: result.user.email,
        role: result.user.role,
      },
      isDbConnected: result.isDbConnected,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: 'Terjadi kesalahan pada server saat memproses login.' },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  try {
    await clearAdminSession();
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Gagal keluar dari sesi.' }, { status: 500 });
  }
}
