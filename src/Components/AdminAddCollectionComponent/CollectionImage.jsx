import React from 'react'
import theme from '../../lib/theme';
import { Trash2 } from 'lucide-react';
function CollectionImage({ image, handleImageChange, removeImage, getImagePreview }) {
  return (
    <div
    className="p-4 sm:p-6 rounded-lg shadow-sm"
    style={{
      backgroundColor: "#FFFFFF",
      border: `1px solid ${theme.colors.border.light}`,
    }}
  >
    <label
      className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6 block"
      style={{ color: theme.colors.text.primary }}
    >
      Collection Image
    </label>
    <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
      <input
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        className="flex-1 px-4 py-2 rounded-md border focus:outline-none focus:ring-2 cursor-pointer"
        style={{
          backgroundColor: theme.colors.background.main,
          borderColor: theme.colors.border.light,
          color: theme.colors.text.primary,
        }}
      />
      {image && (
        <>
          <button
            type="button"
            onClick={removeImage}
            className="px-4 py-2 text-red-500 hover:text-red-700 transition-colors cursor-pointer w-full sm:w-auto flex items-center justify-center gap-2"
            title="Remove Image"
          >
            <Trash2 className="w-5 h-5" />
            <span className="sm:hidden">Remove Image</span>
          </button>
          <div className="flex justify-center sm:justify-start">
            <img
              src={getImagePreview()}
              alt="Collection preview"
              className="w-24 h-24 sm:w-32 sm:h-32 object-cover rounded-md border"
              style={{ borderColor: theme.colors.border.light }}
              onError={(e) => {
                e.target.style.display = "none";
              }}
            />
          </div>
        </>
      )}
    </div>
  </div>
  )
}

export default CollectionImage
