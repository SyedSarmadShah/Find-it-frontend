type ChartCardProps = {
  title: string
  subtitle?: string
  children: React.ReactNode
}

export default function ChartCard({ title, subtitle, children }: ChartCardProps) {
  return (
    <article className="rounded-3xl border border-black/5 bg-white/80 p-5 shadow-[0_14px_40px_rgba(7,17,31,0.08)] backdrop-blur dark:border-white/10 dark:bg-white/5 sm:p-6">
      <div className="mb-4">
        <h3 className="font-display text-2xl font-bold tracking-tight text-ink dark:text-paper">{title}</h3>
        {subtitle ? <p className="mt-1 text-sm text-ink/60 dark:text-paper/60">{subtitle}</p> : null}
      </div>
      {children}
    </article>
  )
}
