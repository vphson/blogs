'use client';

import { Button } from './Button';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

interface ErrorFallbackProps {
  error?: Error;
  reset?: () => void;
  title?: string;
  message?: string;
}

/**
 * ErrorFallback component - user-friendly error display
 * Shown when an ErrorBoundary catches an error
 */
export function ErrorFallback({
  error,
  reset,
  title = 'Đã có lỗi xảy ra',
  message = 'Xin lỗi, chúng tôi đang gặp sự cố kỹ thuật. Vui lòng thử lại.',
}: ErrorFallbackProps) {
  const handleReset = () => {
    if (reset) {
      reset();
    } else {
      window.location.reload();
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[60vh] px-4">
      <div className="text-center max-w-md">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-6">
          <ExclamationTriangleIcon
            className="w-8 h-8 text-muted-foreground"
            aria-hidden="true"
          />
        </div>

        <h1 className="text-2xl font-semibold mb-3">{title}</h1>

        <p className="text-muted-foreground mb-6">{message}</p>

        {error?.message && process.env.NODE_ENV === 'development' && (
          <div className="mb-6 p-4 bg-muted/50 rounded-lg text-left">
            <p className="text-sm font-mono text-destructive break-words">
              {error.message}
            </p>
          </div>
        )}

        <Button onClick={handleReset}>Thử lại</Button>
      </div>
    </div>
  );
}
