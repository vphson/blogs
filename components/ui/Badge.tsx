/**
 * Badge Component - Design System
 * A reusable badge component for status, labels, and categories
 */

import { HTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'
import { useTheme } from '@/lib/design/providers/ThemeProvider'

export interface BadgeProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info' | 'accent' | 'muted'
  size?: 'sm' | 'md' | 'lg'
}

export const Badge = forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant = 'default', size = 'md', children, ...props }, ref) => {
    const { tokens } = useTheme()

    const baseStyles = [
      'inline-flex items-center justify-center rounded-full font-medium transition-colors',
    ]

    const variantStyles = {
      default: [
        `bg-[${tokens.colors.background.surface}]`,
        `text-[${tokens.colors.text.primary}]`,
        `border border-[${tokens.colors.border.DEFAULT}]`,
      ],
      success: [
        `bg-[${tokens.colors.semantic.success.bg}]`,
        `text-[${tokens.colors.semantic.success.text}]`,
      ],
      warning: [
        `bg-[${tokens.colors.semantic.warning.bg}]`,
        `text-[${tokens.colors.semantic.warning.text}]`,
      ],
      error: [
        `bg-[${tokens.colors.semantic.error.bg}]`,
        `text-[${tokens.colors.semantic.error.text}]`,
      ],
      info: [
        `bg-[${tokens.colors.semantic.info.bg}]`,
        `text-[${tokens.colors.semantic.info.text}]`,
      ],
      accent: [
        `bg-[${tokens.colors.accent.subtle}]`,
        `text-[${tokens.colors.accent.DEFAULT}]`,
      ],
      muted: [
        `bg-[${tokens.colors.background.surface}]`,
        `text-[${tokens.colors.text.muted}]`,
      ],
    }

    const sizeStyles = {
      sm: 'px-2 py-0.5 text-xs',
      md: 'px-2.5 py-1 text-sm',
      lg: 'px-3 py-1.5 text-base',
    }

    return (
      <div
        ref={ref}
        className={cn(baseStyles, variantStyles[variant], sizeStyles[size], className)}
        {...props}
      >
        {children}
      </div>
    )
  }
)

Badge.displayName = 'Badge'
