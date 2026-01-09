import { CategoryBadge } from './CategoryBadge'
import type { Category } from '@/lib/types/blog'

interface CategoryListProps {
  categories: Category[]
  variant?: 'default' | 'muted'
  maxDisplay?: number
  linkable?: boolean
}

export function CategoryList({ categories, variant = 'default', maxDisplay, linkable }: CategoryListProps) {
  if (!categories || categories.length === 0) {
    return null
  }

  const displayCategories = maxDisplay ? categories.slice(0, maxDisplay) : categories
  const hasMore = maxDisplay && categories.length > maxDisplay

  return (
    <div className="flex flex-wrap gap-2">
      {displayCategories.map((category) => (
        <CategoryBadge key={category.id} category={category} variant={variant} linkable={linkable} />
      ))}
      {hasMore && (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium text-stone-500">
          +{categories.length - maxDisplay}
        </span>
      )}
    </div>
  )
}
