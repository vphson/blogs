/**
 * Zen Theme Design Tokens
 * Theme: Warm, book-like aesthetic inspired by traditional Vietnamese/Zen minimalism
 */

import type { ThemeTokens } from '../types'

export const zenTheme: ThemeTokens = {
  name: 'zen',
  label: 'Zen Theme',

  // Colors
  colors: {
    // Backgrounds
    background: {
      DEFAULT: '#fafaf9', // --paper-bg
      surface: '#f5f5f4', // --paper-surface
      elevated: '#ffffff', // --paper-elevated
    },

    // Text
    text: {
      primary: '#1c1917', // --text-primary
      secondary: '#44403c', // --text-secondary
      muted: '#78716c', // --text-muted
      inverse: '#ffffff',
    },

    // Borders
    border: {
      DEFAULT: '#e7e5e4', // --accent-border
      subtle: '#f5f5f4',
      strong: '#d6d3d1',
    },

    // Accents
    accent: {
      DEFAULT: '#78350f', // --accent-brown
      hover: '#92400e', // --accent-amber
      active: '#78350f',
      subtle: '#fef3c7', // amber-100
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
      display: "'Playfair Display', Georgia, serif",
      body: "'Merriweather', Georgia, serif",
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
    xs: '0.25rem', // 4px
    sm: '0.5rem', // 8px
    md: '1rem', // 16px
    lg: '1.5rem', // 24px
    xl: '2rem', // 32px
    '2xl': '3rem', // 48px
    '3xl': '4rem', // 64px
  },

  // Border radius
  radius: {
    none: '0',
    sm: '0.125rem',
    DEFAULT: '0.25rem',
    md: '0.375rem',
    lg: '0.5rem',
    xl: '0.75rem',
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
    DEFAULT: '200ms ease-out',
    fast: '150ms ease-out',
    slow: '300ms ease-out',
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
