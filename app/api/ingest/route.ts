// app/api/ingest/route.ts
// The nightly cron endpoint. Fetches all RSS sources, summarizes new items
// via OpenRouter Llama, and stores them in Neon Postgres.
//
// Called automatically by Vercel Cron (see vercel.json).
// Can also be triggered manually: POST /api/ingest with Authorization header.

import { NextRequest, NextResponse } from "next/server";
import { RSS_SOURCES } from "@/lib/sources";
import { fetchAllFeeds } from "@/lib/rss";
import { summarizeItems } from "@/lib/summarize";
import { itemExists, insertNewsItem } from "@/lib/db";

export const maxDuration = 300; // 5 minute timeout — needed for large ingest runs

export async function POST(req: NextRequest) {
  // Verify cron secret so only Vercel (or you manually) can trigger this
  const auth = req.headers.get("authorization");
  const expectedSecret = `Bearer ${process.env.CRON_SECRET}`;

  if (auth !== expectedSecret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const startTime = Date.now();
  const stats = {
    fetched: 0,
    new: 0,
    skipped: 0,
    filtered: 0,
    errors: 0,
    rssErrors: [] as string[],
  };

  console.log("[Ingest] Starting nightly ingest run...");

  // ── Step 1: Fetch all RSS feeds ─────────────────────────────────────────
  const { items: rawItems, errors: rssErrors } = await fetchAllFeeds(RSS_SOURCES);

  stats.fetched = rawItems.length;
  stats.rssErrors = rssErrors.map((e) => `${e.source}: ${e.error}`);

  if (rssErrors.length > 0) {
    console.warn(`[Ingest] ${rssErrors.length} RSS feed(s) failed to fetch`);
  }

  // ── Content Quality Filter ──────────────────────────────────────────────
  const lowValuePatterns = [
    /partner content/i,
    /sponsored/i,
    /supplier guide/i,
    /award nominee/i,
    /award winner/i,
    /spotlight on/i,
    /self-care/i,
    /resilience tips/i,
    /wellness tips/i,
    /7 tips/i,
    /five tips/i,
    /ten tips/i,
  ];

  const qualityItems = rawItems.filter((item) => {
    // Check title and content for low-value patterns
    const titleAndContent = `${item.title} ${item.content}`.toLowerCase();
    const hasLowValuePattern = lowValuePatterns.some((pattern) =>
      pattern.test(titleAndContent)
    );

    // Check minimum content length (after cleaning)
    const hasEnoughContent = item.content.length >= 150;

    return !hasLowValuePattern && hasEnoughContent;
  });

  const filteredCount = rawItems.length - qualityItems.length;
  stats.filtered = filteredCount;
  console.log(`[Ingest] Filtered out ${filteredCount} low-value items`);

  // ── Step 2: Filter to only NEW items (not already in DB) ────────────────
  const newItems = [];
  for (const item of qualityItems) {
    const exists = await itemExists(item.guid);
    if (exists) {
      stats.skipped++;
    } else {
      newItems.push(item);
    }
  }

  console.log(
    `[Ingest] ${newItems.length} new items to process (${stats.skipped} already in DB)`
  );

  if (newItems.length === 0) {
    return NextResponse.json({
      message: "No new items to process",
      stats,
      durationMs: Date.now() - startTime,
    });
  }

  // Free tier rate limit: 200 req/day. Cap each run at 190 to leave headroom.
  const itemsToProcess = newItems.slice(0, 190);
  if (newItems.length > 190) {
    console.warn(
      `[Ingest] Capping at 190 items (${newItems.length} available) due to free tier limits`
    );
  }

  // ── Step 3: Summarize via OpenRouter Llama ──────────────────────────────
  const processedItems = await summarizeItems(
    itemsToProcess,
    (done, total) => {
      if (done % 10 === 0 || done === total) {
        console.log(`[Ingest] Summarized ${done}/${total} items`);
      }
    }
  );

  // ── Step 4: Save to Neon Postgres ───────────────────────────────────────
  for (const item of processedItems) {
    try {
      await insertNewsItem({
        source: item.sourceName,
        sourceShort: item.sourceShort,
        headline: item.headline,
        summary: item.summary,
        editorNote: item.editorNote,
        url: item.link,
        pubDate: item.pubDate,
        provinces: item.provinces,
        topic: item.topic,
        urgency: item.urgency,
        sourceId: item.guid,
      });
      stats.new++;
    } catch (error) {
      console.error(`[Ingest] DB insert error for "${item.headline}":`, error);
      stats.errors++;
    }
  }

  const duration = Date.now() - startTime;
  console.log(
    `[Ingest] Done. ${stats.new} inserted, ${stats.skipped} skipped, ${stats.errors} errors. ${duration}ms`
  );

  return NextResponse.json({
    message: "Ingest complete",
    stats,
    durationMs: duration,
  });
}

// GET: Vercel Cron invokes this path with GET and Authorization: Bearer <CRON_SECRET>
// (see https://vercel.com/docs/cron-jobs/manage-cron-jobs#securing-cron-jobs).
// Also allow ?secret= for manual browser testing.
export async function GET(req: NextRequest) {
  const auth = req.headers.get("authorization");
  const expectedBearer = `Bearer ${process.env.CRON_SECRET}`;
  const querySecret = req.nextUrl.searchParams.get("secret");
  const ok =
    auth === expectedBearer ||
    (querySecret != null && querySecret === process.env.CRON_SECRET);
  if (!ok) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  // Reuse POST logic via a fake request
  return POST(
    new NextRequest(req.url, {
      method: "POST",
      headers: { authorization: `Bearer ${process.env.CRON_SECRET}` },
    })
  );
}
