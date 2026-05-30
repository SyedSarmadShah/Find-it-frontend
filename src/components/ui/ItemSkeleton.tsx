export default function ItemSkeleton() {
  return (
    <article className="overflow-hidden rounded-[1.75rem] border border-black/5 bg-white/80 shadow-[0_18px_50px_rgba(11,23,39,0.08)] backdrop-blur dark:border-white/10 dark:bg-white/5">
      <div className="aspect-[4/3] animate-pulse bg-black/10 dark:bg-white/10" />
      <div className="space-y-4 p-4 sm:p-6">
        <div className="flex flex-wrap gap-2">
          <div className="h-7 w-16 animate-pulse rounded-full bg-black/10 dark:bg-white/10" />
          <div className="h-7 w-20 animate-pulse rounded-full bg-black/10 dark:bg-white/10" />
        </div>
        <div className="flex flex-wrap gap-2">
          <div className="h-7 w-20 animate-pulse rounded-full bg-black/10 dark:bg-white/10" />
          <div className="h-7 w-28 animate-pulse rounded-full bg-black/10 dark:bg-white/10" />
          <div className="h-7 w-24 animate-pulse rounded-full bg-black/10 dark:bg-white/10" />
        </div>
        <div className="h-7 w-4/5 animate-pulse rounded-full bg-black/10 dark:bg-white/10" />
        <div className="h-4 w-full animate-pulse rounded-full bg-black/10 dark:bg-white/10" />
        <div className="h-4 w-5/6 animate-pulse rounded-full bg-black/10 dark:bg-white/10" />
        <div className="flex flex-col gap-3 pt-1 sm:flex-row">
          <div className="h-12 w-full animate-pulse rounded-full bg-black/10 dark:bg-white/10 sm:w-32" />
          <div className="h-12 w-full animate-pulse rounded-full bg-black/10 dark:bg-white/10 sm:w-32" />
        </div>
      </div>
    </article>
  )
}
