export const TEMPLATES = [
  { id: 'modern',    name: 'Modern Pro',      isPremium: false, accent: '#6C63FF', category: 'tech',       desc: 'Clean ATS-friendly layout' },
  { id: 'minimal',   name: 'Minimal Clean',   isPremium: false, accent: '#00D4AA', category: 'general',    desc: 'Elegant minimal design' },
  { id: 'executive', name: 'Executive Dark',  isPremium: true,  accent: '#F5C542', category: 'management', desc: 'Bold executive presence' },
  { id: 'developer', name: 'Dev Focus',       isPremium: true,  accent: '#FF6B9D', category: 'tech',       desc: 'GitHub-style developer resume' },
  { id: 'creative',  name: 'Creative Edge',   isPremium: true,  accent: '#4ECDC4', category: 'design',     desc: 'Stand out with style' },
]

export default function ResumePreview({ data = {}, templateId = 'modern' }) {
  const t = TEMPLATES.find(t => t.id === templateId) || TEMPLATES[0]
  const accent = t.accent

  return (
    <div style={{ background: '#fff', color: '#111', fontFamily: "'Times New Roman', serif", padding: '32px 36px', minHeight: 560, fontSize: 11, lineHeight: 1.55 }}>
      {/* Header */}
      <div style={{ borderBottom: `2.5px solid ${accent}`, paddingBottom: 12, marginBottom: 14 }}>
        <div style={{ fontSize: 22, fontWeight: 700, fontFamily: 'sans-serif', letterSpacing: -0.5, color: '#111' }}>
          {data.name || 'Your Name'}
        </div>
        <div style={{ fontSize: 9.5, color: '#555', fontFamily: 'sans-serif', marginTop: 4, display: 'flex', flexWrap: 'wrap', gap: 12 }}>
          {data.email && <span>{data.email}</span>}
          {data.phone && <span>{data.phone}</span>}
          {data.location && <span>{data.location}</span>}
          {data.linkedin && <span>LinkedIn: {data.linkedin}</span>}
          {data.github && <span>GitHub: {data.github}</span>}
        </div>
      </div>

      {/* Summary */}
      {data.summary && (
        <Section title="Summary" accent={accent}>
          <p style={{ fontSize: 10, color: '#333' }}>{data.summary}</p>
        </Section>
      )}

      {/* Skills */}
      {data.skills?.length > 0 && (
        <Section title="Skills" accent={accent}>
          <div style={{ fontSize: 10, color: '#333' }}>{data.skills.join(' · ')}</div>
        </Section>
      )}

      {/* Experience */}
      {data.experience?.length > 0 && (
        <Section title="Experience" accent={accent}>
          {data.experience.map((exp, i) => (
            <div key={i} style={{ marginBottom: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'sans-serif' }}>
                <span style={{ fontWeight: 700, fontSize: 10 }}>{exp.role}</span>
                <span style={{ fontSize: 9, color: '#555' }}>{exp.dates}</span>
              </div>
              <div style={{ fontSize: 9, color: '#444', fontFamily: 'sans-serif', marginBottom: 3 }}>
                {exp.company}{exp.location ? ` — ${exp.location}` : ''}
              </div>
              {exp.bullets?.filter(Boolean).map((b, j) => (
                <div key={j} style={{ fontSize: 9.5, paddingLeft: 12, color: '#333', marginBottom: 2 }}>• {b}</div>
              ))}
            </div>
          ))}
        </Section>
      )}

      {/* Education */}
      {data.education?.length > 0 && (
        <Section title="Education" accent={accent}>
          {data.education.map((edu, i) => (
            <div key={i} style={{ marginBottom: 8 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'sans-serif' }}>
                <span style={{ fontWeight: 700, fontSize: 10 }}>{edu.school}</span>
                <span style={{ fontSize: 9, color: '#555' }}>{edu.dates}</span>
              </div>
              <div style={{ fontSize: 9, color: '#444', fontFamily: 'sans-serif' }}>
                {edu.degree}{edu.gpa ? ` · GPA: ${edu.gpa}` : ''}
              </div>
              {edu.coursework && <div style={{ fontSize: 9, color: '#666', fontFamily: 'sans-serif' }}>Coursework: {edu.coursework}</div>}
            </div>
          ))}
        </Section>
      )}

      {/* Projects */}
      {data.projects?.length > 0 && (
        <Section title="Projects" accent={accent}>
          {data.projects.map((p, i) => (
            <div key={i} style={{ marginBottom: 8 }}>
              <div style={{ fontWeight: 700, fontSize: 10, fontFamily: 'sans-serif' }}>{p.name}</div>
              <div style={{ fontSize: 9.5, color: '#333' }}>{p.desc}</div>
              {p.tech && <div style={{ fontSize: 9, color: '#666', fontFamily: 'sans-serif' }}>Tech: {p.tech}</div>}
            </div>
          ))}
        </Section>
      )}

      {/* Certifications */}
      {data.certifications?.length > 0 && (
        <Section title="Certifications" accent={accent}>
          {data.certifications.map((c, i) => (
            <div key={i} style={{ fontSize: 9.5, color: '#333' }}>• {c}</div>
          ))}
        </Section>
      )}
    </div>
  )
}

function Section({ title, accent, children }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ fontSize: 10, fontWeight: 700, color: accent, fontFamily: 'sans-serif', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 }}>{title}</div>
      {children}
    </div>
  )
}
