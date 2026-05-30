import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'

type ClaimRequestModalProps = {
  open: boolean
  itemTitle: string
  onClose: () => void
  onSubmit: (answers: {
    brand: string
    unique_marks: string
    item_contents: string
    additional_details: string
  }) => Promise<void>
}

const emptyForm = {
  brand: '',
  unique_marks: '',
  item_contents: '',
  additional_details: '',
}

export default function ClaimRequestModal({ open, itemTitle, onClose, onSubmit }: ClaimRequestModalProps) {
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!open) {
      setForm(emptyForm)
      setError('')
      setSaving(false)
    }
  }, [open])

  if (!open) return null

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setSaving(true)
    setError('')
    try {
      await onSubmit(form)
      setForm(emptyForm)
    } catch {
      setError('Unable to submit claim right now. Please verify your details and try again.')
    } finally {
      setSaving(false)
    }
  }

  const inputClass =
    'rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-ink/35 focus:border-moss focus:ring-2 focus:ring-moss/15 dark:border-white/10 dark:bg-surface-strong dark:text-paper dark:placeholder:text-paper/35'

  return (
    <div className="fixed inset-0 z-40 flex items-end justify-center bg-ink/45 px-3 py-4 backdrop-blur-sm sm:items-center sm:px-6">
      <div className="max-h-[calc(100vh-2rem)] w-full max-w-2xl overflow-y-auto rounded-[2rem] border border-black/10 bg-[color:var(--app-surface)] p-4 shadow-[0_30px_80px_rgba(11,23,39,0.28)] backdrop-blur-xl dark:border-white/10 sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-moss">Claim item</p>
            <h2 className="mt-2 font-display text-2xl font-bold tracking-tight text-ink dark:text-paper sm:text-3xl">Verify ownership of {itemTitle}</h2>
            <p className="mt-2 max-w-xl text-sm leading-6 text-ink/65 dark:text-paper/65">
              Share specific details that only the real owner should know. The finder will review these answers before approving the claim.
            </p>
          </div>
          <button type="button" onClick={onClose} className="rounded-full bg-black/5 px-3 py-2 text-sm font-medium text-ink/70 dark:bg-white/5 dark:text-paper/75">
            Close
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 grid gap-4">
          <div className="grid gap-4 md:grid-cols-2">
            <label className="grid gap-2 text-sm font-medium text-ink dark:text-paper">
              What brand is the item?
              <input
                value={form.brand}
                onChange={(event) => setForm({ ...form, brand: event.target.value })}
                className={inputClass}
                placeholder="Example: Apple, Nike, Samsung"
              />
            </label>
            <label className="grid gap-2 text-sm font-medium text-ink dark:text-paper">
              What unique marks/stickers does it have?
              <input
                value={form.unique_marks}
                onChange={(event) => setForm({ ...form, unique_marks: event.target.value })}
                className={inputClass}
                placeholder="Example: blue sticker, cracked corner, initials"
              />
            </label>
          </div>

          <label className="grid gap-2 text-sm font-medium text-ink dark:text-paper">
            What was inside the item?
            <textarea
              value={form.item_contents}
              onChange={(event) => setForm({ ...form, item_contents: event.target.value })}
              className={`${inputClass} min-h-[110px]`}
              placeholder="Example: charger, student card, earbuds"
            />
          </label>

          <label className="grid gap-2 text-sm font-medium text-ink dark:text-paper">
            Additional proof/details
            <textarea
              value={form.additional_details}
              onChange={(event) => setForm({ ...form, additional_details: event.target.value })}
              className={`${inputClass} min-h-[120px]`}
              placeholder="Any extra detail that confirms you own it"
            />
          </label>

          {error ? <p className="rounded-2xl bg-rust/10 px-4 py-3 text-sm text-rust dark:bg-rust/15 dark:text-paper">{error}</p> : null}

          <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:items-center sm:justify-end">
            <button type="button" onClick={onClose} className="rounded-full bg-black/5 px-5 py-3 text-sm font-semibold text-ink transition hover:bg-black/10 dark:bg-white/5 dark:text-paper dark:hover:bg-white/10">
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="rounded-full bg-moss px-5 py-3 text-sm font-semibold text-paper transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-moss/15 disabled:translate-y-0 disabled:opacity-60"
            >
              {saving ? 'Submitting...' : 'Submit claim'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}