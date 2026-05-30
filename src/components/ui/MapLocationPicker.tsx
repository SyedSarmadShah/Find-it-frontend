import type { MouseEvent } from 'react'

type MapLocationPickerProps = {
  mapX: number | null
  mapY: number | null
  onChange: (x: number, y: number) => void
  onClear: () => void
}

export default function MapLocationPicker({ mapX, mapY, onChange, onClear }: MapLocationPickerProps) {
  const handleMapClick = (event: MouseEvent<HTMLButtonElement>) => {
    const rect = event.currentTarget.getBoundingClientRect()
    const x = ((event.clientX - rect.left) / rect.width) * 100
    const y = ((event.clientY - rect.top) / rect.height) * 100
    onChange(Number(x.toFixed(3)), Number(y.toFixed(3)))
  }

  return (
    <div className="space-y-3 rounded-[1.5rem] border border-black/10 bg-white/70 p-4 dark:border-white/10 dark:bg-white/5">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <p className="text-sm font-semibold text-ink dark:text-paper">Map location pin</p>
          <p className="text-xs text-ink/60 dark:text-paper/60">Click on the Hitec map to place the red marker where the item was lost or found.</p>
        </div>
        <button
          type="button"
          onClick={onClear}
          className="rounded-full border border-black/15 px-3 py-1.5 text-xs font-medium text-ink transition hover:bg-black/5 dark:border-white/20 dark:text-paper dark:hover:bg-white/10"
        >
          Clear pin
        </button>
      </div>

      <button
        type="button"
        onClick={handleMapClick}
        className="relative block w-full overflow-hidden rounded-2xl border border-black/10 bg-black/5 text-left focus:outline-none focus:ring-2 focus:ring-moss/30 dark:border-white/10"
        aria-label="Select location on Hitec campus map"
      >
        <img src="/map_hitec.png" alt="Hitec university map" className="h-auto w-full" />
        {mapX !== null && mapY !== null ? (
          <span
            className="pointer-events-none absolute h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-red-600 shadow-[0_0_0_3px_rgba(220,38,38,0.35)]"
            style={{ left: `${mapX}%`, top: `${mapY}%` }}
            aria-hidden="true"
          />
        ) : null}
      </button>

      <p className="text-xs text-ink/60 dark:text-paper/60">
        {mapX !== null && mapY !== null ? `Selected point: ${mapX.toFixed(2)}%, ${mapY.toFixed(2)}%` : 'No map point selected yet.'}
      </p>
    </div>
  )
}
