import React, { useState, useEffect } from "react";
import { ShoppingCart } from "lucide-react";
import theme from "../lib/theme";
import { useLocation, useNavigate } from "react-router-dom";
import { ROUTES } from "../lib/constant";
import { useSelector } from "react-redux";
import ProductCardShimmer from "./ProductCardShimmer";

function ProductCard({ productsList }) {
  const location = useLocation();
  const navigate = useNavigate();
  const isHome = location.pathname === "/";
  const isLoadingState = useSelector((state) => state.loader.isLoading);
  
  // Ensure productsList is an array before using slice
  const productsListArray = Array.isArray(productsList) ? productsList : [];
  const productsData = isHome ? productsListArray.slice(0, 4) : productsListArray;
  
  // Helper function to format price
  const formatPrice = (price) => {
    return parseFloat(price || 0).toFixed(2);
  };

  // Helper function to get the first variant (or default variant)
  const getFirstVariant = (product) => {
    return product?.variants?.[0] || {};
  };

  // Helper function to get product images
  const getProductImages = (product) => {
    if (product?.images && product.images.length > 0) {
      return product.images.map(img => img.src);
    }
    if (product?.image?.src) {
      return [product.image.src];
    }
    return [];
  };

  // Product Image Carousel Component
  const ProductImageCarousel = ({ product, onClick }) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    
    const productImages = getProductImages(product);
    const hasMultipleImages = productImages.length > 1;

    // Reset to first image when product changes
    useEffect(() => {
      setCurrentImageIndex(0);
      setIsPaused(false);
    }, [product?.id]);

    // Autoplay carousel effect
    useEffect(() => {
      if (!hasMultipleImages || isPaused) return;

      const interval = setInterval(() => {
        setCurrentImageIndex((prevIndex) => 
          prevIndex === productImages.length - 1 ? 0 : prevIndex + 1
        );
      }, 2500); 

      return () => clearInterval(interval);
    }, [hasMultipleImages, isPaused, productImages.length]);

    const handleMouseEnter = () => {
      if (hasMultipleImages) {
        setIsPaused(true);
      }
    };

    const handleMouseLeave = () => {
      if (hasMultipleImages) {
        setIsPaused(false);
      }
    };

    if (productImages.length === 0) return null;

    return (
      <div
        className="relative w-full h-48 sm:h-56 md:h-56 lg:h-56 overflow-hidden rounded-md cursor-pointer group"
        style={{ borderBottom: `1px solid ${theme.colors.border.light}` }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={onClick}
      >
        {productImages.map((imageSrc, index) => (
          <img
            key={index}
            src={imageSrc}
            alt={product.title || 'Product'}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ease-in-out ${
              index === currentImageIndex 
                ? 'opacity-100 z-10' 
                : 'opacity-0 z-0'
            } group-hover:scale-105`}
            style={{
              transition: 'opacity 0.7s ease-in-out, transform 0.5s ease-in-out'
            }}
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
  };

  // Helper function to check availability
  const isAvailable = (product) => {
    return product?.status === 'active' && (getFirstVariant(product)?.inventory_quantity || 0) > 0;
  };

  // Determine if we should show shimmer (loading state or no products)
  const showShimmer = isLoadingState || !productsData || productsData.length === 0;
  const shimmerCount = isHome ? 4 : 8;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 pt-4 container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        {showShimmer ? (
          // Show shimmer skeletons during loading
          Array.from({ length: shimmerCount }).map((_, index) => (
            <ProductCardShimmer key={`shimmer-${index}`} />
          ))
        ) : (
          // Show actual product cards
          productsData?.map((product) => {
            const variant = getFirstVariant(product);
          const available = isAvailable(product);
          const stockQuantity = variant?.inventory_quantity || 0;
          const comparePrice = variant?.compare_at_price || variant?.price;
          const currentPrice = variant?.price;

          return (
            <div
              key={product.id}
              className="flex flex-col gap-2 sm:gap-3 rounded-md p-3 sm:p-4 lg:p-5 hover:shadow-lg transition-shadow duration-300"
              style={{
                backgroundColor: theme.colors.background.main,
                border: `1px solid ${theme.colors.border.light}`,
                color: theme.colors.text.primary,
              }}
            >
              <ProductImageCarousel
                product={product}
                onClick={() => {
                  navigate(`${ROUTES.PRODUCT_DETAILS}/${product.id}`);
                  window.scrollTo(0, 0);
                }}
              />
              <h2 className="text-base sm:text-lg lg:text-xl font-semibold text-center cursor-pointer h-14" onClick={() => {navigate(`${ROUTES.PRODUCT_DETAILS}/${product.id}`); window.scrollTo(0, 0)}}>
                {product.title}
              </h2>
              <div className="flex justify-between ">
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between gap-2">
                    <span className="text-sm sm:text-base lg:text-sm font-bold ">
                      MRP:{" "}
                      {comparePrice && comparePrice !== currentPrice && (
                        <span className="text-sm sm:text-base lg:text-xs line-through">
                          ₹ {formatPrice(comparePrice)}
                        </span>
                      )}
                    </span>
                    <span className="text-sm sm:text-base lg:text-sm font-bold">
                      ₹ {formatPrice(currentPrice)}
                    </span>
                  </div>
                  <span className="text-xs sm:text-sm lg:text-md opacity-80">
                    Stock: {stockQuantity} left
                  </span>
                </div>
                <span
                  className={`text-xs sm:text-sm lg:text-md font-medium ${
                    available
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {available ? "Available" : "Out of Stock"}
                </span>
              </div>
              <button
                className="glow-button px-4 py-2 rounded-md flex justify-center items-center gap-2 hover:opacity-90 transition-opacity relative z-10"
                style={{
                  backgroundColor: theme.colors.accent.primary,
                  color: theme.colors.background.main,
                }}
              >
                <ShoppingCart className="w-4 h-4 font-bold relative z-10" />
                <span className="relative z-10">Add to Cart</span>
              </button>
            </div>
            );
          })
        )}
    </div>
  );
}

export default ProductCard;
