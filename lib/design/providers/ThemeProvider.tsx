'use client'

/**
 * Theme Provider
 * Provides theme context and enables theme switching at runtime
 */

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import type { ThemeTokens, ThemeName } from '../tokens/types'
import { getTheme, themeConfig } from '../tokens'

interface ThemeContextValue {
  themeName: ThemeName
  tokens: ThemeTokens
  setTheme: (themeName: ThemeName) => void
  availableThemes: Array<{ name: ThemeName; label: string }>
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined)

export interface ThemeProviderProps {
  children: ReactNode
  defaultTheme?: ThemeName
  storageKey?: string
}

export function ThemeProvider({
  children,
  defaultTheme = themeConfig.defaultTheme,
  storageKey = 'blog-theme',
}: ThemeProviderProps) {
  const [themeName, setThemeState] = useState<ThemeName>(defaultTheme)
  const [mounted, setMounted] = useState(false)

  // Load theme from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(storageKey) as ThemeName | null
    if (stored && stored in themeConfig.themes) {
      setThemeState(stored)
    }
    setMounted(true)
  }, [storageKey])

  // Apply theme CSS variables to document
  useEffect(() => {
    if (!mounted) return

    const tokens = getTheme(themeName)
    const root = document.documentElement

    // Apply color variables
    root.style.setProperty('--background', tokens.colors.background.DEFAULT)
    root.style.setProperty('--surface', tokens.colors.background.surface)
    root.style.setProperty('--elevated', tokens.colors.background.elevated)

    root.style.setProperty('--text-primary', tokens.colors.text.primary)
    root.style.setProperty('--text-secondary', tokens.colors.text.secondary)
    root.style.setProperty('--text-muted', tokens.colors.text.muted)

    root.style.setProperty('--border', tokens.colors.border.DEFAULT)
    root.style.setProperty('--accent', tokens.colors.accent.DEFAULT)
    root.style.setProperty('--accent-hover', tokens.colors.accent.hover)

    // Apply semantic color variables
    root.style.setProperty('--success-bg', tokens.colors.semantic.success.bg)
    root.style.setProperty('--success-text', tokens.colors.semantic.success.text)
    root.style.setProperty('--warning-bg', tokens.colors.semantic.warning.bg)
    root.style.setProperty('--warning-text', tokens.colors.semantic.warning.text)
    root.style.setProperty('--error-bg', tokens.colors.semantic.error.bg)
    root.style.setProperty('--error-text', tokens.colors.semantic.error.text)
    root.style.setProperty('--info-bg', tokens.colors.semantic.info.bg)
    root.style.setProperty('--info-text', tokens.colors.semantic.info.text)

    // Apply font family variables
    root.style.setProperty('--font-display', tokens.typography.fontFamily.display)
    root.style.setProperty('--font-body', tokens.typography.fontFamily.body)

    // Apply transition variable
    root.style.setProperty('--transition', tokens.transition.DEFAULT)
  }, [themeName, mounted])

  // Save theme to localStorage when changed
  const setTheme = (newTheme: ThemeName) => {
    setThemeState(newTheme)
    localStorage.setItem(storageKey, newTheme)
  }

  const value: ThemeContextValue = {
    themeName,
    tokens: getTheme(themeName),
    setTheme,
    availableThemes: Object.entries(themeConfig.themes).map(([name, theme]) => ({
      name: name as ThemeName,
      label: theme.label,
    })),
  }

  // Prevent flash of unstyled content
  if (!mounted) {
    return <div style={{ visibility: 'hidden' }}>{children}</div>
  }

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

/**
 * Hook to use theme context
 */
export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
