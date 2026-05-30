import type { ReactNode } from 'react'

type PageHeaderProps = {
  eyebrow: string
  title: string
  description?: string
  actions?: ReactNode
}

export default function PageHeader({ eyebrow, title, description, actions }: PageHeaderProps) {
  return (
    <header className="grid gap-3 rounded-[2rem] border border-black/5 bg-white/70 p-5 shadow-glow backdrop-blur dark:border-white/10 dark:bg-white/5 sm:p-6 lg:p-8">
      <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end lg:gap-6">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-ink/45 dark:text-paper/45 sm:text-sm sm:tracking-[0.2em]">
            {eyebrow}
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-ink dark:text-paper sm:text-4xl lg:text-5xl">
            {title}
          </h1>
          {description ? (
            <p className="mt-3 max-w-3xl text-sm leading-6 text-ink/65 dark:text-paper/65 sm:text-base sm:leading-7">
              {description}
            </p>
          ) : null}
        </div>
        {actions ? <div className="flex flex-wrap gap-3 lg:justify-end">{actions}</div> : null}
      </div>
    </header>
  )
}