import { useState, useEffect, useCallback } from 'react';
import { getUserLocation, checkRadius } from '../apiCalls/geo';

// Custom hook for managing user location and refrigerated product validation
export const useLocation = () => {
  const [location, setLocation] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasPermission, setHasPermission] = useState(null);

  // Request user location with permission
  const requestLocation = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const coords = await getUserLocation();
      setLocation(coords);
      setHasPermission(true);
      
      // Store location in localStorage for future use (with expiration)
      localStorage.setItem('userLocation', JSON.stringify({
        ...coords,
        timestamp: Date.now(),
      }));
      
      return coords;
    } catch (err) {
      setError(err.message);
      setHasPermission(false);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Get cached location from localStorage (if not expired)
  const getCachedLocation = useCallback(() => {
    try {
      const cached = localStorage.getItem('userLocation');
      if (cached) {
        const data = JSON.parse(cached);
        const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes
        
        if (Date.now() - data.timestamp < CACHE_DURATION) {
          return { lat: data.lat, lng: data.lng };
        }
      }
    } catch (error) {
      console.error('Error reading cached location:', error);
    }
    return null;
  }, []);

  // Check if product/cart is allowed for current location
  const validateLocation = useCallback(async (params = {}) => {
    let coords = location || getCachedLocation();

    try {
      if (params.productId && !coords) {
        try {
          // Check collection without requiring location
          const collectionCheck = await checkRadius({
            productId: params.productId,
            checkCollectionOnly: true, // Backend will only check collection, not require location
          });
          

          // If product is NOT refrigerated, return early (no location needed)
          if (!collectionCheck.isRefrigerated) {
            return {
              ...collectionCheck,
              location: null,
            };
          }

          // Product IS refrigerated, proceed to get location
          console.log('[Location Validation] Product IS refrigerated - location required');
        } catch (err) {
          console.error('[Location Validation] Error in collection check:', err);
          // If collection check fails, assume not refrigerated (allow without location)
          if (err.response?.status === 200) {
            return {
              allowed: true,
              isRefrigerated: false,
              location: null,
            };
          }
          // Continue to try with location if available
        }
      }

      if (!coords) {
        try {
          console.log('[Location Validation] Step 2: Requesting user location...');
          coords = await requestLocation();
          console.log('[Location Validation] Location obtained successfully:', {
            lat: coords.lat,
            lng: coords.lng,
            accuracy: coords.accuracy,
          });
        } catch (err) {
          console.error('[Location Validation] Location request failed:', {
            message: err.message,
            code: err.code,
          });
          
          // Return error - location is required for refrigerated products
          return {
            allowed: false,
            needsLocation: true,
            isRefrigerated: true, // Assume refrigerated if we got here
            error: err.message,
            distance: null,
          };
        }
      }

      if (coords) {
        console.log('[Location Validation] Step 3: Validating location with backend...');
        const result = await checkRadius({
          lat: coords.lat,
          lng: coords.lng,
          ...params,
        });

        console.log('[Location Validation] Full validation result:', {
          allowed: result.allowed,
          isRefrigerated: result.isRefrigerated,
          distance: result.distance,
          message: result.message,
        });

        return {
          ...result,
          location: coords,
        };
      }

      // Fallback: Should not reach here, but handle anyway
      return {
        allowed: true,
        isRefrigerated: false,
        location: null,
      };
    } catch (err) {
      console.error('[Location Validation] Unexpected error:', err);
      // If backend validation fails, check response
      if (err.response?.data) {
        const errorData = err.response.data;
        
        // If backend says product is not refrigerated, allow it
        if (errorData.isRefrigerated === false || errorData.allowed === true) {
          return {
            allowed: true,
            isRefrigerated: false,
            location: coords || null,
          };
        }
      }
      
      // For other errors, return error state
      return {
        allowed: false,
        error: err.response?.data?.message || err.message || 'Location validation failed',
        distance: null,
        isRefrigerated: params.productId ? true : false,
      };
    }
  }, [location, getCachedLocation, requestLocation]);

  // Load cached location on mount
  useEffect(() => {
    const cached = getCachedLocation();
    if (cached) {
      setLocation(cached);
      setHasPermission(true);
    }
  }, [getCachedLocation]);

  // Clear cached location
  const clearLocation = useCallback(() => {
    setLocation(null);
    localStorage.removeItem('userLocation');
    setHasPermission(null);
    setError(null);
  }, []);

  return {
    location,
    isLoading,
    error,
    hasPermission,
    requestLocation,
    validateLocation,
    clearLocation,
    getCachedLocation,
  };
};

