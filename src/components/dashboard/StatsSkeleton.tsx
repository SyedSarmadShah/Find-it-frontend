type StatsSkeletonProps = {
  count?: number
}

export default function StatsSkeleton({ count = 8 }: StatsSkeletonProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="rounded-3xl border border-black/5 bg-white/80 p-5 dark:border-white/10 dark:bg-white/5">
          <div className="h-4 w-28 animate-pulse rounded bg-black/10 dark:bg-white/10" />
          <div className="mt-4 h-10 w-20 animate-pulse rounded bg-black/10 dark:bg-white/10" />
          <div className="mt-4 h-6 w-36 animate-pulse rounded-full bg-black/10 dark:bg-white/10" />
        </div>
      ))}
    </div>
  )
}
