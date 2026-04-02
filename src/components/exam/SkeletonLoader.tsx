"use client";

export default function SkeletonLoader() {
  return (
    <div className="min-h-screen bg-[#edf2f5]">
      {/* Header Skeleton */}
      <div className="h-16 w-full bg-white border-bottom border-[#dbe3e8] px-7 flex items-center justify-between">
        <div className="h-8 w-28 shimmer rounded" />
        <div className="h-9 w-20 shimmer rounded" />
      </div>

      <div className="mx-auto grid max-w-[1440px] grid-cols-1 gap-6 px-4 py-6 lg:grid-cols-[1fr_340px]">
        {/* Left column */}
        <section className="space-y-4">
          {/* Status Bar Skeleton */}
          <div className="flex justify-between px-1">
            <div className="h-5 w-40 shimmer rounded" />
            <div className="h-5 w-16 shimmer rounded" />
          </div>

          <div className="h-9 w-48 shimmer rounded" />

          {/* Question Card Skeleton */}
          <div className="bg-white border border-[#dbe3e8] rounded p-6 space-y-4">
            <div className="h-6 w-full shimmer rounded" />
            <div className="h-6 w-3/4 shimmer rounded" />
            <div className="h-[200px] w-full max-w-sm shimmer rounded mt-4" />
          </div>

          {/* Options Skeleton */}
          <div className="space-y-3 mt-6">
            <div className="h-4 w-24 shimmer rounded px-1" />
            <div className="h-14 w-full shimmer rounded" />
            <div className="h-14 w-full shimmer rounded" />
            <div className="h-14 w-full shimmer rounded" />
            <div className="h-14 w-full shimmer rounded" />
          </div>

          {/* Nav Buttons Skeleton */}
          <div className="grid grid-cols-3 gap-3 mt-6">
            <div className="h-11 shimmer rounded" />
            <div className="h-11 shimmer rounded" />
            <div className="h-11 shimmer rounded" />
          </div>
        </section>

        {/* Right column (Sidebar) */}
        <aside className="space-y-4">
          <div className="flex justify-between items-center px-1">
            <div className="h-5 w-32 shimmer rounded" />
            <div className="h-8 w-24 shimmer rounded" />
          </div>

          {/* Palette Card */}
          <div className="bg-white border border-[#dbe3e8] rounded p-3">
            <div className="grid grid-cols-5 gap-2">
              {Array.from({ length: 15 }).map((_, i) => (
                <div key={i} className="h-9 shimmer rounded" />
              ))}
            </div>
          </div>

          {/* Legend Skeleton */}
          <div className="grid grid-cols-2 gap-3 px-1">
            <div className="h-3 shimmer rounded" />
            <div className="h-3 shimmer rounded" />
            <div className="h-3 shimmer rounded" />
            <div className="h-3 shimmer rounded" />
          </div>

          <div className="h-12 w-full shimmer rounded mt-2" />
        </aside>
      </div>
    </div>
  );
}
