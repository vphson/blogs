import Link from 'next/link'
import type { Category } from '@/lib/types/blog'

interface CategoryBadgeProps {
  category: Category
  variant?: 'default' | 'muted'
  linkable?: boolean
}

export function CategoryBadge({ category, variant = 'default', linkable = true }: CategoryBadgeProps) {
  const baseClasses = 'inline-flex items-center text-xs font-medium transition-all duration-200 font-body'

  const variantClasses = {
    default:
      'text-amber-700 hover:text-amber-900',
    muted: 'text-gray-500 hover:text-gray-700',
  }

  const content = category.name

  if (!linkable) {
    return <span className={`${baseClasses} ${variantClasses[variant]}`}>{content}</span>
  }

  return (
    <Link
      href={`/danh-muc/${category.slug}`}
      className={`${baseClasses} ${variantClasses[variant]} underline decoration-1 underline-offset-2`}
    >
      {content}
    </Link>
  )
}
