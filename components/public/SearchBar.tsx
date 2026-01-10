'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Search, X } from 'lucide-react'

export function SearchBar() {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  // Handle keyboard shortcut (Ctrl/Cmd + K)
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault()
      setIsOpen(true)
      inputRef.current?.focus()
    }
    if (e.key === 'Escape') {
      setIsOpen(false)
      inputRef.current?.blur()
    }
  }, [])

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      router.push(`/tim-kiem?q=${encodeURIComponent(query.trim())}`)
      setIsOpen(false)
      setQuery('')
    }
  }

  const handleClear = () => {
    setQuery('')
    inputRef.current?.focus()
  }

  return (
    <div className="relative">
      {/* Search Button (collapsed state) - Zen minimal style */}
      {!isOpen && (
        <button
          onClick={() => {
            setIsOpen(true)
            setTimeout(() => inputRef.current?.focus(), 100)
          }}
          className="flex items-center gap-2 border border-zen-border px-4 py-2 text-sm text-zen-secondary transition-all duration-300 hover:border-zen-accent hover:text-zen-accent bg-transparent"
          aria-label="Tìm kiếm"
        >
          <Search className="h-4 w-4" />
          <span className="hidden sm:inline">Tìm kiếm</span>
          <kbd className="ml-auto hidden border border-zen-border px-1.5 py-0.5 text-xs text-zen-muted sm:inline-block">
            ⌘K
          </kbd>
        </button>
      )}

      {/* Search Input (expanded state) - Zen minimal style */}
      {isOpen && (
        <form onSubmit={handleSubmit} className="relative">
          <div className="relative flex items-center">
            <Search className="absolute left-3 h-4 w-4 text-zen-muted" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Tìm kiếm bài viết..."
              className="zen-input w-full py-2 pl-10 pr-20 text-sm"
              autoComplete="off"
            />
            <div className="absolute right-2 flex items-center gap-1">
              {query && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="rounded p-1 text-zen-muted hover:text-zen-secondary transition-colors duration-200"
                  aria-label="Xóa"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false)
                  setQuery('')
                }}
                className="rounded p-1 text-zen-muted hover:text-zen-secondary transition-colors duration-200"
                aria-label="Đóng"
              >
                <X className="h-4 w-4" />
              </button>
              <kbd className="border border-zen-border px-1.5 py-0.5 text-xs text-zen-muted">
                Enter
              </kbd>
            </div>
          </div>
        </form>
      )}
    </div>
  )
}
