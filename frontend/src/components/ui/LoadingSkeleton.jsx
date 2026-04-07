export default function LoadingSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      {/* Header skeleton */}
      <div className="h-8 bg-cream-dark rounded-lg w-1/3"></div>

      {/* 4 card skeletons */}
      <div className="grid md:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white rounded-lg border border-border p-6 h-24">
            <div className="h-4 bg-cream-dark rounded w-1/2 mb-3"></div>
            <div className="h-8 bg-cream-dark rounded w-2/3"></div>
          </div>
        ))}
      </div>

      {/* Chart skeleton */}
      <div className="bg-white rounded-lg border border-border p-6 h-64">
        <div className="h-4 bg-cream-dark rounded w-1/4 mb-4"></div>
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="h-4 bg-cream-dark rounded flex-1"></div>
              <div className="h-4 bg-cream-dark rounded w-16"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
