import Link from 'next/link'

export default function CategoryNotFound() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-stone-50 to-stone-100">
      <div className="mx-auto max-w-3xl px-4 py-16">
        <div className="rounded-lg bg-white p-8 text-center shadow-sm dark:bg-stone-900">
          <h1 className="mb-4 text-4xl font-light tracking-wide text-stone-800 dark:text-stone-100">
            404
          </h1>
          <p className="mb-8 text-lg text-stone-600 dark:text-stone-400">
            Không tìm thấy danh mục này.
          </p>
          <div className="flex justify-center gap-4">
            <Link
              href="/"
              className="inline-block rounded-lg bg-stone-800 px-6 py-3 text-white transition-colors hover:bg-stone-700 dark:bg-stone-700 dark:hover:bg-stone-600"
            >
              Trang chủ
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
