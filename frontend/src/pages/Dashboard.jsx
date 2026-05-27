import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { resumeAPI, paymentAPI } from '../utils/api'
import { useToast } from '../hooks/useToast'
import Toast from '../components/Toast'
import PaymentModal from '../components/PaymentModal'
import { TEMPLATES } from '../components/ResumePreview'

export default function Dashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const { toasts, toast, remove } = useToast()
  const [resumes, setResumes] = useState([])
  const [payments, setPayments] = useState([])
  const [loading, setLoading] = useState(true)
  const [payTarget, setPayTarget] = useState(null)

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  useEffect(() => {
    const load = async () => {
      try {
        const [r, p] = await Promise.all([resumeAPI.list(), paymentAPI.history()])
        setResumes(r.data.resumes)
        setPayments(p.data.payments)
      } catch { toast('Failed to load data', 'error') }
      setLoading(false)
    }
    load()
  }, [])

  const deleteResume = async (id) => {
    try {
      await resumeAPI.delete(id)
      setResumes(rs => rs.filter(r => r._id !== id))
      toast('Resume deleted', 'info')
    } catch { toast('Delete failed', 'error') }
  }

  const handleDownload = (resume) => {
    setPayTarget({ itemId: resume._id, itemName: resume.name || 'Resume' })
  }

  const STATS = [
    { label: 'Total Resumes', val: resumes.length,  color: '#6C63FF' },
    { label: 'Downloads',     val: payments.length, color: '#00D4AA' },
    { label: 'Total Spent',   val: `$${payments.reduce((a, p) => a + p.amount, 0)}`, color: '#F5C542' },
  ]

  return (
    <div className="p-8 font-syne">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-black tracking-tight">{greeting}, {user?.name} 👋</h1>
        <p className="text-muted mt-1">Here's an overview of your resume activity</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {STATS.map((s, i) => (
          <div key={i} className="card p-5">
            <div className="text-muted text-xs font-semibold uppercase tracking-wider mb-2">{s.label}</div>
            <div className="text-3xl font-black" style={{ color: s.color }}>{s.val}</div>
          </div>
        ))}
      </div>

      {/* Resumes header */}
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg font-bold">Your Resumes</h2>
        <button onClick={() => navigate('/builder')} className="btn-primary text-sm px-5 py-2">
          + New Resume
        </button>
      </div>

      {loading ? (
        <div className="text-muted text-center py-16">Loading...</div>
      ) : resumes.length === 0 ? (
        <div className="card p-12 text-center border-dashed">
          <div className="text-5xl mb-4">📄</div>
          <p className="text-muted mb-4">No resumes yet. Create your first one!</p>
          <button onClick={() => navigate('/builder')} className="btn-primary px-6 py-2 text-sm">
            + Create Resume
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {resumes.map(r => {
            const t = TEMPLATES.find(t => t.id === r.templateId) || TEMPLATES[0]
            return (
              <div key={r._id} className="card overflow-hidden hover:border-[#6C63FF55] transition-all">
                <div className="h-28 flex items-center justify-center text-4xl"
                  style={{ background: `linear-gradient(135deg, ${t.accent}33, ${t.accent}55)` }}>📄</div>
                <div className="p-4">
                  <div className="font-bold mb-1 truncate">{r.data?.name || r.name || 'Untitled'}</div>
                  <div className="text-muted text-xs mb-4">
                    {t.name} · {new Date(r.createdAt).toLocaleDateString()}
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => navigate(`/builder/${r._id}`)}
                      className="flex-1 py-2 rounded-lg border border-border text-sm font-medium hover:bg-elevated transition-all cursor-pointer bg-transparent text-white">
                      Edit
                    </button>
                    <button onClick={() => handleDownload(r)}
                      className="flex-1 py-2 rounded-lg text-sm font-bold text-white cursor-pointer border-none"
                      style={{ background: 'linear-gradient(135deg, #6C63FF, #4F46E5)' }}>
                      Download
                    </button>
                    <button onClick={() => deleteResume(r._id)}
                      className="px-3 py-2 rounded-lg border border-border text-[#FF5B5B] hover:bg-[#FF5B5B15] transition-all cursor-pointer bg-transparent text-sm">
                      🗑
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {payTarget && (
        <PaymentModal
          itemId={payTarget.itemId}
          itemName={payTarget.itemName}
          onClose={() => setPayTarget(null)}
          onSuccess={() => { setPayTarget(null); toast('Payment successful! PDF downloading...', 'success') }}
        />
      )}
      <Toast toasts={toasts} remove={remove} />
    </div>
  )
}
