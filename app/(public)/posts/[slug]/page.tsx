import { notFound } from 'next/navigation'
import Image from 'next/image'
import { CategoryList } from '@/components/public/CategoryList'
import { PostContent } from '@/components/public/PostContent'
import { SearchBar } from '@/components/public/SearchBar'
import { BackButton } from '@/components/ui/BackButton'
import { getPostBySlug } from '@/lib/blog/queries'
import { formatDate } from '@/lib/formatters'

interface PostPageProps {
  params: Promise<{
    slug: string
  }>
}

export async function generateMetadata({ params }: PostPageProps) {
  const { slug } = await params
  const post = await getPostBySlug(slug)

  if (!post) {
    return {
      title: 'Bài viết không tồn tại',
    }
  }

  return {
    title: `${post.title} - Blog Thiền`,
    description: post.excerpt || post.title,
  }
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params
  const post = await getPostBySlug(slug)

  if (!post) {
    notFound()
  }

  return (
    <main className="min-h-screen bg-zen-bg">
      <article className="zen-container py-12 md:py-16">
        {/* Top bar with back button and search */}
        <div className="mb-10 flex items-center justify-between">
          <BackButton />
          <SearchBar />
        </div>

        {/* Cover image */}
        {post.cover_image && (
          <div className="relative mb-10 aspect-[2/1] overflow-hidden rounded-zen border border-zen-border bg-zen-surface">
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

        {/* Categories */}
        {post.categories && post.categories.length > 0 && (
          <div className="mb-5">
            <CategoryList categories={post.categories} variant="default" />
          </div>
        )}

        {/* Title */}
        <h1 className="mb-6 font-display text-3xl md:text-4xl lg:text-5xl font-bold text-zen-primary leading-tight">
          {post.title}
        </h1>

        {/* Publish date */}
        <div className="mb-10 flex items-center text-sm text-zen-muted">
          <time dateTime={post.published_at || post.created_at}>
            Đăng ngày {formatDate(post.published_at || post.created_at)}
          </time>
        </div>

        {/* Horizontal rule */}
        <hr className="mb-10 border-zen-border" />

        {/* Content */}
        <div className="prose prose-lg max-w-none prose-headings:font-display prose-headings:font-semibold prose-headings:text-zen-primary prose-p:text-zen-secondary prose-p:leading-relaxed prose-a:text-zen-accent prose-a:no-underline hover:prose-a:underline prose-strong:text-zen-primary prose-code:text-zen-primary prose-pre:bg-zen-surface prose-blockquote:border-zen-border prose-blockquote:text-zen-secondary">
          <PostContent content={post.content} />
        </div>

        {/* Horizontal rule */}
        <hr className="mt-10 mb-10 border-zen-border" />

        {/* Footer */}
        <footer className="text-center">
          <blockquote className="font-display text-xl md:text-2xl text-zen-secondary italic leading-relaxed mb-8">
            &ldquo;Khi tâm tĩnh lặng,
            <br />
            muôn vấn đề tự tiêu tan&rdquo;
          </blockquote>
          <BackButton label="Quay lại trang chủ" />
        </footer>
      </article>
    </main>
  )
}
