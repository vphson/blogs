'use client'

import { useState } from 'react'
import Link from 'next/link'
import { deletePost, publishPost, unpublishPost } from '@/lib/blog/actions'
import type { PostWithCategories } from '@/lib/types/blog'
import type { PostStatus } from '@/lib/constants'
import { formatDate } from '@/lib/utils'
import { POST_STATUS } from '@/lib/constants'

interface PostListProps {
  initialPosts: PostWithCategories[]
}

type FilterType = 'all' | PostStatus

export function PostList({ initialPosts }: PostListProps) {
  const [posts, setPosts] = useState<PostWithCategories[]>(initialPosts)
  const [filter, setFilter] = useState<FilterType>('all')
  const [isLoading, setIsLoading] = useState(false)
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  const filteredPosts = posts.filter((post) => {
    if (filter === 'all') return true
    return post.status === filter
  })

  const handleDelete = async (id: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa bài viết này?')) {
      return
    }

    setActionLoading(id)
    try {
      const result = await deletePost(id)
      if (result.success) {
        setPosts(posts.filter((p) => p.id !== id))
      } else {
        alert(result.error || 'Không thể xóa bài viết')
      }
    } catch (error) {
      alert('Có lỗi xảy ra khi xóa bài viết')
    } finally {
      setActionLoading(null)
    }
  }

  const handlePublish = async (id: string) => {
    setActionLoading(id)
    try {
      const result = await publishPost(id)
      if (result.success) {
        setPosts(
          posts.map((p) =>
            p.id === id ? { ...p, status: POST_STATUS.PUBLISHED, published_at: new Date().toISOString() } : p
          )
        )
      } else {
        alert(result.error || 'Không thể đăng bài viết')
      }
    } catch (error) {
      alert('Có lỗi xảy ra khi đăng bài viết')
    } finally {
      setActionLoading(null)
    }
  }

  const handleUnpublish = async (id: string) => {
    setActionLoading(id)
    try {
      const result = await unpublishPost(id)
      if (result.success) {
        setPosts(
          posts.map((p) =>
            p.id === id ? { ...p, status: POST_STATUS.DRAFT } : p
          )
        )
      } else {
        alert(result.error || 'Không thể ẩn bài viết')
      }
    } catch (error) {
      alert('Có lỗi xảy ra khi ẩn bài viết')
    } finally {
      setActionLoading(null)
    }
  }

  const getStatusBadge = (status: PostStatus) => {
    if (status === POST_STATUS.PUBLISHED) {
      return (
        <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-800">
          Đã đăng
        </span>
      )
    }
    return (
      <span className="inline-flex items-center rounded-full bg-yellow-100 px-3 py-1 text-xs font-medium text-yellow-800">
        Nháp
      </span>
    )
  }

  return (
    <div>
      {/* Filter tabs */}
      <div className="mb-6 border-b border-stone-200">
        <nav className="flex space-x-8">
          <button
            onClick={() => setFilter('all')}
            className={`border-b-2 py-4 px-1 text-sm font-medium transition-colors ${
              filter === 'all'
                ? 'border-stone-800 text-stone-800'
                : 'border-transparent text-stone-500 hover:border-stone-300 hover:text-stone-700'
            }`}
          >
            Tất cả ({posts.length})
          </button>
          <button
            onClick={() => setFilter(POST_STATUS.PUBLISHED)}
            className={`border-b-2 py-4 px-1 text-sm font-medium transition-colors ${
              filter === POST_STATUS.PUBLISHED
                ? 'border-stone-800 text-stone-800'
                : 'border-transparent text-stone-500 hover:border-stone-300 hover:text-stone-700'
            }`}
          >
            Đã đăng ({posts.filter((p) => p.status === POST_STATUS.PUBLISHED).length})
          </button>
          <button
            onClick={() => setFilter(POST_STATUS.DRAFT)}
            className={`border-b-2 py-4 px-1 text-sm font-medium transition-colors ${
              filter === POST_STATUS.DRAFT
                ? 'border-stone-800 text-stone-800'
                : 'border-transparent text-stone-500 hover:border-stone-300 hover:text-stone-700'
            }`}
          >
            Nháp ({posts.filter((p) => p.status === POST_STATUS.DRAFT).length})
          </button>
        </nav>
      </div>

      {/* Posts list */}
      {filteredPosts.length === 0 ? (
        <div className="rounded-lg border border-stone-200 bg-white p-12 text-center">
          <svg
            className="mx-auto mb-4 h-12 w-12 text-stone-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <h3 className="mb-2 text-lg font-medium text-stone-900">
            {filter === 'all' ? 'Chưa có bài viết nào' : `Không có bài viết ${filter === POST_STATUS.PUBLISHED ? 'đã đăng' : 'nháp'}`}
          </h3>
          <p className="mb-6 text-sm text-stone-500">
            {filter === 'all' && 'Bắt đầu viết bài đầu tiên của bạn.'}
          </p>
          {filter === 'all' && (
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
          )}
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg border border-stone-200 bg-white shadow-sm">
          <table className="min-w-full divide-y divide-stone-200">
            <thead className="bg-stone-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-stone-500">
                  Tiêu đề
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-stone-500">
                  Trạng thái
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-stone-500">
                  Ngày tạo
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-stone-500">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200">
              {filteredPosts.map((post) => (
                <tr key={post.id} className="bg-white hover:bg-stone-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      {post.cover_image && (
                        <div className="mr-4 h-12 w-12 flex-shrink-0">
                          <img
                            className="h-12 w-12 rounded object-cover"
                            src={post.cover_image}
                            alt=""
                          />
                        </div>
                      )}
                      <div>
                        <div className="text-sm font-medium text-stone-900">
                          {post.title}
                        </div>
                        <div className="text-xs text-stone-500">
                          /{post.slug}
                        </div>
                        {post.categories && post.categories.length > 0 && (
                          <div className="mt-1 flex flex-wrap gap-1">
                            {post.categories.map((category) => (
                              <span
                                key={category.id}
                                className="inline-flex items-center rounded-full bg-stone-100 px-2 py-0.5 text-xs text-stone-600"
                              >
                                {category.name}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(post.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-stone-500">
                    {formatDate(post.created_at)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end gap-2">
                      {post.status === POST_STATUS.DRAFT ? (
                        <button
                          onClick={() => handlePublish(post.id)}
                          disabled={actionLoading === post.id}
                          className="rounded border border-green-600 px-3 py-1 text-xs font-medium text-green-600 transition-colors hover:bg-green-50 disabled:opacity-50"
                        >
                          {actionLoading === post.id ? '...' : 'Đăng'}
                        </button>
                      ) : (
                        <button
                          onClick={() => handleUnpublish(post.id)}
                          disabled={actionLoading === post.id}
                          className="rounded border border-stone-600 px-3 py-1 text-xs font-medium text-stone-600 transition-colors hover:bg-stone-50 disabled:opacity-50"
                        >
                          {actionLoading === post.id ? '...' : 'Ẩn'}
                        </button>
                      )}
                      <Link
                        href={`/admin/posts/${post.id}/edit`}
                        className="rounded border border-stone-600 px-3 py-1 text-xs font-medium text-stone-600 transition-colors hover:bg-stone-50"
                      >
                        Sửa
                      </Link>
                      <button
                        onClick={() => handleDelete(post.id)}
                        disabled={actionLoading === post.id}
                        className="rounded border border-red-600 px-3 py-1 text-xs font-medium text-red-600 transition-colors hover:bg-red-50 disabled:opacity-50"
                      >
                        {actionLoading === post.id ? '...' : 'Xóa'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
