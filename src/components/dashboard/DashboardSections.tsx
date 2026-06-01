import { useState } from 'react'
import { Link } from 'react-router-dom'
import type { DashboardSummary, Item, ItemClaim, ItemMatch, Notification } from '../../services/itemService'

type SearchSectionProps = {
  query: string
  onQueryChange: (value: string) => void
  selectedCategory: string
  onCategoryChange: (category: string) => void
  resultCount: number
}

type DashboardHeroProps = {
  recoveredCount: number
  successRate: number
  activeReports: number
}

type AIMatchSuggestionsProps = {
  matches: ItemMatch[]
  onViewMatch: (match: ItemMatch) => void
}

type RecentItemsProps = {
  title: string
  eyebrow: string
  items: Item[]
  emptyTitle: string
  emptyDescription: string
  tone: 'lost' | 'found'
}

type ReportTrackerProps = {
  reports: (ItemClaim & { item_obj?: Item })[]
}

type CampusMapProps = {
  items: Item[]
}

type StatisticsCardsProps = {
  summary: DashboardSummary | null
  averageMatchTime: string
}

type NotificationPanelProps = {
  notifications: Notification[]
}

type CommunityTrustSectionProps = {
  summary: DashboardSummary | null
}

const CATEGORIES = ['Wallets', 'ID Cards', 'Electronics', 'Keys', 'Bags', 'Books', 'Accessories']

const LOST_PLACEHOLDER_IMAGE =
  'data:image/svg+xml;charset=UTF-8,%3Csvg xmlns%3D%22http://www.w3.org/2000/svg%22 viewBox%3D%220 0 1200 900%22%3E%3Cdefs%3E%3ClinearGradient id%3D%22g%22 x1%3D%220%22 y1%3D%220%22 x2%3D%221%22 y2%3D%221%22%3E%3Cstop offset%3D%220%25%22 stop-color%3D%22%23eef2ff%22/%3E%3Cstop offset%3D%22100%25%22 stop-color%3D%22%23dbeafe%22/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width%3D%221200%22 height%3D%22900%22 rx%3D%2256%22 fill%3D%22url(%23g)%22/%3E%3Ccircle cx%3D%22270%22 cy%3D%22210%22 r%3D%22100%22 fill%3D%22%230f172a%22 fill-opacity%3D%220.08%22/%3E%3Ccircle cx%3D%22920%22 cy%3D%22110%22 r%3D%22140%22 fill%3D%22%2314532d%22 fill-opacity%3D%220.12%22/%3E%3Cpath d%3D%22M190 670l180-190 160 150 120-110 250 250H190z%22 fill%3D%22%230f172a%22 fill-opacity%3D%220.11%22/%3E%3Crect x%3D%22310%22 y%3D%22580%22 width%3D%22580%22 height%3D%2268%22 rx%3D%2234%22 fill%3D%22%230f172a%22 fill-opacity%3D%220.08%22/%3E%3Ctext x%3D%22600%22 y%3D%22495%22 text-anchor%3D%22middle%22 font-family%3D%22Arial%2Csans-serif%22 font-size%3D%2272%22 font-weight%3D%22700%22 fill%3D%22%230f172a%22 fill-opacity%3D%220.38%22%3ECampus recovery%3C/text%3E%3C/svg%3E'

function formatDate(value: string) {
  const parsedDate = new Date(value)
  if (Number.isNaN(parsedDate.getTime())) {
    return value
  }

  return new Intl.DateTimeFormat(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(parsedDate)
}

function timeAgo(value: string) {
  const parsedDate = new Date(value)
  if (Number.isNaN(parsedDate.getTime())) {
    return value
  }

  const diffMinutes = Math.max(1, Math.round((Date.now() - parsedDate.getTime()) / 60000))
  if (diffMinutes < 60) return `${diffMinutes}m ago`
  const diffHours = Math.round(diffMinutes / 60)
  if (diffHours < 24) return `${diffHours}h ago`
  const diffDays = Math.round(diffHours / 24)
  return `${diffDays}d ago`
}

function normalizeScore(score: number) {
  return Math.max(20, Math.min(100, score))
}

function itemTone(itemType: 'lost' | 'found') {
  return itemType === 'lost'
    ? 'bg-rose-500/12 text-rose-700 dark:bg-rose-500/20 dark:text-rose-100'
    : 'bg-emerald-500/12 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-100'
}

function itemBadgeLabel(itemType: 'lost' | 'found') {
  return itemType === 'lost' ? 'Lost' : 'Found'
}

function statusTone(status: string) {
  switch (status) {
    case 'matched':
    case 'approved':
    case 'completed':
      return 'bg-emerald-500/12 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-100'
    case 'resolved':
    case 'rejected':
      return 'bg-amber-500/12 text-amber-700 dark:bg-amber-500/20 dark:text-amber-100'
    case 'pending':
      return 'bg-slate-500/12 text-slate-700 dark:bg-slate-500/20 dark:text-slate-100'
    default:
      return 'bg-slate-500/12 text-slate-700 dark:bg-slate-500/20 dark:text-slate-100'
  }
}

function notificationTone(type: Notification['type']) {
  switch (type) {
    case 'new_match_found':
      return 'bg-emerald-500/12 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-100'
    case 'claim_request_received':
      return 'bg-sky-500/12 text-sky-700 dark:bg-sky-500/20 dark:text-sky-100'
    case 'claim_approved':
    case 'item_returned':
      return 'bg-emerald-500/12 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-100'
    case 'claim_rejected':
      return 'bg-rose-500/12 text-rose-700 dark:bg-rose-500/20 dark:text-rose-100'
    default:
      return 'bg-slate-500/12 text-slate-700 dark:bg-slate-500/20 dark:text-slate-100'
  }
}

function getReportProgress(status: ItemClaim['status']) {
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

function getReportNextStep(status: ItemClaim['status']) {
  switch (status) {
    case 'pending':
      return 'Waiting for review'
    case 'approved':
      return 'Prepare to verify pickup'
    case 'rejected':
      return 'Check the details and try again'
    case 'completed':
      return 'Recovered successfully'
    default:
      return 'Track progress here'
  }
}

function resolveMarkerPosition(item: Item, index: number) {
  const fallbackPositions = [
    { left: '16%', top: '20%' },
    { left: '28%', top: '58%' },
    { left: '45%', top: '30%' },
    { left: '58%', top: '66%' },
    { left: '72%', top: '24%' },
    { left: '82%', top: '55%' },
  ]

  const mapX = Number(item.map_x)
  const mapY = Number(item.map_y)
  if (Number.isFinite(mapX) && Number.isFinite(mapY)) {
    return {
      left: `${Math.max(6, Math.min(94, mapX))}%`,
      top: `${Math.max(8, Math.min(92, mapY))}%`,
    }
  }

  return fallbackPositions[index % fallbackPositions.length]
}

function DashboardItemCard({ item, tone }: { item: Item; tone: 'lost' | 'found' }) {
  const image = item.image_url ?? item.image ?? LOST_PLACEHOLDER_IMAGE

  return (
    <article className="group overflow-hidden rounded-[1.75rem] border border-black/5 bg-white shadow-[0_18px_45px_rgba(15,23,42,0.08)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_28px_60px_rgba(15,23,42,0.12)] dark:border-white/10 dark:bg-white/5">
      <div className="relative aspect-[4/3] overflow-hidden bg-slate-100 dark:bg-slate-900/40">
        <img src={image} alt={item.title} className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]" />
        <div className="absolute left-4 top-4 flex flex-wrap gap-2">
          <span className={`rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] ${itemTone(tone)}`}>
            {itemBadgeLabel(tone)}
          </span>
          <span className={`rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] ${statusTone(item.status)}`}>
            {item.status}
          </span>
        </div>
      </div>

      <div className="space-y-4 p-5 sm:p-6">
        <div className="space-y-2">
          <h3 className="font-display text-xl font-bold tracking-tight text-slate-900 dark:text-slate-50">{item.title}</h3>
          <p className="line-clamp-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{item.description}</p>
        </div>

        <div className="flex flex-wrap gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
          <span className="rounded-full bg-slate-100 px-3 py-1 dark:bg-white/5">{item.category || 'General'}</span>
          <span className="rounded-full bg-slate-100 px-3 py-1 dark:bg-white/5">{item.location || 'Campus location'}</span>
          <span className="rounded-full bg-slate-100 px-3 py-1 dark:bg-white/5">{formatDate(item.date)}</span>
        </div>

        <Link
          to={`/items/${item.id}`}
          className="inline-flex items-center justify-center rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100"
        >
          Open details
        </Link>
      </div>
    </article>
  )
}

function SectionHeading({ eyebrow, title, description }: { eyebrow: string; title: string; description?: string }) {
  return (
    <div className="max-w-3xl space-y-2">
      <p className="text-xs font-semibold uppercase tracking-[0.26em] text-slate-500 dark:text-slate-400 sm:text-sm sm:tracking-[0.22em]">{eyebrow}</p>
      <h2 className="font-display text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50 sm:text-3xl">{title}</h2>
      {description ? <p className="text-sm leading-7 text-slate-600 dark:text-slate-300 sm:text-base">{description}</p> : null}
    </div>
  )
}

export function CategoryFilters({ selectedCategory, onCategoryChange }: Pick<SearchSectionProps, 'selectedCategory' | 'onCategoryChange'>) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      <button
        type="button"
        onClick={() => onCategoryChange('')}
        className={`rounded-full px-4 py-2 text-sm font-semibold transition ${selectedCategory === '' ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/15 dark:bg-white dark:text-slate-900' : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-white/5 dark:text-slate-300 dark:hover:bg-white/10'}`}
      >
        All categories
      </button>
      {CATEGORIES.map((category) => (
        <button
          key={category}
          type="button"
          onClick={() => onCategoryChange(category)}
          className={`rounded-full px-4 py-2 text-sm font-semibold transition ${selectedCategory === category ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/15' : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-white/5 dark:text-slate-300 dark:hover:bg-white/10'}`}
        >
          {category}
        </button>
      ))}
    </div>
  )
}

export function DashboardHero({ recoveredCount, successRate, activeReports }: DashboardHeroProps) {
  return (
    <section className="overflow-hidden rounded-[2rem] border border-slate-200/70 bg-[linear-gradient(135deg,rgba(255,255,255,0.96),rgba(240,253,244,0.95))] shadow-[0_24px_70px_rgba(15,23,42,0.08)] dark:border-white/10 dark:bg-[linear-gradient(135deg,rgba(15,23,42,0.88),rgba(8,47,73,0.84))]">
      <div className="p-6 sm:p-8 lg:p-10">
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white/80 px-4 py-2 text-sm font-medium text-slate-700 shadow-sm backdrop-blur dark:border-emerald-500/20 dark:bg-white/5 dark:text-slate-100">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
            Campus recovery made simple
          </div>

          <div className="space-y-4">
            <h1 className="max-w-2xl whitespace-nowrap font-display text-[clamp(2.25rem,4.8vw,4rem)] font-bold tracking-tight leading-none text-slate-950 dark:text-white">
              Lost Something on Campus?
            </h1>
            <p className="max-w-2xl text-base leading-8 text-slate-600 dark:text-slate-300 sm:text-lg">
              Report lost and found items, receive smart match suggestions, and recover belongings faster.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              to="/items/new"
              className="inline-flex items-center justify-center rounded-full bg-slate-900 px-6 py-3.5 text-sm font-semibold text-white shadow-[0_14px_30px_rgba(15,23,42,0.18)] transition hover:-translate-y-0.5 hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100"
            >
              Report Lost Item
            </Link>
            <Link
              to="/items/new"
              className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-6 py-3.5 text-sm font-semibold text-slate-800 transition hover:-translate-y-0.5 hover:border-slate-300 hover:bg-slate-50 dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10"
            >
              Report Found Item
            </Link>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-3xl border border-white/60 bg-white/85 p-4 shadow-sm dark:border-white/10 dark:bg-white/5">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Recovered</p>
              <p className="mt-2 font-display text-2xl font-bold text-slate-950 dark:text-white">{recoveredCount.toLocaleString()}</p>
            </div>
            <div className="rounded-3xl border border-white/60 bg-white/85 p-4 shadow-sm dark:border-white/10 dark:bg-white/5">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Success rate</p>
              <p className="mt-2 font-display text-2xl font-bold text-slate-950 dark:text-white">{successRate.toFixed(0)}%</p>
            </div>
            <div className="rounded-3xl border border-white/60 bg-white/85 p-4 shadow-sm dark:border-white/10 dark:bg-white/5">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Active reports</p>
              <p className="mt-2 font-display text-2xl font-bold text-slate-950 dark:text-white">{activeReports.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export function SearchSection({ query, onQueryChange, selectedCategory, onCategoryChange, resultCount }: SearchSectionProps) {
  return (
    <section className="space-y-4 rounded-[2rem] border border-slate-200/70 bg-white p-5 shadow-[0_18px_50px_rgba(15,23,42,0.07)] dark:border-white/10 dark:bg-white/5 sm:p-6">
      <SectionHeading
        eyebrow="Smart search"
        title="Search wallet, keys, ID card, calculator..."
        description="Type once and the dashboard filters lost items, found items, and match suggestions in real time."
      />

      <div className="space-y-4">
        <div className="relative">
          <span className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-slate-400 dark:text-slate-500">
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M21 21l-4.35-4.35" />
              <circle cx="10" cy="10" r="6" />
            </svg>
          </span>
          <input
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder="Search wallet, keys, ID card, calculator..."
            className="h-16 w-full rounded-[1.5rem] border border-slate-200 bg-slate-50 px-12 text-base text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-400 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 dark:border-white/10 dark:bg-slate-950/40 dark:text-white dark:placeholder:text-slate-500 dark:focus:bg-white/5"
          />
          <div className="pointer-events-none absolute inset-y-0 right-4 hidden items-center text-xs font-semibold uppercase tracking-[0.2em] text-slate-400 sm:flex dark:text-slate-500">
            Instant search
          </div>
        </div>

        <CategoryFilters selectedCategory={selectedCategory} onCategoryChange={onCategoryChange} />

        <div className="flex flex-wrap items-center justify-between gap-3 rounded-[1.5rem] bg-slate-50 px-4 py-3 text-sm text-slate-600 dark:bg-white/5 dark:text-slate-300">
          <p>
            Showing <span className="font-semibold text-slate-900 dark:text-white">{resultCount}</span> matching items
          </p>
          {selectedCategory ? <p>Filtered by {selectedCategory}</p> : <p>Across all categories</p>}
        </div>
      </div>
    </section>
  )
}

export function AIMatchSuggestions({ matches, onViewMatch }: AIMatchSuggestionsProps) {
  return (
    <section className="space-y-4 rounded-[2rem] border border-emerald-200/70 bg-[linear-gradient(180deg,rgba(240,253,244,0.95),rgba(255,255,255,0.98))] p-5 shadow-[0_20px_50px_rgba(34,197,94,0.08)] dark:border-emerald-500/20 dark:bg-[linear-gradient(180deg,rgba(20,83,45,0.32),rgba(15,23,42,0.48))] sm:p-6">
      <SectionHeading
        eyebrow="AI match suggestions"
        title="Possible match found"
        description="High-confidence pairings surface first so students can move from searching to recovery faster."
      />

      {matches.length ? (
        <div className="grid gap-4">
          {matches.slice(0, 3).map((match) => (
            <article key={match.id} className="grid gap-5 rounded-[1.75rem] border border-white/60 bg-white p-4 shadow-[0_16px_40px_rgba(15,23,42,0.08)] dark:border-white/10 dark:bg-white/5 sm:p-5 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-emerald-500 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-white">
                    {match.score_percentage}% confidence
                  </span>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-600 dark:bg-white/5 dark:text-slate-300">
                    Match reason: {match.match_reason}
                  </span>
                </div>
                <h3 className="font-display text-2xl font-bold tracking-tight text-slate-950 dark:text-white">
                  {match.lost_item.title} <span className="text-slate-400">↔</span> {match.found_item.title}
                </h3>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-[1.25rem] bg-slate-50 p-4 dark:bg-white/5">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Lost item</p>
                    <p className="mt-2 font-semibold text-slate-900 dark:text-white">{match.lost_item.title}</p>
                    <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{match.lost_item.location}</p>
                  </div>
                  <div className="rounded-[1.25rem] bg-slate-50 p-4 dark:bg-white/5">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Found item</p>
                    <p className="mt-2 font-semibold text-slate-900 dark:text-white">{match.found_item.title}</p>
                    <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{match.found_item.location}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4 rounded-[1.5rem] border border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-slate-950/40">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Confidence score</p>
                    <p className="mt-1 font-display text-3xl font-bold text-slate-950 dark:text-white">{match.score_percentage}%</p>
                  </div>
                  <div className="rounded-full bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700 shadow-sm dark:bg-white/5 dark:text-emerald-200">
                    Possible match
                  </div>
                </div>
                <div className="h-2 rounded-full bg-slate-200 dark:bg-white/10">
                  <div className="h-2 rounded-full bg-emerald-500" style={{ width: `${normalizeScore(match.score_percentage)}%` }} />
                </div>
                <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">{match.match_reason}</p>
                <button
                  type="button"
                  onClick={() => onViewMatch(match)}
                  className="inline-flex w-full items-center justify-center rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-slate-800 dark:bg-white dark:text-slate-900"
                >
                  View Match
                </button>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="rounded-[1.5rem] border border-dashed border-slate-200 bg-white/70 p-6 text-sm text-slate-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-300">
          No match suggestions yet. New lost and found reports will appear here as soon as the system can pair them.
        </div>
      )}
    </section>
  )
}

export function RecentLostItems({ title, eyebrow, items, emptyTitle, emptyDescription, tone }: RecentItemsProps) {
  const [expanded, setExpanded] = useState(false)
  const visibleItems = expanded ? items : items.slice(0, 3)
  const hasMoreItems = items.length > 3

  return (
    <section className="space-y-4 rounded-[2rem] border border-slate-200/70 bg-white p-5 shadow-[0_18px_50px_rgba(15,23,42,0.07)] dark:border-white/10 dark:bg-white/5 sm:p-6">
      <SectionHeading eyebrow={eyebrow} title={title} description="Modern cards keep the most important facts visible at a glance." />

      {items.length ? (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {visibleItems.map((item) => (
            <DashboardItemCard key={item.id} item={item} tone={tone} />
            ))}
          </div>
          {hasMoreItems ? (
            <div className="flex justify-center">
              <button
                type="button"
                onClick={() => setExpanded((current) => !current)}
                className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-800 transition hover:-translate-y-0.5 hover:bg-slate-50 dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10"
              >
                {expanded ? 'Show less' : 'See more'}
              </button>
            </div>
          ) : null}
        </>
      ) : (
        <div className="rounded-[1.5rem] border border-dashed border-slate-200 bg-slate-50 p-6 text-sm text-slate-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-300">
          <p className="font-semibold text-slate-900 dark:text-white">{emptyTitle}</p>
          <p className="mt-2">{emptyDescription}</p>
        </div>
      )}
    </section>
  )
}

export function RecentFoundItems(props: RecentItemsProps) {
  return <RecentLostItems {...props} />
}

export function ReportTrackerPanel({ reports }: ReportTrackerProps) {
  return (
    <section id="my-reports" className="space-y-4 rounded-[2rem] border border-slate-200/70 bg-white p-5 shadow-[0_18px_50px_rgba(15,23,42,0.07)] dark:border-white/10 dark:bg-white/5 sm:p-6">
      <SectionHeading
        eyebrow="My reports"
        title="Track your claims and recovery progress"
        description="Every claim and update stays visible so students can understand what is happening without chasing support."
      />

      {reports.length ? (
        <div className="grid gap-4 lg:grid-cols-2">
          {reports.slice(0, 4).map((report) => {
            const progress = getReportProgress(report.status)
            return (
              <article key={report.id} className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5 dark:border-white/10 dark:bg-white/5">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-4">
                    {report.item_obj ? (
                      <img src={report.item_obj.image_url ?? report.item_obj.image ?? LOST_PLACEHOLDER_IMAGE} alt={report.item_obj.title} className="h-20 w-28 rounded-md object-cover" />
                    ) : (
                      <div className="h-20 w-28 rounded-md bg-slate-100 dark:bg-slate-900/40" />
                    )}

                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Claim #{report.id}</p>
                      <h3 className="mt-2 font-display text-xl font-bold tracking-tight text-slate-950 dark:text-white">{report.item_title || report.item_obj?.title || `Item ${report.item}`}</h3>
                      {report.item_obj ? <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{report.item_obj.location} · {report.item_obj.category}</p> : null}
                    </div>
                  </div>

                  <span className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] ${statusTone(report.status)}`}>
                    {report.status}
                  </span>
                </div>

                <div className="mt-4 space-y-3">
                  <div className="flex items-center justify-between text-sm text-slate-600 dark:text-slate-300">
                    <span>{getReportNextStep(report.status)}</span>
                    <span>{progress}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-200 dark:bg-white/10">
                    <div className="h-2 rounded-full bg-emerald-500" style={{ width: `${progress}%` }} />
                  </div>
                </div>

                <div className="mt-4 grid gap-3 text-sm text-slate-600 dark:text-slate-300 sm:grid-cols-2">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">Created</p>
                    <p className="mt-1">{formatDate(report.created_at)}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">Updated</p>
                    <p className="mt-1">{timeAgo(report.updated_at)}</p>
                  </div>
                </div>

                <Link
                  to={`/items/${report.item}`}
                  className="mt-5 inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-800 transition hover:-translate-y-0.5 hover:bg-slate-50 dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10"
                >
                  Review item
                </Link>
              </article>
            )
          })}
        </div>
      ) : (
        <div className="rounded-[1.5rem] border border-dashed border-slate-200 bg-slate-50 p-6 text-sm text-slate-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-300">
          You have no active reports yet. Start by reporting a lost or found item to create your recovery trail.
        </div>
      )}
    </section>
  )
}

export function CampusMap({ items }: CampusMapProps) {
  const markers = items.slice(0, 6)

  return (
    <section className="space-y-4 rounded-[2rem] border border-slate-200/70 bg-white p-5 shadow-[0_18px_50px_rgba(15,23,42,0.07)] dark:border-white/10 dark:bg-white/5 sm:p-6">
      <SectionHeading
        eyebrow="Campus map"
        title="Lost item locations, found item locations, and hotspots"
        description="This map layout is ready for Google Maps integration later while still giving students a quick visual cue right now."
      />

      <div className="grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="relative min-h-[22rem] overflow-hidden rounded-[1.75rem] border border-slate-200 bg-[linear-gradient(180deg,#f8fafc,#eff6ff)] p-4 dark:border-white/10 dark:bg-[linear-gradient(180deg,rgba(15,23,42,0.9),rgba(7,17,31,0.82))]">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(148,163,184,0.16)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.16)_1px,transparent_1px)] bg-[size:42px_42px] opacity-60 dark:opacity-40" />
          <div className="absolute left-0 top-0 h-full w-full bg-[radial-gradient(circle_at_20%_20%,rgba(34,197,94,0.22),transparent_18%),radial-gradient(circle_at_72%_24%,rgba(59,130,246,0.18),transparent_20%),radial-gradient(circle_at_65%_70%,rgba(20,83,45,0.22),transparent_18%)]" />

          <div className="absolute left-4 top-4 z-10 rounded-full bg-white/90 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-slate-600 shadow-sm dark:bg-slate-950/70 dark:text-slate-200">
            Campus hotspots
          </div>

          <div className="relative z-10 h-full min-h-[19rem] rounded-[1.5rem] border border-white/60 bg-white/30 p-4 shadow-inner backdrop-blur dark:border-white/10 dark:bg-white/5">
            {markers.length ? (
              markers.map((item, index) => {
                const position = resolveMarkerPosition(item, index)
                return (
                  <div key={item.id} className="absolute -translate-x-1/2 -translate-y-1/2" style={position}>
                    <div className={`flex items-center gap-2 rounded-full border px-3 py-2 text-xs font-semibold shadow-lg backdrop-blur ${itemTone(item.item_type)} border-white/70 dark:border-white/10`}>
                      <span className={`h-2.5 w-2.5 rounded-full ${item.item_type === 'lost' ? 'bg-rose-500' : 'bg-emerald-500'}`} />
                      {item.title}
                    </div>
                  </div>
                )
              })
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-slate-500 dark:text-slate-300">Map markers will appear here as items are posted.</div>
            )}
          </div>
        </div>

        <div className="space-y-3">
          <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-white/5">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Legend</p>
            <div className="mt-3 grid gap-2 text-sm text-slate-600 dark:text-slate-300">
              <div className="flex items-center gap-2"><span className="h-3 w-3 rounded-full bg-rose-500" />Lost items</div>
              <div className="flex items-center gap-2"><span className="h-3 w-3 rounded-full bg-emerald-500" />Found items</div>
              <div className="flex items-center gap-2"><span className="h-3 w-3 rounded-full bg-slate-400" />Hotspot zones</div>
            </div>
          </div>

          <div className="rounded-[1.5rem] border border-slate-200 bg-white p-4 dark:border-white/10 dark:bg-white/5">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Future integration</p>
            <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
              Replace this illustration with Google Maps or campus GIS coordinates later without changing the dashboard layout.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

export function StatisticsCards({ summary, averageMatchTime }: StatisticsCardsProps) {
  const cards = summary
    ? [
        {
          label: 'Recovery success rate',
          value: `${summary.success_percentage.toFixed(0)}%`,
          detail: 'What percentage of reports are resolved successfully.',
          accent: 'from-emerald-500/20 to-emerald-500/0',
        },
        {
          label: 'Total recovered items',
          value: summary.items_successfully_returned.toLocaleString(),
          detail: 'Items that have been successfully returned to students.',
          accent: 'from-slate-900/12 to-slate-900/0',
        },
        {
          label: 'Active reports',
          value: summary.active_reports.toLocaleString(),
          detail: 'Open lost and found reports currently being tracked.',
          accent: 'from-sky-500/18 to-sky-500/0',
        },
        {
          label: 'Average match time',
          value: averageMatchTime,
          detail: 'How quickly a likely match surfaces from recent activity.',
          accent: 'from-amber-500/18 to-amber-500/0',
        },
      ]
    : []

  return (
    <section className="space-y-4 rounded-[2rem] border border-slate-200/70 bg-white p-5 shadow-[0_18px_50px_rgba(15,23,42,0.07)] dark:border-white/10 dark:bg-white/5 sm:p-6">
      <SectionHeading
        eyebrow="Recovery statistics"
        title="Meaningful metrics for students and admins"
        description="The numbers stay lightweight and human-readable so the dashboard feels helpful instead of clinical."
      />

      {cards.length ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {cards.map((card) => (
            <article key={card.label} className="relative overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-white/5">
              <div className={`pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b ${card.accent}`} />
              <div className="relative space-y-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">{card.label}</p>
                  <p className="mt-3 font-display text-3xl font-bold tracking-tight text-slate-950 dark:text-white">{card.value}</p>
                </div>
                <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">{card.detail}</p>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="rounded-[1.5rem] border border-dashed border-slate-200 bg-slate-50 p-6 text-sm text-slate-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-300">
          Metrics will appear here once the campus feed has activity.
        </div>
      )}
    </section>
  )
}

export function NotificationPanel({ notifications }: NotificationPanelProps) {
  return (
    <section className="space-y-4 rounded-[2rem] border border-slate-200/70 bg-white p-5 shadow-[0_18px_50px_rgba(15,23,42,0.07)] dark:border-white/10 dark:bg-white/5 sm:p-6">
      <SectionHeading
        eyebrow="Notifications"
        title="Match alerts, claim requests, and report updates"
        description="Students should never miss a return opportunity, so the latest activity stays visible here."
      />

      {notifications.length ? (
        <div className="grid gap-3">
          {notifications.slice(0, 5).map((notification) => (
            <article key={notification.id} className="flex gap-4 rounded-[1.5rem] border border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-white/5">
              <div className={`mt-0.5 grid h-11 w-11 shrink-0 place-items-center rounded-2xl ${notificationTone(notification.type)}`}>
                <span className="text-xs font-semibold uppercase tracking-[0.18em]">{notification.type.slice(0, 2)}</span>
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-semibold text-slate-950 dark:text-white">{notification.title}</h3>
                  {!notification.is_read ? <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" /> : null}
                </div>
                <p className="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-300">{notification.message}</p>
                <p className="mt-2 text-xs font-medium uppercase tracking-[0.18em] text-slate-400 dark:text-slate-500">{timeAgo(notification.created_at)}</p>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="rounded-[1.5rem] border border-dashed border-slate-200 bg-slate-50 p-6 text-sm text-slate-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-300">
          Match alerts and claim updates will appear here once the platform starts finding relevant items.
        </div>
      )}
    </section>
  )
}

export function CommunityTrustSection({ summary }: CommunityTrustSectionProps) {
  const returned = summary?.items_successfully_returned ?? 834
  const rate = summary?.success_percentage ?? 67

  return (
    <section className="space-y-4 rounded-[2rem] border border-slate-200/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(240,253,244,0.95))] p-5 shadow-[0_18px_50px_rgba(15,23,42,0.07)] dark:border-white/10 dark:bg-[linear-gradient(180deg,rgba(15,23,42,0.92),rgba(7,17,31,0.86))] sm:p-6">
      <SectionHeading
        eyebrow="Community trust"
        title={`${returned.toLocaleString()} items successfully returned`}
        description={`${rate.toFixed(0)}% recovery rate with student-first reporting and verification.`}
      />

      <div className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-[1.75rem] border border-slate-200 bg-white p-5 dark:border-white/10 dark:bg-white/5">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-[1.25rem] bg-slate-50 p-4 dark:bg-white/5">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Returned items</p>
              <p className="mt-2 font-display text-3xl font-bold text-slate-950 dark:text-white">{returned.toLocaleString()}</p>
            </div>
            <div className="rounded-[1.25rem] bg-slate-50 p-4 dark:bg-white/5">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Recovery rate</p>
              <p className="mt-2 font-display text-3xl font-bold text-slate-950 dark:text-white">{rate.toFixed(0)}%</p>
            </div>
          </div>
          <div className="mt-4 rounded-[1.25rem] bg-emerald-500/10 p-4 text-sm leading-7 text-slate-700 dark:bg-emerald-500/15 dark:text-slate-100">
            Trusted by students who need quick answers, clear status updates, and a recovery process that feels human.
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <blockquote className="rounded-[1.5rem] border border-slate-200 bg-white p-4 text-sm leading-7 text-slate-700 dark:border-white/10 dark:bg-white/5 dark:text-slate-200">
            "The match alert helped me recover my wallet before the end of the day."
            <footer className="mt-3 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400 dark:text-slate-500">Aisha, Computer Science</footer>
          </blockquote>
          <blockquote className="rounded-[1.5rem] border border-slate-200 bg-white p-4 text-sm leading-7 text-slate-700 dark:border-white/10 dark:bg-white/5 dark:text-slate-200">
            "Posting a found item took less than a minute, and the owner confirmed it fast."
            <footer className="mt-3 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400 dark:text-slate-500">Daniel, Business Student</footer>
          </blockquote>
          <blockquote className="rounded-[1.5rem] border border-slate-200 bg-white p-4 text-sm leading-7 text-slate-700 dark:border-white/10 dark:bg-white/5 dark:text-slate-200">
            "The reports page made it obvious what was happening at every step."
            <footer className="mt-3 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400 dark:text-slate-500">Mina, Architecture</footer>
          </blockquote>
        </div>
      </div>
    </section>
  )
}
