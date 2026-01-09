'use client'

import { createClient } from '@/lib/supabase/client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function SignupPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const router = useRouter()

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const supabase = createClient()
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      })

      if (error) {
        setError(error.message)
      } else {
        setSuccess(true)
        // Redirect to login after 2 seconds
        setTimeout(() => {
          router.push('/login')
        }, 2000)
      }
    } catch (err) {
      setError('Có lỗi xảy ra. Vui lòng thử lại.')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-stone-50 to-stone-100 px-4">
        <div className="w-full max-w-md text-center">
          <div className="mb-6 rounded-full bg-green-100 p-6 text-green-600">
            <svg
              className="mx-auto h-12 w-12"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h2 className="mb-4 text-2xl font-light text-stone-800">
            Đăng ký thành công!
          </h2>
          <p className="text-stone-600">
            Tài khoản admin đã được tạo. Đang chuyển đến trang đăng nhập...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-stone-50 to-stone-100 px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-3xl font-light tracking-wide text-stone-800">
            Tạo Admin Account
          </h1>
          <p className="text-stone-600">
            Tạo tài khoản quản trị cho Blog Thiền
          </p>
        </div>

        <form onSubmit={handleSignup} className="space-y-6">
          {error && (
            <div className="rounded-lg bg-red-50 p-4 text-sm text-red-700">
              {error}
            </div>
          )}

          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-medium text-stone-700"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-lg border border-stone-300 bg-white px-4 py-3 text-stone-900 focus:border-stone-500 focus:outline-none focus:ring-1 focus:ring-stone-500"
              placeholder="admin@example.com"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-medium text-stone-700"
            >
              Mật khẩu
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full rounded-lg border border-stone-300 bg-white px-4 py-3 text-stone-900 focus:border-stone-500 focus:outline-none focus:ring-1 focus:ring-stone-500"
              placeholder="••••••••"
            />
            <p className="mt-1 text-xs text-stone-500">
              Tối thiểu 6 ký tự
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-stone-800 px-4 py-3 text-white transition-colors hover:bg-stone-700 focus:outline-none focus:ring-2 focus:ring-stone-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? 'Đang tạo...' : 'Tạo Admin Account'}
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-stone-500">
          <Link
            href="/"
            className="hover:text-stone-700 hover:underline"
          >
            ← Quay lại trang chủ
          </Link>
        </div>

        <div className="mt-6 rounded-lg bg-yellow-50 p-4 text-xs text-yellow-800">
          <p className="font-medium">⚠️ Lưu ý:</p>
          <p className="mt-1">
            Sau khi tạo xong, hãy xóa file <code>app/signup/page.tsx</code> để
            không ai khác có thể tạo admin account.
          </p>
        </div>
      </div>
    </div>
  )
}
