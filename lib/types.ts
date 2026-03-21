// Shared types for the blog

export const VALID_TOPICS = [
  "Termination",
  "Harassment",
  "Accommodation",
  "Leaves",
  "Hiring",
  "Compensation",
  "Pay Equity",
  "Health & Safety",
  "Case Law",
  "Policy",
] as const;

export type Topic = (typeof VALID_TOPICS)[number];

export const TOPICS = VALID_TOPICS as readonly Topic[];

export const VALID_URGENCIES = ["high", "medium", "low"] as const;
export type Urgency = (typeof VALID_URGENCIES)[number];

export interface NewsItem {
  id: number;
  source: string;
  sourceShort: string;
  headline: string;
  summary: string;
  editorNote?: string;
  date: string;
  provinces: string[];
  topic: Topic;
  urgency: Urgency;
  url?: string;
}

export const PROVINCES = [
  "Federal",
  "ON",
  "BC",
  "AB",
  "QC",
  "MB",
  "SK",
  "NS",
  "NB",
] as const;

export const URGENCY_CONFIG: Record<
  Urgency,
  { label: string; color: string; bg: string }
> = {
  high: { label: "Action Required", color: "#c0392b", bg: "#fdf2f2" },
  medium: { label: "Watch", color: "#d35400", bg: "#fdf6f0" },
  low: { label: "FYI", color: "#27ae60", bg: "#f2fdf6" },
};

export const PROVINCE_COLORS: Record<
  (typeof PROVINCES)[number],
  { bg: string; text: string }
> = {
  ON: { bg: "#eef4f1", text: "#1a5c42" },
  BC: { bg: "#f0f4fb", text: "#1a3a6e" },
  AB: { bg: "#fdf6ee", text: "#7a3c00" },
  QC: { bg: "#f7f0fb", text: "#5c1f7a" },
  Federal: { bg: "#e8eef9", text: "#1a3060" },
  MB: { bg: "#f0f7ef", text: "#2a5c28" },
  SK: { bg: "#fefaf0", text: "#7a5c00" },
  NS: { bg: "#f0f5fb", text: "#1a3a6e" },
  NB: { bg: "#fdf0f7", text: "#7a1a5c" },
};
