import type { ItemMatch } from '../../services/itemService'

const MATCH_PLACEHOLDER =
  'data:image/svg+xml;charset=UTF-8,%3Csvg xmlns%3D%22http%3A//www.w3.org/2000/svg%22 viewBox%3D%220 0 1200 900%22%3E%3Crect width%3D%221200%22 height%3D%22900%22 rx%3D%2256%22 fill%3D%22%23f5f1e8%22/%3E%3Ccircle cx%3D%22310%22 cy%3D%22240%22 r%3D%22120%22 fill%3D%22%231b2b40%22 fill-opacity%3D%220.08%22/%3E%3Ccircle cx%3D%22920%22 cy%3D%22120%22 r%3D%22140%22 fill%3D%22%2331564c%22 fill-opacity%3D%220.14%22/%3E%3Ctext x%3D%22600%22 y%3D%22480%22 text-anchor%3D%22middle%22 font-family%3D%22Arial%2Csans-serif%22 font-size%3D%2274%22 font-weight%3D%22700%22 fill%3D%22%231b2b40%22 fill-opacity%3D%220.34%22%3ECompare items%3C/text%3E%3C/svg%3E'

type CompareMatchModalProps = {
  open: boolean
  match: ItemMatch | null
  onClose: () => void
  onConfirm?: (match: ItemMatch) => void | Promise<void>
  onReject?: (match: ItemMatch) => void | Promise<void>
  busy?: boolean
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString()
}

function itemSideLabel(side: 'lost' | 'found') {
  return side === 'lost' ? 'Lost item' : 'Found item'
}

export default function CompareMatchModal({ open, match, onClose, onConfirm, onReject, busy = false }: CompareMatchModalProps) {
  if (!open || !match) return null

  const lostItem = match.lost_item
  const foundItem = match.found_item

  const renderItem = (item: typeof lostItem, side: 'lost' | 'found') => (
    <article className="overflow-hidden rounded-[1.5rem] border border-black/5 bg-white/90 dark:border-white/10 dark:bg-white/5">
      <div className="aspect-[4/3] bg-sand dark:bg-white/5">
        <img src={item.image_url ?? item.image ?? MATCH_PLACEHOLDER} alt={item.title} className="h-full w-full object-cover" />
      </div>
      <div className="space-y-3 p-4">
        <div className="flex items-center justify-between gap-3">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-rust dark:text-paper/55">{itemSideLabel(side)}</p>
          <span className="rounded-full bg-black/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-ink/65 dark:bg-white/10 dark:text-paper/75">
            {item.status}
          </span>
        </div>
        <h4 className="font-display text-xl font-bold tracking-tight text-ink dark:text-paper">{item.title}</h4>
        <p className="text-sm leading-6 text-ink/70 dark:text-paper/70">{item.description}</p>
        <div className="grid gap-2 text-sm text-ink/65 dark:text-paper/65">
          <p><span className="font-semibold text-ink dark:text-paper">Category:</span> {item.category || 'General'}</p>
          <p><span className="font-semibold text-ink dark:text-paper">Location:</span> {item.location || 'Not provided'}</p>
          <p><span className="font-semibold text-ink dark:text-paper">Date:</span> {formatDate(item.date)}</p>
        </div>
      </div>
    </article>
  )

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-ink/55 px-3 py-3 backdrop-blur-sm sm:items-center sm:px-6">
      <div className="max-h-[calc(100vh-1.5rem)] w-full max-w-6xl overflow-y-auto rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(247,244,238,0.98))] p-4 shadow-[0_30px_120px_rgba(11,23,39,0.32)] dark:bg-surface-strong sm:p-6">
        <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-moss dark:text-paper/55">Compare match</p>
            <h3 className="mt-1 font-display text-2xl font-bold tracking-tight text-ink dark:text-paper sm:text-3xl">{match.score_percentage}% similarity</h3>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-ink/65 dark:text-paper/65">{match.match_reason}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-medium text-ink transition hover:bg-black/5 dark:border-white/10 dark:bg-white/5 dark:text-paper dark:hover:bg-white/10"
          >
            Close
          </button>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          {renderItem(lostItem, 'lost')}
          {renderItem(foundItem, 'found')}
        </div>

        {onConfirm || onReject ? (
          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            {onConfirm ? (
              <button
                type="button"
                disabled={busy}
                onClick={() => void onConfirm(match)}
                className="rounded-full bg-moss px-5 py-3 text-sm font-semibold text-paper transition hover:opacity-90 disabled:opacity-60"
              >
                Confirm match
              </button>
            ) : null}
            {onReject ? (
              <button
                type="button"
                disabled={busy}
                onClick={() => void onReject(match)}
                className="rounded-full bg-rust px-5 py-3 text-sm font-semibold text-paper transition hover:opacity-90 disabled:opacity-60"
              >
                Reject match
              </button>
            ) : null}
          </div>
        ) : null}
      </div>
    </div>
  )
}