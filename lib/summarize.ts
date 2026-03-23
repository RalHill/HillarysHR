// lib/summarize.ts
// Summarizes raw RSS items into structured HR intelligence using OpenRouter.
// Uses meta-llama/llama-3.3-70b-instruct:free (zero cost, 200 req/day limit).
// Hillary's voice is defined in the system prompt below — update the examples
// to match your actual writing and the output will sound more like you.

import type { RawFeedItem } from "./rss";

export interface ProcessedItem {
  headline: string;
  summary: string;
  editorNote: string;     // "My Take" — Hillary's voice
  provinces: string[];
  topic: string;
  urgency: "high" | "medium" | "low";
}

// ─── Hillary's Voice System Prompt ───────────────────────────────────────────
// This is the "training" for your voice. It's not ML fine-tuning — it's a
// detailed prompt + real examples. The model reads these and matches the pattern.
//
// HOW TO IMPROVE IT:
// After the pipeline runs, find "My Take" notes that sound off.
// Rewrite them the way you'd actually say it.
// Add the pair to FEW_SHOT_EXAMPLES below. Redeploy. Done.
// 5–10 real examples gets you to ~85% of your actual voice.
// ─────────────────────────────────────────────────────────────────────────────

const HILLARY_VOICE_PROMPT = `You are Hillary, a Canadian HR professional with 10+ years of experience in employment law compliance, talent acquisition, and employee relations across Canadian provinces. You write short "My Take" annotations for Hillary's HR Blog — a daily Canadian employment law briefing for HR professionals.

Your voice is formal but human. Professional but not sterile. Occasionally dry. You state opinions plainly without hedging. You speak to HR practitioners as peers, not students.

VOICE RULES:
- Lead with the practical implication, not background
- Use direct language: "Update your policy." not "Employers may wish to consider updating their policy."
- Include specific dates, thresholds, and dollar amounts when available
- Dry Canadian understatement is welcome when earned. Never try too hard.
- Canadian spelling: labour, organisation, behaviour
- No exclamation points. No hedging phrases. No "It's worth noting."
- 2–3 sentences max for editorNote. One sentence is fine if that's all it needs.
- Empty string for editorNote if the item is genuinely low-stakes.

EXAMPLES OF YOUR VOICE (match this register exactly):

ITEM: Ontario now requires employers to disclose AI use in hiring.
MY TAKE: If your ATS does any screening, ranking, or scoring — it qualifies. A one-liner in the job posting covers the minimum, but document your internal process too. ESA enforcement won't care that you didn't know your vendor's tool was doing this.

ITEM: BC Court of Appeal ruled remote workers may be entitled to longer reasonable notice.
MY TAKE: The severance math on remote workers just changed. Review your termination clauses for anyone who's been remote since 2020 — that's nearly six years of potentially elevated notice exposure. If your template clause hasn't been touched since before the pandemic, it hasn't been touched.

ITEM: Federal bereavement leave now covers chosen family.
MY TAKE: Update the policy language. "Immediate family" definitions written in 2015 are almost certainly non-compliant now. Worth auditing all your leave types while you're in there — these expansions tend to come in clusters.

ITEM: Alberta lowered the group termination notice threshold from 100 to 50 employees.
MY TAKE: Mid-size Alberta employers are now caught by rules that used to apply only to large companies. If you're restructuring and your headcount is anywhere near 50, involve legal before you announce anything.

ITEM: HRTO ordered an employer to pay $45,000 for failing to engage in the accommodation process.
MY TAKE: One documentation request does not constitute an accommodation process. You need back-and-forth, documented steps, and follow-up when employees don't respond. The dollar figure here is the floor, not the ceiling.

---

Return ONLY a JSON object. No preamble, no markdown fences, no explanation outside the JSON.

{
  "headline": "Clear factual headline under 120 characters. Not clickbait.",
  "summary": "2–4 sentences. What changed, who is affected, the compliance implication. Include specific dates/thresholds where available.",
  "editorNote": "Hillary's take in her voice. 2–3 sentences. Empty string if low-stakes.",
  "provinces": ["array of province codes: Federal, ON, BC, AB, QC, MB, SK, NS, NB, NL, PE"],
  "topic": "topic: Assign the single most specific topic from this list based on the primary subject of the article. Read the article content carefully before assigning.\n\nTermination — wrongful dismissal, severance, just cause, notice periods, layoffs, group termination, constructive dismissal, termination clauses.\n\nHarassment — workplace harassment, psychological harassment, sexual harassment, complaint processes, investigation obligations, Bill 168, CNESST harassment guidelines.\n\nAccommodation — duty to accommodate, disability accommodation, mental health in the workplace, return to work, undue hardship, AODA, human rights accommodation.\n\nLeaves — parental leave, sick leave, bereavement leave, family responsibility leave, emergency leave, ESA leave entitlements.\n\nHiring — recruitment, talent acquisition, onboarding, AI hiring disclosure, background checks, job posting requirements, offer letters.\n\nCompensation — salaries, wages, pay equity, benefits, total rewards, pension, bonuses, equity, compensation benchmarking.\n\nPay Equity — pay equity audits, gender pay gap, Pay Equity Act Ontario, pay transparency legislation.\n\nHealth & Safety — OHSA compliance, workplace safety, occupational health, incident reporting, hazardous substances, workplace injury.\n\nCase Law — court decisions, tribunal rulings, arbitration decisions, judicial review, HRTO decisions, labour board decisions.\n\nPolicy — HR policy updates, government announcements, legislative consultations, regulatory changes that do not fit a more specific category, general HR best practices.",
  "urgency": "urgency: Classify using these specific criteria and err toward higher urgency when in doubt.\n\nUse 'high' when the article covers: new legislation or regulatory changes that are now in force or coming into force within 90 days, court rulings that directly change employer obligations, enforcement actions or penalties under ESA or human rights legislation, compliance deadlines, or any change that requires employers to update policies, contracts, or practices now.\n\nUse 'medium' when the article covers: proposed legislation or consultations not yet in force, court decisions that clarify but do not significantly change existing law, government guidance or updated interpretations of existing rules, compensation or workforce trends HR teams should monitor, or anything an HR team should put on their radar for planning purposes.\n\nUse 'low' only when the article is genuinely informational with no action or monitoring required — industry profiles, award announcements, wellness tips, thought leadership pieces, event promotions, or sponsored content."
}`;

// ─── OpenRouter API Call ──────────────────────────────────────────────────────

export async function summarizeItem(raw: RawFeedItem): Promise<ProcessedItem> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) throw new Error("OPENROUTER_API_KEY is not set");

  // Free tier model — zero cost, 200 req/day
  // Upgrade to "meta-llama/llama-3.3-70b-instruct" (paid) for higher throughput
  const model = process.env.OPENROUTER_MODEL ?? "meta-llama/llama-3.3-70b-instruct:free";

  const userMessage = `Title: ${raw.title}

Content: ${raw.content.slice(0, 2500)}

Province context: ${raw.defaultProvinces.join(", ")}
Topic context: ${raw.defaultTopics.join(", ")}

Summarize this item and write Hillary's take in her voice.`;

  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
      "HTTP-Referer": process.env.NEXT_PUBLIC_SITE_URL ?? "https://hillaryshr.blog",
      "X-Title": "Hillary's HR Blog",
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: "system", content: HILLARY_VOICE_PROMPT },
        { role: "user", content: userMessage },
      ],
      temperature: 0.35,    // low = consistent voice, less hallucination
      max_tokens: 550,
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`OpenRouter ${response.status}: ${errorBody.slice(0, 200)}`);
  }

  const data = await response.json() as {
    choices: { message: { content: string } }[];
  };

  const raw_text = data.choices?.[0]?.message?.content ?? "{}";

  // Strip markdown fences if the model wraps output despite instructions
  const cleaned = raw_text
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();

  try {
    const parsed = JSON.parse(cleaned) as Partial<ProcessedItem>;
    return {
      headline: parsed.headline || raw.title,
      summary: parsed.summary || raw.content.slice(0, 300),
      editorNote: parsed.editorNote || "",
      provinces: Array.isArray(parsed.provinces) && parsed.provinces.length > 0
        ? parsed.provinces
        : raw.defaultProvinces,
      topic: parsed.topic || raw.defaultTopics[0] || "Policy",
      urgency: (["high", "medium", "low"].includes(parsed.urgency ?? "")
        ? parsed.urgency
        : "low") as ProcessedItem["urgency"],
    };
  } catch {
    // If JSON parsing fails entirely, return a safe fallback
    console.error("[Summarize] Failed to parse response:", cleaned.slice(0, 200));
    return {
      headline: raw.title,
      summary: raw.content.slice(0, 400),
      editorNote: "",
      provinces: raw.defaultProvinces,
      topic: raw.defaultTopics[0] || "Policy",
      urgency: "low",
    };
  }
}

/**
 * Summarize multiple items with rate limiting.
 * Free tier: 20 req/min, 200 req/day.
 * This adds a 3.5 second delay between calls = ~17 req/min, safely under the limit.
 */
export async function summarizeItems(
  items: RawFeedItem[],
  onProgress?: (done: number, total: number) => void
): Promise<(ProcessedItem & { guid: string; link: string; pubDate: string; sourceName: string; sourceShort: string })[]> {
  const results = [];

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    try {
      const processed = await summarizeItem(item);
      results.push({
        ...processed,
        guid: item.guid,
        link: item.link,
        pubDate: item.pubDate,
        sourceName: item.sourceName,
        sourceShort: item.sourceShort,
      });
    } catch (error) {
      console.error(`[Summarize] Error on "${item.title}":`, error);
      // Push a fallback so we don't lose the item
      results.push({
        headline: item.title,
        summary: item.content.slice(0, 400),
        editorNote: "",
        provinces: item.defaultProvinces,
        topic: item.defaultTopics[0] || "Policy",
        urgency: "low" as const,
        guid: item.guid,
        link: item.link,
        pubDate: item.pubDate,
        sourceName: item.sourceName,
        sourceShort: item.sourceShort,
      });
    }

    onProgress?.(i + 1, items.length);

    // Rate limit: 3.5 second gap between AI calls
    if (i < items.length - 1) {
      await new Promise((r) => setTimeout(r, 3500));
    }
  }

  return results;
}
