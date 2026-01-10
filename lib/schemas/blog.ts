import { z } from 'zod'
import type { PostStatus } from '@/lib/constants'

export const CategorySchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(100),
  slug: z.string().min(1).max(100),
  description: z.string().nullable(),
})

export const PostSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1).max(500),
  slug: z.string().min(1).max(200),
  content: z.string().min(1),
  excerpt: z.string().nullable(),
  cover_image: z.string().url().nullable(),
  status: z.enum(['DRAFT', 'PUBLISHED']) as z.ZodType<PostStatus>,
  published_at: z.string().datetime().nullable(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
  categories: z.array(CategorySchema).optional(),
})

export const PostWithCategoriesSchema = PostSchema.extend({
  categories: z.array(CategorySchema),
})

export const CategoryWithPostCountSchema = CategorySchema.extend({
  post_count: z.number().int().min(0),
})
