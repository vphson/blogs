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
    <main className="min-h-screen bg-zen-bg">
      <div className="zen-container">
        {/* Top spacing - tạo khoảng thở */}
        <div className="h-24 md:h-32" />

        {/* Navigation - đơn giản, không underline */}
        <nav className="mb-16">
          <div className="flex items-center justify-center gap-6 text-sm text-zen-secondary">
            <Link href="/" className="zen-link">
              Trang chủ
            </Link>
            <span className="text-zen-muted">·</span>
            <span className="text-zen-primary">Danh mục</span>
            <span className="text-zen-muted">·</span>
            <SearchBar />
          </div>
        </nav>

        {/* Header - tịnh, chỉ có tiêu đề */}
        <header className="mb-16 text-center">
          <h1 className="font-display text-3xl md:text-4xl font-light text-zen-primary tracking-wide">
            Danh mục
          </h1>
          <div className="mt-6 flex items-center justify-center gap-4">
            <div className="h-px w-12 bg-zen-border" />
            <div className="h-px w-12 bg-zen-border" />
          </div>
        </header>

        {/* Categories List - đơn dòng, không border, không shadow */}
        <section className="mb-20">
          {categories.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-zen-muted font-light">
                Chưa có danh mục nào
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/danh-muc/${category.slug}`}
                  className="group block py-6 px-6 text-center hover:bg-zen-surface transition-colors duration-500"
                >
                  {/* Tên danh mục - lớn, nhẹ */}
                  <h2 className="font-display text-xl md:text-2xl font-light text-zen-primary mb-2 group-hover:text-zen-accent transition-colors">
                    {category.name}
                  </h2>

                  {/* Mô tả - nhỏ, xám nhạt */}
                  {category.description && (
                    <p className="text-sm text-zen-secondary font-light max-w-md mx-auto mb-3">
                      {category.description}
                    </p>
                  )}

                  {/* Số bài viết - rất nhỏ, không icon */}
                  <span className="text-xs text-zen-muted">
                    {category.post_count || 0} bài viết
                  </span>
                </Link>
              ))}

              {/* Divider nhẹ giữa các danh mục */}
              <div className="border-t border-zen-border" />
            </div>
          )}
        </section>

        {/* Footer - triết lý ngắn gọn */}
        <footer className="py-16 text-center">
          <blockquote className="font-display text-lg text-zen-secondary font-light leading-relaxed max-w-md mx-auto">
            &ldquo;Chấp nhận hiện tại,<br />buông bỏ quá khứ&rdquo;
          </blockquote>

          <div className="mt-12">
            <Link
              href="/"
              className="zen-link text-sm"
            >
              ← Trang chủ
            </Link>
          </div>
        </footer>

        {/* Bottom spacing */}
        <div className="h-24" />
      </div>
    </main>
  )
}
