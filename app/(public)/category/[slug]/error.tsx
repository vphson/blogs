'use client';

import { useEffect } from 'react';
import { ErrorFallback } from '@/components/ui/ErrorFallback';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error to error reporting service
    console.error('Category page error:', error);
  }, [error]);

  return (
    <ErrorFallback
      error={error}
      reset={reset}
      title="Không thể tải danh mục"
      message="Danh mục này không tồn tại hoặc đã bị xóa."
    />
  );
}
