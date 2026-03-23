'use client'
import { useState } from 'react'
import Link from 'next/link'

type Province = {
  name: string
  code: string
  vacationAfterYear1: number
  vacationAfterYear5?: number
  vacationDaysYear1: number
  vacationDaysYear5?: number
  sickDays: number
  sickDaysPaid: number
  personalDays: number
  maternityWeeks: number
  parentalWeeks: number
  notes: string[]
}

const PROVINCES: Province[] = [
  { code:'ON', name:'Ontario', vacationAfterYear1:4, vacationAfterYear5:6, vacationDaysYear1:10, vacationDaysYear5:15, sickDays:3, sickDaysPaid:3, personalDays:3, maternityWeeks:17, parentalWeeks:61, notes:['3 paid sick days under ESA', 'Vacation pay increases to 6% after 5 years'] },
  { code:'BC', name:'British Columbia', vacationAfterYear1:4, vacationAfterYear5:6, vacationDaysYear1:10, vacationDaysYear5:15, sickDays:5, sickDaysPaid:5, personalDays:0, maternityWeeks:17, parentalWeeks:61, notes:['5 paid sick days under Employment Standards Act', 'Vacation increases to 6% after 5 years'] },
  { code:'AB', name:'Alberta', vacationAfterYear1:4, vacationAfterYear5:6, vacationDaysYear1:10, vacationDaysYear5:15, sickDays:0, sickDaysPaid:0, personalDays:0, maternityWeeks:16, parentalWeeks:61, notes:['No mandated paid sick days', 'Vacation increases to 3 weeks after 5 years'] },
  { code:'QC', name:'Quebec', vacationAfterYear1:4, vacationAfterYear5:6, vacationDaysYear1:10, vacationDaysYear5:15, sickDays:3, sickDaysPaid:2, personalDays:2, maternityWeeks:18, parentalWeeks:52, notes:['2 paid + additional sick days', '3 weeks vacation after 5 years'] },
  { code:'MB', name:'Manitoba', vacationAfterYear1:4, vacationAfterYear5:6, vacationDaysYear1:10, vacationDaysYear5:15, sickDays:3, sickDaysPaid:3, personalDays:0, maternityWeeks:17, parentalWeeks:61, notes:['3 paid sick days per year', 'Vacation increases after 5 years'] },
  { code:'SK', name:'Saskatchewan', vacationAfterYear1:4, vacationAfterYear5:6, vacationDaysYear1:10, vacationDaysYear5:15, sickDays:10, sickDaysPaid:0, personalDays:0, maternityWeeks:18, parentalWeeks:61, notes:['10 days unpaid sick leave', 'Vacation increases after 5 years'] },
  { code:'NS', name:'Nova Scotia', vacationAfterYear1:4, vacationAfterYear5:6, vacationDaysYear1:10, vacationDaysYear5:15, sickDays:3, sickDaysPaid:3, personalDays:0, maternityWeeks:17, parentalWeeks:61, notes:['3 paid sick days per year', 'Vacation increases after 5 years'] },
  { code:'NB', name:'New Brunswick', vacationAfterYear1:4, vacationAfterYear5:6, vacationDaysYear1:10, vacationDaysYear5:15, sickDays:5, sickDaysPaid:5, personalDays:0, maternityWeeks:17, parentalWeeks:61, notes:['5 paid sick days per year', 'Vacation increases after 5 years'] },
  { code:'NL', name:'Newfoundland & Labrador', vacationAfterYear1:4, vacationAfterYear5:6, vacationDaysYear1:10, vacationDaysYear5:15, sickDays:7, sickDaysPaid:0, personalDays:3, maternityWeeks:17, parentalWeeks:61, notes:['7 unpaid sick days per year', 'Vacation increases after 5 years'] },
  { code:'PEI', name:'Prince Edward Island', vacationAfterYear1:4, vacationAfterYear5:6, vacationDaysYear1:10, vacationDaysYear5:15, sickDays:3, sickDaysPaid:1, personalDays:0, maternityWeeks:17, parentalWeeks:61, notes:['1 paid + 2 unpaid sick days', 'Vacation increases after 5 years'] },
  { code:'YT', name:'Yukon', vacationAfterYear1:4, vacationAfterYear5:6, vacationDaysYear1:10, vacationDaysYear5:15, sickDays:12, sickDaysPaid:12, personalDays:0, maternityWeeks:17, parentalWeeks:61, notes:['12 paid sick days per year', 'Most generous in Canada'] },
  { code:'NT', name:'Northwest Territories', vacationAfterYear1:4, vacationAfterYear5:6, vacationDaysYear1:10, vacationDaysYear5:15, sickDays:0, sickDaysPaid:0, personalDays:0, maternityWeeks:17, parentalWeeks:61, notes:['No mandated sick days', 'Vacation after 5 years'] },
  { code:'NU', name:'Nunavut', vacationAfterYear1:4, vacationAfterYear5:6, vacationDaysYear1:10, vacationDaysYear5:15, sickDays:0, sickDaysPaid:0, personalDays:0, maternityWeeks:17, parentalWeeks:61, notes:['Same as NWT legislation', 'No mandated sick days'] },
]

function getVacationEntitlement(p: Province, yearsOfService: number): { percent: number; days: number } {
  if (yearsOfService >= 5 && p.vacationAfterYear5) {
    return { percent: p.vacationAfterYear5, days: p.vacationDaysYear5! }
  }
  return { percent: p.vacationAfterYear1, days: p.vacationDaysYear1 }
}

export default function PTOCalculator() {
  const [province, setProvince] = useState('ON')
  const [years, setYears] = useState(2)
  const [salary, setSalary] = useState(75000)
  const [copied, setCopied] = useState(false)

  const prov = PROVINCES.find(p => p.code === province)!
  const { percent: vacPct, days: vacDays } = getVacationEntitlement(prov, years)
  const vacPayDollars = Math.round((salary * (vacPct / 100)) * 100) / 100

  function copyResults() {
    const text = `PTO & LEAVE SUMMARY — ${prov.name}\n\nYears: ${years}\nSalary: $${salary.toLocaleString()}\n\nVACATION: ${vacDays} days (${vacPct}% = $${vacPayDollars.toLocaleString()})\nSICK DAYS: ${prov.sickDays} (${prov.sickDaysPaid} paid)\nMATERNITY: ${prov.maternityWeeks} weeks\nPARENTAL: ${prov.parentalWeeks} weeks\n\nGenerated by Hillary&apos;s HR Blog`
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const Card = ({ title, val, sub }: { title: string; val: string; sub?: string }) => (
    <div style={{ background: '#fff', border:'1px solid #e8e6e1', borderRadius:8, padding:'20px' }}>
      <div style={{ fontSize:11, fontWeight:700, letterSpacing:1, textTransform:'uppercase', color:'#aaa', marginBottom:8 }}>{title}</div>
      <div style={{ fontFamily:'var(--font-newsreader)', fontSize:28, fontWeight:600, color:'#1a1a1a', lineHeight:1 }}>{val}</div>
      {sub && <div style={{ fontSize:11, color:'#666', marginTop:6 }}>{sub}</div>}
    </div>
  )

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '48px 32px 80px' }}>
      {/* Header */}
      <div style={{ marginBottom: '48px' }}>
        <div style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#aaa', marginBottom: '16px' }}>Free HR Tool</div>
        <h1 style={{ fontFamily: 'var(--font-newsreader)', fontSize: '48px', fontWeight: 300, color: '#1a1a1a', lineHeight: 1, marginBottom: '16px' }}>PTO & Leave Calculator</h1>
        <p style={{ fontSize: '14px', color: '#666', maxWidth: '600px', lineHeight: 1.6 }}>Model vacation and leave entitlements across all 13 Canadian jurisdictions.</p>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'300px 1fr', gap:40, marginBottom:40 }}>

        {/* INPUTS */}
        <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
          <div>
            <label style={{ display:'block', fontSize:11, fontWeight:700, letterSpacing:1, textTransform:'uppercase', color:'#aaa', marginBottom:10 }}>Province</label>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:6 }}>
              {PROVINCES.map(p => (
                <button key={p.code} onClick={()=>setProvince(p.code)}
                  style={{ padding:'8px 10px', borderRadius:6, fontSize:11, fontWeight:600, cursor:'pointer', textAlign:'left', border:'1.5px solid', borderColor: province===p.code ? '#1a1a1a' : '#ddd', background: province===p.code ? '#1a1a1a' : '#fff', color: province===p.code ? '#fff' : '#1a1a1a', transition:'all .15s' }}>
                  {p.code}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label style={{ display:'block', fontSize:11, fontWeight:700, letterSpacing:1, textTransform:'uppercase', color:'#aaa', marginBottom:8 }}>Years: <span style={{ color:'#1a1a1a', fontSize:14 }}>{years}</span></label>
            <input type="range" min={0} max={25} step={1} value={years} onChange={e=>setYears(+e.target.value)} style={{ width:'100%' }} />
          </div>

          <div>
            <label style={{ display:'block', fontSize:11, fontWeight:700, letterSpacing:1, textTransform:'uppercase', color:'#aaa', marginBottom:8 }}>Annual Salary</label>
            <input type="number" value={salary} onChange={e=>setSalary(+e.target.value)} min={0} step={1000}
              style={{ width:'100%', padding:'10px 12px', border:'1.5px solid #ddd', borderRadius:6, fontFamily:'var(--font-roboto)', fontSize:13, outline:'none' }} />
          </div>

          <button onClick={copyResults} style={{ padding:'10px 14px', background: copied ? '#27ae60' : '#c0392b', color:'#fff', border:'none', borderRadius:6, cursor:'pointer', fontWeight:600, fontSize:12, marginTop:'auto' }}>{copied ? '✓ Copied' : 'Copy Summary'}</button>
        </div>

        {/* RESULTS */}
        <div>
          <div style={{ marginBottom:20 }}>
            <div style={{ fontFamily:'var(--font-newsreader)', fontSize:18, fontWeight:600, color:'#1a1a1a', marginBottom:12 }}>{prov.name} — {years} Year{years!==1?'s':''}</div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:12 }}>
              <Card title="Vacation Days" val={`${vacDays} days`} sub={`${vacPct}% of wages`} />
              <Card title="Vacation Pay" val={`$${vacPayDollars.toLocaleString()}`} sub={`From $${salary.toLocaleString()}`} />
              <Card title="Sick Days" val={`${prov.sickDays}`} sub={`${prov.sickDaysPaid} paid`} />
            </div>
          </div>

          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:12, marginBottom:20 }}>
            <Card title="Personal Days" val={`${prov.personalDays}`} />
            <Card title="Maternity" val={`${prov.maternityWeeks} wks`} />
            <Card title="Parental" val={`${prov.parentalWeeks} wks`} />
          </div>

          {prov.notes.length > 0 && (
            <div style={{ background:'#f9f8f6', border:'1px solid #e8e6e1', borderRadius:8, padding:16 }}>
              <div style={{ fontWeight:700, color:'#1a1a1a', marginBottom:8, fontSize:12 }}>Province Notes</div>
              {prov.notes.map((n, i) => (
                <div key={i} style={{ fontSize:12, color:'#666', marginBottom: i < prov.notes.length-1 ? 6 : 0 }}>• {n}</div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div style={{ maxWidth:'600px', margin:'0 auto', padding:'24px', background:'#f9f8f6', border:'1px solid #e8e6e1', borderRadius:8, textAlign:'center', fontSize:'12px', color:'#aaa' }}>
        <Link href="/tools" style={{ color:'#c0392b', textDecoration:'none', fontWeight:600 }}>← Back to Tools</Link>
      </div>
    </div>
  )
}
