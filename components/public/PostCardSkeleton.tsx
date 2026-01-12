import { Skeleton } from '@/components/ui/skeleton';
import { Card } from '@/components/ui/Card';

/**
 * PostCardSkeleton component - loading placeholder for post cards
 * Used with React Suspense when loading post lists
 */
export function PostCardSkeleton() {
  return (
    <Card className="p-6 space-y-4">
      {/* Category badge skeleton */}
      <Skeleton className="h-6 w-20 rounded-full" variant="rectangular" />

      {/* Title skeleton */}
      <Skeleton className="h-7 w-full" variant="text" />
      <Skeleton className="h-7 w-3/4" variant="text" />

      {/* Excerpt skeleton */}
      <div className="space-y-2 pt-2">
        <Skeleton className="h-4 w-full" variant="text" />
        <Skeleton className="h-4 w-full" variant="text" />
        <Skeleton className="h-4 w-2/3" variant="text" />
      </div>

      {/* Footer skeleton */}
      <div className="flex items-center justify-between pt-2">
        <Skeleton className="h-4 w-24" variant="text" />
        <Skeleton className="h-4 w-16" variant="text" />
      </div>
    </Card>
  );
}
