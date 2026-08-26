import { drizzle as drizzleSqlite } from 'drizzle-orm/better-sqlite3';
import { drizzle as drizzleD1 } from 'drizzle-orm/d1';
import { drizzle as drizzleProxy } from 'drizzle-orm/sqlite-proxy';
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

let cachedHttpDb: ReturnType<typeof drizzleProxy> | null = null;
let cachedLocalDb: ReturnType<typeof drizzleSqlite> | null = null;

function createD1HttpClient(accountId: string, databaseId: string, apiToken: string) {
  const endpoint = `https://api.cloudflare.com/client/v4/accounts/${accountId}/d1/database/${databaseId}/query`;

  return drizzleProxy(
    async (sql, params, method) => {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sql,
          params,
        }),
        cache: 'no-store',
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(`Cloudflare D1 HTTP Error (${res.status}): ${errText}`);
      }

      const data = (await res.json()) as {
        success: boolean;
        errors?: { message: string }[];
        result?: { results?: Record<string, unknown>[] }[];
      };

      if (!data.success) {
        const errMsg = data.errors?.[0]?.message || 'Cloudflare D1 query execution failed';
        throw new Error(`Cloudflare D1 Error: ${errMsg}`);
      }

      const results = data.result?.[0]?.results || [];

      if (method === 'run') {
        return { rows: [] };
      }

      if (method === 'get') {
        return { rows: results[0] ? Object.values(results[0]) : [] };
      }

      return { rows: results.map((row) => Object.values(row)) };
    },
    { schema }
  );
}

/**
 * Universal Database Getter:
 * 1. Checks for Cloudflare D1 native runtime binding (when on Cloudflare Pages / Workers)
 * 2. Checks for Cloudflare D1 HTTP REST API token (when on Vercel / Node.js production)
 * 3. Falls back to local Miniflare SQLite database in .wrangler (during local dev)
 */
export function getDb() {
  const env = process.env as unknown as Record<string, string | undefined>;

  // 1. Cloudflare Pages / Workers runtime binding
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

  // 2. Cloudflare D1 HTTP REST API (for Vercel / Node.js production)
  const apiToken = env?.CLOUDFLARE_API_TOKEN || env?.CLOUDFLARE_D1_TOKEN || env?.D1_API_TOKEN;
  if (apiToken) {
    if (cachedHttpDb) return cachedHttpDb as unknown as ReturnType<typeof drizzleSqlite>;
    const accountId = env?.CLOUDFLARE_ACCOUNT_ID || 'e7993b8aa801e596c33ed3f95657b016';
    const databaseId = env?.CLOUDFLARE_DATABASE_ID || 'fa253fd9-1bb9-48d7-82c7-e70f0a79a2be';
    cachedHttpDb = createD1HttpClient(accountId.trim(), databaseId.trim(), apiToken.trim());
    return cachedHttpDb as unknown as ReturnType<typeof drizzleSqlite>;
  }

  // 3. Return cached local SQLite DB if already connected
  if (cachedLocalDb) {
    return cachedLocalDb;
  }

  // 4. Node.js Local Dev Server Fallback -> read from local miniflare SQLite file
  try {
    const wranglerDir = path.join(process.cwd(), '.wrangler', 'state', 'v3', 'd1', 'miniflare-D1DatabaseObject');
    if (fs.existsSync(wranglerDir)) {
      const files = fs.readdirSync(wranglerDir);
      const sqliteFile = files.find((f) => f.endsWith('.sqlite') && f !== 'metadata.sqlite');
      if (sqliteFile) {
        const fullPath = path.join(wranglerDir, sqliteFile);
        const sqlite = new Database(fullPath);
        cachedLocalDb = drizzleSqlite(sqlite, { schema });
        return cachedLocalDb;
      }
    }
  } catch (e) {
    console.error('[Local DB Bridge] Error initializing local SQLite database:', e);
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
