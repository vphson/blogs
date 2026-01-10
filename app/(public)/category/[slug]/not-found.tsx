import Link from 'next/link'

export default function CategoryNotFound() {
  return (
    <main className="min-h-screen bg-zen-bg">
      <div className="zen-container py-16">
        <div className="zen-card p-8 text-center">
          <h1 className="mb-4 font-display text-4xl font-light tracking-wide text-zen-primary">
            404
          </h1>
          <p className="mb-8 text-lg text-zen-secondary">
            Không tìm thấy danh mục này.
          </p>
          <div className="flex justify-center gap-4">
            <Link
              href="/"
              className="zen-btn-primary"
            >
              Trang chủ
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
