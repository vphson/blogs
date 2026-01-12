import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { getAllCategories, getCategoryBySlug } from '@/lib/blog/queries';

// Mock the server client
vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(),
}));

import { mockSupabaseClient, resetMock } from '../../mocks/supabase';
import { createClient } from '@/lib/supabase/server';

describe('Category Queries - User Story 4 (Phân Loại)', () => {
  beforeEach(() => {
    resetMock();
  });

  afterEach(() => {
    resetMock();
  });

  describe('getAllCategories', () => {
    it('should return all categories ordered by name', async () => {
      const mockCategories = [
        { id: 'cat-1', name: 'Buddhism', slug: 'buddhism', description: 'Buddhist teachings', created_at: '2024-01-01T00:00:00Z' },
        { id: 'cat-2', name: 'Meditation', slug: 'meditation', description: 'Meditation practices', created_at: '2024-01-01T00:00:00Z' },
        { id: 'cat-3', name: 'Zen', slug: 'zen', description: 'Zen philosophy', created_at: '2024-01-01T00:00:00Z' },
      ];

      vi.mocked(createClient).mockReturnValue(mockSupabaseClient as any);
      mockSupabaseClient.from.mockReturnValue(mockSupabaseClient);
      mockSupabaseClient.select.mockReturnValue(mockSupabaseClient);
      mockSupabaseClient.order.mockReturnValue(Promise.resolve({ data: mockCategories, error: null }));

      const result = await getAllCategories();

      expect(result).toEqual(mockCategories);
    });

    it('should return empty array when no categories exist', async () => {
      vi.mocked(createClient).mockReturnValue(mockSupabaseClient as any);
      mockSupabaseClient.from.mockReturnValue(mockSupabaseClient);
      mockSupabaseClient.select.mockReturnValue(mockSupabaseClient);
      mockSupabaseClient.order.mockReturnValue(Promise.resolve({ data: [], error: null }));

      const result = await getAllCategories();

      expect(result).toEqual([]);
    });

    it('should return empty array on database error', async () => {
      vi.mocked(createClient).mockReturnValue(mockSupabaseClient as any);
      mockSupabaseClient.from.mockReturnValue(mockSupabaseClient);
      mockSupabaseClient.select.mockReturnValue(mockSupabaseClient);
      mockSupabaseClient.order.mockReturnValue(Promise.resolve({ data: null, error: { message: 'Database error' } }));

      const result = await getAllCategories();

      expect(result).toEqual([]);
    });

    it('should return empty array on validation error', async () => {
      vi.mocked(createClient).mockReturnValue(mockSupabaseClient as any);
      mockSupabaseClient.from.mockReturnValue(mockSupabaseClient);
      mockSupabaseClient.select.mockReturnValue(mockSupabaseClient);
      mockSupabaseClient.order.mockReturnValue(Promise.resolve({
        data: [{ invalid: 'data' }],
        error: null,
      }));

      const result = await getAllCategories();

      expect(result).toEqual([]);
    });
  });

  describe('getCategoryBySlug', () => {
    const mockCategory = {
      id: 'cat-1',
      name: 'Buddhism',
      slug: 'buddhism',
      description: 'Buddhist teachings',
      created_at: '2024-01-01T00:00:00Z',
    };

    it('should return category by slug', async () => {
      vi.mocked(createClient).mockReturnValue(mockSupabaseClient as any);
      mockSupabaseClient.from.mockReturnValue(mockSupabaseClient);
      mockSupabaseClient.select.mockReturnValue(mockSupabaseClient);
      mockSupabaseClient.eq.mockReturnValue(mockSupabaseClient);
      mockSupabaseClient.single.mockReturnValue(Promise.resolve({ data: mockCategory, error: null }));

      const result = await getCategoryBySlug('buddhism');

      expect(result).toEqual(mockCategory);
    });

    it('should throw CategoryNotFoundError when category not found', async () => {
      vi.mocked(createClient).mockReturnValue(mockSupabaseClient as any);
      mockSupabaseClient.from.mockReturnValue(mockSupabaseClient);
      mockSupabaseClient.select.mockReturnValue(mockSupabaseClient);
      mockSupabaseClient.eq.mockReturnValue(mockSupabaseClient);
      mockSupabaseClient.single.mockReturnValue(
        Promise.resolve({ data: null, error: { code: 'PGRST116' } })
      );

      await expect(getCategoryBySlug('nonexistent')).rejects.toThrow('Category not found: nonexistent');
    });

    it('should throw DatabaseError on database error', async () => {
      vi.mocked(createClient).mockReturnValue(mockSupabaseClient as any);
      mockSupabaseClient.from.mockReturnValue(mockSupabaseClient);
      mockSupabaseClient.select.mockReturnValue(mockSupabaseClient);
      mockSupabaseClient.eq.mockReturnValue(mockSupabaseClient);
      mockSupabaseClient.single.mockReturnValue(
        Promise.resolve({ data: null, error: { message: 'Connection failed' } })
      );

      await expect(getCategoryBySlug('buddhism')).rejects.toThrow('Failed to fetch category');
    });

    it('should throw CategoryNotFoundError when data is null', async () => {
      vi.mocked(createClient).mockReturnValue(mockSupabaseClient as any);
      mockSupabaseClient.from.mockReturnValue(mockSupabaseClient);
      mockSupabaseClient.select.mockReturnValue(mockSupabaseClient);
      mockSupabaseClient.eq.mockReturnValue(mockSupabaseClient);
      mockSupabaseClient.single.mockReturnValue(Promise.resolve({ data: null, error: null }));

      await expect(getCategoryBySlug('buddhism')).rejects.toThrow('Category not found: buddhism');
    });

    it('should throw DatabaseError on validation error', async () => {
      vi.mocked(createClient).mockReturnValue(mockSupabaseClient as any);
      mockSupabaseClient.from.mockReturnValue(mockSupabaseClient);
      mockSupabaseClient.select.mockReturnValue(mockSupabaseClient);
      mockSupabaseClient.eq.mockReturnValue(mockSupabaseClient);
      mockSupabaseClient.single.mockReturnValue(Promise.resolve({
        data: { invalid: 'data' },
        error: null,
      }));

      await expect(getCategoryBySlug('buddhism')).rejects.toThrow('Category data validation failed');
    });
  });
});
