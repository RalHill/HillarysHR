// lib/sources.ts
// All Canadian HR & Employment Law RSS sources
// These URLs are verified as of March 2026.
// If a feed goes dead, replace the URL — the rest of the pipeline stays the same.

export interface RSSSource {
  name: string;
  short: string;
  url: string;
  provinces: string[];
  topics: string[];
}

export const RSS_SOURCES: RSSSource[] = [
  // ── Government ─────────────────────────────────────────────────────────────
  {
    name: "Ontario Human Rights Commission",
    short: "OHRC",
    url: "https://www.ohrc.on.ca/en/rss.xml",
    provinces: ["ON"],
    topics: ["Accommodation", "Harassment", "Policy"],
  },

  // ── HR Professional Associations ──────────────────────────────────────────
  {
    name: "CPHR Canada",
    short: "CPHR",
    url: "https://cphr.ca/feed/",
    provinces: ["Federal", "ON", "BC", "AB", "QC"],
    topics: ["Compensation", "Policy", "Hiring"],
  },
  {
    name: "HRPA Ontario",
    short: "HRPA",
    url: "https://www.hrpa.ca/feed/",
    provinces: ["ON", "Federal"],
    topics: ["Policy", "Hiring", "Compensation", "Health & Safety"],
  },
  {
    name: "Benefits Canada",
    short: "Benefits CA",
    url: "https://www.benefitscanada.com/feed/",
    provinces: ["Federal", "ON", "BC", "AB", "QC"],
    topics: ["Compensation", "Pay Equity", "Policy"],
  },

  // ── Employment Law for HR Practitioners ───────────────────────────────────
  {
    name: "Spring Law - Employment & HR Law",
    short: "Spring Law",
    url: "https://springlaw.ca/feed/",
    provinces: ["Federal", "ON"],
    topics: ["Termination", "Harassment", "Accommodation", "Hiring"],
  },
  {
    name: "Osler - Employment & Labour Blog",
    short: "Osler",
    url: "https://www.osler.com/en/feed/",
    provinces: ["Federal", "ON", "BC", "AB", "QC"],
    topics: ["Policy", "Health & Safety", "Leaves", "Compensation"],
  },
  {
    name: "Ogletree Deakins Canada",
    short: "Ogletree",
    url: "https://ogletree.ca/feed/",
    provinces: ["Federal", "ON", "BC", "AB"],
    topics: ["Policy", "Termination", "Hiring", "Health & Safety"],
  },
];
