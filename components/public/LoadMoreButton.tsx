'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'

interface LoadMoreButtonProps {
  nextCursor: string
  hasMore: boolean
}

export function LoadMoreButton({ nextCursor, hasMore }: LoadMoreButtonProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isLoading, setIsLoading] = useState(false)

  const handleClick = () => {
    if (!hasMore || isLoading) return

    setIsLoading(true)

    // Update URL with cursor parameter
    const params = new URLSearchParams(searchParams.toString())
    params.set('cursor', nextCursor)
    router.push(`/?${params.toString()}`)
  }

  if (!hasMore) {
    return null
  }

  return (
    <div className="flex justify-center mt-12">
      <button
        onClick={handleClick}
        disabled={isLoading}
        className="zen-btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? 'Đang tải...' : 'Xem thêm'}
      </button>
    </div>
  )
}
