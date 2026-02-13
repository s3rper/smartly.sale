import React, { useState } from 'react';
import { Star, ShoppingCart, Eye, Heart, MapPin, Shield, Truck, Award } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';

interface ProductDetailDynamicProps {
  productData: any;
}

const ProductDetailDynamic: React.FC<ProductDetailDynamicProps> = ({ productData }) => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedVariation, setSelectedVariation] = useState<string>('');

  // Extract product information
  const product = productData.batch_item_for_item_card_full;
  const productLink = productData.productOfferLink || productData.long_link || productData.product_link;

  // Format price (Shopee stores prices as integer with 5 decimal places)
  const formatPrice = (price: string) => {
    return `₱${(parseInt(price) / 100000).toFixed(2)}`;
  };

  const currentPrice = formatPrice(product.price_min);
  const maxPrice = product.price_max !== product.price_min ? formatPrice(product.price_max) : null;
  const originalPrice = formatPrice(product.price_before_discount);
  const discount = product.discount || product.show_discount;

  // Format images
  const images = product.images?.map((img: string) => 
    `https://down-ph.img.susercontent.com/file/${img}`
  ) || [];

  // Format video if available
  const videoUrl = product.video_info_list?.[0]?.formats?.find((f: any) => f.defn === 'V540P')?.url;

  // Ratings
  const rating = product.item_rating?.rating_star || 0;
  const ratingCount = product.item_rating?.rating_count?.[0] || 0;
  const ratingStars = product.item_rating?.rating_count || [];

  // Stock and sales
  const stock = product.stock || 0;
  const soldText = product.sold_text || product.sold || '0';

  // Variations
  const variations = product.tier_variations || [];

  // Location and shop
  const shopName = product.shop_name || 'Shopee Seller';
  const shopLocation = product.shop_location || 'Philippines';
  const shopRating = product.shop_rating || 0;
  const isVerified = product.shopee_verified || false;
  const isOfficial = product.is_official_shop || false;

  // Features
  const canUseCod = product.can_use_cod;
  const hasFreeShipping = product.show_free_shipping;
  const hasVoucher = product.voucher_info?.label;
  const hasAddOnDeal = product.add_on_deal_info?.add_on_deal_label;

  const handleBuyNow = () => {
    if (productLink) {
      // Track conversion
      if (typeof window !== 'undefined' && (window as any).fbq) {
        (window as any).fbq('track', 'InitiateCheckout', {
          content_ids: [product.itemid],
          content_name: product.name,
          content_type: 'product',
          value: parseInt(product.price_min) / 100000,
          currency: 'PHP'
        });
      }
      
      window.open(productLink, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <div className="mb-6 text-sm text-muted-foreground">
          <a href="/" className="hover:text-brand">Home</a>
          <span className="mx-2">/</span>
          <a href="/products" className="hover:text-brand">Products</a>
          <span className="mx-2">/</span>
          <span className="text-foreground">{product.name}</span>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* Left Column - Images */}
          <div>
            <Card className="p-4 mb-4">
              {/* Main Image or Video */}
              <div className="aspect-square bg-muted rounded-lg overflow-hidden mb-4">
                {videoUrl && selectedImage === -1 ? (
                  <video 
                    src={videoUrl} 
                    controls 
                    className="w-full h-full object-cover"
                    poster={images[0]}
                  />
                ) : (
                  <img 
                    src={images[selectedImage] || images[0]} 
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>

              {/* Thumbnail Gallery */}
              <div className="grid grid-cols-6 gap-2">
                {videoUrl && (
                  <button
                    onClick={() => setSelectedImage(-1)}
                    className={`aspect-square rounded-lg overflow-hidden border-2 ${
                      selectedImage === -1 ? 'border-brand' : 'border-border'
                    }`}
                  >
                    <div className="w-full h-full bg-muted flex items-center justify-center">
                      <svg className="w-8 h-8 text-brand" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z"/>
                      </svg>
                    </div>
                  </button>
                )}
                {images.slice(0, videoUrl ? 5 : 6).map((img: string, idx: number) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`aspect-square rounded-lg overflow-hidden border-2 ${
                      selectedImage === idx ? 'border-brand' : 'border-border'
                    }`}
                  >
                    <img src={img} alt={`View ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </Card>

            {/* Trust Badges */}
            <div className="grid grid-cols-2 gap-4">
              {canUseCod && (
                <Card className="p-4 flex items-center gap-3">
                  <Shield className="w-5 h-5 text-brand" />
                  <div className="text-sm">
                    <div className="font-semibold">Cash on Delivery</div>
                    <div className="text-muted-foreground">Available</div>
                  </div>
                </Card>
              )}
              {hasFreeShipping && (
                <Card className="p-4 flex items-center gap-3">
                  <Truck className="w-5 h-5 text-brand" />
                  <div className="text-sm">
                    <div className="font-semibold">Free Shipping</div>
                    <div className="text-muted-foreground">On this item</div>
                  </div>
                </Card>
              )}
            </div>
          </div>

          {/* Right Column - Product Info */}
          <div>
            <Card className="p-6">
              {/* Shop Badge */}
              <div className="flex items-center gap-2 mb-4">
                <Badge variant="secondary" className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {shopName}
                </Badge>
                {isVerified && (
                  <Badge className="bg-blue-500 text-white flex items-center gap-1">
                    <Award className="w-3 h-3" />
                    Verified
                  </Badge>
                )}
                {isOfficial && (
                  <Badge className="bg-red-500 text-white">Official Shop</Badge>
                )}
              </div>

              {/* Product Title */}
              <h1 className="text-3xl font-bold mb-4">{product.name}</h1>

              {/* Rating & Sales */}
              <div className="flex items-center gap-6 mb-6">
                <div className="flex items-center gap-2">
                  <div className="flex items-center">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-5 h-5 ${
                          star <= Math.floor(rating) 
                            ? 'fill-yellow-400 text-yellow-400' 
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="font-semibold">{rating.toFixed(1)}</span>
                  <span className="text-muted-foreground">({ratingCount} ratings)</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5 text-muted-foreground" />
                  <span className="font-semibold">{soldText}</span>
                  <span className="text-muted-foreground">sold</span>
                </div>
              </div>

              {/* Price */}
              <div className="bg-muted p-6 rounded-lg mb-6">
                <div className="flex items-center gap-4">
                  <div className="text-4xl font-bold text-brand">
                    {currentPrice}
                    {maxPrice && <span className="text-2xl"> - {maxPrice}</span>}
                  </div>
                  {discount && (
                    <Badge variant="destructive" className="text-lg px-3 py-1">
                      {typeof discount === 'number' ? `${discount}% OFF` : discount}
                    </Badge>
                  )}
                </div>
                {originalPrice !== currentPrice && (
                  <div className="text-muted-foreground line-through text-lg mt-2">
                    {originalPrice}
                  </div>
                )}
              </div>

              {/* Vouchers & Deals */}
              {(hasVoucher || hasAddOnDeal) && (
                <div className="mb-6 space-y-2">
                  {hasVoucher && (
                    <div className="flex items-center gap-2 text-sm">
                      <Badge className="bg-brand text-white">Voucher</Badge>
                      <span>{hasVoucher}</span>
                    </div>
                  )}
                  {hasAddOnDeal && (
                    <div className="flex items-center gap-2 text-sm">
                      <Badge className="bg-green-500 text-white">Deal</Badge>
                      <span>{hasAddOnDeal}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Variations */}
              {variations.length > 0 && (
                <div className="mb-6">
                  {variations.map((variation: any, vIdx: number) => (
                    <div key={vIdx} className="mb-4">
                      <div className="font-semibold mb-3">{variation.name}</div>
                      <div className="grid grid-cols-3 gap-2">
                        {variation.options?.map((option: string, oIdx: number) => {
                          const imageUrl = variation.images?.[oIdx] 
                            ? `https://down-ph.img.susercontent.com/file/${variation.images[oIdx]}`
                            : null;
                          
                          return (
                            <button
                              key={oIdx}
                              onClick={() => setSelectedVariation(option)}
                              className={`p-3 border-2 rounded-lg text-sm transition ${
                                selectedVariation === option
                                  ? 'border-brand bg-brand/10'
                                  : 'border-border hover:border-brand/50'
                              }`}
                            >
                              {imageUrl && (
                                <img 
                                  src={imageUrl} 
                                  alt={option}
                                  className="w-12 h-12 object-cover mx-auto mb-2 rounded"
                                />
                              )}
                              {option}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Stock Info */}
              <div className="mb-6 text-sm">
                <span className="text-muted-foreground">Stock: </span>
                <span className="font-semibold">
                  {stock > 100 ? '100+ available' : `${stock} available`}
                </span>
              </div>

              {/* Location */}
              <div className="mb-6 flex items-center gap-2 text-sm">
                <MapPin className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground">Ships from:</span>
                <span className="font-semibold">{shopLocation}</span>
              </div>

              {/* CTA Button */}
              <Button
                onClick={handleBuyNow}
                size="lg"
                className="w-full bg-brand hover:bg-brand-hover text-white text-lg py-6"
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                Buy Now on Shopee
              </Button>

              {/* Shop Rating */}
              <Card className="mt-6 p-4 bg-muted">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold mb-1">{shopName}</div>
                    <div className="flex items-center gap-2 text-sm">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span>{shopRating.toFixed(1)} Shop Rating</span>
                    </div>
                  </div>
                  <Button variant="outline" onClick={handleBuyNow}>
                    Visit Shop
                  </Button>
                </div>
              </Card>
            </Card>
          </div>
        </div>

        {/* Rating Breakdown */}
        {ratingStars.length > 0 && (
          <Card className="p-6 mb-12">
            <h2 className="text-2xl font-bold mb-6">Customer Ratings</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="text-center">
                <div className="text-6xl font-bold text-brand mb-2">{rating.toFixed(1)}</div>
                <div className="flex items-center justify-center mb-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-6 h-6 ${
                        star <= Math.floor(rating) 
                          ? 'fill-yellow-400 text-yellow-400' 
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <div className="text-muted-foreground">{ratingCount} ratings</div>
              </div>
              <div className="space-y-2">
                {[5, 4, 3, 2, 1].map((star) => {
                  const count = ratingStars[star] || 0;
                  const percentage = ratingCount > 0 ? (count / ratingCount) * 100 : 0;
                  return (
                    <div key={star} className="flex items-center gap-3">
                      <div className="flex items-center gap-1 w-20">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm">{star}</span>
                      </div>
                      <div className="flex-1 h-3 bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-brand transition-all"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <span className="text-sm text-muted-foreground w-12 text-right">
                        {count}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </Card>
        )}

        {/* Bottom CTA */}
        <Card className="p-8 text-center bg-gradient-to-r from-brand/10 to-brand/5">
          <h2 className="text-3xl font-bold mb-4">Ready to Buy?</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Click the button below to purchase this product on Shopee Philippines. 
            Get exclusive deals and fast shipping!
          </p>
          <Button
            onClick={handleBuyNow}
            size="lg"
            className="bg-brand hover:bg-brand-hover text-white text-lg px-8 py-6"
          >
            <ShoppingCart className="w-5 h-5 mr-2" />
            Shop Now on Shopee
          </Button>
        </Card>
      </div>
    </div>
  );
};

export default ProductDetailDynamic;
