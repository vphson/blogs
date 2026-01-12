import { cn } from '@/lib/utils';

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'text' | 'circular' | 'rectangular';
}

/**
 * Skeleton component - placeholder for loading content
 * Supports text, circular, and rectangular variants
 */
export function Skeleton({
  className,
  variant = 'rectangular',
  ...props
}: SkeletonProps) {
  return (
    <div
      className={cn(
        'animate-pulse bg-muted',
        variant === 'circular' && 'rounded-full',
        variant === 'text' && 'rounded h-4',
        variant === 'rectangular' && 'rounded-md',
        className
      )}
      {...props}
    />
  );
}

/**
 * Text skeleton - optimized for text placeholders
 */
export function TextSkeleton({ className, ...props }: SkeletonProps) {
  return (
    <Skeleton
      variant="text"
      className={cn('h-4 w-3/4', className)}
      {...props}
    />
  );
}

/**
 * Circular skeleton - for avatars, icons, etc.
 */
export function CircularSkeleton({
  className,
  size = 'md',
  ...props
}: SkeletonProps & { size?: 'sm' | 'md' | 'lg' }) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
  };

  return (
    <Skeleton
      variant="circular"
      className={cn(sizeClasses[size], className)}
      {...props}
    />
  );
}
