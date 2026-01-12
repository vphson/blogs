import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import { screen } from '@testing-library/dom';
import { Badge } from '@/components/ui/Badge';

// Mock the useTheme hook
vi.mock('@/lib/design/providers/ThemeProvider', () => ({
  useTheme: vi.fn(() => ({
    tokens: {
      colors: {
        background: {
          DEFAULT: '#ffffff',
          surface: '#f9fafb',
        },
        text: {
          primary: '#1f2937',
          muted: '#6b7280',
        },
        border: {
          DEFAULT: '#e5e7eb',
        },
        accent: {
          DEFAULT: '#d97706',
          subtle: '#fef3c7',
        },
        semantic: {
          success: {
            bg: '#dcfce7',
            text: '#166534',
          },
          warning: {
            bg: '#fef3c7',
            text: '#92400e',
          },
          error: {
            bg: '#fee2e2',
            text: '#991b1b',
          },
          info: {
            bg: '#dbeafe',
            text: '#1e40af',
          },
        },
      },
    },
  })),
}));

describe('Badge Component - User Story 5', () => {
  describe('Rendering', () => {
    it('should render badge with text', () => {
      render(<Badge>New</Badge>);

      expect(screen.getByText('New')).toBeInTheDocument();
    });

    it('should render with custom className', () => {
      render(<Badge className="custom-class">Badge</Badge>);

      expect(screen.getByText('Badge')).toHaveClass('custom-class');
    });

    it('should forward ref correctly', () => {
      const ref = { current: null };
      render(<Badge ref={ref}>Badge</Badge>);

      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });

    it('should render as div element', () => {
      render(<Badge>Badge</Badge>);

      const badge = screen.getByText('Badge');
      expect(badge.tagName).toBe('DIV');
    });
  });

  describe('Variants', () => {
    it('should render default variant', () => {
      render(<Badge variant="default">Default</Badge>);

      const badge = screen.getByText('Default');
      expect(badge).toHaveClass('inline-flex');
    });

    it('should render success variant', () => {
      render(<Badge variant="success">Success</Badge>);

      expect(screen.getByText('Success')).toBeInTheDocument();
    });

    it('should render warning variant', () => {
      render(<Badge variant="warning">Warning</Badge>);

      expect(screen.getByText('Warning')).toBeInTheDocument();
    });

    it('should render error variant', () => {
      render(<Badge variant="error">Error</Badge>);

      expect(screen.getByText('Error')).toBeInTheDocument();
    });

    it('should render info variant', () => {
      render(<Badge variant="info">Info</Badge>);

      expect(screen.getByText('Info')).toBeInTheDocument();
    });

    it('should render accent variant', () => {
      render(<Badge variant="accent">Accent</Badge>);

      expect(screen.getByText('Accent')).toBeInTheDocument();
    });

    it('should render muted variant', () => {
      render(<Badge variant="muted">Muted</Badge>);

      expect(screen.getByText('Muted')).toBeInTheDocument();
    });
  });

  describe('Sizes', () => {
    it('should render medium size by default', () => {
      render(<Badge>Default</Badge>);

      const badge = screen.getByText('Default');
      expect(badge).toHaveClass('text-sm');
    });

    it('should render small size', () => {
      render(<Badge size="sm">Small</Badge>);

      const badge = screen.getByText('Small');
      expect(badge).toHaveClass('text-xs');
    });

    it('should render large size', () => {
      render(<Badge size="lg">Large</Badge>);

      const badge = screen.getByText('Large');
      expect(badge).toHaveClass('text-base');
    });
  });

  describe('Styling', () => {
    it('should have rounded corners', () => {
      render(<Badge>Rounded</Badge>);

      const badge = screen.getByText('Rounded');
      expect(badge).toHaveClass('rounded-full');
    });

    it('should have font-medium weight', () => {
      render(<Badge>Medium</Badge>);

      const badge = screen.getByText('Medium');
      expect(badge).toHaveClass('font-medium');
    });

    it('should have inline-flex layout', () => {
      render(<Badge>Flex</Badge>);

      const badge = screen.getByText('Flex');
      expect(badge).toHaveClass('inline-flex');
    });

    it('should have transition classes', () => {
      render(<Badge>Transition</Badge>);

      const badge = screen.getByText('Transition');
      expect(badge).toHaveClass('transition-colors');
    });

    it('should have center alignment', () => {
      render(<Badge>Centered</Badge>);

      const badge = screen.getByText('Centered');
      expect(badge).toHaveClass('items-center');
      expect(badge).toHaveClass('justify-center');
    });
  });

  describe('HTML Attributes', () => {
    it('should pass through onClick handler', () => {
      const handleClick = vi.fn();
      render(<Badge onClick={handleClick}>Clickable</Badge>);

      const badge = screen.getByText('Clickable');
      badge.click();

      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('should pass through custom data attributes', () => {
      render(<Badge data-testid="custom-badge">Custom</Badge>);

      expect(screen.getByTestId('custom-badge')).toBeInTheDocument();
    });

    it('should pass through title attribute', () => {
      render(<Badge title="Badge tooltip">Badge</Badge>);

      expect(screen.getByText('Badge')).toHaveAttribute('title', 'Badge tooltip');
    });
  });

  describe('Complex Content', () => {
    it('should render with icon', () => {
      render(
        <Badge>
          <span data-testid="icon">★</span>
          Featured
        </Badge>
      );

      expect(screen.getByTestId('icon')).toBeInTheDocument();
      expect(screen.getByText('Featured')).toBeInTheDocument();
    });

    it('should render with number', () => {
      render(<Badge>42</Badge>);

      expect(screen.getByText('42')).toBeInTheDocument();
    });

    it('should render with nested elements', () => {
      render(
        <Badge>
          <strong>Bold</strong> Badge
        </Badge>
      );

      expect(screen.getByText('Bold')).toBeInTheDocument();
      expect(screen.getByText(/Badge/)).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should be clickable when onClick is provided', () => {
      const handleClick = vi.fn();
      render(<Badge onClick={handleClick}>Clickable Badge</Badge>);

      const badge = screen.getByText('Clickable Badge');
      badge.click();

      expect(handleClick).toHaveBeenCalled();
    });
  });

  describe('Display Name', () => {
    it('should have displayName set', () => {
      expect(Badge.displayName).toBe('Badge');
    });
  });

  describe('Edge Cases', () => {
    it('should render empty badge', () => {
      const { container } = render(<Badge></Badge>);

      const badge = container.querySelector('div');
      expect(badge).toBeInTheDocument();
      expect(badge).toHaveTextContent('');
    });

    it('should render with very long text', () => {
      render(<Badge>This is a very long badge text that should still render properly</Badge>);

      expect(screen.getByText('This is a very long badge text that should still render properly')).toBeInTheDocument();
    });

    it('should render with special characters', () => {
      render(<Badge>Special: @#$%</Badge>);

      expect(screen.getByText('Special: @#$%')).toBeInTheDocument();
    });
  });
});
