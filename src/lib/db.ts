import { drizzle as drizzleSqlite } from 'drizzle-orm/better-sqlite3';
import { drizzle as drizzleD1 } from 'drizzle-orm/d1';
import Database from 'better-sqlite3';
import { eq } from 'drizzle-orm';
import fs from 'fs';
import path from 'path';
import * as schema from '@/db/schema';
import { sortEventsDescending, ClubEvent, EVENTS_DATA } from '@/data/eventsData';
import { BoardMember, BOARD_DATA } from '@/data/boardData';
import { GalleryItem, GALLERY_ITEMS } from '@/data/galleryData';
import { ProjectRepository, PROJECTS_DATA } from '@/data/projectsData';
import { AboutStat, ABOUT_STATS } from '@/data/aboutData';

/**
 * Universal Database Getter:
 * 1. Checks for Cloudflare D1 runtime binding (in production/preview on Cloudflare Pages/Workers)
 * 2. If null (in standard Node.js Next.js dev server), connects directly to local SQLite database in .wrangler
 */
export function getDb() {
  const env = process.env as unknown as Record<string, unknown>;

  // Cloudflare Pages / Workers runtime binding (checks DB, whitehats_prod_db, and global bindings)
  const g = typeof globalThis !== 'undefined' ? (globalThis as Record<string, unknown>) : {};
  const gEnv = (g.__env__ || g.__cf_env__ || g.env || {}) as Record<string, unknown>;

  const rawD1 =
    env?.DB ||
    env?.whitehats_prod_db ||
    env?.DATABASE ||
    g?.DB ||
    g?.whitehats_prod_db ||
    gEnv?.DB ||
    gEnv?.whitehats_prod_db;

  if (rawD1) {
    if (typeof (rawD1 as { select?: unknown }).select === 'function') {
      return rawD1 as ReturnType<typeof drizzleSqlite>;
    }
    try {
      return drizzleD1(rawD1 as Parameters<typeof drizzleD1>[0], { schema }) as unknown as ReturnType<typeof drizzleSqlite>;
    } catch (e) {
      console.warn('[D1 Bridge] Unable to wrap Cloudflare D1 instance:', e);
    }
  }

  // Node.js Local Dev Server Fallback -> read from local miniflare SQLite file
  try {
    const wranglerDir = path.join(process.cwd(), '.wrangler', 'state', 'v3', 'd1', 'miniflare-D1DatabaseObject');
    if (fs.existsSync(wranglerDir)) {
      const files = fs.readdirSync(wranglerDir);
      const sqliteFile = files.find((f) => f.endsWith('.sqlite') && f !== 'metadata.sqlite');
      if (sqliteFile) {
        const fullPath = path.join(wranglerDir, sqliteFile);
        const sqlite = new Database(fullPath);
        return drizzleSqlite(sqlite, { schema });
      }
    }
  } catch (e) {
    console.warn('[Local DB Bridge] Unable to open local SQLite file:', e);
  }

  return null;
}

import { unstable_cache } from 'next/cache';

/**
 * Database fetchers: cached via Next.js built-in Data Cache with tag-based revalidation.
 * Fallback to static data if database is unpopulated or unavailable.
 */
async function queryBoardMembers(): Promise<BoardMember[]> {
  const db = getDb();
  if (db) {
    try {
      const records = await db.select().from(schema.boardMembers).where(eq(schema.boardMembers.isActive, true));
      if (records && records.length > 0) {
        return records as unknown as BoardMember[];
      }
    } catch (err) {
      console.warn('[D1] Board members query error, falling back to static data:', err);
    }
  }
  return BOARD_DATA;
}

export const fetchAllBoardMembers = unstable_cache(
  queryBoardMembers,
  ['whitehats-board-members'],
  { tags: ['board', 'board-members'], revalidate: 3600 }
);

async function queryEvents(): Promise<ClubEvent[]> {
  const db = getDb();
  if (db) {
    try {
      const records = await db.select().from(schema.events);
      if (records && records.length > 0) {
        return sortEventsDescending(records as unknown as ClubEvent[]);
      }
    } catch (err) {
      console.warn('[D1] Events query error, falling back to static data:', err);
    }
  }
  return sortEventsDescending(EVENTS_DATA);
}

export const fetchAllEvents = unstable_cache(
  queryEvents,
  ['whitehats-events'],
  { tags: ['events'], revalidate: 3600 }
);

async function queryGalleryItems(): Promise<GalleryItem[]> {
  const db = getDb();
  if (db) {
    try {
      const records = await db.select().from(schema.galleryItems);
      if (records && records.length > 0) {
        return records as unknown as GalleryItem[];
      }
    } catch (err) {
      console.warn('[D1] Gallery items query error, falling back to static data:', err);
    }
  }
  return GALLERY_ITEMS;
}

export const fetchAllGalleryItems = unstable_cache(
  queryGalleryItems,
  ['whitehats-gallery-items'],
  { tags: ['gallery', 'gallery-items'], revalidate: 3600 }
);

async function queryProjects(): Promise<ProjectRepository[]> {
  const db = getDb();
  if (db) {
    try {
      const records = await db.select().from(schema.projects);
      if (records && records.length > 0) {
        return records as unknown as ProjectRepository[];
      }
    } catch (err) {
      console.warn('[D1] Projects query error, falling back to static data:', err);
    }
  }
  return PROJECTS_DATA;
}

export const fetchAllProjects = unstable_cache(
  queryProjects,
  ['whitehats-projects'],
  { tags: ['projects'], revalidate: 3600 }
);

async function queryClubStats(): Promise<AboutStat[]> {
  const db = getDb();
  if (db) {
    try {
      const records = await db.select().from(schema.clubStats);
      if (records && records.length > 0) {
        return records.map((r) => ({ label: r.label, value: r.value }));
      }
    } catch (err) {
      console.warn('[D1] Club stats query error, falling back to static data:', err);
    }
  }
  return ABOUT_STATS;
}

export const fetchAllClubStats = unstable_cache(
  queryClubStats,
  ['whitehats-club-stats'],
  { tags: ['stats', 'club-stats'], revalidate: 3600 }
);
