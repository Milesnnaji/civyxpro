import { useState, useCallback } from 'react'

let id = 0

export function useToast() {
  const [toasts, setToasts] = useState([])

  const toast = useCallback((msg, type = 'info', duration = 4000) => {
    const tid = ++id
    setToasts(t => [...t, { id: tid, msg, type }])
    setTimeout(() => setToasts(t => t.filter(x => x.id !== tid)), duration)
  }, [])

  const remove = useCallback((tid) => setToasts(t => t.filter(x => x.id !== tid)), [])

  return { toasts, toast, remove }
}
