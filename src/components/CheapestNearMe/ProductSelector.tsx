import React, { useState } from 'react';
import { Search, ChevronRight, Package } from 'lucide-react';

interface ProductSelectorProps {
  onSelect: (product: string) => void;
  onClose: () => void;
}

// Common products organized by category
const PRODUCT_CATEGORIES = {
  'Fuel & Energy': ['Gasoline', 'Diesel', 'LPG'],
  'Food Staples': ['Rice', 'Bread', 'Sugar', 'Salt', 'Cooking Oil'],
  'Protein': ['Eggs', 'Chicken', 'Pork', 'Beef', 'Fish'],
  'Beverages': ['Water', 'Milk', 'Coffee', 'Soft Drinks', 'Juice'],
  'Condiments': ['Soy Sauce', 'Vinegar', 'Fish Sauce', 'Ketchup', 'Oyster Sauce'],
  'Produce': ['Tomato', 'Onion', 'Garlic', 'Potato', 'Cabbage', 'Carrots'],
  'Household': ['Detergent', 'Soap', 'Shampoo', 'Toothpaste', 'Tissue'],
  'Other': [],
};

export default function ProductSelector({ onSelect, onClose }: ProductSelectorProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const allProducts = Object.values(PRODUCT_CATEGORIES).flat();

  const filteredProducts = searchQuery
    ? allProducts.filter((p) => p.toLowerCase().includes(searchQuery.toLowerCase()))
    : [];

  const handleSelect = (product: string) => {
    onSelect(product);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-white overflow-y-auto" style={{ zIndex: 99999 }}>
      {/* Header */}
      <div className="sticky top-0 bg-white border-b border-gray-200 shadow-sm" style={{ zIndex: 100000 }}>
        <div className="px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">Select Product</h2>
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search products..."
              className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-4">
        {searchQuery ? (
          /* Search Results */
          <div>
            <p className="text-sm text-gray-600 mb-3">
              {filteredProducts.length} {filteredProducts.length === 1 ? 'result' : 'results'}
            </p>
            <div className="space-y-2">
              {filteredProducts.map((product) => (
                <button
                  key={product}
                  onClick={() => handleSelect(product)}
                  className="w-full flex items-center justify-between p-4 bg-white border-2 border-gray-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all active:scale-98"
                >
                  <div className="flex items-center gap-3">
                    <Package className="w-5 h-5 text-gray-400" />
                    <span className="font-semibold text-gray-900">{product}</span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </button>
              ))}
              {filteredProducts.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-500">No products found</p>
                  <button
                    onClick={() => handleSelect(searchQuery)}
                    className="mt-4 px-6 py-3 bg-blue-600 hover:bg-blue-700 !text-white rounded-xl font-semibold transition-colors"
                    style={{ color: '#ffffff' }}
                  >
                    Use "{searchQuery}"
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : selectedCategory ? (
          /* Products in Selected Category */
          <div>
            <button
              onClick={() => setSelectedCategory(null)}
              className="mb-4 text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1"
            >
              ← Back to Categories
            </button>
            <div className="space-y-2">
              {PRODUCT_CATEGORIES[selectedCategory as keyof typeof PRODUCT_CATEGORIES].map(
                (product) => (
                  <button
                    key={product}
                    onClick={() => handleSelect(product)}
                    className="w-full flex items-center justify-between p-4 bg-white border-2 border-gray-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all active:scale-98"
                  >
                    <div className="flex items-center gap-3">
                      <Package className="w-5 h-5 text-gray-400" />
                      <span className="font-semibold text-gray-900">{product}</span>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </button>
                )
              )}
            </div>
          </div>
        ) : (
          /* Categories */
          <div>
            <p className="text-sm text-gray-600 mb-3">Browse by Category</p>
            <div className="space-y-2">
              {Object.entries(PRODUCT_CATEGORIES)
                .filter(([_, products]) => products.length > 0)
                .map(([category, products]) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className="w-full flex items-center justify-between p-4 bg-white border-2 border-gray-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all active:scale-98"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Package className="w-5 h-5 text-blue-600" />
                      </div>
                      <div className="text-left">
                        <div className="font-semibold text-gray-900">{category}</div>
                        <div className="text-sm text-gray-500">
                          {products.length} {products.length === 1 ? 'item' : 'items'}
                        </div>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </button>
                ))}
            </div>

            {/* Custom Product */}
            <div className="mt-6 p-4 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
              <p className="text-sm text-gray-600 mb-2">
                Don't see your product? You can search or type a custom name above.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
