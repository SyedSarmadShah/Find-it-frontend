import { useEffect, useState } from 'react'

type ImageUploaderProps = {
  value: File | null
  onChange: (file: File | null) => void
  previewUrl?: string | null
  label?: string
  helperText?: string
}

const PLACEHOLDER_IMAGE =
  'data:image/svg+xml;charset=UTF-8,%3Csvg xmlns%3D%22http%3A//www.w3.org/2000/svg%22 viewBox%3D%220 0 1200 900%22%3E%3Crect width%3D%221200%22 height%3D%22900%22 rx%3D%2256%22 fill%3D%22%23f4ebda%22/%3E%3Cpath d%3D%22M140 690l220-240 140 150 120-120 210 210H140z%22 fill%3D%22%231b2b40%22 fill-opacity%3D%220.08%22/%3E%3Ccircle cx%3D%22880%22 cy%3D%22230%22 r%3D%22110%22 fill%3D%22%2331564c%22 fill-opacity%3D%220.12%22/%3E%3Ctext x%3D%22600%22 y%3D%22460%22 text-anchor%3D%22middle%22 font-family%3D%22Arial%2Csans-serif%22 font-size%3D%2272%22 font-weight%3D%22700%22 fill%3D%22%231b2b40%22 fill-opacity%3D%220.38%22%3EImage preview%3C/text%3E%3C/svg%3E'

export default function ImageUploader({ value, onChange, previewUrl, label = 'Item image', helperText = 'Upload a clear image so other users can identify the item faster.' }: ImageUploaderProps) {
  const [localPreview, setLocalPreview] = useState<string | null>(null)

  useEffect(() => {
    if (!value) {
      setLocalPreview(null)
      return
    }

    const objectUrl = URL.createObjectURL(value)
    setLocalPreview(objectUrl)

    return () => URL.revokeObjectURL(objectUrl)
  }, [value])

  const displayPreview = localPreview ?? previewUrl ?? PLACEHOLDER_IMAGE

  return (
    <section className="grid gap-3 rounded-[1.5rem] border border-black/10 bg-white/70 p-4 dark:border-white/10 dark:bg-white/5 sm:p-5">
      <div className="flex flex-col gap-1">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-ink/45 dark:text-paper/45">{label}</p>
        <p className="text-sm text-ink/60 dark:text-paper/65">{helperText}</p>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr] lg:items-stretch">
        <label className="flex cursor-pointer flex-col items-center justify-center rounded-[1.5rem] border border-dashed border-black/15 bg-white px-4 py-6 text-center transition hover:border-moss hover:bg-moss/5 dark:border-white/15 dark:bg-surface-strong dark:hover:border-moss/60">
          <input
            type="file"
            accept="image/*"
            onChange={(event) => onChange(event.target.files?.[0] ?? null)}
            className="sr-only"
          />
          <span className="rounded-full bg-ink px-4 py-3 text-sm font-semibold text-paper dark:bg-paper dark:text-ink">
            Choose image
          </span>
          <span className="mt-3 text-sm text-ink/60 dark:text-paper/60">PNG, JPG, or WEBP</span>
        </label>

        <div className="overflow-hidden rounded-[1.5rem] border border-black/10 bg-sand dark:border-white/10 dark:bg-white/5">
          <div className="aspect-[4/3] w-full overflow-hidden sm:aspect-[16/10]">
            <img src={displayPreview} alt="Item preview" className="h-full w-full object-cover" />
          </div>
          <div className="border-t border-black/10 px-4 py-3 text-sm text-ink/60 dark:border-white/10 dark:text-paper/60">
            {value ? value.name : previewUrl ? 'Current uploaded image' : 'No image selected yet'}
          </div>
        </div>
      </div>
    </section>
  )
}