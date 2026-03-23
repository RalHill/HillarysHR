import FAQAccordion from "@/app/components/FAQAccordion";

export const metadata = {
  title: 'HR Explained | Canadian Employment Law & Compliance Guide',
  description:
    'Comprehensive HR guides on hiring, termination, leave entitlements, accommodation, and compliance. Practical resources for HR professionals navigating Canadian employment law.',
  keywords: ['HR guide', 'employment law', 'compliance', 'HR resources'],
  openGraph: {
    title: 'HR Explained',
    description: 'Your guide to Canadian HR law and compliance',
    url: 'https://hillaryshr.blog/hr-explained',
    siteName: "Hillary's HR Blog",
    type: 'website',
  },
};

export default function HRExplainedPage() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-8">
      <div className="mb-8">
        <p className="text-xs font-bold tracking-widest uppercase text-red-700 mb-1">
          Reference
        </p>
        <h1 className="font-serif text-3xl font-light text-gray-900 mb-2">
          HR Explained
        </h1>
        <p className="text-sm text-gray-500 leading-relaxed">
          Plain-language answers to common Canadian HR and employment law
          questions. Practitioner perspective, not legal advice.
        </p>
      </div>
      <FAQAccordion />
    </div>
  );
}
