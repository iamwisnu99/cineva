import { NextRequest, NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/auth/admin';
import { getSupabaseSeries, insertSupabaseSeries, deleteSupabaseSeries } from '@/lib/data/supabaseContent';
import { getSeries } from '@/lib/data/repository';

export async function GET() {
  try {
    const series = await getSeries();
    return NextResponse.json({ success: true, series });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized: Sesi admin tidak sah.' }, { status: 401 });
    }

    const body = await req.json();
    if (!body.title || !body.posterUrl || !body.backdropUrl) {
      return NextResponse.json(
        { success: false, error: 'Field title, posterUrl, dan backdropUrl wajib diisi.' },
        { status: 400 }
      );
    }

    const generatedSlug = (body.slug || body.title)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const seriesData = {
      ...body,
      slug: generatedSlug,
      creator: body.creator || session.nama || 'Prima Wisnu',
    };

    const result = await insertSupabaseSeries(seriesData);
    if (!result.success) {
      return NextResponse.json({ success: false, error: result.error }, { status: 400 });
    }

    return NextResponse.json({ success: true, series: result.data });
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

    const result = await deleteSupabaseSeries(idOrSlug);
    if (!result.success) {
      return NextResponse.json({ success: false, error: result.error }, { status: 400 });
    }

    return NextResponse.json({ success: true, message: 'Serial TV berhasil dihapus dari database.' });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
