/**
 * BackButton Component
 * Reusable back button with consistent styling
 */

import Link from 'next/link'
import { cn } from '@/lib/utils'

export interface BackButtonProps {
  href?: string
  label?: string
  onClick?: () => void
  className?: string
  variant?: 'default' | 'minimal'
}

export function BackButton({
  href = '/',
  label = 'Trang chủ',
  onClick,
  className,
  variant = 'default',
}: BackButtonProps) {
  const baseStyles = 'inline-flex items-center text-sm transition-colors'

  const variantStyles = {
    default: 'zen-link',
    minimal: 'text-zen-secondary hover:text-zen-primary',
  }

  const icon = (
    <svg
      className="mr-2 h-4 w-4"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M15 19l-7-7 7-7"
      />
    </svg>
  )

  if (onClick) {
    return (
      <button
        onClick={onClick}
        className={cn(baseStyles, variantStyles[variant], className)}
      >
        {icon}
        {label}
      </button>
    )
  }

  return (
    <Link href={href} className={cn(baseStyles, variantStyles[variant], className)}>
      {icon}
      {label}
    </Link>
  )
}
