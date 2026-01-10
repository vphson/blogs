/**
 * Design Tokens Registry
 * Central registry for all available themes
 */

import type { ThemeConfig, ThemeName } from './types'
import { zenTheme } from './themes/zen'
import { modernTheme } from './themes/modern'

export const themeConfig: ThemeConfig = {
  defaultTheme: 'zen',
  themes: {
    zen: zenTheme,
    modern: modernTheme,
  },
}

export const themes = themeConfig.themes
export const defaultTheme = themeConfig.defaultTheme

/**
 * Get a specific theme by name
 */
export function getTheme(name: ThemeName = defaultTheme) {
  return themes[name]
}

/**
 * Get all available theme names
 */
export function getThemeNames(): ThemeName[] {
  return Object.keys(themes) as ThemeName[]
}

/**
 * Get theme metadata for all themes
 */
export function getThemeList() {
  return getThemeNames().map((name) => ({
    name,
    label: themes[name].label,
  }))
}
