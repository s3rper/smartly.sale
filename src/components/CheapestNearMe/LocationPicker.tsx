import React, { useEffect, useRef, useState } from 'react';
import { MapPin, Crosshair, Check, List, Map as MapIcon, Search, Navigation } from 'lucide-react';

interface LocationPickerProps {
  initialLocation?: { lat: number; lon: number };
  productType?: string; // To search for relevant nearby places
  storeName?: string; // To search for specific store
  onLocationSelect: (location: { lat: number; lon: number; address: string }) => void;
  onClose: () => void;
}

interface NearbyPlace {
  name: string;
  address: string;
  lat: number;
  lon: number;
  distance?: number;
  type: string;
}

// Map product types to search categories
const PRODUCT_TO_CATEGORY: Record<string, string[]> = {
  gasoline: ['fuel', 'gas_station', 'petrol_station'],
  diesel: ['fuel', 'gas_station', 'petrol_station'],
  lpg: ['fuel', 'gas_station'],
  rice: ['supermarket', 'grocery', 'convenience'],
  bread: ['bakery', 'supermarket', 'grocery'],
  eggs: ['supermarket', 'grocery', 'convenience'],
  chicken: ['butcher', 'supermarket', 'grocery'],
  pork: ['butcher', 'supermarket', 'grocery'],
  beef: ['butcher', 'supermarket', 'grocery'],
  fish: ['seafood', 'supermarket', 'grocery'],
  water: ['supermarket', 'grocery', 'convenience'],
  milk: ['supermarket', 'grocery', 'convenience'],
  coffee: ['cafe', 'supermarket', 'grocery'],
  sugar: ['supermarket', 'grocery', 'convenience'],
  salt: ['supermarket', 'grocery', 'convenience'],
};

export default function LocationPicker({
  initialLocation,
  productType,
  storeName,
  onLocationSelect,
  onClose,
}: LocationPickerProps) {
  const mapRef = useRef<any>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const markerRef = useRef<any>(null);
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [selectedLocation, setSelectedLocation] = useState(
    initialLocation || { lat: 14.5995, lon: 120.9842 } // Manila default
  );
  const [address, setAddress] = useState('Loading address...');
  const [loading, setLoading] = useState(false);
  const [nearbyPlaces, setNearbyPlaces] = useState<NearbyPlace[]>([]);
  const [loadingPlaces, setLoadingPlaces] = useState(false);
  const [searchQuery, setSearchQuery] = useState(storeName || '');
  const [selectedPlaceIndex, setSelectedPlaceIndex] = useState<number | null>(null);

  // Get search categories based on product type
  const getSearchCategories = () => {
    if (!productType) return ['supermarket', 'grocery', 'convenience'];
    const key = productType.toLowerCase();
    return PRODUCT_TO_CATEGORY[key] || ['supermarket', 'grocery', 'convenience'];
  };

  // Calculate distance between two coordinates
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  // Search for nearby places
  const searchNearbyPlaces = async (userLat: number, userLon: number) => {
    setLoadingPlaces(true);
    try {
      const categories = getSearchCategories();
      const allPlaces: NearbyPlace[] = [];

      // Search using Overpass API for better results
      const query = `
        [out:json][timeout:25];
        (
          node["shop"="supermarket"](around:5000,${userLat},${userLon});
          node["shop"="convenience"](around:5000,${userLat},${userLon});
          node["shop"="grocery"](around:5000,${userLat},${userLon});
          node["amenity"="fuel"](around:5000,${userLat},${userLon});
          node["shop"="bakery"](around:5000,${userLat},${userLon});
          node["shop"="butcher"](around:5000,${userLat},${userLon});
        );
        out body;
      `;

      const response = await fetch('https://overpass-api.de/api/interpreter', {
        method: 'POST',
        body: query,
      });

      const data = await response.json();

      if (data.elements) {
        data.elements.forEach((element: any) => {
          if (element.tags && element.tags.name) {
            const distance = calculateDistance(userLat, userLon, element.lat, element.lon);

            // Build address from tags
            let addr = '';
            if (element.tags['addr:street']) {
              addr = element.tags['addr:street'];
              if (element.tags['addr:city']) addr += ', ' + element.tags['addr:city'];
            } else if (element.tags['addr:city']) {
              addr = element.tags['addr:city'];
            }

            allPlaces.push({
              name: element.tags.name,
              address: addr || 'Address not available',
              lat: element.lat,
              lon: element.lon,
              distance,
              type: element.tags.shop || element.tags.amenity || 'store',
            });
          }
        });
      }

      // Sort by distance
      allPlaces.sort((a, b) => (a.distance || 0) - (b.distance || 0));

      // Limit to 50 results
      setNearbyPlaces(allPlaces.slice(0, 50));
    } catch (error) {
      console.error('Error searching nearby places:', error);

      // Fallback to Nominatim search
      try {
        const searchTerm = storeName || productType || 'store';
        const nominatimUrl = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
          searchTerm
        )}&format=json&addressdetails=1&limit=20&lat=${userLat}&lon=${userLon}&bounded=1&viewbox=${userLon - 0.05},${userLat + 0.05},${userLon + 0.05},${userLat - 0.05}`;

        const response = await fetch(nominatimUrl);
        const data = await response.json();

        const places = data.map((place: any) => ({
          name: place.display_name.split(',')[0],
          address: place.display_name,
          lat: parseFloat(place.lat),
          lon: parseFloat(place.lon),
          distance: calculateDistance(userLat, userLon, parseFloat(place.lat), parseFloat(place.lon)),
          type: place.type,
        }));

        places.sort((a: NearbyPlace, b: NearbyPlace) => (a.distance || 0) - (b.distance || 0));
        setNearbyPlaces(places);
      } catch (fallbackError) {
        console.error('Fallback search error:', fallbackError);
      }
    } finally {
      setLoadingPlaces(false);
    }
  };

  // Reverse geocode to get address
  const getAddress = async (lat: number, lon: number) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`
      );
      const data = await response.json();
      return data.display_name || 'Unknown location';
    } catch (error) {
      console.error('Geocoding error:', error);
      return 'Unable to determine address';
    }
  };

  // Initialize map
  useEffect(() => {
    if (viewMode !== 'map' || !mapContainerRef.current || mapRef.current) return;

    const initMap = async () => {
      const L = (await import('leaflet')).default;
      await import('leaflet/dist/leaflet.css');

      // Use current selectedLocation for map initialization
      // Don't override it with geolocation if already set
      const map = L.map(mapContainerRef.current!).setView(
        [selectedLocation.lat, selectedLocation.lon],
        15
      );

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(map);

      // Custom draggable marker
      const markerIcon = L.divIcon({
        className: 'custom-marker',
        html: `
          <div style="
            position: relative;
            width: 40px;
            height: 50px;
          ">
            <div style="
              position: absolute;
              top: 0;
              left: 50%;
              transform: translateX(-50%);
              width: 30px;
              height: 30px;
              background-color: #EF4444;
              border: 3px solid white;
              border-radius: 50% 50% 50% 0;
              transform: rotate(-45deg) translateX(-50%);
              box-shadow: 0 4px 8px rgba(0,0,0,0.3);
            "></div>
            <div style="
              position: absolute;
              top: 7px;
              left: 50%;
              transform: translateX(-50%);
              width: 10px;
              height: 10px;
              background-color: white;
              border-radius: 50%;
              z-index: 1;
            "></div>
          </div>
        `,
        iconSize: [40, 50],
        iconAnchor: [20, 50],
      });

      const marker = L.marker([selectedLocation.lat, selectedLocation.lon], {
        icon: markerIcon,
        draggable: true,
      }).addTo(map);

      marker.on('dragend', async function (e: any) {
        const position = e.target.getLatLng();
        setSelectedLocation({ lat: position.lat, lon: position.lng });
        setLoading(true);
        const addr = await getAddress(position.lat, position.lng);
        setAddress(addr);
        setLoading(false);
      });

      // Click on map to move marker
      map.on('click', async function (e: any) {
        const { lat, lng } = e.latlng;
        marker.setLatLng([lat, lng]);
        setSelectedLocation({ lat, lon: lng });
        setLoading(true);
        const addr = await getAddress(lat, lng);
        setAddress(addr);
        setLoading(false);
      });

      mapRef.current = map;
      markerRef.current = marker;

      // Get initial address only if address is still "Loading address..."
      if (address === 'Loading address...') {
        const initialAddr = await getAddress(selectedLocation.lat, selectedLocation.lon);
        setAddress(initialAddr);
      }
    };

    initMap();

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
        markerRef.current = null;
      }
    };
  }, [viewMode]);

  // Search nearby places when component mounts
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLoc = {
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          };
          setSelectedLocation(userLoc);
          searchNearbyPlaces(userLoc.lat, userLoc.lon);
        },
        () => {
          // Use default location
          searchNearbyPlaces(selectedLocation.lat, selectedLocation.lon);
        }
      );
    } else {
      searchNearbyPlaces(selectedLocation.lat, selectedLocation.lon);
    }
  }, []);

  const handleConfirm = () => {
    onLocationSelect({
      lat: selectedLocation.lat,
      lon: selectedLocation.lon,
      address,
    });
    onClose();
  };

  const handlePlaceSelect = async (place: NearbyPlace, index: number) => {
    setSelectedPlaceIndex(index);
    setSelectedLocation({ lat: place.lat, lon: place.lon });
    setAddress(place.name + ', ' + place.address);

    // Switch to map view first
    setViewMode('map');

    // Wait a bit for map to initialize if switching views
    await new Promise(resolve => setTimeout(resolve, 100));

    // Animate map to the selected location
    if (mapRef.current && markerRef.current) {
      // Fly to the location with smooth animation
      mapRef.current.flyTo([place.lat, place.lon], 17, {
        duration: 1.5, // Animation duration in seconds
        easeLinearity: 0.25
      });

      // Update marker position
      markerRef.current.setLatLng([place.lat, place.lon]);

      // Optionally make the marker bounce or pulse
      setTimeout(() => {
        if (markerRef.current) {
          // Add a temporary bounce animation by manipulating the marker
          const originalLatLng = markerRef.current.getLatLng();
          let bounces = 3;
          const bounceInterval = setInterval(() => {
            if (bounces > 0 && markerRef.current) {
              markerRef.current.setLatLng(originalLatLng);
              bounces--;
            } else {
              clearInterval(bounceInterval);
            }
          }, 150);
        }
      }, 1500); // Start bounce after fly animation completes
    }
  };

  const centerOnUser = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const userLoc = {
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          };
          setSelectedLocation(userLoc);

          if (mapRef.current) {
            mapRef.current.setView([userLoc.lat, userLoc.lon], 15);
          }
          if (markerRef.current) {
            markerRef.current.setLatLng([userLoc.lat, userLoc.lon]);
          }

          setLoading(true);
          const addr = await getAddress(userLoc.lat, userLoc.lon);
          setAddress(addr);
          setLoading(false);
        },
        (error) => {
          alert('Unable to get your location. Please enable location services.');
        }
      );
    }
  };

  const filteredPlaces = searchQuery
    ? nearbyPlaces.filter((place) =>
        place.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        place.address.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : nearbyPlaces;

  return (
    <div className="fixed inset-0 bg-white flex flex-col" style={{ zIndex: 99999 }}>
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-4 shadow-sm" style={{ zIndex: 100000 }}>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xl font-bold text-gray-900">Select Location</h2>
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            Cancel
          </button>
        </div>

        {/* View Toggle */}
        <div className="flex gap-2 mb-3">
          <button
            onClick={() => setViewMode('list')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg font-semibold transition-all ${
              viewMode === 'list'
                ? 'bg-blue-600 !text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            style={viewMode === 'list' ? { color: '#ffffff' } : undefined}
          >
            <List className="w-5 h-5" />
            <span>Nearby Places</span>
          </button>
          <button
            onClick={() => setViewMode('map')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg font-semibold transition-all ${
              viewMode === 'map'
                ? 'bg-blue-600 !text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            style={viewMode === 'map' ? { color: '#ffffff' } : undefined}
          >
            <MapIcon className="w-5 h-5" />
            <span>Map Pin</span>
          </button>
        </div>

        <p className="text-sm text-gray-600">
          {viewMode === 'list'
            ? 'Select from nearby stores or search'
            : 'Tap on the map or drag the pin to select location'}
        </p>
      </div>

      {/* Content */}
      {viewMode === 'list' ? (
        /* List View */
        <div className="flex-1 overflow-y-auto">
          <div className="p-4">
            {/* Search Bar */}
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search stores..."
                className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {loadingPlaces ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mb-4"></div>
                <p className="text-gray-600 font-medium">Finding nearby places...</p>
              </div>
            ) : filteredPlaces.length > 0 ? (
              <div className="space-y-2">
                {filteredPlaces.map((place, index) => {
                  const isSelected = selectedPlaceIndex === index;
                  return (
                    <button
                      key={index}
                      onClick={() => handlePlaceSelect(place, index)}
                      className={`w-full text-left p-4 border-2 rounded-xl transition-all active:scale-98 ${
                        isSelected
                          ? 'bg-gradient-to-r from-blue-50 to-green-50 border-blue-500 shadow-md'
                          : 'bg-white border-gray-200 hover:border-blue-500 hover:bg-blue-50'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <MapPin className={`w-4 h-4 flex-shrink-0 ${isSelected ? 'text-green-600' : 'text-blue-600'}`} />
                            <h3 className={`font-bold ${isSelected ? 'text-blue-900' : 'text-gray-900'}`}>
                              {place.name}
                            </h3>
                            {isSelected && (
                              <span className="px-2 py-0.5 bg-green-500 text-white text-xs rounded-full font-bold">
                                Selected
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mb-1">{place.address}</p>
                          {place.distance !== undefined && (
                            <p className={`text-xs font-semibold ${isSelected ? 'text-green-600' : 'text-blue-600'}`}>
                              📍 {place.distance.toFixed(2)} km away
                            </p>
                          )}
                        </div>
                        <Navigation className={`w-5 h-5 flex-shrink-0 mt-1 ${isSelected ? 'text-green-600' : 'text-gray-400'}`} />
                      </div>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12">
                <MapPin className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600 font-medium mb-2">No nearby places found</p>
                <p className="text-sm text-gray-500 mb-4">
                  Try using the map pin to select a custom location
                </p>
                <button
                  onClick={() => setViewMode('map')}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 !text-white rounded-xl font-semibold transition-colors"
                  style={{ color: '#ffffff' }}
                >
                  Use Map Pin
                </button>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Map View */
        <div className="flex-1 relative">
          <div ref={mapContainerRef} className="w-full h-full" />

          {/* Center on User Button */}
          <button
            onClick={centerOnUser}
            className="absolute top-4 right-4 z-[1000] w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
            title="Center on my location"
          >
            <Crosshair className="w-6 h-6 text-blue-600" />
          </button>

          {/* Instructions */}
          <div className="absolute top-4 left-4 z-[1000] bg-white rounded-xl shadow-lg px-4 py-3 max-w-xs">
            <div className="flex items-start gap-2">
              <MapPin className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-semibold text-gray-900 mb-1">
                  Drag the red pin or tap anywhere
                </p>
                <p className="text-gray-600 text-xs">
                  The address will update automatically
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Sheet with Address */}
      <div className="bg-white border-t border-gray-200 px-4 py-4 shadow-2xl">
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <MapPin className="w-5 h-5 text-gray-400" />
            <span className="text-sm font-semibold text-gray-700">Selected Address</span>
          </div>
          <div className="bg-gray-50 rounded-xl p-4 border-2 border-gray-200">
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-500 border-t-transparent"></div>
                <span className="text-sm text-gray-600">Getting address...</span>
              </div>
            ) : (
              <p className="text-gray-900 text-sm">{address}</p>
            )}
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Coordinates: {selectedLocation.lat.toFixed(6)}, {selectedLocation.lon.toFixed(6)}
          </p>
        </div>

        <button
          onClick={handleConfirm}
          disabled={loading}
          className="w-full px-6 py-4 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 !text-white rounded-2xl font-bold text-lg transition-all disabled:from-gray-400 disabled:to-gray-400 shadow-lg active:scale-98 flex items-center justify-center gap-2"
          style={{ color: '#ffffff' }}
        >
          <Check className="w-6 h-6" />
          Confirm Location
        </button>
      </div>
    </div>
  );
}
