# 🚀 Quick Reference - Dynamic Product Details

## Generate URL (3 Ways)

### 1. Using Script (Easiest)
```bash
node generate-product-url.js
```

### 2. Using JavaScript
```javascript
import { generateProductDetailsUrl } from '@/lib/product-url-helper';
const url = generateProductDetailsUrl(productData);
```

### 3. Manual (Any Language)
```javascript
const encoded = encodeURIComponent(JSON.stringify(productData));
const url = `https://smartly.sale/product-details?data=${encoded}`;
```

## Facebook Ads Setup

1. Get product data from Shopee API
2. Generate URL using method above
3. Copy URL
4. Paste into Facebook Ad destination
5. Add UTM: `&utm_source=facebook&utm_campaign=yourname`

## Test Your Setup

**Demo Page**: `/product-details-demo`
**Sample Product**: See demo page for working link

## Key Pages

- `/product-details` - Main dynamic page
- `/product-details-demo` - Examples & docs
- `generate-product-url.js` - URL generator script

## Required JSON Fields

```json
{
  "item_id": "...",
  "productOfferLink": "https://...",
  "batch_item_for_item_card_full": {
    "itemid": "...",
    "name": "Product name",
    "image": "image-code",
    "price_min": "400000",
    "price_before_discount": "2000000"
  }
}
```

## Price Formula
```
displayPrice = storedPrice / 100000
400000 = ₱4.00
```

## Image URL
```
https://down-ph.img.susercontent.com/file/{image_code}
```

## Files Reference
- `src/pages/product-details.astro` - Main page
- `src/components/ProductDetailDynamic.tsx` - Component
- `src/lib/product-url-helper.ts` - Helper functions
- `DYNAMIC_PRODUCT_DETAILS_GUIDE.md` - Full docs
- `DYNAMIC_PRODUCT_SETUP_COMPLETE.md` - Setup guide

## Need Help?
Read: `DYNAMIC_PRODUCT_DETAILS_GUIDE.md`
