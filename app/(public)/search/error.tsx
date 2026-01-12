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
    console.error('Search page error:', error);
  }, [error]);

  return (
    <ErrorFallback
      error={error}
      reset={reset}
      title="Không thể tải kết quả tìm kiếm"
      message="Đã có lỗi xảy ra khi tìm kiếm. Vui lòng thử lại."
    />
  );
}
