import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import { screen } from '@testing-library/dom';
import { CategoryList } from '@/components/public/CategoryList';
import type { Category } from '@/lib/types/blog';

// Mock CategoryBadge component
vi.mock('@/components/public/CategoryBadge', () => ({
  CategoryBadge: ({ category, variant, linkable }: any) => (
    <span data-testid={`category-${category.slug}`} data-variant={variant} data-linkable={linkable}>
      {category.name}
    </span>
  ),
}));

describe('CategoryList Component - User Story 4', () => {
  const mockCategories: Category[] = [
    { id: 'cat-1', name: 'Buddhism', slug: 'buddhism', description: 'Buddhist teachings'},
    { id: 'cat-2', name: 'Meditation', slug: 'meditation', description: 'Meditation practices'},
    { id: 'cat-3', name: 'Zen', slug: 'zen', description: 'Zen philosophy'},
  ];

  it('should render all categories', () => {
    render(<CategoryList categories={mockCategories} />);

    expect(screen.getByTestId('category-buddhism')).toBeInTheDocument();
    expect(screen.getByTestId('category-meditation')).toBeInTheDocument();
    expect(screen.getByTestId('category-zen')).toBeInTheDocument();
  });

  it('should return null when categories array is empty', () => {
    const { container } = render(<CategoryList categories={[]} />);

    expect(container.firstChild).toBeNull();
  });

  it('should return null when categories is null or undefined', () => {
    const { container: container1 } = render(<CategoryList categories={null as any} />);
    const { container: container2 } = render(<CategoryList categories={undefined as any} />);

    expect(container1.firstChild).toBeNull();
    expect(container2.firstChild).toBeNull();
  });

  it('should limit displayed categories with maxDisplay prop', () => {
    render(<CategoryList categories={mockCategories} maxDisplay={2} />);

    expect(screen.getByTestId('category-buddhism')).toBeInTheDocument();
    expect(screen.getByTestId('category-meditation')).toBeInTheDocument();
    expect(screen.queryByTestId('category-zen')).not.toBeInTheDocument();
  });

  it('should show "+N" indicator when categories exceed maxDisplay', () => {
    render(<CategoryList categories={mockCategories} maxDisplay={2} />);

    expect(screen.getByText('+1')).toBeInTheDocument();
  });

  it('should not show "+N" indicator when all categories are displayed', () => {
    render(<CategoryList categories={mockCategories} maxDisplay={5} />);

    expect(screen.queryByText(/\+\d/)).not.toBeInTheDocument();
  });

  it('should pass variant prop to CategoryBadge', () => {
    render(<CategoryList categories={mockCategories} variant="muted" />);

    expect(screen.getByTestId('category-buddhism')).toHaveAttribute('data-variant', 'muted');
  });

  it('should default variant to "default"', () => {
    render(<CategoryList categories={mockCategories} />);

    expect(screen.getByTestId('category-buddhism')).toHaveAttribute('data-variant', 'default');
  });

  it('should pass linkable prop to CategoryBadge', () => {
    render(<CategoryList categories={mockCategories} linkable={true} />);

    expect(screen.getByTestId('category-buddhism')).toHaveAttribute('data-linkable', 'true');
  });

  it('should render categories in flex container with gap', () => {
    const { container } = render(<CategoryList categories={mockCategories} />);

    const wrapper = container.querySelector('.flex.flex-wrap.gap-2');
    expect(wrapper).toBeInTheDocument();
  });
});
