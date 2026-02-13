/**
 * Helper utility to generate product-details URLs from Shopee API data
 * This is useful for creating links from Facebook ads or other external sources
 */

export interface ShopeeProductData {
  item_id: string;
  long_link?: string;
  product_link?: string;
  productOfferLink?: string;
  batch_item_for_item_card_full: {
    itemid: string;
    shopid: string;
    name: string;
    image?: string;
    images?: string[];
    price: string;
    price_min: string;
    price_max: string;
    price_before_discount: string;
    discount?: string;
    stock: number;
    sold?: number;
    sold_text?: string;
    item_rating?: {
      rating_star: number;
      rating_count: number[];
    };
    shop_name?: string;
    shop_location?: string;
    shop_rating?: number;
    shopee_verified?: boolean;
    is_official_shop?: boolean;
    tier_variations?: any[];
    video_info_list?: any[];
    can_use_cod?: boolean;
    show_free_shipping?: boolean;
    voucher_info?: {
      label: string;
    };
    add_on_deal_info?: {
      add_on_deal_label: string;
    };
  };
}

/**
 * Generate a product details URL from Shopee API data
 * @param productData - The product data from Shopee API
 * @param baseUrl - Optional base URL (defaults to current domain)
 * @returns The complete URL to the product-details page
 */
export function generateProductDetailsUrl(
  productData: ShopeeProductData,
  baseUrl: string = ''
): string {
  const encodedData = encodeURIComponent(JSON.stringify(productData));
  return `${baseUrl}/product-details?data=${encodedData}`;
}

/**
 * Parse product data from URL search params
 * @param searchParams - URLSearchParams object or search string
 * @returns Parsed product data or null if invalid
 */
export function parseProductDataFromUrl(
  searchParams: URLSearchParams | string
): ShopeeProductData | null {
  try {
    const params = typeof searchParams === 'string' 
      ? new URLSearchParams(searchParams)
      : searchParams;
    
    const dataParam = params.get('data');
    if (!dataParam) return null;

    return JSON.parse(decodeURIComponent(dataParam));
  } catch (error) {
    console.error('Failed to parse product data from URL:', error);
    return null;
  }
}

/**
 * Extract essential product info for preview/meta tags
 * @param productData - The product data
 * @returns Essential product information
 */
export function extractProductInfo(productData: ShopeeProductData) {
  const product = productData.batch_item_for_item_card_full;
  
  return {
    id: productData.item_id,
    name: product.name,
    price: (parseInt(product.price_min) / 100000).toFixed(2),
    maxPrice: product.price_max !== product.price_min 
      ? (parseInt(product.price_max) / 100000).toFixed(2)
      : null,
    originalPrice: (parseInt(product.price_before_discount) / 100000).toFixed(2),
    discount: product.discount,
    imageUrl: product.image 
      ? `https://down-ph.img.susercontent.com/file/${product.image}`
      : null,
    rating: product.item_rating?.rating_star || 0,
    ratingCount: product.item_rating?.rating_count?.[0] || 0,
    sold: product.sold_text || product.sold || 0,
    shopName: product.shop_name || 'Shopee',
    shopLocation: product.shop_location || 'Philippines',
    shopRating: product.shop_rating || 0,
    isVerified: product.shopee_verified || false,
    isOfficial: product.is_official_shop || false,
    affiliateLink: productData.productOfferLink || productData.long_link || productData.product_link,
  };
}

/**
 * Example usage for Facebook Ads integration:
 * 
 * 1. In your Facebook Ad, set the destination URL as:
 *    https://smartly.sale/product-details?data={ENCODED_JSON}
 * 
 * 2. Generate the URL using this helper:
 *    const url = generateProductDetailsUrl(shopeeApiResponse);
 * 
 * 3. The product-details page will automatically parse and display the product
 */
