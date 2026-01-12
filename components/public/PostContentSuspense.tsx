'use client';

import { Suspense } from 'react';
import { LoadingScreen } from '@/components/ui/LoadingScreen';

interface PostContentSuspenseProps {
  children: React.ReactNode;
}

export function PostContentSuspense({ children }: PostContentSuspenseProps) {
  return (
    <Suspense fallback={<LoadingScreen />}>
      {children}
    </Suspense>
  );
}
