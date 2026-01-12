import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import { screen } from '@testing-library/dom';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/Card';

// Mock the useTheme hook
vi.mock('@/lib/design/providers/ThemeProvider', () => ({
  useTheme: vi.fn(() => ({
    tokens: {
      colors: {
        background: {
          DEFAULT: '#ffffff',
          surface: '#f9fafb',
          elevated: '#ffffff',
        },
        border: {
          DEFAULT: '#e5e7eb',
          strong: '#d1d5db',
        },
        accent: {
          DEFAULT: '#d97706',
        },
      },
    },
  })),
}));

describe('Card Component - User Story 5', () => {
  describe('Card Root', () => {
    it('should render card with children', () => {
      render(<Card>Card content</Card>);

      expect(screen.getByText('Card content')).toBeInTheDocument();
    });

    it('should render with custom className', () => {
      const { container } = render(<Card className="custom-class">Content</Card>);

      expect(container.querySelector('.custom-class')).toBeInTheDocument();
    });

    it('should forward ref correctly', () => {
      const ref = { current: null };
      render(<Card ref={ref}>Content</Card>);

      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });

    it('should have rounded corners', () => {
      const { container } = render(<Card>Content</Card>);

      expect(container.querySelector('.rounded-lg')).toBeInTheDocument();
    });

    it('should have transition classes', () => {
      const { container } = render(<Card>Content</Card>);

      const card = container.firstChild as HTMLElement;
      expect(card.className).toContain('transition-all');
      expect(card.className).toContain('duration-200');
    });
  });

  describe('Card Variants', () => {
    it('should render default variant', () => {
      const { container } = render(<Card variant="default">Default</Card>);

      const card = container.firstChild as HTMLElement;
      expect(card.className).toContain('border');
    });

    it('should render elevated variant', () => {
      const { container } = render(<Card variant="elevated">Elevated</Card>);

      expect(container.querySelector('.shadow-md')).toBeInTheDocument();
    });

    it('should render outlined variant', () => {
      const { container } = render(<Card variant="outlined">Outlined</Card>);

      const card = container.firstChild as HTMLElement;
      expect(card.className).toContain('border-2');
    });
  });

  describe('Hoverable State', () => {
    it('should not be hoverable by default', () => {
      const { container } = render(<Card>Not hoverable</Card>);

      const card = container.firstChild as HTMLElement;
      expect(card.className).not.toContain('hover:shadow-lg');
      expect(card.className).not.toContain('cursor-pointer');
    });

    it('should be hoverable when hoverable is true', () => {
      const { container } = render(<Card hoverable>Hoverable</Card>);

      const card = container.firstChild as HTMLElement;
      expect(card.className).toContain('hover:shadow-lg');
      expect(card.className).toContain('cursor-pointer');
    });
  });

  describe('CardHeader', () => {
    it('should render header with proper padding', () => {
      render(<CardHeader>Header</CardHeader>);

      expect(screen.getByText('Header')).toHaveClass('p-6');
    });

    it('should render with flex column layout', () => {
      render(<CardHeader>Header</CardHeader>);

      expect(screen.getByText('Header')).toHaveClass('flex');
      expect(screen.getByText('Header')).toHaveClass('flex-col');
    });

    it('should accept custom className', () => {
      render(<CardHeader className="custom-header">Header</CardHeader>);

      expect(screen.getByText('Header')).toHaveClass('custom-header');
    });
  });

  describe('CardTitle', () => {
    it('should render as h3 element', () => {
      render(<CardTitle>Title</CardTitle>);

      expect(screen.getByText('Title').tagName).toBe('H3');
    });

    it('should have proper text styles', () => {
      render(<CardTitle>Card Title</CardTitle>);

      const title = screen.getByText('Card Title');
      expect(title).toHaveClass('text-2xl');
      expect(title).toHaveClass('font-semibold');
    });

    it('should accept custom className', () => {
      render(<CardTitle className="custom-title">Title</CardTitle>);

      expect(screen.getByText('Title')).toHaveClass('custom-title');
    });
  });

  describe('CardDescription', () => {
    it('should render as paragraph element', () => {
      render(<CardDescription>Description</CardDescription>);

      expect(screen.getByText('Description').tagName).toBe('P');
    });

    it('should have muted text color', () => {
      render(<CardDescription>Description</CardDescription>);

      expect(screen.getByText('Description')).toHaveClass('text-muted-foreground');
    });

    it('should have small text size', () => {
      render(<CardDescription>Description</CardDescription>);

      expect(screen.getByText('Description')).toHaveClass('text-sm');
    });

    it('should accept custom className', () => {
      render(<CardDescription className="custom-desc">Description</CardDescription>);

      expect(screen.getByText('Description')).toHaveClass('custom-desc');
    });
  });

  describe('CardContent', () => {
    it('should render content with proper padding', () => {
      render(<CardContent>Content</CardContent>);

      expect(screen.getByText('Content')).toHaveClass('p-6');
    });

    it('should have no top padding', () => {
      render(<CardContent>Content</CardContent>);

      expect(screen.getByText('Content')).toHaveClass('pt-0');
    });

    it('should accept custom className', () => {
      render(<CardContent className="custom-content">Content</CardContent>);

      expect(screen.getByText('Content')).toHaveClass('custom-content');
    });
  });

  describe('CardFooter', () => {
    it('should render footer with proper padding', () => {
      render(<CardFooter>Footer</CardFooter>);

      expect(screen.getByText('Footer')).toHaveClass('p-6');
    });

    it('should have no top padding', () => {
      render(<CardFooter>Footer</CardFooter>);

      expect(screen.getByText('Footer')).toHaveClass('pt-0');
    });

    it('should have flex layout', () => {
      render(<CardFooter>Footer</CardFooter>);

      expect(screen.getByText('Footer')).toHaveClass('flex');
    });

    it('should accept custom className', () => {
      render(<CardFooter className="custom-footer">Footer</CardFooter>);

      expect(screen.getByText('Footer')).toHaveClass('custom-footer');
    });
  });

  describe('Complete Card Composition', () => {
    it('should render complete card structure', () => {
      render(
        <Card>
          <CardHeader>
            <CardTitle>Card Title</CardTitle>
            <CardDescription>Card Description</CardDescription>
          </CardHeader>
          <CardContent>Card Content</CardContent>
          <CardFooter>Card Footer</CardFooter>
        </Card>
      );

      expect(screen.getByText('Card Title')).toBeInTheDocument();
      expect(screen.getByText('Card Description')).toBeInTheDocument();
      expect(screen.getByText('Card Content')).toBeInTheDocument();
      expect(screen.getByText('Card Footer')).toBeInTheDocument();
    });
  });

  describe('Display Names', () => {
    it('should have displayName set for all components', () => {
      expect(Card.displayName).toBe('Card');
      expect(CardHeader.displayName).toBe('CardHeader');
      expect(CardTitle.displayName).toBe('CardTitle');
      expect(CardDescription.displayName).toBe('CardDescription');
      expect(CardContent.displayName).toBe('CardContent');
      expect(CardFooter.displayName).toBe('CardFooter');
    });
  });
});
