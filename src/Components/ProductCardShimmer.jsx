import React from 'react'
import theme from '../lib/theme'

function ProductCardShimmer() {
    return (
        <div
          className="flex flex-col gap-2 sm:gap-3 rounded-md p-3 sm:p-4 lg:p-5"
          style={{
            backgroundColor: theme.colors.background.main,
            border: `1px solid ${theme.colors.border.light}`,
          }}
        >
          {/* Image Shimmer */}
          <div
            className="relative w-full h-48 sm:h-56 md:h-56 lg:h-56 rounded-md overflow-hidden shimmer-skeleton"
            style={{ borderBottom: `1px solid ${theme.colors.border.light}` }}
          />
          
          {/* Title Shimmer */}
          <div className="h-14 flex items-center justify-center">
            <div className="w-3/4 h-4 rounded shimmer-skeleton" />
          </div>
          
          {/* Price and Stock Shimmer */}
          <div className="flex justify-between gap-2">
            <div className="flex flex-col gap-2 flex-1">
              <div className="flex justify-between gap-2">
                <div className="w-20 h-4 rounded shimmer-skeleton" />
                <div className="w-16 h-4 rounded shimmer-skeleton" />
              </div>
              <div className="w-24 h-3 rounded shimmer-skeleton" />
            </div>
            <div className="w-20 h-4 rounded shimmer-skeleton" />
          </div>
          
          {/* Button Shimmer */}
          <div className="w-full h-10 rounded-md shimmer-skeleton" />
        </div>
      );
}

export default ProductCardShimmer
