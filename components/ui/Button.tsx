/**
 * Button Component - Design System
 * A reusable button component that uses design tokens
 */

import { ButtonHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'
import { useTheme } from '@/lib/design/providers/ThemeProvider'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  fullWidth?: boolean
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', fullWidth = false, children, ...props }, ref) => {
    const { tokens } = useTheme()

    const baseStyles = [
      'inline-flex items-center justify-center gap-2 rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
    ]

    const variantStyles = {
      primary: [
        `bg-[${tokens.colors.accent.DEFAULT}]`,
        `text-[${tokens.colors.text.inverse}]`,
        `hover:bg-[${tokens.colors.accent.hover}]`,
        `focus-visible:ring-[${tokens.colors.accent.DEFAULT}]`,
      ],
      secondary: [
        `bg-[${tokens.colors.background.surface}]`,
        `text-[${tokens.colors.text.primary}]`,
        `hover:bg-[${tokens.colors.border.DEFAULT}]`,
        `focus-visible:ring-[${tokens.colors.border.DEFAULT}]`,
      ],
      ghost: [
        'bg-transparent',
        `text-[${tokens.colors.text.primary}]`,
        `hover:bg-[${tokens.colors.background.surface}]`,
        `focus-visible:ring-[${tokens.colors.border.DEFAULT}]`,
      ],
      outline: [
        'bg-transparent',
        `border border-[${tokens.colors.border.DEFAULT}]`,
        `text-[${tokens.colors.text.primary}]`,
        `hover:bg-[${tokens.colors.background.surface}]`,
        `focus-visible:ring-[${tokens.colors.border.DEFAULT}]`,
      ],
    }

    const sizeStyles = {
      sm: 'h-8 px-3 text-sm',
      md: 'h-10 px-4 text-base',
      lg: 'h-12 px-6 text-lg',
    }

    return (
      <button
        ref={ref}
        className={cn(
          baseStyles,
          variantStyles[variant],
          sizeStyles[size],
          fullWidth && 'w-full',
          className
        )}
        style={
          {
            // Use inline styles for dynamic theme values
            '--button-bg': variant === 'primary' ? tokens.colors.accent.DEFAULT : '',
            '--button-hover': tokens.colors.accent.hover,
          } as React.CSSProperties
        }
        {...props}
      >
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'
