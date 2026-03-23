import type { Metadata } from 'next'
import ToolsPageClient from './tools-client'

export const metadata: Metadata = {
  title: 'Free HR Tools | Calculators & Generators for Canadian Employers',
  description:
    'Free HR tools: Boolean search generator, PTO calculator, severance estimator, and statutory holiday pay calculator. Practical logic for HR practitioners.',
  keywords: ['HR tools', 'salary calculator', 'HR calculator', 'free HR tools'],
  openGraph: {
    title: 'Free HR Tools',
    description: 'Practical calculators and generators for Canadian HR professionals',
    url: 'https://hillaryshr.blog/tools',
    siteName: "Hillary's HR Blog",
    type: 'website',
  },
}

export default function ToolsPage() {
  return <ToolsPageClient />
}
