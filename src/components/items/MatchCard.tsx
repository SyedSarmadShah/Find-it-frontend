import type { ItemMatch } from '../../services/itemService'

const MATCH_PLACEHOLDER =
  'data:image/svg+xml;charset=UTF-8,%3Csvg xmlns%3D%22http%3A//www.w3.org/2000/svg%22 viewBox%3D%220 0 1200 900%22%3E%3Cdefs%3E%3ClinearGradient id%3D%22g%22 x1%3D%220%22 y1%3D%220%22 x2%3D%221%22 y2%3D%221%22%3E%3Cstop offset%3D%220%25%22 stop-color%3D%22%23f4ebda%22/%3E%3Cstop offset%3D%22100%25%22 stop-color%3D%22%23dce9e4%22/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width%3D%221200%22 height%3D%22900%22 rx%3D%2256%22 fill%3D%22url(%23g)%22/%3E%3Ccircle cx%3D%22260%22 cy%3D%22200%22 r%3D%22115%22 fill%3D%22%231b2b40%22 fill-opacity%3D%220.08%22/%3E%3Ccircle cx%3D%22880%22 cy%3D%22100%22 r%3D%22140%22 fill%3D%22%2331564c%22 fill-opacity%3D%220.16%22/%3E%3Cpath d%3D%22M190 670l180-190 160 150 120-110 250 250H190z%22 fill%3D%22%231b2b40%22 fill-opacity%3D%220.1%22/%3E%3Ctext x%3D%22600%22 y%3D%22480%22 text-anchor%3D%22middle%22 font-family%3D%22Arial%2Csans-serif%22 font-size%3D%2272%22 font-weight%3D%22700%22 fill%3D%22%231b2b40%22 fill-opacity%3D%220.35%22%3EMatch preview%3C/text%3E%3C/svg%3E'

type MatchCardProps = {
  match: ItemMatch
  onCompare: (match: ItemMatch) => void
}

function resolveOtherItem(match: ItemMatch) {
  return match.other_item ?? match.found_item
}

function statusTone(status: ItemMatch['status']) {
  switch (status) {
    case 'confirmed':
      return 'bg-moss/15 text-moss dark:bg-moss/25 dark:text-paper'
    case 'rejected':
      return 'bg-rust/15 text-rust dark:bg-rust/25 dark:text-paper'
    case 'viewed':
      return 'bg-navy/10 text-navy dark:bg-white/10 dark:text-paper'
    default:
      return 'bg-amber-500/15 text-amber-700 dark:bg-amber-500/20 dark:text-paper'
  }
}

export default function MatchCard({ match, onCompare }: MatchCardProps) {
  const item = resolveOtherItem(match)
  const matchStatusLabel = match.status.charAt(0).toUpperCase() + match.status.slice(1)

  return (
    <article className="group overflow-hidden rounded-[1.75rem] border border-black/5 bg-[linear-gradient(160deg,rgba(255,255,255,0.92),rgba(241,244,246,0.74))] shadow-[0_18px_50px_rgba(11,23,39,0.08)] backdrop-blur transition duration-300 hover:-translate-y-1 hover:shadow-[0_28px_70px_rgba(11,23,39,0.16)] dark:border-white/10 dark:bg-white/5">
      <div className="grid gap-0 lg:grid-cols-[1.05fr_1fr]">
        <div className="relative aspect-[4/3] overflow-hidden bg-sand dark:bg-white/5 lg:aspect-auto">
          <img src={item.image_url ?? item.image ?? MATCH_PLACEHOLDER} alt={item.title} className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]" />
          <div className="absolute left-4 top-4 flex flex-wrap gap-2">
            <span className={`rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] ${statusTone(match.status)}`}>
              {matchStatusLabel}
            </span>
            <span className="rounded-full bg-white/90 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-ink shadow-sm dark:bg-ink/70 dark:text-paper">
              {match.score_percentage}% match
            </span>
          </div>
        </div>

        <div className="flex h-full flex-col gap-4 p-5 sm:p-6">
          <div className="space-y-2">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-rust dark:text-paper/55">Potential match</p>
            <h3 className="font-display text-2xl font-bold tracking-tight text-ink dark:text-paper">{item.title}</h3>
            <p className="text-sm leading-6 text-ink/70 dark:text-paper/70">{item.description}</p>
          </div>

          <div className="flex flex-wrap gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-ink/50 dark:text-paper/50">
            <span className="rounded-full bg-black/5 px-3 py-1 dark:bg-white/5">{item.category || 'General'}</span>
            <span className="rounded-full bg-black/5 px-3 py-1 dark:bg-white/5">{item.location || 'Campus location'}</span>
            <span className="rounded-full bg-black/5 px-3 py-1 dark:bg-white/5">{new Date(item.date).toLocaleDateString()}</span>
          </div>

          <div className="rounded-2xl border border-black/5 bg-white/80 p-4 text-sm leading-6 text-ink/70 dark:border-white/10 dark:bg-white/5 dark:text-paper/70">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-moss dark:text-paper/55">Match reason</p>
            <p className="mt-2">{match.match_reason}</p>
          </div>

          <div className="mt-auto flex flex-wrap items-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => onCompare(match)}
              className="inline-flex items-center justify-center rounded-full bg-navy px-5 py-3 text-sm font-semibold text-paper shadow-[0_12px_28px_rgba(8,18,35,0.18)] transition duration-200 hover:-translate-y-0.5 hover:bg-navy/95"
            >
              Quick compare
            </button>
            <span className="text-sm text-ink/55 dark:text-paper/55">Score {match.score_percentage}%</span>
          </div>
        </div>
      </div>
    </article>
  )
}