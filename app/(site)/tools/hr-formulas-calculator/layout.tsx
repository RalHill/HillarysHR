import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'HR Formulas Calculator | Hillary\'s HR Blog',
  description:
    'Free HR formulas calculator. Instantly compute absenteeism rate, attrition, retention, cost per hire, time to hire, offer acceptance rate, human capital ROI, and more.',
  keywords: ['HR formulas', 'HR calculator', 'employee metrics', 'HR metrics'],
  openGraph: {
    title: 'HR Formulas Calculator',
    description: 'Free calculator for 9 essential HR metrics and formulas',
    url: 'https://hillaryshr.blog/tools/hr-formulas-calculator',
    siteName: "Hillary's HR Blog",
    type: 'website',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
