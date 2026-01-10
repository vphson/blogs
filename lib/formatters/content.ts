/**
 * Content Formatting Utilities
 * Content analysis and formatting helpers
 */

const WORDS_PER_MINUTE = 200
const CHARS_PER_WORD = 5 // Average for Vietnamese

/**
 * Calculate reading time for content
 * @param content - Content to analyze
 * @param wordsPerMinute - Average reading speed (default: 200)
 * @returns Reading time string (e.g., "5 phút đọc")
 */
export function calculateReadingTime(
  content: string | null | undefined,
  wordsPerMinute: number = WORDS_PER_MINUTE
): string {
  if (!content || content.trim().length === 0) {
    return '0 phút đọc'
  }

  // Remove HTML tags if present
  const textContent = content.replace(/<[^>]*>/g, '').trim()

  // Count words (split by whitespace for Vietnamese)
  const words = textContent.split(/\s+/).filter(w => w.length > 0).length

  // Calculate minutes
  const minutes = Math.max(1, Math.ceil(words / wordsPerMinute))

  return `${minutes} phút đọc`
}

/**
 * Generate excerpt from content
 * @param content - Content to extract from
 * @param maxLength - Maximum length (default: 500)
 * @returns Generated excerpt
 */
export function generateExcerpt(
  content: string | null | undefined,
  maxLength: number = 500
): string {
  if (!content || content.trim().length === 0) {
    return ''
  }

  // Remove HTML tags
  const textContent = content.replace(/<[^>]*>/g, '').trim()

  if (textContent.length <= maxLength) {
    return textContent
  }

  // Truncate and add ellipsis
  return textContent.slice(0, maxLength).trim() + '...'
}

/**
 * Check if content is HTML
 * @param content - Content to check
 * @returns True if content appears to be HTML
 */
export function isHtmlContent(content: string | null | undefined): boolean {
  if (!content || content.trim().length === 0) {
    return false
  }

  const trimmed = content.trim()
  return trimmed.startsWith('<') && trimmed.endsWith('>')
}

/**
 * Strip HTML tags from content
 * @param content - Content with HTML
 * @returns Plain text content
 */
export function stripHtml(content: string | null | undefined): string {
  if (!content) return ''

  return content.replace(/<[^>]*>/g, '').trim()
}

/**
 * Truncate content to specified length
 * @param content - Content to truncate
 * @param maxLength - Maximum length
 * @param suffix - Suffix to add (default: "...")
 * @returns Truncated content
 */
export function truncateContent(
  content: string | null | undefined,
  maxLength: number,
  suffix: string = '...'
): string {
  if (!content) return ''

  if (content.length <= maxLength) {
    return content
  }

  return content.slice(0, maxLength).trim() + suffix
}

/**
 * Get word count from content
 * @param content - Content to count
 * @returns Number of words
 */
export function getWordCount(content: string | null | undefined): number {
  if (!content || content.trim().length === 0) {
    return 0
  }

  const textContent = content.replace(/<[^>]*>/g, '').trim()
  return textContent.split(/\s+/).filter(w => w.length > 0).length
}
