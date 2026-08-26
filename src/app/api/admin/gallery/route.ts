/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';
import { getAdminSessionFromRequest } from '@/lib/auth';
import { fetchAllGalleryItems, getDb } from '@/lib/db';
import * as schema from '@/db/schema';
import { eq } from 'drizzle-orm';
import { uploadBufferToCloudinary, deleteFromCloudinary, deleteMultipleFromCloudinary } from '@/lib/cloudinary-server';
import { revalidateTag, revalidatePath } from 'next/cache';

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

  const uploadedPublicIds: string[] = [];

  try {
    const contentType = request.headers.get('content-type') || '';
    let isBulk = false;
    let title = '';
    let quote = '';
    let date = '';
    let year: '2024' | '2025' | '2026' = '2026';
    let category: 'CTFs' | 'WORKSHOPS' | 'HACKATHONS' | 'BEHIND THE SCENES' = 'CTFs';
    let tags: string[] = [];
    let width = 600;
    let height = 400;
    let aspectClass = 'aspect-[3/2]';
    let singleId: string | null = null;
    let singleImageUrl = '';
    let filesToUpload: File[] = [];

    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      isBulk = formData.get('isBulk') === 'true';
      singleId = (formData.get('id') as string) || null;
      title = (formData.get('title') as string) || '';
      quote = (formData.get('quote') as string) || '';
      date = (formData.get('date') as string) || '';
      year = (formData.get('year') as any) || '2026';
      category = (formData.get('category') as any) || 'CTFs';
      singleImageUrl = (formData.get('imageUrl') as string) || '';
      width = parseInt(formData.get('width') as string, 10) || 600;
      height = parseInt(formData.get('height') as string, 10) || 400;
      aspectClass = (formData.get('aspectClass') as string) || 'aspect-[3/2]';

      const rawTags = formData.get('tags') as string;
      tags = rawTags ? rawTags.split(',').map((t) => t.trim()).filter(Boolean) : ['Security'];

      // Extract single or multiple files
      const allFiles = formData.getAll('files');
      if (allFiles && allFiles.length > 0) {
        filesToUpload = allFiles.filter(
          (f) => typeof f === 'object' && 'arrayBuffer' in f && (f as File).size > 0
        ) as File[];
      } else {
        const singleFile = formData.get('imageFile');
        if (singleFile && typeof singleFile === 'object' && 'arrayBuffer' in singleFile && (singleFile as File).size > 0) {
          filesToUpload = [singleFile as File];
        }
      }
    } else {
      const body = await request.json();
      singleId = body.id || null;
      title = body.title || '';
      quote = body.quote || '';
      date = body.date || '';
      year = body.year || '2026';
      category = body.category || 'CTFs';
      singleImageUrl = body.imageUrl || '';
      width = body.width || 600;
      height = body.height || 400;
      aspectClass = body.aspectClass || 'aspect-[3/2]';
      tags = Array.isArray(body.tags) ? body.tags : typeof body.tags === 'string' ? body.tags.split(',').map((t: string) => t.trim()).filter(Boolean) : ['Security'];
    }

    if (!title.trim() || !category) {
      return NextResponse.json({ error: 'Title and category are required' }, { status: 400 });
    }

    const db = getDb();

    // =========================================================================
    // CASE 1: Bulk Multi-Image Upload
    // =========================================================================
    if (isBulk && filesToUpload.length > 0) {
      // 1. Upload all files to Cloudinary in parallel
      const uploadPromises = filesToUpload.map(async (file, idx) => {
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const result = await uploadBufferToCloudinary(buffer, {
          folder: 'gallery',
          tags: ['whitehats', 'gallery', category.toLowerCase()],
        });
        uploadedPublicIds.push(result.publicId);
        return {
          id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `gallery-${Date.now()}-${idx}`,
          title: title.trim(),
          quote: quote || '',
          date: date || '',
          year,
          category,
          tags,
          imageUrl: result.publicId,
          width: result.width || width,
          height: result.height || height,
          aspectClass,
        };
      });

      const newGalleryItems = await Promise.all(uploadPromises);

      // 2. Insert all items into database
      if (db) {
        for (const item of newGalleryItems) {
          await db.insert(schema.galleryItems).values(item);
        }
      }

      try {
        revalidateTag('gallery', { expire: 0 });
        revalidateTag('gallery-items', { expire: 0 });
        revalidatePath('/gallery');
        revalidatePath('/api/gallery');
      } catch {}

      return NextResponse.json({
        success: true,
        count: newGalleryItems.length,
        items: newGalleryItems,
      });
    }

    // =========================================================================
    // CASE 2: Single Image Upload or Edit
    // =========================================================================
    let finalImageUrl = singleImageUrl;
    if (filesToUpload.length > 0) {
      const file = filesToUpload[0];
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const result = await uploadBufferToCloudinary(buffer, {
        folder: 'gallery',
        tags: ['whitehats', 'gallery', category.toLowerCase()],
      });
      finalImageUrl = result.publicId;
      uploadedPublicIds.push(result.publicId);
      if (result.width) width = result.width;
      if (result.height) height = result.height;
    }

    if (!finalImageUrl) {
      return NextResponse.json({ error: 'Image file or Cloudinary Public ID is required' }, { status: 400 });
    }

    const itemId = singleId || (typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `gallery-${Date.now()}`);

    if (db) {
      await db
        .insert(schema.galleryItems)
        .values({
          id: itemId,
          title: title.trim(),
          quote: quote || '',
          date: date || '',
          year,
          category,
          tags,
          imageUrl: finalImageUrl,
          width,
          height,
          aspectClass,
        })
        .onConflictDoUpdate({
          target: schema.galleryItems.id,
          set: {
            title: title.trim(),
            quote: quote || '',
            date: date || '',
            year,
            category,
            tags,
            imageUrl: finalImageUrl,
            width,
            height,
            aspectClass,
          },
        });
    }

    try {
      revalidateTag('gallery', { expire: 0 });
      revalidateTag('gallery-items', { expire: 0 });
      revalidatePath('/gallery');
      revalidatePath('/api/gallery');
    } catch {}

    return NextResponse.json({
      success: true,
      item: { id: itemId, title, category, imageUrl: finalImageUrl },
    });
  } catch (error: any) {
    console.error('[Admin Gallery API Error]:', error);

    // Rollback: delete all uploaded Cloudinary assets if DB operation failed
    if (uploadedPublicIds.length > 0) {
      console.warn(`[Cloudinary Rollback] Deleting ${uploadedPublicIds.length} gallery assets due to failure`);
      await deleteMultipleFromCloudinary(uploadedPublicIds);
    }

    return NextResponse.json(
      { error: error?.message || 'Failed to save gallery item.' },
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
      return NextResponse.json({ error: 'Item ID required' }, { status: 400 });
    }

    const db = getDb();
    if (db) {
      // Find existing record to delete Cloudinary asset
      const existing = await db
        .select()
        .from(schema.galleryItems)
        .where(eq(schema.galleryItems.id, id))
        .limit(1);

      const itemToDelete = existing?.[0];
      if (itemToDelete?.imageUrl) {
        const isExternalOrData =
          itemToDelete.imageUrl.startsWith('data:') ||
          itemToDelete.imageUrl.startsWith('http');
        if (!isExternalOrData) {
          await deleteFromCloudinary(itemToDelete.imageUrl);
        }
      }

      await db.delete(schema.galleryItems).where(eq(schema.galleryItems.id, id));
    }

    try {
      revalidateTag('gallery', { expire: 0 });
      revalidateTag('gallery-items', { expire: 0 });
      revalidatePath('/gallery');
      revalidatePath('/api/gallery');
    } catch {}

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete gallery item error:', error);
    return NextResponse.json({ error: 'Failed to delete gallery item' }, { status: 500 });
  }
}
