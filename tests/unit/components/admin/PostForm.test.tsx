import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PostForm } from '@/components/admin/PostForm';
import type { PostWithCategories } from '@/lib/types/blog';

// Mock Next.js router
const mockPush = vi.fn();
const mockBack = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    back: mockBack,
    replace: vi.fn(),
    prefetch: vi.fn(),
    pathname: '/admin/posts/new',
    query: {},
  }),
}));

// Mock blog actions
vi.mock('@/lib/blog/actions', () => ({
  createPost: vi.fn(),
  updatePost: vi.fn(),
  getCategoriesForAdmin: vi.fn(),
}));

// Mock useDebounce hook
vi.mock('@/hooks/useDebounce', () => ({
  useDebounce: (value: any) => value,
}));

// Mock generateSlug utility
vi.mock('@/lib/utils', () => ({
  formatDate: (date: string) => '01/01/2024',
  generateSlug: (title: string) => title.toLowerCase().replace(/\s+/g, '-'),
}));

import { createPost, updatePost, getCategoriesForAdmin } from '@/lib/blog/actions';

describe('PostForm Component - User Story 3', () => {
  beforeEach(() => {
    vi.mocked(createPost).mockResolvedValue({ success: true, data: { id: '1' } });
    vi.mocked(updatePost).mockResolvedValue({ success: true, data: { id: '1' } });
    vi.mocked(getCategoriesForAdmin).mockResolvedValue([
      { id: 'cat-1', name: 'Buddhism', slug: 'buddhism', description: 'Buddhist teachings' },
      { id: 'cat-2', name: 'Meditation', slug: 'meditation', description: 'Meditation practices' },
    ]);
  });

  it('should render empty form for new post', () => {
    render(<PostForm />);

    expect(screen.getByLabelText(/Tiêu đề/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Slug/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Nội dung/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Tóm tắt/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Ảnh bìa/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Chủ đề/)).toBeInTheDocument();
  });

  it('should render form with existing post data for editing', () => {
    const mockPost: PostWithCategories = {
      id: '1',
      title: 'Test Post',
      slug: 'test-post',
      content: '<p>Test content</p>',
      excerpt: 'Test excerpt',
      cover_image: 'https://example.com/image.jpg',
      status: 'DRAFT',
      
      published_at: null,
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z',
      categories: [
        { id: 'cat-1', name: 'Buddhism', slug: 'buddhism', description: 'Buddhist teachings' },
      ],
    };

    render(<PostForm post={mockPost} />);

    expect(screen.getByLabelText(/Tiêu đề/)).toHaveValue('Test Post');
    expect(screen.getByLabelText(/Slug/)).toHaveValue('test-post');
  });

  it('should auto-generate slug from title', async () => {
    const user = userEvent.setup();
    render(<PostForm />);

    const titleInput = screen.getByLabelText(/Tiêu đề/);
    await user.type(titleInput, 'My Test Post');

    await waitFor(() => {
      const slugInput = screen.getByLabelText(/Slug/);
      expect(slugInput).toHaveValue('my-test-post');
    });
  });

  it('should not auto-generate slug when editing', async () => {
    const user = userEvent.setup();
    const mockPost: PostWithCategories = {
      id: '1',
      title: 'Test Post',
      slug: 'existing-slug',
      content: '<p>Content</p>',
      excerpt: 'Excerpt',
      cover_image: null,
      status: 'DRAFT',
      
      published_at: null,
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z',
      categories: [],
    };

    render(<PostForm post={mockPost} />);

    const titleInput = screen.getByLabelText(/Tiêu đề/);
    await user.clear(titleInput);
    await user.type(titleInput, 'New Title');

    // Slug should remain unchanged
    await waitFor(() => {
      const slugInput = screen.getByLabelText(/Slug/);
      expect(slugInput).toHaveValue('existing-slug');
    });
  });

  it('should load categories on mount', async () => {
    render(<PostForm />);

    await waitFor(() => {
      expect(getCategoriesForAdmin).toHaveBeenCalled();
      expect(screen.getByText('Buddhism')).toBeInTheDocument();
      expect(screen.getByText('Meditation')).toBeInTheDocument();
    });
  });

  it('should toggle category selection', async () => {
    const user = userEvent.setup();
    render(<PostForm />);

    await waitFor(() => {
      expect(screen.getByText('Buddhism')).toBeInTheDocument();
    });

    const buddhismCheckbox = screen.getAllByRole('checkbox')[0];
    await user.click(buddhismCheckbox);

    expect(buddhismCheckbox).toBeChecked();
  });

  it('should call createPost on submit for new post', async () => {
    const user = userEvent.setup();
    const onSuccess = vi.fn();

    render(<PostForm onSuccess={onSuccess} />);

    await waitFor(() => {
      expect(getCategoriesForAdmin).toHaveBeenCalled();
    });

    const titleInput = screen.getByLabelText(/Tiêu đề/);
    await user.type(titleInput, 'Test Post');

    // Wait for slug to be generated
    await waitFor(() => {
      expect(screen.getByLabelText(/Slug/)).toHaveValue('test-post');
    });

    // Click "Lưu nháp" button
    const saveDraftButton = screen.getByRole('button', { name: 'Lưu nháp' });
    await user.click(saveDraftButton);

    await waitFor(() => {
      expect(createPost).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Test Post',
          slug: 'test-post',
          status: 'DRAFT',
        })
      );
    });
  });

  it('should call updatePost on submit for existing post', async () => {
    const user = userEvent.setup();
    const mockPost: PostWithCategories = {
      id: '1',
      title: 'Test Post',
      slug: 'test-post',
      content: '<p>Content</p>',
      excerpt: 'Excerpt',
      cover_image: null,
      status: 'DRAFT',
      
      published_at: null,
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z',
      categories: [],
    };

    render(<PostForm post={mockPost} />);

    const saveDraftButton = screen.getByRole('button', { name: 'Lưu nháp' });
    await user.click(saveDraftButton);

    await waitFor(() => {
      expect(updatePost).toHaveBeenCalledWith(
        expect.objectContaining({
          id: '1',
          title: 'Test Post',
          slug: 'test-post',
        })
      );
    });
  });

  it('should show error when submit fails', async () => {
    const user = userEvent.setup();
    vi.mocked(createPost).mockResolvedValue({
      success: false,
      error: 'Database error',
    });

    render(<PostForm />);

    await waitFor(() => {
      expect(getCategoriesForAdmin).toHaveBeenCalled();
    });

    const titleInput = screen.getByLabelText(/Tiêu đề/);
    await user.type(titleInput, 'Test Post');

    await waitFor(() => {
      expect(screen.getByLabelText(/Slug/)).toHaveValue('test-post');
    });

    const saveDraftButton = screen.getByRole('button', { name: 'Lưu nháp' });
    await user.click(saveDraftButton);

    await waitFor(() => {
      expect(screen.getByText('Database error')).toBeInTheDocument();
    });
  });

  it('should disable submit buttons when loading', async () => {
    const user = userEvent.setup();
    vi.mocked(createPost).mockImplementation(
      () => new Promise((resolve) => setTimeout(() => resolve({ success: true, data: { id: '1' } }), 100))
    );

    render(<PostForm />);

    await waitFor(() => {
      expect(getCategoriesForAdmin).toHaveBeenCalled();
    });

    const titleInput = screen.getByLabelText(/Tiêu đề/);
    await user.type(titleInput, 'Test Post');

    await waitFor(() => {
      expect(screen.getByLabelText(/Slug/)).toHaveValue('test-post');
    });

    const saveDraftButton = screen.getByRole('button', { name: 'Lưu nháp' });
    await user.click(saveDraftButton);

    // Buttons should be disabled while loading
    await waitFor(() => {
      expect(saveDraftButton).toBeDisabled();
      expect(screen.getByRole('button', { name: 'Lưu nháp' })).toBeDisabled();
    });
  });

  it('should show cover image preview when URL is provided', async () => {
    const user = userEvent.setup();
    render(<PostForm />);

    const coverImageInput = screen.getByLabelText(/Ảnh bìa/);
    await user.type(coverImageInput, 'https://example.com/image.jpg');

    // Image should be visible
    await waitFor(() => {
      const image = document.querySelector('img[src="https://example.com/image.jpg"]');
      expect(image).toBeInTheDocument();
    });
  });

  it('should navigate back on cancel', async () => {
    const user = userEvent.setup();
    render(<PostForm />);

    const cancelButton = screen.getByRole('button', { name: 'Hủy' });
    await user.click(cancelButton);

    expect(mockBack).toHaveBeenCalled();
  });

  it('should disable submit when title is empty', () => {
    render(<PostForm />);

    const saveDraftButton = screen.getByRole('button', { name: 'Lưu nháp' });
    expect(saveDraftButton).toBeDisabled();
  });

  it('should show required field indicator for title', () => {
    render(<PostForm />);

    const titleLabel = screen.getByLabelText(/Tiêu đề/);
    const requiredIndicator = titleLabel.parentElement?.querySelector('.text-red-500');
    expect(requiredIndicator).toBeInTheDocument();
    expect(requiredIndicator).toHaveTextContent('*');
  });

  it('should show required field indicator for content', () => {
    render(<PostForm />);

    const contentLabel = screen.getByLabelText(/Nội dung/);
    const requiredIndicator = contentLabel.parentElement?.querySelector('.text-red-500');
    expect(requiredIndicator).toBeInTheDocument();
    expect(requiredIndicator).toHaveTextContent('*');
  });

  it('should display helper text for slug field', () => {
    render(<PostForm />);

    expect(screen.getByText(/Được tự động tạo từ tiêu đề/)).toBeInTheDocument();
  });

  it('should display helper text for excerpt field', () => {
    render(<PostForm />);

    expect(screen.getByText(/Nếu để trống, sẽ tự động tạo từ nội dung/)).toBeInTheDocument();
  });

  it('should update status when publish button is clicked', async () => {
    const user = userEvent.setup();
    render(<PostForm />);

    await waitFor(() => {
      expect(getCategoriesForAdmin).toHaveBeenCalled();
    });

    const titleInput = screen.getByLabelText(/Tiêu đề/);
    await user.type(titleInput, 'Test Post');

    await waitFor(() => {
      expect(screen.getByLabelText(/Slug/)).toHaveValue('test-post');
    });

    const publishButton = screen.getByRole('button', { name: 'Đăng bài' });
    await user.click(publishButton);

    await waitFor(() => {
      expect(createPost).toHaveBeenCalledWith(
        expect.objectContaining({
          status: 'PUBLISHED',
        })
      );
    });
  });
});
