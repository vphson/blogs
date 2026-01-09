/**
 * Environment configuration with validation
 * Throws error at build/start time if required env vars are missing
 */

const requiredEnvVars = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
] as const

function getEnvVar(key: string): string {
  const value = process.env[key]
  if (!value) {
    throw new Error(`❌ Missing required environment variable: ${key}`)
  }
  return value
}

// Validate all required env vars at import time
for (const envVar of requiredEnvVars) {
  getEnvVar(envVar)
}

export const config = {
  supabase: {
    url: getEnvVar('NEXT_PUBLIC_SUPABASE_URL'),
    anonKey: getEnvVar('NEXT_PUBLIC_SUPABASE_ANON_KEY'),
  },
} as const

export type Config = typeof config
