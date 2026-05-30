import type { ChangeEvent } from 'react'

type SearchFiltersProps = {
  query: string
  category: string
  status: string
  onQueryChange: (value: string) => void
  onCategoryChange: (value: string) => void
  onStatusChange: (value: string) => void
  onReset: () => void
  title: string
  subtitle: string
}

export default function SearchFilters({
  query,
  category,
  status,
  onQueryChange,
  onCategoryChange,
  onStatusChange,
  onReset,
  title,
  subtitle,
}: SearchFiltersProps) {
  const handleChange =
    (setter: (value: string) => void) => (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      setter(event.target.value)
    }

  return (
    <section className="rounded-[1.75rem] border border-black/5 bg-white/70 p-4 shadow-glow backdrop-blur dark:border-white/10 dark:bg-white/5 sm:p-6">
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-rust dark:text-paper/60">{title}</p>
          <p className="mt-1 text-sm text-ink/60 dark:text-paper/65">{subtitle}</p>
        </div>
        <button
          type="button"
          onClick={onReset}
          className="w-full rounded-full border border-black/10 px-4 py-3 text-sm font-medium text-ink transition hover:bg-black/5 dark:border-white/10 dark:text-paper dark:hover:bg-white/5 sm:w-fit sm:py-2"
        >
          Reset filters
        </button>
      </div>

      <div className="grid gap-3 lg:grid-cols-[1.5fr_1fr_1fr]">
        <label className="grid gap-2">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-ink/45 dark:text-paper/50">Search</span>
          <input
            value={query}
            onChange={handleChange(onQueryChange)}
            placeholder="Search title, location, or description"
            className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-base text-ink outline-none transition placeholder:text-ink/55 focus:border-moss focus:ring-2 focus:ring-moss/15 dark:border-white/10 dark:bg-[color:var(--app-surface-strong)] dark:text-white dark:placeholder:text-white/65 sm:text-sm"
          />
        </label>

        <label className="grid gap-2">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-ink/45 dark:text-paper/50">Category</span>
          <select
            value={category}
            onChange={handleChange(onCategoryChange)}
            className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-base text-ink outline-none transition focus:border-moss focus:ring-2 focus:ring-moss/15 dark:border-white/10 dark:bg-[color:var(--app-surface-strong)] dark:text-white sm:text-sm"
          >
            <option value="">All categories</option>
            <option value="Bags">Bags</option>
            <option value="Electronics">Electronics</option>
            <option value="Books">Books</option>
            <option value="ID cards">ID cards</option>
            <option value="Accessories">Accessories</option>
          </select>
        </label>

        <label className="grid gap-2">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-ink/45 dark:text-paper/50">Status</span>
          <select
            value={status}
            onChange={handleChange(onStatusChange)}
            className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-base text-ink outline-none transition focus:border-moss focus:ring-2 focus:ring-moss/15 dark:border-white/10 dark:bg-[color:var(--app-surface-strong)] dark:text-white sm:text-sm"
          >
            <option value="">Any status</option>
            <option value="open">Open</option>
            <option value="matched">Matched</option>
            <option value="resolved">Resolved</option>
          </select>
        </label>
      </div>
    </section>
  )
}
