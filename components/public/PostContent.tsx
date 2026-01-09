'use client'

import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import DOMPurify from 'isomorphic-dompurify'

// Allowed HTML tags for TipTap content
const ALLOWED_TAGS = [
  'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
  'strong', 'em', 'u', 's', 'code',
  'ul', 'ol', 'li',
  'a', 'img', 'blockquote',
  'br', 'hr',
  'div', 'span'
]

const ALLOWED_ATTR = ['href', 'src', 'alt', 'class', 'title', 'target', 'rel']

interface PostContentProps {
  content: string
}

// Check if content looks like HTML
function isHtmlContent(content: string): boolean {
  const trimmed = content.trim()
  return trimmed.startsWith('<') && trimmed.endsWith('>')
}

export function PostContent({ content }: PostContentProps) {
  // Check if content is HTML from TipTap
  if (isHtmlContent(content)) {
    // Sanitize HTML to prevent XSS attacks
    const sanitized = DOMPurify.sanitize(content, {
      ALLOWED_TAGS,
      ALLOWED_ATTR,
    })

    return (
      <div dangerouslySetInnerHTML={{ __html: sanitized }} />
    )
  }

  // Fallback: render as Markdown
  return (
    <div>
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
    </div>
  )
}
