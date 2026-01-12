import { PostCardSkeleton } from '@/components/public/PostCardSkeleton';

export default function Loading() {
  return (
    <main className="min-h-screen bg-zen-bg">
      <div className="zen-container py-16">
        {/* Header skeleton */}
        <header className="mb-16 text-center">
          <div className="mb-6 flex justify-center gap-6">
            <div className="h-4 w-20 bg-muted animate-pulse rounded" />
            <div className="h-4 bg-muted animate-pulse rounded" />
            <div className="h-4 w-20 bg-muted animate-pulse rounded" />
          </div>
          <div className="h-10 w-32 mx-auto mb-4 bg-muted animate-pulse rounded" />
          <div className="h-10 w-64 mx-auto bg-muted animate-pulse rounded" />
        </header>

        {/* Results info skeleton */}
        <div className="mb-8">
          <div className="h-6 w-48 mx-auto bg-muted animate-pulse rounded" />
        </div>

        {/* Posts skeleton */}
        <div className="grid gap-8">
          <PostCardSkeleton />
          <PostCardSkeleton />
          <PostCardSkeleton />
        </div>
      </div>
    </main>
  );
}
