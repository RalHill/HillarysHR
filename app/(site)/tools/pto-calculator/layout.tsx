import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Canada PTO & Leave Entitlement Calculator | By Province',
  description:
    'Calculate vacation days, sick leave, and leave entitlements across all Canadian provinces. Includes parental leave, family leave, and employment type variations.',
  keywords: ['PTO calculator', 'vacation days Canada', 'leave calculator', 'sick days'],
  openGraph: {
    title: 'PTO & Leave Calculator',
    description: 'Free calculator for Canadian vacation and leave entitlements',
    url: 'https://hillaryshr.blog/tools/pto-calculator',
    siteName: "Hillary's HR Blog",
    type: 'website',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
