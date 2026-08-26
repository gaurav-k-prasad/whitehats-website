import { NextResponse } from 'next/server';
import { fetchAllProjects } from '@/lib/db';

export const revalidate = 3600;

export async function GET() {
  try {
    const projects = await fetchAllProjects();
    return NextResponse.json(
      { projects },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
        },
      }
    );
  } catch (error) {
    console.error('Public projects API error:', error);
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 });
  }
}
