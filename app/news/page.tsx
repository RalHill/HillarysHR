import Link from "next/link";
import { getNewsItems } from "@/lib/db";

export const dynamic = "force-dynamic";

function formatDate(iso: string) {
  try {
    return new Intl.DateTimeFormat("en-CA", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

export default async function NewsPage() {
  let items: Awaited<ReturnType<typeof getNewsItems>> = [];
  let loadError: string | null = null;

  try {
    items = await getNewsItems({ limit: 60, daysBack: 14 });
  } catch (e) {
    loadError =
      e instanceof Error ? e.message : "Could not load news from the database.";
  }

  return (
    <main
      id="main-content"
      className="mx-auto min-h-dvh max-w-4xl px-6 py-12 pb-24"
    >
      <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">
            News
          </h1>
          <p className="mt-2 text-slate-600 dark:text-slate-300">
            Recent Canadian HR and employment law items from the ingest pipeline.
          </p>
        </div>
        <Link
          href="/"
          className="inline-flex h-11 min-h-[44px] w-fit cursor-pointer items-center justify-center rounded-lg border border-slate-300 px-4 text-sm font-medium text-slate-800 transition-colors hover:bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 dark:border-slate-600 dark:text-slate-100 dark:hover:bg-slate-800"
        >
          Home
        </Link>
      </div>

      {loadError ? (
        <div
          role="alert"
          className="rounded-lg border border-amber-200 bg-amber-50 p-6 text-amber-950 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-100"
        >
          <p className="font-medium">Database unavailable</p>
          <p className="mt-2 text-sm leading-relaxed opacity-90">{loadError}</p>
          <p className="mt-4 text-sm leading-relaxed opacity-90">
            Add <code className="rounded bg-black/10 px-1.5 py-0.5">DATABASE_URL</code>{" "}
            to <code className="rounded bg-black/10 px-1.5 py-0.5">.env.local</code>{" "}
            (see SETUP.md), run ingest, then refresh.
          </p>
        </div>
      ) : items.length === 0 ? (
        <p className="rounded-lg border border-slate-200 bg-white p-8 text-center text-slate-600 dark:border-slate-700 dark:bg-slate-900/50 dark:text-slate-300">
          No articles in the last 14 days. Trigger{" "}
          <code className="rounded bg-slate-100 px-1.5 py-0.5 dark:bg-slate-800">
            /api/ingest
          </code>{" "}
          after configuring env vars.
        </p>
      ) : (
        <ul className="flex flex-col gap-6">
          {items.map((row) => (
            <li
              key={row.id}
              className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900/40"
            >
              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                <span className="font-medium text-slate-700 dark:text-slate-200">
                  {row.source_short}
                </span>
                <span aria-hidden>·</span>
                <time dateTime={row.pub_date}>{formatDate(row.pub_date)}</time>
                {row.topic ? (
                  <>
                    <span aria-hidden>·</span>
                    <span>{row.topic}</span>
                  </>
                ) : null}
                <span aria-hidden>·</span>
                <span
                  className={
                    row.urgency === "high"
                      ? "text-red-700 dark:text-red-400"
                      : row.urgency === "medium"
                        ? "text-amber-700 dark:text-amber-400"
                        : ""
                  }
                >
                  Urgency: {row.urgency}
                </span>
              </div>
              <h2 className="mt-3 text-xl font-semibold text-slate-900 dark:text-slate-50">
                {row.headline}
              </h2>
              {row.url ? (
                <a
                  href={row.url}
                  className="mt-2 inline-block cursor-pointer text-sm font-medium text-indigo-600 underline-offset-2 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 dark:text-indigo-400"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  Source link
                </a>
              ) : null}
              <p className="mt-3 text-base leading-relaxed text-slate-700 dark:text-slate-300">
                {row.summary}
              </p>
              {row.editor_note ? (
                <p className="mt-4 border-l-4 border-indigo-500 pl-4 text-sm italic leading-relaxed text-slate-600 dark:text-slate-400">
                  <span className="font-semibold not-italic text-slate-800 dark:text-slate-200">
                    My take:{" "}
                  </span>
                  {row.editor_note}
                </p>
              ) : null}
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
