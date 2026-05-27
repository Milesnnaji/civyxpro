import { useState } from 'react'
import { paymentAPI } from '../utils/api'
import { useAuth } from '../context/AuthContext'

const PROVIDERS = [
  { id: 'stripe',       name: 'Stripe',       desc: 'Credit / Debit Card',  icon: '💳', color: '#635BFF' },
  { id: 'paystack',     name: 'Paystack',     desc: 'Nigeria & Africa',      icon: '🌍', color: '#00C3F7' },
  { id: 'flutterwave',  name: 'Flutterwave',  desc: 'Pan-African Payments',  icon: '🦋', color: '#F5A623' },
]

export default function PaymentModal({ onClose, onSuccess, itemId, itemName = 'Resume' }) {
  const { user } = useAuth()
  const [provider, setProvider] = useState(null)
  const [email, setEmail] = useState(user?.email || '')
  const [step, setStep] = useState('select') // select | processing | done
  const [error, setError] = useState('')

  const pay = async () => {
    if (!provider) return
    setStep('processing')
    setError('')
    try {
      let url
      if (provider === 'stripe') {
        const { data } = await paymentAPI.stripeSession({ itemId, itemName })
        url = data.url
      } else if (provider === 'paystack') {
        const { data } = await paymentAPI.paystackInit({ itemId, itemName, email })
        url = data.url
      } else {
        const { data } = await paymentAPI.flutterwaveInit({ itemId, itemName, email })
        url = data.url
      }
      // Redirect to payment provider
      window.location.href = url
    } catch (err) {
      setError(err.response?.data?.message || 'Payment initiation failed. Check your connection.')
      setStep('select')
    }
  }

  return (
    <div className="fixed inset-0 bg-black/70 z-[100] flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-card border border-border rounded-2xl w-full max-w-md p-8 relative animate-fade-in">
        <button onClick={onClose}
          className="absolute top-4 right-4 text-muted hover:text-white text-xl bg-transparent border-none cursor-pointer w-8 h-8 flex items-center justify-center rounded-lg hover:bg-elevated transition-all">
          ×
        </button>

        {step === 'select' && (
          <>
            <div className="text-center mb-6">
              <div className="text-4xl mb-3">🔒</div>
              <h2 className="text-xl font-bold text-white">Unlock Download</h2>
              <p className="text-muted text-sm mt-1">
                Pay <strong className="text-[#F5C542]">$1</strong> to download{' '}
                <strong className="text-[#A5A0FF]">{itemName}</strong>
              </p>
            </div>

            <div className="flex flex-col gap-3 mb-5">
              {PROVIDERS.map(p => (
                <div key={p.id} onClick={() => setProvider(p.id)}
                  className="flex items-center gap-4 px-4 py-3 rounded-xl border cursor-pointer transition-all"
                  style={{
                    borderColor: provider === p.id ? p.color : '#1E2035',
                    background: provider === p.id ? `${p.color}15` : 'transparent',
                  }}>
                  <span className="text-2xl">{p.icon}</span>
                  <div className="flex-1">
                    <div className="font-semibold text-white text-sm">{p.name}</div>
                    <div className="text-muted text-xs">{p.desc}</div>
                  </div>
                  {provider === p.id && <span style={{ color: p.color }} className="text-lg">✓</span>}
                </div>
              ))}
            </div>

            {(provider === 'paystack' || provider === 'flutterwave') && (
              <div className="mb-4">
                <label className="section-title">Email for receipt</label>
                <input value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com" className="input-base" />
              </div>
            )}

            {error && <p className="text-[#FF5B5B] text-sm mb-3">{error}</p>}

            <button onClick={pay} disabled={!provider}
              className="w-full py-3 rounded-xl font-bold text-white text-base transition-all"
              style={{
                background: provider ? 'linear-gradient(135deg, #6C63FF, #4F46E5)' : '#3E3D5C',
                cursor: provider ? 'pointer' : 'not-allowed',
                boxShadow: provider ? '0 4px 24px #6C63FF44' : 'none',
              }}>
              Pay $1.00 →
            </button>
            <p className="text-center text-muted text-xs mt-3">🔐 Secured by 256-bit SSL encryption</p>
          </>
        )}

        {step === 'processing' && (
          <div className="text-center py-10">
            <div className="text-5xl mb-4 spin inline-block">⟳</div>
            <h3 className="text-lg font-bold text-white">Redirecting to payment...</h3>
            <p className="text-muted text-sm mt-2">Please do not close this window</p>
          </div>
        )}
      </div>
    </div>
  )
}
