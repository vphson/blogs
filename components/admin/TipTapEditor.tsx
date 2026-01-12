'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import CharacterCount from '@tiptap/extension-character-count'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import {
  Bold,
  Italic,
  Strikethrough,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Link as LinkIcon,
  Image as ImageIcon,
  Undo,
  Redo
} from 'lucide-react'
import { useCallback, useState } from 'react'
import { cn } from '@/lib/utils'
import { ImageUploadModal } from './ImageUploadModal'
import { LinkInsertModal } from './LinkInsertModal'

interface TipTapEditorProps {
  initialContent?: string
  onChange?: (content: string) => void
  placeholder?: string
  readonly?: boolean
}

export function TipTapEditor({
  initialContent = '',
  onChange,
  placeholder = 'Bắt đầu viết bài của bạn...',
  readonly = false
}: TipTapEditorProps) {
  const [imageModalOpen, setImageModalOpen] = useState(false)
  const [linkModalOpen, setLinkModalOpen] = useState(false)

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3]
        }
      }),
      Placeholder.configure({
        placeholder: placeholder,
        emptyEditorClass: 'is-editor-empty'
      }),
      CharacterCount,
      Image.configure({
        inline: true,
        allowBase64: true
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-600 underline hover:text-blue-800'
        }
      })
    ],
    content: initialContent,
    editable: !readonly,
    editorProps: {
      attributes: {
        class: 'prose prose-stone max-w-none focus:outline-none min-h-[400px] px-6 py-4'
      }
    },
    onUpdate: ({ editor }) => {
      if (onChange) {
        onChange(editor.getHTML())
      }
    }
  })

  const addImage = useCallback((url: string) => {
    if (url && editor) {
      editor.chain().focus().setImage({ src: url }).run()
    }
  }, [editor])

  const addLink = useCallback((url: string) => {
    if (url && editor) {
      editor.chain().focus().setLink({ href: url }).run()
    }
  }, [editor])

  if (!editor) {
    return null
  }

  const MenuButton = ({
    onClick,
    active,
    disabled,
    children,
    title
  }: {
    onClick: () => void
    active?: boolean
    disabled?: boolean
    children: React.ReactNode
    title: string
  }) => (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={cn(
        'p-2 rounded-md transition-all flex items-center justify-center',
        active
          ? 'bg-amber-600 text-white shadow-sm'
          : 'text-gray-700 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed'
      )}
    >
      {children}
    </button>
  )

  const MenuSeparator = () => (
    <div className="w-px h-8 bg-gray-300 mx-1" />
  )

  return (
    <div className="w-full border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm">
      {/* Toolbar */}
      {!readonly && (
        <div className="border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white p-2">
          <div className="flex flex-wrap items-center gap-1">
            {/* Undo/Redo */}
            <div className="flex items-center gap-0.5 pr-2 border-r border-gray-300">
              <MenuButton
                onClick={() => editor.chain().focus().undo().run()}
                disabled={!editor.can().undo()}
                title="Hoàn tác (Cmd+Z)"
              >
                <Undo className="w-4 h-4" />
              </MenuButton>
              <MenuButton
                onClick={() => editor.chain().focus().redo().run()}
                disabled={!editor.can().redo()}
                title="Làm lại (Cmd+Shift+Z)"
              >
                <Redo className="w-4 h-4" />
              </MenuButton>
            </div>

            {/* Text Formatting */}
            <div className="flex items-center gap-0.5 pr-2 border-r border-gray-300">
              <MenuButton
                onClick={() => editor.chain().focus().toggleBold().run()}
                active={editor.isActive('bold')}
                title="In đậm (Cmd+B)"
              >
                <Bold className="w-4 h-4" />
              </MenuButton>
              <MenuButton
                onClick={() => editor.chain().focus().toggleItalic().run()}
                active={editor.isActive('italic')}
                title="In nghiêng (Cmd+I)"
              >
                <Italic className="w-4 h-4" />
              </MenuButton>
              <MenuButton
                onClick={() => editor.chain().focus().toggleStrike().run()}
                active={editor.isActive('strike')}
                title="Gạch ngang"
              >
                <Strikethrough className="w-4 h-4" />
              </MenuButton>
            </div>

            {/* Headings */}
            <div className="flex items-center gap-0.5 pr-2 border-r border-gray-300">
              <MenuButton
                onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                active={editor.isActive('heading', { level: 1 })}
                title="Tiêu đề 1"
              >
                <Heading1 className="w-4 h-4" />
              </MenuButton>
              <MenuButton
                onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                active={editor.isActive('heading', { level: 2 })}
                title="Tiêu đề 2"
              >
                <Heading2 className="w-4 h-4" />
              </MenuButton>
              <MenuButton
                onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                active={editor.isActive('heading', { level: 3 })}
                title="Tiêu đề 3"
              >
                <Heading3 className="w-4 h-4" />
              </MenuButton>
            </div>

            {/* Lists & Quote */}
            <div className="flex items-center gap-0.5 pr-2 border-r border-gray-300">
              <MenuButton
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                active={editor.isActive('bulletList')}
                title="Danh sách"
              >
                <List className="w-4 h-4" />
              </MenuButton>
              <MenuButton
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                active={editor.isActive('orderedList')}
                title="Danh sách đánh số"
              >
                <ListOrdered className="w-4 h-4" />
              </MenuButton>
              <MenuButton
                onClick={() => editor.chain().focus().toggleBlockquote().run()}
                active={editor.isActive('blockquote')}
                title="Trích dẫn"
              >
                <Quote className="w-4 h-4" />
              </MenuButton>
            </div>

            {/* Media */}
            <div className="flex items-center gap-0.5">
              <MenuButton
                onClick={() => setLinkModalOpen(true)}
                active={editor.isActive('link')}
                title="Thêm liên kết (Cmd+K)"
              >
                <LinkIcon className="w-4 h-4" />
              </MenuButton>
              <MenuButton
                onClick={() => setImageModalOpen(true)}
                title="Thêm ảnh"
              >
                <ImageIcon className="w-4 h-4" />
              </MenuButton>
            </div>
          </div>
        </div>
      )}

      {/* Link Modal */}
      <LinkInsertModal
        isOpen={linkModalOpen}
        onClose={() => setLinkModalOpen(false)}
        onAddLink={addLink}
      />

      {/* Image Modal */}
      <ImageUploadModal
        isOpen={imageModalOpen}
        onClose={() => setImageModalOpen(false)}
        onAddImage={addImage}
      />

      {/* Editor Content */}
      <EditorContent editor={editor} />

      {/* Stats Footer */}
      {!readonly && (
        <div className="border-t border-gray-200 bg-gray-50 px-6 py-2 flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-4">
            <span>
              {editor.storage.characterCount.words()} từ
            </span>
            <span>
              {editor.storage.characterCount.characters()} ký tự
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="hidden sm:inline">Đã lưu tự động</span>
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
          </div>
        </div>
      )}
    </div>
  )
}
