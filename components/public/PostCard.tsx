import Link from 'next/link'
import Image from 'next/image'
import { CategoryList } from './CategoryList'
import type { Post } from '@/lib/types/blog'
import { formatDate, calculateReadingTime } from '@/lib/formatters'

interface PostCardProps {
  post: Post
}

export function PostCard({ post }: PostCardProps) {
  return (
    <article className="group relative">
      {/* Subtle gradient border on hover */}
      <div className="absolute -inset-[1px] bg-gradient-to-r from-zen-accent/20 via-zen-accent/10 to-zen-accent/20 rounded-zen opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <Link href={`/posts/${post.slug}`} className="block relative">
        <div className="zen-card overflow-hidden bg-zen-elevated transition-all duration-300 group-hover:shadow-md">
          {/* Cover image */}
          {post.cover_image && (
            <div className="relative aspect-[2/1] overflow-hidden bg-zen-surface">
              <Image
                src={post.cover_image}
                alt={post.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 700px"
              />
              {/* Overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-zen-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          )}

          {/* Content */}
          <div className="p-6 md:p-8">
            {/* Categories with decorative dot */}
            <div className="flex items-center gap-2 mb-4">
              {post.categories && post.categories.length > 0 ? (
                <CategoryList categories={post.categories} variant="muted" linkable={false} />
              ) : (
                <div className="h-px w-8 bg-zen-border" />
              )}
            </div>

            {/* Title with better typography */}
            <h2 className="font-display text-2xl md:text-3xl font-semibold text-zen-primary leading-tight mb-3 group-hover:text-zen-accent transition-colors duration-300">
              {post.title}
            </h2>

            {/* Excerpt with better line height */}
            {post.excerpt && (
              <p className="font-body text-base text-zen-secondary leading-relaxed mb-4 line-clamp-2">
                {post.excerpt}
              </p>
            )}

            {/* Meta information with icon */}
            <div className="flex items-center gap-4 text-sm text-zen-muted pt-3 border-t border-zen-border">
              <div className="flex items-center gap-1.5">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <time dateTime={post.published_at || post.created_at}>
                  {formatDate(post.published_at || post.created_at)}
                </time>
              </div>
              {post.content && (
                <>
                  <span className="text-zen-accent">·</span>
                  <div className="flex items-center gap-1.5">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{calculateReadingTime(post.content)}</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </Link>
    </article>
  )
}
