# Implementation Plan: Personal Blog Refactor

**Branch**: `001-personal-blog` | **Date**: 2026-01-10 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-personal-blog/spec.md`

**Note**: This plan focuses on refactoring the existing blog codebase for production-readiness, with emphasis on testing, maintainability, and senior-level code organization.

## Summary

**Primary Requirement**: Refactor the existing personal blog codebase (Next.js 15 + React 19 + TypeScript) to meet production-ready standards with comprehensive testing, proper error handling, and maintainable architecture.

**Technical Approach**:
- Preserve existing design system and domain-driven architecture
- Add comprehensive unit test coverage (Vitest)
- Implement structured error handling with error boundaries
- Add loading states and suspense boundaries for better UX
- Set up production monitoring (error tracking, analytics)
- Refactor large components for better maintainability
- Add SEO optimization and API documentation

## Technical Context

**Language/Version**: TypeScript 5.7.2, Next.js 15.1.0, React 19.0.0, Node.js 18+
**Primary Dependencies**:
- Frontend: Next.js 15 (App Router), React 19, Tailwind CSS 3.4
- Database: Supabase (PostgreSQL), @supabase/ssr ^0.5.0
- Editor: TipTap 3.15.3 (ProseMirror-based rich text editor)
- Validation: Zod 4.3.5
- Testing: Vitest 1.0.0 (unit), Playwright 1.40.0 (E2E)
**Storage**: Supabase PostgreSQL database + Storage (images)
**Testing**: Vitest (unit tests - NEEDS IMPLEMENTATION), Playwright (E2E - partially implemented)
**Target Platform**: Vercel (production deployment), web browser (desktop + mobile responsive)
**Project Type**: Single full-stack web application (Next.js with server components + server actions)
**Performance Goals**:
- Page load < 3s on 3G connection (SC-007)
- Search response < 2s with 1000 posts (SC-003)
- Support 1000 concurrent users (SC-004)
- Post creation workflow < 5 minutes (SC-002)
**Constraints**:
- Vietnamese language only (no multi-language in phase 1)
- Single admin user (no multi-user system)
- No comments or social features (read-only public users)
- Zen/minimalist design aesthetic
- WCAG AA accessibility (SC-006)
**Scale/Scope**:
- ~5,190 LOC of existing application code
- 8 E2E test files (Playwright)
- 0 unit tests (Vitest configured but empty)
- Single blog application with admin panel

### Current Codebase Assessment

**Strengths**:
- Excellent design system with theme tokens (Zen/Modern themes)
- Good domain-driven design (separate queries/actions in `/lib/blog/`)
- Type-safe with Zod validation
- Modern stack (Next.js 15 App Router, React 19)
- Proper Supabase integration with auth
- Vietnamese localization support

**Critical Gaps**:
1. **No unit tests** - Critical production gap
2. **No error boundaries** - Poor error handling
3. **No loading states** - Poor UX during data fetching
4. **No error tracking** - No production monitoring
5. **No SEO optimization** - Missing sitemap, structured data, OG tags
6. **No CI/CD pipeline** - Manual deployment

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

**Status**: No project constitution exists yet. The constitution template is empty.

**Recommendation**: Before proceeding, establish project constitution with core principles for:
- Testing standards (TDD requirements, coverage thresholds)
- Code review process
- Deployment policies
- Quality gates

*Since no constitution exists, this gate is waived for this refactor. However, a constitution should be created as part of this refactor.*

## Project Structure

### Documentation (this feature)

```text
specs/001-personal-blog/
├── spec.md              # Feature specification
├── plan.md              # This file (refactor plan)
├── research.md          # Phase 0 output (research findings)
├── data-model.md        # Phase 1 output (data model)
├── quickstart.md        # Phase 1 output (dev setup guide)
├── contracts/           # Phase 1 output (API contracts)
│   ├── blog-api.ts      # Blog query/action contracts
│   └── component-props.ts # Component prop type contracts
└── tasks.md             # Phase 2 output (NOT created by this command)
```

### Source Code (repository root)

**Current Structure (to be preserved and enhanced)**:

```text
# Single full-stack Next.js application
app/                          # Next.js 15 App Router
├── (public)/                 # Public routes
│   ├── page.tsx             # Home page (post list)
│   ├── posts/               # Post detail pages
│   ├── categories/          # Category listing
│   └── search/              # Search functionality
├── (admin)/                  # Protected admin routes
│   └── admin/               # Admin dashboard
├── auth/                     # Authentication routes
├── api/                      # API routes (if needed)
└── layout.tsx               # Root layout

components/                   # React components
├── ui/                      # Design system components (Button, Card, etc.)
├── public/                  # Public-facing business components
└── admin/                   # Admin business components

lib/                         # Core business logic & utilities
├── design/                  # Design system (tokens, providers)
├── formatters/              # Date & content formatting
├── schemas/                 # Zod validation schemas
├── blog/                    # Blog domain logic
│   ├── queries.ts           # Read operations
│   └── actions.ts           # Write operations (server actions)
├── supabase/                # Database client setup
├── types/                   # TypeScript type definitions
└── utils.ts                 # Utility functions

hooks/                       # Custom React hooks

tests/                       # Test files
├── unit/                    # Vitest unit tests (TO BE ADDED)
│   ├── lib/                 # Utility tests
│   ├── components/          # Component tests
│   └── blog/                # Domain logic tests
└── e2e/                     # Playwright E2E tests
    ├── test-login.spec.ts
    ├── view-post.spec.ts
    └── ...

supabase/                    # Database migrations
└── migrations/              # SQL migration files
```

**Structure Decision**: Preserve the existing Next.js 15 App Router structure as it follows modern best practices. The domain-driven design in `/lib/blog/` (separate queries/actions) is excellent and should be maintained. The design system in `/lib/design/` and `/components/ui/` is well-architected and should be preserved.

**Key refactoring areas**:
1. Add comprehensive unit tests in `tests/unit/`
2. Add error boundary components in `/components/ui/`
3. Add loading/skeleton components in `/components/ui/`
4. Extract error handling utilities in `/lib/errors/`
5. Add API documentation in `/docs/api/`
6. Add CI/CD configuration (`.github/workflows/`)

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

*No constitution exists, so no violations to track.*

---

## Refactoring Priorities

### High Priority (Must Have)

1. **Unit Test Coverage** (Critical)
   - Add Vitest unit tests for utilities (`/lib/utils.ts`, `/lib/formatters/`)
   - Add component tests for UI components
   - Add tests for blog queries and actions
   - Target: 80%+ code coverage

2. **Error Handling** (Critical)
   - Create error boundary components
   - Implement structured error types
   - Add error tracking (Sentry or similar)
   - Improve error messages in actions

3. **Loading States** (High UX Impact)
   - Add React Suspense boundaries
   - Create skeleton components
   - Add optimistic UI updates for actions
   - Implement proper loading states

4. **Environment Validation** (Production Safety)
   - Add environment variable validation with Zod
   - Validate at build time
   - Provide clear error messages for missing env vars

### Medium Priority (Should Have)

5. **SEO Optimization**
   - Add `next-seo` package
   - Implement dynamic metadata for posts
   - Generate sitemap.xml
   - Add structured data (JSON-LD)
   - Add robots.txt

6. **Monitoring & Analytics**
   - Set up Vercel Analytics
   - Add error tracking (Sentry)
   - Add user analytics (PostHog or Plausible)
   - Set up logging

7. **CI/CD Pipeline**
   - Create GitHub Actions workflow
   - Run tests on PR
   - Run linting on PR
   - Auto-deploy to staging on merge

8. **Component Refactoring**
   - Extract modals from TipTapEditor (348 lines)
   - Break down large components
   - Improve component composition

9. **API Documentation**
   - Document all blog queries
   - Document all server actions
   - Add JSDoc comments to public functions

### Low Priority (Nice to Have)

10. **Storybook**
    - Add Storybook for component documentation
    - Create stories for UI components
    - Visual regression testing

11. **Performance Optimization**
    - Add code splitting strategies
    - Optimize images further
    - Add caching strategies
    - Implement ISR for posts

12. **Security Enhancements**
    - Add rate limiting
    - Verify RLS policies
    - Add CSRF protection
    - Security audit

---

## Success Criteria

The refactor will be considered successful when:

1. **Testing**: 80%+ unit test coverage, all tests passing
2. **Error Handling**: Error boundaries catch all errors, proper error tracking in place
3. **Performance**: All pages load in < 3s on 3G
4. **Code Quality**: ESLint passes, TypeScript strict mode passes
5. **Documentation**: API documented, README updated
6. **CI/CD**: Automated tests run on PR, auto-deploy to staging
7. **SEO**: Sitemap generated, metadata complete, structured data present
