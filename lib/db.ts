// lib/db.ts
// Neon Postgres client + all database operations for Hillary's HR Blog.
// Uses @neondatabase/serverless — works in Next.js Edge and Node runtimes.

import { neon } from "@neondatabase/serverless";

// Lazily initialized so it doesn't error at import time if DATABASE_URL is missing
let _sql: ReturnType<typeof neon> | null = null;

function getSQL() {
  if (!_sql) {
    const url = process.env.DATABASE_URL;
    if (!url) throw new Error("DATABASE_URL environment variable is not set");
    _sql = neon(url);
  }
  return _sql;
}

// ─── Types ────────────────────────────────────────────────────────────────────

export interface NewsItemRow {
  id: number;
  source: string;
  source_short: string;
  headline: string;
  summary: string;
  editor_note: string;
  url: string;
  pub_date: string;
  provinces: string[];
  topic: string;
  urgency: "high" | "medium" | "low";
  source_id: string;
  created_at: string;
}

// ─── Schema Setup ─────────────────────────────────────────────────────────────
// Run this ONCE in Neon's SQL editor to create the table.
// SQL is here for reference — do not call this from the app.
//
// CREATE TABLE IF NOT EXISTS news_items (
//   id          SERIAL PRIMARY KEY,
//   source      TEXT NOT NULL,
//   source_short TEXT NOT NULL,
//   headline    TEXT NOT NULL,
//   summary     TEXT,
//   editor_note TEXT DEFAULT '',
//   url         TEXT,
//   pub_date    TIMESTAMPTZ NOT NULL,
//   provinces   TEXT[],
//   topic       TEXT,
//   urgency     TEXT DEFAULT 'low',
//   source_id   TEXT UNIQUE,
//   created_at  TIMESTAMPTZ DEFAULT NOW()
// );
//
// CREATE INDEX IF NOT EXISTS idx_news_pub_date ON news_items (pub_date DESC);
// CREATE INDEX IF NOT EXISTS idx_news_topic ON news_items (topic);
// CREATE INDEX IF NOT EXISTS idx_news_urgency ON news_items (urgency);

// ─── Queries ──────────────────────────────────────────────────────────────────

/**
 * Check if an item already exists in the DB by its RSS guid.
 * Used for deduplication during ingest.
 */
export async function itemExists(sourceId: string): Promise<boolean> {
  const sql = getSQL();
  const rows = (await sql`
    SELECT id FROM news_items WHERE source_id = ${sourceId} LIMIT 1
  `) as { id: number }[];
  return rows.length > 0;
}

/**
 * Insert a new news item. Ignores conflicts (duplicate source_id).
 */
export async function insertNewsItem(item: {
  source: string;
  sourceShort: string;
  headline: string;
  summary: string;
  editorNote: string;
  url: string;
  pubDate: string;
  provinces: string[];
  topic: string;
  urgency: string;
  sourceId: string;
}): Promise<void> {
  const sql = getSQL();
  await sql`
    INSERT INTO news_items
      (source, source_short, headline, summary, editor_note, url, pub_date, provinces, topic, urgency, source_id)
    VALUES
      (${item.source}, ${item.sourceShort}, ${item.headline}, ${item.summary},
       ${item.editorNote}, ${item.url}, ${item.pubDate}, ${item.provinces},
       ${item.topic}, ${item.urgency}, ${item.sourceId})
    ON CONFLICT (source_id) DO NOTHING
  `;
}

/**
 * Get recent news items for the public feed.
 * Filters to last 14 days. Sorted by urgency then date.
 */
export async function getNewsItems(filters?: {
  topics?: string[];
  provinces?: string[];
  limit?: number;
  daysBack?: number;
}): Promise<NewsItemRow[]> {
  const sql = getSQL();
  const daysBack = filters?.daysBack ?? 14;
  const limit = filters?.limit ?? 60;

  // Build dynamic filter conditions
  const topicFilter = filters?.topics?.length
    ? filters.topics
    : null;

  const provinceFilter = filters?.provinces?.length
    ? filters.provinces
    : null;

  let rows: NewsItemRow[];

  if (topicFilter && provinceFilter) {
    rows = await sql`
      SELECT * FROM news_items
      WHERE pub_date > NOW() - ${daysBack} * INTERVAL '1 day'
        AND topic = ANY(${topicFilter})
        AND provinces && ${provinceFilter}
      ORDER BY
        CASE urgency WHEN 'high' THEN 1 WHEN 'medium' THEN 2 ELSE 3 END,
        pub_date DESC
      LIMIT ${limit}
    ` as NewsItemRow[];
  } else if (topicFilter) {
    rows = await sql`
      SELECT * FROM news_items
      WHERE pub_date > NOW() - ${daysBack} * INTERVAL '1 day'
        AND topic = ANY(${topicFilter})
      ORDER BY
        CASE urgency WHEN 'high' THEN 1 WHEN 'medium' THEN 2 ELSE 3 END,
        pub_date DESC
      LIMIT ${limit}
    ` as NewsItemRow[];
  } else if (provinceFilter) {
    rows = await sql`
      SELECT * FROM news_items
      WHERE pub_date > NOW() - ${daysBack} * INTERVAL '1 day'
        AND provinces && ${provinceFilter}
      ORDER BY
        CASE urgency WHEN 'high' THEN 1 WHEN 'medium' THEN 2 ELSE 3 END,
        pub_date DESC
      LIMIT ${limit}
    ` as NewsItemRow[];
  } else {
    rows = await sql`
      SELECT * FROM news_items
      WHERE pub_date > NOW() - ${daysBack} * INTERVAL '1 day'
      ORDER BY
        CASE urgency WHEN 'high' THEN 1 WHEN 'medium' THEN 2 ELSE 3 END,
        pub_date DESC
      LIMIT ${limit}
    ` as NewsItemRow[];
  }

  return rows;
}

/**
 * Get subscriber emails for the weekly digest.
 */
export async function getSubscribers(): Promise<string[]> {
  const sql = getSQL();
  const rows = await sql`
    SELECT email FROM subscribers WHERE confirmed = true
  ` as { email: string }[];
  return rows.map((r) => r.email);
}

/**
 * Add a subscriber email.
 */
export async function addSubscriber(email: string): Promise<void> {
  const sql = getSQL();
  await sql`
    INSERT INTO subscribers (email, confirmed, created_at)
    VALUES (${email}, true, NOW())
    ON CONFLICT (email) DO NOTHING
  `;
}
