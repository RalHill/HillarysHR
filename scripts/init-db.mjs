import { neon } from "@neondatabase/serverless";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const envPath = join(__dirname, "..", ".env.local");
const env = Object.fromEntries(
  readFileSync(envPath, "utf8")
    .split("\n")
    .filter((l) => l && !l.startsWith("#"))
    .map((l) => {
      const eq = l.indexOf("=");
      return [l.slice(0, eq).trim(), l.slice(eq + 1).trim().replace(/^["']|["']$/g, "")];
    })
);
const url = env.DATABASE_URL;
if (!url) throw new Error("DATABASE_URL not found in .env.local");
const sql = neon(url);

await sql`
  CREATE TABLE IF NOT EXISTS news_items (
    id          SERIAL PRIMARY KEY,
    source      TEXT NOT NULL,
    source_short TEXT NOT NULL,
    headline    TEXT NOT NULL,
    summary     TEXT,
    editor_note TEXT DEFAULT '',
    url         TEXT,
    pub_date    TIMESTAMPTZ NOT NULL,
    provinces   TEXT[],
    topic       TEXT,
    urgency     TEXT DEFAULT 'low',
    source_id   TEXT UNIQUE,
    created_at  TIMESTAMPTZ DEFAULT NOW()
  )
`;
await sql`CREATE INDEX IF NOT EXISTS idx_news_pub_date ON news_items (pub_date DESC)`;
await sql`CREATE INDEX IF NOT EXISTS idx_news_topic ON news_items (topic)`;
await sql`CREATE INDEX IF NOT EXISTS idx_news_urgency ON news_items (urgency)`;
await sql`
  CREATE TABLE IF NOT EXISTS subscribers (
    id         SERIAL PRIMARY KEY,
    email      TEXT UNIQUE NOT NULL,
    confirmed  BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
  )
`;
console.log("Schema created.");
process.exit(0);
