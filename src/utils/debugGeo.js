// Test geolocation API directly
export const testLocation = () => {
  console.log('=== Testing Geolocation API ===');
  
  if (!navigator.geolocation) {
    console.error('❌ Geolocation API not supported');
    return;
  }
  
  console.log('✅ Geolocation API is supported');
  
  const options = {
    enableHighAccuracy: true,
    timeout: 20000,
    maximumAge: 0,
  };
  
  console.log('📡 Requesting location with options:', options);
  
  navigator.geolocation.getCurrentPosition(
    (position) => {
      console.log('✅ Location obtained:', {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
        accuracy: position.coords.accuracy,
        altitude: position.coords.altitude,
        altitudeAccuracy: position.coords.altitudeAccuracy,
        heading: position.coords.heading,
        speed: position.coords.speed,
        timestamp: new Date(position.timestamp),
      });
    },
    (error) => {
      console.error('❌ Location error:', {
        code: error.code,
        message: error.message,
        codeName: error.code === 1 ? 'PERMISSION_DENIED' :
                  error.code === 2 ? 'POSITION_UNAVAILABLE' :
                  error.code === 3 ? 'TIMEOUT' : 'UNKNOWN',
      });
    },
    options
  );
};

// Check browser permissions for geolocation
export const checkPermissions = async () => {
  console.log('=== Checking Geolocation Permissions ===');
  
  if (!navigator.permissions) {
    console.warn('⚠️ Permissions API not supported. Cannot check permission status.');
    return;
  }
  
  try {
    const result = await navigator.permissions.query({ name: 'geolocation' });
    console.log('📍 Geolocation permission status:', result.state);
    
    result.onchange = () => {
      console.log('📍 Permission status changed to:', result.state);
    };
  } catch (error) {
    console.error('❌ Error checking permissions:', error);
  }
};

// Test backend geo API
export const testBackend = async (productId = null, lat = null, lng = null) => {
  console.log('=== Testing Backend Geo API ===');
  
  const API_URL = 'http://localhost:7777/api';
  
  try {
    const payload = {
      ...(productId && { productId }),
      ...(lat && lng && { lat, lng }),
      ...(productId && !lat && !lng && { checkCollectionOnly: true }),
    };
    
    console.log('📤 Sending request:', payload);
    
    const response = await fetch(`${API_URL}/geo/check-radius`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
    
    const data = await response.json();
    
    console.log('📥 Response status:', response.status);
    console.log('📥 Response data:', data);
    
    return data;
  } catch (error) {
    console.error('❌ Backend test error:', error);
  }
};

// Check cached location
export const checkCache = () => {
  console.log('=== Checking Cached Location ===');
  
  try {
    const cached = localStorage.getItem('userLocation');
    if (cached) {
      const data = JSON.parse(cached);
      const age = Date.now() - data.timestamp;
      const ageMinutes = Math.floor(age / 60000);
      
      console.log('💾 Cached location found:', {
        lat: data.lat,
        lng: data.lng,
        timestamp: new Date(data.timestamp),
        ageMinutes: `${ageMinutes} minutes`,
        isValid: age < 30 * 60 * 1000,
      });
      
      return data;
    } else {
      console.log('💾 No cached location found');
      return null;
    }
  } catch (error) {
    console.error('❌ Error reading cache:', error);
    return null;
  }
};

// Clear cached location
export const clearCache = () => {
  console.log('=== Clearing Cached Location ===');
  localStorage.removeItem('userLocation');
  console.log('✅ Cache cleared');
};

// Attach to window for easy console access
if (typeof window !== 'undefined') {
  window.debugGeo = {
    testLocation,
    checkPermissions,
    testBackend,
    checkCache,
    clearCache,
  };
  
  console.log('🔧 Debug utilities loaded! Use window.debugGeo.* to debug location issues');
}


