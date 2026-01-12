import Link from 'next/link'
import { PostCard } from '@/components/public/PostCard'
import { CategoryLinkList } from '@/components/public/CategoryLinkList'
import { SearchBar } from '@/components/public/SearchBar'
import { LoadMoreButton } from '@/components/public/LoadMoreButton'
import { getPublishedPosts, getAllCategoriesWithPostCount } from '@/lib/blog/queries'

interface HomePageProps {
  searchParams: Promise<{ cursor?: string }>
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const params = await searchParams
  const cursor = params.cursor

  const { data: posts, count, hasMore, nextCursor } = await getPublishedPosts({
    limit: 10,
    cursor,
  })
  const categories = await getAllCategoriesWithPostCount()

  return (
    <main className="min-h-screen bg-gradient-to-b from-zen-bg to-zen-surface">
      {/* Hero Section */}
      <section className="relative border-b border-zen-border bg-zen-elevated">
        <div className="zen-container py-12 md:py-16">
          {/* Navigation */}
          <nav className="mb-10 animate-fade-in">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-6 text-sm">
                <Link href="/" className="zen-link font-medium">
                  Trang chủ
                </Link>
                <Link href="/danh-muc" className="zen-link">
                  Danh mục
                </Link>
              </div>
              <div className="animate-fade-in delay-100">
                <SearchBar />
              </div>
            </div>
          </nav>

          {/* Header */}
          <header className="text-center animate-fade-in delay-200">
            {/* Decorative element */}
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="h-px w-12 bg-gradient-to-r from-transparent via-zen-accent to-transparent" />
              <div className="w-2 h-2 rounded-full bg-zen-accent animate-pulse" />
              <div className="h-px w-12 bg-gradient-to-r from-transparent via-zen-accent to-transparent" />
            </div>

            <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold text-zen-primary leading-tight mb-6">
              Blog Thiền
            </h1>

            <p className="font-body text-lg md:text-xl text-zen-secondary leading-relaxed max-w-2xl mx-auto mb-8">
              Nơi chia sẻ cảm nhận về thiền tập, mindfulness và tìm kiếm inner peace trong cuộc sống hiện đại
            </p>

            {/* Stats */}
            <div className="flex items-center justify-center gap-8 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-zen-accent">✦</span>
                <span className="text-zen-secondary">
                  <span className="font-semibold text-zen-primary">{count}</span> bài viết
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-zen-accent">✦</span>
                <span className="text-zen-secondary">
                  <span className="font-semibold text-zen-primary">{categories.length}</span> danh mục
                </span>
              </div>
            </div>
          </header>
        </div>
      </section>

      {/* Content Section */}
      <section className="zen-container py-12 md:py-16">
        {posts.length === 0 ? (
          <div className="text-center py-20 animate-fade-in">
            <p className="text-zen-secondary italic text-lg">
              Chưa có bài viết nào. Hãy quay lại sau nhé.
            </p>
          </div>
        ) : (
          <>
            {/* Section title */}
            <div className="mb-8 animate-fade-in">
              <h2 className="font-display text-2xl md:text-3xl text-zen-primary mb-2">
                Bài viết mới nhất
              </h2>
              <p className="text-zen-secondary text-sm">
                Khám phá những chia sẻ mới nhất về thiền và mindfulness
              </p>
            </div>

            {/* Posts Grid */}
            <div className="space-y-8 md:space-y-10">
              {posts.map((post, index) => (
                <div
                  key={post.id}
                  className="animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <PostCard post={post} />
                </div>
              ))}
            </div>

            {/* Load More Button */}
            <div className="mt-12 animate-fade-in" style={{ animationDelay: `${posts.length * 0.1 + 0.2}s` }}>
              <LoadMoreButton
                nextCursor={nextCursor || ''}
                hasMore={hasMore}
              />
            </div>
          </>
        )}
      </section>

      {/* Footer */}
      <footer className="border-t border-zen-border/50 bg-zen-bg">
        <div className="zen-container py-16">
          {/* Quote section - centered, prominent */}
          <div className="max-w-2xl mx-auto mb-16 text-center animate-fade-in">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="h-px w-16 bg-gradient-to-r from-transparent via-zen-accent to-transparent" />
              <span className="text-zen-accent text-xs tracking-widest uppercase">Quote</span>
              <div className="h-px w-16 bg-gradient-to-r from-transparent via-zen-accent to-transparent" />
            </div>

            <blockquote className="font-display text-2xl md:text-3xl text-zen-primary leading-relaxed mb-4">
              Hành trình ngàn dặm bắt đầu từ một bước chân
            </blockquote>

            <cite className="text-sm text-zen-muted not-italic">
              — Lão Tử
            </cite>
          </div>

          {/* Category pills */}
          <div className="flex flex-wrap items-center justify-center gap-3 mb-16 animate-fade-in delay-100">
            {categories.slice(0, 6).map((category) => (
              <Link
                key={category.id}
                href={`/danh-muc/${category.slug}`}
                className="px-4 py-2 text-sm text-zen-secondary bg-zen-surface rounded-full border border-zen-border hover:border-zen-accent hover:text-zen-accent transition-all duration-300"
              >
                {category.name}
              </Link>
            ))}
          </div>

          {/* Bottom bar */}
          <div className="pt-8 border-t border-zen-border/50 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-zen-muted animate-fade-in delay-200">
            <p>© 2025 Blog Thiền</p>
            <p>Made with ☕ in Vietnam</p>
          </div>
        </div>
      </footer>
    </main>
  )
}
