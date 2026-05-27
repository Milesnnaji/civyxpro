export default function Toast({ toasts, remove }) {
  if (!toasts.length) return null
  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-2 pointer-events-none">
      {toasts.map(t => (
        <div
          key={t.id}
          className="slide-in pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-white shadow-2xl"
          style={{
            background: t.type === 'success' ? '#00D4AA' : t.type === 'error' ? '#FF5B5B' : '#6C63FF',
            boxShadow: `0 4px 24px ${t.type === 'success' ? '#00D4AA' : t.type === 'error' ? '#FF5B5B' : '#6C63FF'}55`,
          }}
        >
          <span>{t.type === 'success' ? '✓' : t.type === 'error' ? '✕' : '✦'}</span>
          <span>{t.msg}</span>
          <button
            onClick={() => remove(t.id)}
            className="ml-2 text-white/70 hover:text-white transition-colors bg-transparent border-none cursor-pointer text-base leading-none"
          >×</button>
        </div>
      ))}
    </div>
  )
}
