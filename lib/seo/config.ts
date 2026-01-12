/**
 * SEO Configuration
 * Default SEO settings for the blog
 */

export const DEFAULT_SEO = {
  title: 'Zen Blog - Thiền & Chân Trời',
  description: 'Blog chia sẻ về thiền tập, mindfulness, và tìm kiếm inner peace trong cuộc sống hiện đại.',
  canonical: 'https://zenblog.example.com',
  openGraph: {
    type: 'website',
    locale: 'vi_VN',
    url: 'https://zenblog.example.com',
    siteName: 'Zen Blog',
    title: 'Zen Blog - Thiền & Chân Trời',
    description: 'Blog chia sẻ về thiền tập, mindfulness, và tìm kiếm inner peace trong cuộc sống hiện đại.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Zen Blog',
      },
    ],
  },
  twitter: {
    handle: '@zenblog',
    site: '@zenblog',
    cardType: 'summary_large_image',
  },
  additionalMetaTags: [
    {
      name: 'keywords',
      content: 'thiền, mindfulness, meditation, zen, inner peace, buddhism, tinh thần',
    },
    {
      name: 'author',
      content: 'Zen Blog',
    },
  ],
}

export const SEO_IMAGE_WIDTH = 1200
export const SEO_IMAGE_HEIGHT = 630
