# Quickstart: Personal Blog for Buddhist Practitioner

**Feature**: 001-personal-blog
**Branch**: `001-personal-blog`
**Tech Stack**: Next.js 15 + React 19 + TypeScript + Prisma + PostgreSQL

## Prerequisites

- Node.js 20+ (LTS)
- pnpm (recommended) or npm
- PostgreSQL database (local or cloud)
- Git

## Initial Setup

### 1. Create Next.js Project

```bash
npx create-next-app@latest blog --typescript --tailwind --app --no-src-dir --import-alias "@/*"
cd blog
```

### 2. Install Dependencies

```bash
# Core dependencies
pnpm add next@latest react@latest react-dom@latest

# Database & ORM
pnpm add prisma @prisma/client
pnpm add -D prisma

# Authentication
pnpm add next-auth@beta

# UI Components
pnpm add @radix-ui/react-dialog @radix-ui/react-dropdown-menu
pnpm add @radix-ui/react-toast @radix-ui/react-select

# Rich Text Editor
pnpm add @tiptap/react @tiptap/starter-kit @tiptap/pm

# Utilities
pnpm add date-fns
pnpm add zod

# Testing
pnpm add -D jest @testing-library/react @testing-library/jest-dom
pnpm add -D @playwright/test
```

### 3. Initialize Prisma

```bash
npx prisma init
```

Update `.env`:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/blog?schema=public"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-here-generate-with-openssl-rand-base64-32"
```

Copy the schema from `specs/001-personal-blog/data-model.md` to `prisma/schema.prisma`.

### 4. Run Database Migration

```bash
npx prisma migrate dev --name init
npx prisma generate
```

### 5. Seed Initial Data

Create `prisma/seed.ts`:
```typescript
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Create admin user (password: admin123 - CHANGE ON FIRST LOGIN)
  await prisma.user.create({
    data: {
      email: 'admin@blog.local',
      password: '$2b$12$...', // bcrypt hash of 'admin123'
      name: 'Admin',
    },
  })

  // Create categories
  await prisma.category.createMany({
    data: [
      { name: 'Pháp thoại', slug: 'phat-thoai', description: 'Các bài pháp thoại' },
      { name: 'Thiền', slug: 'thien', description: 'Chuyện về thiền' },
      { name: 'Cuộc sống', slug: 'cuoc-song', description: 'Suy nghĩ về cuộc sống' },
      { name: 'Sự việc', slug: 'su-viec', description: 'Các sự việc' },
    ],
  })
}

main()
```

Run seed:
```bash
npx prisma db seed
```

### 6. Set Up NextAuth

Create `app/api/auth/[...nextauth]/route.ts`:
```typescript
import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { prisma } from '@/lib/db'

export const { handlers, auth } = NextAuth({
  providers: [
    CredentialsProvider({
      credentials: {
        email: { type: 'email' },
        password: { type: 'password' },
      },
      async authorize(credentials) {
        // Implement auth logic
      },
    }),
  ],
})

export const { GET, POST } = handlers
```

### 7. Create Base Directory Structure

```bash
mkdir -p app/\(public\)/posts/\[slug\]
mkdir -p app/\(admin\)/admin
mkdir -p components/public
mkdir -p components/admin
mkdir -p components/ui
mkdir -p lib/db
mkdir -p lib/auth
mkdir -p lib/utils
```

### 8. Start Development Server

```bash
pnpm dev
```

Visit `http://localhost:3000`

## Development Workflow

### Creating a Post

1. Sign in at `http://localhost:3000/admin`
2. Click "New Post"
3. Enter title, content, select categories
4. Click "Save Draft" or "Publish"

### Admin Routes

- `/admin` - Dashboard
- `/admin/posts` - Manage posts
- `/admin/comments` - Moderate comments

### Public Routes

- `/` - Homepage (list of posts)
- `/posts/[slug]` - Individual post
- `/category/[slug]` - Posts by category
- `/search` - Search page

## Testing

```bash
# Unit tests
pnpm test

# E2E tests
pnpm playwright test

# Type checking
pnpm tsc --noEmit
```

## Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables:
   - `DATABASE_URL` - Use Vercel Postgres or Neon
   - `NEXTAUTH_URL` - Your domain
   - `NEXTAUTH_SECRET` - Generate with `openssl rand -base64 32`
4. Deploy

### First Steps After Deployment

1. Sign in with seeded admin credentials
2. Change password immediately
3. Create your first post
4. Verify all features work

## File Structure Reference

```
blog/
├── app/
│   ├── (public)/          # Public routes
│   ├── (admin)/           # Admin routes (protected)
│   ├── api/               # API routes
│   └── layout.tsx         # Root layout
├── components/
│   ├── public/            # Public components
│   ├── admin/             # Admin components
│   └── ui/                # Reusable UI components
├── lib/
│   ├── db.ts              # Prisma client
│   ├── auth.ts            # Auth utilities
│   └── utils.ts           # Helper functions
├── prisma/
│   ├── schema.prisma      # Database schema
│   └── seed.ts            # Seed data
├── public/
│   └── images/            # Static images
├── tests/
│   ├── unit/              # Unit tests
│   └── e2e/               # E2E tests
├── .env.local             # Local environment
├── next.config.js         # Next.js config
├── tailwind.config.ts     # Tailwind config
└── tsconfig.json          # TypeScript config
```

## Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://...` |
| `NEXTAUTH_URL` | Your app URL | `http://localhost:3000` |
| `NEXTAUTH_SECRET` | Secret for JWT | `openssl rand -base64 32` |
| `BLOB_READ_WRITE_TOKEN` | Vercel Blob token (optional) | `vercel_blob_...` |

## Troubleshooting

### Database Connection Issues

```bash
# Check Prisma connection
npx prisma db push

# Regenerate client
npx prisma generate
```

### Build Errors

```bash
# Clean install
rm -rf node_modules .next
pnpm install
```

### TypeScript Errors

```bash
# Check types
pnpm tsc --noEmit
```

## Next Steps

1. Implement P1 user stories (Đọc bài viết, Viết bài, Thiết kế Zen)
2. Add P2 features (Tìm kiếm, Phân loại)
3. Add P3 features (Bình luận, chia sẻ)
4. Set up CI/CD
5. Configure analytics (optional)

## Resources

- [Next.js Docs](https://nextjs.org/docs)
- [Prisma Docs](https://www.prisma.io/docs)
- [NextAuth.js Docs](https://authjs.dev)
- [Radix UI Docs](https://www.radix-ui.com)
- [Tiptap Docs](https://tiptap.dev)
