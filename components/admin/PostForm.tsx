'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createPost, updatePost, getCategoriesForAdmin } from '@/lib/blog/actions'
import type { Category, PostWithCategories } from '@/lib/types/blog'
import type { PostStatus } from '@/lib/constants'
import { generateSlug } from '@/lib/utils'
import { TipTapEditor } from './TipTapEditor'
import { useDebounce } from '@/hooks/useDebounce'
import { POST_STATUS } from '@/lib/constants'

interface PostFormProps {
  post?: PostWithCategories
  onSuccess?: () => void
}

export function PostForm({ post, onSuccess }: PostFormProps) {
  const router = useRouter()
  const isEditing = !!post

  const [title, setTitle] = useState(post?.title || '')
  const [slug, setSlug] = useState(post?.slug || '')
  const [content, setContent] = useState(post?.content || '')
  const [excerpt, setExcerpt] = useState(post?.excerpt || '')
  const [coverImage, setCoverImage] = useState(post?.cover_image || '')
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    post?.categories?.map((c) => c.id) || []
  )
  const [status, setStatus] = useState<PostStatus>(
    post?.status || POST_STATUS.DRAFT
  )
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Debounce title for slug generation
  const debouncedTitle = useDebounce(title, 500)

  useEffect(() => {
    async function loadCategories() {
      const cats = await getCategoriesForAdmin()
      setCategories(cats)
    }
    loadCategories()
  }, [])

  // Auto-generate slug from title (debounced)
  useEffect(() => {
    if (!isEditing && debouncedTitle && !slug) {
      const newSlug = generateSlug(debouncedTitle)
      setSlug(newSlug)
    }
  }, [debouncedTitle, isEditing, slug])

  const handleContentChange = (newContent: string) => {
    setContent(newContent)
  }

  const handleSubmit = async (actionStatus: 'draft' | 'published') => {
    setIsLoading(true)
    setError(null)

    // Trigger blur on any focused element to save editor content
    ;(document.activeElement as HTMLElement)?.blur()
    await new Promise(resolve => setTimeout(resolve, 100))

    try {
      // Auto-generate excerpt from content if not provided
      let finalExcerpt = excerpt
      if (!finalExcerpt && content) {
        // Strip HTML tags for excerpt
        const textContent = content.replace(/<[^>]*>/g, '').trim()
        finalExcerpt = textContent.slice(0, 500)
      }

      const postData = {
        title,
        slug,
        content,
        excerpt: finalExcerpt || undefined,
        cover_image: coverImage || undefined,
        category_ids: selectedCategories,
        status: (actionStatus === 'published' ? POST_STATUS.PUBLISHED : POST_STATUS.DRAFT) as PostStatus,
      }

      const result = isEditing
        ? await updatePost({ ...postData, id: post.id })
        : await createPost(postData)

      if (result.success) {
        if (onSuccess) {
          onSuccess()
        } else {
          router.push('/admin/posts')
        }
      } else {
        setError(result.error || 'Có lỗi xảy ra')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Có lỗi xảy ra')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCategoryToggle = (categoryId: string) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    )
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      {error && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-4 text-red-800">
          {error}
        </div>
      )}

      <div className="space-y-6">
        {/* Title */}
        <div>
          <label htmlFor="title" className="mb-2 block text-sm font-medium text-gray-700">
            Tiêu đề <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 focus:border-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-200"
            placeholder="Nhập tiêu đề bài viết"
            required
          />
        </div>

        {/* Slug */}
        <div>
          <label htmlFor="slug" className="mb-2 block text-sm font-medium text-gray-700">
            Slug
          </label>
          <input
            type="text"
            id="slug"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 focus:border-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-200"
            placeholder="url-friendly-slug"
          />
          <p className="mt-1 text-xs text-gray-500">
            Được tự động tạo từ tiêu đề. Có thể chỉnh sửa thủ công.
          </p>
        </div>

        {/* Content - ModernEditor */}
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Nội dung <span className="text-red-500">*</span>
          </label>
          <TipTapEditor
            initialContent={content}
            onChange={handleContentChange}
            placeholder="Viết nội dung bài viết của bạn ở đây..."
          />
          <p className="mt-2 text-xs text-gray-500">
            ✨ TipTap Editor với đầy đủ tính năng: Tiêu đề, Danh sách, Code, Bảng, Ảnh, YouTube và nhiều hơn nữa.
          </p>
        </div>

        {/* Excerpt */}
        <div>
          <label htmlFor="excerpt" className="mb-2 block text-sm font-medium text-gray-700">
            Tóm tắt
          </label>
          <textarea
            id="excerpt"
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            rows={3}
            className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 focus:border-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-200"
            placeholder="Tóm tắt ngắn gọn về bài viết (tùy chọn)"
          />
          <p className="mt-1 text-xs text-gray-500">
            Nếu để trống, sẽ tự động tạo từ nội dung.
          </p>
        </div>

        {/* Cover Image */}
        <div>
          <label htmlFor="coverImage" className="mb-2 block text-sm font-medium text-gray-700">
            Ảnh bìa
          </label>
          <input
            type="url"
            id="coverImage"
            value={coverImage}
            onChange={(e) => setCoverImage(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 focus:border-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-200"
            placeholder="https://example.com/image.jpg"
          />
          {coverImage && (
            <div className="mt-2">
              <img
                src={coverImage}
                alt="Preview"
                className="h-48 w-full rounded-lg object-cover"
                onError={(e) => {
                  e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect fill="%23e5e7eb" width="400" height="300"/%3E%3Ctext fill="%239ca3af" x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle"%3EInvalid image URL%3C/text%3E%3C/svg%3E'
                }}
              />
            </div>
          )}
        </div>

        {/* Categories */}
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Chủ đề
          </label>
          <div className="space-y-2 rounded-lg border border-gray-200 p-4">
            {categories.length === 0 ? (
              <p className="text-sm text-gray-500">Chưa có chủ đề nào.</p>
            ) : (
              categories.map((category) => (
                <label
                  key={category.id}
                  className="flex cursor-pointer items-center space-x-3"
                >
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(category.id)}
                    onChange={() => handleCategoryToggle(category.id)}
                    className="h-4 w-4 rounded border-gray-300 text-amber-600 focus:ring-amber-500"
                  />
                  <span className="text-sm text-gray-700">{category.name}</span>
                </label>
              ))
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between border-t border-gray-200 pt-6">
          <button
            type="button"
            onClick={() => router.back()}
            className="rounded-lg border border-gray-300 px-6 py-2 text-gray-700 transition-colors hover:bg-gray-50"
            disabled={isLoading}
          >
            Hủy
          </button>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => handleSubmit('draft')}
              disabled={isLoading || !title || !content}
              className="rounded-lg border border-gray-300 px-6 py-2 text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isLoading ? 'Đang lưu...' : 'Lưu nháp'}
            </button>
            <button
              type="button"
              onClick={() => handleSubmit('published')}
              disabled={isLoading || !title || !content}
              className="rounded-lg bg-amber-700 px-6 py-2 text-white transition-colors hover:bg-amber-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isLoading ? 'Đang đăng...' : isEditing ? 'Cập nhật & Đăng' : 'Đăng bài'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
