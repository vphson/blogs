import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function AdminPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-stone-50 to-stone-100">
      <header className="border-b border-stone-200 bg-white/80 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-light tracking-wide text-stone-800">
                Blog Thiền
              </h1>
              <p className="text-sm text-stone-600">Admin Dashboard</p>
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
        <div className="mb-8">
          <h2 className="mb-2 text-3xl font-light text-stone-800">
            Xin chào!
          </h2>
          <p className="text-stone-600">
            Chào mừng trở lại. Đây là trang quản trị blog.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <a
            href="/admin/posts"
            className="rounded-lg border border-stone-200 bg-white p-6 transition-shadow hover:shadow-lg"
          >
            <h3 className="mb-2 text-lg font-medium text-stone-800">
              Bài viết
            </h3>
            <p className="text-sm text-stone-600">
              Quản lý bài viết blog
            </p>
          </a>

          <a
            href="/admin/categories"
            className="rounded-lg border border-stone-200 bg-white p-6 transition-shadow hover:shadow-lg"
          >
            <h3 className="mb-2 text-lg font-medium text-stone-800">
              Chủ đề
            </h3>
            <p className="text-sm text-stone-600">
              Quản lý chủ đề bài viết
            </p>
          </a>

          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg border border-stone-200 bg-white p-6 transition-shadow hover:shadow-lg"
          >
            <h3 className="mb-2 text-lg font-medium text-stone-800">
              Xem blog
            </h3>
            <p className="text-sm text-stone-600">
              Xem trang chủ blog
            </p>
          </a>

          <a
            href="https://supabase.com/dashboard/project/ppnjdkgukpbwmtlhvgsx"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg border border-stone-200 bg-white p-6 transition-shadow hover:shadow-lg"
          >
            <h3 className="mb-2 text-lg font-medium text-stone-800">
              Supabase
            </h3>
            <p className="text-sm text-stone-600">
              Quản lý database
            </p>
          </a>
        </div>
      </main>
    </div>
  )
}
