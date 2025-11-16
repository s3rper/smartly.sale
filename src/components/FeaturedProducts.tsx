import React, { useEffect, useState } from 'react';
import { Star, ExternalLink, Package, MapPin, Store, Eye } from 'lucide-react';
import { baseUrl } from '../lib/base-url';
import type { Product, CMSProduct } from '../types/product';
import { transformCMSProduct } from '../types/product';

const FeaturedProducts: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log('Fetching products from:', `${baseUrl}/api/cms/products?limit=4`);
        const response = await fetch(`${baseUrl}/api/cms/products?limit=4`);
        
        console.log('Response status:', response.status);
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error('Response error:', errorText);
          throw new Error(`Failed to fetch products: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        console.log('Received data:', data);
        
        if (!data.items || !Array.isArray(data.items)) {
          console.error('Invalid data structure:', data);
          throw new Error('Invalid data structure received from API');
        }

        const transformedProducts = data.items
          .filter((item: CMSProduct) => !item.fieldData._draft && !item.fieldData._archived)
          .map((item: CMSProduct) => {
            console.log('Transforming item:', item.fieldData.name);
            return transformCMSProduct(item);
          });
        
        console.log('Transformed products:', transformedProducts.length);
        setProducts(transformedProducts);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError(err instanceof Error ? err.message : 'Failed to load products. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Loading state
  if (loading) {
    return (
      <section id="products" className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Featured <span className="text-[#FF6600]">Viral Products</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Loading amazing products for you...
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-card rounded-2xl shadow-lg overflow-hidden border border-border animate-pulse">
                <div className="aspect-square bg-muted"></div>
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                  <div className="h-4 bg-muted rounded w-full"></div>
                  <div className="h-4 bg-muted rounded w-1/2"></div>
                  <div className="h-10 bg-muted rounded-full"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Error state
  if (error) {
    return (
      <section id="products" className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Featured <span className="text-[#FF6600]">Viral Products</span>
            </h2>
            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-6 max-w-2xl mx-auto">
              <p className="text-destructive text-lg mb-4">{error}</p>
              <p className="text-muted-foreground text-sm mb-4">
                Please make sure:
              </p>
              <ul className="text-left text-muted-foreground text-sm space-y-2 max-w-md mx-auto">
                <li>• Products are added to the Affiliate Products CMS collection</li>
                <li>• Products are published (not in draft mode)</li>
                <li>• API credentials are properly configured</li>
              </ul>
              <button
                onClick={() => window.location.reload()}
                className="mt-6 px-6 py-3 bg-[#FF6600] text-white font-bold rounded-full hover:bg-[#FF6600]/90 transition-all"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Empty state
  if (products.length === 0) {
    return (
      <section id="products" className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Featured <span className="text-[#FF6600]">Viral Products</span>
            </h2>
            <div className="max-w-2xl mx-auto">
              <div className="bg-muted/50 rounded-lg p-12 mb-6">
                <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <p className="text-lg text-muted-foreground mb-2">
                  No products available yet!
                </p>
                <p className="text-sm text-muted-foreground">
                  Products will appear here once they're added to the Affiliate Products CMS collection and published.
                </p>
              </div>
              <a
                href={`${baseUrl}/about`}
                className="inline-flex items-center justify-center px-8 py-4 bg-[#FF6600] text-white font-bold rounded-full hover:bg-[#FF6600]/90 transition-all"
              >
                Learn More About Us
              </a>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="products" className="py-16 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Featured <span className="text-[#FF6600]">Viral Products</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Handpicked trending items that are flying off the shelves. Don't miss out!
          </p>
        </div>

        {/* Product Grid - Max 4 items */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {products.slice(0, 4).map((product) => {
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

                  {/* Sold Text (if no rating) */}
                  {product.soldText && (!product.shopRating || product.shopRating === 0) && (
                    <div className="text-xs text-muted-foreground flex items-center gap-1">
                      <Package className="w-3 h-3" />
                      {product.soldText}
                    </div>
                  )}

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

        {/* View All Button with margin-bottom: 16px (mb-4) */}
        <div className="text-center mb-4">
          <a
            href={`${baseUrl}/products`}
            className="inline-flex items-center justify-center px-12 py-4 bg-background text-foreground font-bold rounded-full border-2 border-[#FF6600] hover:bg-[#FF6600]/10 transition-all shadow-md hover:shadow-lg text-lg margin-bottom-16"
          >
            View All Products
          </a>
          <p className="text-muted-foreground text-sm mt-4">
            Discover more amazing deals and trending products
          </p>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
