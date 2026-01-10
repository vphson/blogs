/**
 * Design Token Type Definitions
 * Shared types for all theme tokens
 */

export interface ThemeTokens {
  name: string
  label: string

  colors: {
    background: {
      DEFAULT: string
      surface: string
      elevated: string
    }
    text: {
      primary: string
      secondary: string
      muted: string
      inverse: string
    }
    border: {
      DEFAULT: string
      subtle: string
      strong: string
    }
    accent: {
      DEFAULT: string
      hover: string
      active: string
      subtle: string
    }
    semantic: {
      success: SemanticColor
      warning: SemanticColor
      error: SemanticColor
      info: SemanticColor
    }
  }

  typography: {
    fontFamily: {
      display: string
      body: string
      mono: string
    }
    fontSize: Record<string, [string, Record<string, string>]>
    fontWeight: {
      normal: string
      medium: string
      semibold: string
      bold: string
    }
    letterSpacing: {
      tight: string
      normal: string
      wide: string
    }
  }

  spacing: {
    xs: string
    sm: string
    md: string
    lg: string
    xl: string
    '2xl': string
    '3xl': string
  }

  radius: {
    none: string
    sm: string
    DEFAULT: string
    md: string
    lg: string
    xl: string
    full: string
  }

  shadow: {
    sm: string
    DEFAULT: string
    md: string
    lg: string
    xl: string
  }

  transition: {
    DEFAULT: string
    fast: string
    slow: string
  }

  zIndex: {
    dropdown: number
    sticky: number
    fixed: number
    modalBackdrop: number
    modal: number
    popover: number
    tooltip: number
  }
}

export interface SemanticColor {
  bg: string
  text: string
  border: string
}

export type ThemeName = 'zen' | 'modern'

export interface ThemeConfig {
  defaultTheme: ThemeName
  themes: Record<ThemeName, ThemeTokens>
}
