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
  try {
    const category = await getCategoryBySlug(slug)

    return {
      title: `${category.name} - Blog Thiền`,
      description: category.description || `Bài viết trong danh mục ${category.name}`,
    }
  } catch {
    return {
      title: 'Danh mục không tồn tại',
    }
  }
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params
  const category = await getCategoryBySlug(slug)
  const posts = await getPostsByCategory(slug)

  return (
    <main className="min-h-screen bg-gradient-to-b from-zen-bg to-zen-surface">
      <div className="zen-container py-8 md:py-10">
        {/* Top bar with back button and search */}
        <div className="mb-6 flex items-center justify-between animate-fade-in">
          <BackButton />
          <SearchBar />
        </div>

        {/* Category header */}
        <header className="mb-8 text-center animate-fade-in delay-100">
          {/* Decorative element */}
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="h-px w-12 bg-gradient-to-r from-transparent via-zen-accent to-transparent" />
            <div className="w-2 h-2 rounded-full bg-zen-accent animate-pulse" />
            <div className="h-px w-12 bg-gradient-to-r from-transparent via-zen-accent to-transparent" />
          </div>

          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-semibold text-zen-primary leading-tight mb-4">
            {category.name}
          </h1>

          {category.description && (
            <p className="font-body text-lg md:text-xl text-zen-secondary leading-relaxed max-w-2xl mx-auto">
              {category.description}
            </p>
          )}

          {/* Post count */}
          <div className="mt-6 inline-flex items-center gap-2 text-sm text-zen-muted">
            <span className="text-zen-accent">✦</span>
            <span>
              <span className="font-semibold text-zen-primary">{posts.length}</span> bài viết
            </span>
          </div>
        </header>

        {/* Horizontal rule */}
        <hr className="mb-8" />

        {/* Posts list */}
        <section className="mb-8">
          {posts.length === 0 ? (
            <div className="text-center py-12 animate-fade-in">
              <p className="font-body text-zen-secondary italic text-lg">
                Chưa có bài viết nào trong danh mục này. Hãy quay lại sau nhé.
              </p>
            </div>
          ) : (
            <div className="space-y-8 md:space-y-10">
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
        <hr className="mb-8" />

        {/* Footer */}
        <footer className="text-center animate-fade-in">
          <BackButton label="Quay lại trang chủ" />
        </footer>
      </div>
    </main>
  )
}
