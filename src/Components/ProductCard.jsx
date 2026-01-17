import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { ShoppingCart, ChevronLeft, ChevronRight, ClockIcon, Flame, Loader2Icon } from "lucide-react";
import theme from "../lib/theme";
import { useLocation as useRouterLocation, useNavigate } from "react-router-dom";
import { ROUTES } from "../lib/constant";
import { useSelector, useDispatch } from "react-redux";
import ProductCardShimmer from "./ProductCardShimmer";
import { addItemsToCart, getCartDetails } from "../apiCalls/cart";
import toast from "react-hot-toast";
import { updateInventoryFromCart, setCart } from "../redux/productSlice";
import EditLoginModal from "./EditLoginModal";
import { useLocation } from "../hooks/useLocation";
import DeliveryBadge from "./DeliveryBadge";
import { getNumericProductId } from "../utils/productHelpers";

function ProductCard({ productsList, horizontal = false }) {
  const location = useRouterLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isSearching = useSelector((state) => state.products.isSearching);
  const searchQuery = useSelector((state) => state.products.searchQuery);
  const isHome = location.pathname === "/";
  const isLoadingState = useSelector((state) => state.loader.isLoading);
  const cartId = useSelector((state) => state.products.cart?.id);
  const [openEditLoginModal, setOpenEditLoginModal] = useState(false);
  
  // Location management for refrigerated products
  const { validateLocation, requestLocation } = useLocation();
  const [productLocationStatus, setProductLocationStatus] = useState({}); // { productId: { isRefrigerated, allowed, distance, isLoading } }
  // Ensure productsList is an array before using slice
  const productsListArray = Array.isArray(productsList) ? productsList : [];
  const productsData = horizontal
    ? productsListArray
    : isHome
    ? productsListArray.slice(0, 8)
    : productsListArray;

  // Check if we're in search mode with no results
  const isSearchMode = searchQuery && searchQuery.trim() !== "";
  const hasNoSearchResults = productsListArray.length === 0;

  // Show shimmer when loading, searching, or when no products found (0 products) - shimmer stays visible always
  const shouldShowShimmer =
    isLoadingState ||
    isSearching ||
    (isSearchMode && productsListArray.length === 0) ||
    (!isSearchMode && productsListArray.length === 0);

  const token = sessionStorage.getItem("token");
  const shopifyAccessToken = sessionStorage.getItem("shopifyAccessToken");
  
  // Helper function to format price
  const formatPrice = (price) => {
    return parseFloat(price || 0).toFixed(2);
  };

  // Helper function to get the first variant (or default variant)
  const getFirstVariant = useCallback((product) => {
    return product?.variants?.[0] || {};
  }, []);

  // Helper function to calculate total inventory across all variants
  const getTotalInventory = useCallback((product) => {
    if (!product?.variants || !Array.isArray(product.variants)) {
      return 0;
    }
    return product.variants.reduce((total, variant) => {
      const quantity = Number(variant?.inventory_quantity || 0);
      return total + quantity;
    }, 0);
  }, []);

  const sortedProductsData = useMemo(() => {
    if (!productsData || productsData.length === 0) return productsData;
    
    const withInventory = [];
    const withoutInventory = [];
    
    productsData.forEach((product) => {
      const totalInventory = getTotalInventory(product);
      if (totalInventory > 0) {
        withInventory.push(product);
      } else {
        withoutInventory.push(product);
      }
    });
    
    return [...withInventory, ...withoutInventory];
  }, [productsData, getTotalInventory]);


  // Helper function to get badge information based on inventory
  const getBadgeInfo = useCallback(
    (product) => {
      const totalInventory = getTotalInventory(product);

      if (totalInventory > 0 && totalInventory < 8) {
        return {
          text: "Only a Few Left",
          icon: ClockIcon,
          backgroundColor: "green",
          color: "white",
        };
      } else if (totalInventory > 25) {
        return {
          text: "Hot Deals",
          icon: Flame,
          backgroundColor: "red",
          color: "white",
        };
      }
      return null;
    },
    [getTotalInventory]
  );

  // Helper function to get product images
  const getProductImages = (product) => {
    if (product?.images && product.images.length > 0) {
      return product.images.map((img) => img.src);
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

    // Get badge information based on inventory
    const badgeInfo = getBadgeInfo(product);
    const BadgeIcon = badgeInfo?.icon;

    return (
      <div
        className="relative w-full h-48 sm:h-56 md:h-56 lg:h-56 overflow-hidden rounded-md cursor-pointer group "
        style={{ borderBottom: `1px solid ${theme.colors.border.light}` }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={onClick}
      >
        {/* Dynamic badge based on inventory (top-right) */}
        {badgeInfo && (
          <div
            className="absolute top-0 right-0 z-40 px-2 py-1 rounded text-xs font-semibold swipe-tag"
            style={{
              backgroundColor: badgeInfo.backgroundColor,
              color: badgeInfo.color,
              boxShadow: "0 2px 6px rgba(0,0,0,0.12)",
              letterSpacing: "0.4px",
            }}
          >
            <span className="flex items-center gap-1">
              {badgeInfo.text} {BadgeIcon && <BadgeIcon className="w-4 h-4" />}
            </span>
          </div>
        )}

        {productImages.map((imageSrc, index) => (
          <img
            key={index}
            src={imageSrc}
            alt={product.title || "Product"}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ease-in-out ${
              index === currentImageIndex ? "opacity-100 z-10" : "opacity-0 z-0"
            } group-hover:scale-105`}
            style={{
              transition:
                "opacity 0.7s ease-in-out, transform 0.5s ease-in-out",
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
                    ? "bg-white scale-125"
                    : "bg-white/50"
                }`}
              />
            ))}
          </div>
        )}
      </div>
    );
  };

  // Helper function to check availability (based on total inventory across all variants)
  const isAvailable = useCallback((product) => {
    const totalInventory = getTotalInventory(product);
    return product?.status === "active" && totalInventory > 0;
  }, [getTotalInventory]);

  // Determine shimmer count
  const shimmerCount = isHome
    ? 4
    : sortedProductsData.length > 0
    ? sortedProductsData.length
    : 4;

  // Helper function to convert variant ID to GraphQL global ID format
  const getVariantGraphQLId = useCallback((variant) => {
    if (variant?.admin_graphql_api_id) {
      return variant.admin_graphql_api_id;
    }

    // If variant.id is already in GraphQL format (starts with gid://), use it
    if (
      variant?.id &&
      typeof variant.id === "string" &&
      variant.id.startsWith("gid://")
    ) {
      return variant.id;
    }

    // If variant.id is numeric, convert to GraphQL format
    if (variant?.id) {
      const numericId =
        typeof variant.id === "string" ? variant.id : String(variant.id);
      return `gid://shopify/ProductVariant/${numericId}`;
    }

    return null;
  }, []);

  /**
   * Check if product is refrigerated and validate location
   * @param {Object} product - Product object
   * @returns {Promise<Object>} Location validation result
   */
  const checkProductLocation = useCallback(async (product) => {
    const productId = getNumericProductId(product?.id);
    if (!productId) {
      return { isRefrigerated: false, allowed: true, distance: null };
    }

    // Check if already validated
    const cachedStatus = productLocationStatus[productId];
    if (cachedStatus && !cachedStatus.isLoading) {
      return cachedStatus;
    }

    // Set loading state
    setProductLocationStatus(prev => ({
      ...prev,
      [productId]: { ...prev[productId], isLoading: true }
    }));

    try {
      const result = await validateLocation({ productId });
      
      const status = {
        isRefrigerated: result.isRefrigerated || false,
        allowed: result.allowed !== false, // Default to true if not specified
        distance: result.distance || null,
        isLoading: false,
        error: result.error || null,
      };

      setProductLocationStatus(prev => ({
        ...prev,
        [productId]: status
      }));

      return status;
    } catch (error) {
      // If validation fails, assume not refrigerated (allow cart)
      const status = {
        isRefrigerated: false,
        allowed: true,
        distance: null,
        isLoading: false,
        error: error.message,
      };

      setProductLocationStatus(prev => ({
        ...prev,
        [productId]: status
      }));

      return status;
    }
  }, [validateLocation, productLocationStatus]);

  // Handle add to cart
  const handleAddToCart = useCallback(
    async (product) => {
      if (!token || !shopifyAccessToken) {
        toast.error("Please login to add items to cart");
        setOpenEditLoginModal(true);
        return;
      }

      if (!cartId) {
        toast.error("Cart not initialized yet. Please try again.");
        return;
      }

      const variant = getFirstVariant(product);
      if (!variant) {
        toast.error("Product variant not found");
        return;
      }

      // Check if the first variant (displayed variant) has zero inventory
      const firstVariantInventory = Number(variant?.inventory_quantity || 0);
      if (firstVariantInventory === 0) {
        const variantTitle = variant?.title || "This variant";
        toast.error(
          `Sorry, ${variantTitle} is unavailable. See other options.`,
          {
            duration: 5000,
          }
        );
        navigate(`${ROUTES.PRODUCT_DETAILS}/${product.id}`);
        window.scrollTo(0, 0);
        return;
      }

      // Get GraphQL global ID for the variant
      const merchandiseId = getVariantGraphQLId(variant);
      if (!merchandiseId) {
        toast.error("Product variant ID not found or invalid");
        return;
      }

      // Check if product is available (based on total inventory across all variants)
      const available = isAvailable(product);
      if (!available) {
        toast.error("Product is not available");
        return;
      }

      // Check location for refrigerated products
      try {
        const locationCheck = await checkProductLocation(product);
        
        if (locationCheck.isRefrigerated && !locationCheck.allowed) {
          console.log("Refrigerated product is not available in your area");
          return;
        }

        // If refrigerated and needs location but user denied, show message
        if (locationCheck.isRefrigerated && locationCheck.needsLocation) {
          toast.error("Location access is required to order refrigerated products. Please enable location permissions.");
          try {
            await requestLocation();
            // Retry location check after permission granted
            const retryCheck = await checkProductLocation(product);
            if (retryCheck.isRefrigerated && !retryCheck.allowed) {
              toast.error(
                retryCheck.error || 
                `Refrigerated products are only available within 30 km radius. You are ${retryCheck.distance || 'too far'} km away.`
              );
              return;
            }
          } catch {
            // User denied location
            return;
          }
        }
      } catch (error) {
        console.error("Error checking location:", error);
        // On error, still allow non-refrigerated products to be added
        // For safety, we could block refrigerated products if location check fails
        // But for better UX, we'll try to proceed and backend will validate
      }

      try {
        let currentCartId = cartId;
        if (!currentCartId || !currentCartId.includes("?key=")) {
          const storedCartId = localStorage.getItem("cartId");
          if (storedCartId && storedCartId.includes("?key=")) {
            dispatch(setCart(storedCartId));
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
            dispatch(setCart(newCartId));
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
          toast.error(
            "Failed to add item to cart: " +
              (addResponse?.errors || addResponse?.message)
          );
        }
      } catch (error) {
        toast.error(
          "Error adding item to cart: " +
            (error.response?.data?.message || error.message)
        );
      }
    },
    [
      cartId,
      getFirstVariant,
      getVariantGraphQLId,
      dispatch,
      token,
      shopifyAccessToken,
      checkProductLocation,
      requestLocation,
      isAvailable,
      navigate,
    ]
  );

  // Note: Location is checked on-demand when user tries to add to cart
  // This avoids requesting location for all products on page load
  // Only refrigerated products require location check

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
    const maxLeft =
      scrollRef.current.scrollWidth - scrollRef.current.clientWidth;
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
            style={{
              color: "white",
              backgroundColor: theme.colors.accent.primary,
            }}
          >
            <ChevronLeft className="w-5 h-5" />
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
              : sortedProductsData.slice(0, 7)?.map((product) => {
          const variant = getFirstVariant(product);
          const available = isAvailable(product);
                  const productId = getNumericProductId(product?.id);
                  const locationStatus = productLocationStatus[productId] || {
                    isRefrigerated: false,
                    allowed: true,
                    distance: null,
                    isLoading: false,
                  };
                  const isLocationBlocked = locationStatus.isRefrigerated && !locationStatus.allowed;
                  
                  // const stockQuantity = variant?.inventory_quantity || 0;
                  const comparePrice =
                    variant?.compare_at_price || variant?.price;
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
                      <div className="flex items-center justify-center h-14 text-center border-b border-gray-200 pb-2">
                        <h2
                          className="text-base sm:text-lg lg:text-xl font-semibold cursor-pointer "
                          onClick={() => {
                            navigate(`${ROUTES.PRODUCT_DETAILS}/${product.id}`);
                            window.scrollTo(0, 0);
                          }}
                          style={{
                            color: theme.colors.text.primary,
                          }}
                        >
                {product.title}
              </h2>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="flex flex-col gap-1 items-start">
                          {/* Current Price */}
                          <span
                            className="text-lg sm:text-xl lg:text-lg font-bold"
                            style={{
                              color: theme.colors.text.primary,
                            }}
                          >
                            ₹ {formatPrice(currentPrice)}
                          </span>

                          {/* MRP (only show if different from currentPrice) */}
                      {comparePrice && comparePrice !== currentPrice && (
                            <span className="text-sm sm:text-sm lg:text-xs line-through text-gray-500">
                              MRP: ₹ {formatPrice(comparePrice)}
                        </span>
                      )}
                        </div>

                        {/* Availability */}
                        <div className="flex flex-col gap-1 items-end">
                          <span
                            className={`text-xs sm:text-sm lg:text-md font-medium ${
                              available ? "text-green-600" : "text-red-600"
                            }`}
                          >
                            {available ? "" : "Out of Stock"}
                          </span>
                          {/* Save Percentage */}
                          {comparePrice && comparePrice !== currentPrice && (
                            <span className="text-xs sm:text-xs lg:text-xs text-green-600 font-medium">
                              Save Up to (
                              {Math.round(
                                ((comparePrice - currentPrice) / comparePrice) *
                                  100
                              )}
                              %)
                    </span>
                          )}
                        </div>
                      </div>
                      {/* Delivery Badge */}
                      {productId && (
                        <DeliveryBadge
                          isRefrigerated={locationStatus.isRefrigerated}
                          isLocationAllowed={locationStatus.allowed}
                          distance={locationStatus.distance}
                          isLoading={locationStatus.isLoading}
                          error={locationStatus.error}
                        />
                      )}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddToCart(product);
                        }}
                        disabled={!available || !cartId || isLocationBlocked}
                        className="glow-button px-4 py-2 rounded-md flex justify-center items-center gap-2 hover:opacity-90 transition-opacity relative z-10 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
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
            style={{
              backgroundColor: theme.colors.accent.primary,
              color: "white",
            }}
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 pt-4 container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
          {shouldShowShimmer
            ? Array.from({ length: shimmerCount }).map((_, index) => (
                <ProductCardShimmer key={`shimmer-${index}`} />
              ))
            : sortedProductsData?.map((product) => {
                const variant = getFirstVariant(product);
                const available = isAvailable(product);
                const productId = getNumericProductId(product?.id);
                const locationStatus = productLocationStatus[productId] || {
                  isRefrigerated: false,
                  allowed: true,
                  distance: null,
                  isLoading: false,
                };
                const isLocationBlocked = locationStatus.isRefrigerated && !locationStatus.allowed;
                
                const comparePrice =
                  variant?.compare_at_price || variant?.price;
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
                    <div className="flex items-center justify-center h-14 text-center border-b border-gray-200 pb-2">
                      <h2
                        className="text-base sm:text-lg lg:text-xl font-semibold cursor-pointer "
                        onClick={() => {
                          navigate(`${ROUTES.PRODUCT_DETAILS}/${product.id}`);
                          window.scrollTo(0, 0);
                        }}
                      >
                        {product.title}
                      </h2>
                    </div>

                    <div className="flex justify-between items-center">
                      <div className="flex flex-col gap-1 items-start">
                        {/* Current Price */}
                        <span
                          className="text-lg sm:text-xl lg:text-lg font-bold"
                          style={{
                            color: theme.colors.text.primary,
                          }}
                        >
                      ₹ {formatPrice(currentPrice)}
                    </span>

                        {/* MRP (only show if different from currentPrice) */}
                        {comparePrice && comparePrice !== currentPrice && (
                          <span className="text-sm sm:text-sm lg:text-xs line-through text-gray-500">
                            MRP: ₹ {formatPrice(comparePrice)}
                  </span>
                        )}
                </div>

                      {/* Availability */}
                      <div className="flex flex-col gap-1 items-end">
                <span
                  className={`text-xs sm:text-sm lg:text-md font-medium ${
                            available ? "text-green-600" : "text-red-600"
                  }`}
                >
                          {available ? "" : "Out of Stock"}
                        </span>
                        {/* Save Percentage */}
                        {comparePrice && comparePrice !== currentPrice && (
                          <span className="text-xs sm:text-xs lg:text-xs text-green-600 font-medium">
                            Save Up to (
                            {Math.round(
                              ((comparePrice - currentPrice) / comparePrice) *
                                100
                            )}
                            %)
                </span>
                        )}
                      </div>
              </div>

                    {/* Delivery Badge */}
                    {productId && (
                      <DeliveryBadge
                        isRefrigerated={locationStatus.isRefrigerated}
                        isLocationAllowed={locationStatus.allowed}
                        distance={locationStatus.distance}
                        isLoading={locationStatus.isLoading}
                        error={locationStatus.error}
                      />
                    )}

              <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddToCart(product);
                      }}
                      disabled={!available || !cartId || isLocationBlocked}
                      className="glow-button px-4 py-2 rounded-md flex justify-center items-center gap-2 hover:opacity-90 transition-opacity relative z-10 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
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
          {hasNoSearchResults && (
            <div
              className="absolute inset-0 flex flex-col items-center justify-center py-8 sm:py-12 pointer-events-none"
              style={{ zIndex: 10 }}
            >
              <div className="p-4 sm:p-6 rounded-lg text-center pointer-events-auto">
                <div className="flex flex-col items-center justify-center gap-2">
                  <Loader2Icon className="w-8 h-8 animate-spin" />
                  <p className="text-sm">
                    Loading products...No products found
                  </p>
                </div>
              </div>
        </div>
      )}
        </div>
      )}
      <EditLoginModal
        open={openEditLoginModal}
        onClose={() => setOpenEditLoginModal(false)}
      />
    </div>
  );
}

export default ProductCard;
