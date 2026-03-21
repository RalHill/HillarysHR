# Hillary's HR Blog — Setup Checklist
# Follow these steps in order. Takes about 45 minutes total.

---

## STEP 1 — Copy Files Into Your Existing Next.js Project

Copy these files from this deliverable into your project:

```
lib/sources.ts          → your-project/lib/sources.ts
lib/rss.ts              → your-project/lib/rss.ts
lib/summarize.ts        → your-project/lib/summarize.ts
lib/db.ts               → your-project/lib/db.ts
app/api/ingest/route.ts → your-project/app/api/ingest/route.ts
app/api/subscribe/route.ts → your-project/app/api/subscribe/route.ts
app/news/page.tsx       → your-project/app/news/page.tsx  (replace existing)
vercel.json             → your-project/vercel.json
CanadianHRPulse.tsx     → your-project/components/HillaryHRBlog.tsx
```

Rename CanadianHRPulse.tsx → HillaryHRBlog.tsx and change the export name to HillaryHRBlog.

---

## STEP 2 — Install Dependencies

In your project terminal:

```bash
npm install rss-parser @neondatabase/serverless resend
npm install --save-dev @types/rss-parser
```

---

## STEP 3 — Set Up Neon Postgres (free)

1. Go to console.neon.tech
2. Sign up / log in → New Project → name it "hillarys-hr-blog"
3. Once created, go to: Connection Details → select ".env" tab
4. Copy the DATABASE_URL string (starts with postgresql://)

Now run this SQL in Neon's SQL Editor (Dashboard → SQL Editor):

```sql
CREATE TABLE IF NOT EXISTS news_items (
  id          SERIAL PRIMARY KEY,
  source      TEXT NOT NULL,
  source_short TEXT NOT NULL,
  headline    TEXT NOT NULL,
  summary     TEXT,
  editor_note TEXT DEFAULT '',
  url         TEXT,
  pub_date    TIMESTAMPTZ NOT NULL,
  provinces   TEXT[],
  topic       TEXT,
  urgency     TEXT DEFAULT 'low',
  source_id   TEXT UNIQUE,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_news_pub_date ON news_items (pub_date DESC);
CREATE INDEX IF NOT EXISTS idx_news_topic ON news_items (topic);
CREATE INDEX IF NOT EXISTS idx_news_urgency ON news_items (urgency);

CREATE TABLE IF NOT EXISTS subscribers (
  id         SERIAL PRIMARY KEY,
  email      TEXT UNIQUE NOT NULL,
  confirmed  BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## STEP 4 — Get Your OpenRouter API Key (free, no credit card)

1. Go to openrouter.ai → Sign Up (free)
2. Dashboard → Keys → Create Key → name it "hillarys-hr-blog"
3. Copy the key (starts with sk-or-v1-)
   
The free tier gives you 200 requests/day with Llama 3.3 70B.
That's enough for 200 new articles per day — more than enough.

---

## STEP 5 — Create Your .env.local File

In your project root, create `.env.local`:

```env
DATABASE_URL=postgresql://...  (from Step 3)
OPENROUTER_API_KEY=sk-or-v1-...  (from Step 4)
OPENROUTER_MODEL=meta-llama/llama-3.3-70b-instruct:free
CRON_SECRET=any-long-random-string-you-make-up
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

Generate a random CRON_SECRET with:
```bash
openssl rand -hex 32
```

---

## STEP 6 — Test Locally

Start your dev server:
```bash
npm run dev
```

Trigger the ingest manually to test it:
```bash
curl -X POST http://localhost:3000/api/ingest \
  -H "Authorization: Bearer YOUR_CRON_SECRET_HERE"
```

Or open in browser (GET method):
```
http://localhost:3000/api/ingest?secret=YOUR_CRON_SECRET_HERE
```

You should see JSON like:
```json
{
  "message": "Ingest complete",
  "stats": { "fetched": 45, "new": 45, "skipped": 0, "errors": 0 }
}
```

Then visit http://localhost:3000/news — you should see real articles.

---

## STEP 7 — Deploy to Vercel

1. Push your code to GitHub
2. Vercel Dashboard → New Project → import your repo
3. Before deploying, go to: Settings → Environment Variables
   Add ALL variables from your .env.local:
   - DATABASE_URL
   - OPENROUTER_API_KEY
   - OPENROUTER_MODEL
   - CRON_SECRET
   - NEXT_PUBLIC_SITE_URL (use your real domain)

4. Deploy.

---

## STEP 8 — Enable Vercel Cron

Vercel Cron requires Vercel Pro ($20/month) OR the free hobby plan supports
cron jobs on the Pro plan only.

If you're on the free plan, use cron-job.org instead (100% free):
1. Sign up at cron-job.org
2. Create a new cron job:
   - URL: https://yourdomain.vercel.app/api/ingest
   - Method: POST
   - Headers: Authorization: Bearer YOUR_CRON_SECRET
   - Schedule: Every day at 02:00 AM EST (07:00 UTC)

The vercel.json cron config kicks in automatically if you're on Vercel Pro.

---

## STEP 9 — Verify the Full Pipeline

After the first cron run (or after manually triggering ingest):
1. Check Neon Dashboard → Tables → news_items — you should see rows
2. Check your live site /news page — articles should appear
3. Check Vercel Logs → Functions → /api/ingest for any errors

---

## STEP 10 — Improve Hillary's Voice (Ongoing)

Open lib/summarize.ts → find the FEW_SHOT_EXAMPLES section.

When you see a "My Take" that doesn't sound like you:
1. Copy the article title
2. Rewrite the My Take the way you'd actually say it
3. Add both to the examples section
4. Redeploy

5–10 real examples will get you to ~85% of your actual voice. No ML required.

---

## Troubleshooting

**RSS feeds returning 0 items:**
Some government feeds have irregular update schedules. Check the feed URL
directly in your browser. If it 404s, find the updated URL in lib/sources.ts
and replace it.

**OpenRouter returning errors:**
- 401 = API key wrong or not set
- 429 = hit the 200/day free limit (wait until midnight UTC or upgrade)
- 500 = model temporarily unavailable, retry next day

**Neon DB connection errors:**
- Make sure DATABASE_URL has ?sslmode=require at the end
- Check Neon project is not paused (free tier auto-pauses after 7 days idle —
  wake it up by running any query in the SQL editor)

---

## Cost Summary

| Service              | Plan         | Monthly Cost |
|----------------------|--------------|--------------|
| Vercel               | Hobby (free) | $0           |
| Neon Postgres        | Free tier    | $0           |
| OpenRouter (Llama)   | Free tier    | $0           |
| Resend               | Free tier    | $0           |
| Domain (hillaryshr.blog) | —        | ~$1.50       |
| cron-job.org         | Free         | $0           |
| **Total**            |              | **~$1.50/mo**|

If you upgrade Vercel to Pro ($20/mo) you get native cron + better logs.
Not required to launch.
