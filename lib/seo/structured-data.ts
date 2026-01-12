/**
 * Structured Data Generator
 * Generates JSON-LD structured data for SEO
 */

import { Post } from '@/lib/types/blog'

export interface ArticleStructuredData {
  '@context': string
  '@type': string
  headline: string
  description: string
  image: string[]
  author: {
    '@type': string
    name: string
  }
  publisher: {
    '@type': string
    name: string
    logo?: {
      '@type': string
      url: string
    }
  }
  datePublished: string
  dateModified?: string
  mainEntityOfPage?: {
    '@type': string
    '@id': string
  }
}

export interface BreadcrumbStructuredData {
  '@context': string
  '@type': string
  itemListElement: Array<{
    '@type': string
    position: number
    name: string
    item?: string
  }>
}

export interface WebsiteStructuredData {
  '@context': string
  '@type': string
  name: string
  url: string
  description: string
  potentialAction?: {
    '@type': string
    target: string
    'query-input': string
  }
}

/**
 * Generate Article structured data for a blog post
 */
export function generateArticleStructuredData(
  post: Post,
  siteUrl: string = 'https://zenblog.example.com'
): ArticleStructuredData {
  const imageUrl = post.cover_image
    ? `${siteUrl}${post.cover_image}`
    : `${siteUrl}/og-image.jpg`

  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt || '',
    image: [imageUrl],
    author: {
      '@type': 'Person',
      name: 'Zen Blogger',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Zen Blog',
      logo: {
        '@type': 'ImageObject',
        url: `${siteUrl}/logo.png`,
      },
    },
    datePublished: post.created_at,
    dateModified: post.updated_at,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${siteUrl}/posts/${post.slug}`,
    },
  }
}

/**
 * Generate Breadcrumb structured data
 */
export function generateBreadcrumbStructuredData(
  items: Array<{ name: string; url?: string }>,
  siteUrl: string = 'https://zenblog.example.com'
): BreadcrumbStructuredData {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url ? `${siteUrl}${item.url}` : undefined,
    })),
  }
}

/**
 * Generate Website structured data for search
 */
export function generateWebsiteStructuredData(
  siteUrl: string = 'https://zenblog.example.com'
): WebsiteStructuredData {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Zen Blog',
    url: siteUrl,
    description: 'Blog chia sẻ về thiền tập, mindfulness, và tìm kiếm inner peace',
    potentialAction: {
      '@type': 'SearchAction',
      target: `${siteUrl}/search?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  }
}

/**
 * Generate Blog structured data
 */
export function generateBlogStructuredData(
  posts: Post[],
  siteUrl: string = 'https://zenblog.example.com'
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: 'Zen Blog',
    description: 'Blog chia sẻ về thiền tập, mindfulness',
    url: siteUrl,
    blogPost: posts.map((post) => ({
      '@type': 'BlogPosting',
      headline: post.title,
      url: `${siteUrl}/posts/${post.slug}`,
      datePublished: post.created_at,
      dateModified: post.updated_at,
      author: {
        '@type': 'Person',
        name: 'Zen Blogger',
      },
    })),
  }
}
