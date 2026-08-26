import { NextResponse } from 'next/server';
import { getAdminSessionFromRequest } from '@/lib/auth';
import { fetchAllEvents, getDb } from '@/lib/db';
import * as schema from '@/db/schema';
import { eq } from 'drizzle-orm';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: Request) {
  const session = await getAdminSessionFromRequest(request);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized: Admin session required' }, { status: 401 });
  }

  const events = await fetchAllEvents();
  return NextResponse.json({ events }, {
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
    const { id, title, type, status, date, time, location, description, tags, imageUrl, registrationUrl } = body;

    if (!title || !type || !date) {
      return NextResponse.json({ error: 'Title, type, and date are required' }, { status: 400 });
    }

    const eventId = id || (typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `event-${Date.now()}`);
    const parsedTags = Array.isArray(tags) ? tags : typeof tags === 'string' ? tags.split(',').map((t: string) => t.trim()) : [];

    const db = getDb();
    if (db) {
      await db
        .insert(schema.events)
        .values({
          id: eventId,
          title: title.trim(),
          type,
          status: status || 'UPCOMING',
          date,
          time: time || 'TBA',
          location: location || 'VIT Vellore',
          description: description || '',
          tags: parsedTags,
          imageUrl: imageUrl || null,
          registrationUrl: registrationUrl || null,
        })
        .onConflictDoUpdate({
          target: schema.events.id,
          set: {
            title: title.trim(),
            type,
            status: status || 'UPCOMING',
            date,
            time: time || 'TBA',
            location: location || 'VIT Vellore',
            description: description || '',
            tags: parsedTags,
            imageUrl: imageUrl || null,
            registrationUrl: registrationUrl || null,
          },
        });
    }

    return NextResponse.json({ success: true, event: { id: eventId, title, type, date } });
  } catch (error) {
    console.error('Save event error:', error);
    return NextResponse.json({ error: 'Failed to save event' }, { status: 500 });
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
      return NextResponse.json({ error: 'Event ID required' }, { status: 400 });
    }

    const db = getDb();
    if (db) {
      await db.delete(schema.events).where(eq(schema.events.id, id));
    }

    return NextResponse.json({ success: true, message: `Event ${id} removed` });
  } catch (error) {
    console.error('Delete event error:', error);
    return NextResponse.json({ error: 'Failed to delete event' }, { status: 500 });
  }
}
