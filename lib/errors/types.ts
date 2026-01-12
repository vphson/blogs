/**
 * Custom error types for the blog application
 * Provides structured error handling with proper HTTP status codes
 */

/**
 * Base error class for all blog-related errors
 */
export class BlogError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly statusCode: number = 500,
    public readonly details?: unknown
  ) {
    super(message);
    this.name = 'BlogError';
    Error.captureStackTrace(this, this.constructor);
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      code: this.code,
      statusCode: this.statusCode,
      details: this.details,
    };
  }
}

/**
 * Error thrown when a requested post is not found
 */
export class PostNotFoundError extends BlogError {
  constructor(slug: string) {
    super(
      `Bài viết không tồn tại: ${slug}`,
      'POST_NOT_FOUND',
      404,
      { slug }
    );
    this.name = 'PostNotFoundError';
  }
}

/**
 * Error thrown when authentication is required but not provided
 */
export class UnauthorizedError extends BlogError {
  constructor(message: string = 'Bạn cần đăng nhập để thực hiện hành động này') {
    super(message, 'UNAUTHORIZED', 401);
    this.name = 'UnauthorizedError';
  }
}

/**
 * Error thrown when user doesn't have permission for an action
 */
export class ForbiddenError extends BlogError {
  constructor(message: string = 'Bạn không có quyền thực hiện hành động này') {
    super(message, 'FORBIDDEN', 403);
    this.name = 'ForbiddenError';
  }
}

/**
 * Error thrown when validation fails (Zod errors, etc.)
 */
export class ValidationError extends BlogError {
  constructor(errors: unknown) {
    super(
      'Dữ liệu không hợp lệ',
      'VALIDATION_ERROR',
      400,
      { errors }
    );
    this.name = 'ValidationError';
  }
}

/**
 * Error thrown when a database operation fails
 */
export class DatabaseError extends BlogError {
  constructor(message: string, details?: unknown) {
    super(
      `Lỗi cơ sở dữ liệu: ${message}`,
      'DATABASE_ERROR',
      500,
      details
    );
    this.name = 'DatabaseError';
  }
}

/**
 * Error thrown when a category is not found
 */
export class CategoryNotFoundError extends BlogError {
  constructor(slug: string) {
    super(
      `Chủ đề không tồn tại: ${slug}`,
      'CATEGORY_NOT_FOUND',
      404,
      { slug }
    );
    this.name = 'CategoryNotFoundError';
  }
}

/**
 * Error thrown when slug generation fails or produces invalid slug
 */
export class InvalidSlugError extends BlogError {
  constructor(value: string) {
    super(
      `Không thể tạo slug từ: ${value}`,
      'INVALID_SLUG',
      400,
      { value }
    );
    this.name = 'InvalidSlugError';
  }
}

/**
 * Type guard to check if an error is a BlogError
 */
export function isBlogError(error: unknown): error is BlogError {
  return error instanceof BlogError;
}

/**
 * Format error for API responses
 */
export function formatErrorResponse(error: unknown) {
  if (isBlogError(error)) {
    return {
      error: {
        message: error.message,
        code: error.code,
        details: error.details,
      },
      status: error.statusCode,
    };
  }

  // Generic error fallback
  return {
    error: {
      message: 'Đã có lỗi xảy ra. Vui lòng thử lại.',
      code: 'INTERNAL_ERROR',
    },
    status: 500,
  };
}
