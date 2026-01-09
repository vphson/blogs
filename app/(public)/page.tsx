import Link from 'next/link'
import { PostCard } from '@/components/public/PostCard'
import { CategoryLinkList } from '@/components/public/CategoryLinkList'
import { SearchBar } from '@/components/public/SearchBar'
import { getPublishedPosts, getAllCategoriesWithPostCount } from '@/lib/blog/queries'

export default async function HomePage() {
  const posts = await getPublishedPosts()
  const categories = await getAllCategoriesWithPostCount()

  const currentDate = new Date().toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-3xl px-6">
        {/* Top spacing */}
        <div className="h-20 md:h-32" />

        {/* Navigation */}
        <nav className="mb-12 animate-fade-in">
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm">
            <Link
              href="/"
              className="text-gray-600 hover:text-amber-700 underline decoration-1 underline-offset-2 transition-colors duration-200"
            >
              Trang chủ
            </Link>
            <span className="text-gray-400">·</span>
            <Link
              href="/danh-muc"
              className="text-gray-600 hover:text-amber-700 underline decoration-1 underline-offset-2 transition-colors duration-200"
            >
              Danh mục
            </Link>
            <span className="text-gray-400">·</span>
            <div className="animate-fade-in delay-100">
              <SearchBar />
            </div>
          </div>
        </nav>

        {/* Header */}
        <header className="mb-10 text-center animate-fade-in delay-200">
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-4">
            Blog Thiền
          </h1>

          <p className="font-body text-lg md:text-xl text-gray-600 leading-relaxed max-w-md mx-auto">
            Nơi chia sẻ cảm nhận về cuộc sống
          </p>

          <div className="mt-8 flex items-center justify-center gap-4 text-xs text-gray-500 uppercase tracking-wide">
            <span>{currentDate}</span>
          </div>
        </header>

        {/* Horizontal Rule */}
        <hr className="animate-fade-in delay-300" />

        {/* Content Section */}
        <section className="py-12 md:py-16">
          {posts.length === 0 ? (
            <div className="text-center animate-fade-in delay-400">
              <p className="text-gray-600 italic">
                Chưa có bài viết nào. Hãy quay lại sau nhé.
              </p>
            </div>
          ) : (
            <div className="space-y-10 md:space-y-12">
              {posts.map((post, index) => (
                <div
                  key={post.id}
                  className="animate-fade-in"
                  style={{ animationDelay: `${0.3 + (index * 0.1)}s` }}
                >
                  <PostCard post={post} />
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Footer */}
        <footer className="py-12 md:py-16 border-t border-gray-200">
          {/* Categories */}
          <div className="mb-10 animate-fade-in">
            <CategoryLinkList categories={categories} showEmpty={false} />
          </div>

          {/* Quote */}
          <div className="text-center mb-10 animate-fade-in delay-100">
            <blockquote className="font-display text-2xl md:text-3xl text-gray-700 italic leading-relaxed">
              &ldquo;Hành trình ngàn dặm
              <br />
              bắt đầu từ một bước chân&rdquo;
            </blockquote>
            <cite className="text-sm text-gray-500 mt-3 block not-italic">
              — Lão Tử
            </cite>
          </div>

          {/* Copyright */}
          <div className="text-center text-sm text-gray-500 animate-fade-in delay-200">
            <p className="font-body">
              © 2025 · Blog Thiền · Nơi bình yên trong tâm hồn
            </p>
          </div>
        </footer>
      </div>

      {/* Bottom spacing */}
      <div className="h-16" />
    </main>
  )
}
