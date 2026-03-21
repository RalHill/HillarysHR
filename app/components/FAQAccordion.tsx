"use client";

import { useState } from "react";

interface FAQItem {
  q: string;
  a: string;
}

interface FAQSection {
  title: string;
  items: FAQItem[];
}

const FAQ_DATA: FAQSection[] = [
  {
    title: "Termination & Severance",
    items: [
      {
        q: "Can I terminate an employee during their probation period without notice in Ontario?",
        a: "Generally yes for the first 3 months if you are assessing suitability — but document performance feedback throughout. After 3 months ESA minimums apply regardless of what your contract calls the period. Terminating with no documented feedback during probation still attracts common law exposure.",
      },
      {
        q: "What is constructive dismissal and how do I know if a situation qualifies?",
        a: "Constructive dismissal occurs when an employer makes a fundamental unilateral change to the terms of employment — significant pay cuts, demotion, change of location, removal of core responsibilities — without the employee's consent. The employee can treat the contract as repudiated, resign, and claim wrongful dismissal damages. The threshold is fundamental change. Get legal involved before making the change, not after the resignation lands.",
      },
      {
        q: "Does working remotely affect how much severance an employee is owed?",
        a: "Increasingly yes. The BC Court of Appeal ruled that remote workers may be entitled to longer reasonable notice periods due to reduced geographic mobility and limited local market access. This does not affect ESA minimums but it affects the common law reasonable notice calculation. If your termination clauses were drafted pre-2020 they likely do not account for this.",
      },
      {
        q: "What is the difference between ESA minimum notice and common law reasonable notice?",
        a: "ESA minimums are the statutory floor — one week per year of service up to eight weeks in Ontario, plus severance pay where applicable. Common law reasonable notice is what courts award absent an enforceable termination clause, based on age, length of service, position, and availability of similar employment — often 1 to 2 months per year of service for senior employees. A well-drafted employment contract caps liability at ESA minimums. Without an enforceable clause you are exposed to common law.",
      },
      {
        q: "What triggers group termination notice requirements in Ontario and Alberta?",
        a: "Terminating 50 or more employees within a 4-week period triggers mass termination rules in both provinces. Alberta lowered its threshold from 100 to 50 employees in 2026, requiring 4 weeks advance notice to the Director of Employment Standards. These rules apply regardless of individual termination clauses. If you are approaching these thresholds in a restructuring, involve legal before any announcements are made.",
      },
    ],
  },
  {
    title: "Accommodation & Human Rights",
    items: [
      {
        q: "When does an employer's duty to accommodate end?",
        a: "At the point of undue hardship — not inconvenience, not expense, not operational disruption. Undue hardship requires evidence: financial cost that genuinely threatens the business, health and safety risk that cannot be mitigated, or operational impossibility. Most employers invoke it far too early. The Tribunal and courts set the bar high deliberately. The process matters as much as the outcome — document every step and engage the employee throughout.",
      },
      {
        q: "What are an employer's obligations when an employee discloses a mental health condition?",
        a: "Disclosure triggers the duty to inquire and the duty to accommodate. You can request functional information about limitations from a healthcare provider — you cannot require a diagnosis. Then you must engage in a genuine interactive process, document every step, follow up when the employee does not respond, and revisit if the accommodation is not working. Terminating shortly after a mental health disclosure is one of the most common and expensive human rights mistakes in Canadian HR.",
      },
      {
        q: "How do I handle a harassment complaint properly under Canadian law?",
        a: "Receipt of a complaint triggers an obligation to investigate under provincial employment standards and occupational health and safety legislation. The investigation must be prompt, thorough, and impartial. In Quebec, CNESST's 2026 guidelines reduce the required response window to 60 days. The investigator must be neutral. Findings must be communicated to both parties. Document everything from first receipt of the complaint.",
      },
    ],
  },
  {
    title: "Hiring, Contractors & Compliance",
    items: [
      {
        q: "Do I need to disclose AI tools in my job postings in Ontario?",
        a: "Yes, as of January 1 2026. Ontario's Working for Workers Act requires employers to disclose in job postings whether artificial intelligence is used in the hiring process. This applies to any tool that screens, ranks, or scores candidates algorithmically — which includes most modern ATS platforms. A brief disclosure statement in the posting satisfies the minimum. Document internally which tools are used. Non-compliance triggers ESA enforcement.",
      },
      {
        q: "Can I classify workers as independent contractors to avoid ESA obligations?",
        a: "Not based on the label alone. Whether a worker is an employee or contractor is determined by the actual nature of the relationship — control over work, exclusivity, economic dependence, ownership of tools, opportunity for profit and loss. Courts look past the contract to the reality. Misclassification exposes you to ESA liability, CRA payroll obligations, and human rights claims. If you rely heavily on contractors, a periodic classification audit is worth doing.",
      },
      {
        q: "How do Canadian termination laws differ from U.S. at-will employment?",
        a: "Substantially. In most U.S. states, employment is at-will — either party can terminate for any reason with no notice required. Canada has no equivalent. Every Canadian employee is entitled to reasonable notice or pay in lieu on termination without cause, at minimum at the ESA floor. Termination for cause requires serious misconduct and a high evidentiary bar. Companies expanding from the U.S. into Canada consistently underestimate severance exposure and get caught on termination.",
      },
      {
        q: "Is a fixed-term contract employee entitled to severance when the contract ends?",
        a: "Not on natural expiry as agreed. However, if the contract is terminated early ESA and common law obligations apply. The risk area is repeated renewals — a series of fixed-term contracts for the same person in the same role can establish an expectation of continued employment. Courts have found that repeatedly renewed fixed-term employees acquire reasonable notice entitlements similar to permanent employees.",
      },
    ],
  },
  {
    title: "Credentials & The Profession",
    items: [
      {
        q: "What is the difference between CHRP and CPHR and does it matter which one I hold?",
        a: "CHRP (Certified Human Resources Professional) is the Ontario designation issued by HRPA. CPHR (Chartered Professional in Human Resources) is the national designation used by the other provincial HR associations. In Ontario, CHRP carries strong brand recognition with Toronto-based employers. Outside Ontario, CPHR is better recognized. For pan-Canadian or national roles CPHR is the stronger signal. Holding both closes the gap entirely. At the senior HRBP level the credential signals commitment to the profession in a way that matters to certain hiring committees.",
      },
    ],
  },
];

function FAQItem({ item }: { item: FAQItem }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden mb-2">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-3 px-4 py-4 text-left hover:bg-gray-50 transition-colors"
      >
        <span className="text-sm font-medium text-gray-900 leading-snug">
          {item.q}
        </span>
        <span className="text-gray-400 text-lg flex-shrink-0 leading-none">
          {open ? "−" : "+"}
        </span>
      </button>
      {open && (
        <div className="px-4 pb-4 pt-1 border-t border-gray-100">
          <p className="text-sm text-gray-600 leading-relaxed">{item.a}</p>
        </div>
      )}
    </div>
  );
}

export default function FAQAccordion() {
  return (
    <div>
      {FAQ_DATA.map((section) => (
        <div key={section.title} className="mb-8">
          <h2 className="text-xs font-bold tracking-widest uppercase text-gray-400 mb-3 pb-2 border-b border-gray-100">
            {section.title}
          </h2>
          {section.items.map((item) => (
            <FAQItem key={item.q} item={item} />
          ))}
        </div>
      ))}
      <p className="text-xs text-gray-400 bg-gray-50 rounded-lg px-4 py-3 border-l-2 border-gray-200">
        Not legal advice. These answers reflect practitioner experience and
        general knowledge of Canadian employment law as of 2026. Specific
        situations should be reviewed with qualified legal counsel.
      </p>
    </div>
  );
}
