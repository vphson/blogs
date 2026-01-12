import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SearchBar } from '@/components/public/SearchBar';

// Mock Next.js router
const mockPush = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    replace: vi.fn(),
    prefetch: vi.fn(),
    pathname: '/',
    query: {},
  }),
}));

describe('SearchBar Component - User Story 2', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render search button in collapsed state', () => {
    render(<SearchBar />);

    expect(screen.getByText('Tìm kiếm')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /tìm kiếm/i })).toBeInTheDocument();
  });

  it('should expand when search button is clicked', async () => {
    const user = userEvent.setup();
    render(<SearchBar />);

    const searchButton = screen.getByRole('button', { name: /tìm kiếm/i });
    await user.click(searchButton);

    expect(screen.getByPlaceholderText('Tìm kiếm bài viết...')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /đóng/i })).toBeInTheDocument();
  });

  it('should navigate to search page when form is submitted', async () => {
    const user = userEvent.setup();
    render(<SearchBar />);

    // Expand the search bar
    const searchButton = screen.getByRole('button', { name: /tìm kiếm/i });
    await user.click(searchButton);

    // Type a query
    const input = screen.getByPlaceholderText('Tìm kiếm bài viết...');
    await user.type(input, 'thiền');

    // Submit the form (press Enter)
    await user.keyboard('{Enter}');

    expect(mockPush).toHaveBeenCalledWith('/tim-kiem?q=thiền');
  });

  it('should not navigate with empty query', async () => {
    const user = userEvent.setup();
    render(<SearchBar />);

    const searchButton = screen.getByRole('button', { name: /tìm kiếm/i });
    await user.click(searchButton);

    const input = screen.getByPlaceholderText('Tìm kiếm bài viết...');

    // Try to submit with empty input
    await user.type(input, '{Enter}');

    expect(mockPush).not.toHaveBeenCalled();
  });

  it('should show clear button when text is entered', async () => {
    const user = userEvent.setup();
    render(<SearchBar />);

    const searchButton = screen.getByRole('button', { name: /tìm kiếm/i });
    await user.click(searchButton);

    const input = screen.getByPlaceholderText('Tìm kiếm bài viết...');
    await user.type(input, 'test query');

    // Should show clear button (X button)
    expect(screen.getAllByRole('button', { name: /xóa/i }).length).toBeGreaterThan(0);
  });

  it('should clear input when clear button is clicked', async () => {
    const user = userEvent.setup();
    render(<SearchBar />);

    const searchButton = screen.getByRole('button', { name: /tìm kiếm/i });
    await user.click(searchButton);

    const input = screen.getByPlaceholderText('Tìm kiếm bài viết...') as HTMLInputElement;
    await user.type(input, 'test query');

    // Click the clear button (first X button is for clearing input)
    const clearButtons = screen.getAllByRole('button', { name: /xóa/i });
    await user.click(clearButtons[0]);

    expect(input.value).toBe('');
  });

  it('should close when close button is clicked', async () => {
    const user = userEvent.setup();
    render(<SearchBar />);

    // Expand the search bar
    const searchButton = screen.getByRole('button', { name: /tìm kiếm/i });
    await user.click(searchButton);

    expect(screen.getByPlaceholderText('Tìm kiếm bài viết...')).toBeInTheDocument();

    // Click the close button (last X button)
    const closeButton = screen.getAllByRole('button', { name: /đóng/i })[0];
    await user.click(closeButton);

    // Should be back to collapsed state
    expect(screen.queryByPlaceholderText('Tìm kiếm bài viết...')).not.toBeInTheDocument();
    expect(screen.getByText('Tìm kiếm')).toBeInTheDocument();
  });

  it('should show keyboard shortcut hint (⌘K)', () => {
    render(<SearchBar />);

    // Should show the keyboard shortcut hint
    expect(screen.getByText('⌘K')).toBeInTheDocument();
  });

  it('should trim whitespace from query before navigation', async () => {
    const user = userEvent.setup();
    render(<SearchBar />);

    const searchButton = screen.getByRole('button', { name: /tìm kiếm/i });
    await user.click(searchButton);

    const input = screen.getByPlaceholderText('Tìm kiếm bài viết...');
    await user.type(input, '  thiền  ');

    await user.keyboard('{Enter}');

    expect(mockPush).toHaveBeenCalledWith('/tim-kiem?q=thiền');
  });

  it('should collapse after successful search', async () => {
    const user = userEvent.setup();
    render(<SearchBar />);

    const searchButton = screen.getByRole('button', { name: /tìm kiếm/i });
    await user.click(searchButton);

    const input = screen.getByPlaceholderText('Tìm kiếm bài viết...');
    await user.type(input, 'test');

    await user.keyboard('{Enter}');

    // After navigation, should be collapsed again
    await waitFor(() => {
      expect(screen.queryByPlaceholderText('Tìm kiếm bài viết...')).not.toBeInTheDocument();
    });
  });

  it('should handle Ctrl+K keyboard shortcut', async () => {
    render(<SearchBar />);

    // Initially collapsed
    expect(screen.queryByPlaceholderText('Tìm kiếm bài viết...')).not.toBeInTheDocument();

    // Press Ctrl+K
    await userEvent.keyboard('{Control>}k');

    // Should expand
    expect(screen.getByPlaceholderText('Tìm kiếm bài viết...')).toBeInTheDocument();
  });

  it('should handle Escape key to close', async () => {
    const user = userEvent.setup();
    render(<SearchBar />);

    // First expand
    const searchButton = screen.getByRole('button', { name: /tìm kiếm/i });
    await user.click(searchButton);

    expect(screen.getByPlaceholderText('Tìm kiếm bài viết...')).toBeInTheDocument();

    // Press Escape
    await userEvent.keyboard('{Escape}');

    // Should close
    expect(screen.queryByPlaceholderText('Tìm kiếm bài viết...')).not.toBeInTheDocument();
  });
});
