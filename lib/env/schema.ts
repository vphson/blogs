import { z } from 'zod';

/**
 * Environment variable schema validation
 * Validates at build time to catch configuration errors early
 */

const envSchema = z.object({
  // Supabase (Required)
  NEXT_PUBLIC_SUPABASE_URL: z.string().url('Supabase URL phải là URL hợp lệ'),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(
    1,
    'Supabase Anon Key là bắt buộc'
  ),

  // Optional: Sentry
  SENTRY_DSN: z.string().url().optional(),
  SENTRY_AUTH_TOKEN: z.string().optional(),

  // Optional: Analytics
  NEXT_PUBLIC_GA_ID: z.string().optional(),

  // Environment
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
});

export type Env = z.infer<typeof envSchema>;

/**
 * Validate environment variables at build/import time
 * Throws clear error messages if validation fails
 */
function validateEnv(): Env {
  try {
    return envSchema.parse(process.env);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const missingVars = error.issues
        .map((e: z.ZodIssue) => e.path.join('.'))
        .join(', ');

      throw new Error(
        `❌ Environment Variables không hợp lệ:\n` +
          `   Missing: ${missingVars}\n\n` +
          `Vui lòng kiểm tra file .env của bạn.\n` +
          `Xem .env.test.example để biết các biến cần thiết.`
      );
    }
    throw error;
  }
}

/**
 * Export validated environment
 * Access this instead of process.env directly for type safety
 */
export const env = validateEnv();

/**
 * Check if we're in development mode
 */
export const isDevelopment = env.NODE_ENV === 'development';

/**
 * Check if we're in production mode
 */
export const isProduction = env.NODE_ENV === 'production';

/**
 * Check if we're in test mode
 */
export const isTest = env.NODE_ENV === 'test';

/**
 * Get Supabase configuration
 */
export const supabaseConfig = {
  url: env.NEXT_PUBLIC_SUPABASE_URL,
  anonKey: env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
};

/**
 * Get Sentry configuration (may be undefined)
 */
export const sentryConfig = {
  dsn: env.SENTRY_DSN,
  authToken: env.SENTRY_AUTH_TOKEN,
  enabled: !!env.SENTRY_DSN,
};
