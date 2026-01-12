'use client';

import { useState, useCallback } from 'react';

interface ImageUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddImage: (url: string) => void;
}

export function ImageUploadModal({ isOpen, onClose, onAddImage }: ImageUploadModalProps) {
  const [imageUrl, setImageUrl] = useState('');

  const handleAddImage = useCallback(() => {
    if (imageUrl) {
      onAddImage(imageUrl);
      setImageUrl('');
      onClose();
    }
  }, [imageUrl, onAddImage, onClose]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleAddImage();
    } else if (e.key === 'Escape') {
      onClose();
    }
  }, [handleAddImage, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
        <h3 className="text-lg font-semibold mb-4">Thêm hình ảnh</h3>
        <input
          type="url"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          placeholder="https://example.com/image.jpg"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
          autoFocus
          onKeyDown={handleKeyDown}
        />
        <div className="flex justify-end gap-2 mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
          >
            Hủy
          </button>
          <button
            onClick={handleAddImage}
            disabled={!imageUrl}
            className="px-4 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Thêm
          </button>
        </div>
      </div>
    </div>
  );
}
