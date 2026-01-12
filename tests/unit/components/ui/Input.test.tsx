import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import { screen } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';
import { Input } from '@/components/ui/Input';

// Mock the useTheme hook
vi.mock('@/lib/design/providers/ThemeProvider', () => ({
  useTheme: vi.fn(() => ({
    tokens: {
      colors: {
        background: {
          elevated: '#ffffff',
        },
        border: {
          DEFAULT: '#e5e7eb',
        },
        text: {
          primary: '#1f2937',
          muted: '#6b7280',
        },
        accent: {
          DEFAULT: '#d97706',
        },
        semantic: {
          error: {
            border: '#ef4444',
            text: '#dc2626',
          },
        },
      },
    },
  })),
}));

describe('Input Component - User Story 5', () => {
  describe('Rendering', () => {
    it('should render input element', () => {
      render(<Input />);

      expect(screen.getByRole('textbox')).toBeInTheDocument();
    });

    it('should render with custom className', () => {
      render(<Input className="custom-class" />);

      expect(screen.getByRole('textbox')).toHaveClass('custom-class');
    });

    it('should forward ref correctly', () => {
      const ref = { current: null };
      render(<Input ref={ref} />);

      expect(ref.current).toBeInstanceOf(HTMLInputElement);
    });
  });

  describe('Label', () => {
    it('should not render label by default', () => {
      render(<Input />);

      expect(screen.queryByRole('label')).not.toBeInTheDocument();
    });

    it('should render label when provided', () => {
      render(<Input label="Username" />);

      expect(screen.getByText('Username')).toBeInTheDocument();
      expect(screen.getByLabelText('Username')).toBeInTheDocument();
    });

    it('should associate label with input', () => {
      render(<Input label="Email" />);

      const input = screen.getByLabelText('Email');
      expect(input).toBeInTheDocument();
    });

    it('should use custom id when provided', () => {
      render(<Input id="custom-id" label="Custom" />);

      expect(screen.getByLabelText('Custom')).toHaveAttribute('id', 'custom-id');
    });

    it('should generate unique id when not provided', () => {
      render(<Input label="Auto ID" />);

      const input = screen.getByLabelText('Auto ID');
      expect(input).toHaveAttribute('id');
      expect(input?.id).toMatch(/^input-/);
    });
  });

  describe('Error State', () => {
    it('should not show error message by default', () => {
      render(<Input />);

      expect(screen.queryByText(/error/i)).not.toBeInTheDocument();
    });

    it('should show error message when error prop is provided', () => {
      render(<Input error="This field is required" />);

      expect(screen.getByText('This field is required')).toBeInTheDocument();
    });

    it('should have error styles when error is present', () => {
      const { container } = render(<Input error="Error" />);

      const input = container.querySelector('input');
      expect(input?.className).toContain('border-');
    });

    it('should not show helper text when error is present', () => {
      render(<Input helperText="Helper text" error="Error message" />);

      expect(screen.getByText('Error message')).toBeInTheDocument();
      expect(screen.queryByText('Helper text')).not.toBeInTheDocument();
    });
  });

  describe('Helper Text', () => {
    it('should not show helper text by default', () => {
      render(<Input />);

      expect(screen.queryByText(/helper/i)).not.toBeInTheDocument();
    });

    it('should show helper text when provided', () => {
      render(<Input helperText="Enter your email address" />);

      expect(screen.getByText('Enter your email address')).toBeInTheDocument();
    });

    it('should have small text size', () => {
      render(<Input helperText="Helper text" />);

      const helper = screen.getByText('Helper text');
      expect(helper).toHaveClass('text-xs');
    });
  });

  describe('Input Types', () => {
    it('should default to text type', () => {
      render(<Input />);

      // When type is not specified, input defaults to text (has textbox role)
      expect(screen.getByRole('textbox')).toBeInTheDocument();
    });

    it('should render email type', () => {
      render(<Input type="email" />);

      expect(screen.getByRole('textbox')).toHaveAttribute('type', 'email');
    });

    it('should render password type', () => {
      const { container } = render(<Input type="password" />);

      const input = container.querySelector('input[type="password"]');
      expect(input).toBeInTheDocument();
    });

    it('should render number type', () => {
      render(<Input type="number" />);

      const input = screen.getByRole('spinbutton');
      expect(input).toBeInTheDocument();
    });
  });

  describe('User Interactions', () => {
    it('should handle user input', async () => {
      const user = userEvent.setup();
      render(<Input />);

      const input = screen.getByRole('textbox');
      await user.type(input, 'Hello World');

      expect(input).toHaveValue('Hello World');
    });

    it('should call onChange callback', async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();
      render(<Input onChange={handleChange} />);

      const input = screen.getByRole('textbox');
      await user.type(input, 'test');

      expect(handleChange).toHaveBeenCalled();
    });
  });

  describe('Disabled State', () => {
    it('should be disabled when disabled prop is true', () => {
      render(<Input disabled />);

      expect(screen.getByRole('textbox')).toBeDisabled();
    });

    it('should have disabled styles', () => {
      render(<Input disabled />);

      expect(screen.getByRole('textbox')).toHaveClass('disabled:cursor-not-allowed');
      expect(screen.getByRole('textbox')).toHaveClass('disabled:opacity-50');
    });
  });

  describe('Placeholder', () => {
    it('should show placeholder when provided', () => {
      render(<Input placeholder="Enter text" />);

      expect(screen.getByPlaceholderText('Enter text')).toBeInTheDocument();
    });
  });

  describe('HTML Attributes', () => {
    it('should pass through name attribute', () => {
      render(<Input name="username" />);

      expect(screen.getByRole('textbox')).toHaveAttribute('name', 'username');
    });

    it('should pass through required attribute', () => {
      render(<Input required />);

      expect(screen.getByRole('textbox')).toBeRequired();
    });

    it('should pass through autoComplete attribute', () => {
      render(<Input autoComplete="off" />);

      expect(screen.getByRole('textbox')).toHaveAttribute('autoComplete', 'off');
    });

    it('should pass through min and max for number input', () => {
      render(<Input type="number" min={0} max={100} />);

      const input = screen.getByRole('spinbutton');
      expect(input).toHaveAttribute('min', '0');
      expect(input).toHaveAttribute('max', '100');
    });
  });

  describe('Accessibility', () => {
    it('should have focus-visible styles', () => {
      render(<Input />);

      expect(screen.getByRole('textbox')).toHaveClass('focus-visible:outline-none');
      expect(screen.getByRole('textbox')).toHaveClass('focus-visible:ring-2');
    });

    it('should have transition classes', () => {
      render(<Input />);

      expect(screen.getByRole('textbox')).toHaveClass('transition-colors');
    });
  });

  describe('Display Name', () => {
    it('should have displayName set', () => {
      expect(Input.displayName).toBe('Input');
    });
  });
});
