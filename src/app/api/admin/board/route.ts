import { NextResponse } from 'next/server';
import { getAdminSessionFromRequest } from '@/lib/auth';
import { fetchAllBoardMembers, getDb } from '@/lib/db';
import * as schema from '@/db/schema';
import { eq } from 'drizzle-orm';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: Request) {
  const session = await getAdminSessionFromRequest(request);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized: Admin session required' }, { status: 401 });
  }

  const members = await fetchAllBoardMembers();
  return NextResponse.json({ members }, {
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
    const { id, name, role, category, imageUrl, bio, isActive } = body;

    if (!name || !role || !category) {
      return NextResponse.json({ error: 'Name, role, and category are required' }, { status: 400 });
    }

    const memberId = id || (typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `board-${Date.now()}`);
    const db = getDb();

    if (db) {
      await db
        .insert(schema.boardMembers)
        .values({
          id: memberId,
          name: name.trim(),
          role: role.trim(),
          category,
          imageUrl: imageUrl || 'default_avatar',
          bio: bio || '',
          isActive: isActive ?? true,
          tenureYear: '2026',
        })
        .onConflictDoUpdate({
          target: schema.boardMembers.id,
          set: {
            name: name.trim(),
            role: role.trim(),
            category,
            imageUrl: imageUrl || 'default_avatar',
            bio: bio || '',
            isActive: isActive ?? true,
            updatedAt: new Date().toISOString(),
          },
        });
    }

    return NextResponse.json({
      success: true,
      member: { id: memberId, name, role, category, imageUrl, bio },
    });
  } catch (error) {
    console.error('Save member error:', error);
    return NextResponse.json({ error: 'Failed to update board member' }, { status: 500 });
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
      return NextResponse.json({ error: 'Member ID required' }, { status: 400 });
    }

    const db = getDb();
    if (db) {
      await db.delete(schema.boardMembers).where(eq(schema.boardMembers.id, id));
    }

    return NextResponse.json({ success: true, message: `Member ${id} removed` });
  } catch (error) {
    console.error('Delete member error:', error);
    return NextResponse.json({ error: 'Failed to delete member' }, { status: 500 });
  }
}
