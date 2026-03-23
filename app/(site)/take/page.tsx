import Link from "next/link";
import { getAllPosts } from "@/lib/posts";

const JURISDICTION_STYLES: Record<string, string> = {
  "Canada": "bg-emerald-50 text-emerald-800",
  "US": "bg-blue-50 text-blue-800",
  "Canada + US": "bg-purple-50 text-purple-800",
};

export const metadata = {
  title: "Hillary's HR Blog Posts | Canadian Employment Law Updates",
  description:
    "Read Hillary's expert perspectives on Canadian employment law, HR compliance, hiring practices, and workplace trends. Curated insights for HR professionals and business leaders.",
  keywords: ['HR blog', 'employment law Canada', 'HR compliance', 'workplace law'],
  openGraph: {
    title: "Hillary's HR Blog Posts",
    description: 'Expert HR perspectives on Canadian employment law and compliance',
    url: 'https://hillaryshr.blog/take',
    siteName: "Hillary's HR Blog",
    type: 'website',
  },
};

export default function TakePage() {
  const posts = getAllPosts();

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <div className="mb-8">
        <p className="text-xs font-bold tracking-widest uppercase text-red-700 mb-1">
          Opinion & Analysis
        </p>
        <h1 className="font-serif text-3xl font-light text-gray-900 mb-2">
          Hillary&apos;s Take
        </h1>
        <p className="text-sm text-gray-500 leading-relaxed">
          Practitioner-level commentary on Canadian employment law, HR strategy,
          and the intersection of people and compliance. Published when something
          is worth saying.
        </p>
      </div>

      {posts.length === 0 ? (
        <p className="text-sm text-gray-400">No posts published yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/take/${post.slug}`}
              className="block group"
            >
              <article className="h-full bg-white border border-gray-200 border-l-4 border-l-red-600 rounded-xl p-5 flex flex-col gap-3 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-medium bg-gray-100 text-gray-600 px-2 py-1 rounded">
                    {post.topic}
                  </span>
                  <span
                    className={`text-xs font-semibold px-2 py-1 rounded ${
                      JURISDICTION_STYLES[post.jurisdiction] ??
                      "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {post.jurisdiction}
                  </span>
                </div>

                <h2 className="font-serif text-base font-semibold text-gray-900 leading-snug group-hover:text-red-700 transition-colors">
                  {post.title}
                </h2>

                <p className="text-xs text-gray-500 leading-relaxed flex-1">
                  {post.excerpt}
                </p>

                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <span className="text-xs text-gray-400">
                    {new Date(post.date).toLocaleDateString("en-CA", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}{" "}
                    · {post.readTime}
                  </span>
                  <span className="text-xs font-medium text-red-700">
                    Read →
                  </span>
                </div>
              </article>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
