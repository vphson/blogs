import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render } from '@testing-library/react';
import { screen } from '@testing-library/dom';
import { PostContent } from '@/components/public/PostContent';

// Mock DOMPurify
vi.mock('isomorphic-dompurify', () => ({
  default: {
    sanitize: (html: string) => html,
  },
}));

// Mock ReactMarkdown
vi.mock('react-markdown', () => ({
  default: ({ children }: { children: string }) => <div>{children}</div>,
}));

// Mock remarkGfm
vi.mock('remark-gfm', () => ({}));

describe('PostContent Component - User Story 1', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render HTML content from TipTap editor', () => {
    const htmlContent = '<p>This is <strong>HTML</strong> content</p>';
    const { container } = render(<PostContent content={htmlContent} />);

    expect(container.innerHTML).toContain('This is HTML content');
  });

  it('should render markdown content', () => {
    const markdownContent = '# Heading\n\nThis is **markdown** content.';
    render(<PostContent content={markdownContent} />);

    expect(screen.getByText('# Heading')).toBeInTheDocument();
    expect(screen.getByText('This is **markdown** content.')).toBeInTheDocument();
  });

  it('should handle empty content', () => {
    const { container } = render(<PostContent content="" />);
    expect(container.innerHTML).toContain('<div>');
  });

  it('should handle whitespace-only content', () => {
    const { container } = render(<PostContent content="   " />);
    expect(container.innerHTML).toContain('<div>');
  });

  it('should render HTML with links', () => {
    const htmlWithLink = '<p>Check <a href="https://example.com">this link</a></p>';
    const { container } = render(<PostContent content={htmlWithLink} />);

    expect(container.innerHTML).toContain('this link');
  });

  it('should render HTML with images', () => {
    const htmlWithImage = '<p>Image: <img src="test.jpg" alt="Test image"></p>';
    const { container } = render(<PostContent content={htmlWithImage} />);

    const img = container.querySelector('img');
    expect(img).toHaveAttribute('src', 'test.jpg');
    expect(img).toHaveAttribute('alt', 'Test image');
  });

  it('should render HTML with lists', () => {
    const htmlWithList = '<ul><li>Item 1</li><li>Item 2</li></ul>';
    const { container } = render(<PostContent content={htmlWithList} />);

    expect(container.innerHTML).toContain('Item 1');
    expect(container.innerHTML).toContain('Item 2');
  });

  it('should render HTML with blockquotes', () => {
    const htmlWithQuote = '<blockquote>This is a quote</blockquote>';
    const { container } = render(<PostContent content={htmlWithQuote} />);

    expect(container.innerHTML).toContain('This is a quote');
  });

  it('should render HTML with headings', () => {
    const htmlWithHeadings = '<h1>Title</h1><h2>Subtitle</h2>';
    const { container } = render(<PostContent content={htmlWithHeadings} />);

    expect(container.innerHTML).toContain('Title');
    expect(container.innerHTML).toContain('Subtitle');
  });

  it('should detect HTML content correctly', () => {
    const htmlContent = '<p>HTML content</p>';
    const { container: htmlContainer } = render(<PostContent content={htmlContent} />);

    // HTML content uses dangerouslySetInnerHTML
    expect(htmlContainer.innerHTML).toContain('HTML content');
  });

  it('should detect markdown content correctly (not HTML)', () => {
    const markdownContent = '# Markdown Heading';
    render(<PostContent content={markdownContent} />);

    // Markdown content uses ReactMarkdown
    expect(screen.getByText('# Markdown Heading')).toBeInTheDocument();
  });

  it('should handle HTML with code blocks', () => {
    const htmlWithCode = '<p>Code: <code>const x = 1;</code></p>';
    const { container } = render(<PostContent content={htmlWithCode} />);

    expect(container.innerHTML).toContain('const x = 1;');
  });

  it('should handle complex HTML from TipTap', () => {
    const complexHtml = `
      <h2>Blog Post Title</h2>
      <p>This is a paragraph with <strong>bold</strong> and <em>italic</em> text.</p>
      <ul>
        <li>List item 1</li>
        <li>List item 2</li>
      </ul>
      <blockquote>A meaningful quote</blockquote>
    `;
    const { container } = render(<PostContent content={complexHtml} />);

    expect(container.innerHTML).toContain('Blog Post Title');
    expect(container.innerHTML).toContain('bold');
    expect(container.innerHTML).toContain('italic');
    expect(container.innerHTML).toContain('List item 1');
    expect(container.innerHTML).toContain('A meaningful quote');
  });
});
