import { NextResponse } from 'next/server';
import { fetchAllBoardMembers } from '@/lib/db';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const members = await fetchAllBoardMembers();
    return NextResponse.json({ members }, {
      headers: {
        'Cache-Control': 'no-store, max-age=0',
      },
    });
  } catch (error) {
    console.error('Public board API error:', error);
    return NextResponse.json({ error: 'Failed to fetch board members' }, { status: 500 });
  }
}
