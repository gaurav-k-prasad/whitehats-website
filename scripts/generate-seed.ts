import fs from 'fs';
import path from 'path';
import { generateSeedSql } from '../src/db/seed';

async function main() {
  console.log('Generating sanitized seed SQL for Cloudflare D1...');
  const sql = await generateSeedSql();
  const outPath = path.join(process.cwd(), 'drizzle', 'seed.sql');
  fs.writeFileSync(outPath, sql, 'utf8');
  console.log(`[✓] Content seed SQL created at: ${outPath}`);
}

main().catch((err) => {
  console.error('Error generating seed SQL:', err);
  process.exit(1);
});
