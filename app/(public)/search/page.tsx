import { Suspense } from 'react'
import Link from 'next/link'
import { SearchBar } from '@/components/public/SearchBar'
import { PostCard } from '@/components/public/PostCard'
import { LoadMoreButton } from '@/components/public/LoadMoreButton'
import { searchPosts } from '@/lib/blog/queries'

interface SearchPageProps {
  searchParams: Promise<{ q?: string; cursor?: string }>
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams
  const query = params.q || ''

  return (
    <main className="min-h-screen bg-zen-bg">
      <div className="zen-container py-16">
        <header className="mb-16 text-center">
          <div className="mb-6 flex justify-center gap-6 text-sm">
            <Link href="/" className="zen-link">
              Trang chủ
            </Link>
            <span className="text-zen-muted">·</span>
            <Link href="/danh-muc" className="zen-link">
              Danh mục
            </Link>
          </div>
          <h1 className="mb-4 font-display text-4xl font-light tracking-wide text-zen-primary">
            Tìm kiếm
          </h1>
          <div className="mx-auto max-w-md">
            <SearchBar />
          </div>
        </header>

        <Suspense fallback={<SearchResultsSkeleton />}>
          <SearchResults query={query} cursor={params.cursor} />
        </Suspense>
      </div>
    </main>
  )
}

async function SearchResults({ query, cursor }: { query: string; cursor?: string }) {
  const { data: results, count, hasMore, nextCursor } = await searchPosts(query, {
    limit: 10,
    cursor,
  })

  if (!query) {
    return (
      <section className="text-center">
        <div className="mb-8 inline-flex items-center justify-center rounded-full bg-zen-surface p-6">
          <svg
            className="h-12 w-12 text-zen-muted"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        <h2 className="mb-2 font-display text-xl text-zen-primary">
          Nhập từ khóa để tìm kiếm
        </h2>
        <p className="text-zen-secondary">
          Tìm kiếm bài viết theo tiêu đề, nội dung hoặc mô tả
        </p>
      </section>
    )
  }

  if (results.length === 0) {
    return (
      <section className="text-center">
        <div className="mb-8 inline-flex items-center justify-center rounded-full bg-zen-surface p-6">
          <svg
            className="h-12 w-12 text-zen-muted"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h2 className="mb-2 font-display text-xl text-zen-primary">
          Không tìm thấy bài viết nào
        </h2>
        <p className="mb-6 text-zen-secondary">
          Không tìm thấy bài viết nào phù hợp với{' '}
          <span className="font-medium text-zen-primary">
            &quot;{query}&quot;
          </span>
        </p>
        <div className="flex flex-col items-center gap-3 text-sm text-zen-secondary">
          <p>Gợi ý:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Thử từ khóa khác</li>
            <li>Thử từ khóa ngắn gọn hơn</li>
            <li>Kiểm tra lỗi chính tả</li>
          </ul>
          <Link
            href="/"
            className="zen-link mt-4 inline-flex items-center gap-2"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
            Về trang chủ
          </Link>
          <Link
            href="/danh-muc"
            className="zen-link inline-flex items-center gap-2"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              />
            </svg>
            Xem danh mục
          </Link>
        </div>
      </section>
    )
  }

  return (
    <section>
      <div className="mb-8 text-center">
        <p className="text-zen-secondary">
          Tìm thấy{' '}
          <span className="font-semibold text-zen-primary">
            {count}
          </span>{' '}
          bài viết cho từ khóa{' '}
          <span className="font-semibold text-zen-primary">
            &quot;{query}&quot;
          </span>
        </p>
      </div>

      <div className="grid gap-8">
        {results.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>

      {/* Load More Button */}
      <LoadMoreButton
        nextCursor={nextCursor || ''}
        hasMore={hasMore}
      />
    </section>
  )
}

function SearchResultsSkeleton() {
  return (
    <section>
      <div className="mb-8 text-center">
        <div className="h-6 w-48 animate-pulse rounded bg-zen-border mx-auto" />
      </div>
      <div className="grid gap-8">
        {[1, 2, 3].map((i) => (
          <div key={i} className="rounded-zen bg-zen-elevated p-6 shadow-sm">
            <div className="mb-3 flex gap-2">
              <div className="h-6 w-20 animate-pulse rounded-full bg-zen-border" />
            </div>
            <div className="mb-3 h-7 w-3/4 animate-pulse rounded bg-zen-border" />
            <div className="mb-4 flex gap-2">
              <div className="h-4 w-full animate-pulse rounded bg-zen-border" />
              <div className="h-4 w-2/3 animate-pulse rounded bg-zen-border" />
            </div>
            <div className="h-4 w-32 animate-pulse rounded bg-zen-border" />
          </div>
        ))}
      </div>
    </section>
  )
}

// Export for dynamic rendering
export const dynamic = 'force-dynamic'
