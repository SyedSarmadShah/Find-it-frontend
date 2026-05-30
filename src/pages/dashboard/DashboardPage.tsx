import { useEffect, useMemo, useRef, useState } from 'react'
import CompareMatchModal from '../../components/items/CompareMatchModal'
import {
  CommunityTrustSection,
  DashboardHero,
  NotificationPanel,
  RecentFoundItems,
  RecentLostItems,
  ReportTrackerPanel,
  SearchSection,
} from '../../components/dashboard/DashboardSections'
import {
  getDashboardAnalytics,
  type DashboardAnalytics,
  listClaimHistory,
  getItem,
  listItems,
  listMatches,
  listNotifications,
  rejectMatch,
  confirmMatch,
  type Item,
  type ItemClaim,
  type ItemMatch,
  type Notification,
} from '../../services/itemService'
import { useToast } from '../../components/ui/ToastProvider'

export default function DashboardPage() {
  const [lostItems, setLostItems] = useState<Item[]>([])
  const [foundItems, setFoundItems] = useState<Item[]>([])
  const [matches, setMatches] = useState<ItemMatch[]>([])
  const [reports, setReports] = useState<ItemClaim[]>([])
  const [reportsWithItems, setReportsWithItems] = useState<(ItemClaim & { item_obj?: Item })[]>([])
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [analytics, setAnalytics] = useState<DashboardAnalytics | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedMatch, setSelectedMatch] = useState<ItemMatch | null>(null)
  const [matchLoadingId, setMatchLoadingId] = useState<number | null>(null)
  const hasShownAnalyticsError = useRef(false)
  const { showToast } = useToast()

  const loadDashboard = async (options?: { silent?: boolean; showError?: boolean }) => {
    const silent = options?.silent ?? false
    const showError = options?.showError ?? true

    if (!silent) {
      setLoading(true)
    }
    try {
      const [analyticsResult, lostResult, foundResult, matchResult, reportsResult, notificationsResult] = await Promise.allSettled([
        getDashboardAnalytics(),
        listItems({ item_type: 'lost' }),
        listItems({ item_type: 'found' }),
        listMatches(),
        listClaimHistory(),
        listNotifications(),
      ])

      if (analyticsResult.status === 'fulfilled') setAnalytics(analyticsResult.value)
      if (lostResult.status === 'fulfilled') setLostItems(lostResult.value)
      if (foundResult.status === 'fulfilled') setFoundItems(foundResult.value)
      if (matchResult.status === 'fulfilled') setMatches(matchResult.value)
      if (reportsResult.status === 'fulfilled') {
        const fetchedReports = reportsResult.value
        setReports(fetchedReports)

        try {
          const uniqueIds = Array.from(new Set(fetchedReports.map((r) => r.item)))
          const itemsSettled = await Promise.allSettled(uniqueIds.map((id) => getItem(id)))
          const itemsMap: Record<number, Item | undefined> = {}
          itemsSettled.forEach((res, idx) => {
            if (res.status === 'fulfilled') itemsMap[uniqueIds[idx]] = res.value
          })
          setReportsWithItems(fetchedReports.map((r) => ({ ...r, item_obj: itemsMap[r.item] })))
        } catch {
          // ignore item fetch failures — we'll still show basic report info
          setReportsWithItems(fetchedReports)
        }
      }
      if (notificationsResult.status === 'fulfilled') setNotifications(notificationsResult.value)

      const failures = [analyticsResult, lostResult, foundResult, matchResult, reportsResult, notificationsResult].filter((result) => result.status === 'rejected')
      if (failures.length && showError && !hasShownAnalyticsError.current) {
        hasShownAnalyticsError.current = true
        showToast('Some dashboard sections could not load right now.', 'error')
      }
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('Dashboard refresh failed', error)
      }
    } finally {
      if (!silent) {
        setLoading(false)
      }
    }
  }

  useEffect(() => {
    void loadDashboard({ silent: false, showError: true })

    const intervalId = window.setInterval(() => {
      void loadDashboard({ silent: true, showError: false })
    }, 30000)

    const onFocus = () => {
      if (document.visibilityState === 'visible') {
        void loadDashboard({ silent: true, showError: false })
      }
    }

    window.addEventListener('focus', onFocus)
    document.addEventListener('visibilitychange', onFocus)

    return () => {
      window.clearInterval(intervalId)
      window.removeEventListener('focus', onFocus)
      document.removeEventListener('visibilitychange', onFocus)
    }
  }, [])

  const handleMatchReview = async (matchId: number, action: 'confirm' | 'reject') => {
    setMatchLoadingId(matchId)
    try {
      if (action === 'reject') {
        await rejectMatch(matchId)
        showToast('Match rejected.', 'info')
      } else {
        await confirmMatch(matchId)
        showToast('Match confirmed. We notified the other party.', 'success')
        setSelectedMatch(null)
      }
      await loadDashboard({ silent: true, showError: false })
    } catch {
      showToast('Unable to update match right now.', 'error')
    } finally {
      setMatchLoadingId(null)
    }
  }

  const summary = analytics?.summary
  const mergedItems = useMemo(() => [...lostItems, ...foundItems], [foundItems, lostItems])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const normalizedQuery = searchQuery.trim().toLowerCase()

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

  const filteredMatches = useMemo(
    () =>
      matches
        .filter((match) => {
          const searchable = [match.lost_item.title, match.lost_item.description, match.lost_item.category, match.found_item.title, match.found_item.description, match.found_item.category]
          const matchesQuery = !normalizedQuery || searchable.some((value) => value?.toLowerCase().includes(normalizedQuery))
          const matchesCategory = !selectedCategory || [match.lost_item.category, match.found_item.category].some((value) => value?.toLowerCase() === selectedCategory.toLowerCase())
          return matchesQuery && matchesCategory
        })
        .sort((left, right) => right.score_percentage - left.score_percentage),
    [matches, normalizedQuery, selectedCategory],
  )

  const filteredNotifications = useMemo(
    () =>
      notifications.filter((notification) => {
        if (!normalizedQuery) return true
        return [notification.title, notification.message, notification.type].some((value) => value.toLowerCase().includes(normalizedQuery))
      }),
    [notifications, normalizedQuery],
  )

  const filteredReports = useMemo(
    () =>
      reportsWithItems.length ? reportsWithItems.filter((report) => {
        if (!normalizedQuery) return true
        return [report.item_title ?? '', report.reason, report.details, report.status].some((value) => value.toLowerCase().includes(normalizedQuery))
      }) : reports.filter((report) => {
        if (!normalizedQuery) return true
        return [report.item_title ?? '', report.reason, report.details, report.status].some((value) => value.toLowerCase().includes(normalizedQuery))
      }),
    [normalizedQuery, reports, reportsWithItems],
  )



  const searchCount = filteredLostItems.length + filteredFoundItems.length + filteredMatches.length

  return (
    <div className="space-y-8 pb-28">
      <DashboardHero
        recoveredCount={summary?.items_successfully_returned ?? 0}
        successRate={summary?.success_percentage ?? 0}
        activeReports={summary?.active_reports ?? 0}
      />

      <SearchSection
        query={searchQuery}
        onQueryChange={setSearchQuery}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        resultCount={searchCount}
      />


      <ReportTrackerPanel reports={filteredReports} />

      <div className="grid gap-8 xl:grid-cols-2">
        <RecentLostItems
          title="Recent lost items"
          eyebrow="Recent lost items"
          items={filteredLostItems}
          emptyTitle="No recent lost items yet"
          emptyDescription="Students have not posted any lost reports that match your current filter."
          tone="lost"
        />
        <RecentFoundItems
          title="Recent found items"
          eyebrow="Recent found items"
          items={filteredFoundItems}
          emptyTitle="No recent found items yet"
          emptyDescription="As soon as someone posts a found item, it will appear here."
          tone="found"
        />
      </div>

      <NotificationPanel notifications={filteredNotifications} />

      <CommunityTrustSection summary={summary} />

      <CompareMatchModal
        open={Boolean(selectedMatch)}
        match={selectedMatch}
        onClose={() => setSelectedMatch(null)}
        onConfirm={selectedMatch?.can_review ? () => void handleMatchReview(selectedMatch.id, 'confirm') : undefined}
        onReject={selectedMatch?.can_review ? () => void handleMatchReview(selectedMatch.id, 'reject') : undefined}
        busy={matchLoadingId === selectedMatch?.id}
      />
    </div>
  )
}
