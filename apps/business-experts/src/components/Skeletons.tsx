export function CardSkeleton() {
  return (
    <div className="card overflow-hidden rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-soft">
      {/* Media thumbnail shimmer */}
      <div className="aspect-[16/9] w-full shimmer-bg" />
      <div className="p-5 space-y-3">
        <div className="h-4 w-1/3 rounded-md shimmer-bg" />
        <div className="h-6 w-3/4 rounded-md shimmer-bg" />
        <div className="space-y-1.5">
          <div className="h-3.5 w-full rounded-md shimmer-bg" />
          <div className="h-3.5 w-4/5 rounded-md shimmer-bg" />
        </div>
        <div className="pt-2 flex items-center justify-between border-t border-slate-100 dark:border-slate-800">
          <div className="h-4 w-1/4 rounded-md shimmer-bg" />
          <div className="h-8 w-20 rounded-xl shimmer-bg" />
        </div>
      </div>
    </div>
  );
}

export function GridSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 md:gap-8">
      {Array.from({ length: count }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
}
