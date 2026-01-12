'use client';

import { Suspense } from 'react';
import { PostCardSkeleton } from '@/components/public/PostCardSkeleton';

interface PostsListSuspenseProps {
  children: React.ReactNode;
}

export function PostsListSuspense({ children }: PostsListSuspenseProps) {
  return (
    <Suspense
      fallback={
        <div className="space-y-10 md:space-y-12">
          <PostCardSkeleton />
          <PostCardSkeleton />
          <PostCardSkeleton />
        </div>
      }
    >
      {children}
    </Suspense>
  );
}
