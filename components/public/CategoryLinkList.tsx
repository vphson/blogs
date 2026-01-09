import Link from 'next/link'
import type { CategoryWithPostCount } from '@/lib/types/blog'

interface CategoryLinkListProps {
  categories: CategoryWithPostCount[]
  title?: string
  showEmpty?: boolean
}

export function CategoryLinkList({
  categories,
  title = 'Danh mục',
  showEmpty = false,
}: CategoryLinkListProps) {
  // Filter out categories with no posts if showEmpty is false
  const displayCategories = showEmpty
    ? categories
    : categories.filter((cat) => cat.post_count > 0)

  if (!displayCategories || displayCategories.length === 0) {
    return null
  }

  return (
    <div className="border-t border-b border-gray-200 py-8">
      <h3 className="mb-6 text-center font-display text-sm tracking-widest uppercase text-gray-600">
        {title}
      </h3>
      <ul className="flex flex-wrap items-center justify-center gap-4 md:gap-6">
        {displayCategories.map((category) => (
          <li key={category.id}>
            <Link
              href={`/danh-muc/${category.slug}`}
              className="group flex items-center gap-2 text-sm text-gray-600 hover:text-amber-700 transition-colors duration-200"
            >
              <span className="font-body">{category.name}</span>
              <span className="text-xs text-gray-400 group-hover:text-amber-700 transition-colors duration-200">
                {category.post_count}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
