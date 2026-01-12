import { PostCardSkeleton } from '@/components/public/PostCardSkeleton';

export default function Loading() {
  return (
    <main className="min-h-screen bg-zen-bg">
      <article className="zen-container py-12 md:py-16">
        {/* Top bar skeleton */}
        <div className="mb-10 flex items-center justify-between">
          <div className="h-10 w-24 bg-muted animate-pulse rounded" />
          <div className="h-10 w-64 bg-muted animate-pulse rounded" />
        </div>

        {/* Cover image skeleton */}
        <div className="mb-10 aspect-[2/1] bg-muted animate-pulse rounded-zen" />

        {/* Title skeleton */}
        <div className="mb-6 space-y-4">
          <div className="h-10 w-3/4 bg-muted animate-pulse rounded" />
          <div className="h-10 w-1/2 bg-muted animate-pulse rounded" />
        </div>

        {/* Date skeleton */}
        <div className="mb-10 h-4 w-32 bg-muted animate-pulse rounded" />

        {/* Content skeleton */}
        <div className="space-y-4">
          <div className="h-4 w-full bg-muted animate-pulse rounded" />
          <div className="h-4 w-full bg-muted animate-pulse rounded" />
          <div className="h-4 w-5/6 bg-muted animate-pulse rounded" />
          <div className="h-4 w-full bg-muted animate-pulse rounded" />
          <div className="h-4 w-4/5 bg-muted animate-pulse rounded" />
        </div>
      </article>
    </main>
  );
}
