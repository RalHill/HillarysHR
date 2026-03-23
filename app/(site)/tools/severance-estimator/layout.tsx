import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Ontario Severance Pay Calculator | ESA & Common Law Estimates',
  description:
    'Estimate severance pay for Ontario terminations. Includes ESA minimum severance and common law estimates based on years of service, age, and role. For informational use only.',
  keywords: ['severance calculator', 'Ontario employment law', 'termination pay'],
  openGraph: {
    title: 'Severance Pay Calculator',
    description: 'Free severance calculator for Ontario employment terminations',
    url: 'https://hillaryshr.blog/tools/severance-estimator',
    siteName: "Hillary's HR Blog",
    type: 'website',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
