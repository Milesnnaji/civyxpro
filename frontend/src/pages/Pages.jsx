// ─── Templates.jsx ───────────────────────────────────────────────────────────
import { useNavigate } from 'react-router-dom'
import { TEMPLATES } from '../components/ResumePreview'

export function Templates() {
  const navigate = useNavigate()
  return (
    <div className="p-8 font-syne">
      <h1 className="text-2xl font-black tracking-tight mb-1">Resume Templates</h1>
      <p className="text-muted mb-8">Professional, ATS-friendly designs. Free and premium available.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {TEMPLATES.map(t => (
          <div key={t.id} className="card overflow-hidden hover:border-[#6C63FF55] transition-all">
            <div className="h-44 flex items-center justify-center relative"
              style={{ background: `linear-gradient(135deg, ${t.accent}33, ${t.accent}55)` }}>
              <div className="w-28 bg-white rounded shadow-xl p-3">
                <div className="h-2 rounded mb-1.5 w-3/4" style={{ background: t.accent }} />
                <div className="h-1.5 bg-gray-200 rounded mb-1 w-full" />
                <div className="h-1.5 bg-gray-200 rounded mb-2 w-4/5" />
                <div className="h-1 rounded mb-1.5 w-2/5 opacity-70" style={{ background: t.accent }} />
                {[80,90,75,85].map((w,i) => <div key={i} className="h-1 bg-gray-100 rounded mb-1" style={{ width: `${w}%` }} />)}
              </div>
              {t.isPremium && (
                <div className="absolute top-2.5 right-2.5 text-black text-[10px] font-black px-2 py-0.5 rounded-md"
                  style={{ background: '#F5C542' }}>PREMIUM</div>
              )}
            </div>
            <div className="p-5">
              <div className="font-bold mb-1">{t.name}</div>
              <div className="text-muted text-sm mb-3">{t.desc}</div>
              <div className="flex gap-2 mb-4">
                <span className="text-xs font-semibold px-2 py-0.5 rounded"
                  style={{ background: `${t.accent}22`, color: t.accent }}>{t.category}</span>
                {!t.isPremium && <span className="text-xs font-semibold px-2 py-0.5 rounded text-[#00D4AA]"
                  style={{ background: '#00D4AA22' }}>FREE</span>}
              </div>
              <button onClick={() => navigate('/builder')}
                className="w-full py-2.5 rounded-xl font-bold text-sm border-none cursor-pointer text-white"
                style={{ background: `linear-gradient(135deg, ${t.accent}, ${t.accent}CC)` }}>
                {t.isPremium ? '🔒 Use Premium' : 'Use Template →'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Marketplace.jsx ──────────────────────────────────────────────────────────
import { useState } from 'react'
import PaymentModal from '../components/PaymentModal'
import Toast from '../components/Toast'
import { useToast } from '../hooks/useToast'

const PREMIUM_RESUMES = [
  { id: 'pr1', title: 'Senior Frontend Developer',   category: 'Frontend Dev',  color: '#6C63FF', downloads: 1240 },
  { id: 'pr2', title: 'Full Stack Engineer — FAANG', category: 'Backend Dev',   color: '#00D4AA', downloads: 980  },
  { id: 'pr3', title: 'UI/UX Designer Portfolio',    category: 'Design',        color: '#F5C542', downloads: 756  },
  { id: 'pr4', title: 'Data Scientist ML Engineer',  category: 'Data Science',  color: '#FF6B9D', downloads: 623  },
  { id: 'pr5', title: 'DevOps Cloud Architect',      category: 'DevOps',        color: '#4ECDC4', downloads: 445  },
  { id: 'pr6', title: 'Product Manager Tech Lead',   category: 'Product',       color: '#A78BFA', downloads: 891  },
]

export function Marketplace() {
  const [payTarget, setPayTarget] = useState(null)
  const { toasts, toast, remove } = useToast()
  return (
    <div className="p-8 font-syne">
      <h1 className="text-2xl font-black tracking-tight mb-1">Premium Resume Marketplace</h1>
      <p className="text-muted mb-8">Expert-crafted resumes for top tech roles. Download instantly for $1.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {PREMIUM_RESUMES.map(r => (
          <div key={r.id} className="card overflow-hidden hover:border-[#6C63FF55] transition-all">
            <div className="h-36 flex items-center justify-center relative"
              style={{ background: `linear-gradient(135deg, ${r.color}33, ${r.color}55)` }}>
              <div className="w-24 bg-white rounded shadow-lg p-2.5">
                <div className="h-2 rounded mb-1 w-3/4" style={{ background: r.color }} />
                <div className="h-1 bg-gray-200 rounded mb-0.5" />
                <div className="h-1 bg-gray-200 rounded mb-1.5 w-4/5" />
                {[3,3,3].map((_, i) => <div key={i} className="h-1 bg-gray-100 rounded mb-0.5" />)}
              </div>
              <div className="absolute top-2 right-2 text-black text-[10px] font-black px-2 py-0.5 rounded-md"
                style={{ background: '#F5C542' }}>$1</div>
            </div>
            <div className="p-4">
              <div className="font-bold mb-2">{r.title}</div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-semibold px-2 py-0.5 rounded"
                  style={{ background: `${r.color}22`, color: r.color }}>{r.category}</span>
                <span className="text-muted text-xs">↓ {r.downloads.toLocaleString()}</span>
              </div>
              <button onClick={() => setPayTarget({ itemId: r.id, itemName: r.title })}
                className="w-full py-2.5 rounded-xl font-bold text-sm border-none cursor-pointer"
                style={{ background: `linear-gradient(135deg, ${r.color}, ${r.color}BB)`, color: r.color === '#F5C542' ? '#000' : '#fff' }}>
                Download for $1 →
              </button>
            </div>
          </div>
        ))}
      </div>
      {payTarget && (
        <PaymentModal itemId={payTarget.itemId} itemName={payTarget.itemName}
          onClose={() => setPayTarget(null)}
          onSuccess={() => { setPayTarget(null); toast('Payment successful! Download starting...', 'success') }} />
      )}
      <Toast toasts={toasts} remove={remove} />
    </div>
  )
}

// ─── Payments.jsx ─────────────────────────────────────────────────────────────
import { useEffect } from 'react'
import { paymentAPI } from '../utils/api'

export function Payments() {
  const [payments, setPayments] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    paymentAPI.history().then(r => setPayments(r.data.payments)).finally(() => setLoading(false))
  }, [])

  const total = payments.reduce((a, p) => a + p.amount, 0)

  return (
    <div className="p-8 font-syne">
      <h1 className="text-2xl font-black tracking-tight mb-1">Payment History</h1>
      <p className="text-muted mb-8">All your transactions in one place</p>

      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: 'Total Spent',  val: `$${total}`,                                              color: '#F5C542' },
          { label: 'Successful',   val: payments.filter(p => p.status === 'success').length,      color: '#00D4AA' },
          { label: 'Transactions', val: payments.length,                                           color: '#A5A0FF' },
        ].map((s, i) => (
          <div key={i} className="card p-5">
            <div className="text-muted text-xs font-semibold uppercase tracking-wider mb-2">{s.label}</div>
            <div className="text-3xl font-black" style={{ color: s.color }}>{s.val}</div>
          </div>
        ))}
      </div>

      {loading ? (
        <div className="text-muted text-center py-12">Loading...</div>
      ) : payments.length === 0 ? (
        <div className="card p-12 text-center border-dashed">
          <div className="text-4xl mb-3">💳</div>
          <p className="text-muted">No payments yet. Download a resume to get started!</p>
        </div>
      ) : (
        <div className="card overflow-hidden">
          <div className="grid grid-cols-5 px-5 py-3 border-b border-border text-muted text-xs font-bold uppercase tracking-wider">
            <span className="col-span-2">Item</span><span>Amount</span><span>Provider</span><span>Date</span>
          </div>
          {payments.map(p => (
            <div key={p._id} className="grid grid-cols-5 px-5 py-4 border-b border-border items-center text-sm hover:bg-elevated transition-colors">
              <span className="col-span-2 font-medium truncate">{p.item || 'Resume Download'}</span>
              <span className="font-bold" style={{ color: '#F5C542' }}>${p.amount}</span>
              <span className="flex items-center gap-1.5 text-muted capitalize">
                {p.provider === 'stripe' ? '💳' : p.provider === 'paystack' ? '🌍' : '🦋'} {p.provider}
              </span>
              <span className="text-muted text-xs">{new Date(p.createdAt).toLocaleDateString()}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── Profile.jsx ──────────────────────────────────────────────────────────────
import { useAuth } from '../context/AuthContext'
import { userAPI } from '../utils/api'

export function Profile() {
  const { user, logout, updateUser } = useAuth()
  const navigate = useNavigate()
  const { toasts, toast, remove: removeToast } = useToast()
  const [form, setForm] = useState({ name: user?.name || '', email: user?.email || '' })
  const [saving, setSaving] = useState(false)

  const save = async () => {
    setSaving(true)
    try {
      const fd = new FormData()
      fd.append('name', form.name)
      fd.append('email', form.email)
      const { data } = await userAPI.update(fd)
      updateUser(data.user)
      toast('Profile updated!', 'success')
    } catch { toast('Update failed', 'error') }
    setSaving(false)
  }

  const deleteAccount = async () => {
    if (!window.confirm('Are you sure? This cannot be undone.')) return
    try {
      await userAPI.delete()
      logout()
      navigate('/')
    } catch { toast('Delete failed', 'error') }
  }

  const inputCls = 'w-full bg-elevated border border-border rounded-xl px-4 py-3 text-white text-sm outline-none transition-colors focus:border-accent'
  const labelCls = 'block text-[11px] font-bold text-muted uppercase tracking-wider mb-1.5'

  return (
    <div className="p-8 font-syne max-w-2xl">
      <h1 className="text-2xl font-black tracking-tight mb-8">Profile Settings</h1>

      <div className="card p-7 mb-5">
        {/* Avatar */}
        <div className="flex items-center gap-5 mb-7 pb-6 border-b border-border">
          <div className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-black text-white flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, #6C63FF, #A78BFA)' }}>
            {user?.name?.[0]?.toUpperCase()}
          </div>
          <div>
            <div className="text-lg font-bold">{user?.name}</div>
            <div className="text-muted text-sm">{user?.email}</div>
            <span className="inline-block mt-2 text-[#A5A0FF] text-xs font-bold px-2 py-0.5 rounded"
              style={{ background: '#6C63FF22' }}>Free Plan</span>
          </div>
        </div>

        {/* Form */}
        <div className="grid gap-4 mb-6">
          <div>
            <label className={labelCls}>Full Name</label>
            <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Email Address</label>
            <input value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>New Password (leave blank to keep current)</label>
            <input type="password" placeholder="••••••••" className={inputCls} />
          </div>
        </div>

        <button onClick={save} disabled={saving} className="btn-primary px-7 py-3"
          style={{ opacity: saving ? 0.7 : 1 }}>
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      {/* Danger Zone */}
      <div className="card p-6" style={{ borderColor: '#FF5B5B44' }}>
        <div className="font-bold text-base mb-1" style={{ color: '#FF5B5B' }}>Danger Zone</div>
        <p className="text-muted text-sm mb-4">Permanently delete your account and all associated data.</p>
        <button onClick={deleteAccount}
          className="px-5 py-2.5 rounded-xl font-bold text-sm cursor-pointer bg-transparent"
          style={{ border: '1px solid #FF5B5B', color: '#FF5B5B' }}>
          Delete Account
        </button>
      </div>

      <Toast toasts={toasts} remove={removeToast} />
    </div>
  )
}
