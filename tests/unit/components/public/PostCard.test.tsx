import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render } from '@testing-library/react';
import { screen } from '@testing-library/dom';
import { PostCard } from '@/components/public/PostCard';
import type { Post } from '@/lib/types/blog';

// Mock Next.js components
vi.mock('next/image', () => ({
  default: ({ alt, ...props }: any) => <img alt={alt} {...props} />,
}));

// Mock Next.js Link
vi.mock('next/link', () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}));

// Mock CategoryList
vi.mock('@/components/public/CategoryList', () => ({
  CategoryList: ({ categories, variant, linkable }: any) => (
    <div data-testid="category-list">
      {categories.map((c: any) => (
        <span key={c.id} data-category={c.slug}>
          {c.name}
        </span>
      ))}
    </div>
  ),
}));

// Mock formatters
vi.mock('@/lib/formatters', () => ({
  formatDate: (date: string) => '01/01/2024',
  calculateReadingTime: (content: string) => '5 phút đọc',
}));

describe('PostCard Component - User Story 1', () => {
  const mockPost: Post = {
    id: '1',
    title: 'Test Post Title',
    slug: 'test-post',
    content: 'Test content for the post',
    excerpt: 'This is a test excerpt',
    cover_image: 'https://example.com/image.jpg',
    status: 'PUBLISHED',
    published_at: '2024-01-01T00:00:00Z',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
    categories: [
      { id: 'c1', name: 'Thiền', slug: 'thien', description: 'Chuyện thiền' },
      { id: 'c2', name: 'Pháp thoại', slug: 'phat-thoai', description: 'Dharma talks' },
    ],
  };

  it('should render post title', () => {
    render(<PostCard post={mockPost} />);
    expect(screen.getByText('Test Post Title')).toBeInTheDocument();
  });

  it('should render post excerpt when provided', () => {
    render(<PostCard post={mockPost} />);
    expect(screen.getByText('This is a test excerpt')).toBeInTheDocument();
  });

  it('should render cover image when provided', () => {
    const { container } = render(<PostCard post={mockPost} />);
    const img = container.querySelector('img');
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', 'https://example.com/image.jpg');
    expect(img).toHaveAttribute('alt', 'Test Post Title');
  });

  it('should render categories when provided', () => {
    render(<PostCard post={mockPost} />);
    const categoryList = screen.getByTestId('category-list');
    expect(categoryList).toBeInTheDocument();
    expect(categoryList).toHaveTextContent('Thiền');
    expect(categoryList).toHaveTextContent('Pháp thoại');
  });

  it('should render formatted date', () => {
    render(<PostCard post={mockPost} />);
    expect(screen.getByText('01/01/2024')).toBeInTheDocument();
  });

  it('should render reading time', () => {
    render(<PostCard post={mockPost} />);
    expect(screen.getByText('5 phút đọc')).toBeInTheDocument();
  });

  it('should render without cover image when not provided', () => {
    const postWithoutImage = { ...mockPost, cover_image: null };
    const { container } = render(<PostCard post={postWithoutImage} />);
    const img = container.querySelector('img');
    expect(img).not.toBeInTheDocument();
  });

  it('should render without excerpt when not provided', () => {
    const postWithoutExcerpt = { ...mockPost, excerpt: null };
    render(<PostCard post={postWithoutExcerpt} />);
    expect(screen.queryByText('This is a test excerpt')).not.toBeInTheDocument();
  });

  it('should render without categories when none provided', () => {
    const postWithoutCategories = { ...mockPost, categories: [] };
    render(<PostCard post={postWithoutCategories} />);
    expect(screen.queryByTestId('category-list')).not.toBeInTheDocument();
  });

  it('should have correct link href', () => {
    const { container } = render(<PostCard post={mockPost} />);
    const link = container.querySelector('a');
    expect(link).toHaveAttribute('href', '/posts/test-post');
  });

  it('should use created_at when published_at is null', () => {
    const postWithoutPublished = {
      ...mockPost,
      published_at: null,
    };
    render(<PostCard post={postWithoutPublished} />);
    expect(screen.getByText('01/01/2024')).toBeInTheDocument();
  });
});
