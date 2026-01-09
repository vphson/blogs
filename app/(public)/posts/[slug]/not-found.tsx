import Link from 'next/link'

export default function NotFound() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-stone-50 to-stone-100">
      <div className="mx-auto max-w-3xl px-4 py-16">
        <div className="text-center">
          <h1 className="mb-4 text-4xl font-light tracking-wide text-stone-800">
            404
          </h1>
          <p className="mb-8 text-lg text-stone-600">
            Không tìm thấy bài viết này.
          </p>
          <Link
            href="/"
            className="inline-block rounded-lg bg-stone-800 px-6 py-3 text-white transition-colors hover:bg-stone-700 dark:bg-stone-700 dark:hover:bg-stone-600"
          >
            Quay lại trang chủ
          </Link>
        </div>
      </div>
    </main>
  )
}
