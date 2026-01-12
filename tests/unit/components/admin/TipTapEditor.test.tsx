import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render } from '@testing-library/react';
import { screen } from '@testing-library/dom';
import { TipTapEditor } from '@/components/admin/TipTapEditor';

describe('TipTapEditor Component - User Story 3', () => {
  it('should render editor container', () => {
    const { container } = render(<TipTapEditor />);

    const wrapper = container.querySelector('.border');
    expect(wrapper).toBeInTheDocument();
    expect(wrapper).toHaveClass('border-gray-200', 'rounded-lg');
  });

  it('should render toolbar buttons with correct titles', () => {
    render(<TipTapEditor />);

    // Check for key toolbar buttons
    expect(screen.getByTitle('Hoàn tác (Cmd+Z)')).toBeInTheDocument();
    expect(screen.getByTitle('Làm lại (Cmd+Shift+Z)')).toBeInTheDocument();
    expect(screen.getByTitle('In đậm (Cmd+B)')).toBeInTheDocument();
    expect(screen.getByTitle('In nghiêng (Cmd+I)')).toBeInTheDocument();
    expect(screen.getByTitle('Gạch ngang')).toBeInTheDocument();
  });

  it('should render heading buttons', () => {
    render(<TipTapEditor />);

    expect(screen.getByTitle('Tiêu đề 1')).toBeInTheDocument();
    expect(screen.getByTitle('Tiêu đề 2')).toBeInTheDocument();
    expect(screen.getByTitle('Tiêu đề 3')).toBeInTheDocument();
  });

  it('should render list buttons', () => {
    render(<TipTapEditor />);

    expect(screen.getByTitle('Danh sách')).toBeInTheDocument();
    expect(screen.getByTitle('Danh sách đánh số')).toBeInTheDocument();
    expect(screen.getByTitle('Trích dẫn')).toBeInTheDocument();
  });

  it('should render media buttons', () => {
    render(<TipTapEditor />);

    expect(screen.getByTitle('Thêm liên kết (Cmd+K)')).toBeInTheDocument();
    expect(screen.getByTitle('Thêm ảnh')).toBeInTheDocument();
  });

  it('should have proper styling classes', () => {
    const { container } = render(<TipTapEditor />);

    const wrapper = container.querySelector('.border');
    expect(wrapper).toBeInTheDocument();
    expect(wrapper).toHaveClass('border-gray-200', 'rounded-lg', 'shadow-sm', 'bg-white');
  });

  it('should render stats footer in edit mode', () => {
    render(<TipTapEditor />);

    // Auto-save indicator should be visible
    expect(screen.getByText('Đã lưu tự động')).toBeInTheDocument();
  });

  it('should not render toolbar in readonly mode', () => {
    const { container } = render(<TipTapEditor readonly />);

    // Toolbar should not be rendered (border-b is part of toolbar)
    expect(container.querySelector('.border-b')).toBeNull();
  });

  it('should not render stats footer in readonly mode', () => {
    const { container } = render(<TipTapEditor readonly />);

    // Stats footer should not be rendered (border-t is part of footer)
    expect(container.querySelector('.border-t')).toBeNull();
    expect(screen.queryByText('Đã lưu tự động')).not.toBeInTheDocument();
  });
});
