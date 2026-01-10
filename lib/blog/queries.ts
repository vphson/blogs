import { createClient } from '@/lib/supabase/server'
import type { Post, Category, PostWithCategories, CategoryWithPostCount, PaginatedResult, PaginationParams } from '@/lib/types/blog'
import { POST_STATUS } from '@/lib/constants'
import { PostWithCategoriesSchema, CategorySchema, CategoryWithPostCountSchema } from '@/lib/schemas/blog'

export async function getPublishedPosts(
  params: PaginationParams = {}
): Promise<PaginatedResult<PostWithCategories>> {
  const { limit = 20, cursor } = params
  const supabase = await createClient()

  let query = supabase
    .from('posts')
    .select(
      `
        id,
        title,
        slug,
        content,
        excerpt,
        cover_image,
        status,
        published_at,
        created_at,
        updated_at,
        categories (
          id,
          name,
          slug,
          description
        )
      `,
      { count: 'exact' }
    )
    .eq('status', POST_STATUS.PUBLISHED)
    .order('published_at', { ascending: false })
    .limit(limit + 1) // Fetch one extra to check if there's more

  if (cursor) {
    // Use cursor as continuation point
    query = query.lt('published_at', cursor)
  }

  const { data, error, count } = await query

  if (error) {
    console.error('Error fetching posts:', error)
    return { data: [], count: 0, hasMore: false }
  }

  const hasMore = data && data.length > limit
  const posts = hasMore ? data.slice(0, limit) : (data || [])

  // Validate with zod
  const validationResult = PostWithCategoriesSchema.array().safeParse(posts)

  if (!validationResult.success) {
    console.error('Data validation failed:', validationResult.error)
    return { data: [], count: 0, hasMore: false }
  }

  return {
    data: validationResult.data,
    count: count || 0,
    hasMore,
    nextCursor: hasMore ? posts[posts.length - 1].published_at : undefined,
  }
}

export async function getPostBySlug(slug: string): Promise<PostWithCategories | null> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('posts')
    .select(
      `
        id,
        title,
        slug,
        content,
        excerpt,
        cover_image,
        status,
        published_at,
        created_at,
        updated_at,
        categories (
          id,
          name,
          slug,
          description
        )
      `
    )
    .eq('slug', slug)
    .eq('status', POST_STATUS.PUBLISHED)
    .single()

  if (error) {
    console.error('Error fetching post:', error)
    return null
  }

  // Validate with zod
  const validationResult = PostWithCategoriesSchema.safeParse(data)

  if (!validationResult.success) {
    console.error('Data validation failed:', validationResult.error)
    return null
  }

  return validationResult.data
}

export async function getAllCategories(): Promise<Category[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('name')

  if (error) {
    console.error('Error fetching categories:', error)
    return []
  }

  // Validate with zod
  const validationResult = CategorySchema.array().safeParse(data)

  if (!validationResult.success) {
    console.error('Data validation failed:', validationResult.error)
    return []
  }

  return validationResult.data
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('slug', slug)
    .single()

  if (error) {
    console.error('Error fetching category:', error)
    return null
  }

  // Validate with zod
  const validationResult = CategorySchema.safeParse(data)

  if (!validationResult.success) {
    console.error('Data validation failed:', validationResult.error)
    return null
  }

  return validationResult.data
}

export async function getPostsByCategory(categorySlug: string): Promise<PostWithCategories[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('posts')
    .select(
      `
        id,
        title,
        slug,
        content,
        excerpt,
        cover_image,
        status,
        published_at,
        created_at,
        updated_at,
        categories!inner (
          id,
          name,
          slug,
          description
        )
      `
    )
    .eq('status', POST_STATUS.PUBLISHED)
    .eq('categories.slug', categorySlug)
    .order('published_at', { ascending: false })

  if (error) {
    console.error('Error fetching posts by category:', error)
    return []
  }

  // Validate with zod
  const validationResult = PostWithCategoriesSchema.array().safeParse(data)

  if (!validationResult.success) {
    console.error('Data validation failed:', validationResult.error)
    return []
  }

  return validationResult.data
}

export async function getAllCategoriesWithPostCount(): Promise<CategoryWithPostCount[]> {
  const supabase = await createClient()

  // Use RPC function for better performance (fixes N+1 query problem)
  const { data, error } = await supabase
    .rpc('get_categories_with_post_count')

  if (error) {
    console.error('Error fetching categories with post count:', error)
    return []
  }

  // Validate with zod
  const validationResult = CategoryWithPostCountSchema.array().safeParse(data)

  if (!validationResult.success) {
    console.error('Data validation failed:', validationResult.error)
    return []
  }

  return validationResult.data
}

// Admin queries

/**
 * Get all posts (including drafts) for admin
 */
export async function getAllPosts(status?: 'draft' | 'published'): Promise<PostWithCategories[]> {
  const supabase = await createClient()

  let query = supabase
    .from('posts')
    .select(
      `
        id,
        title,
        slug,
        content,
        excerpt,
        cover_image,
        status,
        published_at,
        created_at,
        updated_at,
        categories (
          id,
          name,
          slug,
          description
        )
      `
    )
    .is('deleted_at', null)

  if (status) {
    query = query.eq('status', status)
  }

  const { data, error } = await query.order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching all posts:', error)
    return []
  }

  // Validate with zod
  const validationResult = PostWithCategoriesSchema.array().safeParse(data)

  if (!validationResult.success) {
    console.error('Data validation failed:', validationResult.error)
    return []
  }

  return validationResult.data
}

/**
 * Get a single post by ID (for admin editing)
 */
export async function getPostById(id: string): Promise<PostWithCategories | null> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('posts')
    .select(
      `
        id,
        title,
        slug,
        content,
        excerpt,
        cover_image,
        status,
        published_at,
        created_at,
        updated_at,
        categories (
          id,
          name,
          slug,
          description
        )
      `
    )
    .eq('id', id)
    .is('deleted_at', null)
    .single()

  if (error) {
    console.error('Error fetching post by ID:', error)
    return null
  }

  // Validate with zod
  const validationResult = PostWithCategoriesSchema.safeParse(data)

  if (!validationResult.success) {
    console.error('Data validation failed:', validationResult.error)
    return null
  }

  return validationResult.data
}

/**
 * Search posts by query string
 * Searches in title, content, and excerpt (case-insensitive)
 */
export async function searchPosts(
  query: string,
  params: PaginationParams = {}
): Promise<PaginatedResult<PostWithCategories>> {
  if (!query || query.trim().length === 0) {
    return { data: [], count: 0, hasMore: false }
  }

  const { limit = 20, cursor } = params
  const supabase = await createClient()
  const searchTerm = query.trim().slice(0, 100) // Limit input length for security

  // Use Postgres full-text search with ilike for Vietnamese support
  let searchQuery = supabase
    .from('posts')
    .select(
      `
        id,
        title,
        slug,
        content,
        excerpt,
        cover_image,
        status,
        published_at,
        created_at,
        updated_at,
        categories (
          id,
          name,
          slug,
          description
        )
      `,
      { count: 'exact' }
    )
    .eq('status', POST_STATUS.PUBLISHED)
    .or(`title.ilike.%${searchTerm}%,content.ilike.%${searchTerm}%,excerpt.ilike.%${searchTerm}%`)
    .order('published_at', { ascending: false })
    .limit(limit + 1) // Fetch one extra to check if there's more

  if (cursor) {
    // Use cursor as continuation point
    searchQuery = searchQuery.lt('published_at', cursor)
  }

  const { data, error, count } = await searchQuery

  if (error) {
    console.error('Error searching posts:', error)
    return { data: [], count: 0, hasMore: false }
  }

  const hasMore = data && data.length > limit
  const posts = hasMore ? data.slice(0, limit) : (data || [])

  // Validate with zod
  const validationResult = PostWithCategoriesSchema.array().safeParse(posts)

  if (!validationResult.success) {
    console.error('Data validation failed:', validationResult.error)
    return { data: [], count: 0, hasMore: false }
  }

  return {
    data: validationResult.data,
    count: count || 0,
    hasMore,
    nextCursor: hasMore ? posts[posts.length - 1].published_at : undefined,
  }
}
