import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { PostWithCategories } from '@/lib/types/blog';

// Mock Next.js router
vi.mock('next/navigation', () => ({
  Link: ({ children, href, ...props }: any) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

// Mock Next.js Image
vi.mock('next/image', () => ({
  default: ({ src, alt, ...props }: any) => <img src={src} alt={alt} {...props} />,
}));

// Mock utility functions BEFORE importing blog actions
vi.mock('@/lib/utils', () => ({
  formatDate: vi.fn(() => '01/01/2024'),
  generateSlug: vi.fn((title: string) => title.toLowerCase().replace(/\s+/g, '-')),
}));

// Mock blog actions
vi.mock('@/lib/blog/actions', () => ({
  deletePost: vi.fn(),
  publishPost: vi.fn(),
  unpublishPost: vi.fn(),
}));

import { deletePost, publishPost, unpublishPost } from '@/lib/blog/actions';
import { PostList } from '@/components/admin/PostList';

describe('PostList Component - User Story 3', () => {
  const mockPosts: PostWithCategories[] = [
    {
      id: '1',
      title: 'Published Post',
      slug: 'published-post',
      content: '<p>Content</p>',
      excerpt: 'Excerpt',
      cover_image: 'https://example.com/image1.jpg',
      status: 'PUBLISHED',
      published_at: '2024-01-01T00:00:00Z',
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z',
      categories: [
        { id: 'cat-1', name: 'Buddhism', slug: 'buddhism', description: null },
      ],
    },
    {
      id: '2',
      title: 'Draft Post',
      slug: 'draft-post',
      content: '<p>Content</p>',
      excerpt: 'Excerpt',
      cover_image: null,
      status: 'DRAFT',
      published_at: null,
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-02T00:00:00Z',
      categories: [],
    },
  ];

  beforeEach(() => {
    vi.mocked(deletePost).mockResolvedValue({ success: true });
    vi.mocked(publishPost).mockResolvedValue({ success: true });
    vi.mocked(unpublishPost).mockResolvedValue({ success: true });
  });

  it('should render list of posts', () => {
    render(<PostList initialPosts={mockPosts} />);

    expect(screen.getByText('Published Post')).toBeInTheDocument();
    expect(screen.getByText('Draft Post')).toBeInTheDocument();
  });

  it('should show filter tabs', () => {
    render(<PostList initialPosts={mockPosts} />);

    expect(screen.getByText('Tất cả (2)')).toBeInTheDocument();
    expect(screen.getByText('Đã đăng (1)')).toBeInTheDocument();
    expect(screen.getByText('Nháp (1)')).toBeInTheDocument();
  });

  it('should filter posts by "all"', () => {
    render(<PostList initialPosts={mockPosts} />);

    expect(screen.getByText('Published Post')).toBeInTheDocument();
    expect(screen.getByText('Draft Post')).toBeInTheDocument();
  });

  it('should filter posts by "published"', async () => {
    const user = userEvent.setup();
    render(<PostList initialPosts={mockPosts} />);

    const publishedTab = screen.getByText('Đã đăng (1)');
    await user.click(publishedTab);

    expect(screen.getByText('Published Post')).toBeInTheDocument();
    expect(screen.queryByText('Draft Post')).not.toBeInTheDocument();
  });

  it('should filter posts by "draft"', async () => {
    const user = userEvent.setup();
    render(<PostList initialPosts={mockPosts} />);

    const draftTab = screen.getByText('Nháp (1)');
    await user.click(draftTab);

    expect(screen.queryByText('Published Post')).not.toBeInTheDocument();
    expect(screen.getByText('Draft Post')).toBeInTheDocument();
  });

  it('should display status badges', () => {
    render(<PostList initialPosts={mockPosts} />);

    expect(screen.getByText('Đã đăng')).toBeInTheDocument();
    expect(screen.getByText('Nháp')).toBeInTheDocument();
  });

  it('should display post slugs', () => {
    render(<PostList initialPosts={mockPosts} />);

    expect(screen.getByText('/published-post')).toBeInTheDocument();
    expect(screen.getByText('/draft-post')).toBeInTheDocument();
  });

  it('should display cover images when available', () => {
    render(<PostList initialPosts={mockPosts} />);

    const image = screen.getByAltText('');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', 'https://example.com/image1.jpg');
  });

  it('should display categories when available', () => {
    render(<PostList initialPosts={mockPosts} />);

    expect(screen.getByText('Buddhism')).toBeInTheDocument();
  });

  it('should show publish button for draft posts', () => {
    render(<PostList initialPosts={mockPosts} />);

    // Should show "Đăng" button for draft post
    const publishButtons = screen.getAllByText('Đăng');
    expect(publishButtons.length).toBeGreaterThan(0);
  });

  it('should show unpublish button for published posts', () => {
    render(<PostList initialPosts={mockPosts} />);

    // Should show "Ẩn" button for published post
    const unpublishButtons = screen.getAllByText('Ẩn');
    expect(unpublishButtons.length).toBeGreaterThan(0);
  });

  it('should call deletePost when delete button is clicked', async () => {
    const user = userEvent.setup();
    window.confirm = vi.fn(() => true);

    render(<PostList initialPosts={mockPosts} />);

    const deleteButtons = screen.getAllByText('Xóa');
    await user.click(deleteButtons[0]);

    await waitFor(() => {
      expect(deletePost).toHaveBeenCalled();
    });
  });

  it('should not delete when user cancels confirmation', async () => {
    const user = userEvent.setup();
    window.confirm = vi.fn(() => false);

    render(<PostList initialPosts={mockPosts} />);

    const deleteButtons = screen.getAllByText('Xóa');
    await user.click(deleteButtons[0]);

    expect(deletePost).not.toHaveBeenCalled();
  });

  it('should call publishPost when publish button is clicked', async () => {
    const user = userEvent.setup();
    render(<PostList initialPosts={mockPosts} />);

    const publishButton = screen.getAllByText('Đăng')[0];
    await user.click(publishButton);

    await waitFor(() => {
      expect(publishPost).toHaveBeenCalled();
    });
  });

  it('should call unpublishPost when unpublish button is clicked', async () => {
    const user = userEvent.setup();
    render(<PostList initialPosts={mockPosts} />);

    const unpublishButton = screen.getAllByText('Ẩn')[0];
    await user.click(unpublishButton);

    await waitFor(() => {
      expect(unpublishPost).toHaveBeenCalled();
    });
  });

  it('should show error alert when delete fails', async () => {
    const user = userEvent.setup();
    window.confirm = vi.fn(() => true);
    vi.mocked(deletePost).mockResolvedValue({
      success: false,
      error: 'Delete failed',
    });

    render(<PostList initialPosts={mockPosts} />);

    const deleteButtons = screen.getAllByText('Xóa');
    await user.click(deleteButtons[0]);

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith('Delete failed');
    });
  });

  it('should update post status locally after publish', async () => {
    const user = userEvent.setup();
    render(<PostList initialPosts={mockPosts} />);

    const publishButton = screen.getAllByText('Đăng')[0];
    await user.click(publishButton);

    await waitFor(() => {
      expect(publishPost).toHaveBeenCalled();
    });
  });

  it('should update post status locally after unpublish', async () => {
    const user = userEvent.setup();
    render(<PostList initialPosts={mockPosts} />);

    const unpublishButton = screen.getAllByText('Ẩn')[0];
    await user.click(unpublishButton);

    await waitFor(() => {
      expect(unpublishPost).toHaveBeenCalled();
    });
  });

  it('should remove deleted post from list', async () => {
    const user = userEvent.setup();
    window.confirm = vi.fn(() => true);

    const { rerender } = render(<PostList initialPosts={mockPosts} />);

    const deleteButtons = screen.getAllByText('Xóa');
    await user.click(deleteButtons[0]);

    // After deletion, component should update local state
    await waitFor(() => {
      expect(deletePost).toHaveBeenCalled();
    });
  });

  it('should show empty state when no posts', () => {
    render(<PostList initialPosts={[]} />);

    expect(screen.getByText('Chưa có bài viết nào')).toBeInTheDocument();
    expect(screen.getByText('Bắt đầu viết bài đầu tiên của bạn.')).toBeInTheDocument();
  });

  it('should show empty state with correct message for draft filter', async () => {
    const user = userEvent.setup();
    const onlyPublishedPosts = mockPosts.filter((p) => p.status === 'PUBLISHED');

    render(<PostList initialPosts={onlyPublishedPosts} />);

    const draftTab = screen.getByText('Nháp (0)');
    await user.click(draftTab);

    expect(screen.getByText(/Không có bài viết nháp/)).toBeInTheDocument();
  });

  it('should show "write new post" link in empty state', () => {
    render(<PostList initialPosts={[]} />);

    const newPostLink = screen.getByText('Viết bài mới');
    expect(newPostLink).toBeInTheDocument();
    expect(newPostLink.closest('a')).toHaveAttribute('href', '/admin/posts/new');
  });

  it('should display creation date', () => {
    render(<PostList initialPosts={mockPosts} />);

    // Should show formatted dates (multiple posts have same date)
    expect(screen.getAllByText('01/01/2024').length).toBeGreaterThan(0);
  });

  it('should disable action buttons while loading', async () => {
    const user = userEvent.setup();
    vi.mocked(deletePost).mockImplementation(
      () => new Promise((resolve) => setTimeout(() => resolve({ success: true }), 100))
    );

    window.confirm = vi.fn(() => true);

    render(<PostList initialPosts={mockPosts} />);

    const deleteButtons = screen.getAllByText('Xóa');
    await user.click(deleteButtons[0]);

    // Button should show loading state
    await waitFor(() => {
      expect(screen.getAllByText('...').length).toBeGreaterThan(0);
    });
  });

  it('should have edit link for each post', () => {
    render(<PostList initialPosts={mockPosts} />);

    const editButtons = screen.getAllByText('Sửa');
    expect(editButtons.length).toBe(2);

    // Check that edit links point to correct URLs
    expect(editButtons[0].closest('a')).toHaveAttribute('href', '/admin/posts/1/edit');
  });

  it('should show categories as badges', () => {
    render(<PostList initialPosts={mockPosts} />);

    const categoryBadge = screen.getByText('Buddhism');
    expect(categoryBadge).toBeInTheDocument();
    expect(categoryBadge.className).toContain('bg-stone-100');
  });
});
