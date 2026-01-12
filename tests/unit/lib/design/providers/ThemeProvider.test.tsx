import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render } from '@testing-library/react';
import { waitFor, screen } from '@testing-library/dom';
import { cleanup } from '@testing-library/react';
import { ThemeProvider, useTheme } from '@/lib/design/providers/ThemeProvider';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(global, 'localStorage', {
  value: localStorageMock,
});

// Mock CSS properties
const mockStyle = {
  setProperty: vi.fn(),
};

Object.defineProperty(document, 'documentElement', {
  writable: true,
  value: {
    style: mockStyle,
  },
});

describe('ThemeProvider - User Story 5', () => {
  beforeEach(() => {
    localStorageMock.clear();
    vi.clearAllMocks();
    mockStyle.setProperty.mockClear();
  });

  afterEach(() => {
    cleanup();
    localStorageMock.clear();
  });

  describe('Basic Rendering', () => {
    it('should render children', async () => {
      render(
        <ThemeProvider>
          <div>Test Content</div>
        </ThemeProvider>
      );

      await waitFor(() => {
        expect(screen.getByText('Test Content')).toBeInTheDocument();
      });
    });

    it('should prevent flash of unstyled content before mount', async () => {
      const { container } = render(
        <ThemeProvider>
          <div>Content</div>
        </ThemeProvider>
      );

      await waitFor(() => {
        expect(screen.getByText('Content')).toBeInTheDocument();
        expect(container.firstChild).not.toHaveStyle({ visibility: 'hidden' });
      });
    });
  });

  describe('Theme Context', () => {
    it('should provide theme context', async () => {
      let capturedContext: any;

      const TestComponent = () => {
        capturedContext = useTheme();
        return <div>Test</div>;
      };

      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      await waitFor(() => {
        expect(capturedContext).toBeDefined();
        expect(capturedContext.themeName).toBeDefined();
        expect(capturedContext.tokens).toBeDefined();
        expect(capturedContext.setTheme).toBeInstanceOf(Function);
        expect(capturedContext.availableThemes).toBeInstanceOf(Array);
      });
    });

    it('should throw error when useTheme is used outside provider', () => {
      const originalError = console.error;
      console.error = vi.fn();

      const TestComponent = () => {
        useTheme();
        return <div>Test</div>;
      };

      expect(() => render(<TestComponent />)).toThrow('useTheme must be used within a ThemeProvider');

      console.error = originalError;
    });

    it('should provide default theme', async () => {
      let capturedTheme: any;

      const TestComponent = () => {
        capturedTheme = useTheme();
        return <div>Test</div>;
      };

      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      await waitFor(() => {
        expect(capturedTheme.themeName).toBe('zen');
      });
    });

    it('should provide theme tokens', async () => {
      let capturedTokens: any;

      const TestComponent = () => {
        const { tokens } = useTheme();
        capturedTokens = tokens;
        return <div>Test</div>;
      };

      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      await waitFor(() => {
        expect(capturedTokens).toBeDefined();
        expect(capturedTokens.colors).toBeDefined();
        expect(capturedTokens.typography).toBeDefined();
        expect(capturedTokens.transition).toBeDefined();
      });
    });

    it('should provide available themes', async () => {
      let capturedThemes: any;

      const TestComponent = () => {
        const { availableThemes } = useTheme();
        capturedThemes = availableThemes;
        return <div>Test</div>;
      };

      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      await waitFor(() => {
        expect(capturedThemes.length).toBeGreaterThan(0);
        expect(capturedThemes[0]).toHaveProperty('name');
        expect(capturedThemes[0]).toHaveProperty('label');
      });
    });
  });

  describe('Theme Switching', () => {
    it('should switch theme when setTheme is called', async () => {
      let capturedTheme: any;

      const TestComponent = () => {
        const { themeName, setTheme } = useTheme();
        capturedTheme = themeName;
        return <button onClick={() => setTheme('modern')}>Switch</button>;
      };

      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      await waitFor(() => {
        expect(capturedTheme).toBe('zen');
      });

      const button = screen.getByText('Switch');
      button.click();

      await waitFor(() => {
        expect(capturedTheme).toBe('modern');
      });
    });

    it('should save theme to localStorage when changed', async () => {
      const TestComponent = () => {
        const { setTheme } = useTheme();
        return <button onClick={() => setTheme('modern')}>Switch</button>;
      };

      render(
        <ThemeProvider storageKey="test-theme">
          <TestComponent />
        </ThemeProvider>
      );

      const button = await screen.findByText('Switch');
      button.click();

      await waitFor(() => {
        expect(localStorageMock.getItem('test-theme')).toBe('modern');
      });
    });
  });

  describe('localStorage Integration', () => {
    it('should load theme from localStorage on mount', async () => {
      localStorageMock.setItem('blog-theme', 'modern');

      let capturedTheme: any;

      const TestComponent = () => {
        const { themeName } = useTheme();
        capturedTheme = themeName;
        return <div>Test</div>;
      };

      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      await waitFor(() => {
        expect(capturedTheme).toBe('modern');
      });
    });

    it('should use default theme when localStorage is empty', async () => {
      let capturedTheme: any;

      const TestComponent = () => {
        const { themeName } = useTheme();
        capturedTheme = themeName;
        return <div>Test</div>;
      };

      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      await waitFor(() => {
        expect(capturedTheme).toBe('zen');
      });
    });

    it('should use custom storage key', async () => {
      localStorageMock.setItem('custom-key', 'modern');

      let capturedTheme: any;

      const TestComponent = () => {
        const { themeName } = useTheme();
        capturedTheme = themeName;
        return <div>Test</div>;
      };

      render(
        <ThemeProvider storageKey="custom-key">
          <TestComponent />
        </ThemeProvider>
      );

      await waitFor(() => {
        expect(capturedTheme).toBe('modern');
      });
    });

    it('should ignore invalid theme in localStorage', async () => {
      localStorageMock.setItem('blog-theme', 'invalid-theme');

      let capturedTheme: any;

      const TestComponent = () => {
        const { themeName } = useTheme();
        capturedTheme = themeName;
        return <div>Test</div>;
      };

      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      await waitFor(() => {
        expect(capturedTheme).toBe('zen');
      });
    });
  });

  describe('CSS Variables', () => {
    it('should apply CSS variables to document element', async () => {
      render(
        <ThemeProvider>
          <div>Test</div>
        </ThemeProvider>
      );

      await waitFor(() => {
        expect(mockStyle.setProperty).toHaveBeenCalled();
      });
    });

    it('should apply color CSS variables', async () => {
      render(
        <ThemeProvider>
          <div>Test</div>
        </ThemeProvider>
      );

      await waitFor(() => {
        expect(mockStyle.setProperty).toHaveBeenCalledWith('--background', expect.any(String));
        expect(mockStyle.setProperty).toHaveBeenCalledWith('--text-primary', expect.any(String));
        expect(mockStyle.setProperty).toHaveBeenCalledWith('--accent', expect.any(String));
      });
    });

    it('should apply semantic color CSS variables', async () => {
      render(
        <ThemeProvider>
          <div>Test</div>
        </ThemeProvider>
      );

      await waitFor(() => {
        expect(mockStyle.setProperty).toHaveBeenCalledWith('--success-bg', expect.any(String));
        expect(mockStyle.setProperty).toHaveBeenCalledWith('--error-text', expect.any(String));
      });
    });

    it('should apply typography CSS variables', async () => {
      render(
        <ThemeProvider>
          <div>Test</div>
        </ThemeProvider>
      );

      await waitFor(() => {
        expect(mockStyle.setProperty).toHaveBeenCalledWith('--font-display', expect.any(String));
        expect(mockStyle.setProperty).toHaveBeenCalledWith('--font-body', expect.any(String));
      });
    });
  });

  describe('Default Props', () => {
    it('should use default theme from config', async () => {
      let capturedTheme: any;

      const TestComponent = () => {
        const { themeName } = useTheme();
        capturedTheme = themeName;
        return <div>Test</div>;
      };

      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      await waitFor(() => {
        expect(capturedTheme).toBe('zen');
      });
    });

    it('should override default theme with prop', async () => {
      let capturedTheme: any;

      const TestComponent = () => {
        const { themeName } = useTheme();
        capturedTheme = themeName;
        return <div>Test</div>;
      };

      render(
        <ThemeProvider defaultTheme="modern">
          <TestComponent />
        </ThemeProvider>
      );

      await waitFor(() => {
        expect(capturedTheme).toBe('modern');
      });
    });

    it('should use default storage key', async () => {
      const TestComponent = () => {
        const { setTheme } = useTheme();
        return <button onClick={() => setTheme('modern')}>Switch</button>;
      };

      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      const button = await screen.findByText('Switch');
      button.click();

      await waitFor(() => {
        expect(localStorageMock.getItem('blog-theme')).toBe('modern');
      });
    });
  });

  describe('Theme Re-rendering', () => {
    it('should re-render children when theme changes', async () => {
      const TestComponent = () => {
        const { themeName, setTheme } = useTheme();
        return (
          <div>
            <div>Current theme: {themeName}</div>
            <button onClick={() => setTheme('modern')}>Switch</button>
          </div>
        );
      };

      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      await waitFor(() => {
        expect(screen.getByText(/Current theme:/)).toBeInTheDocument();
      });

      const button = screen.getByText('Switch');
      button.click();

      await waitFor(() => {
        expect(screen.getByText('Current theme: modern')).toBeInTheDocument();
      });
    });
  });
});
