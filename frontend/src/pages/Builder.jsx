import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { resumeAPI } from '../utils/api'
import { useToast } from '../hooks/useToast'
import Toast from '../components/Toast'
import ResumePreview, { TEMPLATES } from '../components/ResumePreview'
import PaymentModal from '../components/PaymentModal'
import AIModal from '../components/AIModal'

const BLANK = {
  name: '', email: '', phone: '', location: '', linkedin: '', github: '', summary: '',
  skills: [], experience: [], education: [], projects: [], certifications: [],
}

const inputCls = 'w-full bg-elevated border border-border rounded-xl px-4 py-2.5 text-white text-sm outline-none transition-colors focus:border-accent placeholder:text-muted'
const labelCls = 'block text-[11px] font-bold text-muted uppercase tracking-wider mb-1.5'
const sectionCls = 'card p-5 mb-4'

export default function Builder() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { toasts, toast, remove } = useToast()

  const [data, setData] = useState(BLANK)
  const [templateId, setTemplateId] = useState('modern')
  const [saving, setSaving] = useState(false)
  const [resumeId, setResumeId] = useState(id || null)
  const [skillInput, setSkillInput] = useState('')
  const [certInput, setCertInput] = useState('')
  const [showPayment, setShowPayment] = useState(false)
  const [aiModal, setAIModal] = useState(null) // { label, key }

  useEffect(() => {
    if (id) {
      resumeAPI.get(id).then(r => {
        setData(r.data.resume.data || BLANK)
        setTemplateId(r.data.resume.templateId || 'modern')
      }).catch(() => toast('Could not load resume', 'error'))
    }
  }, [id])

  const set = (field, val) => setData(d => ({ ...d, [field]: val }))

  const save = async () => {
    if (!data.name) return toast('Please add your name first', 'error')
    setSaving(true)
    try {
      if (resumeId) {
        await resumeAPI.update(resumeId, { name: data.name, templateId, data })
        toast('Resume saved!', 'success')
      } else {
        const res = await resumeAPI.create({ name: data.name, templateId, data })
        setResumeId(res.data.resume._id)
        navigate(`/builder/${res.data.resume._id}`, { replace: true })
        toast('Resume created!', 'success')
      }
    } catch { toast('Save failed', 'error') }
    setSaving(false)
  }

  // Experience helpers
  const addExp = () => set('experience', [...data.experience, { role: '', company: '', location: '', dates: '', bullets: [''] }])
  const updateExp = (i, f, v) => { const e = [...data.experience]; e[i] = { ...e[i], [f]: v }; set('experience', e) }
  const removeExp = (i) => set('experience', data.experience.filter((_, idx) => idx !== i))
  const addBullet = (i) => { const e = [...data.experience]; e[i].bullets = [...(e[i].bullets || []), '']; set('experience', e) }
  const updateBullet = (i, j, v) => { const e = [...data.experience]; e[i].bullets[j] = v; set('experience', e) }
  const removeBullet = (i, j) => { const e = [...data.experience]; e[i].bullets = e[i].bullets.filter((_, idx) => idx !== j); set('experience', e) }

  // Education helpers
  const addEdu = () => set('education', [...data.education, { school: '', degree: '', dates: '', gpa: '', coursework: '' }])
  const updateEdu = (i, f, v) => { const e = [...data.education]; e[i] = { ...e[i], [f]: v }; set('education', e) }
  const removeEdu = (i) => set('education', data.education.filter((_, idx) => idx !== i))

  // Project helpers
  const addProj = () => set('projects', [...data.projects, { name: '', desc: '', tech: '', link: '' }])
  const updateProj = (i, f, v) => { const p = [...data.projects]; p[i] = { ...p[i], [f]: v }; set('projects', p) }
  const removeProj = (i) => set('projects', data.projects.filter((_, idx) => idx !== i))

  return (
    <div className="flex h-screen overflow-hidden font-syne">
      {/* ─── LEFT: Editor ─── */}
      <div className="w-1/2 bg-bg border-r border-border overflow-y-auto flex flex-col">
        {/* Toolbar */}
        <div className="sticky top-0 z-10 bg-bg border-b border-border px-5 py-3 flex items-center justify-between">
          <div>
            <div className="font-bold text-base">Resume Builder</div>
            <div className="text-muted text-xs">Fill in your details · Preview updates live</div>
          </div>
          <div className="flex gap-2">
            <button onClick={save} disabled={saving}
              className="px-4 py-2 rounded-lg text-sm font-bold text-black border-none cursor-pointer"
              style={{ background: '#00D4AA', opacity: saving ? 0.7 : 1 }}>
              {saving ? 'Saving...' : 'Save'}
            </button>
            <button onClick={() => setShowPayment(true)}
              className="btn-primary px-4 py-2 text-sm flex items-center gap-1.5">
              ↓ PDF
            </button>
          </div>
        </div>

        <div className="p-5 flex-1">
          {/* Personal Info */}
          <div className={sectionCls}>
            <div className="text-sm font-bold text-white mb-4">Personal Information</div>
            <div className="grid grid-cols-2 gap-3">
              {[['Full Name','name'],['Email','email'],['Phone','phone'],['Location','location'],['LinkedIn','linkedin'],['GitHub','github']].map(([label, key]) => (
                <div key={key}>
                  <label className={labelCls}>{label}</label>
                  <input value={data[key] || ''} onChange={e => set(key, e.target.value)} placeholder={label} className={inputCls} />
                </div>
              ))}
            </div>
          </div>

          {/* Summary */}
          <div className={sectionCls}>
            <div className="flex items-center justify-between mb-4">
              <div className="text-sm font-bold text-white">Professional Summary</div>
              <button onClick={() => setAIModal({ label: 'Professional Summary', key: 'summary' })}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-white border-none cursor-pointer"
                style={{ background: 'linear-gradient(135deg, #6C63FF, #A78BFA)' }}>
                ✦ AI Write
              </button>
            </div>
            <textarea value={data.summary || ''} onChange={e => set('summary', e.target.value)}
              placeholder="Write a compelling professional summary..." rows={4}
              className={inputCls + ' resize-y'} style={{ fontFamily: 'inherit' }} />
          </div>

          {/* Skills */}
          <div className={sectionCls}>
            <div className="text-sm font-bold text-white mb-4">Skills</div>
            <div className="flex gap-2 mb-3">
              <input value={skillInput} onChange={e => setSkillInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') { if (skillInput.trim()) { set('skills', [...data.skills, skillInput.trim()]); setSkillInput('') } } }}
                placeholder="Add a skill and press Enter..." className={inputCls} style={{ flex: 1 }} />
              <button onClick={() => { if (skillInput.trim()) { set('skills', [...data.skills, skillInput.trim()]); setSkillInput('') } }}
                className="px-4 py-2 rounded-xl font-bold text-white text-sm border-none cursor-pointer"
                style={{ background: '#6C63FF' }}>+</button>
            </div>
            <div className="flex flex-wrap gap-2">
              {data.skills.map((s, i) => (
                <span key={i} className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[#A5A0FF] text-sm"
                  style={{ background: '#6C63FF22', border: '1px solid #6C63FF44' }}>
                  {s}
                  <button onClick={() => set('skills', data.skills.filter((_, idx) => idx !== i))}
                    className="text-muted hover:text-white bg-transparent border-none cursor-pointer text-base leading-none">×</button>
                </span>
              ))}
            </div>
          </div>

          {/* Experience */}
          <div className={sectionCls}>
            <div className="flex items-center justify-between mb-4">
              <div className="text-sm font-bold text-white">Work Experience</div>
              <button onClick={addExp} className="px-3 py-1.5 rounded-lg text-xs font-bold text-[#A5A0FF] border border-[#6C63FF] bg-transparent cursor-pointer">+ Add</button>
            </div>
            {data.experience.map((exp, i) => (
              <div key={i} className="bg-elevated rounded-xl p-4 mb-3 border border-border">
                <div className="flex justify-end mb-2">
                  <button onClick={() => removeExp(i)} className="text-[#FF5B5B] text-xs bg-transparent border-none cursor-pointer">Remove</button>
                </div>
                <div className="grid grid-cols-2 gap-3 mb-3">
                  {[['Job Title / Role','role'],['Company','company'],['Location','location'],['Dates (e.g. Jan 2023–Present)','dates']].map(([label, key]) => (
                    <div key={key}>
                      <label className={labelCls}>{label}</label>
                      <input value={exp[key] || ''} onChange={e => updateExp(i, key, e.target.value)} placeholder={label} className={inputCls} />
                    </div>
                  ))}
                </div>
                <label className={labelCls}>Bullet Points</label>
                {(exp.bullets || ['']).map((b, j) => (
                  <div key={j} className="flex gap-2 mb-2">
                    <input value={b} onChange={e => updateBullet(i, j, e.target.value)}
                      placeholder={`Achievement or responsibility ${j + 1}...`} className={inputCls} style={{ flex: 1 }} />
                    <button onClick={() => removeBullet(i, j)} className="text-muted hover:text-[#FF5B5B] bg-transparent border-none cursor-pointer">×</button>
                  </div>
                ))}
                <button onClick={() => addBullet(i)} className="text-[#A5A0FF] text-xs bg-transparent border-none cursor-pointer mt-1">+ Add bullet</button>
              </div>
            ))}
          </div>

          {/* Education */}
          <div className={sectionCls}>
            <div className="flex items-center justify-between mb-4">
              <div className="text-sm font-bold text-white">Education</div>
              <button onClick={addEdu} className="px-3 py-1.5 rounded-lg text-xs font-bold text-[#A5A0FF] border border-[#6C63FF] bg-transparent cursor-pointer">+ Add</button>
            </div>
            {data.education.map((edu, i) => (
              <div key={i} className="bg-elevated rounded-xl p-4 mb-3 border border-border">
                <div className="flex justify-end mb-2">
                  <button onClick={() => removeEdu(i)} className="text-[#FF5B5B] text-xs bg-transparent border-none cursor-pointer">Remove</button>
                </div>
                <div className="grid grid-cols-2 gap-3 mb-3">
                  {[['School / University','school'],['Degree','degree'],['Dates','dates'],['GPA (optional)','gpa']].map(([label, key]) => (
                    <div key={key}>
                      <label className={labelCls}>{label}</label>
                      <input value={edu[key] || ''} onChange={e => updateEdu(i, key, e.target.value)} placeholder={label} className={inputCls} />
                    </div>
                  ))}
                </div>
                <label className={labelCls}>Relevant Coursework</label>
                <input value={edu.coursework || ''} onChange={e => updateEdu(i, 'coursework', e.target.value)}
                  placeholder="Data Structures, Machine Learning, Algorithms..." className={inputCls} />
              </div>
            ))}
          </div>

          {/* Projects */}
          <div className={sectionCls}>
            <div className="flex items-center justify-between mb-4">
              <div className="text-sm font-bold text-white">Projects</div>
              <button onClick={addProj} className="px-3 py-1.5 rounded-lg text-xs font-bold text-[#A5A0FF] border border-[#6C63FF] bg-transparent cursor-pointer">+ Add</button>
            </div>
            {data.projects.map((p, i) => (
              <div key={i} className="bg-elevated rounded-xl p-4 mb-3 border border-border">
                <div className="flex justify-end mb-2">
                  <button onClick={() => removeProj(i)} className="text-[#FF5B5B] text-xs bg-transparent border-none cursor-pointer">Remove</button>
                </div>
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div>
                    <label className={labelCls}>Project Name</label>
                    <input value={p.name || ''} onChange={e => updateProj(i, 'name', e.target.value)} placeholder="Project Name" className={inputCls} />
                  </div>
                  <div>
                    <label className={labelCls}>Tech Stack</label>
                    <input value={p.tech || ''} onChange={e => updateProj(i, 'tech', e.target.value)} placeholder="React, Node.js, MongoDB..." className={inputCls} />
                  </div>
                </div>
                <label className={labelCls}>Description</label>
                <textarea value={p.desc || ''} onChange={e => updateProj(i, 'desc', e.target.value)}
                  placeholder="Describe the project and your impact..." rows={2}
                  className={inputCls + ' resize-y mb-3'} style={{ fontFamily: 'inherit' }} />
                <label className={labelCls}>Link (optional)</label>
                <input value={p.link || ''} onChange={e => updateProj(i, 'link', e.target.value)} placeholder="https://github.com/..." className={inputCls} />
              </div>
            ))}
          </div>

          {/* Certifications */}
          <div className={sectionCls}>
            <div className="text-sm font-bold text-white mb-4">Certifications</div>
            <div className="flex gap-2 mb-3">
              <input value={certInput} onChange={e => setCertInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter' && certInput.trim()) { set('certifications', [...data.certifications, certInput.trim()]); setCertInput('') } }}
                placeholder="e.g. AWS Certified Developer..." className={inputCls} style={{ flex: 1 }} />
              <button onClick={() => { if (certInput.trim()) { set('certifications', [...data.certifications, certInput.trim()]); setCertInput('') } }}
                className="px-4 py-2 rounded-xl font-bold text-white text-sm border-none cursor-pointer"
                style={{ background: '#6C63FF' }}>+</button>
            </div>
            <div className="flex flex-col gap-2">
              {data.certifications.map((c, i) => (
                <div key={i} className="flex items-center justify-between bg-elevated px-3 py-2 rounded-lg text-sm">
                  <span>✓ {c}</span>
                  <button onClick={() => set('certifications', data.certifications.filter((_, idx) => idx !== i))}
                    className="text-[#FF5B5B] bg-transparent border-none cursor-pointer">×</button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ─── RIGHT: Preview ─── */}
      <div className="w-1/2 bg-card overflow-y-auto flex flex-col">
        <div className="sticky top-0 z-10 bg-card border-b border-border px-5 py-3">
          <div className="font-bold text-sm mb-2">Template</div>
          <div className="flex gap-2 flex-wrap">
            {TEMPLATES.map(t => (
              <button key={t.id} onClick={() => setTemplateId(t.id)}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold border cursor-pointer transition-all"
                style={{
                  borderColor: templateId === t.id ? t.accent : '#1E2035',
                  background: templateId === t.id ? `${t.accent}22` : 'transparent',
                  color: templateId === t.id ? t.accent : '#7B7A9D',
                }}>
                {t.isPremium && '🔒 '}
                {t.name}
              </button>
            ))}
          </div>
        </div>
        <div className="p-4">
          <div style={{ transform: 'scale(0.82)', transformOrigin: 'top center', background: '#f5f5f5', borderRadius: 6 }}>
            <ResumePreview data={data} templateId={templateId} />
          </div>
        </div>
      </div>

      {showPayment && (
        <PaymentModal itemId={resumeId} itemName={data.name || 'Resume'}
          onClose={() => setShowPayment(false)}
          onSuccess={() => { setShowPayment(false); toast('Payment successful! Your PDF is ready.', 'success') }} />
      )}
      {aiModal && (
        <AIModal fieldLabel={aiModal.label}
          onClose={() => setAIModal(null)}
          onResult={(result) => {
            if (aiModal.key === 'summary') set('summary', result)
            toast('AI content applied!', 'success')
            setAIModal(null)
          }} />
      )}
      <Toast toasts={toasts} remove={remove} />
    </div>
  )
}
