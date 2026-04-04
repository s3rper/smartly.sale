import React, { useState, useEffect, lazy, Suspense } from 'react';
import { Search, MapPin, CheckCircle2, Award, List, Map as MapIcon, Plus, ChevronUp, ChevronDown, Moon, Sun, Wallet, Share2 } from 'lucide-react';
import GCashConversionForm from './GCashConversionForm';
import ShareModal from './ShareModal';

// Lazy load MapView to avoid SSR issues with Leaflet
const MapView = lazy(() => import('./MapView'));
const CitySelector = lazy(() => import('./CitySelector'));

interface PriceReport {
  id: string;
  storeName: string;
  itemName: string;
  variant?: string;
  price: number;
  unit: string;
  location: {
    latitude: number;
    longitude: number;
    accuracy?: number;
  };
  distance?: number;
  address: string;
  reportedBy: string;
  reportedAt: string;
  confirmedBy: string[];
}

interface PriceSearchProps {
  onReportClick: () => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
}

export default function PriceSearch({ onReportClick, darkMode, onToggleDarkMode }: PriceSearchProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [priceReports, setPriceReports] = useState<PriceReport[]>([]);
  const [allReports, setAllReports] = useState<PriceReport[]>([]); // Store all reports before radius filter
  const [loading, setLoading] = useState(false);
  const [userLocation, setUserLocation] = useState<{ lat: number; lon: number } | null>(null);
  const [locationStatus, setLocationStatus] = useState('Detecting location...');
  const [userPoints, setUserPoints] = useState(0);
  const [viewMode, setViewMode] = useState<'list' | 'map'>('map');
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null);
  const [filtersExpanded, setFiltersExpanded] = useState(false);
  const [showCitySelector, setShowCitySelector] = useState(false);
  const [locationDetectionAttempted, setLocationDetectionAttempted] = useState(false);
  const [searchRadius, setSearchRadius] = useState(5); // in kilometers
  const [showGCashForm, setShowGCashForm] = useState(false);
  const [shareReport, setShareReport] = useState<PriceReport | null>(null);
  const [userId] = useState(() => {
    if (typeof window !== 'undefined') {
      let id = localStorage.getItem('cheapest-near-me-user-id');
      if (!id) {
        id = `user-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
        localStorage.setItem('cheapest-near-me-user-id', id);
      }
      const points = localStorage.getItem('cheapest-near-me-points');
      if (points) {
        setUserPoints(parseInt(points, 10));
      }
      return id;
    }
    return 'user-unknown';
  });

  const popularSearches = [
    'Rice',
    'Gasoline',
    'Eggs',
    'Water',
    'Bread',
    'Sugar',
    'Cooking Oil',
    'Milk',
  ];

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          };
          setUserLocation(location);
          setLocationStatus('Location detected');
          setLocationDetectionAttempted(true);

          // Auto-load all nearby places on page load
          loadAllNearbyPlaces(location);
        },
        (error) => {
          setLocationStatus('Location permission denied');
          setLocationDetectionAttempted(true);
          setShowCitySelector(true);
          console.error('Location error:', error);
        }
      );
    } else {
      setLocationStatus('Geolocation not supported');
      setLocationDetectionAttempted(true);
      setShowCitySelector(true);
    }
  }, []);

  // Filter reports when radius changes
  useEffect(() => {
    if (allReports.length > 0) {
      const filtered = allReports.filter((report) =>
        !report.distance || report.distance <= searchRadius
      );
      setPriceReports(filtered);
      console.log(`Filtered ${allReports.length} reports to ${filtered.length} within ${searchRadius}km radius`);
    }
  }, [searchRadius, allReports]);

  const loadAllNearbyPlaces = async (location: { lat: number; lon: number }) => {
    try {
      setLoading(true);

      const params = new URLSearchParams({
        lat: location.lat.toString(),
        lon: location.lon.toString(),
      });

      const url = `/api/price-reports?${params}`;
      console.log('Loading all nearby places from:', url);

      const response = await fetch(url);
      console.log('Response status:', response.status);

      if (!response.ok) {
        console.error('API error:', response.statusText);
        throw new Error(`API returned ${response.status}`);
      }

      const data = await response.json() as PriceReport[];
      console.log('Received all price reports:', data);
      console.log('Number of reports:', data.length);

      // Store all reports and filter by radius
      setAllReports(data);
      const filtered = data.filter((report) =>
        !report.distance || report.distance <= searchRadius
      );
      setPriceReports(filtered);
      setSearchQuery('All Items'); // Set a placeholder search query
    } catch (error) {
      console.error('Error loading nearby places:', error);
      setPriceReports([]);
    } finally {
      setLoading(false);
    }
  };

  const searchPrices = async (item: string) => {
    if (!item.trim()) return;

    setLoading(true);
    setSearchQuery(item);

    try {
      const params = new URLSearchParams({
        itemName: item,
      });

      if (userLocation) {
        params.append('lat', userLocation.lat.toString());
        params.append('lon', userLocation.lon.toString());
      }

      const url = `/api/price-reports?${params}`;
      console.log('Fetching prices from:', url);

      const response = await fetch(url);
      console.log('Response status:', response.status);

      if (!response.ok) {
        console.error('API error:', response.statusText);
        throw new Error(`API returned ${response.status}`);
      }

      const data = await response.json() as PriceReport[];
      console.log('Received price reports:', data);
      console.log('Number of reports:', data.length);

      // Filter by radius
      const filtered = data.filter((report) =>
        !report.distance || report.distance <= searchRadius
      );
      setPriceReports(filtered);
      setAllReports(data);
    } catch (error) {
      console.error('Error fetching prices:', error);
      setPriceReports([]);
    } finally {
      setLoading(false);
    }
  };

  const confirmPrice = async (reportId: string) => {
    try {
      const response = await fetch('/api/price-reports', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          reportId,
          userId,
        }),
      });

      const data = await response.json() as { success: boolean; points?: number; error?: string };

      if (data.success && data.points) {
        const newPoints = userPoints + data.points;
        setUserPoints(newPoints);
        if (typeof window !== 'undefined') {
          localStorage.setItem('cheapest-near-me-points', newPoints.toString());
        }
        searchPrices(searchQuery);
        alert(`Price confirmed! You earned ${data.points} points.`);
      } else {
        alert(data.error || 'Failed to confirm price');
      }
    } catch (error) {
      console.error('Error confirming price:', error);
      alert('Failed to confirm price');
    }
  };

  const getCheapestPrice = () => {
    if (priceReports.length === 0) return null;
    return Math.min(...priceReports.map((r) => r.price));
  };

  // Get unique reports (duplicates are merged at API level)
  const getFilteredReports = () => {
    // Sort by confirmation count (highest first), then by date (newest first)
    return [...priceReports].sort((a, b) => {
      // First sort by confirmation count (descending)
      const confirmDiff = b.confirmedBy.length - a.confirmedBy.length;
      if (confirmDiff !== 0) return confirmDiff;

      // If same confirmation count, sort by date (newest first)
      return new Date(b.reportedAt).getTime() - new Date(a.reportedAt).getTime();
    });
  };

  const handleReportClick = (reportId: string) => {
    setSelectedReportId(reportId);
    setViewMode('map');
  };

  const handleCitySelect = (city: { name: string; latitude: number; longitude: number }) => {
    const location = { lat: city.latitude, lon: city.longitude };
    setUserLocation(location);
    setLocationStatus(`${city.name}`);
    setShowCitySelector(false);
    loadAllNearbyPlaces(location);
  };

  const cheapestPrice = getCheapestPrice();

  // Show city selector if location detection failed
  if (showCitySelector) {
    return (
      <Suspense fallback={
        <div className={`min-h-screen flex items-center justify-center ${
          darkMode ? 'bg-gray-900' : 'bg-blue-50'
        }`}>
          <div className="text-center">
            <div className={`inline-block animate-spin rounded-full h-12 w-12 border-4 border-t-transparent ${
              darkMode ? 'border-blue-400' : 'border-blue-500'
            }`}></div>
          </div>
        </div>
      }>
        <CitySelector onSelectCity={handleCitySelect} darkMode={darkMode} />
      </Suspense>
    );
  }

  return (
    <div className={`min-h-screen pb-20 transition-colors duration-300 ${
      darkMode
        ? 'bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900'
        : 'bg-gradient-to-b from-blue-50 to-white'
    }`}>
      {/* Sticky Header */}
      <div className={`sticky top-0 z-40 shadow-md transition-colors duration-300 ${
        darkMode ? 'bg-gray-800 border-b border-gray-700' : 'bg-white'
      }`}>
        <div className="max-w-7xl mx-auto px-4 py-2 sm:py-3">
          {/* Top Bar - Points and Location */}
          <div className="flex justify-between items-center mb-3">
            <div className="flex-1">
              <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }} className={`text-lg sm:text-xl font-bold ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                Cheapest Near Me
              </h1>
              <button
                onClick={() => setShowCitySelector(true)}
                className="flex items-center gap-1 text-xs mt-0.5 hover:underline transition-colors"
                style={{ color: darkMode ? '#d1d5db' : '#4b5563' }}
              >
                <MapPin className="w-3 h-3" />
                <span>{locationStatus}</span>
              </button>
            </div>
            <div className="flex items-center gap-2">
              <div className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl shadow-sm ${
                darkMode
                  ? 'bg-gradient-to-r from-yellow-600 to-yellow-700'
                  : 'bg-gradient-to-r from-yellow-100 to-yellow-200'
              }`}>
                <Award
                  className="w-4 h-4 sm:w-5 sm:h-5"
                  style={{ color: darkMode ? '#fef08a' : '#ca8a04' }}
                />
                <span className={`font-bold text-sm sm:text-base ${
                  darkMode ? 'text-yellow-50' : 'text-yellow-900'
                }`}>
                  {userPoints}
                </span>
              </div>
              <button
                onClick={() => setShowGCashForm(true)}
                className={`p-2 rounded-lg transition-all duration-300 ${
                  darkMode
                    ? 'bg-green-700 hover:bg-green-600'
                    : 'bg-green-100 hover:bg-green-200'
                }`}
                style={{ color: darkMode ? '#86efac' : '#166534' }}
                title="Convert points to GCash"
              >
                <Wallet className="w-5 h-5" />
              </button>
              <button
                onClick={onToggleDarkMode}
                className={`p-2 rounded-lg transition-all duration-300 ${
                  darkMode
                    ? 'bg-gray-700 hover:bg-gray-600'
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
                style={{ color: darkMode ? '#fbbf24' : '#374151' }}
                title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              <button
                onClick={() => setFiltersExpanded(!filtersExpanded)}
                className={`p-2 rounded-lg transition-colors ${
                  darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                }`}
                style={{ color: darkMode ? '#9ca3af' : '#4b5563' }}
                title={filtersExpanded ? 'Minimize filters' : 'Expand filters'}
              >
                {filtersExpanded ? (
                  <ChevronUp className="w-5 h-5" />
                ) : (
                  <ChevronDown className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {/* Collapsible Filters Section */}
          {filtersExpanded && (
            <>
              {/* Search Bar */}
              <div className="relative">
                <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${
                  darkMode ? 'text-gray-300' : 'text-gray-400'
                }`} />
                <input
                  type="text"
                  placeholder="Search item (e.g., Rice, Gasoline)..."
                  className={`w-full pl-10 pr-4 py-2 sm:py-3 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 text-sm sm:text-base transition-all ${
                    darkMode
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-300 focus:border-blue-400'
                      : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:border-blue-500'
                  }`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      searchPrices(searchQuery);
                    }
                  }}
                />
              </div>

              {/* Radius Selector */}
              <div className="flex items-center gap-3 mt-3">
                <label className={`text-xs font-semibold whitespace-nowrap ${
                  darkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Search Radius:
                </label>
                <select
                  value={searchRadius}
                  onChange={(e) => setSearchRadius(Number(e.target.value))}
                  className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    darkMode
                      ? 'bg-gray-700 border border-gray-600 text-white focus:border-blue-400'
                      : 'bg-white border border-gray-300 text-gray-900 focus:border-blue-500'
                  }`}
                >
                  <option value={1}>1 km</option>
                  <option value={2}>2 km</option>
                  <option value={5}>5 km (Default)</option>
                  <option value={10}>10 km</option>
                  <option value={15}>15 km</option>
                  <option value={20}>20 km</option>
                  <option value={50}>50 km</option>
                  <option value={100}>100 km</option>
                </select>
              </div>

              {/* Popular Searches */}
              <div className="flex flex-wrap gap-2 mt-2">
                {popularSearches.map((item) => (
                  <button
                    key={item}
                    onClick={() => searchPrices(item)}
                    className={`px-3 py-1.5 border rounded-full text-xs sm:text-sm font-medium transition-all active:scale-95 ${
                      darkMode
                        ? 'bg-blue-700 hover:bg-blue-600 border-blue-600 text-blue-100'
                        : 'bg-blue-50 hover:bg-blue-100 border-blue-200 text-blue-700'
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </>
          )}

          {/* View Toggle */}
          {priceReports.length > 0 && !loading && (
            <div className="flex gap-2 mt-3">
              <button
                onClick={() => {
                  setViewMode('list');
                  setSelectedReportId(null);
                }}
                className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg font-semibold text-sm transition-all ${
                  viewMode === 'list'
                    ? 'bg-blue-600 shadow-md'
                    : darkMode
                    ? 'bg-gray-700 hover:bg-gray-600'
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
                style={
                  viewMode === 'list'
                    ? { color: '#ffffff' }
                    : darkMode
                    ? { color: '#d1d5db' }
                    : { color: '#374151' }
                }
              >
                <List className="w-4 h-4" />
                <span>List</span>
              </button>
              <button
                onClick={() => setViewMode('map')}
                className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg font-semibold text-sm transition-all ${
                  viewMode === 'map'
                    ? 'bg-blue-600 shadow-md'
                    : darkMode
                    ? 'bg-gray-700 hover:bg-gray-600'
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
                style={
                  viewMode === 'map'
                    ? { color: '#ffffff' }
                    : darkMode
                    ? { color: '#d1d5db' }
                    : { color: '#374151' }
                }
              >
                <MapIcon className="w-4 h-4" />
                <span>Map</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 mt-2 sm:mt-3">
        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className={`inline-block animate-spin rounded-full h-12 w-12 border-4 border-t-transparent ${
              darkMode ? 'border-blue-400' : 'border-blue-500'
            }`}></div>
            <p className={`mt-4 font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Finding best prices...
            </p>
          </div>
        )}

        {/* Results */}
        {!loading && searchQuery && (
          <>
            <div className="mb-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <h2 className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`} style={{ fontSize: '1.75rem' }}>
                {searchQuery === 'All Items' ? (
                  <>
                    {getFilteredReports().length} {getFilteredReports().length === 1 ? 'location' : 'locations'} near you
                  </>
                ) : (
                  <>
                    {getFilteredReports().length} {getFilteredReports().length === 1 ? 'result' : 'results'} for "
                    {searchQuery}"
                  </>
                )}
              </h2>
              <div className={`text-xs font-medium px-3 py-1.5 rounded-full whitespace-nowrap ${
                darkMode ? 'bg-blue-900 text-blue-200' : 'bg-blue-100 text-blue-700'
              }`}>
                Within {searchRadius} km
              </div>
            </div>

            {priceReports.length === 0 && (
              <div className={`text-center py-16 rounded-2xl shadow-sm ${
                darkMode ? 'bg-gray-800' : 'bg-white'
              }`}>
                <div className={`w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center ${
                  darkMode ? 'bg-gray-700' : 'bg-gray-100'
                }`}>
                  <Search className={`w-10 h-10 ${darkMode ? 'text-gray-400' : 'text-gray-400'}`} />
                </div>
                <p className={`text-lg font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  {searchQuery === 'All Items' ? 'No price reports yet' : 'No prices found'}
                </p>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Be the first to report a price!
                </p>
                <div className="mt-6">
                  <button
                    onClick={onReportClick}
                    className="px-6 py-3 bg-green-600 hover:bg-green-700 !text-white rounded-xl font-semibold transition-colors shadow-lg"
                    style={{ color: '#ffffff' }}
                  >
                    Report a Price
                  </button>
                </div>
              </div>
            )}

            {/* List View */}
            {viewMode === 'list' && priceReports.length > 0 && (
              <>
                {/* Helpful Tip */}
                <div className={`border-2 rounded-xl p-4 mb-4 flex items-start gap-3 ${
                  darkMode
                    ? 'bg-blue-900 border-blue-700'
                    : 'bg-blue-50 border-blue-200'
                }`}>
                  <div className={`text-2xl ${darkMode ? 'text-blue-300' : 'text-blue-600'}`}>💡</div>
                  <div>
                    <div className={`font-semibold mb-1 ${darkMode ? 'text-blue-200' : 'text-blue-900'}`}>
                      Quick Tip
                    </div>
                    <div className={`text-sm ${darkMode ? 'text-blue-300' : 'text-blue-800'}`}>
                      {searchQuery === 'All Items'
                        ? 'Prices sorted by most verified. Reporting a new price for an existing item will update it!'
                        : 'Prices sorted by most verified. Click any store to see details on the map!'}
                    </div>
                  </div>
                </div>

                <div className="space-y-3 sm:space-y-4">
                  {getFilteredReports().map((report) => (
                  <div
                    key={report.id}
                    className={`rounded-2xl shadow-md hover:shadow-xl hover:scale-[1.02] transition-all overflow-hidden border-2 cursor-pointer ${
                      darkMode
                        ? 'bg-gray-800 border-gray-700 hover:border-blue-400'
                        : 'bg-white border-gray-100 hover:border-blue-500'
                    }`}
                    onClick={() => handleReportClick(report.id)}
                  >
                    <div className="p-4 sm:p-5">
                      {/* Item Header */}
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex flex-wrap items-center gap-2 mb-2">
                            <h3 className={`text-lg sm:text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                              {report.itemName}
                            </h3>
                            {report.variant && (
                              <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${
                                darkMode ? 'bg-blue-900 text-blue-200' : 'bg-blue-100 text-blue-800'
                              }`}>
                                {report.variant}
                              </span>
                            )}
                            {report.price === cheapestPrice && (
                              <span className="px-2.5 py-1 bg-green-500 text-white text-xs font-bold rounded-full animate-pulse">
                                CHEAPEST!
                              </span>
                            )}
                            {report.confirmedBy.length > 0 && (
                              <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${
                                darkMode ? 'bg-blue-900 text-blue-200' : 'bg-blue-100 text-blue-800'
                              }`}>
                                ✓ Verified
                              </span>
                            )}
                          </div>

                          {/* Price */}
                          <div className="mb-3">
                            <span className={`text-3xl sm:text-4xl font-black ${
                              darkMode ? 'text-green-400' : 'text-green-600'
                            }`}>
                              ₱{report.price.toFixed(2)}
                            </span>
                            <span className={`text-sm sm:text-base ml-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                              / {report.unit}
                            </span>
                          </div>

                          {/* Store Info */}
                          <div className="space-y-2 text-sm sm:text-base">
                            <p className={`font-bold ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                              {report.storeName}
                            </p>
                            <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                              {report.address}
                            </p>
                            <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm">
                              {report.distance !== undefined && (
                                <span className={`flex items-center gap-1 px-2 py-1 rounded-full ${
                                  darkMode ? 'bg-blue-900 text-blue-200' : 'bg-blue-50 text-gray-600'
                                }`}>
                                  <MapPin className={`w-3.5 h-3.5 ${darkMode ? 'text-blue-300' : 'text-blue-600'}`} />
                                  <span className="font-medium">
                                    {report.distance.toFixed(1)} km
                                  </span>
                                </span>
                              )}
                              <span className={`flex items-center gap-1 px-2 py-1 rounded-full ${
                                darkMode ? 'bg-green-900 text-green-200' : 'bg-green-50 text-gray-600'
                              }`}>
                                <CheckCircle2 className={`w-3.5 h-3.5 ${darkMode ? 'text-green-300' : 'text-green-600'}`} />
                                <span className="font-medium">
                                  {report.confirmedBy.length} confirmed
                                </span>
                              </span>
                            </div>
                            <div className={`flex items-center gap-2 font-semibold text-sm mt-2 px-3 py-2 rounded-lg ${
                              darkMode
                                ? 'bg-blue-900 text-blue-200'
                                : 'bg-blue-50 text-blue-600'
                            }`}>
                              <MapIcon className="w-5 h-5" />
                              <span>📍 Click to view on map</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2 mt-3">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            confirmPrice(report.id);
                          }}
                          className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 !text-white rounded-xl font-bold text-sm sm:text-base transition-all active:scale-98 shadow-md"
                          style={{ color: '#ffffff' }}
                        >
                          Confirm Price (+5 points)
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setShareReport(report);
                          }}
                          className={`p-3 rounded-xl font-bold transition-all active:scale-95 shadow-md ${
                            darkMode
                              ? 'bg-gray-700 hover:bg-gray-600 text-gray-200'
                              : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                          }`}
                          title="Share this deal"
                        >
                          <Share2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                </div>
              </>
            )}

            {/* Map View */}
            {viewMode === 'map' && priceReports.length > 0 && userLocation && (
              <div className={`rounded-2xl shadow-lg overflow-hidden ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                {/* Map Header with Selected Location */}
                {selectedReportId && priceReports.find(r => r.id === selectedReportId) && (
                  <div className={`text-white p-4 flex items-center justify-between ${
                    darkMode
                      ? 'bg-gradient-to-r from-blue-700 to-blue-800'
                      : 'bg-gradient-to-r from-blue-600 to-blue-700'
                  }`}>
                    <div className="flex-1">
                      <div className="text-sm font-medium opacity-90 mb-1">Selected Location</div>
                      <div className="font-bold text-lg">
                        {priceReports.find(r => r.id === selectedReportId)?.storeName}
                      </div>
                      <div className="text-sm opacity-90">
                        ₱{priceReports.find(r => r.id === selectedReportId)?.price.toFixed(2)} / {priceReports.find(r => r.id === selectedReportId)?.unit}
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedReportId(null)}
                      className="ml-4 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors text-sm font-semibold"
                    >
                      Clear Selection
                    </button>
                  </div>
                )}

                <Suspense
                  fallback={
                    <div className="flex items-center justify-center h-[500px]">
                      <div className="text-center">
                        <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mb-4"></div>
                        <p className="text-gray-600 font-medium">Loading map...</p>
                      </div>
                    </div>
                  }
                >
                  {(() => {
                    console.log('Rendering MapView with:', {
                      reportsCount: priceReports.length,
                      reports: priceReports,
                      userLocation,
                      selectedReportId
                    });
                    return null;
                  })()}
                  <MapView
                    reports={priceReports}
                    userLocation={userLocation}
                    selectedReportId={selectedReportId}
                    onMarkerClick={(report) => {
                      console.log('Marker clicked:', report);
                      setSelectedReportId(report.id);
                    }}
                    onShareClick={(report) => {
                      setShareReport(report);
                    }}
                  />
                </Suspense>
              </div>
            )}
          </>
        )}

      </div>

      {/* Floating Action Button */}
      <button
        onClick={onReportClick}
        className="fixed bottom-6 right-6 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 !text-white rounded-full shadow-2xl flex items-center justify-center gap-2 px-6 py-4 transition-all active:scale-95 hover:shadow-3xl group"
        style={{ color: '#ffffff', zIndex: 10000 }}
      >
        <Plus className="w-6 h-6 font-bold" />
        <span className="font-bold text-base whitespace-nowrap">Report Price</span>
      </button>

      {/* GCash Conversion Form */}
      {showGCashForm && (
        <GCashConversionForm
          userPoints={userPoints}
          darkMode={darkMode}
          onClose={() => setShowGCashForm(false)}
        />
      )}

      {/* Share Modal */}
      {shareReport && (
        <ShareModal
          itemName={shareReport.itemName}
          price={shareReport.price}
          unit={shareReport.unit}
          storeName={shareReport.storeName}
          address={shareReport.address}
          darkMode={darkMode}
          onClose={() => setShareReport(null)}
        />
      )}
    </div>
  );
}
