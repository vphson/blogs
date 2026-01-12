import Image from 'next/image'
import { notFound } from 'next/navigation'
import { CategoryList } from '@/components/public/CategoryList'
import { PostContent } from '@/components/public/PostContent'
import { SearchBar } from '@/components/public/SearchBar'
import { BackButton } from '@/components/ui/BackButton'
import { getPostBySlug } from '@/lib/blog/queries'
import { formatDate } from '@/lib/formatters'
import { generateArticleStructuredData, generateBreadcrumbStructuredData } from '@/lib/seo/structured-data'

interface PostPageProps {
  params: Promise<{
    slug: string
  }>
}

const SITE_URL = 'https://zenblog.example.com'

export async function generateMetadata({ params }: PostPageProps) {
  const { slug } = await params
  try {
    const post = await getPostBySlug(slug)
    if (!post) {
      return {
        title: 'Bài viết không tồn tại - Zen Blog',
      }
    }

    const imageUrl = post.cover_image
      ? `${SITE_URL}${post.cover_image}`
      : `${SITE_URL}/og-image.jpg`

    return {
      title: `${post.title} - Zen Blog`,
      description: post.excerpt || `Đọc bài viết "${post.title}" về thiền tập và mindfulness.`,
      keywords: post.categories?.map((c) => c.name).join(', '),
      openGraph: {
        title: post.title,
        description: post.excerpt || post.title,
        url: `${SITE_URL}/posts/${post.slug}`,
        siteName: 'Zen Blog',
        type: 'article',
        publishedTime: post.published_at || post.created_at,
        modifiedTime: post.updated_at,
        authors: ['Zen Blogger'],
        images: [
          {
            url: imageUrl,
            width: 1200,
            height: 630,
            alt: post.title,
          },
        ],
        locale: 'vi_VN',
      },
      twitter: {
        card: 'summary_large_image',
        title: post.title,
        description: post.excerpt || post.title,
        images: [imageUrl],
      },
      alternates: {
        canonical: `${SITE_URL}/posts/${post.slug}`,
      },
    }
  } catch {
    return {
      title: 'Bài viết không tồn tại - Zen Blog',
    }
  }
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params
  const post = await getPostBySlug(slug)

  if (!post) {
    notFound()
  }

  // Generate structured data
  const articleStructuredData = generateArticleStructuredData(post, SITE_URL)
  const breadcrumbStructuredData = generateBreadcrumbStructuredData(
    [
      { name: 'Trang chủ', url: '/' },
      { name: post.title, url: `/posts/${post.slug}` },
    ],
    SITE_URL
  )

  return (
    <main className="min-h-screen bg-gradient-to-b from-zen-bg to-zen-surface">
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(articleStructuredData),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbStructuredData),
        }}
      />

      <article className="zen-container py-8 md:py-10">
        {/* Top bar with back button and search */}
        <div className="mb-6 flex items-center justify-between animate-fade-in">
          <BackButton />
          <SearchBar />
        </div>

        {/* Cover image */}
        {post.cover_image && (
          <div className="relative mb-8 aspect-[2/1] overflow-hidden rounded-zen border border-zen-border bg-zen-surface shadow-sm animate-fade-in delay-100">
            <Image
              src={post.cover_image}
              alt={post.title}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 100vw, 700px"
            />
          </div>
        )}

        {/* Categories with decorative element */}
        <div className="mb-4 animate-fade-in delay-100">
          {post.categories && post.categories.length > 0 ? (
            <CategoryList categories={post.categories} variant="default" />
          ) : (
            <div className="h-px w-12 bg-zen-border" />
          )}
        </div>

        {/* Title */}
        <h1 className="mb-4 font-display text-3xl md:text-4xl lg:text-5xl font-semibold text-zen-primary leading-tight animate-fade-in delay-100">
          {post.title}
        </h1>

        {/* Publish date */}
        <div className="mb-6 flex items-center gap-2 text-sm text-zen-muted animate-fade-in delay-200">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <time dateTime={post.published_at || post.created_at}>
            Đăng ngày {formatDate(post.published_at || post.created_at)}
          </time>
        </div>

        {/* Horizontal rule */}
        <hr className="mb-8 animate-fade-in delay-200" />

        {/* Content */}
        <div className="prose prose-lg max-w-none prose-headings:font-display prose-headings:font-semibold prose-headings:text-zen-primary prose-p:text-zen-secondary prose-p:leading-relaxed prose-a:text-zen-accent prose-a:no-underline prose-strong:text-zen-primary prose-code:text-zen-primary prose-pre:bg-zen-surface prose-blockquote:border-zen-border prose-blockquote:text-zen-secondary animate-fade-in delay-300">
          <PostContent content={post.content} />
        </div>

        {/* Horizontal rule */}
        <hr className="mt-10 mb-8" />

        {/* Footer */}
        <footer className="text-center animate-fade-in">
          <div className="inline-block p-6 md:p-8 bg-zen-elevated rounded-zen border border-zen-border mb-6">
            <blockquote className="font-display text-xl md:text-2xl text-zen-secondary leading-relaxed">
              &ldquo;Khi tâm tĩnh lặng,
              <br />
              muôn vấn đề tự tiêu tan&rdquo;
            </blockquote>
          </div>
          <BackButton label="Quay lại trang chủ" />
        </footer>
      </article>
    </main>
  )
}
