import { PostCardSkeleton } from '@/components/public/PostCardSkeleton';

export default function Loading() {
  return (
    <main className="min-h-screen bg-zen-bg">
      <div className="zen-container py-16">
        {/* Top bar skeleton */}
        <div className="mb-12 flex items-center justify-between">
          <div className="h-10 w-24 bg-muted animate-pulse rounded" />
          <div className="h-10 w-64 bg-muted animate-pulse rounded" />
        </div>

        {/* Header skeleton */}
        <div className="mb-16 text-center">
          <div className="h-12 w-48 mx-auto bg-muted animate-pulse rounded mb-6" />
          <div className="h-6 w-64 mx-auto bg-muted animate-pulse rounded" />
        </div>

        {/* Horizontal rule skeleton */}
        <div className="mb-16 h-px bg-muted animate-pulse" />

        {/* Posts skeleton */}
        <div className="space-y-16 md:space-y-20">
          <PostCardSkeleton />
          <PostCardSkeleton />
          <PostCardSkeleton />
        </div>
      </div>
    </main>
  );
}
