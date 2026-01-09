import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { PostForm } from '@/components/admin/PostForm'

export default async function NewPostPage() {
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
              <Link
                href="/admin/posts"
                className="text-sm text-stone-600 hover:text-stone-900"
              >
                ← Quay lại danh sách
              </Link>
              <h1 className="mt-2 text-2xl font-light tracking-wide text-stone-800">
                Viết bài mới
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

      <main className="mx-auto max-w-4xl px-4 py-8">
        <div className="mb-6">
          <h2 className="text-2xl font-light text-stone-800">
            Tạo bài viết mới
          </h2>
          <p className="text-sm text-stone-600">
            Điền thông tin bên dưới để tạo bài viết mới
          </p>
        </div>

        <PostForm />
      </main>
    </div>
  )
}
