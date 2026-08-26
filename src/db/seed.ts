import { BOARD_DATA } from '../data/boardData';
import { EVENTS_DATA, sortEventsDescending } from '../data/eventsData';
import { GALLERY_ITEMS } from '../data/galleryData';
import { PROJECTS_DATA } from '../data/projectsData';
import { ABOUT_STATS } from '../data/aboutData';

/**
 * Generates SQL statements to completely wipe and reload all content into Cloudflare D1.
 * Events are sorted in chronological descending order (newest first).
 */
export async function generateSeedSql(): Promise<string> {
  const statements: string[] = [];

  // Clear existing content tables (preserves admin_users and contact_messages)
  statements.push(`
DELETE FROM board_members;
DELETE FROM events;
DELETE FROM gallery_items;
DELETE FROM projects;
DELETE FROM club_stats;
`);

  // 1. Board Members
  for (let i = 0; i < BOARD_DATA.length; i++) {
    const m = BOARD_DATA[i];
    statements.push(`
INSERT INTO board_members (id, name, role, category, image_url, order_index, is_active, tenure_year)
VALUES ('${m.id}', '${m.name.replace(/'/g, "''")}', '${m.role.replace(/'/g, "''")}', '${m.category}', '${m.imageUrl}', ${i}, 1, '2026');
`);
  }

  // 2. Events (Sorted Descending on Date and Time)
  const sortedEvents = sortEventsDescending(EVENTS_DATA);
  for (const e of sortedEvents) {
    const tagsJson = JSON.stringify(e.tags).replace(/'/g, "''");
    const highlightsJson = e.highlights ? JSON.stringify(e.highlights).replace(/'/g, "''") : 'NULL';
    statements.push(`
INSERT INTO events (id, title, type, status, date, time, location, mode, description, tags, highlights, image_url, registration_url)
VALUES ('${e.id}', '${e.title.replace(/'/g, "''")}', '${e.type}', 'UPCOMING', '${e.date}', '${e.time}', '${e.location.replace(/'/g, "''")}', ${e.mode ? `'${e.mode}'` : 'NULL'}, '${e.description.replace(/'/g, "''")}', '${tagsJson}', ${highlightsJson !== 'NULL' ? `'${highlightsJson}'` : 'NULL'}, ${e.imageUrl ? `'${e.imageUrl}'` : 'NULL'}, ${e.registrationUrl ? `'${e.registrationUrl}'` : 'NULL'});
`);
  }

  // 3. Gallery Items
  for (const g of GALLERY_ITEMS) {
    const tagsJson = JSON.stringify(g.tags).replace(/'/g, "''");
    statements.push(`
INSERT INTO gallery_items (id, title, quote, date, year, category, tags, image_url, width, height, aspect_class)
VALUES ('${g.id}', '${g.title.replace(/'/g, "''")}', '${g.quote.replace(/'/g, "''")}', '${g.date}', '${g.year}', '${g.category}', '${tagsJson}', '${g.imageUrl}', ${g.width}, ${g.height}, '${g.aspectClass}');
`);
  }

  // 4. Projects
  for (let i = 0; i < PROJECTS_DATA.length; i++) {
    const p = PROJECTS_DATA[i];
    const techStackJson = JSON.stringify(p.techStack).replace(/'/g, "''");
    statements.push(`
INSERT INTO projects (id, slug, name, visibility, status, description, icon_type, tech_stack, contributors, github_url, order_index)
VALUES ('${p.id}', '${p.id}', '${p.name.replace(/'/g, "''")}', '${p.visibility}', '${p.status}', '${p.description.replace(/'/g, "''")}', '${p.iconType}', '${techStackJson}', ${p.contributors}, '${p.githubUrl}', ${i});
`);
  }

  // 5. Stats
  for (let i = 0; i < ABOUT_STATS.length; i++) {
    const s = ABOUT_STATS[i];
    const key = s.label.toLowerCase().replace(/[^a-z0-9]/g, '_');
    statements.push(`
INSERT INTO club_stats (id, key, label, value, order_index)
VALUES ('stat-${i + 1}', '${key}', '${s.label}', '${s.value}', ${i});
`);
  }

  return statements.join('\n');
}
