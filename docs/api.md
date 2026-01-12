# Blog API Documentation

This document describes the core API functions for querying and managing blog content.

## Table of Contents

- [Query Functions](#query-functions)
  - [Public Queries](#public-queries)
  - [Admin Queries](#admin-queries)
- [Action Functions](#action-functions)
- [Utility Functions](#utility-functions)
- [Type Definitions](#type-definitions)

---

## Query Functions

Query functions are read-only operations that fetch data from the database. They are located in `lib/blog/queries.ts`.

### Public Queries

#### `getPublishedPosts`

Fetches published posts with pagination support.

```typescript
import { getPublishedPosts } from '@/lib/blog/queries'

const result = await getPublishedPosts({ limit: 20 })

console.log(result.data)        // Array of posts
console.log(result.count)       // Total count
console.log(result.hasMore)     // Boolean
console.log(result.nextCursor)  // ISO timestamp for next page
```

**Parameters:**
- `params.limit` - Maximum posts to return (default: 20)
- `params.cursor` - Pagination cursor (ISO timestamp)

**Returns:** `PaginatedResult<PostWithCategories>`

---

#### `getPostBySlug`

Fetches a single published post by its URL slug.

```typescript
import { getPostBySlug } from '@/lib/blog/queries'

try {
  const post = await getPostBySlug('hello-world')
  console.log(post.title)
} catch (error) {
  if (error instanceof PostNotFoundError) {
    // Post not found
  }
}
```

**Parameters:**
- `slug` - The unique URL slug of the post

**Returns:** `PostWithCategories`

**Throws:**
- `PostNotFoundError` - When the post doesn't exist
- `DatabaseError` - When database query fails

---

#### `getAllCategories`

Fetches all categories ordered alphabetically.

```typescript
import { getAllCategories } from '@/lib/blog/queries'

const categories = await getAllCategories()
```

**Returns:** `Category[]`

---

#### `getCategoryBySlug`

Fetches a single category by its URL slug.

```typescript
import { getCategoryBySlug } from '@/lib/blog/queries'

const category = await getCategoryBySlug('buddhism')
```

**Parameters:**
- `slug` - The unique URL slug of the category

**Returns:** `Category`

**Throws:**
- `CategoryNotFoundError` - When the category doesn't exist
- `DatabaseError` - When database query fails

---

#### `getPostsByCategory`

Fetches all published posts in a specific category.

```typescript
import { getPostsByCategory } from '@/lib/blog/queries'

const posts = await getPostsByCategory('buddhism')
```

**Parameters:**
- `categorySlug` - The unique URL slug of the category

**Returns:** `PostWithCategories[]`

---

#### `getAllCategoriesWithPostCount`

Fetches all categories with the number of published posts in each.

```typescript
import { getAllCategoriesWithPostCount } from '@/lib/blog/queries'

const categories = await getAllCategoriesWithPostCount()
categories.forEach(cat => {
  console.log(`${cat.name}: ${cat.post_count} posts`)
})
```

**Returns:** `CategoryWithPostCount[]`

---

#### `searchPosts`

Performs full-text search across published posts.

```typescript
import { searchPosts } from '@/lib/blog/queries'

const results = await searchPosts('meditation', { limit: 10 })
```

**Parameters:**
- `query` - The search term
- `params.limit` - Maximum results to return (default: 20)
- `params.cursor` - Pagination cursor

**Returns:** `PaginatedResult<PostWithCategories>`

---

### Admin Queries

#### `getAllPosts`

Fetches all posts (including drafts) for admin.

```typescript
import { getAllPosts } from '@/lib/blog/queries'

// Get all posts
const allPosts = await getAllPosts()

// Get only published
const published = await getAllPosts('published')

// Get only drafts
const drafts = await getAllPosts('draft')
```

**Parameters:**
- `status` - Optional status filter ('draft' or 'published')

**Returns:** `PostWithCategories[]`

---

#### `getPostById`

Fetches a post by ID for admin editing.

```typescript
import { getPostById } from '@/lib/blog/queries'

const post = await getPostById('post-id-here')
```

**Parameters:**
- `id` - The unique ID of the post

**Returns:** `PostWithCategories | null`

---

## Action Functions

Action functions modify data in the database. They are Server Actions located in `lib/blog/actions.ts` and require authentication.

### `createPost`

Creates a new blog post.

```typescript
import { createPost } from '@/lib/blog/actions'

const result = await createPost({
  title: 'My First Post',
  content: '<p>Hello world!</p>',
  status: 'DRAFT',
  category_ids: ['cat-1', 'cat-2']
})

if (result.success) {
  console.log('Created post:', result.data.id)
} else {
  console.error('Error:', result.error)
}
```

**Parameters:**
- `data.title` - Post title
- `data.content` - Post content (HTML/TipTap format)
- `data.slug` - Optional URL slug (auto-generated if not provided)
- `data.excerpt` - Optional excerpt (auto-generated if not provided)
- `data.cover_image` - Optional cover image URL
- `data.status` - Post status ('DRAFT' or 'PUBLISHED')
- `data.category_ids` - Optional array of category IDs

**Returns:** `{ success: boolean, data?: Post, error?: string, warning?: string }`

---

### `updatePost`

Updates an existing blog post.

```typescript
import { updatePost } from '@/lib/blog/actions'

const result = await updatePost({
  id: 'post-123',
  title: 'Updated Title',
  status: 'PUBLISHED',
  category_ids: ['cat-1']
})
```

**Parameters:**
- `data.id` - Post ID to update
- `data.title` - Optional new title
- `data.content` - Optional new content
- `data.slug` - Optional new slug
- `data.excerpt` - Optional new excerpt
- `data.cover_image` - Optional new cover image URL
- `data.status` - Optional new status
- `data.category_ids` - Optional new array of category IDs

**Returns:** `{ success: boolean, data?: Post, error?: string, warning?: string }`

---

### `deletePost`

Soft deletes a blog post.

```typescript
import { deletePost } from '@/lib/blog/actions'

const result = await deletePost('post-123')

if (result.success) {
  console.log('Post deleted successfully')
}
```

**Parameters:**
- `id` - Post ID to delete

**Returns:** `{ success: boolean, error?: string }`

---

### `publishPost`

Publishes a draft post.

```typescript
import { publishPost } from '@/lib/blog/actions'

const result = await publishPost('post-123')
```

**Parameters:**
- `id` - Post ID to publish

**Returns:** `{ success: boolean, error?: string }`

---

### `unpublishPost`

Unpublishes a post (changes to draft).

```typescript
import { unpublishPost } from '@/lib/blog/actions'

const result = await unpublishPost('post-123')
```

**Parameters:**
- `id` - Post ID to unpublish

**Returns:** `{ success: boolean, error?: string }`

---

### `getCategoriesForAdmin`

Fetches all categories for admin forms.

```typescript
import { getCategoriesForAdmin } from '@/lib/blog/actions'

const categories = await getCategoriesForAdmin()
```

**Returns:** `Category[]`

---

## Utility Functions

Utility functions are located in `lib/utils.ts`.

### `cn`

Merge Tailwind CSS classes with proper precedence.

```typescript
import { cn } from '@/lib/utils'

// Simple usage
cn('px-4', 'py-2', 'bg-blue-500')

// With conditional classes
cn('base-class', isActive && 'active-class')

// With conflicting classes (later wins)
cn('px-4', 'px-8') // => 'px-8'
```

---

### `generateSlug`

Generate URL-friendly slug from Vietnamese text.

```typescript
import { generateSlug } from '@/lib/utils'

generateSlug('Chào mừng đến với Việt Nam')
// => 'chao-mung-den-voi-viet-nam'

generateSlug('Thiền & Mindfulness')
// => 'thien-mindfulness'
```

---

### `formatDate`

Format date to Vietnamese locale.

```typescript
import { formatDate } from '@/lib/utils'

formatDate(new Date('2024-01-15'))
// => '15 tháng 1, 2024'
```

---

### `truncate`

Truncate text to specified length.

```typescript
import { truncate } from '@/lib/utils'

truncate('Hello world', 5)
// => 'Hello...'

truncate('Short', 10)
// => 'Short'
```

---

### `generateExcerpt`

Generate excerpt from HTML/Markdown content.

```typescript
import { generateExcerpt } from '@/lib/utils'

generateExcerpt('# Hello World\n\nThis is **bold** text.')
// => 'Hello World This is bold text.'
```

---

## Type Definitions

Key types used throughout the API.

```typescript
// Post types
interface Post {
  id: string
  title: string
  slug: string
  content: string
  excerpt: string
  cover_image: string | null
  status: PostStatus
  published_at: string | null
  created_at: string
  updated_at: string
}

interface PostWithCategories extends Post {
  categories: Category[]
}

type PostStatus = 'DRAFT' | 'PUBLISHED'

// Category types
interface Category {
  id: string
  name: string
  slug: string
  description: string | null
}

interface CategoryWithPostCount extends Category {
  post_count: number
}

// Pagination types
interface PaginatedResult<T> {
  data: T[]
  count: number
  hasMore: boolean
  nextCursor?: string
}

interface PaginationParams {
  limit?: number
  cursor?: string
}

// Action types
interface CreatePostData {
  title: string
  content: string
  slug?: string
  excerpt?: string
  cover_image?: string | null
  status: PostStatus
  category_ids?: string[]
}

interface UpdatePostData {
  id: string
  title?: string
  content?: string
  slug?: string
  excerpt?: string
  cover_image?: string | null
  status?: PostStatus
  category_ids?: string[]
}
```

---

## Error Handling

### Error Types

```typescript
class PostNotFoundError extends Error {
  constructor(slug: string)
}

class CategoryNotFoundError extends Error {
  constructor(slug: string)
}

class DatabaseError extends Error {
  constructor(message: string, cause?: unknown)
}
```

### Action Result Pattern

All action functions return a result object:

```typescript
interface ActionResult<T = unknown> {
  success: boolean
  data?: T
  error?: string
  warning?: string
}
```

Always check `success` before accessing `data`:

```typescript
const result = await createPost(data)

if (result.success) {
  // Access result.data
  console.log(result.data)
} else {
  // Handle error
  console.error(result.error)
}
```

---

## Best Practices

1. **Always handle errors** - Use try/catch for queries and check `success` for actions
2. **Use pagination** - For large datasets, use cursor-based pagination
3. **Validate inputs** - Action functions include server-side validation
4. **Check authentication** - Action functions verify user ownership
5. **Revalidate paths** - Actions automatically revalidate Next.js cache

---

## Import Examples

```typescript
// Query functions
import {
  getPublishedPosts,
  getPostBySlug,
  getAllCategories,
  searchPosts
} from '@/lib/blog/queries'

// Action functions
import {
  createPost,
  updatePost,
  deletePost,
  publishPost
} from '@/lib/blog/actions'

// Utilities
import {
  cn,
  generateSlug,
  formatDate,
  truncate,
  generateExcerpt
} from '@/lib/utils'

// Types
import type {
  Post,
  PostWithCategories,
  Category,
  PaginatedResult
} from '@/lib/types/blog'
```
