import React, { useState, useRef, lazy, Suspense } from 'react';
import { Camera, Upload, X, Loader2, Award, ChevronLeft, Check, MapPin, Package } from 'lucide-react';
import Tesseract from 'tesseract.js';

// Lazy load components
const ProductSelector = lazy(() => import('./ProductSelector'));
const LocationPicker = lazy(() => import('./LocationPicker'));

interface PriceReportFormProps {
  onClose: () => void;
  onSuccess: () => void;
  darkMode: boolean;
}

// Product variants configuration
const PRODUCT_VARIANTS: Record<string, string[]> = {
  gasoline: ['Regular', 'Unleaded', 'Premium', 'Diesel', 'Premium Diesel'],
  rice: [
    'Regular',
    'Premium',
    'Well-Milled',
    'RC160',
    'Sinandomeng',
    'Jasmine',
    'Dinorado',
    'Red Rice',
    'Brown Rice',
    'Black Rice',
    'Kuhaku',
    'Tonner',
    'Ganador',
    'Doña Maria',
    'Special',
    'Fancy',
  ],
  water: [
    'Purified',
    'Distilled',
    'Mineral',
    'Alkaline',
    'Round (5 gal)',
    'Slim (5 gal)',
    'Refill',
  ],
  eggs: [
    'Small',
    'Medium',
    'Large',
    'Extra Large',
    'Jumbo',
    'Free Range',
    'Organic',
    'Brown Eggs',
    'White Eggs',
    'Duck Eggs',
    'Quail Eggs',
    'Salted Eggs',
  ],
  sugar: ['White', 'Brown', 'Raw', 'Refined', 'Washed', 'Mascobado'],
  'cooking oil': [
    'Vegetable',
    'Palm',
    'Coconut',
    'Canola',
    'Sunflower',
    'Corn',
    'Olive',
  ],
  milk: [
    'Fresh',
    'Powdered',
    'Evaporated',
    'Condensed',
    'Full Cream',
    'Low Fat',
    'Skim',
    'Chocolate',
    'Infant Formula',
    'Soy',
    'Almond',
  ],
  bread: [
    'Loaf',
    'Pandesal',
    'Tasty',
    'Wheat',
    'Whole Wheat',
    'White',
    'Dinner Roll',
    'French',
  ],
  coffee: [
    '3-in-1',
    'Black',
    'Instant',
    'Ground',
    'Beans',
    'Decaf',
    'Cappuccino',
    'Latte Mix',
  ],
  salt: ['Iodized', 'Rock', 'Sea Salt', 'Himalayan'],
  'soy sauce': ['Regular', 'Light', 'Dark', 'Low Sodium'],
  vinegar: ['White', 'Cane', 'Coconut', 'Apple Cider'],
  'fish sauce': ['Regular', 'Premium'],
  chicken: ['Whole', 'Breast', 'Thigh', 'Drumstick', 'Wings', 'Liver'],
  pork: ['Belly', 'Chop', 'Loin', 'Shoulder', 'Ribs', 'Ground'],
  beef: ['Chuck', 'Sirloin', 'Ribeye', 'Ground', 'Stew Meat', 'Brisket'],
};

export default function PriceReportForm({ onClose, onSuccess, darkMode }: PriceReportFormProps) {
  const [step, setStep] = useState(0); // 0 = photo, 1-5 = form steps
  const [itemName, setItemName] = useState('');
  const [variant, setVariant] = useState('');
  const [price, setPrice] = useState('');
  const [unit, setUnit] = useState('kg');
  const [storeName, setStoreName] = useState('');
  const [address, setAddress] = useState('');
  const [location, setLocation] = useState<{ lat: number; lon: number } | null>(null);
  const [uploading, setUploading] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [showProductSelector, setShowProductSelector] = useState(false);
  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [userId] = useState(() => {
    if (typeof window !== 'undefined') {
      let id = localStorage.getItem('cheapest-near-me-user-id');
      if (!id) {
        id = `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        localStorage.setItem('cheapest-near-me-user-id', id);
      }
      return id;
    }
    return 'user-unknown';
  });

  const units = ['kg', 'liters', 'pieces', 'pack', 'sack', 'gallon', 'bottle', 'can', 'box'];

  const getVariants = () => {
    const key = itemName.toLowerCase();
    return PRODUCT_VARIANTS[key] || [];
  };

  const calculatePoints = () => {
    let points = 10;
    if (variant) points += 2;
    if (uploadedImage) points += 3;
    return points;
  };

  const handleImageUpload = async (file: File) => {
    if (!file) return;

    setUploading(true);
    setScanning(true);
    setScanProgress(0);

    const reader = new FileReader();
    reader.onload = (e) => {
      setUploadedImage(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    try {
      const result = await Tesseract.recognize(file, 'eng', {
        logger: (m) => {
          if (m.status === 'recognizing text') {
            setScanProgress(Math.round(m.progress * 100));
          }
        },
      });

      const text = result.data.text;
      console.log('OCR Result:', text);

      const priceMatch = text.match(/₱?\s*(\d+\.?\d*)/);
      if (priceMatch) {
        setPrice(priceMatch[1]);
      }

      const lines = text.split('\n').filter((line) => line.trim().length > 0);
      if (lines.length > 0) {
        const firstLine = lines[0].trim();
        if (firstLine && !itemName) {
          setItemName(firstLine);
        }
      }
    } catch (error) {
      console.error('OCR Error:', error);
      alert('Failed to scan image. Please enter details manually.');
    } finally {
      setUploading(false);
      setScanning(false);
      setScanProgress(0);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImageUpload(file);
    }
  };

  const handleSubmit = async () => {
    if (!itemName || !price || !storeName || !address || !location) {
      alert('Please fill in all required fields including location');
      return;
    }

    setUploading(true);

    try {
      const report = {
        itemName,
        variant: variant || undefined,
        price: parseFloat(price),
        unit,
        storeName,
        address,
        location: {
          latitude: location.lat,
          longitude: location.lon,
          accuracy: 0,
        },
        reportedBy: userId,
      };

      const response = await fetch('/api/price-reports', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(report),
      });

      const data = await response.json();

      if (data.success) {
        const currentPoints = parseInt(
          localStorage.getItem('cheapest-near-me-points') || '0',
          10
        );
        const newPoints = currentPoints + data.points;
        localStorage.setItem('cheapest-near-me-points', newPoints.toString());

        const message = data.updated
          ? `Price updated successfully! You earned ${data.points} points.`
          : `Price reported successfully! You earned ${data.points} points.`;

        alert(message);
        onSuccess();
        onClose();
      } else {
        alert('Failed to submit report');
      }
    } catch (error) {
      console.error('Error submitting report:', error);
      alert('Failed to submit report. Please make sure location access is enabled.');
    } finally {
      setUploading(false);
    }
  };

  const variants = getVariants();
  const totalSteps = 5;
  const progress = ((step + 1) / (totalSteps + 1)) * 100;

  return (
    <div className={`fixed inset-0 overflow-y-auto transition-colors duration-300 ${
      darkMode
        ? 'bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900'
        : 'bg-gradient-to-b from-blue-50 to-white'
    }`} style={{ zIndex: 50000 }}>
      {/* Header */}
      <div className={`sticky top-0 shadow-md transition-colors duration-300 ${
        darkMode ? 'bg-gray-800 border-b border-gray-700' : 'bg-white'
      }`} style={{ zIndex: 50001 }}>
        <div className="flex items-center justify-between px-4 py-3">
          <button
            onClick={() => (step === 0 ? onClose() : setStep(step - 1))}
            className={`p-2 rounded-full transition-colors ${
              darkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-900'
            }`}
          >
            {step === 0 ? <X className="w-6 h-6" /> : <ChevronLeft className="w-6 h-6" />}
          </button>
          <div className="flex-1 text-center">
            <h2 className={`text-lg sm:text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Report Price
            </h2>
            <p className={`text-xs sm:text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Step {step + 1} of {totalSteps + 1}
            </p>
          </div>
          <div className="w-10"></div>
        </div>

        {/* Progress Bar */}
        <div className={`h-2 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
          <div
            className="h-full bg-gradient-to-r from-green-500 to-green-600 transition-all duration-300"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* Step 0: Photo Upload */}
        {step === 0 && (
          <div className="space-y-6 animate-fade-in">
            <div className="text-center mb-8">
              <div className={`w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center ${
                darkMode
                  ? 'bg-gradient-to-br from-blue-800 to-blue-700'
                  : 'bg-gradient-to-br from-blue-100 to-blue-200'
              }`}>
                <Camera className={`w-10 h-10 ${darkMode ? 'text-blue-300' : 'text-blue-600'}`} />
              </div>
              <h3 className={`text-2xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Scan Price Tag
              </h3>
              <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Optional: Take a photo for automatic price detection
              </p>
            </div>

            {uploadedImage && (
              <div className="mb-6">
                <img
                  src={uploadedImage}
                  alt="Uploaded price tag"
                  className="max-h-80 mx-auto rounded-2xl shadow-lg"
                />
              </div>
            )}

            {scanning && (
              <div className={`mb-6 rounded-2xl p-6 shadow-md ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                <div className="flex items-center gap-3 mb-3">
                  <Loader2 className={`w-6 h-6 animate-spin ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                  <span className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    Scanning... {scanProgress}%
                  </span>
                </div>
                <div className={`w-full rounded-full h-3 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                  <div
                    className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all"
                    style={{ width: `${scanProgress}%` }}
                  ></div>
                </div>
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleFileSelect}
              className="hidden"
            />

            <div className="space-y-3">
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={scanning}
                className="w-full px-6 py-5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 !text-white rounded-2xl font-bold text-lg transition-all disabled:from-gray-400 disabled:to-gray-400 flex items-center justify-center gap-3 shadow-lg active:scale-98"
                style={{ color: '#ffffff' }}
              >
                <Camera className="w-6 h-6" />
                {uploadedImage ? 'Take Another Photo' : 'Take Photo'}
              </button>

              <button
                onClick={() => setStep(1)}
                className="w-full px-6 py-5 bg-gray-100 hover:bg-gray-200 !text-gray-900 rounded-2xl font-semibold text-lg transition-all active:scale-98"
                style={{ color: '#111827' }}
              >
                {uploadedImage ? 'Continue' : 'Skip Photo'}
              </button>
            </div>
          </div>
        )}

        {/* Step 1: Item Name */}
        {step === 1 && (
          <div className="space-y-6 animate-fade-in">
            <div className="text-center mb-6">
              <h3 className={`text-2xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                What item?
              </h3>
              <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Select or search for a product
              </p>
            </div>

            <div className={`rounded-2xl p-6 shadow-md ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <label className={`block text-sm font-semibold mb-3 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                Item Name *
              </label>

              {itemName ? (
                <div className={`flex items-center justify-between p-4 border-2 rounded-xl mb-3 ${
                  darkMode
                    ? 'bg-blue-900 border-blue-700'
                    : 'bg-blue-50 border-blue-200'
                }`}>
                  <div className="flex items-center gap-3">
                    <Package className={`w-6 h-6 ${darkMode ? 'text-blue-300' : 'text-blue-600'}`} />
                    <span className={`font-bold text-lg ${darkMode ? 'text-blue-100' : 'text-blue-900'}`}>
                      {itemName}
                    </span>
                  </div>
                  <button
                    onClick={() => setItemName('')}
                    className={`font-semibold text-sm ${
                      darkMode ? 'text-blue-300 hover:text-blue-200' : 'text-blue-600 hover:text-blue-800'
                    }`}
                  >
                    Change
                  </button>
                </div>
              ) : null}

              <button
                onClick={() => setShowProductSelector(true)}
                className={`w-full px-4 py-4 border-2 border-dashed rounded-xl transition-all flex items-center justify-center gap-3 ${
                  darkMode
                    ? 'border-gray-600 hover:border-blue-400 hover:bg-gray-700 text-gray-300 hover:text-blue-300'
                    : 'border-gray-300 hover:border-blue-500 hover:bg-blue-50 text-gray-600 hover:text-blue-600'
                }`}
              >
                <Package className="w-6 h-6" />
                <span className="font-semibold">
                  {itemName ? 'Change Product' : 'Select Product'}
                </span>
              </button>
            </div>

            <button
              onClick={() => setStep(2)}
              disabled={!itemName}
              className="w-full px-6 py-5 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 !text-white rounded-2xl font-bold text-lg transition-all disabled:from-gray-400 disabled:to-gray-400 shadow-lg active:scale-98"
                style={{ color: '#ffffff' }}
            >
              Continue
            </button>
          </div>
        )}

        {/* Step 2: Variant */}
        {step === 2 && (
          <div className="space-y-6 animate-fade-in">
            <div className="text-center mb-6">
              <h3 className={`text-2xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Select Variant
              </h3>
              <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                {variants.length > 0 ? 'Optional but recommended' : 'No variants available'}
              </p>
            </div>

            {variants.length > 0 ? (
              <div className={`rounded-2xl p-6 shadow-md ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                <div className="grid grid-cols-2 gap-3 max-h-96 overflow-y-auto">
                  {variants.map((v) => (
                    <button
                      key={v}
                      onClick={() => setVariant(v)}
                      className={`px-4 py-4 rounded-xl text-sm font-semibold transition-all active:scale-95 ${
                        variant === v
                          ? 'bg-gradient-to-r from-blue-600 to-blue-700 !text-white shadow-md'
                          : darkMode
                          ? 'bg-gray-700 !text-gray-200 hover:bg-gray-600'
                          : 'bg-gray-100 !text-gray-700 hover:bg-gray-200'
                      }`}
                      style={variant === v ? { color: '#ffffff' } : darkMode ? { color: '#e5e7eb' } : { color: '#374151' }}
                    >
                      {v}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className={`text-center py-8 rounded-2xl shadow-md ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  No variants for this item
                </p>
              </div>
            )}

            <button
              onClick={() => setStep(3)}
              className="w-full px-6 py-5 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 !text-white rounded-2xl font-bold text-lg transition-all shadow-lg active:scale-98"
              style={{ color: '#ffffff' }}
            >
              Continue
            </button>
          </div>
        )}

        {/* Step 3: Price & Unit */}
        {step === 3 && (
          <div className="space-y-6 animate-fade-in">
            <div className="text-center mb-6">
              <h3 className={`text-2xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Price & Unit
              </h3>
              <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Enter the price and unit
              </p>
            </div>

            <div className="space-y-4">
              <div className={`rounded-2xl p-6 shadow-md ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                <label className={`block text-sm font-semibold mb-3 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                  Price (₱) *
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-2xl font-bold text-gray-400">
                    ₱
                  </span>
                  <input
                    type="number"
                    step="0.01"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="0.00"
                    className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-2xl font-bold"
                    autoFocus
                  />
                </div>
              </div>

              <div className={`rounded-2xl p-6 shadow-md ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                <label className={`block text-sm font-semibold mb-3 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                  Unit *
                </label>
                <select
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  className={`w-full px-4 py-4 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 text-lg font-medium ${
                    darkMode
                      ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-400'
                      : 'bg-white border-gray-200 text-gray-900 focus:border-blue-500'
                  }`}
                >
                  {units.map((u) => (
                    <option key={u} value={u}>
                      {u}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <button
              onClick={() => setStep(4)}
              disabled={!price}
              className="w-full px-6 py-5 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 !text-white rounded-2xl font-bold text-lg transition-all disabled:from-gray-400 disabled:to-gray-400 shadow-lg active:scale-98"
                style={{ color: '#ffffff' }}
            >
              Continue
            </button>
          </div>
        )}

        {/* Step 4: Store Name */}
        {step === 4 && (
          <div className="space-y-6 animate-fade-in">
            <div className="text-center mb-6">
              <h3 className={`text-2xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Store Name
              </h3>
              <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Where did you find this price?
              </p>
            </div>

            <div className={`rounded-2xl p-6 shadow-md ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <label className={`block text-sm font-semibold mb-3 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                Store or Business Name *
              </label>
              <input
                type="text"
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                placeholder="e.g., SM Supermarket, Shell"
                className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
                autoFocus
              />
            </div>

            <button
              onClick={() => setStep(5)}
              disabled={!storeName}
              className="w-full px-6 py-5 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 !text-white rounded-2xl font-bold text-lg transition-all disabled:from-gray-400 disabled:to-gray-400 shadow-lg active:scale-98"
                style={{ color: '#ffffff' }}
            >
              Continue
            </button>
          </div>
        )}

        {/* Step 5: Address & Submit */}
        {step === 5 && (
          <div className="space-y-6 animate-fade-in">
            <div className="text-center mb-6">
              <h3 className={`text-2xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Store Location
              </h3>
              <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Pin the exact location on map
              </p>
            </div>

            <div className={`rounded-2xl p-6 shadow-md ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <label className={`block text-sm font-semibold mb-3 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                Store Address *
              </label>

              {address ? (
                <div className="mb-4 p-4 bg-green-50 border-2 border-green-200 rounded-xl">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-green-900 mb-1">
                        Selected Location
                      </p>
                      <p className="text-sm text-gray-700">{address}</p>
                    </div>
                  </div>
                </div>
              ) : null}

              <button
                onClick={() => setShowLocationPicker(true)}
                className="w-full px-4 py-4 border-2 border-dashed border-gray-300 rounded-xl hover:border-green-500 hover:bg-green-50 transition-all flex items-center justify-center gap-3 text-gray-600 hover:text-green-600"
              >
                <MapPin className="w-6 h-6" />
                <span className="font-semibold">
                  {address ? 'Change Location' : 'Select Location on Map'}
                </span>
              </button>
            </div>

            {/* Summary Card */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 border-2 border-blue-200">
              <div className="flex items-center gap-2 mb-4">
                <Check className="w-5 h-5 text-blue-600" />
                <h4 className="font-bold text-gray-900 text-lg">Summary</h4>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Item:</span>
                  <span className="font-semibold text-gray-900">
                    {itemName} {variant && <span className="text-blue-600">({variant})</span>}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Price:</span>
                  <span className="font-semibold text-gray-900">
                    ₱{price} / {unit}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Store:</span>
                  <span className="font-semibold text-gray-900">{storeName}</span>
                </div>
                {address && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Address:</span>
                    <span className="font-semibold text-gray-900 text-right max-w-[60%]">
                      {address}
                    </span>
                  </div>
                )}
              </div>
              <div className="mt-4 pt-4 border-t-2 border-blue-300 flex items-center justify-between">
                <span className="text-gray-700 font-semibold">You'll earn:</span>
                <div className="flex items-center gap-2">
                  <Award className="w-6 h-6 text-yellow-600" />
                  <span className="text-2xl font-black text-yellow-900">
                    {calculatePoints()}
                  </span>
                  <span className="text-sm text-gray-600">points</span>
                </div>
              </div>
            </div>

            <button
              onClick={handleSubmit}
              disabled={!address || uploading}
              className="w-full px-6 py-5 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 !text-white rounded-2xl font-bold text-lg transition-all disabled:from-gray-400 disabled:to-gray-400 shadow-lg active:scale-98 flex items-center justify-center gap-3"
              style={{ color: '#ffffff' }}
            >
              {uploading ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Check className="w-6 h-6" />
                  Submit Report
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* Product Selector Modal */}
      {showProductSelector && (
        <Suspense
          fallback={
            <div className="fixed inset-0 bg-white flex items-center justify-center" style={{ zIndex: 10002 }}>
              <div className="text-center">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mb-4"></div>
                <p className="text-gray-600 font-medium">Loading...</p>
              </div>
            </div>
          }
        >
          <ProductSelector
            onSelect={(product) => {
              setItemName(product);
              setShowProductSelector(false);
            }}
            onClose={() => setShowProductSelector(false)}
          />
        </Suspense>
      )}

      {/* Location Picker Modal */}
      {showLocationPicker && (
        <Suspense
          fallback={
            <div className="fixed inset-0 bg-white flex items-center justify-center" style={{ zIndex: 10002 }}>
              <div className="text-center">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-green-500 border-t-transparent mb-4"></div>
                <p className="text-gray-600 font-medium">Loading map...</p>
              </div>
            </div>
          }
        >
          <LocationPicker
            initialLocation={location || undefined}
            productType={itemName}
            storeName={storeName}
            onLocationSelect={(loc) => {
              setLocation({ lat: loc.lat, lon: loc.lon });
              setAddress(loc.address);
              setShowLocationPicker(false);
            }}
            onClose={() => setShowLocationPicker(false)}
          />
        </Suspense>
      )}

      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
