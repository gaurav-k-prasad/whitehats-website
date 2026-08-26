import { NextResponse } from 'next/server';
import { fetchAllGalleryItems } from '@/lib/db';

export const revalidate = 3600;

export async function GET() {
  try {
    const items = await fetchAllGalleryItems();
    return NextResponse.json(
      { items },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
        },
      }
    );
  } catch (error) {
    console.error('Public gallery API error:', error);
    return NextResponse.json({ error: 'Failed to fetch gallery items' }, { status: 500 });
  }
}
