import React, { useState, useEffect, useRef, useCallback } from "react";
import { ShoppingCart, ChevronLeft, ChevronRight } from "lucide-react";
import theme from "../lib/theme";
import { useLocation, useNavigate } from "react-router-dom";
import { ROUTES } from "../lib/constant";
import { useSelector, useDispatch } from "react-redux";
import ProductCardShimmer from "./ProductCardShimmer";
import { createCart, addItemsToCart, getCartDetails } from "../apiCalls/cart";
import toast from "react-hot-toast";
import { updateInventoryFromCart, setCart } from "../redux/productSlice";

function ProductCard({ productsList, horizontal = false }) {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isSearching = useSelector((state) => state.products.isSearching);
  const searchQuery = useSelector((state) => state.products.searchQuery);
  const isHome = location.pathname === "/";
  const isLoadingState = useSelector((state) => state.loader.isLoading);
  const [cartId, setCartId] = useState(null);
  
  // Ensure productsList is an array before using slice
  const productsListArray = Array.isArray(productsList) ? productsList : [];

  const productsData = horizontal ? productsListArray : isHome ? productsListArray.slice(0, 4) : productsListArray;
  
  // Check if we're in search mode with no results
  const isSearchMode = searchQuery && searchQuery.trim() !== "";
  const hasNoSearchResults = productsListArray.length === 0;
  
  // Show shimmer when loading, searching, or when no products found (0 products) - shimmer stays visible always
  const shouldShowShimmer = isLoadingState || isSearching || (isSearchMode && productsListArray.length === 0) || (!isSearchMode && productsListArray.length === 0);
  
  // Helper function to format price
  const formatPrice = (price) => {
    return parseFloat(price || 0).toFixed(2);
  };

  // Helper function to get the first variant (or default variant)
  const getFirstVariant = useCallback((product) => {
    return product?.variants?.[0] || {};
  }, []);

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
        className="relative w-full h-48 sm:h-56 md:h-56 lg:h-56 overflow-hidden rounded-md cursor-pointer group "
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
          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-1.5 z-20 ">
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

  // Determine shimmer count
  const shimmerCount = isHome ? 4 : (productsData.length > 0 ? productsData.length : 4);
  
  // Cart management
  useEffect(() => {
    const initializeCart = async () => {
      try {
        const storedCartId = localStorage.getItem("cartId");
        
        if (storedCartId) {
          if (!storedCartId.includes('?key=')) {
            const response = await createCart();
            if (response?.success && response?.cart?.id) {
              const fullCartId = response.cart.id;
              localStorage.setItem("cartId", fullCartId);
              setCartId(fullCartId);
            }
          } else {
            try {
              const cartResponse = await getCartDetails(storedCartId);
              if (cartResponse?.success && cartResponse.cart) {
                // Update product inventory and store cart data
                dispatch(updateInventoryFromCart(cartResponse.cart));
                dispatch(setCart(cartResponse.cart));
              }
              setCartId(storedCartId);
            } catch (error) {
              toast.error(error.message);
              
              const response = await createCart();
              if (response?.success && response?.cart?.id) {
                const fullCartId = response.cart.id;
                localStorage.setItem("cartId", fullCartId);
                setCartId(fullCartId);
              }
            }
          }
        } else {
          const response = await createCart();
          if (response?.success && response?.cart?.id) {
            const fullCartId = response.cart.id;
            localStorage.setItem("cartId", fullCartId);
            setCartId(fullCartId);
          }
        }
      } catch (error) {
        toast.error("Error initializing cart: " + error.message);
      }
    };
    initializeCart();
  }, [dispatch]);

  // Helper function to convert variant ID to GraphQL global ID format
  const getVariantGraphQLId = useCallback((variant) => {
    if (variant?.admin_graphql_api_id) {
      return variant.admin_graphql_api_id;
    }
    
    // If variant.id is already in GraphQL format (starts with gid://), use it
    if (variant?.id && typeof variant.id === 'string' && variant.id.startsWith('gid://')) {
      return variant.id;
    }
    
    // If variant.id is numeric, convert to GraphQL format
    if (variant?.id) {
      const numericId = typeof variant.id === 'string' ? variant.id : String(variant.id);
      return `gid://shopify/ProductVariant/${numericId}`;
    }
    
    return null;
  }, []);

  // Handle add to cart
  const handleAddToCart = useCallback(async (product) => {
    if (!cartId) {
      toast.error("Cart not initialized yet. Please try again.");
      return;
    }

    const variant = getFirstVariant(product);
    if (!variant) {
      toast.error("Product variant not found");
      return;
    }

    // Get GraphQL global ID for the variant
    const merchandiseId = getVariantGraphQLId(variant);
    if (!merchandiseId) {
      toast.error("Product variant ID not found or invalid");
      return;
    }

    // Check if product is available
    const available = product?.status === 'active' && (variant?.inventory_quantity || 0) > 0;
    if (!available) {
      toast.error("Product is not available");
      return;
    }

    try {
      let currentCartId = cartId;
      if (!currentCartId || !currentCartId.includes('?key=')) {
        const storedCartId = localStorage.getItem("cartId");
        if (storedCartId && storedCartId.includes('?key=')) {
          setCartId(storedCartId);
          currentCartId = storedCartId;
        } else {
          toast.error("No valid cartId found. Please refresh the page.");
          return;
        }
      }
            
      // Add item to cart
      const addResponse = await addItemsToCart({
        cartId: currentCartId,
        lines: [
          {
            merchandiseId: merchandiseId,
            quantity: 1,
          },
        ],
      });

      if (addResponse?.success) {
        if (addResponse?.cart?.id && addResponse.cart.id !== cartId) {
          const newCartId = addResponse.cart.id;
          localStorage.setItem("cartId", newCartId);
          setCartId(newCartId);
        }
        
        const updatedCartId = addResponse?.cart?.id || currentCartId;
        const cartResponse = await getCartDetails(updatedCartId);
        if (cartResponse?.success) {
          // Update product inventory and store cart data
          if (cartResponse.cart) {
            dispatch(updateInventoryFromCart(cartResponse.cart));
            dispatch(setCart(cartResponse.cart));
          }
          toast.success("Item added to cart successfully");
        }
      } else {
        toast.error("Failed to add item to cart: " + (addResponse?.errors || addResponse?.message));
      }
    } catch (error) {
      toast.error("Error adding item to cart: " + (error.response?.data?.message || error.message));
    }
  }, [cartId, getFirstVariant, getVariantGraphQLId, dispatch]);

  const scrollRef = useRef(null);
  const scrollStep = useCallback(() => {
    if (!scrollRef.current) return 300;
    const container = scrollRef.current;

    // Prefer stepping by one card width + gap for predictable card-by-card scrolling
    const firstChild = container.querySelector(":scope > *");
    if (firstChild) {
      const childWidth = firstChild.offsetWidth || firstChild.clientWidth || 0;
      const style = window.getComputedStyle(container);
      const gapValue = style.gap || style.columnGap || style.rowGap || "0px";
      const gap = parseFloat(gapValue) || 0;
      return Math.max(50, Math.floor(childWidth + gap));
    }

    // Fallback: portion of container width
    return Math.max(100, Math.floor(container.clientWidth * 0.8));
  }, []);

  const scrollLeft = () => {
    if (!scrollRef.current) return;
    const step = scrollStep();
    const target = Math.max(0, scrollRef.current.scrollLeft - step);
    scrollRef.current.scrollTo({ left: target, behavior: "smooth" });
  };

  const scrollRight = () => {
    if (!scrollRef.current) return;
    const step = scrollStep();
    const maxLeft = scrollRef.current.scrollWidth - scrollRef.current.clientWidth;
    const target = Math.min(maxLeft, scrollRef.current.scrollLeft + step);
    scrollRef.current.scrollTo({ left: target, behavior: "smooth" });
  };

  return (
    <div className="relative">
      {horizontal ? (
        <div className="relative no-scrollbar container mx-auto px-4 sm:px-6  py-2 sm:py-2 lg:py-2">
          {/* Left control */}
          <button
            onClick={scrollLeft}
            aria-label="Scroll left"
            className="absolute left-2 top-1/2 -translate-y-1/2 z-20 rounded-full p-2 shadow-md"
            style={{ backgroundColor: theme.colors.accent.primary, color: 'white' }}
          >
            <ChevronLeft className="w-5 h-5"  />
          </button>

          {/* Scrollable row */}
          <div
            ref={scrollRef}
            className="flex gap-4 overflow-x-auto no-scrollbar pt-4 pb-6 px-4"
            style={{ scrollBehavior: "smooth" }}
          >
            {shouldShowShimmer
              ? Array.from({ length: shimmerCount }).map((_, index) => (
                  <div key={`shimmer-${index}`} className="flex-none w-72">
                    <ProductCardShimmer />
                  </div>
                ))
              : productsData?.map((product) => {
                  const variant = getFirstVariant(product);
                  const available = isAvailable(product);
                  const stockQuantity = variant?.inventory_quantity || 0;
                  const comparePrice = variant?.compare_at_price || variant?.price;
                  const currentPrice = variant?.price;

                  return (
                    <div
                      key={product.id}
                      className="flex-none w-72 flex flex-col gap-2 sm:gap-3 rounded-md p-3 sm:p-4 lg:p-5 transition-shadow duration-300 shadow-lg"
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
                            available ? "text-green-600" : "text-red-600"
                          }`}
                        >
                          {available ? "Available" : "Out of Stock"}
                        </span>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddToCart(product);
                        }}
                        disabled={!available || !cartId}
                        className="glow-button px-4 py-2 rounded-md flex justify-center items-center gap-2 hover:opacity-90 transition-opacity relative z-10 disabled:opacity-50 disabled:cursor-not-allowed"
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
                })}
          </div>

          {/* Right control */}
          <button
            onClick={scrollRight}
            aria-label="Scroll right"
            className="absolute right-2 top-1/2 -translate-y-1/2 z-20 rounded-full p-2 shadow-md"
            style={{ backgroundColor: theme.colors.accent.primary, color: 'white' }}
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      ) : (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 pt-4 container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        {shouldShowShimmer ? (
          // Show shimmer during loading/searching or when no products found (shimmer stays visible)
          Array.from({ length: shimmerCount }).map((_, index) => (
            <ProductCardShimmer key={`shimmer-${index}`} />
          ))
        ) : (
          productsData?.map((product) => {
            const variant = getFirstVariant(product);
          const available = isAvailable(product);
          const stockQuantity = variant?.inventory_quantity || 0;
          const comparePrice = variant?.compare_at_price || variant?.price;
          const currentPrice = variant?.price;

          return (
            <div
              key={product.id}
              className="flex flex-col gap-2 sm:gap-3 rounded-md p-3 sm:p-4 lg:p-5 transition-shadow duration-300 shadow-lg"
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
                        available ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {available ? "Available" : "Out of Stock"}
                </span>
              </div>
              <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddToCart(product);
                    }}
                    disabled={!available || !cartId}
                    className="glow-button px-4 py-2 rounded-md flex justify-center items-center gap-2 hover:opacity-90 transition-opacity relative z-10 disabled:opacity-50 disabled:cursor-not-allowed"
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
        {hasNoSearchResults && (
          <div className="absolute inset-0 flex flex-col items-center justify-center py-8 sm:py-12 pointer-events-none" style={{ zIndex: 10 }}>
            <div className="p-4 sm:p-6 rounded-lg text-center pointer-events-auto" style={{
              backgroundColor: theme.colors.background.main,
              border: `1px solid ${theme.colors.border.light}`,
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            }}>
              <p className="text-base sm:text-lg md:text-xl font-semibold mb-2" style={{ color: theme.colors.text.primary }}>
                No Products Found
              </p>
              <p className="text-sm sm:text-base" style={{ color: theme.colors.text.secondary }}>
                No products found for "{searchQuery}". Try a different search term.
              </p>
            </div>
          </div>
        )}
      </div>
      )}
    </div>
  );
}

export default ProductCard;
