# Design System Documentation

## Overview

This Design System provides a **scalable, maintainable approach to theming** that separates design tokens from implementation. This makes it easy to:

- **Switch themes** without rewriting components
- **Maintain consistency** across the application
- **Scale design changes** from a single source of truth

## Architecture

```
lib/design/
├── tokens/              # Design tokens (single source of truth)
│   ├── types.ts         # Token type definitions
│   ├── index.ts         # Token registry
│   └── themes/
│       ├── zen.ts       # Zen theme (warm, book-like)
│       └── modern.ts    # Modern theme (clean, cool)
├── providers/           # React context providers
│   ├── ThemeProvider.tsx
│   └── index.ts
└── README.md            # This file

components/
├── ui/                  # Design system components (using tokens)
│   ├── Button.tsx
│   ├── Badge.tsx
│   ├── Card.tsx
│   ├── Input.tsx
│   └── index.ts
├── public/              # Business components (can use UI components)
└── admin/               # Admin components (can use UI components)
```

## How to Add a New Theme

### Step 1: Define Theme Tokens

Create a new file in `lib/design/tokens/themes/`:

```typescript
// lib/design/tokens/themes/my-theme.ts
import type { ThemeTokens } from '../types'

export const myTheme: ThemeTokens = {
  name: 'myTheme',
  label: 'My Custom Theme',

  colors: {
    background: {
      DEFAULT: '#ffffff',
      surface: '#f8fafc',
      elevated: '#ffffff',
    },
    // ... define all tokens
  },

  typography: {
    fontFamily: {
      display: "'Font Name', sans-serif",
      body: "'Font Name', sans-serif",
      mono: "'JetBrains Mono', monospace",
    },
    // ... define all tokens
  },

  // ... define spacing, radius, shadows, etc.
}
```

### Step 2: Register Theme

Add to `lib/design/tokens/index.ts`:

```typescript
import { myTheme } from './themes/my-theme'

export const themeConfig: ThemeConfig = {
  defaultTheme: 'zen',
  themes: {
    zen: zenTheme,
    modern: modernTheme,
    myTheme: myTheme,  // Add here
  },
}
```

### Step 3: Update Types

Add to `lib/design/tokens/types.ts`:

```typescript
export type ThemeName = 'zen' | 'modern' | 'myTheme'
```

That's it! All components using `useTheme()` will automatically support the new theme.

## How to Use Design Tokens in Components

### Option 1: Using UI Components (Recommended)

Import pre-built components that already use design tokens:

```tsx
import { Button, Badge, Card } from '@/components/ui'

export function MyComponent() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Title</CardTitle>
      </CardHeader>
      <CardContent>
        <Button variant="primary">Click me</Button>
        <Badge variant="success">Active</Badge>
      </CardContent>
    </Card>
  )
}
```

### Option 2: Using Theme Hook

Access tokens directly in custom components:

```tsx
import { useTheme } from '@/lib/design/providers'

export function CustomComponent() {
  const { tokens, themeName, setTheme } = useTheme()

  return (
    <div
      style={{
        backgroundColor: tokens.colors.background.surface,
        color: tokens.colors.text.primary,
        padding: tokens.spacing.md,
        borderRadius: tokens.radius.md,
      }}
    >
      <h1 style={{ fontFamily: tokens.typography.fontFamily.display }}>
        Current theme: {themeName}
      </h1>
      <button onClick={() => setTheme('modern')}>Switch to Modern</button>
    </div>
  )
}
```

### Option 3: Using CSS Variables

For components that need CSS-only styling:

```tsx
// CSS Variables are automatically set by ThemeProvider
// Available: --background, --surface, --text-primary, --accent, etc.

export function StyledComponent() {
  return (
    <div className="my-component">
      Content here
    </div>
  )
}
```

```css
/* In your CSS file */
.my-component {
  background-color: var(--surface);
  color: var(--text-primary);
  border: 1px solid var(--border);
}
```

## Available Design Tokens

### Colors

| Token | Description | Example |
|-------|-------------|---------|
| `colors.background.DEFAULT` | Main background | `#fafaf9` |
| `colors.background.surface` | Secondary background | `#f5f5f4` |
| `colors.background.elevated` | Elevated/card background | `#ffffff` |
| `colors.text.primary` | Primary text | `#1c1917` |
| `colors.text.secondary` | Secondary text | `#44403c` |
| `colors.text.muted` | Muted text | `#78716c` |
| `colors.accent.DEFAULT` | Primary accent | `#78350f` |
| `colors.accent.hover` | Hover accent | `#92400e` |
| `colors.semantic.success` | Success state | `{ bg, text, border }` |
| `colors.semantic.warning` | Warning state | `{ bg, text, border }` |
| `colors.semantic.error` | Error state | `{ bg, text, border }` |
| `colors.semantic.info` | Info state | `{ bg, text, border }` |

### Typography

| Token | Description | Example |
|-------|-------------|---------|
| `typography.fontFamily.display` | Headings font | `'Playfair Display'` |
| `typography.fontFamily.body` | Body font | `'Merriweather'` |
| `typography.fontFamily.mono` | Monospace font | `'JetBrains Mono'` |

### Spacing

| Token | Value | Description |
|-------|-------|-------------|
| `spacing.xs` | `0.25rem` | 4px |
| `spacing.sm` | `0.5rem` | 8px |
| `spacing.md` | `1rem` | 16px |
| `spacing.lg` | `1.5rem` | 24px |
| `spacing.xl` | `2rem` | 32px |

### Border Radius

| Token | Value | Description |
|-------|-------|-------------|
| `radius.sm` | `0.125rem` | Small radius |
| `radius.DEFAULT` | `0.25rem` | Default radius |
| `radius.md` | `0.375rem` | Medium radius |
| `radius.lg` | `0.5rem` | Large radius |
| `radius.full` | `9999px` | Fully rounded |

## Theme Switching Example

Create a theme switcher component:

```tsx
'use client'

import { useTheme } from '@/lib/design/providers'

export function ThemeSwitcher() {
  const { themeName, setTheme, availableThemes } = useTheme()

  return (
    <div>
      <label>Current Theme: {themeName}</label>
      <select
        value={themeName}
        onChange={(e) => setTheme(e.target.value as any)}
      >
        {availableThemes.map(({ name, label }) => (
          <option key={name} value={name}>
            {label}
          </option>
        ))}
      </select>
    </div>
  )
}
```

## Migration Guide: Refactoring Existing Components

### Before (Hardcoded Colors)

```tsx
// ❌ Bad: Hardcoded Tailwind colors
export function PostCard({ post }) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      <h2 className="text-gray-900">{post.title}</h2>
      <p className="text-gray-600">{post.excerpt}</p>
      <button className="bg-amber-600 text-white px-4 py-2 rounded">
        Read More
      </button>
    </div>
  )
}
```

### After (Using Design Tokens)

```tsx
// ✅ Good: Using design tokens
import { Card, Button, Badge } from '@/components/ui'

export function PostCard({ post }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{post.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-zen-secondary">{post.excerpt}</p>
      </CardContent>
      <CardFooter>
        <Button variant="primary">Read More</Button>
      </CardFooter>
    </Card>
  )
}
```

## Best Practices

1. **Use UI Components First**: Prefer `Button`, `Badge`, `Card` etc. over custom styling
2. **Access Tokens via Hook**: For custom components, use `useTheme()` hook
3. **Don't Hardcode Values**: Never use hex colors, hardcoded spacing, or magic numbers
4. **Use Semantic Colors**: Use `semantic.success`, `semantic.error` etc. for status
5. **Test Theme Switching**: Ensure your component works with all available themes

## Troubleshooting

### Theme not applying to component

**Problem**: Component styles don't update when switching themes

**Solution**: Make sure the component is inside `ThemeProvider` and uses `useTheme()` hook or CSS variables

### Type errors when adding new theme

**Problem**: TypeScript error about theme name

**Solution**: Update `ThemeName` type in `lib/design/tokens/types.ts`

### Build error with CSS variables

**Problem**: Tailwind doesn't recognize custom CSS variables

**Solution**: Use inline styles or the `useTheme()` hook instead of Tailwind arbitrary values

## File Structure Summary

```
blog-ai/
├── app/
│   └── layout.tsx          # Wraps app with ThemeProvider
├── components/
│   ├── ui/                 # Design system components
│   │   ├── Button.tsx
│   │   ├── Badge.tsx
│   │   ├── Card.tsx
│   │   ├── Input.tsx
│   │   └── index.ts
│   ├── public/             # Public-facing components
│   └── admin/              # Admin components
├── lib/
│   └── design/
│       ├── tokens/         # Design tokens
│       │   ├── types.ts
│       │   ├── index.ts
│       │   └── themes/
│       │       ├── zen.ts
│       │       └── modern.ts
│       └── providers/
│           ├── ThemeProvider.tsx
│           └── index.ts
└── DESIGN_SYSTEM.md        # This file
```

## Resources

- [Current Theme: Zen](lib/design/tokens/themes/zen.ts) - Warm, book-like theme
- [Alternative: Modern](lib/design/tokens/themes/modern.ts) - Clean, modern theme
- [Token Types](lib/design/tokens/types.ts) - All available token definitions
