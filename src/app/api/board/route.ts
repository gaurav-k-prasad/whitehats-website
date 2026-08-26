import { NextResponse } from 'next/server';
import { fetchAllBoardMembers } from '@/lib/db';

export const revalidate = 3600;

export async function GET() {
  try {
    const members = await fetchAllBoardMembers();
    return NextResponse.json(
      { members },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
        },
      }
    );
  } catch (error) {
    console.error('Public board API error:', error);
    return NextResponse.json({ error: 'Failed to fetch board members' }, { status: 500 });
  }
}
