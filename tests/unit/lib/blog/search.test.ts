import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { searchPosts } from '@/lib/blog/queries';
import { mockSupabaseClient, setMockData, setMockError, resetMock } from '../../mocks/supabase';

// Mock the server client
vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(() => mockSupabaseClient),
}));

describe('Search Query - User Story 2 (Tìm Kiếm)', () => {
  beforeEach(() => {
    resetMock();
    vi.clearAllMocks();
  });

  afterEach(() => {
    resetMock();
  });

  describe('searchPosts', () => {
    it('should return search results for valid query', async () => {
      const mockResults = [
        {
          id: '1',
          title: 'Thiền và sự bình an',
          slug: 'thien-binh-an',
          content: 'Bài viết về thiền',
          excerpt: 'Tìm kiếm bình an qua thiền',
          cover_image: null,
          status: 'PUBLISHED',
          published_at: '2024-01-01T00:00:00Z',
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-01T00:00:00Z',
          categories: [],
        },
      ];

      mockSupabaseClient.from.mockReturnValue(mockSupabaseClient);
      mockSupabaseClient.select.mockReturnValue(mockSupabaseClient);
      mockSupabaseClient.eq.mockReturnValue(mockSupabaseClient);
      mockSupabaseClient.or.mockReturnValue(mockSupabaseClient);
      mockSupabaseClient.order.mockReturnValue(mockSupabaseClient);
      mockSupabaseClient.limit.mockReturnValue(mockSupabaseClient);
      mockSupabaseClient.lt.mockReturnValue(mockSupabaseClient);
      setMockData({ data: mockResults, error: null, count: 1 });

      const result = await searchPosts('thiền');

      expect(result.data).toHaveLength(1);
      expect(result.data[0].title).toBe('Thiền và sự bình an');
      expect(result.count).toBe(1);
      expect(result.hasMore).toBe(false);
    });

    it('should handle empty query', async () => {
      const result = await searchPosts('');

      expect(result.data).toEqual([]);
      expect(result.count).toBe(0);
      expect(result.hasMore).toBe(false);
      expect(mockSupabaseClient.from).not.toHaveBeenCalled();
    });

    it('should handle whitespace-only query', async () => {
      const result = await searchPosts('   ');

      expect(result.data).toEqual([]);
      expect(result.count).toBe(0);
      expect(mockSupabaseClient.from).not.toHaveBeenCalled();
    });

    it('should limit query length to 100 characters', async () => {
      const longQuery = 'a'.repeat(200);
      const mockResults = [
        {
          id: '1',
          title: 'Test',
          slug: 'test',
          content: 'Content',
          excerpt: 'Excerpt',
          cover_image: null,
          status: 'PUBLISHED',
          published_at: '2024-01-01T00:00:00Z',
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-01T00:00:00Z',
          categories: [],
        },
      ];

      mockSupabaseClient.from.mockReturnValue(mockSupabaseClient);
      mockSupabaseClient.select.mockReturnValue(mockSupabaseClient);
      mockSupabaseClient.eq.mockReturnValue(mockSupabaseClient);
      mockSupabaseClient.or.mockReturnValue(mockSupabaseClient);
      mockSupabaseClient.order.mockReturnValue(mockSupabaseClient);
      mockSupabaseClient.limit.mockReturnValue(mockSupabaseClient);
      setMockData({ data: mockResults, error: null, count: 1 });

      await searchPosts(longQuery);

      // Verify the query was trimmed to 100 characters
      expect(mockSupabaseClient.or).toHaveBeenCalledWith(
        expect.stringContaining('a'.repeat(100))
      );
    });

    it('should return empty array when no results found', async () => {
      mockSupabaseClient.from.mockReturnValue(mockSupabaseClient);
      mockSupabaseClient.select.mockReturnValue(mockSupabaseClient);
      mockSupabaseClient.eq.mockReturnValue(mockSupabaseClient);
      mockSupabaseClient.or.mockReturnValue(mockSupabaseClient);
      mockSupabaseClient.order.mockReturnValue(mockSupabaseClient);
      mockSupabaseClient.limit.mockReturnValue(mockSupabaseClient);
      setMockData({ data: [], error: null, count: 0 });

      const result = await searchPosts('nonexistent');

      expect(result.data).toEqual([]);
      expect(result.count).toBe(0);
    });

    it('should handle pagination with cursor', async () => {
      const cursor = '2024-01-01T00:00:00Z';

      mockSupabaseClient.from.mockReturnValue(mockSupabaseClient);
      mockSupabaseClient.select.mockReturnValue(mockSupabaseClient);
      mockSupabaseClient.eq.mockReturnValue(mockSupabaseClient);
      mockSupabaseClient.or.mockReturnValue(mockSupabaseClient);
      mockSupabaseClient.order.mockReturnValue(mockSupabaseClient);
      mockSupabaseClient.limit.mockReturnValue(mockSupabaseClient);
      mockSupabaseClient.lt.mockReturnValue(mockSupabaseClient);
      setMockData({ data: [], error: null, count: 0 });

      await searchPosts('test', { cursor, limit: 10 });

      expect(mockSupabaseClient.lt).toHaveBeenCalledWith('published_at', cursor);
      expect(mockSupabaseClient.limit).toHaveBeenCalledWith(11); // limit + 1 for hasMore check
    });

    it('should set hasMore correctly when more results exist', async () => {
      // Create 11 results (limit + 1)
      const manyResults = Array.from({ length: 11 }, (_, i) => ({
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
      mockSupabaseClient.or.mockReturnValue(mockSupabaseClient);
      mockSupabaseClient.order.mockReturnValue(mockSupabaseClient);
      mockSupabaseClient.limit.mockReturnValue(mockSupabaseClient);
      setMockData({ data: manyResults, error: null, count: 11 });

      const result = await searchPosts('test', { limit: 10 });

      expect(result.data).toHaveLength(10); // Should be limited to 10
      expect(result.hasMore).toBe(true);
      expect(result.nextCursor).toBeDefined();
    });

    it('should search in title, content, and excerpt', async () => {
      mockSupabaseClient.from.mockReturnValue(mockSupabaseClient);
      mockSupabaseClient.select.mockReturnValue(mockSupabaseClient);
      mockSupabaseClient.eq.mockReturnValue(mockSupabaseClient);
      mockSupabaseClient.or.mockReturnValue(mockSupabaseClient);
      mockSupabaseClient.order.mockReturnValue(mockSupabaseClient);
      mockSupabaseClient.limit.mockReturnValue(mockSupabaseClient);
      setMockData({ data: [], error: null, count: 0 });

      await searchPosts('thiền');

      // Should search in all three fields
      expect(mockSupabaseClient.or).toHaveBeenCalledWith(
        expect.stringMatching(/title\.ilike.*content\.ilike.*excerpt\.ilike/)
      );
    });

    it('should return empty array on database error', async () => {
      mockSupabaseClient.from.mockReturnValue(mockSupabaseClient);
      mockSupabaseClient.select.mockReturnValue(mockSupabaseClient);
      mockSupabaseClient.eq.mockReturnValue(mockSupabaseClient);
      mockSupabaseClient.or.mockReturnValue(mockSupabaseClient);
      mockSupabaseClient.order.mockReturnValue(mockSupabaseClient);
      mockSupabaseClient.limit.mockReturnValue(mockSupabaseClient);
      setMockError({ message: 'Database error' });

      const result = await searchPosts('test');

      expect(result.data).toEqual([]);
      expect(result.count).toBe(0);
      expect(result.hasMore).toBe(false);
    });

    it('should filter by published status', async () => {
      mockSupabaseClient.from.mockReturnValue(mockSupabaseClient);
      mockSupabaseClient.select.mockReturnValue(mockSupabaseClient);
      mockSupabaseClient.eq.mockReturnValue(mockSupabaseClient);
      mockSupabaseClient.or.mockReturnValue(mockSupabaseClient);
      mockSupabaseClient.order.mockReturnValue(mockSupabaseClient);
      mockSupabaseClient.limit.mockReturnValue(mockSupabaseClient);
      setMockData({ data: [], error: null, count: 0 });

      await searchPosts('test');

      expect(mockSupabaseClient.eq).toHaveBeenCalledWith('status', 'published');
    });

    it('should order by published_at descending', async () => {
      mockSupabaseClient.from.mockReturnValue(mockSupabaseClient);
      mockSupabaseClient.select.mockReturnValue(mockSupabaseClient);
      mockSupabaseClient.eq.mockReturnValue(mockSupabaseClient);
      mockSupabaseClient.or.mockReturnValue(mockSupabaseClient);
      mockSupabaseClient.order.mockReturnValue(mockSupabaseClient);
      mockSupabaseClient.limit.mockReturnValue(mockSupabaseClient);
      setMockData({ data: [], error: null, count: 0 });

      await searchPosts('test');

      expect(mockSupabaseClient.order).toHaveBeenCalledWith('published_at', {
        ascending: false,
      });
    });
  });
});
