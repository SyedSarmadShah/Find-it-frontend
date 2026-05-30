type ThemeToggleProps = {
  theme: 'light' | 'dark'
  onToggle: () => void
}

export default function ThemeToggle({ theme, onToggle }: ThemeToggleProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/70 px-3 py-2 text-sm font-medium text-ink shadow-sm transition hover:-translate-y-0.5 hover:bg-white dark:border-white/10 dark:bg-white/5 dark:text-paper"
    >
      <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-ink text-[10px] font-bold text-paper dark:bg-paper dark:text-ink">
        {theme === 'dark' ? '☾' : '☀'}
      </span>
      {theme === 'dark' ? 'Dark' : 'Light'} mode
    </button>
  )
}
