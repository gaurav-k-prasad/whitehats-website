import fs from 'fs';
import path from 'path';
import Database from 'better-sqlite3';
import { generateSeedSql } from '../src/db/seed';

async function main() {
  console.log('Generating seed SQL with current application data...');
  const sql = await generateSeedSql();
  const outPath = path.join(process.cwd(), 'drizzle', 'seed.sql');
  fs.writeFileSync(outPath, sql, 'utf8');
  console.log(`[✓] Seed SQL generated at: ${outPath}`);

  // Find local miniflare SQLite database
  const wranglerDir = path.join(process.cwd(), '.wrangler', 'state', 'v3', 'd1', 'miniflare-D1DatabaseObject');
  if (fs.existsSync(wranglerDir)) {
    const files = fs.readdirSync(wranglerDir);
    const sqliteFile = files.find((f) => f.endsWith('.sqlite') && f !== 'metadata.sqlite');
    if (sqliteFile) {
      const fullPath = path.join(wranglerDir, sqliteFile);
      console.log(`Applying seed directly to local SQLite database: ${sqliteFile}`);
      const db = new Database(fullPath);
      db.exec(sql);
      db.close();
      console.log('[✓] Successfully applied current data into local SQLite database.');
    } else {
      console.warn('Could not find primary .sqlite database file in miniflare directory.');
    }
  } else {
    console.warn('.wrangler state directory not found.');
  }
}

main().catch((err) => {
  console.error('Error applying local seed:', err);
  process.exit(1);
});
