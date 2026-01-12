import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import { screen } from '@testing-library/dom';
import { Button } from '@/components/ui/Button';

// Mock the useTheme hook
vi.mock('@/lib/design/providers/ThemeProvider', () => ({
  useTheme: vi.fn(() => ({
    tokens: {
      colors: {
        accent: {
          DEFAULT: '#d97706',
          hover: '#b45309',
          subtle: '#fef3c7',
        },
        text: {
          primary: '#1f2937',
          inverse: '#ffffff',
        },
        background: {
          DEFAULT: '#ffffff',
          surface: '#f9fafb',
          elevated: '#ffffff',
        },
        border: {
          DEFAULT: '#e5e7eb',
          strong: '#d1d5db',
        },
      },
    },
  })),
}));

describe('Button Component - User Story 5', () => {
  describe('Rendering', () => {
    it('should render button with text', () => {
      render(<Button>Click me</Button>);

      expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument();
    });

    it('should render button with custom className', () => {
      render(<Button className="custom-class">Click me</Button>);

      expect(screen.getByRole('button')).toHaveClass('custom-class');
    });

    it('should forward ref correctly', () => {
      const ref = { current: null };
      render(<Button ref={ref}>Click me</Button>);

      expect(ref.current).toBeInstanceOf(HTMLButtonElement);
    });
  });

  describe('Variants', () => {
    it('should render primary variant by default', () => {
      render(<Button>Primary</Button>);

      expect(screen.getByRole('button')).toHaveClass('inline-flex');
    });

    it('should render secondary variant', () => {
      render(<Button variant="secondary">Secondary</Button>);

      expect(screen.getByRole('button')).toHaveClass('inline-flex');
    });

    it('should render ghost variant', () => {
      render(<Button variant="ghost">Ghost</Button>);

      expect(screen.getByRole('button')).toHaveClass('bg-transparent');
    });

    it('should render outline variant', () => {
      render(<Button variant="outline">Outline</Button>);

      expect(screen.getByRole('button')).toHaveClass('bg-transparent');
      expect(screen.getByRole('button')).toHaveClass('border');
    });
  });

  describe('Sizes', () => {
    it('should render medium size by default', () => {
      render(<Button>Default</Button>);

      expect(screen.getByRole('button')).toHaveClass('h-10');
    });

    it('should render small size', () => {
      render(<Button size="sm">Small</Button>);

      expect(screen.getByRole('button')).toHaveClass('h-8');
    });

    it('should render large size', () => {
      render(<Button size="lg">Large</Button>);

      expect(screen.getByRole('button')).toHaveClass('h-12');
    });
  });

  describe('Full Width', () => {
    it('should not be full width by default', () => {
      render(<Button>Default</Button>);

      expect(screen.getByRole('button')).not.toHaveClass('w-full');
    });

    it('should be full width when fullWidth is true', () => {
      render(<Button fullWidth>Full Width</Button>);

      expect(screen.getByRole('button')).toHaveClass('w-full');
    });
  });

  describe('Disabled State', () => {
    it('should be disabled when disabled prop is true', () => {
      render(<Button disabled>Disabled</Button>);

      expect(screen.getByRole('button')).toBeDisabled();
    });

    it('should have disabled styles when disabled', () => {
      render(<Button disabled>Disabled</Button>);

      expect(screen.getByRole('button')).toHaveClass('disabled:opacity-50');
      expect(screen.getByRole('button')).toHaveClass('disabled:pointer-events-none');
    });
  });

  describe('HTML Attributes', () => {
    it('should pass through onClick handler', () => {
      const handleClick = vi.fn();
      render(<Button onClick={handleClick}>Click me</Button>);

      const button = screen.getByRole('button');
      button.click();

      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('should pass through type attribute', () => {
      render(<Button type="submit">Submit</Button>);

      expect(screen.getByRole('button')).toHaveAttribute('type', 'submit');
    });

    it('should pass through custom data attributes', () => {
      render(<Button data-testid="custom-button">Custom</Button>);

      expect(screen.getByRole('button')).toHaveAttribute('data-testid', 'custom-button');
    });
  });

  describe('Accessibility', () => {
    it('should have focus-visible styles', () => {
      render(<Button>Focus</Button>);

      expect(screen.getByRole('button')).toHaveClass('focus-visible:outline-none');
      expect(screen.getByRole('button')).toHaveClass('focus-visible:ring-2');
    });

    it('should have transition classes', () => {
      render(<Button>Transition</Button>);

      expect(screen.getByRole('button')).toHaveClass('transition-colors');
    });
  });

  describe('Display Name', () => {
    it('should have displayName set', () => {
      expect(Button.displayName).toBe('Button');
    });
  });
});
