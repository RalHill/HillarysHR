import { Topic, VALID_TOPICS, Urgency, VALID_URGENCIES } from "./types";

export function formatNewsDate(isoDate: string): string {
  try {
    const date = new Date(isoDate);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return isoDate;
  }
}

export function validateTopic(value: unknown): Topic {
  if (typeof value === "string" && VALID_TOPICS.includes(value as Topic)) {
    return value as Topic;
  }
  return "Policy";
}

export function validateUrgency(value: unknown): Urgency {
  if (typeof value === "string" && VALID_URGENCIES.includes(value as Urgency)) {
    return value as Urgency;
  }
  return "low";
}
