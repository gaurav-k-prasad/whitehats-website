import { NextResponse } from 'next/server';
import { getAdminSessionFromRequest } from '@/lib/auth';
import { fetchAllEvents, getDb } from '@/lib/db';
import * as schema from '@/db/schema';
import { eq } from 'drizzle-orm';
import { uploadBufferToCloudinary, deleteFromCloudinary } from '@/lib/cloudinary-server';

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

  let uploadedPublicId: string | null = null;

  try {
    const contentType = request.headers.get('content-type') || '';
    let id: string | null = null;
    let title = '';
    let type: 'Hackathon' | 'CTF' | 'Workshop' | 'Seminar' | 'Bootcamp' = 'Workshop';
    let status: 'UPCOMING' | 'ONGOING' | 'PAST' = 'UPCOMING';
    let date = '';
    let time = '';
    let location = '';
    let mode: string | null = null;
    let description = '';
    let tags: string[] = [];
    let highlights: string[] | undefined = undefined;
    let imageUrl: string | null = null;
    let registrationUrl: string | null = null;
    let imageFile: File | null = null;

    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      id = (formData.get('id') as string) || null;
      title = (formData.get('title') as string) || '';
      type = (formData.get('type') as any) || 'Workshop';
      status = (formData.get('status') as any) || 'UPCOMING';
      date = (formData.get('date') as string) || '';
      time = (formData.get('time') as string) || '01:00 PM - 05:00 PM';
      location = (formData.get('location') as string) || 'VIT Vellore';
      mode = (formData.get('mode') as string) || 'In-Person';
      description = (formData.get('description') as string) || '';
      imageUrl = (formData.get('imageUrl') as string) || null;
      registrationUrl = (formData.get('registrationUrl') as string) || null;

      const rawTags = formData.get('tags') as string;
      tags = rawTags ? rawTags.split(',').map((t) => t.trim()).filter(Boolean) : [];

      const rawHighlights = formData.get('highlights') as string;
      highlights = rawHighlights ? rawHighlights.split('\n').map((h) => h.trim()).filter(Boolean) : undefined;

      const file = formData.get('imageFile');
      if (file && typeof file === 'object' && 'arrayBuffer' in file && (file as File).size > 0) {
        imageFile = file as File;
      }
    } else {
      const body = await request.json();
      id = body.id || null;
      title = body.title || '';
      type = body.type || 'Workshop';
      status = body.status || 'UPCOMING';
      date = body.date || '';
      time = body.time || '01:00 PM - 05:00 PM';
      location = body.location || 'VIT Vellore';
      mode = body.mode || 'In-Person';
      description = body.description || '';
      imageUrl = body.imageUrl || null;
      registrationUrl = body.registrationUrl || null;
      tags = Array.isArray(body.tags) ? body.tags : typeof body.tags === 'string' ? body.tags.split(',').map((t: string) => t.trim()).filter(Boolean) : [];
      highlights = Array.isArray(body.highlights) ? body.highlights : typeof body.highlights === 'string' ? body.highlights.split('\n').map((h: string) => h.trim()).filter(Boolean) : undefined;
    }

    if (!title.trim() || !type || !date) {
      return NextResponse.json({ error: 'Title, type, and date are required' }, { status: 400 });
    }

    // 1. If an image file was provided, upload to Cloudinary
    if (imageFile) {
      const arrayBuffer = await imageFile.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const uploadResult = await uploadBufferToCloudinary(buffer, {
        folder: 'whitehats/events',
        tags: ['whitehats', 'events', type],
      });
      imageUrl = uploadResult.publicId;
      uploadedPublicId = uploadResult.publicId;
    }

    const eventId = id || (typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `event-${Date.now()}`);
    const db = getDb();

    // 2. Database Insert / Update
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
          mode: mode || null,
          description: description || '',
          tags: tags,
          highlights: highlights,
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
            mode: mode || null,
            description: description || '',
            tags: tags,
            highlights: highlights,
            imageUrl: imageUrl || null,
            registrationUrl: registrationUrl || null,
          },
        });
    }

    return NextResponse.json({
      success: true,
      event: { id: eventId, title, type, date, imageUrl },
    });
  } catch (error: any) {
    console.error('[Admin Events API Error]:', error);

    // Rollback: delete uploaded Cloudinary asset if DB operation failed
    if (uploadedPublicId) {
      console.warn(`[Cloudinary Rollback] Deleting event asset ${uploadedPublicId} due to failure`);
      await deleteFromCloudinary(uploadedPublicId);
    }

    return NextResponse.json(
      { error: error?.message || 'Failed to save event.' },
      { status: 500 }
    );
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

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete event error:', error);
    return NextResponse.json({ error: 'Failed to delete event' }, { status: 500 });
  }
}
