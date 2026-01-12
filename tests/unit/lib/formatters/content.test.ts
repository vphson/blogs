import { describe, it, expect } from 'vitest';
import {
  calculateReadingTime,
  generateExcerpt,
  isHtmlContent,
  stripHtml,
  truncateContent,
  getWordCount,
} from '@/lib/formatters/content';

describe('Content Formatter - Utilities', () => {
  describe('calculateReadingTime()', () => {
    it('should return 0 minutes for empty content', () => {
      expect(calculateReadingTime('')).toBe('0 phút đọc');
    });

    it('should return 0 minutes for null', () => {
      expect(calculateReadingTime(null)).toBe('0 phút đọc');
    });

    it('should return 0 minutes for undefined', () => {
      expect(calculateReadingTime(undefined)).toBe('0 phút đọc');
    });

    it('should return 0 minutes for whitespace only', () => {
      expect(calculateReadingTime('   ')).toBe('0 phút đọc');
    });

    it('should return 1 minute minimum for short content', () => {
      const result = calculateReadingTime('Short content');
      expect(result).toBe('1 phút đọc');
    });

    it('should calculate reading time for Vietnamese text', () => {
      const content = 'Từ '.repeat(100); // ~100 words
      const result = calculateReadingTime(content);
      expect(result).toBe('1 phút đọc');
    });

    it('should calculate for longer content', () => {
      const content = 'word '.repeat(400); // 400 words
      const result = calculateReadingTime(content);
      expect(result).toBe('2 phút đọc');
    });

    it('should use custom words per minute', () => {
      const content = 'word '.repeat(300);
      const result = calculateReadingTime(content, 100);
      expect(result).toBe('3 phút đọc');
    });

    it('should remove HTML tags before calculation', () => {
      const content = '<p>Hello world</p><p>Another paragraph</p>';
      const result = calculateReadingTime(content);
      expect(result).toBe('1 phút đọc');
    });

    it('should handle mixed HTML and text', () => {
      const content = '<div><h1>Title</h1><p>Content with many words here</p></div>';
      const result = calculateReadingTime(content);
      expect(result).toBe('1 phút đọc');
    });
  });

  describe('generateExcerpt()', () => {
    it('should return empty for null', () => {
      expect(generateExcerpt(null)).toBe('');
    });

    it('should return empty for undefined', () => {
      expect(generateExcerpt(undefined)).toBe('');
    });

    it('should return empty for empty string', () => {
      expect(generateExcerpt('')).toBe('');
    });

    it('should return full content if shorter than max length', () => {
      const content = 'Short content';
      expect(generateExcerpt(content, 100)).toBe('Short content');
    });

    it('should truncate long content', () => {
      const content = 'a'.repeat(600);
      const result = generateExcerpt(content, 500);
      expect(result.length).toBe(503); // 500 + '...'
      expect(result.endsWith('...')).toBe(true);
    });

    it('should use default max length of 500', () => {
      const content = 'a'.repeat(600);
      const result = generateExcerpt(content);
      expect(result.length).toBeLessThanOrEqual(503);
    });

    it('should remove HTML tags', () => {
      const content = '<p>Hello <strong>world</strong></p>';
      const result = generateExcerpt(content, 100);
      expect(result).not.toContain('<');
      expect(result).toContain('Hello');
    });

    it('should trim whitespace', () => {
      const content = '   Hello world   ';
      const result = generateExcerpt(content, 100);
      expect(result).not.toMatch(/^   /);
    });
  });

  describe('isHtmlContent()', () => {
    it('should return false for null', () => {
      expect(isHtmlContent(null)).toBe(false);
    });

    it('should return false for undefined', () => {
      expect(isHtmlContent(undefined)).toBe(false);
    });

    it('should return false for empty string', () => {
      expect(isHtmlContent('')).toBe(false);
    });

    it('should return false for whitespace only', () => {
      expect(isHtmlContent('   ')).toBe(false);
    });

    it('should return true for HTML tags', () => {
      expect(isHtmlContent('<p>Hello</p>')).toBe(true);
    });

    it('should return true for div', () => {
      expect(isHtmlContent('<div>Content</div>')).toBe(true);
    });

    it('should return false for plain text', () => {
      expect(isHtmlContent('Just plain text')).toBe(false);
    });

    it('should return false for text not starting with tag', () => {
      expect(isHtmlContent('Hello <p>world</p>')).toBe(false);
    });

    it('should return false for incomplete tag', () => {
      expect(isHtmlContent('<p>Hello')).toBe(false);
    });

    it('should return true for self-closing tags', () => {
      expect(isHtmlContent('<br />')).toBe(true);
    });
  });

  describe('stripHtml()', () => {
    it('should return empty for null', () => {
      expect(stripHtml(null)).toBe('');
    });

    it('should return empty for undefined', () => {
      expect(stripHtml(undefined)).toBe('');
    });

    it('should remove HTML tags', () => {
      expect(stripHtml('<p>Hello world</p>')).toBe('Hello world');
    });

    it('should remove multiple tags', () => {
      expect(stripHtml('<div><h1>Title</h1><p>Content</p></div>')).toBe('TitleContent');
    });

    it('should remove self-closing tags', () => {
      expect(stripHtml('Line 1<br />Line 2')).toBe('Line 1Line 2');
    });

    it('should trim whitespace', () => {
      expect(stripHtml('  <p>Hello</p>  ')).toBe('Hello');
    });

    it('should handle tags with attributes', () => {
      expect(stripHtml('<a href="https://example.com">Link</a>')).toBe('Link');
    });

    it('should handle nested tags', () => {
      expect(stripHtml('<div><p><strong>Bold</strong></p></div>')).toBe('Bold');
    });
  });

  describe('truncateContent()', () => {
    it('should return empty for null', () => {
      expect(truncateContent(null, 100)).toBe('');
    });

    it('should return empty for undefined', () => {
      expect(truncateContent(undefined, 100)).toBe('');
    });

    it('should return full content if shorter than max', () => {
      expect(truncateContent('Short', 100)).toBe('Short');
    });

    it('should truncate to max length', () => {
      expect(truncateContent('Hello World', 5)).toBe('Hello...');
    });

    it('should use default suffix', () => {
      const result = truncateContent('Hello World', 5);
      expect(result).toBe('Hello...');
    });

    it('should use custom suffix', () => {
      expect(truncateContent('Hello World', 5, '***')).toBe('Hello***');
    });

    it('should trim before truncating', () => {
      expect(truncateContent('Hello   World', 8)).toBe('Hello...');
    });

    it('should handle empty suffix', () => {
      expect(truncateContent('Hello World', 5, '')).toBe('Hello');
    });

    it('should handle content with newlines', () => {
      const content = 'Line 1\nLine 2\nLine 3';
      const result = truncateContent(content, 10);
      expect(result.length).toBeLessThanOrEqual(13);
    });
  });

  describe('getWordCount()', () => {
    it('should return 0 for null', () => {
      expect(getWordCount(null)).toBe(0);
    });

    it('should return 0 for undefined', () => {
      expect(getWordCount(undefined)).toBe(0);
    });

    it('should return 0 for empty string', () => {
      expect(getWordCount('')).toBe(0);
    });

    it('should return 0 for whitespace only', () => {
      expect(getWordCount('   ')).toBe(0);
    });

    it('should count words correctly', () => {
      expect(getWordCount('Hello world test')).toBe(3);
    });

    it('should handle multiple spaces', () => {
      expect(getWordCount('Hello    world    test')).toBe(3);
    });

    it('should handle newlines', () => {
      expect(getWordCount('Line 1\nLine 2\nLine 3')).toBe(6);
    });

    it('should remove HTML tags before counting', () => {
      expect(getWordCount('<p>Hello world</p>')).toBe(2);
    });

    it('should handle mixed content', () => {
      // Note: HTML tags are removed, so </div><p> becomes nothing, joining words
      expect(getWordCount('<div>Title</div><p>Some content here</p>')).toBe(3);
    });

    it('should handle Vietnamese text', () => {
      expect(getWordCount('Chào mừng đến với thế giới thiền')).toBe(7);
    });

    it('should handle single word', () => {
      expect(getWordCount('Hello')).toBe(1);
    });

    it('should handle tabs and multiple whitespace types', () => {
      expect(getWordCount('Hello\t\tworld  \n  test')).toBe(3);
    });
  });
});
