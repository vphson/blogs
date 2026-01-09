# Next.js + Supabase Quickstart: Blog Phật Giáo

**Tech Stack**: Next.js 15 + Supabase + TypeScript + Tailwind CSS
**Thời gian setup**: ~45 phút
**Chi phí**: Free tier (500MB database, 1GB bandwidth)

---

## Phần 1: Setup Supabase Project

### 1.1 Tạo Supabase Account

1. Truy cập: https://supabase.com
2. Sign up (miễn phí)
3. Create new organization
4. Create new project:
   - **Name**: `blog-phat-giao`
   - **Database Password**: Lưu lại mật khẩu này!
   - **Region**: Singapore (gần Việt Nam nhất)
   - **Pricing plan**: Free

### 1.2 Lấy Supabase Credentials

Sau khi project tạo xong (~2 phút), vào:

**Settings > API**:

```env
# Copy những này:
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

Lưu 2 giá trị này để dùng sau.

---

## Phần 2: Setup Next.js Project

### 2.1 Tạo Next.js App

```bash
cd "/Users/vphson/Rockship /blogs-ai"

# Tạo Next.js app
npx create-next-app@latest blog --typescript --tailwind --app --no-src-dir --import-alias "@/*"

cd blog
```

### 2.2 Cài Dependencies

```bash
cd "/Users/vphson/Rockship /blogs-ai/blog"

# Supabase client
pnpm add @supabase/supabase-js
npm install @supabase/supabase-js

# Utilities
pnpm add date-fns
npm install date-fns

# Icons
pnpm add lucide-react
npm install lucide-react

# Markdown (cho bài viết)
pnpm add react-markdown
npm install react-markdown
```

### 2.3 Setup Environment Variables

Tạo file `.env.local`:

```bash
cat > .env.local << 'EOF'
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
EOF
```

**Thay thế** `xxxxx` bằng giá trị từ Supabase dashboard.

---

## Phần 3: Tạo Database Tables trong Supabase

### 3.1 Vào Supabase SQL Editor

Supabase dashboard > SQL Editor > New query

### 3.2 Tạo Tables

Copy và chạy từng query sau:

#### **Table: users** (Admin)

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

-- Index cho email
CREATE INDEX idx_users_email ON users(email);
```

#### **Table: categories** (Chủ đề)

```sql
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed categories mặc định
INSERT INTO categories (name, slug, description) VALUES
  ('Pháp thoại', 'phat-thoai', 'Các bài pháp thoại'),
  ('Thiền', 'thien', 'Chuyện về thiền định'),
  ('Cuộc sống', 'cuoc-song', 'Suy nghĩ về cuộc sống'),
  ('Sự việc', 'su-viec', 'Các sự việc');

-- Indexes
CREATE INDEX idx_categories_slug ON categories(slug);
CREATE INDEX idx_categories_name ON categories(name);
```

#### **Table: posts** (Bài viết)

```sql
CREATE TABLE posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  cover_image TEXT,
  status TEXT DEFAULT 'DRAFT' CHECK (status IN ('DRAFT', 'PUBLISHED')),
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ,
  author_id UUID REFERENCES users(id) ON DELETE CASCADE
);

-- Indexes
CREATE INDEX idx_posts_slug ON posts(slug);
CREATE INDEX idx_posts_status ON posts(status);
CREATE INDEX idx_posts_published_at ON posts(published_at DESC);
CREATE INDEX idx_posts_author_id ON posts(author_id);
```

#### **Table: post_categories** (Junction table)

```sql
CREATE TABLE post_categories (
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  category_id UUID REFERENCES categories(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (post_id, category_id)
);

-- Index
CREATE INDEX idx_post_categories_post_id ON post_categories(post_id);
CREATE INDEX idx_post_categories_category_id ON post_categories(category_id);
```

### 3.3 Enable Row Level Security (RLS)

```sql
-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_categories ENABLE ROW LEVEL SECURITY;

-- Policy: Public có thể đọc published posts
CREATE POLICY "Public can view published posts"
ON posts FOR SELECT
USING (status = 'PUBLISHED' AND deleted_at IS NULL);

-- Policy: Public có thể đọc categories
CREATE POLICY "Public can view categories"
ON categories FOR SELECT
USING (true);

-- Policy: Public có thể đọc post_categories
CREATE POLICY "Public can view post categories"
ON post_categories FOR SELECT
USING (true);

-- Policy: Service role (admin) có thể làm mọi thứ
-- (Sẽ được setup qua Supabase client với service_role key)
```

---

## Phần 4: Tạo Supabase Client

### 4.1 Tạo Supabase Client Utility

Tạo file `lib/supabase.ts`:

```typescript
// lib/supabase.ts
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

### 4.2 Tạo Types cho Database

Tạo file `types/database.ts`:

```typescript
// types/database.ts
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          password: string
          name: string
          created_at: string
          updated_at: string
          deleted_at: string | null
        }
        Insert: {
          id?: string
          email: string
          password: string
          name: string
          created_at?: string
          updated_at?: string
          deleted_at?: string | null
        }
        Update: {
          id?: string
          email?: string
          password?: string
          name?: string
          updated_at?: string
          deleted_at?: string | null
        }
      }
      categories: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          description?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          description?: string | null
          updated_at?: string
        }
      }
      posts: {
        Row: {
          id: string
          title: string
          slug: string
          content: string
          excerpt: string | null
          cover_image: string | null
          status: 'DRAFT' | 'PUBLISHED'
          published_at: string | null
          created_at: string
          updated_at: string
          deleted_at: string | null
          author_id: string
        }
        Insert: {
          id?: string
          title: string
          slug: string
          content: string
          excerpt?: string | null
          cover_image?: string | null
          status?: 'DRAFT' | 'PUBLISHED'
          published_at?: string | null
          created_at?: string
          updated_at?: string
          deleted_at?: string | null
          author_id: string
        }
        Update: {
          id?: string
          title?: string
          slug?: string
          content?: string
          excerpt?: string | null
          cover_image?: string | null
          status?: 'DRAFT' | 'PUBLISHED'
          published_at?: string | null
          updated_at?: string
          deleted_at?: string | null
          author_id?: string
        }
      }
      post_categories: {
        Row: {
          post_id: string
          category_id: string
          created_at: string
        }
        Insert: {
          post_id: string
          category_id: string
          created_at?: string
        }
        Update: {
          post_id?: string
          category_id?: string
        }
      }
    }
  }
}
```

---

## Phần 5: Tạo Pages

### 5.1 Homepage (List posts)

Tạo file `app/page.tsx`:

```typescript
// app/page.tsx
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

async function getPosts() {
  const { data } = await supabase
    .from('posts')
    .select(`
      *,
      categories (
        id,
        name,
        slug
      )
    `)
    .eq('status', 'PUBLISHED')
    .is('deleted_at', null)
    .order('published_at', { ascending: false })

  return data
}

export default async function HomePage() {
  const posts = await getPosts()

  return (
    <main className="min-h-screen bg-[#FAF9F6]">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <header className="mb-12 text-center">
          <h1 className="text-4xl font-serif text-[#3A3A3A] mb-4">
            Tịnh Thiền
          </h1>
          <p className="text-[#6B6B6B]">
            Nơi chia sẻ cảm nhận về cuộc sống
          </p>
        </header>

        {posts && posts.length > 0 ? (
          <div className="space-y-8">
            {posts.map((post) => (
              <article
                key={post.id}
                className="bg-white p-8 rounded-lg shadow-sm"
              >
                <Link href={`/posts/${post.slug}`}>
                  <h2 className="text-2xl font-serif text-[#3A3A3A] hover:text-[#8B9A6D] mb-3">
                    {post.title}
                  </h2>
                </Link>

                {post.excerpt && (
                  <p className="text-[#6B6B6B] mb-4 leading-relaxed">
                    {post.excerpt}
                  </p>
                )}

                {post.categories && post.categories.length > 0 && (
                  <div className="flex gap-2 flex-wrap">
                    {post.categories.map((cat) => (
                      <span
                        key={cat.id}
                        className="text-sm px-3 py-1 bg-[#F5F5F0] text-[#8B9A6D] rounded-full"
                      >
                        {cat.name}
                      </span>
                    ))}
                  </div>
                )}

                <div className="text-sm text-[#9A9A9A] mt-4">
                  {post.published_at && new Date(post.published_at).toLocaleDateString('vi-VN')}
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-[#6B6B6B]">
              Chưa có bài viết nào. Hãy quay lại sau nhé!
            </p>
          </div>
        )}
      </div>
    </main>
  )
}
```

### 5.2 Post Detail Page

Tạo file `app/posts/[slug]/page.tsx`:

```typescript
// app/posts/[slug]/page.tsx
import { supabase } from '@/lib/supabase'
import { notFound } from 'next/navigation'
import Link from 'next/link'

async function getPost(slug: string) {
  const { data } = await supabase
    .from('posts')
    .select(`
      *,
      categories (
        id,
        name,
        slug
      )
    `)
    .eq('slug', slug)
    .eq('status', 'PUBLISHED')
    .is('deleted_at', null)
    .single()

  return data
}

export default async function PostPage({ params }: { params: { slug: string } }) {
  const post = await getPost(params.slug)

  if (!post) {
    notFound()
  }

  return (
    <main className="min-h-screen bg-[#FAF9F6]">
      <article className="max-w-3xl mx-auto px-4 py-12">
        <Link
          href="/"
          className="inline-block text-[#8B9A6D] hover:text-[#6B7A5D] mb-8"
        >
          ← Quay lại trang chủ
        </Link>

        <header className="mb-8">
          <h1 className="text-4xl font-serif text-[#3A3A3A] mb-4 leading-tight">
            {post.title}
          </h1>

          {post.categories && post.categories.length > 0 && (
            <div className="flex gap-2 flex-wrap mb-4">
              {post.categories.map((cat) => (
                <span
                  key={cat.id}
                  className="text-sm px-3 py-1 bg-[#F5F5F0] text-[#8B9A6D] rounded-full"
                >
                  {cat.name}
                </span>
              ))}
            </div>
          )}

          <div className="text-sm text-[#9A9A9A]">
            {post.published_at && new Date(post.published_at).toLocaleDateString('vi-VN')}
          </div>
        </header>

        <div
          className="prose prose-lg max-w-none"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        <footer className="mt-12 pt-8 border-t border-[#E8E8E8]">
          <Link
            href="/"
            className="inline-block text-[#8B9A6D] hover:text-[#6B7A5D]"
          >
            ← Quay lại trang chủ
          </Link>
        </footer>
      </article>
    </main>
  )
}
```

### 5.3 Categories Page (Optional)

Tạo file `app/categories/page.tsx`:

```typescript
// app/categories/page.tsx
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

async function getCategories() {
  const { data } = await supabase
    .from('categories')
    .select(`
      *,
      posts(count)
    `)
    .order('name')

  return data
}

export default async function CategoriesPage() {
  const categories = await getCategories()

  return (
    <main className="min-h-screen bg-[#FAF9F6]">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <header className="mb-12">
          <h1 className="text-3xl font-serif text-[#3A3A3A] mb-4">
            Chủ đề
          </h1>
        </header>

        <div className="grid gap-4">
          {categories?.map((category: any) => (
            <Link
              key={category.id}
              href={`/categories/${category.slug}`}
              className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <h2 className="text-xl font-serif text-[#3A3A3A] mb-2">
                {category.name}
              </h2>
              {category.description && (
                <p className="text-[#6B6B6B] mb-2">
                  {category.description}
                </p>
              )}
              <span className="text-sm text-[#9A9A9A]">
                {category.posts?.[0]?.count || 0} bài viết
              </span>
            </Link>
          ))}
        </div>
      </div>
    </main>
  )
}
```

---

## Phần 6: Tạo Admin Dashboard

### 6.1 Setup Admin Authentication

Tạo file `app/admin/layout.tsx`:

```typescript
// app/admin/layout.tsx
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // TODO: Add authentication check
  return <div className="min-h-screen bg-gray-50">{children}</div>
}
```

### 6.2 Admin Dashboard

Tạo file `app/admin/page.tsx`:

```typescript
// app/admin/page.tsx
import Link from 'next/link'

export default function AdminDashboard() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

      <div className="grid gap-6 md:grid-cols-3">
        <Link
          href="/admin/posts"
          className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow"
        >
          <h2 className="text-xl font-semibold mb-2">Quản lý bài viết</h2>
          <p className="text-gray-600">Tạo, sửa, xóa bài viết</p>
        </Link>

        <Link
          href="/admin/categories"
          className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow"
        >
          <h2 className="text-xl font-semibold mb-2">Chủ đề</h2>
          <p className="text-gray-600">Quản lý chủ đề bài viết</p>
        </Link>

        <Link
          href="/admin/settings"
          className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow"
        >
          <h2 className="text-xl font-semibold mb-2">Cài đặt</h2>
          <p className="text-gray-600">Cấu hình blog</p>
        </Link>
      </div>
    </div>
  )
}
```

---

## Phần 7: Chạy Local

```bash
cd "/Users/vphson/Rockship /blogs-ai/blog"

# Chạy dev server
pnpm dev
# hoặc
npm run dev
```

Truy cập:
- **Blog**: http://localhost:3000
- **Admin**: http://localhost:3000/admin

---

## Phần 8: Deploy lên Vercel

### 8.1 Push code lên GitHub

```bash
cd "/Users/vphson/Rockship /blogs-ai/blog"

# Init git
git init
git add .
git commit -m "Initial commit: Next.js + Supabase blog"

# Create repo trên GitHub, sau đó:
git remote add origin https://github.com/username/blog.git
git branch -M main
git push -u origin main
```

### 8.2 Deploy lên Vercel

1. Vào https://vercel.com
2. Import GitHub repository
3. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Deploy!

---

## Phần 9: Next Steps

Sau khi cơ bản chạy được:

1. **Thêm authentication** (Supabase Auth)
2. **Tạo admin CRUD** cho posts
3. **Thêm Markdown editor** (Tiptap)
4. **Upload ảnh** (Supabase Storage)
5. **SEO optimization** (metadata, sitemap)
6. **Analytics** (Vercel Analytics hoặc Google Analytics)

---

## Notes

- Supabase Free tier: 500MB database, 1GB bandwidth/tháng
- Next.js trên Vercel: Free tier đủ dùng cho blog cá nhân
- Backup: Supabase tự backup, có thể export dữ liệu bất cứ lúc nào

---

**Chúc bạn xây được blog đẹp như ý!** 🕊️
