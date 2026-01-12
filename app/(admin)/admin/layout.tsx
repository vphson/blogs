'use client';

import { ErrorBoundary } from '@/components/ui/ErrorBoundary';
import { ErrorFallback } from '@/components/ui/ErrorFallback';
import { ReactNode } from 'react';

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <ErrorBoundary
      fallback={({ error, resetErrorBoundary }) => (
        <ErrorFallback
          error={error}
          reset={resetErrorBoundary}
          title="Đã có lỗi xảy ra"
          message="Không thể tải trang quản trị. Vui lòng thử lại."
        />
      )}
    >
      {children}
    </ErrorBoundary>
  );
}
