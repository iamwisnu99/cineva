import { NextRequest, NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/auth/admin';
import { getSupabaseMovies, insertSupabaseMovie, deleteSupabaseMovie } from '@/lib/data/supabaseContent';
import { getMovies } from '@/lib/data/repository';

export async function GET() {
  try {
    const movies = await getMovies();
    return NextResponse.json({ success: true, movies });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    // 1. Verify authenticated admin session
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized: Sesi admin tidak sah.' }, { status: 401 });
    }

    // 2. Parse request payload
    const body = await req.json();
    if (!body.title || !body.videoUrl || !body.posterUrl || !body.backdropUrl) {
      return NextResponse.json(
        { success: false, error: 'Field title, videoUrl, posterUrl, dan backdropUrl wajib diisi.' },
        { status: 400 }
      );
    }

    const generatedSlug = (body.slug || body.title)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const movieData = {
      ...body,
      slug: generatedSlug,
      director: body.director || session.nama || 'Prima Wisnu',
    };

    // 3. Insert into Supabase
    const result = await insertSupabaseMovie(movieData);
    if (!result.success) {
      return NextResponse.json({ success: false, error: result.error }, { status: 400 });
    }

    return NextResponse.json({ success: true, movie: result.data });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized: Sesi admin tidak sah.' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const idOrSlug = searchParams.get('id') || searchParams.get('slug');

    if (!idOrSlug) {
      return NextResponse.json({ success: false, error: 'Parameter id atau slug diperlukan.' }, { status: 400 });
    }

    const result = await deleteSupabaseMovie(idOrSlug);
    if (!result.success) {
      return NextResponse.json({ success: false, error: result.error }, { status: 400 });
    }

    return NextResponse.json({ success: true, message: 'Film berhasil dihapus dari database.' });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
