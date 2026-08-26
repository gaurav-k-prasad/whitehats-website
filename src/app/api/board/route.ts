import { NextResponse } from 'next/server';
import { fetchAllBoardMembers } from '@/lib/db';

export async function GET() {
  try {
    const members = await fetchAllBoardMembers();
    return NextResponse.json({ members });
  } catch (error) {
    console.error('Public board API error:', error);
    return NextResponse.json({ error: 'Failed to fetch board members' }, { status: 500 });
  }
}
