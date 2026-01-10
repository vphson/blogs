import { notFound } from 'next/navigation'
import { PostCard } from '@/components/public/PostCard'
import { SearchBar } from '@/components/public/SearchBar'
import { BackButton } from '@/components/ui/BackButton'
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
    <main className="min-h-screen bg-zen-bg">
      <div className="zen-container py-16">
        {/* Top bar with back button and search - Zen minimal */}
        <div className="mb-12 flex items-center justify-between">
          <BackButton />
          <SearchBar />
        </div>

        {/* Category header - Zen display */}
        <header className="mb-16 text-center">
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-light tracking-wide text-zen-primary leading-relaxed">
            {category.name}
          </h1>
          {category.description && (
            <p className="font-body text-lg md:text-xl text-zen-secondary italic font-light leading-relaxed max-w-2xl mx-auto mt-6">
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
              <p className="font-body text-zen-secondary italic">
                Chưa có bài viết nào trong danh mục này. Hãy quay lại sau nhé.
              </p>
            </div>
          ) : (
            <div className="space-y-16 md:space-y-20">
              {posts.map((post, index) => (
                <div
                  key={post.id}
                  className="animate-fade-in"
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
          <BackButton label="Quay lại trang chủ" />
        </footer>
      </div>
    </main>
  )
}
