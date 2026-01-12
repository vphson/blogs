import { vi } from 'vitest';

// Create a function that returns a mock chain that returns data
const createMockChain = () => {
  let mockData: any = null;
  let mockError: any = null;

  const chain: any = {
    from: vi.fn(function() { return chain; }),
    select: vi.fn(function() { return chain; }),
    insert: vi.fn(function() { return chain; }),
    update: vi.fn(function() { return chain; }),
    delete: vi.fn(function() { return chain; }),
    eq: vi.fn(function() { return chain; }),
    order: vi.fn(function() { return chain; }),
    limit: vi.fn(function() { return chain; }),
    range: vi.fn(function() { return chain; }),
    single: vi.fn(function() { return Promise.resolve(mockData || { data: null, error: null }); }),
    maybeSingle: vi.fn(function() { return Promise.resolve(mockData || { data: null, error: null }); }),
    in: vi.fn(function() { return chain; }),
    gte: vi.fn(function() { return chain; }),
    lt: vi.fn(function() { return chain; }),
    lte: vi.fn(function() { return chain; }),
    ilike: vi.fn(function() { return chain; }),
    or: vi.fn(function() { return chain; }),
    not: vi.fn(function() { return chain; }),
    is: vi.fn(function() { return chain; }),
    textSearch: vi.fn(function() { return chain; }),
    rpc: vi.fn(function() { return chain; }),

    // Auth and storage are always present
    auth: {
      getUser: vi.fn(),
      signInWithPassword: vi.fn(),
      signOut: vi.fn(),
      getSession: vi.fn(),
    },
    storage: {
      from: vi.fn(() => ({
        upload: vi.fn(),
        remove: vi.fn(),
        getPublicUrl: vi.fn(() => ({ publicUrl: 'https://test.com/image.jpg' })),
      })),
    },

    // Helper to set mock data (returns the data on next query)
    _setData: (data: any) => {
      mockData = data;
      mockError = null;
    },

    // Helper to set mock error
    _setError: (error: any) => {
      mockError = error;
      mockData = null;
    },

    // Helper to reset
    _reset: () => {
      mockData = null;
      mockError = null;
    },

    // Make chain thenable to return data when awaited
    then: function (resolve: any) {
      return resolve(mockData || { data: null, error: null });
    },
  };

  return chain;
};

export const mockSupabaseClient = createMockChain();

// Helper to set mock data
export const setMockData = (data: any) => {
  mockSupabaseClient._setData(data);
};

// Helper to set mock error
export const setMockError = (error: any) => {
  mockSupabaseClient._setError(error);
};

// Helper to reset mock
export const resetMock = () => {
  mockSupabaseClient._reset();
};

vi.mock('@/lib/supabase/client', () => ({
  createClient: vi.fn(() => mockSupabaseClient),
}));

vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(() => mockSupabaseClient),
}));
