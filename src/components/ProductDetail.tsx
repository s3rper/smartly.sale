import React, { useEffect, useState } from 'react';
import { Star, ExternalLink, Package, MapPin, Store, ChevronLeft, ChevronRight, Play } from 'lucide-react';
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
            setProduct(transformCMSProduct(foundProduct));
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
    if (product && product.images.length > 0) {
      setSelectedImageIndex((prev) => (prev + 1) % product.images.length);
    }
  };

  const prevImage = () => {
    if (product && product.images.length > 0) {
      setSelectedImageIndex((prev) => (prev - 1 + product.images.length) % product.images.length);
    }
  };

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
            className="inline-flex items-center justify-center px-8 py-4 bg-[#FF6600] text-white font-bold rounded-full hover:bg-[#FF6600]/90 transition-all"
          >
            Back to Home
          </a>
        </div>
      </div>
    );
  }

  const mainImage = product.images[selectedImageIndex] || 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&h=800&fit=crop';
  const hasDiscount = product.discount && product.discount.trim() !== '';
  const hasShopInfo = product.shopName || product.shopLocation || (product.shopRating && product.shopRating > 0);

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-8 text-sm">
          <ol className="flex items-center space-x-2 text-muted-foreground">
            <li><a href={baseUrl} className="hover:text-foreground">Home</a></li>
            <li>/</li>
            <li><a href={`${baseUrl}/blog`} className="hover:text-foreground">Products</a></li>
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
              <img
                src={mainImage}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              
              {hasDiscount && (
                <div className="absolute top-4 right-4 bg-[#FF6600] text-white text-sm font-bold px-4 py-2 rounded-full shadow-lg">
                  {product.discount}
                </div>
              )}

              {/* Navigation Arrows */}
              {product.images.length > 1 && (
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
              {product.images.length > 1 && (
                <div className="absolute bottom-4 right-4 bg-background/80 text-foreground text-sm px-3 py-1 rounded-full">
                  {selectedImageIndex + 1} / {product.images.length}
                </div>
              )}
            </div>

            {/* Thumbnail Gallery */}
            {product.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImageIndex === index
                        ? 'border-[#FF6600]'
                        : 'border-border hover:border-muted-foreground'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} - Image ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Video Section */}
            {product.videos.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                  <Play className="w-5 h-5 text-[#FF6600]" />
                  Product Videos ({product.videos.length})
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {product.videos.slice(0, 4).map((videoUrl, index) => (
                    <a
                      key={index}
                      href={videoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="relative aspect-video rounded-lg overflow-hidden bg-muted border border-border hover:border-[#FF6600] transition-all group"
                    >
                      <div className="absolute inset-0 flex items-center justify-center bg-background/50 group-hover:bg-background/30 transition-all">
                        <Play className="w-12 h-12 text-[#FF6600]" />
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
            {/* Product Title */}
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
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
                    <Star className="w-4 h-4 fill-[#FF6600] text-[#FF6600]" />
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
            <div className="bg-gradient-to-r from-[#FF6600]/10 to-transparent border-l-4 border-[#FF6600] p-6 rounded-lg">
              <div className="flex items-baseline gap-3 mb-2">
                <span className="text-4xl md:text-5xl font-bold text-[#FF6600]">
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
                    className="flex items-center justify-center w-full bg-[#FF6600] text-white font-bold py-4 rounded-full hover:bg-[#FF6600]/90 transition-all shadow-lg hover:shadow-xl text-lg"
                  >
                    <ExternalLink className="w-5 h-5 mr-2" />
                    Buy Now on Shopee
                  </a>
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
                <div className="text-2xl font-bold text-[#FF6600] mb-1">
                  {product.images.length}
                </div>
                <div className="text-xs text-muted-foreground">Images</div>
              </div>
              <div className="bg-card border border-border rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-[#FF6600] mb-1">
                  {product.videos.length}
                </div>
                <div className="text-xs text-muted-foreground">Videos</div>
              </div>
              <div className="bg-card border border-border rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-[#FF6600] mb-1">
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
            href={`${baseUrl}/`}
            className="inline-flex items-center justify-center px-8 py-4 bg-background text-foreground font-bold rounded-full border-2 border-[#FF6600] hover:bg-[#FF6600]/10 transition-all"
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
