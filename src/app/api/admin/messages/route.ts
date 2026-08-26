import { NextResponse } from 'next/server';
import { getAdminSessionFromRequest } from '@/lib/auth';
import { getDb } from '@/lib/db';
import * as schema from '@/db/schema';
import { eq, desc } from 'drizzle-orm';

export async function GET(request: Request) {
  const session = await getAdminSessionFromRequest(request);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized: Admin session required' }, { status: 401 });
  }

  const db = getDb();
  if (!db) {
    return NextResponse.json({
      messages: [],
      source: 'empty',
    });
  }

  try {
    const records = await db
      .select()
      .from(schema.contactMessages)
      .orderBy(desc(schema.contactMessages.createdAt));
    return NextResponse.json({ messages: records, source: 'd1' });
  } catch (err) {
    console.warn('D1 messages read failed:', err);
    return NextResponse.json({ messages: [], source: 'empty' });
  }
}

export async function PATCH(request: Request) {
  const session = await getAdminSessionFromRequest(request);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized: Admin session required' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json({ error: 'ID and status required' }, { status: 400 });
    }

    const db = getDb();
    if (db) {
      await db
        .update(schema.contactMessages)
        .set({ status })
        .where(eq(schema.contactMessages.id, id));
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Update message error:', error);
    return NextResponse.json({ error: 'Failed to update message status' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const session = await getAdminSessionFromRequest(request);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized: Admin session required' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'Message ID is required' }, { status: 400 });
  }

  const db = getDb();
  if (!db) {
    return NextResponse.json({ error: 'Database unavailable' }, { status: 503 });
  }

  try {
    await db.delete(schema.contactMessages).where(eq(schema.contactMessages.id, id));
    return NextResponse.json({ success: true, message: 'Message deleted successfully' });
  } catch (error) {
    console.error('Delete message error:', error);
    return NextResponse.json({ error: 'Failed to delete message' }, { status: 500 });
  }
}
