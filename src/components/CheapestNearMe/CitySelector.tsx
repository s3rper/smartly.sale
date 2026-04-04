import React, { useState } from 'react';
import { Search, MapPin } from 'lucide-react';

interface City {
  name: string;
  region: string;
  latitude: number;
  longitude: number;
}

interface CitySelectorProps {
  onSelectCity: (city: City) => void;
  darkMode: boolean;
}

// Philippine cities with coordinates
const PHILIPPINE_CITIES: City[] = [
  // Metro Manila
  { name: 'Caloocan', region: 'Metro Manila', latitude: 14.6488, longitude: 120.9830 },
  { name: 'Las Piñas', region: 'Metro Manila', latitude: 14.4453, longitude: 121.0120 },
  { name: 'Makati', region: 'Metro Manila', latitude: 14.5547, longitude: 121.0244 },
  { name: 'Malabon', region: 'Metro Manila', latitude: 14.6620, longitude: 120.9570 },
  { name: 'Mandaluyong', region: 'Metro Manila', latitude: 14.5794, longitude: 121.0359 },
  { name: 'Manila', region: 'Metro Manila', latitude: 14.5995, longitude: 120.9842 },
  { name: 'Marikina', region: 'Metro Manila', latitude: 14.6507, longitude: 121.1029 },
  { name: 'Muntinlupa', region: 'Metro Manila', latitude: 14.4082, longitude: 121.0404 },
  { name: 'Navotas', region: 'Metro Manila', latitude: 14.6691, longitude: 120.9403 },
  { name: 'Parañaque', region: 'Metro Manila', latitude: 14.4793, longitude: 121.0198 },
  { name: 'Pasay', region: 'Metro Manila', latitude: 14.5378, longitude: 121.0014 },
  { name: 'Pasig', region: 'Metro Manila', latitude: 14.5764, longitude: 121.0851 },
  { name: 'Quezon City', region: 'Metro Manila', latitude: 14.6760, longitude: 121.0437 },
  { name: 'San Juan', region: 'Metro Manila', latitude: 14.6019, longitude: 121.0355 },
  { name: 'Taguig', region: 'Metro Manila', latitude: 14.5176, longitude: 121.0509 },
  { name: 'Valenzuela', region: 'Metro Manila', latitude: 14.6990, longitude: 120.9830 },

  // Luzon
  { name: 'Baguio', region: 'Cordillera', latitude: 16.4023, longitude: 120.5960 },
  { name: 'Angeles', region: 'Central Luzon', latitude: 15.1450, longitude: 120.5887 },
  { name: 'Olongapo', region: 'Central Luzon', latitude: 14.8294, longitude: 120.2828 },
  { name: 'San Fernando (Pampanga)', region: 'Central Luzon', latitude: 15.0285, longitude: 120.6897 },
  { name: 'Batangas City', region: 'Calabarzon', latitude: 13.7565, longitude: 121.0583 },
  { name: 'Lipa', region: 'Calabarzon', latitude: 13.9407, longitude: 121.1624 },
  { name: 'Antipolo', region: 'Calabarzon', latitude: 14.5864, longitude: 121.1754 },
  { name: 'Cavite City', region: 'Calabarzon', latitude: 14.4791, longitude: 120.9006 },
  { name: 'Dasmariñas', region: 'Calabarzon', latitude: 14.3294, longitude: 120.9366 },
  { name: 'Bacoor', region: 'Calabarzon', latitude: 14.4590, longitude: 120.9394 },
  { name: 'Lucena', region: 'Calabarzon', latitude: 13.9372, longitude: 121.6174 },
  { name: 'Calapan', region: 'Mimaropa', latitude: 13.4117, longitude: 121.1803 },
  { name: 'Puerto Princesa', region: 'Mimaropa', latitude: 9.7392, longitude: 118.7353 },

  // Visayas
  { name: 'Cebu City', region: 'Central Visayas', latitude: 10.3157, longitude: 123.8854 },
  { name: 'Mandaue', region: 'Central Visayas', latitude: 10.3237, longitude: 123.9222 },
  { name: 'Lapu-Lapu', region: 'Central Visayas', latitude: 10.3103, longitude: 123.9494 },
  { name: 'Tagbilaran', region: 'Central Visayas', latitude: 9.6474, longitude: 123.8533 },
  { name: 'Dumaguete', region: 'Central Visayas', latitude: 9.3068, longitude: 123.3054 },
  { name: 'Iloilo City', region: 'Western Visayas', latitude: 10.7202, longitude: 122.5621 },
  { name: 'Bacolod', region: 'Western Visayas', latitude: 10.6762, longitude: 122.9501 },
  { name: 'Roxas City', region: 'Western Visayas', latitude: 11.5850, longitude: 122.7509 },
  { name: 'Tacloban', region: 'Eastern Visayas', latitude: 11.2442, longitude: 125.0039 },
  { name: 'Ormoc', region: 'Eastern Visayas', latitude: 11.0059, longitude: 124.6074 },

  // Mindanao
  { name: 'Davao City', region: 'Davao', latitude: 7.1907, longitude: 125.4553 },
  { name: 'Tagum', region: 'Davao', latitude: 7.4479, longitude: 125.8078 },
  { name: 'Digos', region: 'Davao', latitude: 6.7499, longitude: 125.3572 },
  { name: 'Cagayan de Oro', region: 'Northern Mindanao', latitude: 8.4542, longitude: 124.6319 },
  { name: 'Iligan', region: 'Northern Mindanao', latitude: 8.2280, longitude: 124.2452 },
  { name: 'Butuan', region: 'Caraga', latitude: 8.9475, longitude: 125.5406 },
  { name: 'Zamboanga City', region: 'Zamboanga Peninsula', latitude: 6.9214, longitude: 122.0790 },
  { name: 'Dipolog', region: 'Zamboanga Peninsula', latitude: 8.5800, longitude: 123.3419 },
  { name: 'General Santos', region: 'Soccsksargen', latitude: 6.1164, longitude: 125.1716 },
  { name: 'Koronadal', region: 'Soccsksargen', latitude: 6.5008, longitude: 124.8453 },
  { name: 'Cotabato City', region: 'Bangsamoro', latitude: 7.2231, longitude: 124.2452 },
];

export default function CitySelector({ onSelectCity, darkMode }: CitySelectorProps) {
  const [searchQuery, setSearchQuery] = useState('');

  // Group cities by region
  const groupedCities = PHILIPPINE_CITIES.reduce((acc, city) => {
    if (!acc[city.region]) {
      acc[city.region] = [];
    }
    acc[city.region].push(city);
    return acc;
  }, {} as Record<string, City[]>);

  // Filter cities based on search
  const filteredCities = searchQuery
    ? PHILIPPINE_CITIES.filter((city) =>
        city.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        city.region.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : null;

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 transition-colors duration-300 ${
      darkMode
        ? 'bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900'
        : 'bg-gradient-to-b from-blue-50 to-white'
    }`}>
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${
            darkMode ? 'bg-blue-900' : 'bg-blue-100'
          }`}>
            <MapPin className={`w-8 h-8 ${darkMode ? 'text-blue-300' : 'text-blue-600'}`} />
          </div>
          <h1 className={`text-3xl font-bold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Select your city
          </h1>
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            We couldn't detect your location. Please select a city to see nearby prices.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative mb-6">
          <Search className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
            darkMode ? 'text-gray-400' : 'text-gray-400'
          }`} />
          <input
            type="text"
            placeholder="Search city..."
            className={`w-full pl-12 pr-4 py-4 rounded-xl text-base transition-all ${
              darkMode
                ? 'bg-gray-800 border-2 border-gray-700 text-white placeholder-gray-400 focus:border-blue-500'
                : 'bg-white border-2 border-gray-200 text-gray-900 placeholder-gray-400 focus:border-blue-500'
            }`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            autoFocus
          />
        </div>

        {/* Cities List */}
        <div className={`rounded-2xl overflow-hidden shadow-xl ${
          darkMode ? 'bg-gray-800' : 'bg-white'
        }`}>
          <div className="max-h-96 overflow-y-auto">
            {filteredCities ? (
              // Filtered search results
              filteredCities.length > 0 ? (
                <div>
                  {filteredCities.map((city) => (
                    <button
                      key={`${city.name}-${city.region}`}
                      onClick={() => onSelectCity(city)}
                      className={`w-full px-6 py-4 text-left transition-colors ${
                        darkMode
                          ? 'hover:bg-gray-700 border-b border-gray-700'
                          : 'hover:bg-gray-50 border-b border-gray-100'
                      }`}
                    >
                      <div className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {city.name}
                      </div>
                      <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        {city.region}
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="px-6 py-12 text-center">
                  <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    No cities found
                  </p>
                </div>
              )
            ) : (
              // Grouped by region
              Object.entries(groupedCities).map(([region, cities]) => (
                <div key={region}>
                  <div className={`px-6 py-3 text-xs font-bold uppercase tracking-wider ${
                    darkMode ? 'bg-gray-900 text-gray-400' : 'bg-gray-50 text-gray-500'
                  }`}>
                    {region}
                  </div>
                  {cities.map((city) => (
                    <button
                      key={`${city.name}-${city.region}`}
                      onClick={() => onSelectCity(city)}
                      className={`w-full px-6 py-4 text-left transition-colors ${
                        darkMode
                          ? 'hover:bg-gray-700 border-b border-gray-700 text-white'
                          : 'hover:bg-gray-50 border-b border-gray-100 text-gray-900'
                      }`}
                    >
                      {city.name}
                    </button>
                  ))}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
