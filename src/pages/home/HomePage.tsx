import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { CommunityTrustSection, DashboardHero, RecentFoundItems, RecentLostItems } from '../../components/dashboard/DashboardSections'
import type { DashboardAnalytics, Item } from '../../services/itemService'
import { getDashboardAnalytics, listItems } from '../../services/itemService'

function sortNewestFirst(items: Item[]) {
  return [...items].sort((left, right) => new Date(right.created_at).getTime() - new Date(left.created_at).getTime())
}

export default function HomePage() {
  const [lostItems, setLostItems] = useState<Item[]>([])
  const [foundItems, setFoundItems] = useState<Item[]>([])
  const [analytics, setAnalytics] = useState<DashboardAnalytics | null>(null)
  const [query, setQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')

  useEffect(() => {
    let cancelled = false

    const loadLandingContent = async () => {
      const [lostResult, foundResult, analyticsResult] = await Promise.allSettled([
        listItems({ item_type: 'lost' }),
        listItems({ item_type: 'found' }),
        getDashboardAnalytics(),
      ])

      if (cancelled) return

      if (lostResult.status === 'fulfilled') setLostItems(sortNewestFirst(lostResult.value))
      if (foundResult.status === 'fulfilled') setFoundItems(sortNewestFirst(foundResult.value))
      if (analyticsResult.status === 'fulfilled') setAnalytics(analyticsResult.value)
    }

    void loadLandingContent()

    return () => {
      cancelled = true
    }
  }, [])

  const normalizedQuery = query.trim().toLowerCase()

  const filteredLostItems = useMemo(
    () =>
      lostItems.filter((item) => {
        const matchesQuery = !normalizedQuery || [item.title, item.description, item.category, item.location].some((value) => value?.toLowerCase().includes(normalizedQuery))
        const matchesCategory = !selectedCategory || item.category?.toLowerCase() === selectedCategory.toLowerCase()
        return matchesQuery && matchesCategory
      }),
    [lostItems, normalizedQuery, selectedCategory],
  )

  const filteredFoundItems = useMemo(
    () =>
      foundItems.filter((item) => {
        const matchesQuery = !normalizedQuery || [item.title, item.description, item.category, item.location].some((value) => value?.toLowerCase().includes(normalizedQuery))
        const matchesCategory = !selectedCategory || item.category?.toLowerCase() === selectedCategory.toLowerCase()
        return matchesQuery && matchesCategory
      }),
    [foundItems, normalizedQuery, selectedCategory],
  )

  const searchCount = filteredLostItems.length + filteredFoundItems.length

  return (
    <div className="space-y-6 pb-20 sm:space-y-8">
      <header className="rounded-[2rem] border border-slate-200/70 bg-white/90 px-4 py-4 shadow-[0_18px_50px_rgba(15,23,42,0.07)] backdrop-blur dark:border-white/10 dark:bg-white/5 sm:px-6 sm:py-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <Link to="/" className="flex items-center gap-3 self-start">
            <img src="/logo-find-it.png" alt="Find-It" className="h-11 w-11 rounded-2xl object-contain sm:h-12 sm:w-12" />
            <div className="min-w-0">
              <div className="font-display text-xl font-bold tracking-tight text-slate-950 dark:text-white sm:text-2xl">Find-It</div>
              <div className="text-[10px] uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400 sm:text-xs sm:tracking-[0.24em]">Campus recovery network</div>
            </div>
          </Link>

          <div className="flex flex-wrap gap-3 sm:justify-end">
            <Link
              to="/login"
              className="inline-flex h-11 items-center justify-center rounded-full border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-800 transition hover:-translate-y-0.5 hover:bg-slate-50 dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10"
            >
              Log in
            </Link>
            <Link
              to="/signup"
              className="inline-flex h-11 items-center justify-center rounded-full bg-slate-950 px-5 text-sm font-semibold text-white shadow-[0_14px_30px_rgba(15,23,42,0.18)] transition hover:-translate-y-0.5 hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100"
            >
              Sign up
            </Link>
          </div>
        </div>
      </header>

      <DashboardHero
        recoveredCount={analytics?.summary.items_successfully_returned ?? 0}
        successRate={analytics?.summary.success_percentage ?? 0}
        activeReports={analytics?.summary.active_reports ?? 0}
        query={query}
        onQueryChange={setQuery}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        resultCount={searchCount}
      />

      <section className="space-y-4">
        <div className="grid gap-8 xl:grid-cols-2">
          <RecentFoundItems
            title="Latest found items"
            eyebrow="Latest found items"
            items={filteredFoundItems}
            emptyTitle="No found items yet"
            emptyDescription="As soon as the community posts a found item, it will appear here."
            tone="found"
          />
          <RecentLostItems
            title="Latest lost items"
            eyebrow="Latest lost items"
            items={filteredLostItems}
            emptyTitle="No lost items yet"
            emptyDescription="Recent lost reports will show here when students start posting."
            tone="lost"
          />
        </div>
      </section>

      <CommunityTrustSection summary={analytics?.summary ?? null} />

      <footer className="rounded-[2rem] border border-slate-200/70 bg-white p-5 text-sm text-slate-600 shadow-[0_18px_50px_rgba(15,23,42,0.07)] dark:border-white/10 dark:bg-white/5 dark:text-slate-300 sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-semibold text-slate-900 dark:text-white">Find-It</p>
            <p className="mt-1 max-w-2xl leading-6">Search first, report second, and help the campus community recover items faster.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}