import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { CategoryList } from '@/components/public/CategoryList'
import { PostContent } from '@/components/public/PostContent'
import { SearchBar } from '@/components/public/SearchBar'
import { getPostBySlug } from '@/lib/blog/queries'

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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <article className="mx-auto max-w-2xl px-6 py-12 md:py-16">
        {/* Top bar with back button and search */}
        <div className="mb-10 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center text-sm text-gray-600 hover:text-amber-700 underline decoration-1 underline-offset-2 transition-colors duration-200 font-body"
          >
            <svg
              className="mr-2 h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Trang chủ
          </Link>
          <SearchBar />
        </div>

        {/* Cover image */}
        {post.cover_image && (
          <div className="relative mb-10 aspect-[2/1] overflow-hidden rounded-lg border border-gray-200 bg-gray-100">
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
        <h1 className="mb-6 font-display text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
          {post.title}
        </h1>

        {/* Publish date */}
        <div className="mb-10 flex items-center text-sm text-gray-500">
          <time dateTime={post.published_at || post.created_at}>
            Đăng ngày {formatDate(post.published_at || post.created_at)}
          </time>
        </div>

        {/* Horizontal rule */}
        <hr className="mb-10 border-gray-200" />

        {/* Content */}
        <div className="prose prose-lg max-w-none prose-headings:font-display prose-headings:font-semibold prose-headings:text-gray-900 prose-p:text-gray-700 prose-p:leading-relaxed prose-a:text-amber-700 prose-a:no-underline hover:prose-a:underline prose-strong:text-gray-900 prose-code:text-gray-800 prose-pre:bg-gray-100 prose-blockquote:border-gray-300 prose-blockquote:text-gray-600">
          <PostContent content={post.content} />
        </div>

        {/* Horizontal rule */}
        <hr className="mt-10 mb-10 border-gray-200" />

        {/* Footer */}
        <footer className="text-center">
          <blockquote className="font-display text-xl md:text-2xl text-gray-700 italic leading-relaxed mb-8">
            &ldquo;Khi tâm tĩnh lặng,
            <br />
            muôn vấn đề tự tiêu tan&rdquo;
          </blockquote>
          <Link
            href="/"
            className="inline-flex items-center text-sm text-gray-600 hover:text-amber-700 underline decoration-1 underline-offset-2 transition-colors duration-200 font-body"
          >
            <svg
              className="mr-2 h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Quay lại trang chủ
          </Link>
        </footer>
      </article>
    </main>
  )
}
