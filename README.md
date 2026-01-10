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

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## License

MIT

## Credits

Built with ❤️ using Next.js, Supabase, and Tailwind CSS.
