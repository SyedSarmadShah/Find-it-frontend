import type { ReactNode } from 'react'

type StatCardProps = {
  title: string
  value: string
  icon: ReactNode
  trend?: number
  accentClass?: string
}

function trendMeta(trend = 0): { label: string; chipClass: string; arrow: 'up' | 'down' | 'flat' } {
  if (trend > 0) {
    return {
      label: `+${trend.toFixed(1)}% vs last month`,
      chipClass: 'bg-moss/15 text-moss dark:bg-moss/25 dark:text-paper',
      arrow: 'up' as const,
    }
  }

  if (trend < 0) {
    return {
      label: `${trend.toFixed(1)}% vs last month`,
      chipClass: 'bg-rust/15 text-rust dark:bg-rust/25 dark:text-paper',
      arrow: 'down' as const,
    }
  }

  return {
    label: 'No change vs last month',
    chipClass: 'bg-black/10 text-ink/65 dark:bg-white/10 dark:text-paper/70',
    arrow: 'flat' as const,
  }
}

function TrendArrow({ direction }: { direction: 'up' | 'down' | 'flat' }) {
  if (direction === 'up') {
    return (
      <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <path d="M6 15l6-6 6 6" />
      </svg>
    )
  }

  if (direction === 'down') {
    return (
      <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <path d="M6 9l6 6 6-6" />
      </svg>
    )
  }

  return <span className="text-[11px] font-semibold">=</span>
}

export default function StatCard({ title, value, icon, trend = 0, accentClass = 'from-black/10 to-black/0 dark:from-white/10 dark:to-white/0' }: StatCardProps) {
  const trendInfo = trendMeta(trend)

  return (
    <article className="group relative overflow-hidden rounded-3xl border border-black/5 bg-white/85 p-5 shadow-[0_12px_40px_rgba(7,17,31,0.09)] backdrop-blur transition hover:-translate-y-0.5 dark:border-white/10 dark:bg-white/5">
      <div className={`pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b ${accentClass}`} />
      <div className="relative flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-ink/50 dark:text-paper/55">{title}</p>
          <p className="mt-3 font-display text-3xl font-bold tracking-tight text-ink dark:text-paper">{value}</p>
        </div>
        <div className="grid h-11 w-11 place-content-center rounded-2xl bg-black/5 text-ink dark:bg-white/10 dark:text-paper">{icon}</div>
      </div>
      <div className={`relative mt-4 inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium tracking-wide ${trendInfo.chipClass}`}>
        <TrendArrow direction={trendInfo.arrow} />
        <span>{trendInfo.label}</span>
      </div>
    </article>
  )
}
