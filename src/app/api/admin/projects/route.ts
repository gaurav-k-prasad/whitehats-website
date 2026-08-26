import { NextResponse } from 'next/server';
import { getAdminSessionFromRequest } from '@/lib/auth';
import { getDb } from '@/lib/db';
import * as schema from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(request: Request) {
  const session = await getAdminSessionFromRequest(request);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized: Admin session required' }, { status: 401 });
  }

  const db = getDb();
  if (!db) {
    return NextResponse.json({ projects: [] });
  }

  try {
    const records = await db.select().from(schema.projects);
    return NextResponse.json({ projects: records || [] });
  } catch (err) {
    console.warn('D1 projects read failed:', err);
    return NextResponse.json({ projects: [] });
  }
}

export async function POST(request: Request) {
  const session = await getAdminSessionFromRequest(request);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized: Admin session required' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { id, name, visibility, status, description, iconType, techStack, contributors, githubUrl, liveDemoUrl } = body;

    if (!name || !status || !githubUrl) {
      return NextResponse.json({ error: 'Name, status, and githubUrl are required' }, { status: 400 });
    }

    const projectId = id || (typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `project-${Date.now()}`);
    const slug = projectId;
    const parsedTech = Array.isArray(techStack) ? techStack : typeof techStack === 'string' ? techStack.split(',').map((t: string) => t.trim()) : [];

    const db = getDb();
    if (db) {
      await db
        .insert(schema.projects)
        .values({
          id: projectId,
          slug,
          name: name.trim(),
          visibility: visibility || 'Public',
          status,
          description: description || '',
          iconType: iconType || 'terminal',
          techStack: parsedTech,
          contributors: contributors ? Number(contributors) : 1,
          githubUrl: githubUrl.trim(),
          liveDemoUrl: liveDemoUrl ? liveDemoUrl.trim() : null,
        })
        .onConflictDoUpdate({
          target: schema.projects.id,
          set: {
            name: name.trim(),
            visibility: visibility || 'Public',
            status,
            description: description || '',
            iconType: iconType || 'terminal',
            techStack: parsedTech,
            contributors: contributors ? Number(contributors) : 1,
            githubUrl: githubUrl.trim(),
            liveDemoUrl: liveDemoUrl ? liveDemoUrl.trim() : null,
          },
        });
    }

    return NextResponse.json({ success: true, project: { id: projectId, name, status } });
  } catch (error) {
    console.error('Save project error:', error);
    return NextResponse.json({ error: 'Failed to save project repository' }, { status: 500 });
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

    return NextResponse.json({ success: true, message: `Project ${id} removed` });
  } catch (error) {
    console.error('Delete project error:', error);
    return NextResponse.json({ error: 'Failed to delete project' }, { status: 500 });
  }
}
