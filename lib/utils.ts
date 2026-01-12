import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Merge Tailwind CSS classes with proper precedence
 *
 * Combines clsx for conditional class names with tailwind-merge
 * to resolve Tailwind CSS class conflicts. Later classes override
 * earlier classes when there are conflicts.
 *
 * @param inputs - Class values to merge (strings, arrays, objects, etc.)
 *
 * @returns Merged class string with proper Tailwind precedence
 *
 * @example
 * ```tsx
 * // Simple usage
 * cn('px-4', 'py-2', 'bg-blue-500')
 * // => 'px-4 py-2 bg-blue-500'
 *
 * // With conditional classes
 * cn('base-class', isActive && 'active-class', condition && 'conditional')
 *
 * // With conflicting classes (later wins)
 * cn('px-4', 'px-8')
 * // => 'px-8'
 * ```
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Generate URL-friendly slug from Vietnamese text
 *
 * Converts Vietnamese text to a URL-safe slug by:
 * - Converting to lowercase
 * - Removing Vietnamese diacritics (đ → d, accent marks)
 * - Removing special characters (keeping only alphanumeric, spaces, hyphens)
 * - Replacing spaces with hyphens
 * - Removing duplicate hyphens
 *
 * @param text - The text to convert to slug
 *
 * @returns URL-friendly slug string
 *
 * @example
 * ```ts
 * generateSlug('Chào mừng đến với Việt Nam')
 * // => 'chao-mung-den-voi-viet-nam'
 *
 * generateSlug('Thiền & Mindfulness')
 * // => 'thien-mindfulness'
 *
 * generateSlug('  Multiple   spaces  ')
 * // => 'multiple-spaces'
 * ```
 */
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9\s-]/g, '') // Remove special chars
    .trim()
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens
}

/**
 * Format date to Vietnamese locale
 *
 * Formats a date or date string into Vietnamese locale format.
 * Output format: "day month year" (e.g., "1 tháng 1, 2024")
 *
 * @param date - Date object or ISO date string to format
 *
 * @returns Formatted date string in Vietnamese locale
 *
 * @example
 * ```ts
 * formatDate(new Date('2024-01-15'))
 * // => '15 tháng 1, 2024'
 *
 * formatDate('2024-12-25T00:00:00Z')
 * // => '25 tháng 12, 2024'
 * ```
 */
export function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

/**
 * Truncate text to specified length
 *
 * Shortens text to the specified length and adds "..." if truncated.
 * Preserves whole words by trimming at the boundary.
 *
 * @param text - The text to truncate
 * @param length - Maximum length before truncation
 *
 * @returns Truncated text with ellipsis if shortened
 *
 * @example
 * ```ts
 * truncate('Hello world', 5)
 * // => 'Hello...'
 *
 * truncate('Short', 10)
 * // => 'Short'
 *
 * truncate('This is a long text', 10)
 * // => 'This is a...'
 * ```
 */
export function truncate(text: string, length: number): string {
  if (text.length <= length) return text
  return text.slice(0, length).trim() + '...'
}

/**
 * Generate excerpt from content
 *
 * Creates an excerpt from HTML/Markdown content by:
 * - Removing Markdown headers (# symbols)
 * - Removing bold formatting (** and *)
 * - Converting markdown links to plain text
 * - Replacing newlines with spaces
 * - Truncating to specified length
 *
 * @param content - HTML or Markdown content
 * @param length - Maximum excerpt length (default: 150)
 *
 * @returns Plain text excerpt
 *
 * @example
 * ```ts
 * generateExcerpt('# Hello World\n\nThis is **bold** text.')
 * // => 'Hello World This is bold text.'
 *
 * generateExcerpt('Long content...', 50)
 * // => 'Long content...'
 * ```
 */
export function generateExcerpt(content: string, length = 150): string {
  // Remove markdown syntax
  const plainText = content
    .replace(/#{1,6}\s/g, '')
    .replace(/\*\*/g, '')
    .replace(/\*/g, '')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/\n/g, ' ')
    .trim()

  return truncate(plainText, length)
}
