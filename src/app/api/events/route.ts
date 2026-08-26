import { NextResponse } from 'next/server';
import { fetchAllEvents } from '@/lib/db';

export async function GET() {
  try {
    const events = await fetchAllEvents();
    return NextResponse.json({ events });
  } catch (error) {
    console.error('Public events API error:', error);
    return NextResponse.json({ error: 'Failed to fetch events' }, { status: 500 });
  }
}
