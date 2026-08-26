import { NextResponse } from 'next/server';
import { fetchAllProjects } from '@/lib/db';

export async function GET() {
  try {
    const projects = await fetchAllProjects();
    return NextResponse.json({ projects });
  } catch (error) {
    console.error('Public projects API error:', error);
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 });
  }
}
