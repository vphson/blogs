/**
 * Modern Theme Design Tokens
 * Theme: Clean, modern aesthetic with cool tones
 * Example of an alternative theme that can be switched to
 */

import type { ThemeTokens } from '../types'

export const modernTheme: ThemeTokens = {
  name: 'modern',
  label: 'Modern Theme',

  // Colors
  colors: {
    // Backgrounds
    background: {
      DEFAULT: '#ffffff',
      surface: '#f8fafc',
      elevated: '#ffffff',
    },

    // Text
    text: {
      primary: '#0f172a',
      secondary: '#475569',
      muted: '#94a3b8',
      inverse: '#ffffff',
    },

    // Borders
    border: {
      DEFAULT: '#e2e8f0',
      subtle: '#f1f5f9',
      strong: '#cbd5e1',
    },

    // Accents
    accent: {
      DEFAULT: '#3b82f6',
      hover: '#2563eb',
      active: '#1d4ed8',
      subtle: '#dbeafe',
    },

    // Semantic colors
    semantic: {
      success: {
        bg: '#dcfce7',
        text: '#166534',
        border: '#86efac',
      },
      warning: {
        bg: '#fef9c3',
        text: '#854d0e',
        border: '#fde047',
      },
      error: {
        bg: '#fee2e2',
        text: '#991b1b',
        border: '#fca5a5',
      },
      info: {
        bg: '#dbeafe',
        text: '#1e40af',
        border: '#93c5fd',
      },
    },
  },

  // Typography
  typography: {
    fontFamily: {
      display: "'Inter', system-ui, sans-serif",
      body: "'Inter', system-ui, sans-serif",
      mono: "'JetBrains Mono', monospace",
    },
    fontSize: {
      xs: ['0.75rem', { lineHeight: '1rem' }],
      sm: ['0.875rem', { lineHeight: '1.25rem' }],
      base: ['1rem', { lineHeight: '1.5rem' }],
      lg: ['1.125rem', { lineHeight: '1.75rem' }],
      xl: ['1.25rem', { lineHeight: '1.75rem' }],
      '2xl': ['1.5rem', { lineHeight: '2rem' }],
      '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
      '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
      '5xl': ['3rem', { lineHeight: '1' }],
      '6xl': ['3.75rem', { lineHeight: '1' }],
    },
    fontWeight: {
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
    },
    letterSpacing: {
      tight: '-0.025em',
      normal: '0',
      wide: '0.025em',
    },
  },

  // Spacing
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    '2xl': '3rem',
    '3xl': '4rem',
  },

  // Border radius
  radius: {
    none: '0',
    sm: '0.125rem',
    DEFAULT: '0.375rem',
    md: '0.5rem',
    lg: '0.75rem',
    xl: '1rem',
    full: '9999px',
  },

  // Shadows
  shadow: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    DEFAULT: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  },

  // Transitions
  transition: {
    DEFAULT: '200ms cubic-bezier(0.4, 0, 0.2, 1)',
    fast: '150ms cubic-bezier(0.4, 0, 0.2, 1)',
    slow: '300ms cubic-bezier(0.4, 0, 0.2, 1)',
  },

  // Z-index scale
  zIndex: {
    dropdown: 1000,
    sticky: 1020,
    fixed: 1030,
    modalBackdrop: 1040,
    modal: 1050,
    popover: 1060,
    tooltip: 1070,
  },
}
