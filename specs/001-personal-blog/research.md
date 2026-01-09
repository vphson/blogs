# Research: Personal Blog for Buddhist Practitioner

**Feature**: 001-personal-blog
**Date**: 2025-01-07
**Purpose**: Document technology decisions and research for implementation

## Overview

This document captures the research and decision-making process for technology choices in building a personal blog for a Buddhist practitioner. The blog requires a minimalist Zen design, content management, categorization, search, and comment functionality.

## Technology Decisions

### 1. Framework: Next.js 15 (App Router)

**Decision**: Next.js 15 with App Router architecture

**Rationale**:
- User explicitly requested Next.js (React)
- App Router provides excellent SEO out of the box (critical for blog discoverability)
- Built-in image optimization, font optimization, and route prefetching
- Server-side rendering (SSR) and static site generation (SSG) for optimal performance
- API routes allow full-stack development in one codebase
- Strong community support and long-term viability
- Vercel deployment integration (performance goals: <3s load on 3G)

**Alternatives Considered**:
- **Astro**: Better for content-heavy static sites, but less flexible for dynamic features like comments
- **Pages Router**: Previous Next.js pattern, but App Router is the future direction
- **Gatsby**: Good SSG, but build times increase significantly with content growth

**Best Practices**:
- Use Server Components by default, Client Components only when needed
- Leverage `generateStaticParams` for static post pages
- Implement proper meta tags for SEO and social sharing

---

### 2. Database: PostgreSQL with Prisma ORM

**Decision**: PostgreSQL database accessed via Prisma ORM

**Rationale**:
- PostgreSQL is robust, reliable, and widely supported
- Full-text search capabilities built-in (meets <2s search requirement)
- ACID compliance ensures data integrity
- Prisma provides type-safe database access with excellent TypeScript integration
- Migrations are version-controlled and reversible
- Easy to deploy on Vercel with managed Postgres (Neon, Supabase, or Vercel Postgres)

**Alternatives Considered**:
- **MongoDB**: NoSQL flexibility but less structured for blog entities
- **SQLite**: Simple but doesn't scale well for concurrent writes
- **Direct SQL**: More control but Prisma reduces boilerplate and prevents SQL injection

**Best Practices**:
- Use Prisma Client for all database operations
- Implement soft deletes for posts/comments instead of hard deletes
- Use transactions for multi-step operations
- Index frequently queried fields (slug, status, category)

---

### 3. Authentication: NextAuth.js v5 (Auth.js)

**Decision**: NextAuth.js v5 for authentication

**Rationale**:
- Official authentication library for Next.js
- Supports session-based auth (JWT + database sessions)
- Built-in CSRF protection
- Easy integration with Prisma
- Supports credential-based login (email/password) for admin
- Can extend to OAuth providers later if needed

**Alternatives Considered**:
- **Custom implementation**: More control but security risks
- **Lucia**: Lightweight but less Next.js-specific documentation
- **Clerk**: Excellent UX but adds external dependency and cost

**Best Practices**:
- Use HTTPS-only cookies for session tokens
- Implement rate limiting on login attempts
- Hash passwords with bcrypt (cost factor 12+)
- Secure admin routes with middleware

---

### 4. UI Components: Radix UI + Tailwind CSS

**Decision**: Radix UI primitives styled with Tailwind CSS

**Rationale**:
- **Radix UI**: Unstyled, accessible component primitives (meets WCAG AA requirement)
  - Dialogs, dropdowns, popovers, toasts
  - Keyboard navigation and screen reader support built-in
  - No enforced styling - full design control for Zen aesthetic
- **Tailwind CSS**: Utility-first CSS framework
  - Rapid development with consistent design tokens
  - Excellent responsive design utilities (mobile-first approach)
  - Purge unused CSS for small bundle sizes
  - Easy to implement custom color palette for Zen aesthetic

**Alternatives Considered**:
- **shadcn/ui**: Built on Radix + Tailwind but more opinionated
- **Chakra UI**: Good defaults but harder to customize for unique Zen design
- **Mantine**: Comprehensive but heavier bundle size

**Best Practices**:
- Create custom design tokens for color palette (soft, neutral tones)
- Use CSS variables for theming
- Implement focus states for accessibility
- Test with screen readers and keyboard navigation

---

### 5. Rich Text Editor: Tiptap

**Decision**: Tiptap for markdown-based content editing

**Rationale**:
- Modern, headless editor built on ProseMirror
- Markdown output (portable, version-controllable)
- Extensible with custom extensions
- Excellent TypeScript support
- Lightweight compared to alternatives like TinyMCE or CKEditor
- Supports collaborative editing if needed later

**Alternatives Considered**:
- **Simple textarea**: Too basic for a good writing experience
- **Markdown-it preview**: Requires separate edit/preview modes
- **Lexical**: Good but newer, less mature ecosystem

**Best Practices**:
- Implement auto-save for drafts (FR-018)
- Support keyboard shortcuts for common formatting
- Preview mode for seeing final output
- Export/import markdown files

---

### 6. Search Implementation: PostgreSQL Full-Text Search

**Decision**: Native PostgreSQL full-text search via Prisma

**Rationale**:
- Built-in capability (no additional service needed)
- Fast enough for <2s search with 1000 posts
- Supports Vietnamese language with proper configuration
- Relevance ranking included
- No additional infrastructure complexity

**Alternatives Considered**:
- **Algolia/MeiliSearch**: More features but adds external dependency and cost
- **Elasticsearch**: Overkill for this scale
- **Client-side filtering**: Won't scale to 1000+ posts

**Best Practices**:
- Create GIN index on post content for fast search
- Use `tsvector` for Vietnamese text search
- Implement search result highlighting
- Cache common search queries

---

### 7. Image Storage: Vercel Blob Storage

**Decision**: Vercel Blob Storage with Next.js Image component

**Rationale**:
- Native integration with Vercel deployment
- Automatic optimization (WebP, AVIF formats)
- Responsive images with srcset
- Simple API for uploads
- CDN delivery included
- Cost-effective for personal blog scale

**Alternatives Considered**:
- **Cloudinary**: More features but higher cost
- **AWS S3**: Powerful but more complex setup
- **Local storage**: Not scalable across serverless instances

**Best Practices**:
- Compress images before upload
- Generate blur placeholders for LCP optimization
- Implement lazy loading for below-fold images
- Store image metadata in database

---

### 8. Testing Framework: Jest + Playwright

**Decision**: Jest for unit/integration, Playwright for E2E

**Rationale**:
- **Jest + React Testing Library**:
  - Fast unit tests for components and utilities
  - Testing Library encourages user-centric tests
  - Good TypeScript integration
- **Playwright**:
  - Cross-browser E2E testing
  - Fast and reliable compared to Cypress
  - Good for critical user flows (reading posts, admin actions)

**Alternatives Considered**:
- **Vitest**: Faster but Jest is more mature
- **Cypress**: More popular but slower than Playwright

**Best Practices**:
- Test user behavior, not implementation details
- Focus on critical paths (P1 user stories)
- Mock external dependencies (database, email)
- Run E2E tests in CI before deployment

---

### 9. Deployment: Vercel

**Decision**: Deploy to Vercel platform

**Rationale**:
- Created by Next.js team (best integration)
- Automatic preview deployments for pull requests
- Edge network for global CDN
- Serverless functions for API routes
- Zero-config deployment from Git
- Free tier sufficient for personal blog

**Alternatives Considered**:
- **Netlify**: Good but Next.js support slightly behind Vercel
- **Self-hosted**: More control but requires DevOps overhead

**Best Practices**:
- Use environment variables for sensitive data
- Enable automatic deployments
- Set up custom domain
- Monitor build times and performance

---

## Design System: Zen Aesthetic

### Color Palette

Based on FR-016 (màu sắc nhẹ nhàng, phù hợp tinh thần thiền):

```css
--color-bg-primary: #FAF9F6;    /* Off-white */
--color-bg-secondary: #F5F5F0;  /* Warm gray */
--color-text-primary: #4A4A4A;  /* Soft charcoal */
--color-text-secondary: #6B6B6B; /* Medium gray */
--color-accent: #8B9A6D;        /* Muted sage green */
--color-accent-light: #D4DDD0;  /* Light sage */
--color-border: #E8E8E8;        /* Subtle border */
```

### Typography

Based on FR-015 (font chữ dễ đọc, hỗ trợ tiếng Việt):

- **Body**: Inter or Noto Sans Vietnamese (16px base, 1.6 line-height)
- **Headings**: Merriweather or Noto Serif Vietnamese
- **Monospace**: JetBrains Mono (for code blocks)

### Spacing

Based on FR-017 (nhiều khoảng trắng để tạo cảm giác bình an):

- Base unit: 8px
- Section spacing: 64px (8 units)
- Container max-width: 720px for optimal reading

---

## Performance Considerations

To meet success criteria (SC-001 to SC-008):

1. **Page Load** (<3s on 3G):
   - Static generation for post pages
   - Image optimization with Next.js Image
   - Font optimization with `next/font`
   - Code splitting by route

2. **Search Speed** (<2s with 1000 posts):
   - Database indexing on search fields
   - Result pagination (10-20 per page)
   - Debounce search input

3. **Concurrent Users** (1000 simultaneous):
   - Serverless auto-scaling
   - Database connection pooling
   - Static asset CDN delivery

4. **Accessibility** (WCAG AA 90/100):
   - Semantic HTML elements
   - ARIA labels where needed
   - Keyboard navigation
   - Color contrast ratios >= 4.5:1

---

## Security Considerations

1. **Admin Protection**:
   - Middleware to protect admin routes
   - Session-based authentication
   - CSRF protection via NextAuth

2. **Data Protection**:
   - Hash passwords with bcrypt
   - HTTPS-only in production
   - Environment variables for secrets

---

## Migration Strategy

Since this is a new project, no migration needed. Initial setup:

1. Initialize Next.js project with TypeScript
2. Set up Prisma with PostgreSQL
3. Configure NextAuth for admin authentication
4. Create base components and layouts
5. Implement core features by priority (P1 → P2 → P3)

---

## Open Questions

None - all technical decisions finalized.
