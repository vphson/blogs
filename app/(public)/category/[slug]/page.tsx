import { notFound } from 'next/navigation'
import Link from 'next/link'
import { PostCard } from '@/components/public/PostCard'
import { SearchBar } from '@/components/public/SearchBar'
import { getCategoryBySlug, getPostsByCategory } from '@/lib/blog/queries'

interface CategoryPageProps {
  params: Promise<{
    slug: string
  }>
}

export async function generateMetadata({ params }: CategoryPageProps) {
  const { slug } = await params
  const category = await getCategoryBySlug(slug)

  if (!category) {
    return {
      title: 'Danh mục không tồn tại',
    }
  }

  return {
    title: `${category.name} - Blog Thiền`,
    description: category.description || `Bài viết trong danh mục ${category.name}`,
  }
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params
  const category = await getCategoryBySlug(slug)
  const posts = await getPostsByCategory(slug)

  if (!category) {
    notFound()
  }

  return (
    <main className="min-h-screen">
      <div className="mx-auto max-w-2xl px-6 py-16 md:py-24">
        {/* Top bar with back button and search - Zen minimal */}
        <div className="mb-12 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center text-sm text-zen-secondary hover:text-[#B8A882] transition-colors duration-300 font-zen-body"
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
                strokeWidth={1.5}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Trang chủ
          </Link>
          <SearchBar />
        </div>

        {/* Decorative element */}
        <div className="mb-12 flex justify-center">
          <div className="zen-lotus" />
        </div>

        {/* Category header - Zen display */}
        <header className="mb-16 text-center">
          <h1 className="mb-6 font-zen-display text-4xl md:text-5xl lg:text-6xl font-light tracking-wide text-zen-primary leading-relaxed">
            {category.name}
          </h1>
          {category.description && (
            <p className="font-zen-body text-lg md:text-xl text-zen-secondary italic font-light leading-relaxed max-w-2xl mx-auto">
              {category.description}
            </p>
          )}
        </header>

        {/* Horizontal rule */}
        <hr className="mb-16" />

        {/* Posts list */}
        <section className="mb-16">
          {posts.length === 0 ? (
            <div className="text-center py-12">
              <p className="font-zen-body text-zen-secondary italic">
                Chưa có bài viết nào trong danh mục này. Hãy quay lại sau nhé.
              </p>
            </div>
          ) : (
            <div className="space-y-16 md:space-y-20">
              {posts.map((post, index) => (
                <div
                  key={post.id}
                  className="animate-zen-fade-in"
                  style={{ animationDelay: `${0.2 + (index * 0.1)}s` }}
                >
                  <PostCard post={post} />
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Horizontal rule */}
        <hr className="mb-16" />

        {/* Footer */}
        <footer className="text-center">
          <Link
            href="/"
            className="inline-flex items-center text-sm text-zen-muted hover:text-[#B8A882] transition-colors duration-300 font-zen-body"
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
                strokeWidth={1.5}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Quay lại trang chủ
          </Link>
        </footer>
      </div>
    </main>
  )
}
