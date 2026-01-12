import { describe, it, expect } from 'vitest';
import { cn, generateSlug, formatDate as formatDateUtil, truncate, generateExcerpt } from '@/lib/utils';

describe('Utils - Cross-Cutting Functions', () => {
  describe('cn() - Class Name Merger', () => {
    it('should merge class names correctly', () => {
      expect(cn('foo', 'bar')).toBe('foo bar');
    });

    it('should handle conditional classes', () => {
      expect(cn('foo', false && 'bar', 'baz')).toBe('foo baz');
    });

    it('should handle Tailwind conflicts', () => {
      expect(cn('p-4', 'p-2')).toBe('p-2');
    });

    it('should handle arrays of classes', () => {
      expect(cn(['foo', 'bar'], 'baz')).toBe('foo bar baz');
    });

    it('should handle objects with conditional classes', () => {
      expect(cn({ foo: true, bar: false, baz: true })).toBe('foo baz');
    });

    it('should handle empty inputs', () => {
      expect(cn()).toBe('');
    });

    it('should handle null and undefined', () => {
      expect(cn(null, undefined, 'foo')).toBe('foo');
    });

    it('should merge conflicting Tailwind classes', () => {
      expect(cn('text-red-500', 'text-blue-500')).toBe('text-blue-500');
    });
  });

  describe('generateSlug() - URL-friendly Slugs', () => {
    it('should convert Vietnamese to ASCII', () => {
      expect(generateSlug('Thiền')).toBe('thien');
    });

    it('should handle Vietnamese with tone marks', () => {
      expect(generateSlug('Chào mừng')).toBe('chao-mung');
    });

    it('should convert đ to d', () => {
      expect(generateSlug('Đạo')).toBe('dao');
    });

    it('should handle special characters', () => {
      expect(generateSlug('Hello @World!')).toBe('hello-world');
    });

    it('should replace spaces with hyphens', () => {
      expect(generateSlug('hello world')).toBe('hello-world');
    });

    it('should handle multiple spaces', () => {
      expect(generateSlug('hello   world   test')).toBe('hello-world-test');
    });

    it('should remove leading/trailing spaces', () => {
      expect(generateSlug('  hello world  ')).toBe('hello-world');
    });

    it('should handle numbers', () => {
      expect(generateSlug('Test 123')).toBe('test-123');
    });

    it('should convert to lowercase', () => {
      expect(generateSlug('HELLO WORLD')).toBe('hello-world');
    });

    it('should handle multiple hyphens', () => {
      expect(generateSlug('hello--world---test')).toBe('hello-world-test');
    });

    it('should handle Vietnamese complex text', () => {
      expect(generateSlug('Thiền tập mindfulness')).toBe('thien-tap-mindfulness');
    });

    it('should handle empty string', () => {
      expect(generateSlug('')).toBe('');
    });

    it('should handle only special characters', () => {
      expect(generateSlug('@#$%')).toBe('');
    });
  });

  describe('formatDate() - Date Formatting', () => {
    it('should format date to Vietnamese locale', () => {
      const date = new Date('2024-01-15');
      const result = formatDateUtil(date);
      expect(result).toContain('15');
      expect(result).toContain('1');
    });

    it('should handle date string', () => {
      const result = formatDateUtil('2024-01-15');
      expect(result).toBeDefined();
      expect(result.length).toBeGreaterThan(0);
    });

    it('should handle year, month, day format', () => {
      const date = new Date('2024-12-25');
      const result = formatDateUtil(date);
      expect(result).toContain('25');
    });
  });

  describe('truncate() - Text Truncation', () => {
    it('should not truncate text shorter than limit', () => {
      expect(truncate('Hello', 10)).toBe('Hello');
    });

    it('should truncate text longer than limit', () => {
      expect(truncate('Hello World', 5)).toBe('Hello...');
    });

    it('should trim before truncating', () => {
      // After trim: 'Hello World' (11 chars), then truncate to 8: 'Hello Wo' + '...'
      expect(truncate('Hello World  ', 8)).toBe('Hello Wo...');
    });

    it('should handle exact length', () => {
      expect(truncate('Hello', 5)).toBe('Hello');
    });

    it('should handle empty string', () => {
      expect(truncate('', 10)).toBe('');
    });

    it('should handle single word', () => {
      expect(truncate('HelloWorld', 5)).toBe('Hello...');
    });
  });

  describe('generateExcerpt() - Content Excerpts', () => {
    it('should generate excerpt from plain text', () => {
      const content = 'This is a long content that needs to be excerpted for preview purposes';
      const result = generateExcerpt(content, 30);
      expect(result.length).toBeLessThanOrEqual(33); // 30 + '...'
      expect(result.endsWith('...')).toBe(true);
    });

    it('should remove markdown headers', () => {
      const content = '# Title\n\nSome content here';
      const result = generateExcerpt(content, 100);
      expect(result).not.toContain('#');
    });

    it('should remove bold markdown', () => {
      const content = 'This is **bold** text';
      const result = generateExcerpt(content, 100);
      expect(result).not.toContain('**');
    });

    it('should remove italic markdown', () => {
      const content = 'This is *italic* text';
      const result = generateExcerpt(content, 100);
      expect(result).not.toContain('*');
    });

    it('should convert markdown links to text', () => {
      const content = 'Check out [this link](https://example.com)';
      const result = generateExcerpt(content, 100);
      expect(result).toContain('this link');
      expect(result).not.toContain('https://');
    });

    it('should replace newlines with spaces', () => {
      const content = 'Line 1\nLine 2\nLine 3';
      const result = generateExcerpt(content, 100);
      expect(result).not.toContain('\n');
    });

    it('should use default length of 150', () => {
      const longContent = 'a'.repeat(200);
      const result = generateExcerpt(longContent);
      expect(result.length).toBeLessThanOrEqual(153); // 150 + '...'
    });

    it('should handle empty content', () => {
      expect(generateExcerpt('')).toBe('');
    });

    it('should handle content shorter than limit', () => {
      const content = 'Short content';
      const result = generateExcerpt(content, 100);
      expect(result).toBe('Short content');
    });

    it('should trim whitespace', () => {
      const content = '  Content with spaces  ';
      const result = generateExcerpt(content, 100);
      expect(result).not.toMatch(/^  /);
    });
  });
});
