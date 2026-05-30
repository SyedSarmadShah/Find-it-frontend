import { useEffect, useMemo, useState } from 'react'
import ItemGrid from '../../components/items/ItemGrid'
import SearchFilters from '../../components/ui/SearchFilters'
import { listItems } from '../../services/itemService'
import PageHeader from '../../components/layout/PageHeader'

export default function LostItemsPage() {
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('')
  const [status, setStatus] = useState('')

  const filters = useMemo(
    () => ({
      item_type: 'lost' as const,
      search: query || undefined,
      category: category || undefined,
      status: status || undefined,
    }),
    [query, category, status],
  )

  useEffect(() => {
    let cancelled = false

    const load = async () => {
      setLoading(true)
      try {
        const data = await listItems(filters)
        if (!cancelled) setItems(data)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    void load()
    return () => {
      cancelled = true
    }
  }, [filters])

  const resetFilters = () => {
    setQuery('')
    setCategory('')
    setStatus('')
  }

  return (
    <div className="space-y-6 pb-4">
      <PageHeader
        eyebrow="Lost items"
        title="Browse missing item reports"
        description="Search by item name, location, or category to quickly narrow down what the campus community has reported."
      />
      <section className="grid gap-3 rounded-[1.5rem] bg-ink p-5 text-paper dark:bg-paper dark:text-ink sm:gap-4 sm:p-6 lg:ml-auto lg:max-w-md">
        <div>
          <div className="text-sm uppercase tracking-[0.18em] text-paper/60 dark:text-ink/55">Quick stats</div>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-2xl bg-white/10 p-4 dark:bg-ink/5">
              <p className="text-2xl font-bold">Campus</p>
              <p className="mt-1 text-sm text-paper/70 dark:text-ink/60">Filtered reports</p>
            </div>
            <div className="rounded-2xl bg-white/10 p-4 dark:bg-ink/5">
              <p className="text-2xl font-bold">Fast</p>
              <p className="mt-1 text-sm text-paper/70 dark:text-ink/60">Search + filters</p>
            </div>
          </div>
        </div>
      </section>

      <SearchFilters
        title="Refine lost item reports"
        subtitle="Use filters to narrow results without leaving the page."
        query={query}
        category={category}
        status={status}
        onQueryChange={setQuery}
        onCategoryChange={setCategory}
        onStatusChange={setStatus}
        onReset={resetFilters}
      />

      <ItemGrid
        loading={loading}
        items={items}
        emptyTitle="No lost items found"
        emptyDescription="Try adjusting your search, category, or status filters."
      />
    </div>
  )
}
