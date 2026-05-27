import { useNavigate } from 'react-router-dom'

const FEATURES = [
  { icon: '⚡', title: 'AI Resume Writer',     desc: 'Claude AI generates professional summaries, bullet points, and descriptions tailored to your target role.', color: '#6C63FF' },
  { icon: '🎨', title: '5+ Premium Templates', desc: 'ATS-optimized, modern designs for tech, design, and management. Free and premium options.', color: '#00D4AA' },
  { icon: '💳', title: '$1 PDF Export',         desc: 'Pay just $1 via Stripe, Paystack, or Flutterwave. Instant professional PDF download.', color: '#F5C542' },
  { icon: '🛒', title: 'Resume Marketplace',    desc: 'Browse expert-crafted resumes for FAANG, startups, and more. Download ready-to-use templates.', color: '#FF6B9D' },
]

const TESTIMONIALS = [
  { name: 'Amara O.', role: 'Frontend Dev at Flutterwave', text: 'Landed my dream job after using CivyxPro. The AI suggestions were spot-on!' },
  { name: 'Chidi N.', role: 'Backend Engineer at Paystack', text: 'Built my resume in 20 minutes. The templates are incredibly clean and ATS-friendly.' },
  { name: 'Fatima A.', role: 'Product Manager at Andela', text: 'Worth every penny. The AI writer alone saved me hours of struggling over words.' },
]

export default function Landing() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-bg text-white font-syne">
      {/* Nav */}
      <nav className="sticky top-0 z-50 border-b border-border flex items-center justify-between px-8 py-4"
        style={{ background: '#0A0B14EE', backdropFilter: 'blur(12px)' }}>
        <div className="text-2xl font-black">
          <span className="gradient-text">Civyx</span>
          <span style={{ color: '#F5C542' }}>Pro</span>
        </div>
        <div className="flex gap-3">
          <button onClick={() => navigate('/auth?mode=login')} className="btn-secondary text-sm px-5 py-2">Login</button>
          <button onClick={() => navigate('/auth?mode=register')} className="btn-primary text-sm px-5 py-2">Get Started Free →</button>
        </div>
      </nav>

      {/* Hero */}
      <section className="text-center px-6 pt-20 pb-16 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[500px] pointer-events-none"
          style={{ background: 'radial-gradient(ellipse, #6C63FF22 0%, transparent 70%)' }} />
        <div className="inline-block border border-[#6C63FF44] rounded-full px-4 py-2 text-[#A5A0FF] text-sm mb-6"
          style={{ background: '#6C63FF15' }}>
          ✦ AI-Powered · Multi-Currency · Pay Only $1
        </div>
        <h1 className="text-5xl md:text-7xl font-black leading-none mb-5 tracking-tight">
          Build Resumes That<br />
          <span className="gradient-text">Get You Hired</span>
        </h1>
        <p className="text-lg text-muted max-w-xl mx-auto mb-8 leading-relaxed">
          Create ATS-friendly professional resumes in minutes. AI-powered writing, 5+ modern templates, and instant PDF export for just $1.
        </p>
        <div className="flex gap-3 justify-center flex-wrap">
          <button onClick={() => navigate('/auth?mode=register')} className="btn-primary px-8 py-4 text-base glow-accent">
            Start Building Free →
          </button>
          <button onClick={() => navigate('/auth?mode=login')} className="btn-secondary px-8 py-4 text-base">
            Sign In
          </button>
        </div>
        <p className="text-muted text-xs mt-4">No credit card required · $1 only to download</p>
      </section>

      {/* Features */}
      <section className="px-8 py-16 max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-black tracking-tight mb-3">Everything You Need to Land the Job</h2>
          <p className="text-muted">Professional tools for modern job seekers</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {FEATURES.map((f, i) => (
            <div key={i} className="card p-6 hover:border-[#6C63FF55] transition-all">
              <div className="text-3xl mb-4">{f.icon}</div>
              <h3 className="text-lg font-bold mb-2">{f.title}</h3>
              <p className="text-muted text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section className="px-8 py-16 max-w-3xl mx-auto text-center">
        <h2 className="text-3xl font-black tracking-tight mb-3">Simple, Transparent Pricing</h2>
        <p className="text-muted mb-12">Build for free. Pay only when you download.</p>
        <div className="grid md:grid-cols-2 gap-6">
          {[
            { name: 'Free', price: '$0', features: ['Unlimited resume building', '2 free templates', 'Real-time live preview', 'Basic AI suggestions'], cta: 'Start Free', primary: false },
            { name: 'Download', price: '$1', sub: 'per download', features: ['Export as high-quality PDF', 'All 5 premium templates', 'Unlimited AI generation', 'Priority email support'], cta: 'Download Now', primary: true },
          ].map((plan, i) => (
            <div key={i} className="rounded-2xl p-7 relative border-2 text-left"
              style={{
                background: plan.primary ? 'linear-gradient(135deg, #6C63FF22, #00D4AA11)' : '#12141F',
                borderColor: plan.primary ? '#6C63FF' : '#1E2035',
              }}>
              {plan.primary && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 text-white text-[10px] font-black px-4 py-1 rounded-full whitespace-nowrap"
                  style={{ background: 'linear-gradient(135deg, #6C63FF, #00D4AA)' }}>
                  MOST POPULAR
                </div>
              )}
              <div className="font-bold text-lg mb-3 mt-2">{plan.name}</div>
              <div className="text-5xl font-black tracking-tight mb-1" style={{ color: plan.primary ? '#A5A0FF' : 'white' }}>{plan.price}</div>
              {plan.sub && <div className="text-muted text-sm mb-4">{plan.sub}</div>}
              <ul className="my-5 space-y-2">
                {plan.features.map((f, j) => (
                  <li key={j} className="flex items-center gap-2 text-sm text-muted">
                    <span className="text-[#00D4AA]">✓</span> {f}
                  </li>
                ))}
              </ul>
              <button onClick={() => navigate('/auth?mode=register')} className={plan.primary ? 'btn-primary w-full py-3 text-sm' : 'btn-secondary w-full py-3 text-sm'}>
                {plan.cta}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="px-8 py-16 max-w-5xl mx-auto">
        <h2 className="text-3xl font-black tracking-tight text-center mb-10">Loved by Job Seekers</h2>
        <div className="grid md:grid-cols-3 gap-5">
          {TESTIMONIALS.map((t, i) => (
            <div key={i} className="card p-5">
              <p className="text-muted text-sm leading-relaxed mb-4">"{t.text}"</p>
              <div>
                <div className="font-bold text-sm">{t.name}</div>
                <div className="text-muted text-xs">{t.role}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Banner */}
      <section className="px-8 py-16 text-center">
        <div className="max-w-2xl mx-auto rounded-2xl p-10"
          style={{ background: 'linear-gradient(135deg, #6C63FF22, #00D4AA11)', border: '1px solid #6C63FF44' }}>
          <h2 className="text-3xl font-black mb-3">Ready to Build Your Dream Resume?</h2>
          <p className="text-muted mb-6">Join thousands of professionals who landed jobs with CivyxPro.</p>
          <button onClick={() => navigate('/auth?mode=register')} className="btn-primary px-10 py-4 text-base glow-accent">
            Get Started Free →
          </button>
        </div>
      </section>

      <footer className="border-t border-border px-8 py-6 flex flex-col md:flex-row justify-between items-center text-muted text-xs gap-2">
        <span>© 2025 CivyxPro. All rights reserved.</span>
        <span>Built for modern job seekers ✦</span>
      </footer>
    </div>
  )
}
