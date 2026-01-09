import type { PostStatus } from '@/lib/constants'

export interface Category {
  id: string
  name: string
  slug: string
  description: string | null
}

export interface CategoryWithPostCount extends Category {
  post_count: number
}

export interface Post {
  id: string
  title: string
  slug: string
  content: string
  excerpt: string | null
  cover_image: string | null
  status: PostStatus
  published_at: string | null
  created_at: string
  updated_at: string
  categories?: Category[]
}

export interface PostWithCategories extends Post {
  categories: Category[]
}

export interface PostCategory {
  post_id: string
  category_id: string
}

// Action types
export interface CreatePostData {
  title: string
  slug?: string
  content: string
  excerpt?: string
  cover_image?: string
  category_ids?: string[]
  status: PostStatus
}

export interface UpdatePostData extends Partial<CreatePostData> {
  id: string
}

export interface ActionResult<T = void> {
  success: boolean
  error?: string
  data?: T
}
