import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Boolean Search String Generator | LinkedIn, ATS, Google X-Ray',
  description:
    'Build precision Boolean search strings for LinkedIn Recruiter, ATS systems, and Google X-Ray. Pre-built templates for 10+ HR roles. Free, no sign-up required.',
  keywords: ['Boolean search', 'recruiter tool', 'LinkedIn search', 'ATS search'],
  openGraph: {
    title: 'Boolean Search String Generator',
    description: 'Free tool to build Boolean search strings for recruiting',
    url: 'https://hillaryshr.blog/tools/boolean-generator',
    siteName: "Hillary's HR Blog",
    type: 'website',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
