import { withSentryConfig } from '@sentry/nextjs';

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'static.vecteezy.com',
      },
    ],
    unoptimized: false,
  },
};

// Validate environment at build time
if (process.env.NODE_ENV !== 'test') {
  try {
    const requiredEnvVars = ['NEXT_PUBLIC_SUPABASE_URL', 'NEXT_PUBLIC_SUPABASE_ANON_KEY'];
    const missing = requiredEnvVars.filter((key) => !process.env[key]);

    if (missing.length > 0) {
      throw new Error(
        `❌ Missing required environment variables: ${missing.join(', ')}\n` +
          `Please check your .env file. See .env.test.example for reference.`
      );
    }

    // Validate URL format
    try {
      new URL(process.env.NEXT_PUBLIC_SUPABASE_URL);
    } catch {
      throw new Error('❌ NEXT_PUBLIC_SUPABASE_URL must be a valid URL');
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
      throw error;
    }
  }
}

// Sentry configuration
const SentryWebpackPluginOptions = {
  silent: true,
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
};

export default withSentryConfig(nextConfig, {
  silent: true,
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
});
