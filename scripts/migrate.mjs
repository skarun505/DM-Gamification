import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function run() {
  console.log("Supabase schema migrations have been applied directly via Supabase MCP.");
  console.log("Migration files available in db/migrations/:");
  const files = fs.readdirSync(path.join(__dirname, '../db/migrations'));
  files.forEach(f => console.log(` - ${f}`));
}

run();
