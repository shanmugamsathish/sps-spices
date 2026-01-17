import { axiosInstance } from "./index";
import { API_URL } from "../lib/constant";


// Check if user location is within allowed radius for refrigerated products
export const checkRadius = async (data) => {
  try {
    const response = await axiosInstance.post(`${API_URL}/geo/check-radius`, data);
    return response.data;
  } catch (error) {
    console.error('Error checking radius:', error);
    throw error;
  }
};

// Get user location using HTML5 Geolocation API with retry and fallback
export const getUserLocation = (options = {}, retries = 2) => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by this browser'));
      return;
    }

    const attemptGetLocation = (attemptNumber = 0, useLowAccuracy = false) => {
      const defaultOptions = useLowAccuracy
        ? {
            enableHighAccuracy: false,
            timeout: 15000,
            maximumAge: 5 * 60 * 1000,
          }
        : {
            enableHighAccuracy: true,
            timeout: 20000,
            maximumAge: 0,
          };

      const geoOptions = { ...defaultOptions, ...options };
      
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            accuracy: position.coords.accuracy,
          };
          resolve(coords);
        },
        (error) => {
          let errorMessage = 'Unable to retrieve your location';
          let shouldRetry = false;

          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = 'Location access denied by user. Please enable location permissions to order refrigerated products.';
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = 'Location information is unavailable. Please check your device settings.';
              shouldRetry = attemptNumber < retries;
              break;
            case error.TIMEOUT:
              errorMessage = attemptNumber < retries
                ? 'Location request timed out. Retrying with lower accuracy...'
                : 'Location request timed out. Please check your GPS/network connection and try again.';
              shouldRetry = attemptNumber < retries;
              break;
            default:
              errorMessage = 'An unknown error occurred while retrieving location';
              shouldRetry = attemptNumber < retries;
              break;
          }

          // Retry with lower accuracy if timeout or unavailable
          if (shouldRetry && (error.code === error.TIMEOUT || error.code === error.POSITION_UNAVAILABLE)) {
            setTimeout(() => {
              attemptGetLocation(attemptNumber + 1, true); // Use low accuracy on retry
            }, 1000); // Wait 1 second before retry
          } else {
            reject(new Error(errorMessage));
          }
        },
        geoOptions
      );
    };

    // Start first attempt
    attemptGetLocation(0, false);
  });
};

