# Blog Thiền - Personal Blog Platform

A modern, minimalist personal blog built with Next.js 15, Supabase, and TypeScript. Features a Zen-inspired design theme with support for multiple themes and a clean reading experience.

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript 5.x
- **Database**: Supabase (PostgreSQL)
- **Styling**: Tailwind CSS
- **Editor**: TipTap (rich text editor)
- **UI Components**: Custom design system with theme switching

## Features

- ✅ **Zen Theme**: Warm, book-like aesthetic inspired by traditional Vietnamese minimalism
- ✅ **Theme System**: Runtime theme switching with Design Tokens
- ✅ **Rich Text Editor**: TipTap editor with formatting, lists, code blocks, tables, images, and more
- ✅ **Category System**: Organize posts by categories
- ✅ **Search**: Full-text search across posts
- ✅ **Pagination**: Efficient pagination for large datasets
- ✅ **Type Safety**: Zod schema validation at runtime
- ✅ **Authentication**: Supabase Auth for admin users
- ✅ **SEO**: Optimized metadata and semantic HTML

## Project Structure

```
lib/
├── design/              # Design system
│   ├── tokens/         # Theme tokens (Zen, Modern)
│   └── providers/      # ThemeProvider
├── formatters/         # Date & content formatting
├── schemas/           # Zod validation schemas
├── blog/              # Blog domain logic
│   ├── actions.ts     # Server actions (mutations)
│   └── queries.ts     # Database queries
├── supabase/          # Supabase client
└── types/             # TypeScript types

components/
├── ui/                # Design system components
│   ├── Button.tsx
│   ├── Badge.tsx
│   ├── Card.tsx
│   ├── Input.tsx
│   ├── BackButton.tsx
│   └── PageHeader.tsx
├── public/            # Public-facing components
└── admin/             # Admin components

app/
├── (public)/          # Public routes
└── (admin)/           # Admin routes
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn or pnpm
- Supabase account

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd blogs-ai
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Update `.env` with your Supabase credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### Database Setup

1. Create a new project in [Supabase](https://supabase.com)
2. Run the migration file:
```sql
-- File: supabase/migrations/20240110000000_categories_with_post_count.sql
```

3. Create tables using the schema in `specs/001-personal-blog/data-model.md`

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Build

```bash
npm run build
```

### Deploy

```bash
npm run start
```

## Design System

This project uses a custom Design System with theme switching capability.

### Available Themes

- **Zen Theme**: Warm, book-like aesthetic with serif fonts
- **Modern Theme**: Clean, modern look with sans-serif fonts

### Adding a New Theme

See [DESIGN_SYSTEM.md](DESIGN_SYSTEM.md) for detailed instructions.

## Documentation

- [DESIGN_SYSTEM.md](DESIGN_SYSTEM.md) - Design System documentation
- [THEME.md](THEME.md) - Theme documentation

## Environment Setup

### Required Environment Variables

Create a `.env` file in the project root with the following variables:

```env
# Supabase (Required)
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key

# Optional: Sentry (Error Tracking)
SENTRY_DSN=your-sentry-dsn
SENTRY_AUTH_TOKEN=your-sentry-auth-token

# Optional: Google Analytics
NEXT_PUBLIC_GA_ID=your-google-analytics-id

# Environment
NODE_ENV=development
```

### Getting Supabase Credentials

1. Go to [Supabase](https://supabase.com) and create a new project
2. Navigate to **Project Settings** → **API**
3. Copy the following:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon/public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Database Migration

After setting up Supabase, run the migration to create the required tables:

1. Go to **SQL Editor** in your Supabase dashboard
2. Create a new query and paste the contents of:
   - `supabase/migrations/20240110000000_categories_with_post_count.sql`
3. Run the query to create tables and functions

### Creating an Admin User

1. Go to **Authentication** → **Users** in Supabase
2. Click "Add user" and create a new user
3. Set the user's email as confirmed
4. This user can now access the admin panel at `/admin`

---

## Testing

This project uses Vitest for unit testing and Playwright for E2E testing.

### Running Tests

```bash
# Run all unit tests
npm run test:unit

# Run unit tests in watch mode
npm run test:watch

# Run unit tests with coverage
npm run test:coverage

# Run E2E tests
npm run test:e2e

# Run all tests (unit + E2E)
npm run test

# Run TypeScript check
npm run type-check

# Run ESLint
npm run lint
```

### Test Structure

```
tests/
├── unit/                 # Unit tests (Vitest)
│   ├── components/       # Component tests
│   ├── lib/              # Library function tests
│   ├── setup.ts          # Test configuration
│   └── mocks/            # Mock implementations
└── e2e/                  # E2E tests (Playwright)
    ├── create-post.spec.ts
    ├── search.spec.ts
    └── admin-posts-list.spec.ts
```

### Writing Unit Tests

```typescript
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MyComponent } from '@/components/MyComponent'

describe('MyComponent', () => {
  it('should render correctly', () => {
    render(<MyComponent />)
    expect(screen.getByText('Hello')).toBeInTheDocument()
  })
})
```

### Test Coverage

The project maintains high test coverage. To view coverage reports:

```bash
npm run test:coverage
open coverage/index.html
```

---

## Deployment

### Deploying to Vercel

1. **Install Vercel CLI** (optional):
```bash
npm i -g vercel
```

2. **Deploy**:
```bash
vercel
```

3. **Set Environment Variables** in Vercel:
   - Go to **Settings** → **Environment Variables**
   - Add all required variables from the `.env` file

4. **Deploy**:
   - Connect your GitHub repository to Vercel
   - Vercel will automatically deploy on push to `main` branch
   - Configure build settings:
     - **Build Command**: `npm run build`
     - **Output Directory**: `.next`
     - **Install Command**: `npm install`

### Deploying to Other Platforms

#### Docker

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

Build and run:
```bash
docker build -t blog-zen .
docker run -p 3000:3000 -e NEXT_PUBLIC_SUPABASE_URL=... -e NEXT_PUBLIC_SUPABASE_ANON_KEY=... blog-zen
```

#### Static Export (Optional)

For static hosting, configure `next.config.js`:

```javascript
module.exports = {
  output: 'export',
}
```

Then build:
```bash
npm run build
# Output in 'out' directory
```

### CI/CD

The project includes GitHub Actions workflows for CI/CD:

- `.github/workflows/ci.yml` - Runs tests, linting, and build on every PR
- `.github/workflows/deploy.yml` - Automated deployment (configure with your platform)

### Environment-Specific Configuration

#### Development
```bash
npm run dev
```

#### Production
```bash
npm run build
npm run start
```

#### Monitoring

- **Vercel Analytics**: Integrated for performance monitoring
- **Sentry**: Configure `SENTRY_DSN` for error tracking
- **Google Analytics**: Configure `NEXT_PUBLIC_GA_ID` for user analytics

---

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript check
- `npm run test` - Run all tests
- `npm run test:unit` - Run unit tests
- `npm run test:watch` - Run unit tests in watch mode
- `npm run test:coverage` - Run tests with coverage report
- `npm run test:e2e` - Run E2E tests

## License

MIT

## Credits

Built with ❤️ using Next.js, Supabase, and Tailwind CSS.
