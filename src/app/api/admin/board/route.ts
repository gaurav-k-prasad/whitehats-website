/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';
import { getAdminSessionFromRequest } from '@/lib/auth';
import { fetchAllBoardMembers, getDb } from '@/lib/db';
import * as schema from '@/db/schema';
import { eq } from 'drizzle-orm';
import { uploadBufferToCloudinary, deleteFromCloudinary } from '@/lib/cloudinary-server';
import { revalidateTag, revalidatePath } from 'next/cache';

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

  let uploadedPublicId: string | null = null;

  try {
    const contentType = request.headers.get('content-type') || '';
    let id: string | null = null;
    let name = '';
    let role = '';
    let category: 'Core Leadership' | 'Vice Leadership' | 'Domain Heads' = 'Domain Heads';
    let bio = '';
    let isActive = true;
    let imageUrl = '';
    let imageFile: File | null = null;

    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      id = (formData.get('id') as string) || null;
      name = (formData.get('name') as string) || '';
      role = (formData.get('role') as string) || '';
      category = (formData.get('category') as any) || 'Domain Heads';
      bio = (formData.get('bio') as string) || '';
      imageUrl = (formData.get('imageUrl') as string) || '';
      isActive = formData.get('isActive') !== 'false';

      const file = formData.get('imageFile');
      if (file && typeof file === 'object' && 'arrayBuffer' in file && (file as File).size > 0) {
        imageFile = file as File;
      }
    } else {
      const body = await request.json();
      id = body.id || null;
      name = body.name || '';
      role = body.role || '';
      category = body.category || '';
      bio = body.bio || '';
      imageUrl = body.imageUrl || '';
      isActive = body.isActive !== false;
    }

    if (!name.trim() || !role.trim() || !category.trim()) {
      return NextResponse.json({ error: 'Name, role, and category are required' }, { status: 400 });
    }

    // 1. If an image file was provided, upload to Cloudinary
    if (imageFile) {
      const arrayBuffer = await imageFile.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const uploadResult = await uploadBufferToCloudinary(buffer, {
        folder: 'board',
        tags: ['whitehats', 'board', category],
      });
      imageUrl = uploadResult.publicId;
      uploadedPublicId = uploadResult.publicId;
    }

    const memberId = id || (typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `board-${Date.now()}`);
    const db = getDb();

    // 2. Database Insert / Update
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
          isActive: isActive,
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
            isActive: isActive,
            tenureYear: '2026',
          },
        });
    }

    try {
      revalidateTag('board', { expire: 0 });
      revalidateTag('board-members', { expire: 0 });
      revalidatePath('/board');
      revalidatePath('/api/board');
    } catch {}

    return NextResponse.json({
      success: true,
      member: { id: memberId, name, role, category, imageUrl },
    });
  } catch (error: any) {
    console.error('[Admin Board API Error]:', error);

    // Rollback: delete uploaded Cloudinary asset if DB operation failed
    if (uploadedPublicId) {
      console.warn(`[Cloudinary Rollback] Deleting asset ${uploadedPublicId} due to failure`);
      await deleteFromCloudinary(uploadedPublicId);
    }

    return NextResponse.json(
      { error: error?.message || 'Failed to save board member.' },
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
      return NextResponse.json({ error: 'Member ID is required' }, { status: 400 });
    }

    const db = getDb();
    if (db) {
      // Find existing record to delete Cloudinary asset
      const existing = await db
        .select()
        .from(schema.boardMembers)
        .where(eq(schema.boardMembers.id, id))
        .limit(1);

      const memberToDelete = existing?.[0];
      if (memberToDelete?.imageUrl) {
        const isExternalOrData =
          memberToDelete.imageUrl.startsWith('data:') ||
          memberToDelete.imageUrl.startsWith('http');
        if (!isExternalOrData) {
          await deleteFromCloudinary(memberToDelete.imageUrl);
        }
      }

      await db.delete(schema.boardMembers).where(eq(schema.boardMembers.id, id));
    }

    try {
      revalidateTag('board', { expire: 0 });
      revalidateTag('board-members', { expire: 0 });
      revalidatePath('/board');
      revalidatePath('/api/board');
    } catch {}

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete board member error:', error);
    return NextResponse.json({ error: 'Failed to delete board member' }, { status: 500 });
  }
}
