import React, { useState } from 'react';
import { Plus, Trash2, Upload } from 'lucide-react';
import theme from '../../lib/theme';

function BannerImages({ images, handleImageChange, removeImage }) {
  const [activeIndex, setActiveIndex] = useState(null)

  const handleFileChange = (index, e) => {
    const file = e.target.files[0];
    if (file) {
      handleImageChange(index, file);
    }
  };

  const getImageSrc = (image) => {
    // Handle null or undefined
    if (!image) {
      return null;
    }
    
    // Handle File objects (same as ProductImages.jsx)
    if (image instanceof File) {
      return URL.createObjectURL(image);
    }
    
    // Handle string URLs (same as ProductImages.jsx)
    if (typeof image === 'string') {
      return image;
    }
    
    // Fallback: Handle Shopify image object with src property
    if (typeof image === 'object' && image !== null && image.src) {
      return image.src;
    }
    
    return null;
  };

  return (
    <div className="w-full max-w-8xl ">
      {/* Images Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {images.map((image, index) => {
          const imageSrc = getImageSrc(image);
          return (
            <div
              key={index}
              onClick={() => setActiveIndex(activeIndex === index ? null : index)}
              className="relative h-56 sm:h-36 md:h-48 lg:h-56 w-full group border-2 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all"
              style={{
                borderColor: theme.colors.border.light,
                backgroundColor: theme.colors.background.main,
              }}
            >
              {/* Image Preview */}
              {imageSrc && (
                <div className="aspect-video bg-gray-100 overflow-hidden">
  <img
    src={imageSrc}
    alt={`Banner ${index + 1}`}
    className="absolute inset-0 w-full h-full object-cover"
    onError={(e) => {
      e.target.style.display = 'none';
      e.target.parentElement.innerHTML =
        '<div class="w-full h-full flex items-center justify-center text-gray-400">Image not found</div>';
    }}
  />
                </div>
              )}

              {/* Overlay on Hover */}
              <div className={`absolute inset-0 bg-black/60 transition-opacity flex items-center justify-center gap-3 ${activeIndex === index ? 'opacity-100' : 'opacity-0'} group-hover:opacity-100`}>
                {/* Upload Button */}
                <label
                  onClick={(e) => e.stopPropagation()}
                  className="cursor-pointer px-4 py-2 rounded-lg bg-white text-gray-800 font-medium hover:bg-gray-100 transition-colors flex items-center gap-2"
                >
                  <Upload className="w-4 h-4" />
                  {imageSrc ? 'Change' : 'Upload'}
                  <input
                    key={`file-input-${index}-${imageSrc ? (image instanceof File ? 'file' : typeof image === 'string' ? 'url' : 'img') : 'empty'}`}
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange(index, e)}
                    className="hidden"
                  />
                </label>

                {/* Remove Button */}
                <button
                  type="button"
                  onClick={(e) => { 
                    e.stopPropagation(); 
                    removeImage(index); 
                  }}
                  className={`px-4 py-2 rounded-lg text-white font-medium transition-colors flex items-center gap-2 ${
                    images.filter(img => img !== null && img !== '' && img !== undefined).length <= 1 
                      ? 'bg-gray-400 cursor-not-allowed opacity-60' 
                      : 'bg-red-500 hover:bg-red-600'
                  }`}
                  disabled={images.filter(img => img !== null && img !== '' && img !== undefined).length <= 1}
                  title={images.filter(img => img !== null && img !== '' && img !== undefined).length <= 1 ? 'At least one banner image is required' : 'Remove this banner image'}
                >
                  <Trash2 className="w-4 h-4" />
                  Remove
                </button>
              </div>

{/* Image Info - Bottom Right */}
<div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-sm px-3 py-2 rounded-lg">
  <div className="flex flex-col items-end gap-1">
    <span className="text-sm font-bold text-white">
      Banner {index + 1}
    </span>
    {imageSrc && (
      <span
        className="text-sm font-bold px-2 py-1 rounded"
        style={{
          color: theme.colors.accent.primary,
        }}
      >
        Active
      </span>
    )}
  </div>
</div>


              {/* Position Indicator */}
              <div className="absolute top-2 left-2">
                <div className="px-2 py-1 rounded text-xs font-semibold text-white"
                  style={{ backgroundColor: theme.colors.accent.primary }}
                >
                  #{index + 1}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {images.length === 0 && (
        <div className="text-center py-12 border-2 border-dashed rounded-xl"
          style={{ borderColor: theme.colors.border.light }}
        >
          <p className="text-lg mb-2" style={{ color: theme.colors.text.secondary }}>
            No banner images yet
          </p>
          <p className="text-sm mb-4" style={{ color: theme.colors.text.secondary }}>
            Add your first banner image to get started
          </p>
        </div>
      )}
    </div>
  );
}

export default BannerImages;

