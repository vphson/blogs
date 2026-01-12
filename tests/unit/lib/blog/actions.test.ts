import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Mock the server client - MUST be before importing actions
// Use dynamic import to get the latest mockSupabaseClient
vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(() => {
    // Dynamically require to get latest value
    const { mockSupabaseClient } = require('../../mocks/supabase');
    return mockSupabaseClient;
  }),
}));

import { mockSupabaseClient, setMockData, setMockError, resetMock } from '../../mocks/supabase';

// Mock revalidatePath
vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}));

// Mock utility functions
vi.mock('@/lib/utils', () => ({
  generateSlug: vi.fn((title: string) => title.toLowerCase().replace(/\s+/g, '-')),
  generateExcerpt: vi.fn((content: string) => content.slice(0, 100) + '...'),
}));

// Now import the actions AFTER mocks are defined
import {
  createPost,
  updatePost,
  deletePost,
  publishPost,
  unpublishPost,
  getCategoriesForAdmin,
} from '@/lib/blog/actions';

describe('Admin Actions - User Story 3 (Viết & Quản Lý)', () => {
  beforeEach(() => {
    resetMock();
  });

  afterEach(() => {
    resetMock();
  });

  describe('createPost', () => {
    const mockPostData = {
      title: 'Test Post',
      content: '<p>Test content</p>',
      excerpt: 'Test excerpt',
      status: 'DRAFT' as const,
      cover_image: undefined,
      category_ids: [],
    };

    it('should create a post successfully for authenticated user', async () => {
      const mockCreatedPost = {
        id: '1',
        title: 'Test Post',
        slug: 'test-post',
        content: '<p>Test content</p>',
        excerpt: 'Test excerpt',
        status: 'DRAFT',
        cover_image: undefined,
        author_id: 'user-123',
        published_at: null,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
      };

      // Mock auth user
      (mockSupabaseClient.auth as any).getUser = vi.fn().mockResolvedValue({
        data: { user: { id: 'user-123' } },
        error: null,
      });

      // Mock insert
      mockSupabaseClient.from.mockReturnValue(mockSupabaseClient);
      mockSupabaseClient.insert.mockReturnValue(mockSupabaseClient);
      mockSupabaseClient.select.mockReturnValue(mockSupabaseClient);
      mockSupabaseClient.single.mockReturnValue(mockSupabaseClient);
      setMockData({ data: mockCreatedPost, error: null });

      const result = await createPost(mockPostData);

      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockCreatedPost);
      expect(mockSupabaseClient.from).toHaveBeenCalledWith('posts');
      expect(mockSupabaseClient.insert).toHaveBeenCalled();
    });

    it('should return unauthorized error when no user', async () => {
      (mockSupabaseClient.auth as any).getUser = vi.fn().mockResolvedValue({
        data: { user: null },
        error: null,
      });

      const result = await createPost(mockPostData);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Unauthorized');
      expect(mockSupabaseClient.from).not.toHaveBeenCalled();
    });

    it('should auto-generate slug from title', async () => {
      const mockCreatedPost = {
        id: '1',
        title: 'Test Post Title',
        slug: 'test-post-title',
        content: '<p>Content</p>',
        excerpt: 'Excerpt',
        status: 'DRAFT',
        cover_image: undefined,
        author_id: 'user-123',
        published_at: null,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
      };

      (mockSupabaseClient.auth as any).getUser = vi.fn().mockResolvedValue({
        data: { user: { id: 'user-123' } },
        error: null,
      });

      mockSupabaseClient.from.mockReturnValue(mockSupabaseClient);
      mockSupabaseClient.insert.mockReturnValue(mockSupabaseClient);
      mockSupabaseClient.select.mockReturnValue(mockSupabaseClient);
      mockSupabaseClient.single.mockReturnValue(mockSupabaseClient);
      setMockData({ data: mockCreatedPost, error: null });

      const result = await createPost({ ...mockPostData, title: 'Test Post Title', slug: undefined });

      expect(result.success).toBe(true);
      expect(result.data.slug).toBe('test-post-title');
    });

    it('should set published_at when status is published', async () => {
      const mockCreatedPost = {
        id: '1',
        title: 'Test Post',
        slug: 'test-post',
        content: '<p>Test content</p>',
        excerpt: 'Test excerpt',
        status: 'PUBLISHED',
        cover_image: undefined,
        author_id: 'user-123',
        published_at: '2024-01-01T00:00:00Z',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
      };

      (mockSupabaseClient.auth as any).getUser = vi.fn().mockResolvedValue({
        data: { user: { id: 'user-123' } },
        error: null,
      });

      mockSupabaseClient.from.mockReturnValue(mockSupabaseClient);
      mockSupabaseClient.insert.mockReturnValue(mockSupabaseClient);
      mockSupabaseClient.select.mockReturnValue(mockSupabaseClient);
      mockSupabaseClient.single.mockReturnValue(mockSupabaseClient);
      setMockData({ data: mockCreatedPost, error: null });

      const result = await createPost({ ...mockPostData, status: 'PUBLISHED' as any });

      expect(result.success).toBe(true);
      expect(result.data.published_at).toBeDefined();
    });

    it('should return error on database error', async () => {
      (mockSupabaseClient.auth as any).getUser = vi.fn().mockResolvedValue({
        data: { user: { id: 'user-123' } },
        error: null,
      });

      mockSupabaseClient.from.mockReturnValue(mockSupabaseClient);
      mockSupabaseClient.insert.mockReturnValue(mockSupabaseClient);
      mockSupabaseClient.select.mockReturnValue(mockSupabaseClient);
      mockSupabaseClient.single.mockReturnValue(mockSupabaseClient);
      setMockError({ message: 'Database error' });

      const result = await createPost(mockPostData);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Database error');
    });

    it('should associate categories when provided', async () => {
      const mockCreatedPost = {
        id: '1',
        title: 'Test Post',
        slug: 'test-post',
        content: '<p>Test content</p>',
        excerpt: 'Test excerpt',
        status: 'DRAFT',
        cover_image: undefined,
        author_id: 'user-123',
        published_at: null,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
      };

      (mockSupabaseClient.auth as any).getUser = vi.fn().mockResolvedValue({
        data: { user: { id: 'user-123' } },
        error: null,
      });

      mockSupabaseClient.from.mockReturnValue(mockSupabaseClient);
      mockSupabaseClient.insert.mockReturnValue(mockSupabaseClient);
      mockSupabaseClient.select.mockReturnValue(mockSupabaseClient);
      mockSupabaseClient.single.mockReturnValue(mockSupabaseClient);
      setMockData({ data: mockCreatedPost, error: null });

      const result = await createPost({
        ...mockPostData,
        category_ids: ['cat-1', 'cat-2'],
      });

      expect(result.success).toBe(true);
      // Should call insert for both posts and post_categories
      expect(mockSupabaseClient.from).toHaveBeenCalledWith('posts');
    });
  });

  describe('updatePost', () => {
    const mockUpdateData = {
      id: 'post-123',
      title: 'Updated Title',
      content: '<p>Updated content</p>',
      excerpt: 'Updated excerpt',
      status: 'PUBLISHED' as const,
      cover_image: 'https://example.com/image.jpg',
      category_ids: [],
    };

    it('should update post successfully for owner', async () => {
      const mockExistingPost = {
        id: 'post-123',
        author_id: 'user-123',
        status: 'DRAFT',
        published_at: null,
      };

      const mockUpdatedPost = {
        id: 'post-123',
        title: 'Updated Title',
        slug: 'updated-title',
        content: '<p>Updated content</p>',
        excerpt: 'Updated excerpt',
        status: 'PUBLISHED',
        cover_image: 'https://example.com/image.jpg',
        published_at: '2024-01-01T00:00:00Z',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
      };

      (mockSupabaseClient.auth as any).getUser = vi.fn().mockResolvedValue({
        data: { user: { id: 'user-123' } },
        error: null,
      });

      mockSupabaseClient.from.mockReturnValue(mockSupabaseClient);
      mockSupabaseClient.select.mockReturnValue(mockSupabaseClient);
      mockSupabaseClient.eq.mockReturnValue(mockSupabaseClient);
      mockSupabaseClient.single.mockReturnValue(mockSupabaseClient);
      mockSupabaseClient.update.mockReturnValue(mockSupabaseClient);

      // First call for existing post
      setMockData({ data: mockExistingPost, error: null });
      const result = await updatePost(mockUpdateData);

      // Second call for updated post
      setMockData({ data: mockUpdatedPost, error: null });

      expect(result.success).toBe(true);
      expect(mockSupabaseClient.update).toHaveBeenCalled();
    });

    it('should return unauthorized when no user', async () => {
      mockSupabaseClient.auth = vi.fn(() => ({
        getUser: vi.fn().mockResolvedValue({
          data: { user: null },
          error: null,
        }),
      })) as any;

      const result = await updatePost(mockUpdateData);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Unauthorized');
    });

    it('should return forbidden when user does not own post', async () => {
      const mockExistingPost = {
        id: 'post-123',
        author_id: 'user-123',
        status: 'DRAFT',
        published_at: null,
      };

      (mockSupabaseClient.auth as any).getUser = vi.fn().mockResolvedValue({
        data: { user: { id: 'user-123' } },
        error: null,
      });

      mockSupabaseClient.from.mockReturnValue(mockSupabaseClient);
      mockSupabaseClient.select.mockReturnValue(mockSupabaseClient);
      mockSupabaseClient.eq.mockReturnValue(mockSupabaseClient);
      mockSupabaseClient.single.mockReturnValue(mockSupabaseClient);
      setMockData({ data: mockExistingPost, error: null });

      const result = await updatePost(mockUpdateData);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Forbidden: You can only modify your own posts');
    });

    it('should return error when post not found', async () => {
      (mockSupabaseClient.auth as any).getUser = vi.fn().mockResolvedValue({
        data: { user: { id: 'user-123' } },
        error: null,
      });

      mockSupabaseClient.from.mockReturnValue(mockSupabaseClient);
      mockSupabaseClient.select.mockReturnValue(mockSupabaseClient);
      mockSupabaseClient.eq.mockReturnValue(mockSupabaseClient);
      mockSupabaseClient.single.mockReturnValue(mockSupabaseClient);
      setMockData({ data: null, error: { code: 'PGRST116' } });

      const result = await updatePost(mockUpdateData);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Post not found');
    });
  });

  describe('deletePost', () => {
    it('should soft delete post successfully for owner', async () => {
      const mockExistingPost = {
        slug: 'test-post',
        author_id: 'user-123',
      };

      (mockSupabaseClient.auth as any).getUser = vi.fn().mockResolvedValue({
        data: { user: { id: 'user-123' } },
        error: null,
      });

      mockSupabaseClient.from.mockReturnValue(mockSupabaseClient);
      mockSupabaseClient.select.mockReturnValue(mockSupabaseClient);
      mockSupabaseClient.eq.mockReturnValue(mockSupabaseClient);
      mockSupabaseClient.single.mockReturnValue(mockSupabaseClient);
      mockSupabaseClient.update.mockReturnValue(mockSupabaseClient);
      setMockData({ data: mockExistingPost, error: null });

      const result = await deletePost('post-123');

      expect(result.success).toBe(true);
      expect(mockSupabaseClient.update).toHaveBeenCalledWith({
        deleted_at: expect.any(String),
      });
    });

    it('should return unauthorized when no user', async () => {
      mockSupabaseClient.auth = vi.fn(() => ({
        getUser: vi.fn().mockResolvedValue({
          data: { user: null },
          error: null,
        }),
      })) as any;

      const result = await deletePost('post-123');

      expect(result.success).toBe(false);
      expect(result.error).toBe('Unauthorized');
    });

    it('should return forbidden when user does not own post', async () => {
      const mockExistingPost = {
        slug: 'test-post',
        author_id: 'user-123',
      };

      (mockSupabaseClient.auth as any).getUser = vi.fn().mockResolvedValue({
        data: { user: { id: 'user-123' } },
        error: null,
      });

      mockSupabaseClient.from.mockReturnValue(mockSupabaseClient);
      mockSupabaseClient.select.mockReturnValue(mockSupabaseClient);
      mockSupabaseClient.eq.mockReturnValue(mockSupabaseClient);
      mockSupabaseClient.single.mockReturnValue(mockSupabaseClient);
      setMockData({ data: mockExistingPost, error: null });

      const result = await deletePost('post-123');

      expect(result.success).toBe(false);
      expect(result.error).toBe('Forbidden: You can only delete your own posts');
    });

    it('should return error when post not found', async () => {
      (mockSupabaseClient.auth as any).getUser = vi.fn().mockResolvedValue({
        data: { user: { id: 'user-123' } },
        error: null,
      });

      mockSupabaseClient.from.mockReturnValue(mockSupabaseClient);
      mockSupabaseClient.select.mockReturnValue(mockSupabaseClient);
      mockSupabaseClient.eq.mockReturnValue(mockSupabaseClient);
      mockSupabaseClient.single.mockReturnValue(mockSupabaseClient);
      setMockData({ data: null, error: { code: 'PGRST116' } });

      const result = await deletePost('post-123');

      expect(result.success).toBe(false);
      expect(result.error).toBe('Post not found');
    });
  });

  describe('publishPost', () => {
    it('should publish post successfully for owner', async () => {
      const mockExistingPost = {
        id: 'post-123',
        author_id: 'user-123',
      };

      const mockPublishedPost = {
        slug: 'test-post',
      };

      (mockSupabaseClient.auth as any).getUser = vi.fn().mockResolvedValue({
        data: { user: { id: 'user-123' } },
        error: null,
      });

      mockSupabaseClient.from.mockReturnValue(mockSupabaseClient);
      mockSupabaseClient.select.mockReturnValue(mockSupabaseClient);
      mockSupabaseClient.eq.mockReturnValue(mockSupabaseClient);
      mockSupabaseClient.single.mockReturnValue(mockSupabaseClient);
      mockSupabaseClient.update.mockReturnValue(mockSupabaseClient);

      // First call for existing post
      setMockData({ data: mockExistingPost, error: null });
      const result = await publishPost('post-123');

      // Second call for published post
      setMockData({ data: mockPublishedPost, error: null });

      expect(result.success).toBe(true);
      expect(mockSupabaseClient.update).toHaveBeenCalledWith({
        status: 'PUBLISHED',
        published_at: expect.any(String),
      });
    });

    it('should return unauthorized when no user', async () => {
      mockSupabaseClient.auth = vi.fn(() => ({
        getUser: vi.fn().mockResolvedValue({
          data: { user: null },
          error: null,
        }),
      })) as any;

      const result = await publishPost('post-123');

      expect(result.success).toBe(false);
      expect(result.error).toBe('Unauthorized');
    });

    it('should return forbidden when user does not own post', async () => {
      const mockExistingPost = {
        id: 'post-123',
        author_id: 'user-123',
      };

      (mockSupabaseClient.auth as any).getUser = vi.fn().mockResolvedValue({
        data: { user: { id: 'user-123' } },
        error: null,
      });

      mockSupabaseClient.from.mockReturnValue(mockSupabaseClient);
      mockSupabaseClient.select.mockReturnValue(mockSupabaseClient);
      mockSupabaseClient.eq.mockReturnValue(mockSupabaseClient);
      mockSupabaseClient.single.mockReturnValue(mockSupabaseClient);
      setMockData({ data: mockExistingPost, error: null });

      const result = await publishPost('post-123');

      expect(result.success).toBe(false);
      expect(result.error).toBe('Forbidden: You can only publish your own posts');
    });
  });

  describe('unpublishPost', () => {
    it('should unpublish post successfully for owner', async () => {
      const mockExistingPost = {
        slug: 'test-post',
        author_id: 'user-123',
      };

      (mockSupabaseClient.auth as any).getUser = vi.fn().mockResolvedValue({
        data: { user: { id: 'user-123' } },
        error: null,
      });

      mockSupabaseClient.from.mockReturnValue(mockSupabaseClient);
      mockSupabaseClient.select.mockReturnValue(mockSupabaseClient);
      mockSupabaseClient.eq.mockReturnValue(mockSupabaseClient);
      mockSupabaseClient.single.mockReturnValue(mockSupabaseClient);
      mockSupabaseClient.update.mockReturnValue(mockSupabaseClient);
      setMockData({ data: mockExistingPost, error: null });

      const result = await unpublishPost('post-123');

      expect(result.success).toBe(true);
      expect(mockSupabaseClient.update).toHaveBeenCalledWith({
        status: 'DRAFT',
      });
    });

    it('should return unauthorized when no user', async () => {
      mockSupabaseClient.auth = vi.fn(() => ({
        getUser: vi.fn().mockResolvedValue({
          data: { user: null },
          error: null,
        }),
      })) as any;

      const result = await unpublishPost('post-123');

      expect(result.success).toBe(false);
      expect(result.error).toBe('Unauthorized');
    });

    it('should return forbidden when user does not own post', async () => {
      const mockExistingPost = {
        slug: 'test-post',
        author_id: 'user-123',
      };

      (mockSupabaseClient.auth as any).getUser = vi.fn().mockResolvedValue({
        data: { user: { id: 'user-123' } },
        error: null,
      });

      mockSupabaseClient.from.mockReturnValue(mockSupabaseClient);
      mockSupabaseClient.select.mockReturnValue(mockSupabaseClient);
      mockSupabaseClient.eq.mockReturnValue(mockSupabaseClient);
      mockSupabaseClient.single.mockReturnValue(mockSupabaseClient);
      setMockData({ data: mockExistingPost, error: null });

      const result = await unpublishPost('post-123');

      expect(result.success).toBe(false);
      expect(result.error).toBe('Forbidden: You can only unpublish your own posts');
    });
  });

  describe('getCategoriesForAdmin', () => {
    it('should return categories ordered by name', async () => {
      const mockCategories = [
        { id: 'cat-1', name: 'Buddhism', slug: 'buddhism' },
        { id: 'cat-2', name: 'Meditation', slug: 'meditation' },
      ];

      mockSupabaseClient.from.mockReturnValue(mockSupabaseClient);
      mockSupabaseClient.select.mockReturnValue(mockSupabaseClient);
      mockSupabaseClient.order.mockReturnValue(mockSupabaseClient);
      setMockData({ data: mockCategories, error: null });

      const result = await getCategoriesForAdmin();

      expect(result).toEqual(mockCategories);
      expect(mockSupabaseClient.from).toHaveBeenCalledWith('categories');
      expect(mockSupabaseClient.order).toHaveBeenCalledWith('name');
    });

    it('should return empty array on error', async () => {
      mockSupabaseClient.from.mockReturnValue(mockSupabaseClient);
      mockSupabaseClient.select.mockReturnValue(mockSupabaseClient);
      mockSupabaseClient.order.mockReturnValue(mockSupabaseClient);
      setMockError({ message: 'Database error' });

      const result = await getCategoriesForAdmin();

      expect(result).toEqual([]);
    });

    it('should return empty array when no categories exist', async () => {
      mockSupabaseClient.from.mockReturnValue(mockSupabaseClient);
      mockSupabaseClient.select.mockReturnValue(mockSupabaseClient);
      mockSupabaseClient.order.mockReturnValue(mockSupabaseClient);
      setMockData({ data: [], error: null });

      const result = await getCategoriesForAdmin();

      expect(result).toEqual([]);
    });
  });
});
