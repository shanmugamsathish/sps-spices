import React, { useEffect, useState } from 'react';
import theme from '../lib/theme';

function ProductImageCarousel({ product, getProductImages, currentImageIndex, setCurrentImageIndex, isPaused, setIsPaused }) {
  const [zoomStyle, setZoomStyle] = useState({
    transform: 'scale(1)',
    transformOrigin: 'center center',
  });

  const productImages = getProductImages(product);
  const hasMultipleImages = productImages.length > 1;

  // Reset to first image when product changes
  useEffect(() => {
    setCurrentImageIndex(0);
    setIsPaused(false);
  }, [product?.id, setCurrentImageIndex, setIsPaused]);

  // Autoplay carousel effect
  useEffect(() => {
    if (!hasMultipleImages || isPaused) return;

    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === productImages.length - 1 ? 0 : prevIndex + 1
      );
    }, 2500);

    return () => clearInterval(interval);
  }, [hasMultipleImages, isPaused, productImages.length, setCurrentImageIndex]);

  const handleMouseEnter = () => {
    if (hasMultipleImages) setIsPaused(true);
  };

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    setZoomStyle({
      transform: 'scale(1.3)',
      transformOrigin: `${x}% ${y}%`,
    });
  };

  const handleMouseLeave = () => {
    if (hasMultipleImages) setIsPaused(false);
    setZoomStyle({
      transform: 'scale(1)',
      transformOrigin: 'center center',
    });
  };

  if (productImages.length === 0) return null;

  return (
    <div
      className="relative w-full h-full overflow-hidden rounded-md cursor-pointer group"
      style={{ borderBottom: `1px solid ${theme.colors.border.light}` }}
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {productImages.map((imageSrc, index) => (
        <img
          key={index}
          src={imageSrc}
          alt={product.title || 'Product'}
          className={`absolute inset-0 w-full h-full object-cover transition-all duration-300 ease-out ${
            index === currentImageIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
          }`}
          style={
            index === currentImageIndex
              ? zoomStyle
              : { transform: 'scale(1)', transformOrigin: 'center center' }
          }
        />
      ))}

      {hasMultipleImages && (
        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-1.5 z-20">
          {productImages.map((_, index) => (
            <div
              key={index}
              className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                index === currentImageIndex
                  ? 'bg-white scale-125'
                  : 'bg-white/50'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default ProductImageCarousel;
