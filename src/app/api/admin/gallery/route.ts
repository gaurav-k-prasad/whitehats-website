import { NextResponse } from 'next/server';
import { getAdminSessionFromRequest } from '@/lib/auth';
import { fetchAllGalleryItems, getDb } from '@/lib/db';
import * as schema from '@/db/schema';
import { eq } from 'drizzle-orm';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: Request) {
  const session = await getAdminSessionFromRequest(request);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized: Admin session required' }, { status: 401 });
  }

  const items = await fetchAllGalleryItems();
  return NextResponse.json({ items }, {
    headers: {
      'Cache-Control': 'no-store, max-age=0',
    },
  });
}

export async function POST(request: Request) {
  const session = await getAdminSessionFromRequest(request);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized: Admin session required' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { id, title, quote, date, year, category, tags, imageUrl, width, height, aspectClass } = body;

    if (!title || !category || !imageUrl) {
      return NextResponse.json({ error: 'Title, category, and imageUrl are required' }, { status: 400 });
    }

    const itemId = id || (typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `gallery-${Date.now()}`);
    const parsedTags = Array.isArray(tags) ? tags : typeof tags === 'string' ? tags.split(',').map((t: string) => t.trim()) : [];

    const db = getDb();
    if (db) {
      await db
        .insert(schema.galleryItems)
        .values({
          id: itemId,
          title: title.trim(),
          quote: quote || '',
          date: date || '',
          year: year || '2026',
          category,
          tags: parsedTags,
          imageUrl: imageUrl.trim(),
          width: width ? Number(width) : 600,
          height: height ? Number(height) : 400,
          aspectClass: aspectClass || 'aspect-[3/2]',
        })
        .onConflictDoUpdate({
          target: schema.galleryItems.id,
          set: {
            title: title.trim(),
            quote: quote || '',
            date: date || '',
            year: year || '2026',
            category,
            tags: parsedTags,
            imageUrl: imageUrl.trim(),
            width: width ? Number(width) : 600,
            height: height ? Number(height) : 400,
            aspectClass: aspectClass || 'aspect-[3/2]',
          },
        });
    }

    return NextResponse.json({ success: true, item: { id: itemId, title, category, imageUrl } });
  } catch (error) {
    console.error('Save gallery error:', error);
    return NextResponse.json({ error: 'Failed to save gallery item' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const session = await getAdminSessionFromRequest(request);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized: Admin session required' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Gallery item ID required' }, { status: 400 });
    }

    const db = getDb();
    if (db) {
      await db.delete(schema.galleryItems).where(eq(schema.galleryItems.id, id));
    }

    return NextResponse.json({ success: true, message: `Gallery item ${id} removed` });
  } catch (error) {
    console.error('Delete gallery item error:', error);
    return NextResponse.json({ error: 'Failed to delete gallery item' }, { status: 500 });
  }
}
