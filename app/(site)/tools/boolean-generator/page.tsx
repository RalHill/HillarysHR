'use client'
import { useState, useRef } from 'react'
import Link from 'next/link'

const ROLE_TEMPLATES: Record<string, { titles: string[]; skills: string[]; exclude: string[] }> = {
  'HR Generalist': {
    titles: ['HR Generalist', 'Human Resources Generalist', 'HR Coordinator', 'People Operations Generalist'],
    skills: ['HRIS', 'onboarding', 'employee relations', 'benefits administration', 'HRPA', 'CHRP'],
    exclude: ['VP', 'Director', 'Chief', 'intern', 'student'],
  },
  'Labour Relations Specialist': {
    titles: ['Labour Relations Specialist', 'Labour Relations Advisor', 'LR Consultant', 'Employee Relations Specialist'],
    skills: ['collective bargaining', 'grievance', 'arbitration', 'CBA', 'union', 'ESA'],
    exclude: ['intern', 'student', 'assistant'],
  },
  'Recruiter / Talent Acquisition': {
    titles: ['Recruiter', 'Talent Acquisition Specialist', 'Technical Recruiter', 'Corporate Recruiter', 'Talent Acquisition Partner'],
    skills: ['sourcing', 'ATS', 'Boolean', 'LinkedIn Recruiter', 'full-cycle recruiting', 'Workday'],
    exclude: ['agency', 'staffing', 'intern', 'junior'],
  },
  'Custom': { titles: [], skills: [], exclude: [] },
}

const PLATFORMS = ['LinkedIn', 'LinkedIn X-Ray (Google)', 'Indeed', 'ATS / General']

function buildBoolean(
  titles: string[],
  skills: string[],
  exclude: string[],
  location: string,
  platform: string,
  mustHaveAll: boolean,
): string {
  if (!titles.length && !skills.length) return ''

  const quote = (t: string) => t.includes(' ') ? `"${t}"` : t
  const titlesStr = titles.length
    ? `(${titles.map(quote).join(' OR ')})`
    : ''
  const skillsJoin = mustHaveAll ? ' AND ' : ' OR '
  const skillsStr = skills.length
    ? `(${skills.map(quote).join(skillsJoin)})`
    : ''

  const excludeStr = exclude.length
    ? exclude.map(e => `-${quote(e)}`).join(' ')
    : ''

  let core = [titlesStr, skillsStr].filter(Boolean).join(' AND ')
  if (location) core = `${core} "${location}"`
  if (excludeStr) core = `${core} ${excludeStr}`

  if (platform === 'LinkedIn X-Ray (Google)') {
    return `site:linkedin.com/in ${core}`
  }
  return core
}

const Tag = ({ val, arr, set }: { val: string; arr: string[]; set: (v: string[]) => void }) => (
  <span style={{ display:'inline-flex', alignItems:'center', gap:4, background:'#f0ede8', border:'1px solid #ddd', padding:'4px 10px', borderRadius:100, fontSize:12, fontWeight:500 }}>
    {val}
    <button onClick={() => set(arr.filter(x => x !== val))} style={{ background:'none', border:'none', cursor:'pointer', color:'#aaa', fontSize:14, lineHeight:1, padding:0 }}>×</button>
  </span>
)

const AddInput = ({ val, set, arr, setArr, placeholder, inputRef }: { val: string; set: (v:string)=>void; arr: string[]; setArr: (v:string[])=>void; placeholder: string; inputRef: React.RefObject<HTMLInputElement | null> }) => (
  <div className="tool-add-row">
    <input
      ref={inputRef}
      value={val}
      onChange={e => set(e.target.value)}
      onKeyDown={e => { if (e.key === 'Enter' && val.trim() && !arr.includes(val.trim())) { setArr([...arr, val.trim()]); set('') } }}
      placeholder={placeholder}
      style={{ padding:'8px 12px', border:'1.5px solid #ddd', borderRadius:6, fontFamily:'var(--font-roboto)', fontSize:13, background:'#ffffff', color:'#111111', outline:'none' }}
    />
    <button
      type="button"
      onClick={() => { if (val.trim() && !arr.includes(val.trim())) { setArr([...arr, val.trim()]); set(''); inputRef.current?.focus() } }}
      style={{ padding:'8px 14px', background:'#1a1a1a', color:'#fff', border:'none', borderRadius:6, cursor:'pointer', fontWeight:600, fontSize:13, flexShrink:0 }}
    >Add</button>
  </div>
)

export default function BooleanGenerator() {
  const [role, setRole] = useState('Recruiter / Talent Acquisition')
  const [titles, setTitles] = useState<string[]>(ROLE_TEMPLATES['Recruiter / Talent Acquisition'].titles)
  const [skills, setSkills] = useState<string[]>(ROLE_TEMPLATES['Recruiter / Talent Acquisition'].skills)
  const [exclude, setExclude] = useState<string[]>(ROLE_TEMPLATES['Recruiter / Talent Acquisition'].exclude)
  const [location, setLocation] = useState('Toronto, ON')
  const [platform, setPlatform] = useState('LinkedIn')
  const [mustHaveAll, setMustHaveAll] = useState(false)
  const [copied, setCopied] = useState(false)
  const [titleInput, setTitleInput] = useState('')
  const [skillInput, setSkillInput] = useState('')
  const [excludeInput, setExcludeInput] = useState('')
  
  const titleInputRef = useRef<HTMLInputElement>(null)
  const skillInputRef = useRef<HTMLInputElement>(null)
  const excludeInputRef = useRef<HTMLInputElement>(null)

  const result = buildBoolean(titles, skills, exclude, location, platform, mustHaveAll)

  function handleRoleChange(r: string) {
    setRole(r)
    const tmpl = ROLE_TEMPLATES[r]
    setTitles([...tmpl.titles])
    setSkills([...tmpl.skills])
    setExclude([...tmpl.exclude])
    setTitleInput('')
    setSkillInput('')
    setExcludeInput('')
  }

  function copy() {
    navigator.clipboard.writeText(result)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const toolSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Boolean Search String Generator',
    description: 'Build precision Boolean search strings for LinkedIn, ATS, and Google X-Ray',
    applicationCategory: 'BusinessApplication',
    url: 'https://hillaryshr.blog/tools/boolean-generator',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'CAD',
    },
  }

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://hillaryshr.blog' },
      { '@type': 'ListItem', position: 2, name: 'Tools', item: 'https://hillaryshr.blog/tools' },
      { '@type': 'ListItem', position: 3, name: 'Boolean Generator', item: 'https://hillaryshr.blog/tools/boolean-generator' },
    ],
  }

  return (
    <div className="tool-page">
      <div className="tool-page-inner">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(toolSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      {/* Header */}
      <div style={{ marginBottom: '48px' }}>
        <div style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#aaa', marginBottom: '16px' }}>Free HR Tool</div>
        <h1 className="tool-h1">Boolean String Generator</h1>
        <p style={{ fontSize: '14px', color: '#666', maxWidth: '600px', lineHeight: 1.6 }}>Build precision search strings for LinkedIn, ATS, and Google X-Ray. Select a role template or build from scratch.</p>
      </div>

      <div className="tool-main-grid tool-main-grid--boolean">

        {/* LEFT: CONFIG */}
        <div style={{ display:'flex', flexDirection:'column', gap:24 }}>

          <div>
            <label style={{ display:'block', fontSize:11, fontWeight:700, letterSpacing:1, textTransform:'uppercase', color:'#aaa', marginBottom:10 }}>Role Template</label>
            <div style={{ display:'flex', flexWrap:'wrap', gap:8 }}>
              {Object.keys(ROLE_TEMPLATES).map(r => (
                <button key={r} onClick={() => handleRoleChange(r)}
                  style={{ padding:'6px 14px', borderRadius:6, fontSize:12, fontWeight:600, cursor:'pointer', border:'1.5px solid', borderColor: role === r ? '#1a1a1a' : '#ddd', background: role === r ? '#1a1a1a' : '#fff', color: role === r ? '#fff' : '#1a1a1a', transition:'all .15s' }}>
                  {r}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label style={{ display:'block', fontSize:11, fontWeight:700, letterSpacing:1, textTransform:'uppercase', color:'#aaa', marginBottom:10 }}>Job Titles (OR logic)</label>
            <div style={{ display:'flex', flexWrap:'wrap', gap:8, minHeight:40 }}>
              {titles.map(t => <Tag key={t} val={t} arr={titles} set={setTitles} />)}
            </div>
            <AddInput val={titleInput} set={setTitleInput} arr={titles} setArr={setTitles} placeholder="Add a job title..." inputRef={titleInputRef} />
          </div>

          <div>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:10 }}>
              <label style={{ fontSize:11, fontWeight:700, letterSpacing:1, textTransform:'uppercase', color:'#aaa' }}>Skills / Keywords</label>
              <div style={{ display:'flex', alignItems:'center', gap:8, fontSize:12 }}>
                <span style={{ color:'#aaa' }}>Must have all</span>
                <button onClick={() => setMustHaveAll(v => !v)}
                  style={{ width:40, height:22, borderRadius:11, background: mustHaveAll ? '#1a1a1a' : '#ddd', border:'none', cursor:'pointer', position:'relative', transition:'background .2s' }}>
                  <span style={{ position:'absolute', top:3, left: mustHaveAll ? 20 : 2, width:16, height:16, borderRadius:'50%', background:'white', transition:'left .2s' }} />
                </button>
              </div>
            </div>
            <div style={{ display:'flex', flexWrap:'wrap', gap:8, minHeight:40 }}>
              {skills.map(s => <Tag key={s} val={s} arr={skills} set={setSkills} />)}
            </div>
            <AddInput val={skillInput} set={setSkillInput} arr={skills} setArr={setSkills} placeholder="Add a skill..." inputRef={skillInputRef} />
          </div>

          <div>
            <label style={{ display:'block', fontSize:11, fontWeight:700, letterSpacing:1, textTransform:'uppercase', color:'#aaa', marginBottom:10 }}>Exclude Terms</label>
            <div style={{ display:'flex', flexWrap:'wrap', gap:8, minHeight:40 }}>
              {exclude.map(e => <Tag key={e} val={e} arr={exclude} set={setExclude} />)}
            </div>
            <AddInput val={excludeInput} set={setExcludeInput} arr={exclude} setArr={setExclude} placeholder="Add term to exclude..." inputRef={excludeInputRef} />
          </div>

          <div>
            <label style={{ display:'block', fontSize:11, fontWeight:700, letterSpacing:1, textTransform:'uppercase', color:'#aaa', marginBottom:8 }}>Location</label>
            <input value={location} onChange={e => setLocation(e.target.value)}
              placeholder="e.g. Toronto, ON"
              style={{ width:'100%', padding:'10px 14px', border:'1.5px solid #ddd', borderRadius:6, fontFamily:'var(--font-roboto)', fontSize:13, background:'#ffffff', color:'#111111', outline:'none' }} />
          </div>

          <div>
            <label style={{ display:'block', fontSize:11, fontWeight:700, letterSpacing:1, textTransform:'uppercase', color:'#aaa', marginBottom:10 }}>Platform</label>
            <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
              {PLATFORMS.map(p => (
                <button key={p} onClick={() => setPlatform(p)}
                  style={{ padding:'7px 14px', borderRadius:6, fontSize:12, fontWeight:500, cursor:'pointer', border:'1.5px solid', borderColor: platform === p ? '#1a1a1a' : '#ddd', background: platform === p ? '#1a1a1a' : '#fff', color: platform === p ? '#fff' : '#1a1a1a', transition:'all .15s' }}>
                  {p}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT: OUTPUT */}
        <div style={{ display:'flex', flexDirection:'column', gap:20, minWidth:0 }}>
          <div className="tool-card-elevated tool-boolean-sticky" style={{ padding:24 }}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:16, flexWrap:'wrap', gap:12 }}>
              <div>
                <div className="tool-accent-label" style={{ marginBottom:4 }}>Generated String</div>
                <div style={{ fontSize:13, color:'#666' }}>{platform}</div>
              </div>
              <button type="button" onClick={copy} style={{ display:'flex', alignItems:'center', gap:6, padding:'8px 14px', background:'#c0392b', color:'#fff', border:'none', borderRadius:6, cursor:'pointer', fontWeight:700, fontSize:12, transition:'all .2s' }}>
                {copied ? '✓ Copied' : 'Copy'}
              </button>
            </div>
            <div className="tool-output-mono">
              {result || <span className="tool-output-mono-placeholder">Add titles and skills to generate your string.</span>}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{ maxWidth:'600px', margin:'0 auto', padding:'24px', background:'#ffffff', border:'1px solid #e8e6e1', borderRadius:8, textAlign:'center', fontSize:'12px', color:'#aaa' }}>
        <Link href="/tools" style={{ color:'#c0392b', textDecoration:'none', fontWeight:600 }}>← Back to Tools</Link>
      </div>
      </div>
    </div>
  )
}
