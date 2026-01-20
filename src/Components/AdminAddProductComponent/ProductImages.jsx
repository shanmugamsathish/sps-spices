import React from 'react'
import theme from '../../lib/theme'
import { Plus, Trash2 } from 'lucide-react'

function ProductImages({ images, handleImageChange, addImage, removeImage }) {
  const handleFileChange = (index, e) => {
    const file = e.target.files[0]
    if (file) handleImageChange(index, file)
  }

  const getImagePreview = (image) => {
    if (image instanceof File) return URL.createObjectURL(image)
    return image
  }

  return (
    <div
      className="p-4 sm:p-6 rounded-lg shadow-sm"
      style={{
        backgroundColor: '#FFFFFF',
        border: `1px solid ${theme.colors.border.light}`,
      }}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-6">
        <h2
          className="text-lg sm:text-xl font-semibold"
          style={{ color: theme.colors.text.primary }}
        >
          Product Images
        </h2>
        <button
          type="button"
          onClick={addImage}
          className="flex items-center justify-center gap-2 px-4 py-2 rounded-md text-white text-sm font-medium transition-colors cursor-pointer w-full sm:w-auto"
          style={{ backgroundColor: theme.colors.accent.primary }}
          onMouseEnter={(e) => (e.target.style.backgroundColor = theme.colors.accent.hover)}
          onMouseLeave={(e) => (e.target.style.backgroundColor = theme.colors.accent.primary)}
        >
          <Plus className="w-4 h-4" />
          Add Image
        </button>
      </div>

      {/* Image Rows */}
      <div className="space-y-4">
        {images.map((image, index) => (
          <div
            key={index}
            className="flex flex-col sm:flex-row gap-3 sm:gap-4 sm:items-center"
          >
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleFileChange(index, e)}
              className="w-full sm:flex-1 px-3 sm:px-4 py-2 rounded-md border focus:outline-none focus:ring-2 cursor-pointer text-sm"
              style={{
                backgroundColor: theme.colors.background.main,
                borderColor: theme.colors.border.light,
                color: theme.colors.text.primary,
              }}
            />

            <div className="flex items-center gap-3">
              {images.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="text-red-500 hover:text-red-700 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              )}

              {image && (
                <img
                  src={getImagePreview(image)}
                  alt={`Preview ${index + 1}`}
                  className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-md"
                  onError={(e) => (e.target.style.display = 'none')}
                />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ProductImages
