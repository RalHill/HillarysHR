import { notFound } from "next/navigation";
import Link from "next/link";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getAllPosts, getPostBySlug } from "@/lib/posts";

export async function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};
  return {
    title: `${post.title} | Hillary's HR Blog`,
    description: post.excerpt,
  };
}

const JURISDICTION_STYLES: Record<string, string> = {
  Canada: "bg-emerald-50 text-emerald-800",
  US: "bg-blue-50 text-blue-800",
  "Canada + US": "bg-purple-50 text-purple-800",
};

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  return (
    <div className="max-w-2xl mx-auto px-6 py-10">
      {/* Back link */}
      <Link
        href="/take"
        className="inline-flex items-center gap-1 text-xs text-gray-400 hover:text-red-700 transition-colors mb-8"
      >
        ← Hillary&apos;s Take
      </Link>

      {/* Post header */}
      <header className="mb-8">
        <div className="flex items-center gap-2 flex-wrap mb-4">
          <span className="text-xs font-medium bg-gray-100 text-gray-600 px-2 py-1 rounded">
            {post.topic}
          </span>
          <span
            className={`text-xs font-semibold px-2 py-1 rounded ${
              JURISDICTION_STYLES[post.jurisdiction] ?? "bg-gray-100 text-gray-600"
            }`}
          >
            {post.jurisdiction}
          </span>
          <span className="text-xs text-gray-400">· {post.readTime}</span>
        </div>

        <h1
          style={{ fontFamily: "var(--font-newsreader)" }}
          className="text-2xl font-semibold text-gray-900 leading-snug mb-3"
        >
          {post.title}
        </h1>

        <p className="text-xs text-gray-400">
          {new Date(post.date).toLocaleDateString("en-CA", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
      </header>

      {/* MDX body */}
      <article className="prose prose-sm prose-gray max-w-none prose-headings:font-semibold prose-a:text-red-700 prose-strong:text-gray-900 prose-hr:border-gray-100 prose-p:leading-relaxed">
        <MDXRemote source={post.content} />
      </article>

      {/* Footer back link */}
      <div className="mt-12 pt-6 border-t border-gray-100">
        <Link
          href="/take"
          className="text-xs font-medium text-red-700 hover:underline"
        >
          ← Back to Hillary&apos;s Take
        </Link>
      </div>
    </div>
  );
}
