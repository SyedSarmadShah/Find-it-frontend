import { Link } from 'react-router-dom'

type ItemCardProps = {
  id: number
  itemType?: 'lost' | 'found'
  title: string
  description: string
  category: string
  location: string
  date: string
  status: string
  imageUrl?: string | null
  onClaim?: () => void
  showActions?: boolean
}

const PLACEHOLDER_IMAGE =
  'data:image/svg+xml;charset=UTF-8,%3Csvg xmlns%3D%22http%3A//www.w3.org/2000/svg%22 viewBox%3D%220 0 1200 900%22%3E%3Cdefs%3E%3ClinearGradient id%3D%22g%22 x1%3D%220%22 y1%3D%220%22 x2%3D%221%22 y2%3D%221%22%3E%3Cstop offset%3D%220%25%22 stop-color%3D%22%23f4ebda%22/%3E%3Cstop offset%3D%22100%25%22 stop-color%3D%22%23e2d3b4%22/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width%3D%221200%22 height%3D%22900%22 rx%3D%2256%22 fill%3D%22url(%23g)%22/%3E%3Ccircle cx%3D%22270%22 cy%3D%22210%22 r%3D%22100%22 fill%3D%22%231b2b40%22 fill-opacity%3D%220.08%22/%3E%3Ccircle cx%3D%22920%22 cy%3D%22110%22 r%3D%22140%22 fill%3D%22%2331564c%22 fill-opacity%3D%220.12%22/%3E%3Cpath d%3D%22M190 670l180-190 160 150 120-110 250 250H190z%22 fill%3D%22%231b2b40%22 fill-opacity%3D%220.11%22/%3E%3Crect x%3D%22310%22 y%3D%22580%22 width%3D%22580%22 height%3D%2268%22 rx%3D%2234%22 fill%3D%22%231b2b40%22 fill-opacity%3D%220.08%22/%3E%3Ctext x%3D%22600%22 y%3D%22495%22 text-anchor%3D%22middle%22 font-family%3D%22Arial%2Csans-serif%22 font-size%3D%2272%22 font-weight%3D%22700%22 fill%3D%22%231b2b40%22 fill-opacity%3D%220.38%22%3ENo image uploaded%3C/text%3E%3C/svg%3E'

const statusTone = {
  open: 'bg-navy/10 text-navy dark:bg-white/10 dark:text-paper',
  matched: 'bg-moss/15 text-moss dark:bg-moss/25 dark:text-paper',
  resolved: 'bg-rust/15 text-rust dark:bg-rust/25 dark:text-paper',
}

const itemTypeTone = {
  lost: 'bg-red-600 text-white shadow-[0_8px_20px_rgba(220,38,38,0.35)]',
  found: 'bg-green-600 text-white shadow-[0_8px_20px_rgba(22,163,74,0.35)]',
}

function formatDate(dateValue: string) {
  const parsedDate = new Date(dateValue)
  if (Number.isNaN(parsedDate.getTime())) return dateValue

  return new Intl.DateTimeFormat(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(parsedDate)
}

export default function ItemCard({ id, itemType = 'lost', title, description, category, location, date, status, imageUrl, onClaim, showActions = true }: ItemCardProps) {
  const statusLabel = status.charAt(0).toUpperCase() + status.slice(1)
  const itemTypeLabel = itemType === 'found' ? 'Found' : 'Lost'
  const resolvedImage = imageUrl || PLACEHOLDER_IMAGE
  const detailsHref = `/items/${id}`

  return (
    <article className="group flex flex-col overflow-hidden rounded-[1.75rem] border border-black/5 bg-white/80 shadow-[0_18px_50px_rgba(11,23,39,0.08)] backdrop-blur transition duration-300 hover:-translate-y-1 hover:shadow-[0_28px_70px_rgba(11,23,39,0.16)] dark:border-white/10 dark:bg-white/5">
      <div className="relative aspect-[4/3] overflow-hidden bg-sand dark:bg-white/5">
        <img src={resolvedImage} alt={title} className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]" />
        <div className="absolute left-3 top-3 flex flex-wrap gap-2 sm:left-4 sm:top-4">
          <span className={`rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] sm:text-[11px] ${itemTypeTone[itemType]}`}>
            {itemTypeLabel}
          </span>
          <span className={`rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] sm:text-[11px] ${statusTone[status as keyof typeof statusTone] ?? statusTone.open}`}>
            {statusLabel}
          </span>
        </div>
        {showActions ? (
          <div className="absolute right-3 top-3 flex flex-wrap justify-end gap-2 sm:right-4 sm:top-4">
            <Link
              to={detailsHref}
              className="inline-flex items-center justify-center rounded-full border border-white/70 bg-white/95 px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-ink shadow-[0_10px_24px_rgba(11,23,39,0.15)] transition duration-200 hover:-translate-y-0.5 hover:bg-paper focus:outline-none focus:ring-2 focus:ring-moss/40 dark:border-white/15 dark:bg-surface-strong dark:text-paper sm:px-4 sm:py-2.5 sm:text-[11px] sm:tracking-[0.2em]"
            >
              View details
            </Link>
            {itemType === 'found' && onClaim ? (
              <button
                type="button"
                onClick={onClaim}
                className="inline-flex items-center justify-center rounded-full bg-ink px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-paper shadow-[0_10px_24px_rgba(11,23,39,0.22)] transition duration-200 hover:-translate-y-0.5 hover:bg-navy hover:shadow-lg hover:shadow-ink/15 focus:outline-none focus:ring-2 focus:ring-ink/35 sm:px-4 sm:py-2.5 sm:text-[11px] sm:tracking-[0.2em]"
              >
                Claim item
              </button>
            ) : null}
          </div>
        ) : null}
      </div>

      <div className="flex flex-col gap-4 p-4 sm:p-6">
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-ink/45 dark:text-paper/45">
            <span className="rounded-full bg-black/5 px-3 py-1 dark:bg-white/5">{category || 'General'}</span>
            <span className="rounded-full bg-black/5 px-3 py-1 dark:bg-white/5">{location || 'Campus location'}</span>
            <span className="rounded-full bg-black/5 px-3 py-1 dark:bg-white/5">{formatDate(date)}</span>
          </div>
          <h3 className="font-display text-xl font-bold tracking-tight text-ink dark:text-paper sm:text-2xl">{title}</h3>
          <p className="text-sm leading-6 text-ink/70 dark:text-paper/70">{description}</p>
        </div>

      </div>
    </article>
  )
}
