import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import { eq } from 'drizzle-orm';
import fs from 'fs';
import path from 'path';
import * as schema from '@/db/schema';
import { sortEventsDescending, ClubEvent } from '@/data/eventsData';
import { BoardMember } from '@/data/boardData';
import { GalleryItem } from '@/data/galleryData';
import { ProjectRepository } from '@/data/projectsData';
import { AboutStat } from '@/data/aboutData';

interface CloudflareRuntimeEnv {
  DB?: unknown;
}

/**
 * Universal Database Getter:
 * 1. Checks for Cloudflare D1 runtime binding (in production/preview on Cloudflare Pages/Workers)
 * 2. If null (in standard Node.js Next.js dev server), connects directly to local SQLite database in .wrangler
 */
export function getDb() {
  const env = process.env as unknown as CloudflareRuntimeEnv;

  // Cloudflare Pages / Workers runtime binding
  if (env.DB) {
    return env.DB as ReturnType<typeof drizzle>;
  }
  if (typeof globalThis !== 'undefined' && 'DB' in globalThis) {
    return (globalThis as unknown as { DB: ReturnType<typeof drizzle> }).DB;
  }

  // Node.js Local Dev Server Fallback -> read from local miniflare SQLite file
  try {
    const wranglerDir = path.join(process.cwd(), '.wrangler', 'state', 'v3', 'd1', 'miniflare-D1DatabaseObject');
    if (fs.existsSync(wranglerDir)) {
      const files = fs.readdirSync(wranglerDir);
      const sqliteFile = files.find((f) => f.endsWith('.sqlite'));
      if (sqliteFile) {
        const fullPath = path.join(wranglerDir, sqliteFile);
        const sqlite = new Database(fullPath);
        return drizzle(sqlite, { schema });
      }
    }
  } catch (e) {
    console.warn('[Local DB Bridge] Unable to open local SQLite file:', e);
  }

  return null;
}

/**
 * Database fetchers: return database records directly; return empty array if not found.
 */
export async function fetchAllBoardMembers(): Promise<BoardMember[]> {
  const db = getDb();
  if (!db) return [];

  try {
    const records = await db.select().from(schema.boardMembers).where(eq(schema.boardMembers.isActive, true));
    return (records as unknown as BoardMember[]) || [];
  } catch (err) {
    console.warn('[D1] Board members query error:', err);
    return [];
  }
}

export async function fetchAllEvents(): Promise<ClubEvent[]> {
  const db = getDb();
  if (!db) return [];

  try {
    const records = await db.select().from(schema.events);
    if (records && records.length > 0) {
      return sortEventsDescending(records as unknown as ClubEvent[]);
    }
    return [];
  } catch (err) {
    console.warn('[D1] Events query error:', err);
    return [];
  }
}

export async function fetchAllGalleryItems(): Promise<GalleryItem[]> {
  const db = getDb();
  if (!db) return [];

  try {
    const records = await db.select().from(schema.galleryItems);
    return (records as unknown as GalleryItem[]) || [];
  } catch (err) {
    console.warn('[D1] Gallery items query error:', err);
    return [];
  }
}

export async function fetchAllProjects(): Promise<ProjectRepository[]> {
  const db = getDb();
  if (!db) return [];

  try {
    const records = await db.select().from(schema.projects);
    return (records as unknown as ProjectRepository[]) || [];
  } catch (err) {
    console.warn('[D1] Projects query error:', err);
    return [];
  }
}

export async function fetchAllClubStats(): Promise<AboutStat[]> {
  const db = getDb();
  if (!db) return [];

  try {
    const records = await db.select().from(schema.clubStats);
    if (records && records.length > 0) {
      return records.map((r) => ({ label: r.label, value: r.value }));
    }
    return [];
  } catch (err) {
    console.warn('[D1] Club stats query error:', err);
    return [];
  }
}
