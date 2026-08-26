import { NextResponse } from 'next/server';
import { getAdminSessionFromRequest } from '@/lib/auth';
import { fetchAllProjects, getDb } from '@/lib/db';
import * as schema from '@/db/schema';
import { eq } from 'drizzle-orm';
import { revalidateTag, revalidatePath } from 'next/cache';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: Request) {
  const session = await getAdminSessionFromRequest(request);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized: Admin session required' }, { status: 401 });
  }

  const projects = await fetchAllProjects();
  return NextResponse.json({ projects }, {
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
    const { id, slug, name, visibility, status, description, iconType, techStack, contributors, githubUrl, liveDemoUrl } = body;

    if (!name || !description || !githubUrl) {
      return NextResponse.json({ error: 'Name, description, and githubUrl are required' }, { status: 400 });
    }

    const projectId = id || (typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `proj-${Date.now()}`);
    const projectSlug = slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const parsedTechStack = Array.isArray(techStack) ? techStack : typeof techStack === 'string' ? techStack.split(',').map((t: string) => t.trim()) : [];

    const db = getDb();
    if (db) {
      await db
        .insert(schema.projects)
        .values({
          id: projectId,
          slug: projectSlug,
          name: name.trim(),
          visibility: visibility || 'Public',
          status: status || 'ACTIVE_DEVELOPMENT',
          description: description.trim(),
          iconType: iconType || 'terminal',
          techStack: parsedTechStack,
          contributors: contributors ? Number(contributors) : 1,
          githubUrl: githubUrl.trim(),
          liveDemoUrl: liveDemoUrl ? liveDemoUrl.trim() : null,
        })
        .onConflictDoUpdate({
          target: schema.projects.id,
          set: {
            slug: projectSlug,
            name: name.trim(),
            visibility: visibility || 'Public',
            status: status || 'ACTIVE_DEVELOPMENT',
            description: description.trim(),
            iconType: iconType || 'terminal',
            techStack: parsedTechStack,
            contributors: contributors ? Number(contributors) : 1,
            githubUrl: githubUrl.trim(),
            liveDemoUrl: liveDemoUrl ? liveDemoUrl.trim() : null,
          },
        });
    }

    try {
      revalidateTag('projects', { expire: 0 });
      revalidatePath('/projects');
      revalidatePath('/api/projects');
    } catch {}

    return NextResponse.json({ success: true, project: { id: projectId, name, status } });
  } catch (error) {
    console.error('Save project error:', error);
    return NextResponse.json({ error: 'Failed to save project' }, { status: 500 });
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
      return NextResponse.json({ error: 'Project ID required' }, { status: 400 });
    }

    const db = getDb();
    if (db) {
      await db.delete(schema.projects).where(eq(schema.projects.id, id));
    }

    try {
      revalidateTag('projects', { expire: 0 });
      revalidatePath('/projects');
      revalidatePath('/api/projects');
    } catch {}

    return NextResponse.json({ success: true, message: `Project ${id} removed` });
  } catch (error) {
    console.error('Delete project error:', error);
    return NextResponse.json({ error: 'Failed to delete project' }, { status: 500 });
  }
}
