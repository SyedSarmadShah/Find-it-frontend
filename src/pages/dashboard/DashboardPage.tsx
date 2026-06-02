import { useEffect, useMemo, useRef, useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../components/ui/ToastProvider'
import PageHeader from '../../components/layout/PageHeader'
import { NotificationPanel, RecentFoundItems, RecentLostItems, ReportTrackerPanel } from '../../components/dashboard/DashboardSections'
import { getItem, listClaimHistory, listItems, listNotifications, type Item, type ItemClaim, type Notification } from '../../services/itemService'

type ActivityEntry = {
  id: string
  title: string
  description: string
  timestamp: string
  tone: 'emerald' | 'sky' | 'rose' | 'slate'
}

function sortNewestFirst(items: Item[]) {
  return [...items].sort((left, right) => new Date(right.created_at).getTime() - new Date(left.created_at).getTime())
}

function statusProgress(status: ItemClaim['status']) {
  switch (status) {
    case 'pending':
      return 25
    case 'approved':
      return 65
    case 'rejected':
      return 100
    case 'completed':
      return 100
    default:
      return 0
  }
}

function toneClass(tone: ActivityEntry['tone']) {
  switch (tone) {
    case 'emerald':
      return 'bg-emerald-500/12 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-100'
    case 'sky':
      return 'bg-sky-500/12 text-sky-700 dark:bg-sky-500/20 dark:text-sky-100'
    case 'rose':
      return 'bg-rose-500/12 text-rose-700 dark:bg-rose-500/20 dark:text-rose-100'
    default:
      return 'bg-slate-500/12 text-slate-700 dark:bg-slate-500/20 dark:text-slate-100'
  }
}

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat(undefined, {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(value))
}

function buildActivityFeed(reports: (ItemClaim & { item_obj?: Item })[], notifications: Notification[]) {
  const entries: ActivityEntry[] = []

  reports.forEach((report) => {
    entries.push({
      id: `report-${report.id}`,
      title: report.status === 'completed' ? 'Successful recovery' : 'Report submission',
      description: `${report.item_title || report.item_obj?.title || `Item ${report.item}`} · ${report.status}`,
      timestamp: report.created_at,
      tone: report.status === 'completed' ? 'emerald' : report.status === 'approved' ? 'sky' : 'slate',
    })
  })

  notifications.forEach((notification) => {
    if (['claim_request_received', 'claim_approved', 'claim_rejected', 'item_returned', 'claim_awaiting_receipt'].includes(notification.type)) {
      entries.push({
        id: `notification-${notification.id}`,
        title: notification.title,
        description: notification.message,
        timestamp: notification.created_at,
        tone: notification.type === 'claim_rejected' ? 'rose' : notification.type === 'claim_request_received' ? 'sky' : 'emerald',
      })
    }
  })

  return entries.sort((left, right) => new Date(right.timestamp).getTime() - new Date(left.timestamp).getTime()).slice(0, 8)
}

export default function DashboardPage() {
  const { user } = useAuth()
  const { showToast } = useToast()
  const [lostItems, setLostItems] = useState<Item[]>([])
  const [foundItems, setFoundItems] = useState<Item[]>([])
  const [reports, setReports] = useState<ItemClaim[]>([])
  const [reportsWithItems, setReportsWithItems] = useState<(ItemClaim & { item_obj?: Item })[]>([])
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [expandedActivity, setExpandedActivity] = useState(false)
  const hasShownError = useRef(false)

  useEffect(() => {
    let cancelled = false

    const loadDashboard = async () => {
      setLoading(true)
      try {
        const [lostResult, foundResult, reportsResult, notificationsResult] = await Promise.allSettled([
          listItems({ item_type: 'lost' }),
          listItems({ item_type: 'found' }),
          listClaimHistory(),
          listNotifications(),
        ])

        if (cancelled) return

        if (lostResult.status === 'fulfilled') {
          setLostItems(sortNewestFirst(lostResult.value).filter((item) => item.owner === user?.id))
        }

        if (foundResult.status === 'fulfilled') {
          setFoundItems(sortNewestFirst(foundResult.value).filter((item) => item.owner === user?.id))
        }

        if (reportsResult.status === 'fulfilled') {
          const userReports = reportsResult.value.filter((report) => report.claimant === user?.id)
          setReports(userReports)

          try {
            const uniqueIds = Array.from(new Set(userReports.map((report) => report.item)))
            const itemsSettled = await Promise.allSettled(uniqueIds.map((id) => getItem(id)))
            const itemsMap: Record<number, Item | undefined> = {}
            itemsSettled.forEach((result, index) => {
              if (result.status === 'fulfilled') {
                itemsMap[uniqueIds[index]] = result.value
              }
            })
            setReportsWithItems(userReports.map((report) => ({ ...report, item_obj: itemsMap[report.item] })))
          } catch {
            setReportsWithItems(userReports)
          }
        }

        if (notificationsResult.status === 'fulfilled') {
          setNotifications(notificationsResult.value)
        }
      } catch (error) {
        if (import.meta.env.DEV) {
          console.error('Dashboard load failed', error)
        }
        if (!hasShownError.current) {
          hasShownError.current = true
          showToast('Some dashboard data could not load right now.', 'error')
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    void loadDashboard()

    const handleClaimsUpdated = () => {
      void loadDashboard()
    }

    window.addEventListener('claims:updated', handleClaimsUpdated)

    return () => {
      cancelled = true
      window.removeEventListener('claims:updated', handleClaimsUpdated)
    }
  }, [showToast, user?.id])

  const activityFeed = useMemo(() => buildActivityFeed(reportsWithItems, notifications), [notifications, reportsWithItems])
  const visibleActivityFeed = expandedActivity ? activityFeed : activityFeed.slice(0, 3)
  const hasMoreActivity = activityFeed.length > 3
  const activeReports = useMemo(() => lostItems.length + foundItems.length, [foundItems.length, lostItems.length])
  const pendingClaims = useMemo(() => reports.filter((report) => report.status === 'pending').length, [reports])
  const approvedClaims = useMemo(() => reports.filter((report) => report.status === 'approved').length, [reports])
  const successfullyReturnedItems = useMemo(() => reports.filter((report) => report.status === 'completed').length, [reports])

  return (
    <div className="space-y-8 pb-28">
      <PageHeader
        eyebrow="Dashboard"
        title="Your reports, claims, and updates"
        description="Manage your lost and found reports, track claim progress, and keep up with notifications in one place."
      />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <article className="rounded-[1.75rem] border border-slate-200/70 bg-white p-5 shadow-[0_18px_50px_rgba(15,23,42,0.07)] dark:border-white/10 dark:bg-white/5">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Active reports</p>
          <p className="mt-3 font-display text-3xl font-bold text-slate-950 dark:text-white">{activeReports}</p>
        </article>
        <article className="rounded-[1.75rem] border border-slate-200/70 bg-white p-5 shadow-[0_18px_50px_rgba(15,23,42,0.07)] dark:border-white/10 dark:bg-white/5">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Pending claims</p>
          <p className="mt-3 font-display text-3xl font-bold text-slate-950 dark:text-white">{pendingClaims}</p>
        </article>
        <article className="rounded-[1.75rem] border border-slate-200/70 bg-white p-5 shadow-[0_18px_50px_rgba(15,23,42,0.07)] dark:border-white/10 dark:bg-white/5">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Approved claims</p>
          <p className="mt-3 font-display text-3xl font-bold text-slate-950 dark:text-white">{approvedClaims}</p>
        </article>
        <article className="rounded-[1.75rem] border border-slate-200/70 bg-white p-5 shadow-[0_18px_50px_rgba(15,23,42,0.07)] dark:border-white/10 dark:bg-white/5">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Successfully returned items</p>
          <p className="mt-3 font-display text-3xl font-bold text-slate-950 dark:text-white">{successfullyReturnedItems}</p>
        </article>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <RecentLostItems
          title="My lost reports"
          eyebrow="My reports"
          items={lostItems}
          emptyTitle="No lost reports yet"
          emptyDescription="Create a lost report to start tracking it here."
          tone="lost"
        />
        <RecentFoundItems
          title="My found reports"
          eyebrow="My reports"
          items={foundItems}
          emptyTitle="No found reports yet"
          emptyDescription="Post a found report and it will appear here."
          tone="found"
        />
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.3fr_0.7fr]">
        <ReportTrackerPanel reports={reportsWithItems} />

        <div className="space-y-4">
          <NotificationPanel notifications={notifications} />
          <section className="space-y-4 rounded-[2rem] border border-slate-200/70 bg-white p-5 shadow-[0_18px_50px_rgba(15,23,42,0.07)] dark:border-white/10 dark:bg-white/5 sm:p-6">
            <div className="max-w-3xl space-y-2">
              <p className="text-xs font-semibold uppercase tracking-[0.26em] text-slate-500 dark:text-slate-400 sm:text-sm sm:tracking-[0.22em]">Activity feed</p>
              <h2 className="font-display text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50 sm:text-3xl">Recent actions and recoveries</h2>
              <p className="text-sm leading-7 text-slate-600 dark:text-slate-300 sm:text-base">A quick timeline of submissions, claim requests, approvals, and successful recoveries.</p>
            </div>

            {loading ? (
              <div className="rounded-[1.5rem] border border-dashed border-slate-200 bg-slate-50 p-6 text-sm text-slate-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-300">Loading activity...</div>
            ) : activityFeed.length ? (
              <>
              <div className="grid gap-3">
                {visibleActivityFeed.map((entry) => (
                  <article key={entry.id} className="flex gap-4 rounded-[1.5rem] border border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-white/5">
                    <div className={`mt-0.5 grid h-11 w-11 shrink-0 place-items-center rounded-2xl ${toneClass(entry.tone)}`}>
                      <span className="text-xs font-semibold uppercase tracking-[0.18em]">{entry.title.slice(0, 2)}</span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-semibold text-slate-950 dark:text-white">{entry.title}</h3>
                      </div>
                      <p className="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-300">{entry.description}</p>
                      <p className="mt-2 text-xs font-medium uppercase tracking-[0.18em] text-slate-400 dark:text-slate-500">{formatDateTime(entry.timestamp)}</p>
                    </div>
                  </article>
                ))}
              </div>
              {hasMoreActivity ? (
                <div className="flex justify-center">
                  <button
                    type="button"
                    onClick={() => setExpandedActivity((current) => !current)}
                    className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-800 transition hover:-translate-y-0.5 hover:bg-slate-50 dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10"
                  >
                    {expandedActivity ? 'Show less' : 'See more'}
                  </button>
                </div>
              ) : null}
              </>
            ) : (
              <div className="rounded-[1.5rem] border border-dashed border-slate-200 bg-slate-50 p-6 text-sm text-slate-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-300">Your recent actions will appear here once you begin reporting or reviewing items.</div>
            )}
          </section>
        </div>
      </section>
    </div>
  )
}
