/**
 * Centralized error handling utilities
 */

import type { AppError } from './types/errors'

/**
 * Handle errors consistently across the application
 */
export function handleError(error: unknown, context: string): string {
  if (error instanceof Error) {
    console.error(`[${context}]`, error.message)
    return error.message
  }
  console.error(`[${context}]`, error)
  return 'Có lỗi xảy ra'
}

/**
 * Check if error is a Supabase error
 */
export function isSupabaseError(
  error: unknown
): error is { message: string; code?: string } {
  return (
    typeof error === 'object' &&
    error !== null &&
    'message' in error
  )
}

/**
 * Create a standardized error response
 */
export function createErrorResponse(error: unknown, context: string): AppError {
  const message = handleError(error, context)

  if (error instanceof Error && 'code' in error) {
    return {
      message,
      code: (error as any).code,
    }
  }

  return { message }
}

/**
 * Wrap async functions with error handling
 */
export function withErrorHandling<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  context: string
): T {
  return (async (...args: Parameters<T>) => {
    try {
      return await fn(...args)
    } catch (error) {
      const message = handleError(error, context)
      throw new Error(message)
    }
  }) as T
}
