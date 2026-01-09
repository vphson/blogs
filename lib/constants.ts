/**
 * Application-wide constants
 * Centralized for easy maintenance and type safety
 */

// Post status constants (must match database enum: DRAFT, PUBLISHED)
export const POST_STATUS = {
  DRAFT: 'DRAFT',
  PUBLISHED: 'PUBLISHED',
} as const

// Extract the value type, not the key type
export type PostStatus = 'DRAFT' | 'PUBLISHED'

// App configuration
export const APP_CONFIG = {
  WORDS_PER_MINUTE: 200,
  DEFAULT_EXCERPT_LENGTH: 150,
  MAX_EXCERPT_LENGTH: 500,
  SEARCH_TIMEOUT: 5000,
} as const

// Locale settings
export const LOCALE = {
  VI_VN: 'vi-VN',
} as const

// Date format options
export const DATE_FORMATS = {
  VIETNAMESE: {
    year: 'numeric' as const,
    month: 'long' as const,
    day: 'numeric' as const,
  },
} as const

// Image placeholder (when image fails to load)
export const IMAGE_PLACEHOLDER = `data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect fill="%23e5e7eb" width="400" height="300"/%3E%3Ctext fill="%239ca3af" x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle"%3EInvalid image URL%3C/text%3E%3C/svg%3E`
