import { getNewsItems } from "@/lib/db";
import { formatNewsDate, validateTopic, validateUrgency } from "@/lib/utils";
import { NewsItem } from "@/lib/types";
import HillaryHRBlog from "@/components/HillaryHRBlog";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Hillary's HR Blog - Canadian Employment Law & HR Intelligence",
  description:
    "Daily Canadian employment law and HR updates curated from 6 sources.",
};

async function getNewsData(): Promise<NewsItem[]> {
  try {
    const dbItems = await getNewsItems({ limit: 60, daysBack: 14 });

    return dbItems.map((row) => ({
      id: row.id,
      source: row.source,
      sourceShort: row.source_short,
      headline: row.headline,
      summary: row.summary,
      editorNote: row.editor_note || undefined,
      date: formatNewsDate(row.pub_date),
      provinces: row.provinces || [],
      topic: validateTopic(row.topic),
      urgency: validateUrgency(row.urgency),
      url: row.url || undefined,
    }));
  } catch (error) {
    console.error("Failed to fetch news items:", error);
    return [];
  }
}

export default async function HomePage() {
  const items = await getNewsData();

  return <HillaryHRBlog items={items} />;
}
