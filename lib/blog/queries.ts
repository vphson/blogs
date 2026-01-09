import { createClient } from '@/lib/supabase/server'
import type { Post, Category, PostWithCategories, CategoryWithPostCount } from '@/lib/types/blog'
import { POST_STATUS } from '@/lib/constants'

export async function getPublishedPosts(): Promise<PostWithCategories[]> {
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
    .eq('status', POST_STATUS.PUBLISHED)
    .order('published_at', { ascending: false })

  if (error) {
    console.error('Error fetching posts:', error)
    return []
  }

  return data as PostWithCategories[]
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

  return data as PostWithCategories
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

  return data as Category[]
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

  return data as Category
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
    .eq('status', 'PUBLISHED')
    .eq('categories.slug', categorySlug)
    .order('published_at', { ascending: false })

  if (error) {
    console.error('Error fetching posts by category:', error)
    return []
  }

  return data as PostWithCategories[]
}

export async function getAllCategoriesWithPostCount(): Promise<CategoryWithPostCount[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('categories')
    .select(`
      id,
      name,
      slug,
      description,
      posts!left (
        id
      )
    `)
    .order('name')

  if (error) {
    console.error('Error fetching categories with post count:', error)
    return []
  }

  // Count posts for each category (only published posts)
  const categoriesWithCount = (data as any[]).map((category) => ({
    id: category.id,
    name: category.name,
    slug: category.slug,
    description: category.description,
    post_count: category.posts?.filter((p: any) => p !== null).length || 0,
  }))

  return categoriesWithCount
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

  return data as PostWithCategories[]
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

  return data as PostWithCategories
}

/**
 * Search posts by query string
 * Searches in title, content, and excerpt (case-insensitive)
 */
export async function searchPosts(query: string): Promise<PostWithCategories[]> {
  if (!query || query.trim().length === 0) {
    return []
  }

  const supabase = await createClient()
  const searchTerm = query.trim()

  // Use Postgres full-text search with ilike for Vietnamese support
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
    .eq('status', 'PUBLISHED')
    .or(`title.ilike.%${searchTerm}%,content.ilike.%${searchTerm}%,excerpt.ilike.%${searchTerm}%`)
    .order('published_at', { ascending: false })

  if (error) {
    console.error('Error searching posts:', error)
    return []
  }

  return data as PostWithCategories[]
}
