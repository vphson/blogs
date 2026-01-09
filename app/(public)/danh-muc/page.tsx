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
    <main className="min-h-screen bg-gradient-to-b from-stone-50 to-stone-100">
      <div className="mx-auto max-w-3xl px-4 py-16">
        {/* Top bar with back button and search */}
        <div className="mb-8 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center text-sm text-stone-600 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-100"
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
          <SearchBar />
        </div>

        {/* Header */}
        <header className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-light tracking-wide text-stone-800 dark:text-stone-100">
            Danh mục
          </h1>
          <p className="text-lg text-stone-600 dark:text-stone-400">
            Khám phá các chủ đề về thiền và cuộc sống
          </p>
        </header>

        {/* Category grid */}
        <section className="mb-12">
          {categories.length === 0 ? (
            <div className="rounded-lg bg-white p-8 text-center shadow-sm dark:bg-stone-900">
              <p className="text-stone-500 dark:text-stone-400">
                Chưa có danh mục nào.
              </p>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/danh-muc/${category.slug}`}
                  className="group overflow-hidden rounded-lg bg-white p-6 shadow-sm transition-all hover:shadow-md dark:bg-stone-900"
                >
                  <h2 className="mb-2 text-xl font-medium text-stone-800 group-hover:text-stone-600 dark:text-stone-100 dark:group-hover:text-stone-300">
                    {category.name}
                  </h2>
                  {category.description && (
                    <p className="mb-4 text-sm text-stone-600 dark:text-stone-400">
                      {category.description}
                    </p>
                  )}
                  <div className="text-sm text-stone-400 dark:text-stone-500">
                    {category.post_count} bài viết
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* Footer */}
        <footer className="mt-16 text-center text-sm text-stone-400">
          <Link
            href="/"
            className="hover:text-stone-600 dark:hover:text-stone-300"
          >
            ← Quay lại trang chủ
          </Link>
        </footer>
      </div>
    </main>
  )
}
