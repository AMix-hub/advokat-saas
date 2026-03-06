export function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 animate-pulse">
      <div className="skeleton h-4 w-32 mb-4 rounded"></div>
      <div className="skeleton h-8 w-24 rounded mb-4"></div>
      <div className="skeleton h-full w-full rounded" style={{ height: '60px' }}></div>
    </div>
  )
}

export function SkeletonText({ lines = 3 }: { lines?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: lines }).map((_, i) => (
        <div key={i} className="skeleton h-4 w-full rounded" style={{ width: i === lines - 1 ? '80%' : '100%' }}></div>
      ))}
    </div>
  )
}

export function SkeletonTable() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex gap-4">
          <div className="skeleton h-10 w-10 rounded-lg flex-shrink-0"></div>
          <div className="flex-1 skeleton h-10 rounded-lg"></div>
          <div className="skeleton h-10 w-20 rounded-lg"></div>
        </div>
      ))}
    </div>
  )
}
