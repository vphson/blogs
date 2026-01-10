/**
 * Date Formatting Utilities
 * Centralized date formatting for consistent display across the app
 */

export interface FormatDateOptions {
  locale?: string
  includeTime?: boolean
  format?: 'full' | 'long' | 'medium' | 'short'
}

/**
 * Format a date string to localized format
 * @param dateString - ISO date string
 * @param options - Formatting options
 * @returns Formatted date string
 */
export function formatDate(
  dateString: string | null | undefined,
  options: FormatDateOptions = {}
): string {
  if (!dateString) {
    return ''
  }

  const {
    locale = 'vi-VN',
    includeTime = false,
    format = 'long'
  } = options

  const date = new Date(dateString)

  // Handle invalid dates
  if (isNaN(date.getTime())) {
    return ''
  }

  const formatOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: format === 'short' ? 'numeric' : 'long',
    day: 'numeric',
  }

  if (includeTime) {
    formatOptions.hour = '2-digit'
    formatOptions.minute = '2-digit'
  }

  return date.toLocaleDateString(locale, formatOptions)
}

/**
 * Format date with relative time (e.g., "2 days ago")
 * @param dateString - ISO date string
 * @returns Relative time string
 */
export function formatRelativeTime(dateString: string | null | undefined): string {
  if (!dateString) return ''

  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return 'Vừa xong'
  if (diffMins < 60) return `${diffMins} phút trước`
  if (diffHours < 24) return `${diffHours} giờ trước`
  if (diffDays < 7) return `${diffDays} ngày trước`

  // Fall back to regular date for older posts
  return formatDate(dateString)
}

/**
 * Format date range (e.g., "Jan 1 - Jan 31, 2024")
 * @param startDate - Start date string
 * @param endDate - End date string
 * @returns Formatted date range
 */
export function formatDateRange(
  startDate: string | null | undefined,
  endDate: string | null | undefined
): string {
  if (!startDate || !endDate) return ''

  const start = new Date(startDate)
  const end = new Date(endDate)

  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    return ''
  }

  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }

  const startFormatted = start.toLocaleDateString('vi-VN', options)
  const endFormatted = end.toLocaleDateString('vi-VN', options)

  return `${startFormatted} - ${endFormatted}`
}
