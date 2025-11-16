import React, { useEffect, useState } from 'react';
import { Star, ExternalLink, Package, MapPin, Store, Eye, Search, X } from 'lucide-react';
import { baseUrl } from '../lib/base-url';
import type { Product, CMSProduct } from '../types/product';
import { transformCMSProduct } from '../types/product';

const AllProductsList: React.FC = () => {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [priceFilter, setPriceFilter] = useState<'all' | 'low' | 'mid' | 'high'>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'price-low' | 'price-high' | 'rating'>('newest');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log('Fetching all products from:', `${baseUrl}/api/cms/products?limit=100`);
        const response = await fetch(`${baseUrl}/api/cms/products?limit=100`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch products: ${response.status}`);
        }

        const data = await response.json();
        
        if (!data.items || !Array.isArray(data.items)) {
          throw new Error('Invalid data structure received from API');
        }

        const transformedProducts = data.items
          .filter((item: CMSProduct) => !item.fieldData._draft && !item.fieldData._archived)
          .map((item: CMSProduct) => transformCMSProduct(item));
        
        console.log('Loaded products:', transformedProducts.length);
        setAllProducts(transformedProducts);
        setFilteredProducts(transformedProducts);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError(err instanceof Error ? err.message : 'Failed to load products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Apply filters and search
  useEffect(() => {
    let result = [...allProducts];

    // Search filter
    if (searchQuery) {
      result = result.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.shopName?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Price filter
    if (priceFilter !== 'all') {
      result = result.filter(product => {
        const price = parseFloat(product.price.replace(/[^0-9.]/g, ''));
        if (priceFilter === 'low') return price < 500;
        if (priceFilter === 'mid') return price >= 500 && price <= 1500;
        if (priceFilter === 'high') return price > 1500;
        return true;
      });
    }

    // Sort
    result.sort((a, b) => {
      if (sortBy === 'price-low') {
        const priceA = parseFloat(a.price.replace(/[^0-9.]/g, ''));
        const priceB = parseFloat(b.price.replace(/[^0-9.]/g, ''));
        return priceA - priceB;
      }
      if (sortBy === 'price-high') {
        const priceA = parseFloat(a.price.replace(/[^0-9.]/g, ''));
        const priceB = parseFloat(b.price.replace(/[^0-9.]/g, ''));
        return priceB - priceA;
      }
      if (sortBy === 'rating') {
        return (b.shopRating || 0) - (a.shopRating || 0);
      }
      // newest (default) - already in order from API
      return 0;
    });

    setFilteredProducts(result);
  }, [searchQuery, priceFilter, sortBy, allProducts]);

  const clearFilters = () => {
    setSearchQuery('');
    setPriceFilter('all');
    setSortBy('newest');
  };

  if (loading) {
    return (
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <div className="h-10 bg-muted rounded w-64 mx-auto mb-4 animate-pulse"></div>
            <div className="h-6 bg-muted rounded w-96 mx-auto animate-pulse"></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-card rounded-2xl shadow-lg overflow-hidden border animate-pulse">
                <div className="aspect-square bg-muted"></div>
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                  <div className="h-4 bg-muted rounded w-full"></div>
                  <div className="h-10 bg-muted rounded-full"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-8 max-w-2xl mx-auto">
              <p className="text-destructive text-lg mb-4">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-3 bg-[#FF6600] text-white font-bold rounded-full hover:bg-[#FF6600]/90"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (allProducts.length === 0) {
    return (
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="bg-muted/50 rounded-lg p-12 max-w-2xl mx-auto">
              <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-lg text-muted-foreground mb-2">No products available yet!</p>
              <p className="text-sm text-muted-foreground">Check back soon for amazing deals.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-16 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}


        {/* Filters */}
        <div className="bg-card rounded-2xl shadow-lg p-6 mb-8 border border-border">
          {/* Search Bar */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-foreground mb-2">
              Search Products
            </label>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <input
                type="text"
                placeholder="Search by product name or shop..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-12 py-3 rounded-full border-2 border-border bg-background text-foreground focus:border-[#FF6600] focus:outline-none transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>

          {/* Filters Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Price Filter */}
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">
                Price Range
              </label>
              <select
                value={priceFilter}
                onChange={(e) => setPriceFilter(e.target.value as any)}
                className="w-full px-4 py-3 rounded-full border-2 border-border bg-background text-foreground focus:border-[#FF6600] focus:outline-none transition-colors cursor-pointer"
              >
                <option value="all">All Prices</option>
                <option value="low">Under ₱500</option>
                <option value="mid">₱500 - ₱1,500</option>
                <option value="high">Over ₱1,500</option>
              </select>
            </div>

            {/* Sort By */}
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">
                Sort By
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="w-full px-4 py-3 rounded-full border-2 border-border bg-background text-foreground focus:border-[#FF6600] focus:outline-none transition-colors cursor-pointer"
              >
                <option value="newest">Newest First</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>

            {/* Clear Filters */}
            <div className="flex items-end">
              <button
                onClick={clearFilters}
                className="w-full px-6 py-3 bg-muted text-foreground font-bold rounded-full hover:bg-muted/80 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          </div>

          {/* Results Count */}
          <div className="mt-4 text-center">
            <p className="text-muted-foreground">
              Showing <span className="font-bold text-[#FF6600]">{filteredProducts.length}</span> of{' '}
              <span className="font-bold">{allProducts.length}</span> products
            </p>
          </div>
        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <p className="text-lg text-muted-foreground mb-2">No products match your filters</p>
            <p className="text-sm text-muted-foreground mb-6">Try adjusting your search or filters</p>
            <button
              onClick={clearFilters}
              className="px-8 py-3 bg-[#FF6600] text-white font-bold rounded-full hover:bg-[#FF6600]/90"
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => {
              const mainImage = product.images[0] || 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400&h=400&fit=crop';
              const hasDiscount = product.discount && product.discount.trim() !== '';
              const hasShopInfo = product.shopName || product.shopLocation;
              const imageCount = product.images.length;
              const videoCount = product.videos.length;
              
              return (
                <div
                  key={product.id}
                  className="bg-card rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 border border-border group"
                >
                  {/* Product Image */}
                  <div className="relative aspect-square overflow-hidden">
                    <img
                      src={mainImage}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      loading="lazy"
                    />
                    {hasDiscount && (
                      <div className="absolute top-3 right-3 bg-[#FF6600] text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                        {product.discount}
                      </div>
                    )}
                    {product.stock && (
                      <div className="absolute top-3 left-3 bg-background/90 text-foreground text-xs font-medium px-3 py-1 rounded-full flex items-center gap-1">
                        <Package className="w-3 h-3" />
                        {product.stock}
                      </div>
                    )}
                    
                    {/* Media Count Badge */}
                    {(imageCount > 1 || videoCount > 0) && (
                      <div className="absolute bottom-3 left-3 flex gap-2">
                        {imageCount > 1 && (
                          <div className="bg-background/90 text-foreground text-xs px-2 py-1 rounded flex items-center gap-1">
                            📷 {imageCount}
                          </div>
                        )}
                        {videoCount > 0 && (
                          <div className="bg-background/90 text-foreground text-xs px-2 py-1 rounded flex items-center gap-1">
                            🎥 {videoCount}
                          </div>
                        )}
                      </div>
                    )}

                    {/* View Details Overlay */}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <div className="text-white font-bold flex items-center gap-2">
                        <Eye className="w-5 h-5" />
                        View Details
                      </div>
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className="p-4 space-y-3">
                    <h3 className="font-bold text-foreground text-lg line-clamp-2 h-14">
                      {product.name}
                    </h3>

                    {/* Shop Info */}
                    {hasShopInfo && (
                      <div className="flex flex-col gap-1 text-xs text-muted-foreground">
                        {product.shopName && (
                          <div className="flex items-center gap-1">
                            <Store className="w-3 h-3" />
                            <span className="truncate">{product.shopName}</span>
                          </div>
                        )}
                        {product.shopLocation && (
                          <div className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            <span className="truncate">{product.shopLocation}</span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Rating */}
                    {product.shopRating && product.shopRating > 0 && (
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 fill-[#FF6600] text-[#FF6600]" />
                        <span className="text-sm font-semibold text-foreground">
                          {product.shopRating.toFixed(1)}
                        </span>
                        {product.soldText && (
                          <span className="text-sm text-muted-foreground">({product.soldText})</span>
                        )}
                      </div>
                    )}

                    {/* Pricing */}
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl font-bold text-[#FF6600]">
                        {product.currency}{product.price}
                      </span>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      {/* View Details Button */}
                      <a
                        href={`${baseUrl}/product/${product.slug}`}
                        className="flex-1 bg-background text-foreground text-center font-bold py-3 rounded-full border-2 border-[#FF6600] hover:bg-[#FF6600]/10 transition-colors text-sm"
                      >
                        View Details
                      </a>

                      {/* Buy Now Button */}
                      {product.affiliateLink && (
                        <a
                          href={product.affiliateLink}
                          target="_blank"
                          rel="noopener noreferrer nofollow"
                          className="flex-1 bg-[#FF6600] text-white text-center font-bold py-3 rounded-full hover:bg-[#FF6600]/90 transition-colors flex items-center justify-center gap-1 text-sm"
                          onClick={(e) => e.stopPropagation()}
                        >
                          Buy Now
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default AllProductsList;
