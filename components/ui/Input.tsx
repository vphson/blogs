/**
 * Input Component - Design System
 * A reusable input component using design tokens
 */

import { InputHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'
import { useTheme } from '@/lib/design/providers/ThemeProvider'

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, label, error, helperText, id, ...props }, ref) => {
    const { tokens } = useTheme()

    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className={cn(
              'block text-sm font-medium mb-2',
              `text-[${tokens.colors.text.primary}]`
            )}
          >
            {label}
          </label>
        )}
        <input
          id={inputId}
          type={type}
          ref={ref}
          className={cn(
            'flex h-10 w-full rounded-md px-3 py-2 text-sm',
            'transition-colors',
            'file:border-0 file:bg-transparent file:text-sm file:font-medium',
            'placeholder:text-muted-foreground',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
            'disabled:cursor-not-allowed disabled:opacity-50',
            `bg-[${tokens.colors.background.elevated}]`,
            `border border-[${tokens.colors.border.DEFAULT}]`,
            `text-[${tokens.colors.text.primary}]`,
            error
              ? [
                  `border-[${tokens.colors.semantic.error.border}]`,
                  `focus-visible:ring-[${tokens.colors.semantic.error.border}]`,
                ]
              : [
                  `focus-visible:ring-[${tokens.colors.accent.DEFAULT}]`,
                  'focus-visible:border-transparent',
                ],
            className
          )}
          {...props}
        />
        {helperText && !error && (
          <p className={cn('mt-1 text-xs', `text-[${tokens.colors.text.muted}]`)}>
            {helperText}
          </p>
        )}
        {error && (
          <p className={cn('mt-1 text-xs', `text-[${tokens.colors.semantic.error.text}]`)}>
            {error}
          </p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'
