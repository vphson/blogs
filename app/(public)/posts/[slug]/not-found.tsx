import Link from 'next/link'

export default function NotFound() {
  return (
    <main className="min-h-screen bg-zen-bg">
      <div className="zen-container py-16">
        <div className="text-center">
          <h1 className="mb-4 font-display text-4xl font-light tracking-wide text-zen-primary">
            404
          </h1>
          <p className="mb-8 text-lg text-zen-secondary">
            Không tìm thấy bài viết này.
          </p>
          <Link
            href="/"
            className="zen-btn-primary"
          >
            Quay lại trang chủ
          </Link>
        </div>
      </div>
    </main>
  )
}
