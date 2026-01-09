import { useEffect, useState } from 'react'

/**
 * Debounce a value
 * Useful for search inputs, slug generation, etc.
 */
export function useDebounce<T>(value: T, delay: number = 500): T {
  const [debounced, setDebounced] = useState(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebounced(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debounced
}
