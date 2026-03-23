import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Statutory Holiday Pay Calculator | Canada by Province 2026',
  description:
    'Calculate statutory holiday pay by province. View working vs. non-working rates, premium multipliers, and all 2026 Canadian statutory holidays. Updated annually.',
  keywords: ['statutory holiday', 'holiday pay calculator', 'Canada holidays 2026'],
  openGraph: {
    title: 'Statutory Holiday Pay Calculator',
    description: 'Free calculator for Canadian statutory holiday pay by province',
    url: 'https://hillaryshr.blog/tools/stat-holiday-calculator',
    siteName: "Hillary's HR Blog",
    type: 'website',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
