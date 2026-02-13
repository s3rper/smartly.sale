import React, { useEffect, useState } from 'react';
import { Star, ExternalLink, Package, MapPin, Store, ChevronLeft, ChevronRight, Play, ShoppingCart } from 'lucide-react';
import { baseUrl } from '../lib/base-url';
import type { Product, CMSProduct } from '../types/product';
import { transformCMSProduct } from '../types/product';

const ProductDetail: React.FC = () => {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [showVideo, setShowVideo] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        
        // Get slug from URL
        const pathParts = window.location.pathname.split('/');
        const slug = pathParts[pathParts.length - 1];

        if (!slug) {
          throw new Error('No product slug provided');
        }

        // Fetch all products and find by slug
        const response = await fetch(`${baseUrl}/api/cms/products?limit=100`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch product');
        }

        const data = await response.json();
        
        if (data.items && Array.isArray(data.items)) {
          const foundProduct = data.items.find(
            (item: CMSProduct) => 
              item.fieldData.slug === slug && 
              !item.fieldData._draft && 
              !item.fieldData._archived
          );

          if (foundProduct) {
            const transformedProduct = transformCMSProduct(foundProduct);
            setProduct(transformedProduct);
            
            // Emit custom event with product data for SEO meta updates
            window.dispatchEvent(new CustomEvent('productLoaded', {
              detail: transformedProduct
            }));
          } else {
            setError('Product not found');
          }
        }
      } catch (err) {
        console.error('Error fetching product:', err);
        setError('Failed to load product. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, []);

  const nextImage = () => {
    if (product && displayImages.length > 1) {
      setSelectedImageIndex((prev) => (prev + 1) % displayImages.length);
    }
  };

  const prevImage = () => {
    if (product && displayImages.length > 1) {
      setSelectedImageIndex((prev) => (prev - 1 + displayImages.length) % displayImages.length);
    }
  };

  // Placeholder component with shopping cart icon
  const PlaceholderImage = ({ size = 'large' }: { size?: 'large' | 'small' }) => (
    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-brand/20 to-brand/5">
      <ShoppingCart 
        className={`${size === 'large' ? 'w-24 h-24' : 'w-8 h-8'} text-brand opacity-50`} 
        strokeWidth={1.5} 
      />
    </div>
  );

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-background py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-pulse">
            <div className="space-y-4">
              <div className="aspect-square bg-muted rounded-2xl"></div>
              <div className="flex gap-2">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="w-20 h-20 bg-muted rounded-lg"></div>
                ))}
              </div>
            </div>
            <div className="space-y-6">
              <div className="h-8 bg-muted rounded w-3/4"></div>
              <div className="h-4 bg-muted rounded w-1/2"></div>
              <div className="h-20 bg-muted rounded"></div>
              <div className="h-12 bg-muted rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !product) {
    return (
      <div className="min-h-screen bg-background py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl font-bold text-foreground mb-4">Product Not Found</h1>
          <p className="text-muted-foreground mb-8">{error || 'The product you are looking for does not exist.'}</p>
          <a
            href={`${baseUrl}/`}
            className="inline-flex items-center justify-center px-8 py-4 bg-brand text-white font-bold rounded-full hover:bg-brand/90 transition-all"
          >
            Back to Home
          </a>
        </div>
      </div>
    );
  }

  // Filter out empty/invalid images - skip the first image (index 0) for display
  const displayImages = product.images.slice(1).filter(img => img && img.trim() !== '');
  
  // Get main image - either from displayImages or first image from product
  const mainImageUrl = displayImages[selectedImageIndex] || product.images[0];
  const hasValidMainImage = mainImageUrl && mainImageUrl.trim() !== '';
  
  const hasDiscount = product.discount && product.discount.trim() !== '';
  const hasShopInfo = product.shopName || product.shopLocation || (product.shopRating && product.shopRating > 0);

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-8 text-sm">
          <ol className="flex items-center space-x-2 text-muted-foreground">
            <li><a href={`${baseUrl}/`} className="hover:text-foreground">Home</a></li>
            <li>/</li>
            <li><a href={`${baseUrl}/products`} className="hover:text-foreground">Products</a></li>
            <li>/</li>
            <li className="text-foreground truncate">{product.name}</li>
          </ol>
        </nav>

        {/* Product Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Column - Images/Videos */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-card border border-border">
              {hasValidMainImage ? (
                <img
                  src={mainImageUrl}
                  alt={product.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    // If image fails to load, replace with placeholder
                    const target = e.currentTarget;
                    target.style.display = 'none';
                    const parent = target.parentElement;
                    if (parent && !parent.querySelector('.placeholder-wrapper')) {
                      const placeholder = document.createElement('div');
                      placeholder.className = 'placeholder-wrapper w-full h-full flex items-center justify-center bg-gradient-to-br from-brand/20 to-brand/5';
                      placeholder.innerHTML = '<svg class="w-24 h-24 text-brand opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" /></svg>';
                      parent.appendChild(placeholder);
                    }
                  }}
                />
              ) : (
                <PlaceholderImage size="large" />
              )}
              
              {hasDiscount && (
                <div className="absolute top-4 right-4 bg-brand text-white text-sm font-bold px-4 py-2 rounded-full shadow-lg">
                  {product.discount}
                </div>
              )}

              {/* Navigation Arrows */}
              {displayImages.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background text-foreground p-2 rounded-full shadow-lg transition-all"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background text-foreground p-2 rounded-full shadow-lg transition-all"
                    aria-label="Next image"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </>
              )}

              {/* Image Counter */}
              {displayImages.length > 1 && (
                <div className="absolute bottom-4 right-4 bg-background/80 text-foreground text-sm px-3 py-1 rounded-full">
                  {selectedImageIndex + 1} / {displayImages.length}
                </div>
              )}
            </div>

            {/* Thumbnail Gallery */}
            {displayImages.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {displayImages.map((image, index) => {
                  const isValidImage = image && image.trim() !== '';
                  return (
                    <button
                      key={index}
                      onClick={() => setSelectedImageIndex(index)}
                      className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                        selectedImageIndex === index
                          ? 'border-brand'
                          : 'border-border hover:border-muted-foreground'
                      }`}
                    >
                      {isValidImage ? (
                        <img
                          src={image}
                          alt={`${product.name} - Image ${index + 1}`}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            const target = e.currentTarget;
                            target.style.display = 'none';
                            const parent = target.parentElement;
                            if (parent && !parent.querySelector('.placeholder-wrapper')) {
                              const placeholder = document.createElement('div');
                              placeholder.className = 'placeholder-wrapper w-full h-full flex items-center justify-center bg-gradient-to-br from-brand/20 to-brand/5';
                              placeholder.innerHTML = '<svg class="w-8 h-8 text-brand opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" /></svg>';
                              parent.appendChild(placeholder);
                            }
                          }}
                        />
                      ) : (
                        <PlaceholderImage size="small" />
                      )}
                    </button>
                  );
                })}
              </div>
            )}

            {/* Video Section */}
            {product.videos.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                  <Play className="w-5 h-5 text-brand" />
                  Product Videos ({product.videos.length})
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {product.videos.slice(0, 4).map((videoUrl, index) => (
                    <a
                      key={index}
                      href={videoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="relative aspect-video rounded-lg overflow-hidden bg-muted border border-border hover:border-brand transition-all group"
                    >
                      <div className="absolute inset-0 flex items-center justify-center bg-background/50 group-hover:bg-background/30 transition-all">
                        <Play className="w-12 h-12 text-brand" />
                      </div>
                      <div className="absolute bottom-2 left-2 bg-background/80 text-foreground text-xs px-2 py-1 rounded">
                        Video {index + 1}
                      </div>
                    </a>
                  ))}
                </div>
                {product.videos.length > 4 && (
                  <p className="text-sm text-muted-foreground text-center">
                    + {product.videos.length - 4} more videos available
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Right Column - Product Details */}
          <div className="space-y-6">
            {/* Product Title - Main H1 for SEO */}
            <div>
              <h1 className="font-bold text-foreground mb-4 break-words" style={{ fontSize: '2em' }}>
                {product.name}
              </h1>
              
              {/* Stock Status */}
              {product.stock && (
                <div className="inline-flex items-center gap-2 bg-muted text-foreground px-4 py-2 rounded-full text-sm">
                  <Package className="w-4 h-4" />
                  {product.stock}
                </div>
              )}
            </div>

            {/* Shop Information */}
            {hasShopInfo && (
              <div className="bg-card border border-border rounded-xl p-4 space-y-2">
                <h3 className="font-semibold text-foreground text-sm mb-3">Shop Information</h3>
                
                {product.shopName && (
                  <div className="flex items-center gap-2 text-sm">
                    <Store className="w-4 h-4 text-muted-foreground" />
                    <span className="text-foreground font-medium">{product.shopName}</span>
                  </div>
                )}
                
                {product.shopLocation && (
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">{product.shopLocation}</span>
                  </div>
                )}
                
                {product.shopRating && product.shopRating > 0 && (
                  <div className="flex items-center gap-2 text-sm">
                    <Star className="w-4 h-4 fill-brand text-brand" />
                    <span className="text-foreground font-semibold">{product.shopRating.toFixed(1)}</span>
                    <span className="text-muted-foreground">Shop Rating</span>
                  </div>
                )}

                {product.soldText && (
                  <div className="flex items-center gap-2 text-sm">
                    <Package className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">{product.soldText}</span>
                  </div>
                )}
              </div>
            )}

            {/* Pricing */}
            <div className="bg-gradient-to-r from-brand/10 to-transparent border-l-4 border-brand p-6 rounded-lg">
              <div className="flex items-baseline gap-3 mb-2">
                <span className="text-4xl md:text-5xl font-bold text-brand">
                  {product.currency || '₱'}{product.price}
                </span>
                {hasDiscount && (
                  <span className="text-lg text-muted-foreground">
                    {product.discount}
                  </span>
                )}
              </div>
              <p className="text-sm text-muted-foreground">
                Prices may vary. Check Shopee for the latest offers.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="space-y-3">
              {product.affiliateLink ? (
                <>
                  <a
                    href={product.affiliateLink}
                    target="_blank"
                    rel="noopener noreferrer nofollow"
                    className="flex items-center justify-center w-full bg-brand text-white font-bold py-4 rounded-full hover:bg-brand/90 transition-all shadow-lg hover:shadow-xl text-lg"
                  >
                    <ExternalLink className="w-5 h-5 mr-2" />
                    Buy Now on Shopee
                  </a>
                  
                  {/* ShareThis BEGIN */}
                  <div className="sharethis-inline-share-buttons"></div>
                  {/* ShareThis END */}
                  
                  <p className="text-xs text-center text-muted-foreground">
                    🎁 As an affiliate, we may earn from qualifying purchases
                  </p>
                </>
              ) : (
                <button
                  disabled
                  className="flex items-center justify-center w-full bg-muted text-muted-foreground font-bold py-4 rounded-full cursor-not-allowed text-lg"
                >
                  Link Coming Soon
                </button>
              )}
            </div>

            {/* Product Stats */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-card border border-border rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-brand mb-1">
                  {displayImages.length}
                </div>
                <div className="text-xs text-muted-foreground">Images</div>
              </div>
              <div className="bg-card border border-border rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-brand mb-1">
                  {product.videos.length}
                </div>
                <div className="text-xs text-muted-foreground">Videos</div>
              </div>
              <div className="bg-card border border-border rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-brand mb-1">
                  {product.shopRating?.toFixed(1) || 'N/A'}
                </div>
                <div className="text-xs text-muted-foreground">Rating</div>
              </div>
            </div>

            {/* Dates */}
            {(product.publishedOn || product.updatedOn) && (
              <div className="text-xs text-muted-foreground space-y-1 border-t border-border pt-4">
                {product.publishedOn && (
                  <p>Published: {new Date(product.publishedOn).toLocaleDateString('en-PH')}</p>
                )}
                {product.updatedOn && (
                  <p>Updated: {new Date(product.updatedOn).toLocaleDateString('en-PH')}</p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Back Button */}
        <div className="mt-12 text-center">
          <a
            href={`${baseUrl}/products`}
            className="inline-flex items-center justify-center px-8 py-4 bg-background text-foreground font-bold rounded-full border-2 border-brand hover:bg-brand/10 transition-all"
          >
            <ChevronLeft className="w-5 h-5 mr-2" />
            Back to Products
          </a>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
