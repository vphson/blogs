# Zen Blog Theme System

A unified design system for the Zen Blog, built with CSS variables and Tailwind CSS.

## Design Philosophy

**Zen Theme Principles:**

1. **Simplicity (Đơn giản)**: Minimal elements, focus on content
2. **Stillness (Tịnh tĩnh)**: Limited animations, gentle transitions
3. **Clarity (Rõ ràng)**: High contrast, readable typography
4. **Warmth (Ấm áp)**: Warm paper tones, not cold sterile white
5. **Consistency (Đồng nhất)**: All pages follow same system

## Colors

### Background & Surface
- `bg-zen-bg` - Primary background (#fafaf9 - warm white paper)
- `bg-zen-surface` - Secondary background (#f5f5f4 - darker paper)
- `bg-zen-elevated` - Cards/raised elements (#ffffff - pure white)

### Text
- `text-zen-primary` - Primary text (#1c1917 - near black)
- `text-zen-secondary` - Secondary text (#44403c - dark warm gray)
- `text-zen-muted` - Muted text (#78716c - light gray)

### Accents & Borders
- `text-zen-accent` / `border-zen-accent` - Primary accent (#78350f - warm brown)
- `text-zen-accent-hover` - Hover state (#d97706 - amber 600)
- `border-zen-border` - Subtle borders (#e7e5e4)

## Typography

### Font Families
- `font-display` - Playfair Display (headings, titles)
- `font-body` - Merriweather (body text, content)

### Usage Examples
```tsx
<h1 className="font-display text-4xl">Heading</h1>
<p className="font-body text-base">Body text</p>
```

## Component Classes

### Container
```tsx
<div className="zen-container">
  {/* Centers content with max-w-2xl and horizontal padding */}
</div>
```

### Card
```tsx
<div className="zen-card">
  {/* White background, border, rounded corners, hover shadow */}
</div>
```

### Link
```tsx
<Link href="/" className="zen-link">
  {/* Underlined, secondary text, accent on hover */}
</Link>
```

### Input
```tsx
<input className="zen-input" />
{/* Full width, border, rounded, focus ring */}
```

### Badge
```tsx
<span className="zen-badge zen-badge-accent">
  Accent Badge
</span>
<span className="zen-badge zen-badge-muted">
  Muted Badge
</span>
```

## Animations

### Fade In
```tsx
<div className="animate-fade-in">
  {/* Fades in with slight upward movement */}
</div>
```

### Delays
```tsx
<div className="animate-fade-in delay-100">{/* 0.1s delay */}</div>
<div className="animate-fade-in delay-200">{/* 0.2s delay */}</div>
<div className="animate-fade-in delay-300">{/* 0.3s delay */}</div>
<div className="animate-fade-in delay-400">{/* 0.4s delay */}</div>
<div className="animate-fade-in delay-500">{/* 0.5s delay */}</div>
```

## Page Templates

### Standard Page Layout
```tsx
<main className="min-h-screen bg-zen-bg">
  <div className="zen-container py-12 md:py-16">
    {/* Navigation */}
    <nav className="mb-12">
      <Link href="/" className="zen-link">Trang chủ</Link>
    </nav>

    {/* Content */}
    <section>
      <h1 className="font-display text-4xl text-zen-primary">
        Page Title
      </h1>
    </section>
  </div>
</main>
```

### Post Detail Layout
```tsx
<main className="min-h-screen bg-zen-bg">
  <article className="zen-container py-12 md:py-16">
    <div className="prose prose-lg max-w-none
                prose-headings:font-display
                prose-headings:text-zen-primary
                prose-p:text-zen-secondary
                prose-a:text-zen-accent">
      {content}
    </div>
  </article>
</main>
```

## Color Usage Guidelines

### Background
- Use `bg-zen-bg` for page backgrounds
- Use `bg-zen-surface` for secondary sections or hover states
- Use `bg-zen-elevated` for cards and forms

### Text Hierarchy
1. **Primary text** (`text-zen-primary`): Headlines, titles, important info
2. **Secondary text** (`text-zen-secondary`): Body text, descriptions
3. **Muted text** (`text-zen-muted`): Meta info, timestamps, labels

### Accent Color
- Use `text-zen-accent` sparingly for emphasis
- Use for links, active states, and important CTAs
- Hover state: `text-zen-accent-hover`

## CSS Variables Reference

The theme is built on CSS variables defined in `app/globals.css`:

```css
:root {
  /* Colors */
  --paper-bg: #fafaf9;
  --paper-surface: #f5f5f4;
  --paper-elevated: #ffffff;
  --text-primary: #1c1917;
  --text-secondary: #44403c;
  --text-muted: #78716c;
  --accent-border: #e7e5e4;
  --accent-brown: #78350f;
  --accent-amber: #d97706;

  /* Typography */
  --font-display: 'Playfair Display', Georgia, serif;
  --font-body: 'Merriweather', Georgia, serif;

  /* Spacing */
  --spacing-header: 8rem;
  --spacing-section: 4rem;

  /* Border Radius */
  --radius-zen: 0.5rem;
}
```

## Migration Guide

### Converting Old Classes
- `bg-white` → `bg-zen-bg` or `bg-zen-elevated`
- `bg-gray-50` → `bg-zen-bg`
- `bg-gray-100` → `bg-zen-surface`
- `text-gray-900` → `text-zen-primary`
- `text-gray-600` → `text-zen-secondary`
- `text-gray-500` → `text-zen-muted`
- `text-amber-700` → `text-zen-accent`
- `border-gray-200` → `border-zen-border`
- `rounded-lg` → `rounded-zen`

### Container Pattern
```tsx
// Old
<div className="mx-auto max-w-2xl px-6">

// New
<div className="zen-container">
```

## Best Practices

1. **Always use zen-* classes** for consistency
2. **Limit accent color usage** - use sparingly for emphasis
3. **Maintain text hierarchy** - primary → secondary → muted
4. **Use proper spacing** - zen-container provides consistent padding
5. **Keep animations subtle** - use animate-fade-in for gentle transitions
6. **Ensure accessibility** - zen colors provide good contrast ratios

## File Structure

```
tailwind.config.ts     # Tailwind config with zen color palette
app/globals.css        # CSS variables and zen component utilities
THEME.md              # This documentation
components/public/    # Components using zen theme
app/(public)/         # Pages using zen theme
```

## Troubleshooting

### Styles not applying?
1. Check that `tailwind.config.ts` includes zen colors
2. Verify `app/globals.css` has @layer components with zen utilities
3. Ensure you're using `zen-*` not just `zen` (e.g., `text-zen-primary`)

### Build errors?
1. Run `npm run build` to check for undefined classes
2. Search for any remaining `gray-*` or `stone-*` colors in public pages
3. Check for `font-zen-display` → should be `font-display`

### Color inconsistencies?
1. Use dev tools to check computed CSS variables
2. Ensure all zen classes reference the same CSS variables
3. Check for hardcoded color values inline

---

**Last Updated**: 2026-01-09
**Version**: 1.0
