'use client'
import React, { useState, useMemo } from 'react'
import Link from 'next/link'
 
// ─── Sub-components at module level (fixes input focus loss on keystroke) ───
 
const FormulaSection = React.memo(function FormulaSectionComponent({
  title,
  explanation,
  children,
  calcResult,
}: {
  title: string
  explanation: string
  children: React.ReactNode
  calcResult: { error?: string; result?: number }
}) {
  const isError = !!calcResult.error
 
  return (
    <div className="tool-card-elevated" style={{ padding: '20px', marginBottom: '20px' }}>
      <div style={{ fontSize: 14, fontWeight: 600, color: '#1a1a1a', marginBottom: 16 }}>{title}</div>
 
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '16px' }}>
        {children}
      </div>
 
      {isError && (
        <div style={{ fontSize: 12, color: '#c0392b', marginBottom: '12px' }}>
          {calcResult.error}
        </div>
      )}
 
      {!isError && calcResult.result !== undefined && (
        <div style={{ marginTop: '12px' }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 0.8, textTransform: 'uppercase', color: '#aaa', marginBottom: 6 }}>
            Result
          </div>
          <div className="tool-result-value" style={{ fontSize: '1.35rem' }}>
            {title.includes('Cost Per Hire')
              ? `$${calcResult.result.toLocaleString('en-CA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
              : `${calcResult.result.toFixed(2)}${title === 'Time to Hire' ? ' days' : '%'}`}
          </div>
          <div style={{ fontSize: 11, color: '#666', marginTop: 8 }}>
            {explanation}
          </div>
        </div>
      )}
    </div>
  )
})
 
const Input = React.memo(function InputField({
  label,
  value,
  onChange,
  type = 'number',
}: {
  label: string
  value: string
  onChange: (val: string) => void
  type?: string
}) {
  return (
    <div>
      <label style={{ display: 'block', fontSize: 11, fontWeight: 700, letterSpacing: 0.8, textTransform: 'uppercase', color: '#aaa', marginBottom: 6 }}>
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        min="0"
        style={{
          width: '100%',
          padding: '10px 12px',
          border: '1.5px solid #ddd',
          borderRadius: 6,
          fontFamily: 'var(--font-roboto)',
          fontSize: 13,
          outline: 'none',
          color: '#111111',
          backgroundColor: '#ffffff',
        }}
      />
    </div>
  )
})
 
// ─── Main component ───────────────────────────────────────────────────────────
 
export default function HRFormulasCalculator() {
  // Absenteeism Rate
  const [absenceDays, setAbsenceDays] = useState('')
  const [workdays, setWorkdays] = useState('')
 
  // Employee Attrition Rate
  const [employeesLeft, setEmployeesLeft] = useState('')
  const [avgEmployees, setAvgEmployees] = useState('')
 
  // Employee Retention Rate
  const [employeesEnd, setEmployeesEnd] = useState('')
  const [employeesStart, setEmployeesStart] = useState('')
 
  // Internal Promotion Rate
  const [promotions, setPromotions] = useState('')
  const [positionsFilled, setPositionsFilled] = useState('')
 
  // Cost Per Hire
  const [recruitmentCosts, setRecruitmentCosts] = useState('')
  const [hires, setHires] = useState('')
 
  // Time to Hire
  const [dateApplied, setDateApplied] = useState('')
  const [dateAccepted, setDateAccepted] = useState('')
 
  // Offer Acceptance Rate
  const [offersAccepted, setOffersAccepted] = useState('')
  const [offersMade, setOffersMade] = useState('')
 
  // Human Capital ROI
  const [revenue, setRevenue] = useState('')
  const [compensationCosts, setCompensationCosts] = useState('')
 
  // Employee Engagement Score
  const [positiveResponses, setPositiveResponses] = useState('')
  const [totalResponses, setTotalResponses] = useState('')
 
  // Validation helper
  const validate = (numerator: string | number, denominator: string | number): { error?: string; result?: number } => {
    const num = parseFloat(String(numerator))
    const denom = parseFloat(String(denominator))
 
    if (isNaN(num) || isNaN(denom) || numerator === '' || denominator === '') {
      return { error: 'Enter all values' }
    }
    if (denom === 0) {
      return { error: 'Denominator cannot be 0' }
    }
    return { result: num / denom }
  }
 
  // Calculations
  const calcAbsenteeism = useMemo(() => {
    const v = validate(absenceDays, workdays)
    if (v.error) return v
    return { result: Math.round(v.result! * 100 * 100) / 100 }
  }, [absenceDays, workdays])
 
  const calcAttrition = useMemo(() => {
    const v = validate(employeesLeft, avgEmployees)
    if (v.error) return v
    return { result: Math.round(v.result! * 100 * 100) / 100 }
  }, [employeesLeft, avgEmployees])
 
  const calcRetention = useMemo(() => {
    const v = validate(employeesEnd, employeesStart)
    if (v.error) return v
    return { result: Math.round(v.result! * 100 * 100) / 100 }
  }, [employeesEnd, employeesStart])
 
  const calcPromotion = useMemo(() => {
    const v = validate(promotions, positionsFilled)
    if (v.error) return v
    return { result: Math.round(v.result! * 100 * 100) / 100 }
  }, [promotions, positionsFilled])
 
  const calcCostPerHire = useMemo(() => {
    const v = validate(recruitmentCosts, hires)
    if (v.error) return v
    return { result: Math.round(v.result! * 100) / 100 }
  }, [recruitmentCosts, hires])
 
  const calcTimeToHire = useMemo(() => {
    if (!dateApplied || !dateAccepted) return { error: 'Enter both dates' }
    const applied = new Date(dateApplied)
    const accepted = new Date(dateAccepted)
    if (accepted < applied) return { error: 'Acceptance date must be after application date' }
    const days = Math.round(((accepted.getTime() - applied.getTime()) / (1000 * 60 * 60 * 24)) * 100) / 100
    return { result: days }
  }, [dateApplied, dateAccepted])
 
  const calcOfferAcceptance = useMemo(() => {
    const v = validate(offersAccepted, offersMade)
    if (v.error) return v
    return { result: Math.round(v.result! * 100 * 100) / 100 }
  }, [offersAccepted, offersMade])
 
  const calcHumanCapitalROI = useMemo(() => {
    if (compensationCosts === '' || revenue === '') return { error: 'Enter all values' }
    const rev = parseFloat(revenue)
    const costs = parseFloat(compensationCosts)
    if (isNaN(rev) || isNaN(costs)) return { error: 'Enter all values' }
    if (costs === 0) return { error: 'Compensation costs cannot be 0' }
    return { result: Math.round(((rev - costs) / costs) * 100 * 100) / 100 }
  }, [revenue, compensationCosts])
 
  const calcEngagement = useMemo(() => {
    const v = validate(positiveResponses, totalResponses)
    if (v.error) return v
    return { result: Math.round(v.result! * 100 * 100) / 100 }
  }, [positiveResponses, totalResponses])
 
  // Schema for SEO
  const toolSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'HR Formulas Calculator',
    description: 'Calculate 9 core HR metrics instantly',
    applicationCategory: 'BusinessApplication',
    url: 'https://hillaryshr.blog/tools/hr-formulas-calculator',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'CAD' },
  }
 
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://hillaryshr.blog' },
      { '@type': 'ListItem', position: 2, name: 'Tools', item: 'https://hillaryshr.blog/tools' },
      { '@type': 'ListItem', position: 3, name: 'HR Formulas Calculator', item: 'https://hillaryshr.blog/tools/hr-formulas-calculator' },
    ],
  }
 
  return (
    <div className="tool-page">
      <div className="tool-page-inner">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(toolSchema) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
 
        {/* Header */}
        <div style={{ marginBottom: '48px' }}>
          <div style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#aaa', marginBottom: '16px' }}>
            Free HR Tool
          </div>
          <h1 className="tool-h1">HR Formulas Calculator</h1>
          <p style={{ fontSize: '14px', color: '#666', maxWidth: '600px', lineHeight: 1.6 }}>
            Enter your numbers and get instant results for 9 core HR metrics.
          </p>
        </div>
 
        {/* Formulas */}
        <div style={{ marginBottom: '40px' }}>
          <FormulaSection title="Absenteeism Rate" explanation="The percentage of work time lost due to absences. Lower is better." calcResult={calcAbsenteeism}>
            <Input label="Total Absence Days" value={absenceDays} onChange={setAbsenceDays} />
            <Input label="Total Available Workdays" value={workdays} onChange={setWorkdays} />
          </FormulaSection>
 
          <FormulaSection title="Employee Attrition Rate" explanation="The percentage of employees who left during the period. Helps track turnover trends." calcResult={calcAttrition}>
            <Input label="Employees Who Left" value={employeesLeft} onChange={setEmployeesLeft} />
            <Input label="Average Number of Employees" value={avgEmployees} onChange={setAvgEmployees} />
          </FormulaSection>
 
          <FormulaSection title="Employee Retention Rate" explanation="The percentage of employees retained from the start to end of the period. Higher is better." calcResult={calcRetention}>
            <Input label="Number of Employees at End of Period" value={employeesEnd} onChange={setEmployeesEnd} />
            <Input label="Number of Employees at Start" value={employeesStart} onChange={setEmployeesStart} />
          </FormulaSection>
 
          <FormulaSection title="Internal Promotion Rate" explanation="The percentage of positions filled by internal promotions. Higher indicates strong development culture." calcResult={calcPromotion}>
            <Input label="Total Number of Promotions" value={promotions} onChange={setPromotions} />
            <Input label="Total Positions Filled" value={positionsFilled} onChange={setPositionsFilled} />
          </FormulaSection>
 
          <FormulaSection title="Cost Per Hire" explanation="The average cost to recruit, interview, and onboard one new employee." calcResult={calcCostPerHire}>
            <Input label="Total Recruitment Costs (CAD)" value={recruitmentCosts} onChange={setRecruitmentCosts} />
            <Input label="Number of Hires" value={hires} onChange={setHires} />
          </FormulaSection>
 
          <FormulaSection title="Time to Hire" explanation="The number of calendar days from application to offer acceptance. Lower is more efficient." calcResult={calcTimeToHire}>
            <Input label="Date Candidate Applied" value={dateApplied} onChange={setDateApplied} type="date" />
            <Input label="Date of Offer Acceptance" value={dateAccepted} onChange={setDateAccepted} type="date" />
          </FormulaSection>
 
          <FormulaSection title="Offer Acceptance Rate" explanation="The percentage of job offers that are accepted. Indicates role and offer competitiveness." calcResult={calcOfferAcceptance}>
            <Input label="Offers Accepted" value={offersAccepted} onChange={setOffersAccepted} />
            <Input label="Offers Made" value={offersMade} onChange={setOffersMade} />
          </FormulaSection>
 
          <FormulaSection title="Human Capital ROI" explanation="The return on investment from your total payroll and compensation spend. Helps assess workforce profitability." calcResult={calcHumanCapitalROI}>
            <Input label="Total Revenue (CAD)" value={revenue} onChange={setRevenue} />
            <Input label="Total Compensation Costs (CAD)" value={compensationCosts} onChange={setCompensationCosts} />
          </FormulaSection>
 
          <FormulaSection title="Employee Engagement Score" explanation="The percentage of survey responses that were positive. Higher indicates better morale and engagement." calcResult={calcEngagement}>
            <Input label="Sum of Positive Responses" value={positiveResponses} onChange={setPositiveResponses} />
            <Input label="Total Responses" value={totalResponses} onChange={setTotalResponses} />
          </FormulaSection>
        </div>
 
        {/* Disclaimer */}
        <div style={{ maxWidth: '600px', margin: '0 auto', padding: '24px', background: '#ffffff', border: '1px solid #e8e6e1', borderRadius: 8, textAlign: 'center', fontSize: '12px', color: '#aaa', marginBottom: '24px' }}>
          Not legal or financial advice. Verify calculations with qualified professionals before relying on them.
        </div>
 
        {/* Back to Tools */}
        <div style={{ maxWidth: '600px', margin: '0 auto', padding: '24px', background: '#ffffff', border: '1px solid #e8e6e1', borderRadius: 8, textAlign: 'center', fontSize: '12px', color: '#aaa' }}>
          <Link href="/tools" style={{ color: '#c0392b', textDecoration: 'none', fontWeight: 600 }}>
            ← Back to Tools
          </Link>
        </div>
      </div>
    </div>
  )
}
 