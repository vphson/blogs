import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { PostForm } from '@/components/admin/PostForm'
import { getPostById } from '@/lib/blog/queries'

interface EditPostPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function EditPostPage({ params }: EditPostPageProps) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { id } = await params
  const post = await getPostById(id)

  if (!post) {
    notFound()
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
                Chỉnh sửa bài viết
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
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-2xl font-light text-stone-800">
                {post.title}
              </h2>
              <p className="text-sm text-stone-600">
                Chỉnh sửa nội dung bài viết
              </p>
            </div>
            <Link
              href={`/posts/${post.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-stone-600 hover:text-stone-900"
            >
              Xem bài viết →
            </Link>
          </div>
        </div>

        <PostForm post={post} />
      </main>
    </div>
  )
}
