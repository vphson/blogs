import { createClient } from '@/lib/supabase/server'
import type { Post, Category, PostWithCategories, CategoryWithPostCount, PaginatedResult, PaginationParams } from '@/lib/types/blog'
import { POST_STATUS } from '@/lib/constants'
import { PostWithCategoriesSchema, CategorySchema, CategoryWithPostCountSchema } from '@/lib/schemas/blog'
import { PostNotFoundError, CategoryNotFoundError, DatabaseError } from '@/lib/errors/types'

/**
 * Get published posts with pagination support
 *
 * Fetches all published posts from the database with their associated categories.
 * Supports cursor-based pagination for efficient navigation through large datasets.
 *
 * @param params - Pagination parameters
 * @param params.limit - Maximum number of posts to return (default: 20)
 * @param params.cursor - Pagination cursor (ISO timestamp of last post from previous page)
 *
 * @returns Paginated result containing:
 *   - `data`: Array of published posts with categories
 *   - `count`: Total number of published posts
 *   - `hasMore`: Whether more posts exist beyond this page
 *   - `nextCursor`: Cursor for next page (if hasMore is true)
 *
 * @example
 * ```ts
 * // Get first 20 posts
 * const result1 = await getPublishedPosts({ limit: 20 })
 *
 * // Get next page
 * const result2 = await getPublishedPosts({
 *   limit: 20,
 *   cursor: result1.nextCursor
 * })
 * ```
 */
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

/**
 * Get a single published post by its slug
 *
 * Fetches a published post with its associated categories by slug.
 * Throws PostNotFoundError if the post doesn't exist or isn't published.
 *
 * @param slug - The unique URL slug of the post
 *
 * @returns The post with categories, or null if not found
 * @throws {PostNotFoundError} When the post doesn't exist
 * @throws {DatabaseError} When database query fails or data validation fails
 *
 * @example
 * ```ts
 * try {
 *   const post = await getPostBySlug('hello-world')
 *   console.log(post.title)
 * } catch (error) {
 *   if (error instanceof PostNotFoundError) {
 *     // Handle not found
 *   }
 * }
 * ```
 */
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
    // PGRST116 is the "not found" error code in Supabase
    if (error.code === 'PGRST116') {
      throw new PostNotFoundError(slug)
    }
    throw new DatabaseError('Failed to fetch post', error)
  }

  if (!data) {
    throw new PostNotFoundError(slug)
  }

  // Validate with zod
  const validationResult = PostWithCategoriesSchema.safeParse(data)

  if (!validationResult.success) {
    throw new DatabaseError('Post data validation failed', validationResult.error)
  }

  return validationResult.data
}

/**
 * Get all categories
 *
 * Fetches all categories from the database ordered alphabetically by name.
 * Returns empty array if no categories exist or on error.
 *
 * @returns Array of all categories
 *
 * @example
 * ```ts
 * const categories = await getAllCategories()
 * categories.forEach(cat => {
 *   console.log(`${cat.name}: ${cat.slug}`)
 * })
 * ```
 */
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

/**
 * Get a single category by its slug
 *
 * Fetches a category by its unique URL slug.
 * Throws CategoryNotFoundError if the category doesn't exist.
 *
 * @param slug - The unique URL slug of the category
 *
 * @returns The category
 * @throws {CategoryNotFoundError} When the category doesn't exist
 * @throws {DatabaseError} When database query fails or data validation fails
 *
 * @example
 * ```ts
 * try {
 *   const category = await getCategoryBySlug('buddhism')
 *   console.log(category.name)
 * } catch (error) {
 *   if (error instanceof CategoryNotFoundError) {
 *     // Handle not found
 *   }
 * }
 * ```
 */
export async function getCategoryBySlug(slug: string): Promise<Category> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('slug', slug)
    .single()

  if (error) {
    // PGRST116 is the "not found" error code in Supabase
    if (error.code === 'PGRST116') {
      throw new CategoryNotFoundError(slug)
    }
    throw new DatabaseError('Failed to fetch category', error)
  }

  if (!data) {
    throw new CategoryNotFoundError(slug)
  }

  // Validate with zod
  const validationResult = CategorySchema.safeParse(data)

  if (!validationResult.success) {
    throw new DatabaseError('Category data validation failed', validationResult.error)
  }

  return validationResult.data
}

/**
 * Get all published posts in a specific category
 *
 * Fetches all published posts that belong to a category,
 * ordered by publication date (newest first).
 * Returns empty array if no posts exist or on error.
 *
 * @param categorySlug - The unique URL slug of the category
 *
 * @returns Array of published posts in the category
 *
 * @example
 * ```ts
 * const posts = await getPostsByCategory('buddhism')
 * posts.forEach(post => {
 *   console.log(post.title)
 * })
 * ```
 */
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

/**
 * Get all categories with their post counts
 *
 * Fetches all categories with the number of published posts in each category.
 * Uses a database RPC function for efficient counting (avoids N+1 query problem).
 * Returns empty array if no categories exist or on error.
 *
 * @returns Array of categories with post counts
 *
 * @example
 * ```ts
 * const categories = await getAllCategoriesWithPostCount()
 * categories.forEach(cat => {
 *   console.log(`${cat.name}: ${cat.post_count} posts`)
 * })
 * ```
 */
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
 *
 * Fetches all posts from the database, including drafts and published posts.
 * Optionally filter by status. Returns posts ordered by creation date (newest first).
 * Excludes soft-deleted posts.
 *
 * @param status - Optional status filter ('draft' or 'published')
 *
 * @returns Array of posts with categories
 *
 * @example
 * ```ts
 * // Get all posts
 * const allPosts = await getAllPosts()
 *
 * // Get only published posts
 * const published = await getAllPosts('published')
 *
 * // Get only drafts
 * const drafts = await getAllPosts('draft')
 * ```
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
 *
 * Fetches a post by its unique ID, including drafts and published posts.
 * Returns null if the post doesn't exist or is soft-deleted.
 *
 * @param id - The unique ID of the post
 *
 * @returns The post with categories, or null if not found
 *
 * @example
 * ```ts
 * const post = await getPostById('123e4567-e89b-12d3-a456-426614174000')
 * if (post) {
 *   console.log(`Editing: ${post.title}`)
 * }
 * ```
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
 *
 * Performs full-text search across published posts in title, content, and excerpt.
 * Case-insensitive and supports Vietnamese characters. Returns empty result for empty queries.
 *
 * @param query - The search term to search for
 * @param params - Pagination parameters
 * @param params.limit - Maximum number of results to return (default: 20)
 * @param params.cursor - Pagination cursor (ISO timestamp of last result from previous page)
 *
 * @returns Paginated search results
 *
 * @example
 * ```ts
 * // Search for posts about meditation
 * const results = await searchPosts('meditation')
 *
 * // Search with pagination
 * const page1 = await searchPosts('thiền', { limit: 10 })
 * const page2 = await searchPosts('thiền', {
 *   limit: 10,
 *   cursor: page1.nextCursor
 * })
 * ```
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
