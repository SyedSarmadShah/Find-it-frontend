import { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react'

type ToastVariant = 'success' | 'error' | 'info'

type Toast = {
  id: number
  message: string
  variant: ToastVariant
}

type ToastContextValue = {
  showToast: (message: string, variant?: ToastVariant) => void
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined)

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])
  const timerIds = useRef<number[]>([])

  const showToast = (message: string, variant: ToastVariant = 'info') => {
    const id = window.setTimeout(() => {
      setToasts((current) => current.filter((toast) => toast.id !== id))
    }, 3800)

    timerIds.current.push(id)
    setToasts((current) => [...current, { id, message, variant }])
  }

  useEffect(() => {
    return () => {
      timerIds.current.forEach((id) => window.clearTimeout(id))
    }
  }, [])

  const value = useMemo(() => ({ showToast }), [])

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div aria-live="polite" className="pointer-events-none fixed bottom-4 right-4 z-50 flex w-[min(92vw,24rem)] flex-col gap-3">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto rounded-2xl border px-4 py-3 shadow-[0_18px_40px_rgba(11,23,39,0.18)] backdrop-blur transition-all ${
              toast.variant === 'success'
                ? 'border-moss/30 bg-moss/95 text-paper'
                : toast.variant === 'error'
                  ? 'border-rust/30 bg-rust/95 text-paper'
                  : 'border-black/10 bg-white/95 text-ink dark:border-white/10 dark:bg-surface-strong/95 dark:text-paper'
            }`}
          >
            <p className="text-sm font-medium leading-6">{toast.message}</p>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within ToastProvider')
  }
  return context
}