import { NextResponse } from 'next/server';
import { fetchAllGalleryItems } from '@/lib/db';

export async function GET() {
  try {
    const items = await fetchAllGalleryItems();
    return NextResponse.json({ items });
  } catch (error) {
    console.error('Public gallery API error:', error);
    return NextResponse.json({ error: 'Failed to fetch gallery items' }, { status: 500 });
  }
}
