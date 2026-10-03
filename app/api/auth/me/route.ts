import { NextResponse } from 'next/server';
import { getViewerSession } from '@/lib/auth/user';

export async function GET() {
  const user = await getViewerSession();
  return NextResponse.json({ user });
}
