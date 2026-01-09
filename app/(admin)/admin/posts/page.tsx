import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { PostList } from '@/components/admin/PostList'
import { getAllPosts } from '@/lib/blog/queries'

export default async function AdminPostsPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const posts = await getAllPosts()

  return (
    <div className="min-h-screen bg-gradient-to-b from-stone-50 to-stone-100">
      <header className="border-b border-stone-200 bg-white/80 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <Link
                href="/admin"
                className="text-sm text-stone-600 hover:text-stone-900"
              >
                ← Quay lại dashboard
              </Link>
              <h1 className="mt-2 text-2xl font-light tracking-wide text-stone-800">
                Quản lý bài viết
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-stone-600">{user.email}</span>
              <form action="/auth/signout" method="post">
                <button
                  type="submit"
                  className="rounded-lg border border-stone-300 px-4 py-2 text-sm text-stone-700 transition-colors hover:bg-stone-50"
                >
                  Đăng xuất
                </button>
              </form>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-light text-stone-800">
              Tất cả bài viết
            </h2>
            <p className="text-sm text-stone-600">
              Quản lý và chỉnh sửa bài viết blog
            </p>
          </div>
          <Link
            href="/admin/posts/new"
            className="inline-flex items-center rounded-lg bg-stone-800 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-stone-700"
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
                d="M12 4v16m8-8H4"
              />
            </svg>
            Viết bài mới
          </Link>
        </div>

        <PostList initialPosts={posts} />
      </main>
    </div>
  )
}
