import { useState } from 'react'

export default function AIModal({ onClose, onResult, fieldLabel = 'section' }) {
  const [prompt, setPrompt] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState('')
  const [error, setError] = useState('')

  const generate = async () => {
    if (!prompt.trim()) return
    setLoading(true); setError(''); setResult('')
    try {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1000,
          messages: [{
            role: 'user',
            content: `You are an expert resume writer. Generate professional resume content for the "${fieldLabel}" section. Context provided by the user: ${prompt}. Requirements: be concise, impactful, and ATS-keyword-optimized. Use strong action verbs. Return only the content itself, no preamble or explanation.`,
          }],
        }),
      })
      const data = await res.json()
      if (data.error) throw new Error(data.error.message)
      setResult(data.content?.[0]?.text || '')
    } catch (e) {
      setError('AI generation failed. Ensure your Anthropic API key is set in frontend/.env')
    }
    setLoading(false)
  }

  return (
    <div className="fixed inset-0 bg-black/80 z-[200] flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-card border border-[#6C63FF44] rounded-2xl w-full max-w-lg p-8 relative fade-up">
        <button onClick={onClose}
          className="absolute top-4 right-4 text-muted hover:text-white text-xl bg-transparent border-none cursor-pointer">×</button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="rounded-xl p-3 flex" style={{ background: 'linear-gradient(135deg, #6C63FF, #A78BFA)' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">AI Resume Writer</h2>
            <p className="text-muted text-xs">Powered by Claude AI</p>
          </div>
        </div>

        {/* Field label */}
        <p className="text-muted text-sm mb-2">
          Generating: <strong className="text-[#A5A0FF]">{fieldLabel}</strong>
        </p>

        <textarea
          value={prompt}
          onChange={e => setPrompt(e.target.value)}
          placeholder={`Describe your background, role, achievements, or any context for "${fieldLabel}"...`}
          rows={4}
          className="input-base mb-4 resize-y"
        />

        <button
          onClick={generate}
          disabled={loading || !prompt.trim()}
          className="w-full py-3 rounded-xl font-bold text-white text-sm mb-4 transition-all"
          style={{
            background: 'linear-gradient(135deg, #6C63FF, #A78BFA)',
            opacity: loading || !prompt.trim() ? 0.6 : 1,
            cursor: loading || !prompt.trim() ? 'not-allowed' : 'pointer',
          }}>
          {loading ? '✦ Generating...' : '✦ Generate with AI'}
        </button>

        {error && <p className="text-[#FF5B5B] text-sm mb-3">{error}</p>}

        {result && (
          <div className="bg-elevated border border-[#6C63FF33] rounded-xl p-4">
            <p className="text-muted text-xs mb-2">AI Generated Result:</p>
            <p className="text-white text-sm leading-relaxed whitespace-pre-wrap">{result}</p>
            <button
              onClick={() => { onResult(result); onClose() }}
              className="mt-3 px-5 py-2 rounded-lg font-bold text-sm cursor-pointer border-none"
              style={{ background: '#00D4AA', color: '#000' }}>
              Use This Content ✓
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
