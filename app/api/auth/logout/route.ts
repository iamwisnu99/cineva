import { NextResponse } from 'next/server';
import { clearViewerSession } from '@/lib/auth/user';

export async function POST() {
  await clearViewerSession();
  return NextResponse.json({ success: true });
}

export async function DELETE() {
  await clearViewerSession();
  return NextResponse.json({ success: true });
}
