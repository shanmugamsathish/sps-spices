import React from 'react'
import theme from '../../lib/theme';
import { Plus, X, Trash2 } from 'lucide-react';
function ProductImages({ images, handleImageChange, addImage, removeImage }) {
  const handleFileChange = (index, e) => {
    const file = e.target.files[0];
    if (file) {
      handleImageChange(index, file);
    }
  };

  const getImagePreview = (image) => {
    if (image instanceof File) {
      return URL.createObjectURL(image);
    }
    return image;
  };

  return (
    <div
    className="p-6 rounded-lg shadow-sm"
    style={{
      backgroundColor: '#FFFFFF',
      border: `1px solid ${theme.colors.border.light}`,
    }}
  >
    <div className="flex justify-between items-center mb-6">
      <h2
        className="text-xl font-semibold"
        style={{ color: theme.colors.text.primary }}
      >
        Product Images
      </h2>
      <button
        type="button"
        onClick={addImage}
        className="flex items-center gap-2 px-4 py-2 rounded-md text-white text-sm font-medium transition-colors cursor-pointer"
        style={{ backgroundColor: theme.colors.accent.primary }}
        onMouseEnter={(e) => {
          e.target.style.backgroundColor = theme.colors.accent.hover;
        }}
        onMouseLeave={(e) => {
          e.target.style.backgroundColor = theme.colors.accent.primary;
        }}
      >
        <Plus className="w-4 h-4" />
        Add Image
      </button>
    </div>

    <div className="space-y-4">
      {images.map((image, index) => (
        <div key={index} className="flex gap-4 items-center">
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleFileChange(index, e)}
            className="flex-1 px-4 py-2 rounded-md border focus:outline-none focus:ring-2 cursor-pointer"
            style={{
              backgroundColor: theme.colors.background.main,
              borderColor: theme.colors.border.light,
              color: theme.colors.text.primary,
            }}
          />
          {images.length > 1 && (
            <button
              type="button"
              onClick={() => removeImage(index)}
              className="px-4 py-2 text-red-500 hover:text-red-700 transition-colors cursor-pointer"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          )}
          {image && (
            <img
              src={getImagePreview(image)}
              alt={`Preview ${index + 1}`}
              className="w-20 h-20 object-cover rounded-md"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          )}
        </div>
      ))}
    </div>
  </div>
  )
}

export default ProductImages
