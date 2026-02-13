# Dynamic Product Details Page - Complete Guide

## Overview

The dynamic product details page allows you to create direct links to product pages that display Shopee products with full details, images, ratings, and affiliate links. Perfect for Facebook Ads, email campaigns, and social media marketing.

## 🎯 Key Features

- ✅ **Dynamic Content**: Product info comes from URL parameters (no database needed)
- ✅ **SEO Optimized**: Automatic meta tags, Open Graph, and structured data
- ✅ **Mobile Responsive**: Beautiful design on all devices
- ✅ **Conversion Tracking**: Built-in Facebook Pixel tracking
- ✅ **Affiliate Ready**: Direct affiliate links with proper tracking
- ✅ **Fast Loading**: No server-side data fetching required
- ✅ **Product Variations**: Support for color, size, and other variations
- ✅ **Rich Media**: Product images, videos, ratings, and reviews

## 📋 How It Works

### Step 1: Get Product Data from Shopee

You'll need product data in this JSON format (from Shopee Affiliate API):

```json
{
  "item_id": "22057240522",
  "long_link": "https://shopee.ph/...",
  "product_link": "https://shopee.ph/...",
  "productOfferLink": "https://s.shopee.ph/...",
  "batch_item_for_item_card_full": {
    "itemid": "22057240522",
    "shopid": "704270867",
    "name": "Product Name Here",
    "image": "ph-11134207-7ra0o-...",
    "images": ["image1", "image2"],
    "price": "400000",
    "price_min": "400000",
    "price_max": "1300000",
    "price_before_discount": "2000000",
    "discount": "87%",
    "stock": 586158,
    "sold_text": "10K+",
    "item_rating": {
      "rating_star": 4.8,
      "rating_count": [1804, 22, 6, 62, 125, 1589]
    },
    "shop_name": "Shop Name",
    "shop_location": "Location",
    "can_use_cod": true,
    "shopee_verified": true
  }
}
```

### Step 2: Generate the URL

#### Option A: Using JavaScript (Recommended)

```javascript
import { generateProductDetailsUrl } from '@/lib/product-url-helper';

// Your Shopee product data
const productData = {
  item_id: "22057240522",
  // ... rest of the data
};

// Generate the URL
const productUrl = generateProductDetailsUrl(productData);
console.log(productUrl);
// Output: https://smartly.sale/product-details?data=%7B%22item_id%22...
```

#### Option B: Manual URL Encoding

```javascript
const productData = { /* your data */ };
const encodedData = encodeURIComponent(JSON.stringify(productData));
const url = `https://smartly.sale/product-details?data=${encodedData}`;
```

### Step 3: Use the URL

Use this URL in:
- **Facebook Ads**: Set as destination URL
- **Email Campaigns**: Add as product link
- **Social Media Posts**: Share directly
- **Affiliate Links**: Use in your promotions

## 🚀 Quick Start

### 1. View the Demo

Visit: `https://smartly.sale/product-details-demo`

This page includes:
- Working example with sample product
- URL format explanation
- Code examples for developers

### 2. Try the Sample URL

Click this link to see a real working example:
```
https://smartly.sale/product-details?data=%7B%22item_id%22%3A%2222057240522%22%2C...
```

## 💻 For Developers

### Import Helper Functions

```typescript
import { 
  generateProductDetailsUrl,
  parseProductDataFromUrl,
  extractProductInfo 
} from '@/lib/product-url-helper';
```

### Generate URL

```typescript
const url = generateProductDetailsUrl(shopeeProductData);
```

### Parse Data from URL

```typescript
const searchParams = new URLSearchParams(window.location.search);
const productData = parseProductDataFromUrl(searchParams);
```

### Extract Essential Info

```typescript
const info = extractProductInfo(productData);
console.log(info.name, info.price, info.rating);
```

## 📱 Facebook Ads Integration

### Step 1: Create Your Ad
1. Go to Facebook Ads Manager
2. Create a new campaign (Traffic or Conversions)
3. Design your ad creative

### Step 2: Set Destination URL
1. In the "Destination" section
2. Enter your generated product URL:
   ```
   https://smartly.sale/product-details?data=YOUR_ENCODED_DATA
   ```

### Step 3: Add UTM Parameters (Optional)
```
https://smartly.sale/product-details?data=ENCODED_DATA&utm_source=facebook&utm_medium=cpc&utm_campaign=product_promo
```

### Step 4: Track Conversions
The page automatically tracks:
- ✅ Page views (Facebook Pixel)
- ✅ Button clicks (InitiateCheckout event)
- ✅ Affiliate link clicks

## 🎨 What Users See

The product detail page displays:

1. **Hero Section**
   - Product images (with gallery)
   - Product videos (if available)
   - Interactive thumbnail navigation

2. **Product Information**
   - Product name and title
   - Shop name with verification badge
   - Star ratings and review count
   - Items sold counter

3. **Pricing**
   - Current price (with range if variations exist)
   - Original price (crossed out)
   - Discount percentage badge
   - Available vouchers and deals

4. **Variations**
   - Color/size options with images
   - Interactive selection
   - Stock availability

5. **Trust Elements**
   - Cash on Delivery badge
   - Free Shipping indicator
   - Shop rating and verification
   - Stock availability

6. **Call-to-Actions**
   - Large "Buy Now on Shopee" button
   - Visit Shop button
   - Direct affiliate link integration

7. **Rating Breakdown**
   - Overall rating display
   - Star distribution chart
   - Review count by rating

## 📊 Data Format Reference

### Required Fields

```typescript
{
  item_id: string;                    // Shopee item ID
  batch_item_for_item_card_full: {
    itemid: string;                   // Same as item_id
    shopid: string;                   // Shopee shop ID
    name: string;                     // Product name
    price_min: string;                // Minimum price (x100000)
    price_before_discount: string;    // Original price (x100000)
  }
}
```

### Optional but Recommended Fields

```typescript
{
  productOfferLink: string;           // Affiliate link (highest priority)
  long_link: string;                  // Alternative affiliate link
  product_link: string;               // Regular product link
  batch_item_for_item_card_full: {
    image: string;                    // Main product image
    images: string[];                 // Image gallery
    price_max: string;                // Max price for variations
    discount: string;                 // Discount percentage
    stock: number;                    // Available stock
    sold: number;                     // Items sold
    sold_text: string;                // "10K+", "5K+", etc.
    item_rating: {
      rating_star: number;            // Average rating (0-5)
      rating_count: number[];         // [total, 1star, 2star, ...]
    };
    shop_name: string;                // Shop name
    shop_location: string;            // Shop location
    shop_rating: number;              // Shop rating
    shopee_verified: boolean;         // Verified badge
    is_official_shop: boolean;        // Official shop badge
    tier_variations: Array<{          // Product variations
      name: string;
      options: string[];
      images: string[];
    }>;
    video_info_list: Array<any>;      // Product videos
    can_use_cod: boolean;             // COD available
    show_free_shipping: boolean;      // Free shipping
    voucher_info: { label: string };  // Voucher info
  }
}
```

## 🔧 Price Calculation

Shopee stores prices as integers multiplied by 100,000:
- Stored: `400000` → Display: `₱4.00`
- Stored: `1300000` → Display: `₱13.00`

Formula: `displayPrice = storedPrice / 100000`

## 🖼️ Image URLs

Product images use this format:
```
https://down-ph.img.susercontent.com/file/{image_code}
```

Example:
```javascript
const imageCode = "ph-11134207-7ra0o-mcg6ku6zzi1d9c";
const imageUrl = `https://down-ph.img.susercontent.com/file/${imageCode}`;
```

## 🎯 Conversion Tracking

The page includes Facebook Pixel tracking:

```javascript
// Page View (automatic)
fbq('track', 'PageView');

// Purchase Intent (on button click)
fbq('track', 'InitiateCheckout', {
  content_ids: [productId],
  content_name: productName,
  content_type: 'product',
  value: price,
  currency: 'PHP'
});
```

## 📈 Best Practices

### 1. URL Length
- Keep product data minimal for shorter URLs
- Include only essential fields
- Use URL shorteners for social media

### 2. Cache Product Data
- Store frequently used product URLs
- Pre-generate URLs for campaigns
- Update URLs when prices change

### 3. Testing
- Always test URLs before launching campaigns
- Check mobile responsiveness
- Verify affiliate links work correctly

### 4. SEO
- Use descriptive product names
- Include relevant keywords
- Add proper meta descriptions

### 5. Conversion Optimization
- Use high-quality product images
- Highlight discounts and deals
- Show social proof (ratings, sales)

## 🐛 Troubleshooting

### "No Product Data" Error
- Check if URL parameter `data` exists
- Verify JSON is properly encoded
- Test with URL decoder online

### Images Not Loading
- Confirm image codes are correct
- Check Shopee image CDN availability
- Use fallback images if needed

### Affiliate Link Not Working
- Verify `productOfferLink` is included
- Check `long_link` and `product_link` as fallbacks
- Ensure links aren't expired

### Price Display Issues
- Confirm prices are integers (not floats)
- Verify decimal place calculation
- Check for null/undefined values

## 📚 Files Reference

- **Main Page**: `src/pages/product-details.astro`
- **Component**: `src/components/ProductDetailDynamic.tsx`
- **Helper Utils**: `src/lib/product-url-helper.ts`
- **Demo Page**: `src/pages/product-details-demo.astro`

## 🎉 Success Tips

1. **Use Clear CTAs**: Make "Buy Now" buttons prominent
2. **Show Trust Signals**: Display ratings, reviews, and badges
3. **Optimize Images**: Ensure fast loading times
4. **Mobile First**: Most traffic comes from mobile devices
5. **Track Everything**: Use analytics to optimize conversions

## 📞 Support

For questions or issues:
- Check the demo page: `/product-details-demo`
- Review this documentation
- Test with sample data provided
- Verify URL encoding is correct

---

**Last Updated**: November 2025  
**Version**: 1.0.0  
**Compatible with**: Astro 5.x, React 19.x
