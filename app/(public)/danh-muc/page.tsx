import Link from 'next/link'
import { SearchBar } from '@/components/public/SearchBar'
import { getAllCategoriesWithPostCount } from '@/lib/blog/queries'

export const metadata = {
  title: 'Danh mục - Blog Thiền',
  description: 'Tất cả danh mục bài viết',
}

export default async function CategoryListPage() {
  const categories = await getAllCategoriesWithPostCount()

  return (
    <main className="min-h-screen bg-gradient-to-b from-zen-bg to-zen-surface">
      <div className="zen-container py-8 md:py-10">
        {/* Navigation */}
        <nav className="mb-8 animate-fade-in">
          <div className="flex items-center justify-center gap-6 text-sm">
            <Link href="/" className="zen-link">
              Trang chủ
            </Link>
            <span className="text-zen-muted">·</span>
            <span className="text-zen-primary font-medium">Danh mục</span>
            <span className="text-zen-muted">·</span>
            <SearchBar />
          </div>
        </nav>

        {/* Header */}
        <header className="mb-10 text-center animate-fade-in delay-100">
          {/* Decorative element */}
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="h-px w-12 bg-gradient-to-r from-transparent via-zen-accent to-transparent" />
            <div className="w-2 h-2 rounded-full bg-zen-accent animate-pulse" />
            <div className="h-px w-12 bg-gradient-to-r from-transparent via-zen-accent to-transparent" />
          </div>

          <h1 className="font-display text-4xl md:text-5xl font-semibold text-zen-primary leading-tight mb-4">
            Danh mục
          </h1>
          <p className="text-zen-secondary">
            Khám phá các chủ đề về thiền và mindfulness
          </p>
        </header>

        {/* Categories List */}
        <section className="mb-10 animate-fade-in delay-200">
          {categories.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-zen-muted">
                Chưa có danh mục nào
              </p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/danh-muc/${category.slug}`}
                  className="group relative block p-6 bg-zen-elevated rounded-zen border border-zen-border hover:shadow-md transition-all duration-300"
                >
                  {/* Gradient border on hover */}
                  <div className="absolute -inset-[1px] bg-gradient-to-r from-zen-accent/20 via-zen-accent/10 to-zen-accent/20 rounded-zen opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10" />

                  {/* Category name */}
                  <h2 className="font-display text-xl md:text-2xl font-semibold text-zen-primary leading-tight mb-2 group-hover:text-zen-accent transition-colors">
                    {category.name}
                  </h2>

                  {/* Description */}
                  {category.description && (
                    <p className="text-sm text-zen-secondary mb-3 line-clamp-2">
                      {category.description}
                    </p>
                  )}

                  {/* Post count */}
                  <div className="flex items-center gap-2 text-sm text-zen-muted">
                    <span className="text-zen-accent">✦</span>
                    <span>
                      <span className="font-medium text-zen-primary">{category.post_count || 0}</span> bài viết
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* Footer */}
        <footer className="py-10 text-center animate-fade-in delay-300">
          <blockquote className="font-display text-xl text-zen-secondary leading-relaxed max-w-md mx-auto mb-6 p-6 bg-zen-elevated rounded-zen border border-zen-border">
            &ldquo;Chấp nhận hiện tại,<br />buông bỏ quá khứ&rdquo;
          </blockquote>

          <Link
            href="/"
            className="zen-link text-sm inline-flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Trang chủ
          </Link>
        </footer>
      </div>
    </main>
  )
}
