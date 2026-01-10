/**
 * PageHeader Component
 * Reusable page header with optional back button, title, and actions
 */

import { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { BackButton } from './BackButton'

export interface PageHeaderProps {
  title?: string
  subtitle?: string
  showBackButton?: boolean
  backButtonHref?: string
  backButtonLabel?: string
  actions?: ReactNode
  className?: string
}

export function PageHeader({
  title,
  subtitle,
  showBackButton = false,
  backButtonHref = '/',
  backButtonLabel = 'Trang chủ',
  actions,
  className,
}: PageHeaderProps) {
  return (
    <div className={cn('mb-10 flex items-center justify-between', className)}>
      <div className="flex items-center gap-4">
        {showBackButton && <BackButton href={backButtonHref} label={backButtonLabel} />}
        {(title || subtitle) && (
          <div>
            {title && (
              <h1 className="font-display text-2xl font-semibold text-zen-primary">
                {title}
              </h1>
            )}
            {subtitle && (
              <p className="text-sm text-zen-muted">{subtitle}</p>
            )}
          </div>
        )}
      </div>
      {actions && <div className="flex items-center gap-3">{actions}</div>}
    </div>
  )
}
