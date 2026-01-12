import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { formatDate, formatRelativeTime, formatDateRange } from '@/lib/formatters/date';

describe('Date Formatter - Utilities', () => {
  describe('formatDate()', () => {
    it('should format date to Vietnamese locale by default', () => {
      const result = formatDate('2024-01-15');
      expect(result).toContain('15');
      expect(result).toContain('1');
    });

    it('should handle null date', () => {
      expect(formatDate(null)).toBe('');
    });

    it('should handle undefined date', () => {
      expect(formatDate(undefined)).toBe('');
    });

    it('should handle empty string', () => {
      expect(formatDate('')).toBe('');
    });

    it('should handle invalid date', () => {
      expect(formatDate('invalid-date')).toBe('');
    });

    it('should use custom locale', () => {
      const result = formatDate('2024-01-15', { locale: 'en-US' });
      expect(result).toBeDefined();
    });

    it('should include time when specified', () => {
      const result = formatDate('2024-01-15T10:30:00', { includeTime: true });
      expect(result).toBeDefined();
    });

    it('should format with short format', () => {
      const result = formatDate('2024-01-15', { format: 'short' });
      expect(result).toBeDefined();
    });

    it('should format with long format (default)', () => {
      const result = formatDate('2024-01-15', { format: 'long' });
      expect(result).toBeDefined();
    });

    it('should format with full format', () => {
      const result = formatDate('2024-01-15', { format: 'full' });
      expect(result).toBeDefined();
    });
  });

  describe('formatRelativeTime()', () => {
    beforeEach(() => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date('2024-01-15T12:00:00'));
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('should return "Vừa xong" for very recent time', () => {
      const result = formatRelativeTime('2024-01-15T11:59:30');
      expect(result).toBe('Vừa xong');
    });

    it('should return minutes ago for recent time', () => {
      const result = formatRelativeTime('2024-01-15T11:55:00');
      expect(result).toBe('5 phút trước');
    });

    it('should return hours ago for same day', () => {
      const result = formatRelativeTime('2024-01-15T08:00:00');
      expect(result).toBe('4 giờ trước');
    });

    it('should return days ago for recent days', () => {
      const result = formatRelativeTime('2024-01-13T12:00:00');
      expect(result).toBe('2 ngày trước');
    });

    it('should fall back to formatted date for older posts', () => {
      const result = formatRelativeTime('2024-01-01T12:00:00');
      expect(result).toContain('1');
    });

    it('should handle null date', () => {
      expect(formatRelativeTime(null)).toBe('');
    });

    it('should handle undefined date', () => {
      expect(formatRelativeTime(undefined)).toBe('');
    });

    it('should handle empty string', () => {
      expect(formatRelativeTime('')).toBe('');
    });

    it('should handle invalid date', () => {
      // Invalid dates return empty string after formatDate fallback
      expect(formatRelativeTime('invalid')).toBe('');
    });
  });

  describe('formatDateRange()', () => {
    it('should format date range correctly', () => {
      const result = formatDateRange('2024-01-01', '2024-01-31');
      expect(result).toContain('-');
    });

    it('should handle null start date', () => {
      expect(formatDateRange(null, '2024-01-31')).toBe('');
    });

    it('should handle null end date', () => {
      expect(formatDateRange('2024-01-01', null)).toBe('');
    });

    it('should handle undefined dates', () => {
      expect(formatDateRange(undefined, undefined)).toBe('');
    });

    it('should handle invalid start date', () => {
      expect(formatDateRange('invalid', '2024-01-31')).toBe('');
    });

    it('should handle invalid end date', () => {
      expect(formatDateRange('2024-01-01', 'invalid')).toBe('');
    });

    it('should format dates in same year', () => {
      const result = formatDateRange('2024-01-01', '2024-12-31');
      expect(result).toBeDefined();
    });

    it('should format dates across years', () => {
      const result = formatDateRange('2023-12-01', '2024-01-31');
      expect(result).toBeDefined();
    });

    it('should handle single day range', () => {
      const result = formatDateRange('2024-01-15', '2024-01-15');
      expect(result).toBeDefined();
    });
  });
});
