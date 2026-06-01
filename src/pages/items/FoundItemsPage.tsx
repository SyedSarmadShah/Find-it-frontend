import { useEffect, useMemo, useState } from 'react'
import ItemGrid from '../../components/items/ItemGrid'
import ClaimRequestModal from '../../components/items/ClaimRequestModal'
import SearchFilters from '../../components/ui/SearchFilters'
import { createClaim, listItems } from '../../services/itemService'
import { useToast } from '../../components/ui/ToastProvider'
import PageHeader from '../../components/layout/PageHeader'

export default function FoundItemsPage() {
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('')
  const [status, setStatus] = useState('')
  const [selectedItem, setSelectedItem] = useState<any | null>(null)
  const { showToast } = useToast()

  const filters = useMemo(
    () => ({
      item_type: 'found' as const,
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

  const handleClaimSubmit = async (answers: {
    brand: string
    unique_marks: string
    item_contents: string
    additional_details: string
  }) => {
    if (!selectedItem) return
    await createClaim({ item: selectedItem.id, answers })
    setSelectedItem(null)
    showToast('Claim submitted. The finder has been notified.', 'success')
  }

  return (
    <div className="space-y-6 pb-4">
      <PageHeader
        eyebrow="Found items"
        title="Browse recovered items"
        description="See what has been recovered, then filter by keyword, category, or status to find a likely match faster."
      />
      {/* Quick stats removed per user request */}

      <SearchFilters
        title="Refine found item reports"
        subtitle="Filter recovered items by keyword, category, or status."
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
        emptyTitle="No found items found"
        emptyDescription="Try adjusting your search, category, or status filters."
        onClaimItem={(item) => setSelectedItem(item)}
      />

      <ClaimRequestModal
        open={Boolean(selectedItem)}
        itemTitle={selectedItem?.title ?? ''}
        onClose={() => setSelectedItem(null)}
        onSubmit={handleClaimSubmit}
      />
    </div>
  )
}
