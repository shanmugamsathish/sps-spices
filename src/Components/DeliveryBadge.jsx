import React from 'react';
import { Truck, MapPin, Clock } from 'lucide-react';
import theme from '../lib/theme';

// Delivery Badge Component
function DeliveryBadge({ isRefrigerated, isLocationAllowed, distance, isLoading = false, error = null }) {
  if (isLoading) {
    return (
      <div className="flex items-center gap-1.5 px-2 py-1 rounded text-xs font-medium"
        style={{ 
          backgroundColor: `${theme.colors.accent.primary}20`,
          color: theme.colors.text.secondary 
        }}
      >
        <Clock className="w-3 h-3 animate-spin" />
        <span>Checking delivery...</span>
      </div>
    );
  }

  if (error) {
    const isTimeoutError = error.toLowerCase().includes('timeout');
    const isPermissionError = error.toLowerCase().includes('permission') || error.toLowerCase().includes('denied');
    
    return (
      <div className={`flex items-center gap-1.5 px-2 py-1 rounded text-xs font-medium ${
        isTimeoutError || isPermissionError 
          ? 'bg-yellow-100 text-yellow-800' 
          : 'bg-red-100 text-red-800'
      }`}>
        <MapPin className="w-3 h-3" />
        <span>
          {isTimeoutError 
            ? 'Location timeout. Please try again or use manual location input.'
            : isPermissionError
            ? 'Location permission required. Please enable location access.'
            : error}
        </span>
      </div>
    );
  }

  if (isRefrigerated) {
    // isLocationAllowed can be: true (allowed), false (blocked), null/undefined (pending validation)
    if (isLocationAllowed === true) {
      return (
        <div className="flex items-center gap-1.5 px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-800">
          <Truck className="w-3 h-3" />
          <span>
            Same/Next Day Delivery (Within 30km)
            {distance !== null && ` • You are ${distance} km away`}
          </span>
        </div>
      );
    } else if (isLocationAllowed === false) {
      return (
        <div className="flex items-center gap-1.5 px-2 py-1 rounded text-xs font-medium bg-red-100 text-red-800">
          <MapPin className="w-3 h-3" />
          <span>
            Delivery available only within 30 km radius
            {distance !== null && ` • You are ${distance} km away`}
          </span>
        </div>
      );
    } else {
      // isLocationAllowed is null/undefined - pending validation
      return (
        <div className="flex items-center gap-1.5 px-2 py-1 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
          <MapPin className="w-3 h-3" />
          <span>Location will be checked at checkout</span>
        </div>
      );
    }
  } else {
    return (
      <div className="flex items-center gap-1.5 px-2 py-1 rounded text-xs font-medium"
        style={{ 
          backgroundColor: `${theme.colors.accent.primary}20`,
          color: theme.colors.text.secondary 
        }}
      >
        <Truck className="w-3 h-3" />
        <span>Delivery in 3–5 working days</span>
      </div>
    );
  }
}

export default DeliveryBadge;

