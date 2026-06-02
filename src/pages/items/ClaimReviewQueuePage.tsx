import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import PageHeader from '../../components/layout/PageHeader'
import { useToast } from '../../components/ui/ToastProvider'
import { approveClaim, listClaimReviewQueue, rejectClaim, type ItemClaim } from '../../services/itemService'

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat(undefined, {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(value))
}

function statusTone(status: ItemClaim['status']) {
  switch (status) {
    case 'pending':
      return 'bg-amber-500/15 text-amber-700 dark:bg-amber-500/20 dark:text-amber-100'
    case 'approved':
      return 'bg-emerald-500/15 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-100'
    case 'rejected':
      return 'bg-rose-500/15 text-rose-700 dark:bg-rose-500/20 dark:text-rose-100'
    case 'completed':
      return 'bg-sky-500/15 text-sky-700 dark:bg-sky-500/20 dark:text-sky-100'
    default:
      return 'bg-slate-500/15 text-slate-700 dark:bg-slate-500/20 dark:text-slate-100'
  }
}

export default function ClaimReviewQueuePage() {
  const { showToast } = useToast()
  const [claims, setClaims] = useState<ItemClaim[]>([])
  const [loading, setLoading] = useState(true)
  const [busyId, setBusyId] = useState<number | null>(null)
  const [notesById, setNotesById] = useState<Record<number, string>>({})
  const [phoneById, setPhoneById] = useState<Record<number, string>>({})
  const [pickupById, setPickupById] = useState<Record<number, string>>({})

  const pickupLocationOptions = [
    { value: 'eng', label: 'Mechanical Engineering, Electrical Engineering, Computer Engineering, Civil Engineering, and Biomedical Engineering' },
    { value: 'cs', label: 'Computer Science and Software Engineering' },
    { value: 'business', label: 'Management Sciences' },
    { value: 'math_is', label: 'Mathematics, Islamic Studies, and Sciences & Humanities' },
  ]

  const loadClaims = async () => {
    setLoading(true)
    try {
      const data = await listClaimReviewQueue()
      setClaims(data)
    } catch {
      showToast('Unable to load claim requests right now.', 'error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadClaims()

    const handleClaimsUpdated = () => {
      void loadClaims()
    }
    window.addEventListener('claims:updated', handleClaimsUpdated)

    return () => {
      window.removeEventListener('claims:updated', handleClaimsUpdated)
    }
  }, [])

  const pendingClaims = useMemo(() => claims.filter((claim) => claim.status === 'pending'), [claims])

  const handleReview = async (claim: ItemClaim, action: 'approve' | 'reject') => {
    setBusyId(claim.id)
    try {
      const notes = notesById[claim.id]?.trim()
      const phone = phoneById[claim.id]?.trim()
      const pickupLocation = pickupById[claim.id]?.trim()
      const payload: Record<string, any> = {}
      if (notes) payload.verification_notes = notes
      if (action === 'approve' && phone) payload.contact_number = phone
      if (action === 'approve' && pickupLocation) payload.pickup_location = pickupLocation

      const updated = action === 'approve' ? await approveClaim(claim.id, payload) : await rejectClaim(claim.id, payload)

      setClaims((current) => current.map((entry) => (entry.id === updated.id ? updated : entry)))
      showToast(action === 'approve' ? 'Claim approved. Claimant notified.' : 'Claim rejected. Claimant notified.', action === 'approve' ? 'success' : 'info')
    } catch {
      showToast('Unable to review this claim right now.', 'error')
    } finally {
      setBusyId(null)
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Claim review queue"
        title="Review ownership requests"
        description="Approve or reject incoming claim requests after checking the proof answers."
        actions={
          <Link
            to="/notifications"
            className="rounded-full border border-black/10 px-5 py-3 text-sm font-semibold text-ink transition hover:bg-black/5 dark:border-white/10 dark:text-paper dark:hover:bg-white/10"
          >
            Open notifications
          </Link>
        }
      />

      <section className="rounded-[2rem] border border-black/5 bg-white/70 p-4 shadow-glow backdrop-blur dark:border-white/10 dark:bg-white/5 sm:p-6">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-ink/45 dark:text-paper/45">Pending requests</p>
            <h2 className="font-display text-2xl font-bold tracking-tight text-ink dark:text-paper">
              {pendingClaims.length} pending claim{pendingClaims.length === 1 ? '' : 's'}
            </h2>
          </div>
        </div>

        {loading ? (
          <div className="rounded-2xl border border-black/5 bg-white/80 p-5 text-sm text-ink/60 dark:border-white/10 dark:bg-white/5 dark:text-paper/60">
            Loading claim queue...
          </div>
        ) : claims.length ? (
          <div className="grid gap-4">
            {claims.map((claim) => {
              const isPending = claim.status === 'pending'
              const isBusy = busyId === claim.id

              return (
                <article key={claim.id} className="rounded-[1.5rem] border border-black/5 bg-white/90 p-4 shadow-sm dark:border-white/10 dark:bg-white/5 sm:p-5">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ink/45 dark:text-paper/45">Claim #{claim.id}</p>
                      <h3 className="mt-1 font-display text-xl font-bold tracking-tight text-ink dark:text-paper">{claim.item_title || `Item ${claim.item}`}</h3>
                      <p className="mt-2 text-sm text-ink/65 dark:text-paper/65">
                        Submitted by <span className="font-medium">{claim.claimant_email}</span> on {formatDateTime(claim.created_at)}
                      </p>
                    </div>
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] ${statusTone(claim.status)}`}>
                      {claim.status}
                    </span>
                  </div>

                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl bg-black/5 p-3 text-sm dark:bg-white/5">
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ink/45 dark:text-paper/45">Brand</p>
                      <p className="mt-1 text-ink/85 dark:text-paper/85">{claim.answers.brand}</p>
                    </div>
                    <div className="rounded-2xl bg-black/5 p-3 text-sm dark:bg-white/5">
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ink/45 dark:text-paper/45">Unique marks</p>
                      <p className="mt-1 text-ink/85 dark:text-paper/85">{claim.answers.unique_marks}</p>
                    </div>
                    <div className="rounded-2xl bg-black/5 p-3 text-sm dark:bg-white/5">
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ink/45 dark:text-paper/45">Item contents</p>
                      <p className="mt-1 text-ink/85 dark:text-paper/85">{claim.answers.item_contents}</p>
                    </div>
                    <div className="rounded-2xl bg-black/5 p-3 text-sm dark:bg-white/5">
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ink/45 dark:text-paper/45">Additional details</p>
                      <p className="mt-1 text-ink/85 dark:text-paper/85">{claim.answers.additional_details}</p>
                    </div>
                  </div>

                  <div className="mt-4 grid gap-3">
                    <label className="grid gap-2 text-sm font-medium text-ink dark:text-paper">
                      Verification notes (optional)
                      <textarea
                        value={notesById[claim.id] ?? claim.verification_notes ?? ''}
                        onChange={(event) =>
                          setNotesById((current) => ({
                            ...current,
                            [claim.id]: event.target.value,
                          }))
                        }
                        placeholder="Add context for your decision"
                        disabled={!isPending || isBusy}
                        className="min-h-[88px] rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/15 disabled:cursor-not-allowed disabled:opacity-60 dark:border-white/10 dark:bg-surface-strong"
                      />
                    </label>

                    <label className="grid gap-2 text-sm font-medium text-ink dark:text-paper">
                      Contact number for claimant (optional)
                      <input
                        value={phoneById[claim.id] ?? ''}
                        onChange={(event) =>
                          setPhoneById((current) => ({
                            ...current,
                            [claim.id]: event.target.value,
                          }))
                        }
                        type="tel"
                        placeholder="e.g. +1 555 555 5555"
                        disabled={!isPending || isBusy}
                        className="rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/15 disabled:cursor-not-allowed disabled:opacity-60 dark:border-white/10 dark:bg-surface-strong"
                      />
                    </label>

                    <label className="grid gap-2 text-sm font-medium text-ink dark:text-paper">
                      Department coordinator / pickup location (optional)
                      <select
                        value={pickupById[claim.id] ?? claim.pickup_location ?? ''}
                        onChange={(event) =>
                          setPickupById((current) => ({
                            ...current,
                            [claim.id]: event.target.value,
                          }))
                        }
                        disabled={!isPending || isBusy}
                        className="rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/15 disabled:cursor-not-allowed disabled:opacity-60 dark:border-white/10 dark:bg-surface-strong"
                      >
                        <option value="">Select a coordinator option</option>
                        {pickupLocationOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </label>

                    <div className="flex flex-wrap items-center gap-3">
                      <button
                        type="button"
                        onClick={() => void handleReview(claim, 'approve')}
                        disabled={!isPending || isBusy}
                        className="rounded-full bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {isBusy ? 'Processing...' : 'Approve claim'}
                      </button>
                      <button
                        type="button"
                        onClick={() => void handleReview(claim, 'reject')}
                        disabled={!isPending || isBusy}
                        className="rounded-full bg-rose-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {isBusy ? 'Processing...' : 'Reject claim'}
                      </button>

                      <Link
                        to={`/items/${claim.item}`}
                        className="rounded-full border border-black/10 px-4 py-2.5 text-sm font-semibold text-ink transition hover:bg-black/5 dark:border-white/10 dark:text-paper dark:hover:bg-white/10"
                      >
                        Open item
                      </Link>
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-black/10 bg-white/70 p-6 text-sm text-ink/60 dark:border-white/10 dark:bg-white/5 dark:text-paper/60">
            No claim requests yet. New ownership requests will appear here automatically.
          </div>
        )}
      </section>
    </div>
  )
}
