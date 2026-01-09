# Data Model: Personal Blog for Buddhist Practitioner

**Feature**: 001-personal-blog
**Date**: 2025-01-07
**Database**: Supabase (PostgreSQL)
**ORM**: Prisma for local dev, Supabase Client for runtime

## Entity Relationship Diagram

```
┌──────────────┐         ┌─────────────┐
│     Post     │    N:M  │  Category   │
│              │─────────│             │
├──────────────┤         ├─────────────┤
│ id           │         │ id          │
│ title        │         │ name        │
│ slug         │         │ slug        │
│ content      │         │ description │
│ excerpt      │         └─────────────┘
│ coverImage   │              │
│ status       │              │
│ publishedAt  │              │
│ createdAt    │              │
│ updatedAt    │              │
└──────────────┘              │
         │                     │
         │                     │
         └─────────────────────┘
                 │
                 ▼
        ┌──────────────────────┐
        │   PostCategory       │
        │     (junction)       │
        ├──────────────────────┤
        │ postId               │
        │ categoryId           │
        └──────────────────────┘

Note: Admin authentication handled by Supabase Auth (auth.users table)
No custom User model needed.
```

## Entities

### 1. Post

Represents a blog post/article.

**Fields**:

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | String (UUID) | Primary Key | Unique identifier |
| title | String | Not Null, 10-200 chars | Post title |
| slug | String | Unique, Not Null | URL-friendly identifier |
| content | Text | Not Null | Markdown/MDX content |
| excerpt | String? | Nullable, Max 500 chars | Short summary for list view |
| coverImage | String? | Nullable, URL | Featured image URL (Supabase Storage) |
| status | Enum | Not Null, Default: DRAFT | DRAFT, PUBLISHED |
| publishedAt | DateTime? | Nullable | First publication date |
| createdAt | DateTime | Not Null, Default: now | Creation timestamp |
| updatedAt | DateTime | Not Null, OnUpdate: now | Last update timestamp |
| deletedAt | DateTime? | Nullable | Soft delete timestamp |
| authorId | String? | Nullable | Reference to Supabase Auth user ID (optional, for tracking) |

**Validation Rules**:
- Slug must be URL-safe (lowercase, hyphens only)
- Title must be 10-200 characters
- Content must not be empty when status is PUBLISHED
- Excerpt auto-generated from content if not provided (first 150 chars)

**State Transitions**:

```
[DRAFT] ───publish───> [PUBLISHED]
   ▲                       │
   │                       │
   └────────unpublish──────┘
```

**Indexes**:
- `slug` (unique)
- `status` + `publishedAt` (composite, for listing published posts)
- `authorId` (optional, for tracking posts by admin)

**Relationships**:
- Has many `Category` through `PostCategory` (many-to-many)

---

### 2. Category

Represents content categories (e.g., "Pháp thoại", "Thiền", "Cuộc sống").

**Fields**:

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | String (UUID) | Primary Key | Unique identifier |
| name | String | Unique, Not Null, 1-50 chars | Display name (Vietnamese) |
| slug | String | Unique, Not Null | URL-friendly identifier |
| description | String? | Nullable, Max 500 chars | Category description |
| createdAt | DateTime | Not Null, Default: now | Creation timestamp |
| updatedAt | DateTime | Not Null, OnUpdate: now | Last update timestamp |

**Validation Rules**:
- Slug must be URL-safe
- Name must be unique
- Predefined categories allowed (seeds)

**Indexes**:
- `slug` (unique)
- `name` (unique)

**Relationships**:
- Has many `Post` through `PostCategory` (many-to-many)

**Predefined Categories** (from seed):
1. pháp thoại (Dharma Talks)
2. thiền (Meditation)
3. cuộc sống (Life)
4. sự việc (Events)

---

### 3. PostCategory

Junction table for many-to-many relationship between Post and Category.

**Fields**:

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| postId | String | Not Null, Foreign Key | Reference to Post.id |
| categoryId | String | Not Null, Foreign Key | Reference to Category.id |
| createdAt | DateTime | Not Null, Default: now | Assignment timestamp |

**Constraints**:
- Composite Primary Key: (`postId`, `categoryId`)
- Cascade delete when Post or Category is deleted

**Indexes**:
- Composite index on (`postId`, `categoryId`)

---

## Prisma Schema

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
  // Supabase provides DATABASE_URL automatically
}

enum PostStatus {
  DRAFT
  PUBLISHED
}

// Note: Admin authentication handled by Supabase Auth
// No custom User model needed - use auth.users from Supabase

model Post {
  id          String         @id @default(uuid())
  title       String
  slug        String         @unique
  content     String         @db.Text
  excerpt     String?        @db.VarChar(500)
  coverImage  String?
  status      PostStatus     @default(DRAFT)
  publishedAt DateTime?
  createdAt   DateTime       @default(now())
  updatedAt   DateTime       @updatedAt
  deletedAt   DateTime?
  authorId    String?        // Optional: reference to Supabase Auth user ID

  categories  PostCategory[]

  @@index([slug])
  @@index([status, publishedAt])
  @@index([authorId])
}

model Category {
  id          String         @id @default(uuid())
  name        String         @unique
  slug        String         @unique
  description String?        @db.VarChar(500)
  createdAt   DateTime       @default(now())
  updatedAt   DateTime       @updatedAt

  posts       PostCategory[]

  @@index([slug])
  @@index([name])
}

model PostCategory {
  postId     String   @default(uuid())
  categoryId String   @default(uuid())
  createdAt  DateTime @default(now())

  post       Post     @relation(fields: [postId], references: [id], onDelete: Cascade)
  category   Category @relation(fields: [categoryId], references: [id], onDelete: Cascade)

  @@id([postId, categoryId])
  @@index([postId, categoryId])
}
```

## Database Migrations

### Migration 1: Initial Schema

```bash
npx prisma migrate dev --name init
```

This will create:
- `User` table with admin user
- `Post` table with draft status
- `Category` table
- `PostCategory` junction table
- All indexes and foreign keys

### Seed Data

Initial seed will include:
1. Predefined categories (Pháp thoại, Thiền, Cuộc sống, Sự việc)
2. Sample published post (for testing)

**Note**: Admin user created via Supabase Dashboard or CLI, not through Prisma seed.

```bash
npx prisma db seed
```

**Creating Admin User via Supabase**:
```bash
# Using Supabase CLI
supabase auth signup --email admin@example.com --password your_password

# Or create via Supabase Dashboard > Authentication > Users
```

## Query Patterns

### Common Queries

1. **List published posts (homepage)**:
```typescript
const posts = await prisma.post.findMany({
  where: { status: 'PUBLISHED', deletedAt: null },
  include: { categories: { include: { category: true } } },
  orderBy: { publishedAt: 'desc' },
  take: 10
});
```

2. **Get post by slug**:
```typescript
const post = await prisma.post.findUnique({
  where: { slug, deletedAt: null },
  include: { categories: { include: { category: true } } }
});
```

3. **Search posts** (full-text):
```typescript
const posts = await prisma.post.findMany({
  where: {
    status: 'PUBLISHED',
    deletedAt: null,
    OR: [
      { title: { contains: query, mode: 'insensitive' } },
      { content: { contains: query, mode: 'insensitive' } },
      { excerpt: { contains: query, mode: 'insensitive' } }
    ]
  },
  include: { categories: { include: { category: true } } },
  orderBy: { publishedAt: 'desc' }
});
```

4. **Get posts by category**:
```typescript
const posts = await prisma.post.findMany({
  where: {
    status: 'PUBLISHED',
    deletedAt: null,
    categories: { some: { category: { slug } } }
  },
  include: { categories: { include: { category: true } } },
  orderBy: { publishedAt: 'desc' }
});
```

## Data Integrity

### Cascade Rules

| Relationship | On Delete | Behavior |
|--------------|-----------|----------|
| Post → PostCategory | Cascade | Category assignments deleted when post deleted |
| Category → PostCategory | Cascade | Category assignments deleted when category deleted |

### Soft Deletes

Posts use soft deletes (`deletedAt` field):
- Actual deletion never occurs
- Queries filter out records where `deletedAt IS NOT NULL`
- Allows recovery of accidentally deleted content

### Transactions

Multi-step operations must use transactions:
- Creating a post with categories
- Updating post status to published (set `publishedAt` if null)

```typescript
await prisma.$transaction(async (tx) => {
  // Multi-step operations
});
```

---

## Performance Considerations

1. **Connection Pooling**: Use Prisma's connection pooling (handled by Prisma Accelerate or pgBouncer)
2. **Select Specific Fields**: Avoid `include: {}` when not needed to reduce payload
3. **Pagination**: Use `cursor`-based pagination for large lists
4. **Index Optimization**: Monitor query performance and add indexes as needed

---

## Notes

- All IDs use UUID for distributed systems compatibility
- All timestamps use UTC
- Vietnamese text search requires proper PostgreSQL locale configuration
- Slug generation should handle Vietnamese characters (e.g., "Điền" → "dien")
- **Admin authentication handled by Supabase Auth, no custom User model needed**
- **Public users do NOT need authentication, only read access**
- **No comments or social interactions in this phase**
