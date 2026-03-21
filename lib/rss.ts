// lib/rss.ts
// Fetches and normalizes RSS/Atom feeds from all sources.
// No API keys required. Pure HTTP fetch + XML parsing.

import Parser from "rss-parser";
import he from "he";
import type { RSSSource } from "./sources";

// rss-parser handles both RSS 2.0 and Atom formats automatically
const parser = new Parser({
  timeout: 10000, // 10 second timeout per feed
  customFields: {
    item: [
      ["content:encoded", "contentEncoded"],
      ["description", "description"],
    ],
  },
});

export interface RawFeedItem {
  guid: string;           // unique ID for deduplication
  title: string;
  link: string;
  pubDate: string;
  content: string;        // best available text content
  sourceName: string;
  sourceShort: string;
  defaultProvinces: string[];
  defaultTopics: string[];
}

export interface FetchResult {
  source: string;
  items: RawFeedItem[];
  error?: string;
}

/**
 * Fetch a single RSS source. Returns empty items array on failure (never throws).
 */
export async function fetchFeed(source: RSSSource): Promise<FetchResult> {
  try {
    const feed = await parser.parseURL(source.url);

    const items: RawFeedItem[] = feed.items.slice(0, 15).map((rawItem) => {
      const item = rawItem as typeof rawItem & { id?: string; url?: string };
      // Pick the best available content field
      const content =
        (item as unknown as Record<string, unknown>).contentEncoded as string ||
        item.content ||
        item.contentSnippet ||
        item.summary ||
        "";

      // Deduplicate by guid, fall back to link, then title
      const guid = item.guid || item.id || item.link || item.title || "";

      return {
        guid,
        title: he.decode(item.title?.trim() || ""),
        link: item.link || item.url || "",
        pubDate: item.pubDate || item.isoDate || new Date().toISOString(),
        content: he.decode(content.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim()),
        sourceName: source.name,
        sourceShort: source.short,
        defaultProvinces: source.provinces,
        defaultTopics: source.topics,
      };
    });

    // Filter out items older than 14 days
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - 14);

    const recentItems = items.filter((item) => {
      const pubDate = new Date(item.pubDate);
      return !isNaN(pubDate.getTime()) && pubDate > cutoff;
    });

    return { source: source.name, items: recentItems };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`[RSS] Failed to fetch ${source.name}: ${message}`);
    return { source: source.name, items: [], error: message };
  }
}

/**
 * Fetch all sources in parallel with a concurrency limit.
 * Returns all items flattened, with fetch errors logged but not thrown.
 */
export async function fetchAllFeeds(
  sources: RSSSource[],
  concurrency = 4
): Promise<{ items: RawFeedItem[]; errors: { source: string; error: string }[] }> {
  const errors: { source: string; error: string }[] = [];
  const allItems: RawFeedItem[] = [];

  // Process in batches to avoid hammering all feeds at once
  for (let i = 0; i < sources.length; i += concurrency) {
    const batch = sources.slice(i, i + concurrency);
    const results = await Promise.all(batch.map(fetchFeed));

    for (const result of results) {
      if (result.error) {
        errors.push({ source: result.source, error: result.error });
      }
      allItems.push(...result.items);
    }

    // Small delay between batches to be polite to servers
    if (i + concurrency < sources.length) {
      await new Promise((r) => setTimeout(r, 500));
    }
  }

  // Remove duplicates by guid across all sources
  const seen = new Set<string>();
  const deduped = allItems.filter((item) => {
    if (seen.has(item.guid)) return false;
    seen.add(item.guid);
    return true;
  });

  console.log(`[RSS] Fetched ${deduped.length} unique items from ${sources.length} sources`);
  return { items: deduped, errors };
}
