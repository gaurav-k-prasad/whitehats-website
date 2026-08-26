import { NextResponse } from 'next/server';
import { fetchAllEvents } from '@/lib/db';

export const revalidate = 3600;

export async function GET() {
  try {
    const events = await fetchAllEvents();
    return NextResponse.json(
      { events },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
        },
      }
    );
  } catch (error) {
    console.error('Public events API error:', error);
    return NextResponse.json({ error: 'Failed to fetch events' }, { status: 500 });
  }
}
