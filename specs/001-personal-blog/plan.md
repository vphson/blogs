# Implementation Plan: Personal Blog for Buddhist Practitioner

**Branch**: `001-personal-blog` | **Date**: 2025-01-07 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-personal-blog/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Build a personal blog for a Buddhist practitioner to share thoughts and experiences about life. The blog features a minimalist Zen design, content management with markdown/MDX support, categorization by topics (Dharma talks, meditation, life reflections), and search functionality. **Public users can read posts without authentication. Only the admin can log in to create and manage content.**

## Technical Context

**Language/Version**: TypeScript 5.x
**Primary Dependencies**: Next.js 15 (App Router), React 19, Supabase (Auth + Database + Storage)
**Storage**: PostgreSQL (Supabase managed) with Prisma ORM (local dev) + Supabase Client (runtime)
**Auth**: Supabase Auth (email/password for admin only)
**Testing**: Vitest, Playwright, React Testing Library
**Target Platform**: Vercel (serverless deployment)
**Project Type**: Web application (full-stack Next.js with Supabase BaaS)
**Performance Goals**: <3s page load on 3G, <2s search with 1000 posts, 1000 concurrent users
**Constraints**: WCAG AA accessibility, Vietnamese language support, responsive design
**Scale/Scope**: Single admin, ~100-1000 posts initially, ~100-1000 daily visitors
**Important**: Public users have NO authentication - read-only access

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

**Status**: No constitution defined - using template
- Project constitution is currently a template with no specific principles
- Following standard Next.js best practices and SpecKit conventions
- Consider running `/speckit.constitution` to define project principles if needed

## Project Structure

### Documentation (this feature)

```text
specs/001-personal-blog/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
# Web application structure
src/
├── app/                    # Next.js App Router
│   ├── (public)/          # Public routes (NO auth required)
│   │   ├── page.tsx       # Homepage - list of posts (SSG)
│   │   ├── posts/         # Post routes
│   │   │   └── [slug]/    # Individual post page (ISR)
│   │   ├── category/      # Category pages
│   │   │   └── [slug]/    # Posts by category (ISR)
│   │   └── search/        # Search page (CSR)
│   ├── (admin)/           # Admin routes (PROTECTED - Supabase Auth)
│   │   ├── login/
│   │   │   └── page.tsx   # Admin login page
│   │   └── admin/
│   │       ├── page.tsx   # Admin dashboard
│   │       └── posts/     # Post management
│   │           ├── page.tsx          # List all posts
│   │           ├── new/page.tsx      # Create new post
│   │           └── [id]/edit/page.tsx  # Edit post
│   └── api/               # API routes (admin only)
│       └── admin/         # Protected API routes
│           ├── posts/     # Posts CRUD
│           ├── upload/    # Image upload
│           └── categories/ # Category management
├── components/            # React components
│   ├── public/           # Public-facing components
│   │   ├── PostCard.tsx
│   │   ├── PostContent.tsx
│   │   ├── SearchBar.tsx
│   │   └── CategoryList.tsx
│   ├── admin/            # Admin components
│   │   ├── PostEditor.tsx
│   │   └── ImageUpload.tsx
│   └── ui/               # Reusable UI components (shadcn/ui)
├── lib/                   # Utility libraries
│   ├── supabase/         # Supabase client utilities
│   │   ├── server.ts     # Server client
│   │   ├── client.ts     # Browser client
│   │   └── middleware.ts # Auth middleware
│   ├── db/               # Database utilities (Prisma for local dev)
│   └── utils/            # Helper functions
└── styles/               # Global styles (TailwindCSS)

prisma/
├── schema.prisma         # Database schema (local dev only)
└── seed.ts              # Seed data (categories, sample posts)

public/
└── images/              # Static images

tests/
├── unit/                # Unit tests (Vitest)
├── integration/         # Integration tests
└── e2e/                 # End-to-end tests (Playwright)
```

**Structure Decision**: Using Next.js 15 App Router with Supabase as BaaS. Public routes use aggressive caching (SSG/ISR) for performance. Admin routes protected by Supabase Auth middleware. Prisma used for local development, Supabase Client in production.</think>

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

No violations - constitution is not defined. Following standard Next.js patterns.
