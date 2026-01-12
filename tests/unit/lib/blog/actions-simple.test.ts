import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  createPost,
  updatePost,
  deletePost,
  publishPost,
  unpublishPost,
  getCategoriesForAdmin,
} from '@/lib/blog/actions';

// Mock the server client with a simple inline mock
const createMockSupabase = (user: any = null, error: any = null) => ({
  auth: {
    getUser: vi.fn().mockResolvedValue({
      data: { user },
      error: null,
    }),
  },
  from: vi.fn(() => ({
    select: vi.fn(() => ({
      eq: vi.fn(() => ({
        single: vi.fn(() => Promise.resolve({ data: user ? { id: 'post-123', author_id: user?.id || 'other', status: 'DRAFT' } : null, error })),
      })),
      order: vi.fn(() => Promise.resolve({ data: [], error })),
    })),
    insert: vi.fn(() => ({
      select: vi.fn(() => ({
        single: vi.fn(() => Promise.resolve({ data: { id: '1', ...user }, error })),
      })),
    })),
    update: vi.fn(() => ({
      eq: vi.fn(() => ({
        select: vi.fn(() => ({
          single: vi.fn(() => Promise.resolve({ data: { id: '1' }, error })),
        })),
      })),
    })),
    delete: vi.fn(() => Promise.resolve({ error: null })),
  })),
});

vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(),
}));

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}));

vi.mock('@/lib/utils', () => ({
  generateSlug: vi.fn((title: string) => title.toLowerCase().replace(/\s+/g, '-')),
  generateExcerpt: vi.fn((content: string) => content.slice(0, 100) + '...'),
}));

import { createClient } from '@/lib/supabase/server';

describe('Admin Actions - User Story 3 (Simplified Tests)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return unauthorized when user is not authenticated', async () => {
    vi.mocked(createClient).mockReturnValue(createMockSupabase(null) as any);

    const result = await createPost({
      title: 'Test',
      content: 'Content',
      status: 'DRAFT',
      cover_image: null,
      category_ids: [],
    } as any);

    expect(result.success).toBe(false);
    expect(result.error).toBe('Unauthorized');
  });

  it('should create post successfully for authenticated user', async () => {
    const mockUser = { id: 'user-123' };
    vi.mocked(createClient).mockReturnValue(createMockSupabase(mockUser) as any);

    const result = await createPost({
      title: 'Test',
      content: 'Content',
      status: 'DRAFT',
      cover_image: null,
      category_ids: [],
    } as any);

    expect(result.success).toBe(true);
    expect(result.data).toBeDefined();
  });

  it('should publish post successfully', async () => {
    const mockUser = { id: 'user-123' };
    vi.mocked(createClient).mockReturnValue(createMockSupabase(mockUser) as any);

    const result = await publishPost('post-123');

    expect(result.success).toBe(true);
  });

  it('should unpublish post successfully', async () => {
    const mockUser = { id: 'user-123' };
    vi.mocked(createClient).mockReturnValue(createMockSupabase(mockUser) as any);

    const result = await unpublishPost('post-123');

    expect(result.success).toBe(true);
  });

  it('should delete post successfully', async () => {
    const mockUser = { id: 'user-123' };
    vi.mocked(createClient).mockReturnValue(createMockSupabase(mockUser) as any);

    const result = await deletePost('post-123');

    expect(result.success).toBe(true);
  });

  it('should get categories for admin', async () => {
    const mockUser = { id: 'user-123' };
    const mockClient = createMockSupabase(mockUser) as any;

    // Mock the categories query
    mockClient.from.mockReturnValue({
      select: vi.fn(() => ({
        order: vi.fn(() => Promise.resolve({ data: [
          { id: 'cat-1', name: 'Buddhism', slug: 'buddhism' },
        ], error: null })),
      })),
    });

    vi.mocked(createClient).mockReturnValue(mockClient);

    const result = await getCategoriesForAdmin();

    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('Buddhism');
  });

  it('should return forbidden when user does not own post (update)', async () => {
    const mockUser = { id: 'user-123' };
    const mockClient = createMockSupabase(mockUser) as any;

    // Mock that post belongs to different user
    mockClient.from.mockReturnValue({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          single: vi.fn(() => Promise.resolve({ data: { id: 'post-123', author_id: 'user-123' }, error: null })),
        })),
      })),
    });

    vi.mocked(createClient).mockReturnValue(mockClient);

    const result = await updatePost({
      id: 'post-123',
      title: 'Updated',
      content: 'Updated content',
      status: 'DRAFT',
    } as any);

    expect(result.success).toBe(false);
    expect(result.error).toContain('Forbidden');
  });
});
