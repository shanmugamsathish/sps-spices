import React, { useEffect, useState, useCallback } from 'react'
import { useParams } from 'react-router-dom'
import { getProductById } from '../../apiCalls/products'
import { ShoppingCart, ShoppingBag } from 'lucide-react'
import theme from '../../lib/theme'
import { setLoading } from '../../redux/loaderSlice'
import { useDispatch, useSelector } from 'react-redux'
import { createCart, addItemsToCart, updateItemQuantity, getCartDetails } from '../../apiCalls/cart'
import { updateInventoryFromCart, setCart, selectCart } from '../../redux/productSlice'
import { getUserProfile } from '../../apiCalls/users'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import ProductReviews from '../../Components/ProductReviews'
import { getFavourites, addFavourite, removeFavourite } from "../../apiCalls/favourites";
import { Heart } from 'lucide-react'
import { useLocation } from '../../hooks/useLocation'
import DeliveryBadge from '../../Components/DeliveryBadge'
import { getNumericProductId } from '../../utils/productHelpers'
import { checkRadius } from '../../apiCalls/geo'
import ProductImageCarousel from '../../Components/ProductImageCarousel'

function ProductDetails() {
  const navigate = useNavigate()
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [selectedVariant, setSelectedVariant] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [loadingText, setLoadingText] = useState(true)
  const [cartId, setCartId] = useState(null)
  const [isUpdatingCart, setIsUpdatingCart] = useState(false)
  const dispatch = useDispatch()
  const cart = useSelector(selectCart)
  const [customerId, setCustomerId] = useState(null)
  const [customerName, setCustomerName] = useState(null)
  const [favoritesSet, setFavoritesSet] = useState(new Set());
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  
  // Location management for refrigerated products
  const { validateLocation, requestLocation } = useLocation();
  const [locationStatus, setLocationStatus] = useState({
    isRefrigerated: false,
    allowed: true,
    distance: null,
    isLoading: false,
    error: null,
    needsLocation: false,
  });

  const token = sessionStorage.getItem("token");
  const shopifyAccessToken = sessionStorage.getItem("shopifyAccessToken");

  // Check if product is refrigerated and validate location if available
  useEffect(() => {
    const checkProductCollection = async () => {
      if (!product?.id) return;
      
      try {
        const productId = getNumericProductId(product.id);
        if (productId) {
          console.log(`[ProductDetails] Checking if product ${productId} is refrigerated...`);
          
          // First, check if we have cached location
          const cachedLocation = localStorage.getItem('userLocation');
          let hasCachedLocation = false;
          let cachedCoords = null;
          
          if (cachedLocation) {
            try {
              const data = JSON.parse(cachedLocation);
              const CACHE_DURATION = 30 * 60 * 1000; 
              if (Date.now() - data.timestamp < CACHE_DURATION) {
                cachedCoords = { lat: data.lat, lng: data.lng };
                hasCachedLocation = true;
                console.log(`[ProductDetails] Using cached location:`, cachedCoords);
              }
            } catch (e) {
              console.warn('[ProductDetails] Error parsing cached location:', e);
            }
          }
          
          // If we have cached location, do full validation
          if (hasCachedLocation && cachedCoords) {
            try {
              const fullCheck = await checkRadius({
                productId: productId,
                lat: cachedCoords.lat,
                lng: cachedCoords.lng,
              });
              
              console.log(`[ProductDetails] Full validation result:`, {
                isRefrigerated: fullCheck.isRefrigerated,
                allowed: fullCheck.allowed,
                distance: fullCheck.distance,
              });
              
              setLocationStatus({
                isRefrigerated: fullCheck.isRefrigerated || false,
                allowed: fullCheck.allowed !== false,
                distance: fullCheck.distance || null,
                isLoading: false,
                error: null,
                needsLocation: fullCheck.isRefrigerated && !fullCheck.allowed,
              });
              return;
            } catch (fullCheckError) {
              console.error("[ProductDetails] Full validation error:", fullCheckError);
              // Fall through to collection-only check
            }
          }
          
          try {
            const collectionCheck = await checkRadius({
              productId: productId,
              checkCollectionOnly: true, 
            });
            
            console.log(`[ProductDetails] Collection check result:`, {
              isRefrigerated: collectionCheck.isRefrigerated,
              needsLocation: collectionCheck.needsLocation,
            });
            
            setLocationStatus({
              isRefrigerated: collectionCheck.isRefrigerated || false,
              allowed: collectionCheck.isRefrigerated ? null : true, 
              distance: null,
              isLoading: false,
              error: null,
              needsLocation: collectionCheck.needsLocation || false,
            });
          } catch (collectionError) {
            console.error("[ProductDetails] Collection check error:", collectionError);
            setLocationStatus({
              isRefrigerated: false,
              allowed: true,
              distance: null,
              isLoading: false,
              error: null,
              needsLocation: false,
            });
          }
        }
      } catch (error) {
        console.error("[ProductDetails] Error in product collection check:", error);
        setLocationStatus(prev => ({ 
          ...prev, 
          isLoading: false,
          error: null, 
        }));
      }
    };

    if (product?.id) {
      checkProductCollection();
    }
  }, [product?.id]);

  useEffect(() => {
    const fetchCustomerInfo = async () => {
      try {
        const response = await getUserProfile()
        if (response?.success && response?.customer) {
          const customer = response.customer
          let shopifyCustomerId = customer.shopifyCustomerId || customer.id
          if (shopifyCustomerId && typeof shopifyCustomerId === 'string' && shopifyCustomerId.includes('/')) {
            shopifyCustomerId = shopifyCustomerId.split('/').pop()
          }
          setCustomerId(shopifyCustomerId ? String(shopifyCustomerId) : null)
          setCustomerName(customer.firstName && customer.lastName 
            ? `${customer.firstName} ${customer.lastName}`
            : customer.email || customer.firstName || 'Customer')
        }
      } catch (error) {
        console.error('Error fetching customer info:', error)
      }
    }
    fetchCustomerInfo()
  }, [])
  
  // Cart initialization
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

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoadingText(true)
        dispatch(setLoading(true))
        const response = await getProductById(id)
        const productData = response?.product?.product || response?.product || response
        setProduct(productData)
        if (productData?.variants && productData.variants.length > 0) {
          setSelectedVariant(productData.variants[0])
        }
      } catch (error) {
        console.error('Error fetching product:', error)
      } finally {
        setLoadingText(false)
        dispatch(setLoading(false))
      }
    }
    fetchProduct()
  }, [id, dispatch])

  const fetchFavorites = useCallback(async () => {
    try {
      dispatch(setLoading(true));
      const response = await getFavourites();
      if (response?.success) {
        const favs = response.favorites || response.favourites || [];
        const ids = new Set(favs.map((p) => String(p.id)));
        setFavoritesSet(ids);
      }
    } catch (err) {
      toast.error("Could not fetch favorites: " + (err?.message || err));
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch]);

  useEffect(() => {
    if (token && shopifyAccessToken) {
      fetchFavorites();
    }
  }, [token, shopifyAccessToken, fetchFavorites]);

  const getVariantGraphQLId = useCallback((variant) => {
    if (variant?.admin_graphql_api_id) {
      return variant.admin_graphql_api_id;
    }
    
    if (variant?.id && typeof variant.id === 'string' && variant.id.startsWith('gid://')) {
      return variant.id;
    }
    
    if (variant?.id) {
      const numericId = typeof variant.id === 'string' ? variant.id : String(variant.id);
      return `gid://shopify/ProductVariant/${numericId}`;
    }
    
    return null;
  }, []);

  // Update quantity in local state when variant changes or cart updates
  useEffect(() => {
    if (selectedVariant && cart) {
      const variantGraphQLId = getVariantGraphQLId(selectedVariant);
      if (variantGraphQLId && cart.lines?.edges) {
        const cartLine = cart.lines.edges.find(
          edge => edge.node.merchandise?.id === variantGraphQLId
        );
        if (cartLine) {
          setQuantity(cartLine.node.quantity);
        } else {
          setQuantity(1);
        }
      } else {
        setQuantity(1);
      }
    }
  }, [selectedVariant, cart, getVariantGraphQLId])

  // Helper to find cart line ID for a variant
  const findCartLineId = useCallback((variantGraphQLId) => {
    if (!cart || !cart.lines?.edges || !variantGraphQLId) return null;
    
    const cartLine = cart.lines.edges.find(
      edge => edge.node.merchandise?.id === variantGraphQLId
    );
    
    return cartLine ? cartLine.node.id : null;
  }, [cart]);

  const handleVariantSelect = (variant) => {
    setSelectedVariant(variant)
  }

  const handleQuantityChange = async (change) => {
    if (!cartId || !selectedVariant || isUpdatingCart) return;

    const newQuantity = quantity + change;
    if (newQuantity < 1) {
      toast.error("Quantity cannot be less than 1");
      return;
    }

    const stockQuantity = selectedVariant?.inventory_quantity || 0;
    if (newQuantity > stockQuantity) {
      toast.error(`Only ${stockQuantity} items available in stock`);
      return;
    }

    try {
      setIsUpdatingCart(true);
      const variantGraphQLId = getVariantGraphQLId(selectedVariant);
      if (!variantGraphQLId) {
        toast.error("Product variant ID not found");
        return;
      }

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

      // Check if item already exists in cart
      const existingLineId = findCartLineId(variantGraphQLId);

      if (existingLineId) {
        // Item exists in cart - use updateItemQuantity
        const response = await updateItemQuantity({
          cartId: currentCartId,
          lines: [
            {
              id: existingLineId,
              quantity: newQuantity,
            },
          ],
        });

        if (response?.success && response.cart) {
          dispatch(setCart(response.cart));
          dispatch(updateInventoryFromCart(response.cart));
          setQuantity(newQuantity);
        } else {
          toast.error(response?.errors?.[0]?.message || "Failed to update quantity");
        }
      } else {
        // Item doesn't exist - add it first
        const addResponse = await addItemsToCart({
          cartId: currentCartId,
          lines: [
            {
              merchandiseId: variantGraphQLId,
              quantity: newQuantity,
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
          if (cartResponse?.success && cartResponse.cart) {
            dispatch(updateInventoryFromCart(cartResponse.cart));
            dispatch(setCart(cartResponse.cart));
            setQuantity(newQuantity);
          }
        } else {
          toast.error("Failed to add item to cart: " + (addResponse?.errors || addResponse?.message));
        }
      }
    } catch (error) {
      console.error("Error updating cart:", error);
      toast.error("Error updating cart: " + (error.response?.data?.message || error.message));
    } finally {
      setIsUpdatingCart(false);
    }
  }

  // Handle add to cart button
  const handleAddToCart = async (navigateToCart = false) => {
    if (!cartId || !selectedVariant || isUpdatingCart) {
      if (!cartId) {
        toast.error("Cart not initialized yet. Please try again.");
      }
      return;
    }

    const variantGraphQLId = getVariantGraphQLId(selectedVariant);
    if (!variantGraphQLId) {
      toast.error("Product variant ID not found or invalid");
      return;
    }

    const available = product?.status === 'active' && (selectedVariant?.inventory_quantity || 0) > 0;
    if (!available) {
      toast.error("Product is not available");
      return;
    }

    // Check location for refrigerated products before adding to cart
    try {
      const productId = getNumericProductId(product?.id);
      if (productId) {
        setLocationStatus(prev => ({ ...prev, isLoading: true }));
        const locationCheck = await validateLocation({ productId });
        
        if (locationCheck.isRefrigerated && !locationCheck.allowed) {
          toast.error(
            locationCheck.error || 
            `Refrigerated products are only available within 30 km radius. You are ${locationCheck.distance || 'too far'} km away.`
          );
          setLocationStatus({
            isRefrigerated: locationCheck.isRefrigerated,
            allowed: false,
            distance: locationCheck.distance,
            isLoading: false,
          });
          setIsUpdatingCart(false);
          return;
        }

        // If refrigerated and needs location but user denied, show message
        if (locationCheck.isRefrigerated && locationCheck.needsLocation) {
          toast.error("Location access is required to order refrigerated products. Please enable location permissions.");
          try {
            await requestLocation();
            // Retry location check after permission granted
            const retryCheck = await validateLocation({ productId });
            if (retryCheck.isRefrigerated && !retryCheck.allowed) {
              toast.error(
                retryCheck.error || 
                `Refrigerated products are only available within 30 km radius. You are ${retryCheck.distance || 'too far'} km away.`
              );
              setLocationStatus({
                isRefrigerated: retryCheck.isRefrigerated,
                allowed: false,
                distance: retryCheck.distance,
                isLoading: false,
              });
              setIsUpdatingCart(false);
              return;
            }
            setLocationStatus({
              isRefrigerated: retryCheck.isRefrigerated,
              allowed: retryCheck.allowed,
              distance: retryCheck.distance,
              isLoading: false,
            });
          } catch {
            // User denied location
            setIsUpdatingCart(false);
            return;
          }
        } else {
          setLocationStatus({
            isRefrigerated: locationCheck.isRefrigerated || false,
            allowed: locationCheck.allowed !== false,
            distance: locationCheck.distance || null,
            isLoading: false,
          });
        }
      }
    } catch (error) {
      console.error("Error checking location:", error);
      // On error, still allow non-refrigerated products to be added
      setLocationStatus(prev => ({ ...prev, isLoading: false }));
    }

    try {
      setIsUpdatingCart(true);
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

      // Check if item already exists in cart
      const existingLineId = findCartLineId(variantGraphQLId);
      const currentCartQuantity = existingLineId 
        ? cart.lines.edges.find(edge => edge.node.id === existingLineId)?.node.quantity || 0
        : 0;
      const newQuantity = currentCartQuantity + quantity;

      if (existingLineId) {
        // Item exists - update quantity
        const response = await updateItemQuantity({
          cartId: currentCartId,
          lines: [
            {
              id: existingLineId,
              quantity: newQuantity,
            },
          ],
        });

        if (response?.success && response.cart) {
          dispatch(setCart(response.cart));
          dispatch(updateInventoryFromCart(response.cart));
          setQuantity(newQuantity);
          if (navigateToCart) {
            navigate('/cart');
          }
        } else {
          toast.error(response?.errors?.[0]?.message || "Failed to update cart");
        }
      } else {
        // Item doesn't exist - add it
        const addResponse = await addItemsToCart({
          cartId: currentCartId,
          lines: [
            {
              merchandiseId: variantGraphQLId,
              quantity: quantity,
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
          if (cartResponse?.success && cartResponse.cart) {
            dispatch(updateInventoryFromCart(cartResponse.cart));
            dispatch(setCart(cartResponse.cart));
          }
          if (navigateToCart) {
            navigate('/cart');
          }
        } else {
          toast.error("Failed to add item to cart: " + (addResponse?.errors || addResponse?.message));
        }
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error("Error adding to cart: " + (error.response?.data?.message || error.message));
    } finally {
      setIsUpdatingCart(false);
    }
  }

  // Handle buy it now button- same logic as add to cart but navigates to cart page
  const handleBuyNow = async () => {
    await handleAddToCart(true);
  }

  const formatPrice = (price) => {
    return parseFloat(price || 0).toFixed(2)
  }

  // Helper function to get product images as an array
  const getProductImages = (productData) => {
    if (productData?.images && productData.images.length > 0) {
      return productData.images.map((img) => img.src);
    }
    if (productData?.image?.src) {
      return [productData.image.src];
    }
    return [];
  };

  const parseHTML = (htmlString) => {
    // Extract text and list items from HTML
    const parser = new DOMParser()
    const doc = parser.parseFromString(htmlString, 'text/html')
    const paragraphs = Array.from(doc.querySelectorAll('p')).map(p => p.textContent)
    const listItems = Array.from(doc.querySelectorAll('li')).map(li => li.textContent.replace(/✔|✓/g, '✓'))
    return { paragraphs, listItems }
  }

  if (loadingText) {
    return (
      <div className="flex justify-center items-center min-h-screen" style={{ backgroundColor: theme.colors.background.main }}>
        <p style={{ color: theme.colors.text.primary }}>Loading Product Details...</p>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="flex justify-center items-center min-h-screen" style={{ backgroundColor: theme.colors.background.main }}>
        <p style={{ color: theme.colors.text.primary }}>Product not found</p>
      </div>
    )
  }

  const { paragraphs, listItems } = parseHTML(product.body_html || '')
  const currentPrice = selectedVariant?.price || '0.00'
  const comparePrice = selectedVariant?.compare_at_price || null
  const hasDiscount = comparePrice && comparePrice !== currentPrice

  return (
    <div className="min-h-screen py-6 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: theme.colors.background.main }}>
      <div className="container mx-auto max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10 items-start">
          <div className="flex justify-center items-start lg:sticky lg:top-6">
            <div className="w-full">
              <div 
                className="w-full rounded-lg overflow-hidden shadow-md cursor-zoom-in"
                style={{ 
                  border: `1px solid ${theme.colors.border.light}`,
                  backgroundColor: '#fff',
                  aspectRatio: '1 / 1',
                  maxHeight: '600px'
                }}
              >
                <ProductImageCarousel product={product} getProductImages={getProductImages} currentImageIndex={currentImageIndex} setCurrentImageIndex={setCurrentImageIndex} isPaused={isPaused} setIsPaused={setIsPaused} />
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4 lg:gap-5">
            <div className="flex items-center gap-6">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight " style={{ color: theme.colors.text.primary }}>
              {product.title}
            </h1>
        <button
          onClick={(e) => {
            e.stopPropagation();
            const prodId = product?.id;
            if (!prodId) return;
            (async () => {
              try {
                const idStr = String(prodId);
                const isFavorited = favoritesSet.has(idStr);

                if (isFavorited) {
                  dispatch(setLoading(true));
                  await removeFavourite({ favouriteId: idStr });
                  dispatch(setLoading(false));
                  setFavoritesSet((prev) => {
                    const copy = new Set(prev);
                    copy.delete(idStr);
                    return copy;
                  });
                  toast.success("Removed from favorites");
                } else {
                  dispatch(setLoading(true));
                  await addFavourite({ productId: prodId });
                  dispatch(setLoading(false));
                  setFavoritesSet((prev) => new Set(prev).add(idStr));
                  toast.success("Added to favorites");
                }
              } catch (err) {
                dispatch(setLoading(false));
                toast.error(
                  err.response?.data?.message || "Failed to update favorites"
                );
              }
            })();
          }}
          aria-label="Toggle wishlist"
          className="z-30 p-2 rounded-full shadow-md hover:shadow-lg transition-all cursor-pointer"
          style={{
            backgroundColor: theme.colors.accent.primary,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minWidth: "40px",
            minHeight: "40px",
          }}
        >
          {favoritesSet.has(String(product?.id)) ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-6 h-6"
              viewBox="0 0 24 24"
              fill="currentColor"
              style={{ color: 'white' }}
            >
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          ) : (
            <Heart
              className="w-6 h-6"
              style={{ color: 'white' }}
            />
          )}
        </button>
        </div>
            <div className="flex items-baseline gap-3">
              <span className="text-2xl sm:text-3xl font-bold" style={{ color: theme.colors.text.primary }}>
                Rs. {formatPrice(currentPrice)}
              </span>
              {hasDiscount && (
                <span className="text-lg sm:text-xl line-through opacity-60" style={{ color: theme.colors.text.secondary }}>
                  Rs. {formatPrice(comparePrice)}
                </span>
              )}
            </div>

            {product.options && product.options.length > 0 && (
              <div className="flex flex-col gap-2">
                <h3 className="text-base sm:text-lg font-semibold" style={{ color: theme.colors.text.primary }}>
                  Weight
                </h3>
                <div className="flex flex-wrap gap-2">
                  {product.variants.map((variant) => {
                    const optionValue = variant.option1 || variant.title
                    const isSelected = selectedVariant?.id === variant.id
                    return (
                      <button
                        key={variant.id}
                        onClick={() => handleVariantSelect(variant)}
                        className="px-5 py-2 rounded-md font-medium transition-all duration-200 text-sm sm:text-base"
                        style={{
                          backgroundColor: isSelected ? theme.colors.accent.primary : 'transparent',
                          color: isSelected ? theme.colors.background.main : theme.colors.text.primary,
                          border: `1px solid ${theme.colors.text.primary}`,
                        }}
                      >
                        {optionValue}
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            <div className="flex items-center gap-3">
              <span className="text-base sm:text-lg font-semibold whitespace-nowrap" style={{ color: theme.colors.text.primary }}>
                Quantity:
              </span>
              <div className="flex items-center border-2 rounded-md overflow-hidden" style={{ borderColor: theme.colors.border.light }}>
                <button
                  onClick={() => handleQuantityChange(-1)}
                  disabled={isUpdatingCart || quantity <= 1}
                  className="px-3 py-2 font-bold text-lg hover:opacity-70 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ 
                    color: theme.colors.text.primary,
                    backgroundColor: theme.colors.background.main
                  }}
                >
                  -
                </button>
                <span className="px-4 py-2 font-semibold text-base min-w-[50px] text-center" style={{ 
                  color: theme.colors.text.primary,
                  backgroundColor: theme.colors.background.main,
                  borderLeft: `1px solid ${theme.colors.border.light}`,
                  borderRight: `1px solid ${theme.colors.border.light}`
                }}>
                  {quantity}
                </span>
                <button
                  onClick={() => handleQuantityChange(1)}
                  disabled={isUpdatingCart || quantity >= (selectedVariant?.inventory_quantity || 0)}
                  className="px-3 py-2 font-bold text-lg hover:opacity-70 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ 
                    color: theme.colors.text.primary,
                    backgroundColor: theme.colors.background.main
                  }}
                >
                  +
                </button>
              </div>
            </div>

            {/* Delivery Badge */}
            {product?.id && (
              <DeliveryBadge
                isRefrigerated={locationStatus.isRefrigerated}
                isLocationAllowed={locationStatus.allowed}
                distance={locationStatus.distance}
                isLoading={locationStatus.isLoading}
                error={locationStatus.error}
              />
            )}

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => {
                  handleAddToCart(false)
                }}
                disabled={!cartId || isUpdatingCart || !selectedVariant || (selectedVariant?.inventory_quantity || 0) <= 0 || (locationStatus.isRefrigerated && locationStatus.allowed === false)}
                className="flex items-center justify-center gap-2 px-6 py-3 rounded-md font-semibold hover:opacity-90 transition-opacity flex-1 sm:flex-none disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                style={{
                  backgroundColor: theme.colors.accent.primary,
                  color: theme.colors.background.main,
                }}
              >
                <ShoppingCart className="w-5 h-5" />
                {isUpdatingCart ? "Adding..." : "Add to cart"}
              </button>
              <button
                onClick={() => {
                  handleBuyNow()
                }}
                disabled={!cartId || isUpdatingCart || !selectedVariant || (selectedVariant?.inventory_quantity || 0) <= 0 || (locationStatus.isRefrigerated && locationStatus.allowed === false)}
                className="flex items-center justify-center gap-2 px-6 py-3 rounded-md font-semibold hover:opacity-90 transition-opacity flex-1 sm:flex-none disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                style={{
                  backgroundColor: theme.colors.accent.primary,
                  color: theme.colors.background.main,
                }}
              >
                <ShoppingBag className="w-5 h-5" />
                {isUpdatingCart ? "Adding..." : "Buy it now"}
              </button>
            </div>

            <div className="border-t pt-4" style={{ borderColor: theme.colors.border.light }}></div>

            {paragraphs.length > 0 && (
              <div className="flex flex-col gap-2">
                <h3 className="text-base sm:text-lg font-semibold" style={{ color: theme.colors.text.primary }}>
                  Description
                </h3>
                <p className="text-sm sm:text-base leading-relaxed" style={{ color: theme.colors.text.secondary }}>
                  {paragraphs.join(' ')}
                </p>
              </div>
            )}

            {listItems.length > 0 && (
              <div className="flex flex-col gap-2">
                <h3 className="text-base sm:text-lg font-semibold" style={{ color: theme.colors.text.primary }}>
                  Key Features
                </h3>
                {listItems.map((item, index) => (
                  <div key={index}>
                    <span className="text-sm sm:text-base leading-relaxed" style={{ color: theme.colors.text.secondary }}>
                      {item.trim()}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Product Reviews Section */}
      {product && (
        <div className="mt-8">
          <ProductReviews
            productId={product.id}
            customerId={customerId}
            customerName={customerName}
          />
        </div>
      )}
    </div>
  )
}

export default ProductDetails