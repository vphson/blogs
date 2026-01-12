import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  getPublishedPosts,
  getPostBySlug,
  getPostsByCategory,
  getAllCategories,
  getCategoryBySlug,
} from '@/lib/blog/queries';
import { mockSupabaseClient, setMockData, setMockError, resetMock } from '../../mocks/supabase';

// Mock the server client
vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(() => mockSupabaseClient),
}));

describe('Blog Queries - User Story 1 (Đọc Bài Viết)', () => {
  beforeEach(() => {
    resetMock();
    vi.clearAllMocks();
  });

  afterEach(() => {
    resetMock();
  });

  describe('getPublishedPosts', () => {
    it('should return published posts with categories', async () => {
      const mockPosts = [
        {
          id: '1',
          title: 'Test Post 1',
          slug: 'test-post-1',
          content: 'Content 1',
          excerpt: 'Excerpt 1',
          cover_image: null,
          status: 'PUBLISHED',
          published_at: '2024-01-01T00:00:00Z',
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-01T00:00:00Z',
          categories: [
            { id: 'c1', name: 'Thiền', slug: 'thien', description: 'Chuyện thiền' },
          ],
        },
        {
          id: '2',
          title: 'Test Post 2',
          slug: 'test-post-2',
          content: 'Content 2',
          excerpt: 'Excerpt 2',
          cover_image: null,
          status: 'PUBLISHED',
          published_at: '2024-01-02T00:00:00Z',
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-02T00:00:00Z',
          categories: [],
        },
      ];

      // Mock the chain response
      mockSupabaseClient.from.mockReturnValue(mockSupabaseClient);
      mockSupabaseClient.select.mockReturnValue(mockSupabaseClient);
      mockSupabaseClient.eq.mockReturnValue(mockSupabaseClient);
      mockSupabaseClient.order.mockReturnValue(mockSupabaseClient);
      mockSupabaseClient.limit.mockReturnValue(mockSupabaseClient);
      mockSupabaseClient.lt.mockReturnValue(mockSupabaseClient);
      setMockData({ data: mockPosts, error: null, count: 2 });

      const result = await getPublishedPosts();

      expect(result.data).toHaveLength(2);
      expect(result.data[0].title).toBe('Test Post 1');
      expect(result.count).toBe(2);
      expect(result.hasMore).toBe(false);
    });

    it('should handle pagination with limit', async () => {
      const mockPosts = Array.from({ length: 25 }, (_, i) => ({
        id: `${i + 1}`,
        title: `Post ${i + 1}`,
        slug: `post-${i + 1}`,
        content: `Content ${i + 1}`,
        excerpt: `Excerpt ${i + 1}`,
        cover_image: null,
        status: 'PUBLISHED',
        published_at: `2024-01-${String(i + 1).padStart(2, '0')}T00:00:00Z`,
        created_at: `2024-01-${String(i + 1).padStart(2, '0')}T00:00:00Z`,
        updated_at: `2024-01-${String(i + 1).padStart(2, '0')}T00:00:00Z`,
        categories: [],
      }));

      mockSupabaseClient.from.mockReturnValue(mockSupabaseClient);
      mockSupabaseClient.select.mockReturnValue(mockSupabaseClient);
      mockSupabaseClient.eq.mockReturnValue(mockSupabaseClient);
      mockSupabaseClient.order.mockReturnValue(mockSupabaseClient);
      mockSupabaseClient.limit.mockReturnValue(mockSupabaseClient);
      mockSupabaseClient.lt.mockReturnValue(mockSupabaseClient);
      setMockData({ data: mockPosts, error: null, count: 25 });

      const result = await getPublishedPosts({ limit: 20 });

      expect(result.data).toHaveLength(20);
      expect(result.hasMore).toBe(true);
      expect(result.nextCursor).toBeDefined();
    });

    it('should return empty array on error', async () => {
      mockSupabaseClient.from.mockReturnValue(mockSupabaseClient);
      mockSupabaseClient.select.mockReturnValue(mockSupabaseClient);
      mockSupabaseClient.eq.mockReturnValue(mockSupabaseClient);
      mockSupabaseClient.order.mockReturnValue(mockSupabaseClient);
      mockSupabaseClient.limit.mockReturnValue(mockSupabaseClient);
      setMockError({ message: 'Database error' });

      const result = await getPublishedPosts();

      expect(result.data).toEqual([]);
      expect(result.count).toBe(0);
      expect(result.hasMore).toBe(false);
    });

    it('should filter by cursor when provided', async () => {
      const cursor = '2024-01-15T00:00:00Z';

      mockSupabaseClient.from.mockReturnValue(mockSupabaseClient);
      mockSupabaseClient.select.mockReturnValue(mockSupabaseClient);
      mockSupabaseClient.eq.mockReturnValue(mockSupabaseClient);
      mockSupabaseClient.order.mockReturnValue(mockSupabaseClient);
      mockSupabaseClient.limit.mockReturnValue(mockSupabaseClient);
      mockSupabaseClient.lt.mockReturnValue(mockSupabaseClient);
      setMockData({ data: [], error: null, count: 0 });

      await getPublishedPosts({ cursor, limit: 20 });

      expect(mockSupabaseClient.lt).toHaveBeenCalledWith('published_at', cursor);
    });
  });

  describe('getPostBySlug', () => {
    it('should return post with categories when found', async () => {
      const mockPost = {
        id: '1',
        title: 'Test Post',
        slug: 'test-post',
        content: 'Content',
        excerpt: 'Excerpt',
        cover_image: null,
        status: 'PUBLISHED',
        published_at: '2024-01-01T00:00:00Z',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
        categories: [
          { id: 'c1', name: 'Thiền', slug: 'thien', description: 'Chuyện thiền' },
        ],
      };

      mockSupabaseClient.from.mockReturnValue(mockSupabaseClient);
      mockSupabaseClient.select.mockReturnValue(mockSupabaseClient);
      mockSupabaseClient.eq.mockReturnValue(mockSupabaseClient);
      mockSupabaseClient.single.mockReturnValue(mockSupabaseClient);
      setMockData({ data: mockPost, error: null });

      const result = await getPostBySlug('test-post');

      expect(result).not.toBeNull();
      expect(result?.title).toBe('Test Post');
      expect(result?.slug).toBe('test-post');
      expect(result?.categories).toHaveLength(1);
    });

    it('should return null when post not found', async () => {
      mockSupabaseClient.from.mockReturnValue(mockSupabaseClient);
      mockSupabaseClient.select.mockReturnValue(mockSupabaseClient);
      mockSupabaseClient.eq.mockReturnValue(mockSupabaseClient);
      mockSupabaseClient.single.mockReturnValue(mockSupabaseClient);
      setMockError({ message: 'PGRST116', code: 'PGRST116' }); // Not found error

      const result = await getPostBySlug('non-existent');

      expect(result).toBeNull();
    });

    it('should return null on database error', async () => {
      mockSupabaseClient.from.mockReturnValue(mockSupabaseClient);
      mockSupabaseClient.select.mockReturnValue(mockSupabaseClient);
      mockSupabaseClient.eq.mockReturnValue(mockSupabaseClient);
      mockSupabaseClient.single.mockReturnValue(mockSupabaseClient);
      setMockError({ message: 'Database connection failed' });

      const result = await getPostBySlug('test-post');

      expect(result).toBeNull();
    });
  });

  describe('getPostsByCategory', () => {
    it('should return posts for a specific category', async () => {
      const mockPosts = [
        {
          id: '1',
          title: 'Zen Post',
          slug: 'zen-post',
          content: 'Zen content',
          excerpt: 'Zen excerpt',
          cover_image: null,
          status: 'PUBLISHED',
          published_at: '2024-01-01T00:00:00Z',
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-01T00:00:00Z',
          categories: [{ id: 'c1', name: 'Thiền', slug: 'thien', description: 'Chuyện thiền' }],
        },
      ];

      mockSupabaseClient.from.mockReturnValue(mockSupabaseClient);
      mockSupabaseClient.select.mockReturnValue(mockSupabaseClient);
      mockSupabaseClient.eq.mockReturnValue(mockSupabaseClient);
      mockSupabaseClient.order.mockReturnValue(mockSupabaseClient);
      setMockData({ data: mockPosts, error: null });

      const result = await getPostsByCategory('thien');

      expect(result).toHaveLength(1);
      expect(result[0].title).toBe('Zen Post');
      expect(result[0].categories[0].slug).toBe('thien');
    });

    it('should return empty array when category has no posts', async () => {
      mockSupabaseClient.from.mockReturnValue(mockSupabaseClient);
      mockSupabaseClient.select.mockReturnValue(mockSupabaseClient);
      mockSupabaseClient.eq.mockReturnValue(mockSupabaseClient);
      mockSupabaseClient.order.mockReturnValue(mockSupabaseClient);
      setMockData({ data: [], error: null });

      const result = await getPostsByCategory('empty-category');

      expect(result).toEqual([]);
    });

    it('should return empty array on error', async () => {
      mockSupabaseClient.from.mockReturnValue(mockSupabaseClient);
      mockSupabaseClient.select.mockReturnValue(mockSupabaseClient);
      mockSupabaseClient.eq.mockReturnValue(mockSupabaseClient);
      mockSupabaseClient.order.mockReturnValue(mockSupabaseClient);
      setMockError({ message: 'Database error' });

      const result = await getPostsByCategory('thien');

      expect(result).toEqual([]);
    });

    it('should filter by published status only', async () => {
      mockSupabaseClient.from.mockReturnValue(mockSupabaseClient);
      mockSupabaseClient.select.mockReturnValue(mockSupabaseClient);
      mockSupabaseClient.eq.mockReturnValue(mockSupabaseClient);
      mockSupabaseClient.order.mockReturnValue(mockSupabaseClient);
      setMockData({ data: [], error: null });

      await getPostsByCategory('thien');

      // Should be called twice: once for status, once for category slug
      expect(mockSupabaseClient.eq).toHaveBeenCalledWith('status', 'published');
      expect(mockSupabaseClient.eq).toHaveBeenCalledWith('categories.slug', 'thien');
    });
  });
});

describe('Blog Queries - Additional', () => {
  beforeEach(() => {
    resetMock();
    vi.clearAllMocks();
  });

  afterEach(() => {
    resetMock();
  });

  describe('getAllCategories', () => {
    it('should return all categories ordered by name', async () => {
      const mockCategories = [
        { id: 'c1', name: 'Pháp thoại', slug: 'phat-thoai', description: 'Các bài pháp thoại' },
        { id: 'c2', name: 'Thiền', slug: 'thien', description: 'Chuyện thiền' },
      ];

      mockSupabaseClient.from.mockReturnValue(mockSupabaseClient);
      mockSupabaseClient.select.mockReturnValue(mockSupabaseClient);
      mockSupabaseClient.order.mockReturnValue(mockSupabaseClient);
      setMockData({ data: mockCategories, error: null });

      const result = await getAllCategories();

      expect(result).toHaveLength(2);
      expect(result[0].name).toBe('Pháp thoại');
      expect(mockSupabaseClient.order).toHaveBeenCalledWith('name');
    });
  });

  describe('getCategoryBySlug', () => {
    it('should return category when found', async () => {
      const mockCategory = {
        id: 'c1',
        name: 'Thiền',
        slug: 'thien',
        description: 'Chuyện thiền',
      };

      mockSupabaseClient.from.mockReturnValue(mockSupabaseClient);
      mockSupabaseClient.select.mockReturnValue(mockSupabaseClient);
      mockSupabaseClient.eq.mockReturnValue(mockSupabaseClient);
      mockSupabaseClient.single.mockReturnValue(mockSupabaseClient);
      setMockData({ data: mockCategory, error: null });

      const result = await getCategoryBySlug('thien');

      expect(result).not.toBeNull();
      expect(result?.name).toBe('Thiền');
      expect(result?.slug).toBe('thien');
    });

    it('should return null when category not found', async () => {
      mockSupabaseClient.from.mockReturnValue(mockSupabaseClient);
      mockSupabaseClient.select.mockReturnValue(mockSupabaseClient);
      mockSupabaseClient.eq.mockReturnValue(mockSupabaseClient);
      mockSupabaseClient.single.mockReturnValue(mockSupabaseClient);
      setMockError({ message: 'PGRST116', code: 'PGRST116' });

      const result = await getCategoryBySlug('non-existent');

      expect(result).toBeNull();
    });
  });
});
