import React, { useState } from 'react';
import { MapPin, Check, X } from 'lucide-react';
import { checkRadius } from '../apiCalls/geo';
import toast from 'react-hot-toast';
import theme from '../lib/theme';

// Location Debug Panel Component
function LocationDebugPanel({ onLocationSet, isOpen, onClose }) {
  const [manualLat, setManualLat] = useState('');
  const [manualLng, setManualLng] = useState('');
  const [isValidating, setIsValidating] = useState(false);

  const handleManualLocation = async () => {
    const lat = parseFloat(manualLat);
    const lng = parseFloat(manualLng);

    if (isNaN(lat) || isNaN(lng)) {
      toast.error('Please enter valid coordinates');
      return;
    }

    if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
      toast.error('Invalid coordinates. Lat: -90 to 90, Lng: -180 to 180');
      return;
    }

    setIsValidating(true);
    try {
      const result = await checkRadius({ lat, lng });
      if (result.allowed) {
        // Store manually entered location
        localStorage.setItem('userLocation', JSON.stringify({
          lat,
          lng,
          timestamp: Date.now(),
          manual: true,
        }));
        
        toast.success(`Location set! You are ${result.distance} km away.`);
        if (onLocationSet) {
          onLocationSet({ lat, lng });
        }
        if (onClose) {
          onClose();
        }
      } else {
        toast.error(`Location is ${result.distance} km away (max: ${result.maxRadius} km)`);
      }
    } catch (error) {
      toast.error('Error validating location: ' + (error.response?.data?.message || error.message));
    } finally {
      setIsValidating(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-6 max-w-md w-full" style={{ backgroundColor: theme.colors.background.main }}>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold" style={{ color: theme.colors.text.primary }}>
            Manual Location Input
          </h3>
          {onClose && (
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
        
        <p className="text-sm mb-4" style={{ color: theme.colors.text.secondary }}>
          If GPS is not working, you can manually enter your coordinates. 
          You can find your coordinates using Google Maps or other mapping services.
        </p>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: theme.colors.text.primary }}>
              Latitude (e.g., 13.0827)
            </label>
            <input
              type="number"
              step="any"
              value={manualLat}
              onChange={(e) => setManualLat(e.target.value)}
              placeholder="13.0827"
              className="w-full px-4 py-2 border rounded-md"
              style={{ borderColor: theme.colors.border.light }}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: theme.colors.text.primary }}>
              Longitude (e.g., 80.2707)
            </label>
            <input
              type="number"
              step="any"
              value={manualLng}
              onChange={(e) => setManualLng(e.target.value)}
              placeholder="80.2707"
              className="w-full px-4 py-2 border rounded-md"
              style={{ borderColor: theme.colors.border.light }}
            />
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleManualLocation}
              disabled={isValidating || !manualLat || !manualLng}
              className="flex-1 px-4 py-2 rounded-md font-semibold text-white transition disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ backgroundColor: theme.colors.accent.primary }}
            >
              {isValidating ? 'Validating...' : 'Set Location'}
            </button>
            {onClose && (
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-md border"
                style={{ 
                  borderColor: theme.colors.border.light,
                  color: theme.colors.text.primary 
                }}
              >
                Cancel
              </button>
            )}
          </div>

          <div className="text-xs text-gray-500 mt-4">
            <p><strong>Tip:</strong> To find your coordinates:</p>
            <ol className="list-decimal list-inside space-y-1 mt-2">
              <li>Open Google Maps</li>
              <li>Right-click on your location</li>
              <li>Copy the coordinates shown</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LocationDebugPanel;


