'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { generateSlug, generateExcerpt } from '@/lib/utils'
import type { Post, Category, CreatePostData, UpdatePostData } from '@/lib/types/blog'
import { POST_STATUS } from '@/lib/constants'

/**
 * Create a new blog post
 *
 * Creates a new post with the provided data. Automatically generates slug from title
 * if not provided, and generates excerpt from content if not provided.
 * Requires authenticated user.
 *
 * @param data - Post creation data
 * @param data.title - Post title
 * @param data.content - Post content (HTML/TipTap format)
 * @param data.slug - Optional URL slug (auto-generated from title if not provided)
 * @param data.excerpt - Optional excerpt (auto-generated from content if not provided)
 * @param data.cover_image - Optional cover image URL
 * @param data.status - Post status ('DRAFT' or 'PUBLISHED')
 * @param data.category_ids - Optional array of category IDs to associate
 *
 * @returns Result object containing:
 *   - `success`: Whether the operation succeeded
 *   - `data`: Created post object (if successful)
 *   - `error`: Error message (if failed)
 *   - `warning`: Warning message (if partial success)
 *
 * @example
 * ```ts
 * const result = await createPost({
 *   title: 'My First Post',
 *   content: '<p>Hello world!</p>',
 *   status: 'DRAFT',
 *   category_ids: ['cat-1', 'cat-2']
 * })
 *
 * if (result.success) {
 *   console.log('Created post:', result.data.id)
 * } else {
 *   console.error('Error:', result.error)
 * }
 * ```
 */
export async function createPost(data: CreatePostData) {
  const supabase = await createClient()

  try {
    // Get current user
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { success: false, error: 'Unauthorized' }
    }

    // Generate slug from title if not provided
    const slug = data.slug || generateSlug(data.title)

    // Generate excerpt if not provided
    const excerpt = data.excerpt || generateExcerpt(data.content)

    // Prepare post data
    const postData = {
      title: data.title,
      slug,
      content: data.content,
      excerpt,
      cover_image: data.cover_image || null,
      status: data.status,
      published_at: data.status === POST_STATUS.PUBLISHED ? new Date().toISOString() : null,
      author_id: user.id,
    }

    // Insert post
    const { data: post, error: postError } = await supabase
      .from('posts')
      .insert(postData)
      .select()
      .single()

    if (postError) {
      console.error('Error creating post:', postError)
      return { success: false, error: postError.message }
    }

    // Associate categories if provided
    if (data.category_ids && data.category_ids.length > 0) {
      const categoryAssociations = data.category_ids.map((category_id) => ({
        post_id: post.id,
        category_id,
      }))

      const { error: categoriesError } = await supabase
        .from('post_categories')
        .insert(categoryAssociations)

      if (categoriesError) {
        console.error('Error associating categories:', categoriesError)
        // Return with warning instead of silent failure
        return {
          success: true,
          data: post,
          warning: 'Post created but categories could not be associated',
        }
      }
    }

    // Revalidate paths
    revalidatePath('/')
    revalidatePath('/admin/posts')
    if (data.status === POST_STATUS.PUBLISHED) {
      revalidatePath(`/posts/${slug}`)
    }

    return { success: true, data: post }
  } catch (error) {
    console.error('Error in createPost:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

/**
 * Update an existing blog post
 *
 * Updates a post with new data. Only updates fields that are provided.
 * Automatically regenerates slug and excerpt if title or content changes.
 * User must be authenticated and own the post.
 *
 * @param data - Post update data
 * @param data.id - Post ID to update
 * @param data.title - Optional new title
 * @param data.content - Optional new content
 * @param data.slug - Optional new slug
 * @param data.excerpt - Optional new excerpt
 * @param data.cover_image - Optional new cover image URL (set to null to remove)
 * @param data.status - Optional new status
 * @param data.category_ids - Optional new array of category IDs (replaces existing)
 *
 * @returns Result object containing:
 *   - `success`: Whether the operation succeeded
 *   - `data`: Updated post object (if successful)
 *   - `error`: Error message (if failed)
 *   - `warning`: Warning message (if partial success)
 *
 * @example
 * ```ts
 * const result = await updatePost({
 *   id: 'post-123',
 *   title: 'Updated Title',
 *   status: 'PUBLISHED',
 *   category_ids: ['cat-1']
 * })
 *
 * if (result.success) {
 *   console.log('Updated post:', result.data.id)
 * }
 * ```
 */
export async function updatePost(data: UpdatePostData) {
  const supabase = await createClient()

  try {
    // Get current user
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { success: false, error: 'Unauthorized' }
    }

    const { id, ...updateData } = data

    // Check if post exists and belongs to user
    const { data: existingPost } = await supabase
      .from('posts')
      .select('id, author_id, status, published_at')
      .eq('id', id)
      .single()

    if (!existingPost) {
      return { success: false, error: 'Post not found' }
    }

    // Verify user owns this post
    if (existingPost.author_id !== user.id) {
      return { success: false, error: 'Forbidden: You can only modify your own posts' }
    }

    // Generate slug from title if not provided
    let slug = updateData.slug
    if (updateData.title && !slug) {
      slug = generateSlug(updateData.title)
    }

    // Generate excerpt if content changed and excerpt not provided
    let excerpt = updateData.excerpt
    if (updateData.content && !excerpt) {
      excerpt = generateExcerpt(updateData.content)
    }

    // Prepare update data
    const postData = {
      ...(updateData.title && { title: updateData.title }),
      ...(slug && { slug }),
      ...(updateData.content && { content: updateData.content }),
      ...(excerpt !== undefined && { excerpt }),
      ...(updateData.cover_image !== undefined && {
        cover_image: updateData.cover_image || null,
      }),
      ...(updateData.status && {
        status: updateData.status,
        published_at:
          updateData.status === POST_STATUS.PUBLISHED && existingPost.status !== POST_STATUS.PUBLISHED
            ? new Date().toISOString()
            : existingPost.published_at || null,
      }),
      updated_at: new Date().toISOString(),
    }

    // Update post
    const { data: post, error: postError } = await supabase
      .from('posts')
      .update(postData)
      .eq('id', id)
      .select()
      .single()

    if (postError) {
      console.error('Error updating post:', postError)
      return { success: false, error: postError.message }
    }

    // Update categories if provided
    if (data.category_ids !== undefined) {
      // Delete existing category associations
      await supabase.from('post_categories').delete().eq('post_id', id)

      // Add new category associations
      if (data.category_ids.length > 0) {
        const categoryAssociations = data.category_ids.map((category_id) => ({
          post_id: id,
          category_id,
        }))

        const { error: categoriesError } = await supabase
          .from('post_categories')
          .insert(categoryAssociations)

        if (categoriesError) {
          console.error('Error associating categories:', categoriesError)
          // Return with warning instead of silent failure
          return {
            success: true,
            data: post,
            warning: 'Post updated but categories could not be associated',
          }
        }
      }
    }

    // Revalidate paths
    revalidatePath('/')
    revalidatePath('/admin/posts')
    revalidatePath(`/admin/posts/${id}/edit`)
    if (slug) {
      revalidatePath(`/posts/${slug}`)
    }

    return { success: true, data: post }
  } catch (error) {
    console.error('Error in updatePost:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

/**
 * Soft delete a blog post
 *
 * Marks a post as deleted by setting the deleted_at timestamp.
 * Post remains in database but won't appear in queries.
 * User must be authenticated and own the post.
 *
 * @param id - Post ID to delete
 *
 * @returns Result object containing:
 *   - `success`: Whether the operation succeeded
 *   - `error`: Error message (if failed)
 *
 * @example
 * ```ts
 * const result = await deletePost('post-123')
 *
 * if (result.success) {
 *   console.log('Post deleted successfully')
 * } else {
 *   console.error('Error:', result.error)
 * }
 * ```
 */
export async function deletePost(id: string) {
  const supabase = await createClient()

  try {
    // Get current user
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { success: false, error: 'Unauthorized' }
    }

    // Get post slug and author_id before deleting for revalidation and auth check
    const { data: existingPost } = await supabase
      .from('posts')
      .select('slug, author_id')
      .eq('id', id)
      .single()

    if (!existingPost) {
      return { success: false, error: 'Post not found' }
    }

    // Verify user owns this post
    if (existingPost.author_id !== user.id) {
      return { success: false, error: 'Forbidden: You can only delete your own posts' }
    }

    // Soft delete by setting deleted_at
    const { error } = await supabase
      .from('posts')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', id)

    if (error) {
      console.error('Error deleting post:', error)
      return { success: false, error: error.message }
    }

    // Revalidate paths
    revalidatePath('/')
    revalidatePath('/admin/posts')
    revalidatePath(`/posts/${existingPost.slug}`)

    return { success: true }
  } catch (error) {
    console.error('Error in deletePost:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

/**
 * Publish a draft post
 *
 * Changes a post's status from DRAFT to PUBLISHED and sets the published_at timestamp.
 * User must be authenticated and own the post.
 *
 * @param id - Post ID to publish
 *
 * @returns Result object containing:
 *   - `success`: Whether the operation succeeded
 *   - `error`: Error message (if failed)
 *
 * @example
 * ```ts
 * const result = await publishPost('post-123')
 *
 * if (result.success) {
 *   console.log('Post published successfully')
 * } else {
 *   console.error('Error:', result.error)
 * }
 * ```
 */
export async function publishPost(id: string) {
  const supabase = await createClient()

  try {
    // Get current user
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { success: false, error: 'Unauthorized' }
    }

    // First verify post exists and user owns it
    const { data: existingPost } = await supabase
      .from('posts')
      .select('id, author_id')
      .eq('id', id)
      .single()

    if (!existingPost) {
      return { success: false, error: 'Post not found' }
    }

    if (existingPost.author_id !== user.id) {
      return { success: false, error: 'Forbidden: You can only publish your own posts' }
    }

    // Update post status to published
    const { data: post, error } = await supabase
      .from('posts')
      .update({
        status: POST_STATUS.PUBLISHED,
        published_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select('slug')
      .single()

    if (error) {
      console.error('Error publishing post:', error)
      return { success: false, error: error.message }
    }

    // Revalidate paths
    revalidatePath('/')
    revalidatePath('/admin/posts')
    revalidatePath(`/posts/${post.slug}`)

    return { success: true }
  } catch (error) {
    console.error('Error in publishPost:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

/**
 * Get all categories (for admin forms)
 *
 * Fetches all categories from the database ordered alphabetically by name.
 * Used in admin forms for category selection.
 *
 * @returns Array of all categories, or empty array on error
 *
 * @example
 * ```ts
 * const categories = await getCategoriesForAdmin()
 * console.log(`Found ${categories.length} categories`)
 * ```
 */
export async function getCategoriesForAdmin(): Promise<Category[]> {
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

/**
 * Unpublish a post (change to draft)
 *
 * Changes a post's status from PUBLISHED to DRAFT.
 * Post will no longer be publicly visible.
 * User must be authenticated and own the post.
 *
 * @param id - Post ID to unpublish
 *
 * @returns Result object containing:
 *   - `success`: Whether the operation succeeded
 *   - `error`: Error message (if failed)
 *
 * @example
 * ```ts
 * const result = await unpublishPost('post-123')
 *
 * if (result.success) {
 *   console.log('Post unpublished successfully')
 * } else {
 *   console.error('Error:', result.error)
 * }
 * ```
 */
export async function unpublishPost(id: string) {
  const supabase = await createClient()

  try {
    // Get current user
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { success: false, error: 'Unauthorized' }
    }

    // Get post slug and author_id before unpublishing
    const { data: existingPost } = await supabase
      .from('posts')
      .select('slug, author_id')
      .eq('id', id)
      .single()

    if (!existingPost) {
      return { success: false, error: 'Post not found' }
    }

    // Verify user owns this post
    if (existingPost.author_id !== user.id) {
      return { success: false, error: 'Forbidden: You can only unpublish your own posts' }
    }

    // Update post status to draft
    const { error } = await supabase
      .from('posts')
      .update({ status: POST_STATUS.DRAFT })
      .eq('id', id)

    if (error) {
      console.error('Error unpublishing post:', error)
      return { success: false, error: error.message }
    }

    // Revalidate paths
    revalidatePath('/')
    revalidatePath('/admin/posts')
    revalidatePath(`/posts/${existingPost.slug}`)

    return { success: true }
  } catch (error) {
    console.error('Error in unpublishPost:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}
