import Link from 'next/link'
import Image from 'next/image'
import { CategoryList } from './CategoryList'
import type { Post } from '@/lib/types/blog'

interface PostCardProps {
  post: Post
}

export function PostCard({ post }: PostCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const calculateReadingTime = (content: string) => {
    const wordsPerMinute = 200
    const words = content.split(/\s+/).length
    const minutes = Math.ceil(words / wordsPerMinute)
    return `${minutes} phút đọc`
  }

  return (
    <article className="group">
      <Link href={`/posts/${post.slug}`} className="block no-underline">
        {/* Clean card design */}
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden transition-all duration-200 hover:shadow-md hover:border-amber-600/30">
          {/* Cover image */}
          {post.cover_image && (
            <div className="relative aspect-[2/1] overflow-hidden bg-gray-100">
              <Image
                src={post.cover_image}
                alt={post.title}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 700px"
              />
            </div>
          )}

          {/* Content */}
          <div className="p-6 md:p-8">
            {/* Categories */}
            {post.categories && post.categories.length > 0 && (
              <div className="mb-4">
                <CategoryList categories={post.categories} variant="muted" linkable={false} />
              </div>
            )}

            {/* Title */}
            <h2 className="font-display text-xl md:text-2xl font-semibold text-gray-900 leading-snug mb-3 group-hover:text-amber-700 transition-colors duration-200">
              {post.title}
            </h2>

            {/* Excerpt */}
            {post.excerpt && (
              <p className="font-body text-base text-gray-600 leading-relaxed mb-4 line-clamp-3">
                {post.excerpt}
              </p>
            )}

            {/* Meta information */}
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <time dateTime={post.published_at || post.created_at}>
                {formatDate(post.published_at || post.created_at)}
              </time>
              {post.content && (
                <>
                  <span>·</span>
                  <span>{calculateReadingTime(post.content)}</span>
                </>
              )}
            </div>
          </div>
        </div>
      </Link>
    </article>
  )
}
