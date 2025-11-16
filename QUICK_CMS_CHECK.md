# Quick CMS Connection Check

Use this guide to quickly verify your Affiliate Products CMS is properly connected.

## ✅ What You Should See

### Homepage (index.astro)

**When Working Correctly**:
- Product grid with 4 columns on desktop
- Product cards showing:
  - ✅ Product image
  - ✅ Product name
  - ✅ Price with orange color
  - ✅ Shop name and location (if set)
  - ✅ Star rating (if set)
  - ✅ Discount badge (if set)
  - ✅ Stock status (if set)
  - ✅ "View Details" button
  - ✅ "Buy Now" button (if affiliate link set)
- Message at bottom: "Showing X trending products"

**When Not Working**:
- Red error box with message: "Failed to load products"
- OR: Gray box with message: "No products available yet!"

### Product Detail Page (/product/[slug])

**When Working Correctly**:
- Large product image gallery
- Product name as heading
- Price, discount, stock info
- Shop details (name, location, rating)
- "Buy Now on Shopee" button
- Additional product images in grid
- Video embeds (if video URLs set)

**When Not Working**:
- 404 page
- OR: Error message
- OR: Missing data/images

## 🔍 Browser Console Check

Open browser console (F12 > Console tab):

### Good Signs ✅
```
Fetching products from: /api/cms/products?limit=100
Response status: 200
Received data: {items: Array(X), ...}
Transformed products: X
```

### Warning Signs ⚠️
```
Response status: 502
Response error: {...}
Error fetching products: ...
```

### Bad Signs ❌
```
API: Missing WEBFLOW_CMS_SITE_API_TOKEN
Failed to fetch products: 500 Internal Server Error
Successfully fetched 0 products
```

## 🌐 Network Tab Check

Open browser Network tab (F12 > Network tab), filter by "products":

### Good Response ✅
- **Status**: 200 OK
- **Response Preview**:
```json
{
  "items": [
    {
      "id": "...",
      "fieldData": {
        "name": "Product Name",
        "slug": "product-slug",
        "image-1": {
          "url": "https://..."
        },
        "price": "299.00",
        ...
      }
    }
  ],
  "pagination": {
    "total": 5
  }
}
```

### Bad Response ❌
- **Status**: 500, 502, or 404
- **Response**:
```json
{
  "error": "Missing token"
}
```
OR
```json
{
  "items": [],
  "pagination": { "total": 0 }
}
```

## 📋 CMS Checklist

Go to your Webflow CMS and verify:

### In Affiliate Products Collection:
- [ ] At least 1 product exists
- [ ] Product has a Name
- [ ] Product has a Slug
- [ ] Product is **Published** (not draft)
- [ ] Product is **Not Archived**
- [ ] Product has at least 1 image in `image-1` field
- [ ] Product has a price in `price` field
- [ ] Product has affiliate link in `product-offer-link` field

### Example Good Product Entry:
```
Name: Premium Wireless Earbuds
Slug: premium-wireless-earbuds
Image 1: [image uploaded]
Price: 999.00
Currency: ₱
Discount: 30% OFF
Stock: 50 available
Shop Name: TechHub Manila
Shop Location: Manila, Philippines
Shop Rating: 4.8
Product Offer Link: https://shp.ee/abc123xyz
Status: Published ✅
Archived: No ✅
```

## 🔧 Quick Fixes

### No Products Showing
1. Add product to CMS
2. Make sure it's published
3. Hard refresh browser (Ctrl+Shift+R)

### Products Show But Missing Data
1. Check which fields are empty in CMS
2. Add missing data (images, price, etc.)
3. Save and publish
4. Refresh browser

### API Error
1. Check `.env` file exists with token
2. Restart development server
3. Check console for specific error
4. See [TROUBLESHOOTING_CMS.md](./TROUBLESHOOTING_CMS.md)

## 🎯 Expected Behavior Summary

| Scenario | Homepage | Product Page | Console |
|----------|----------|--------------|---------|
| **Working Perfectly** | Products display with all data | Full product details | "Successfully fetched X products" |
| **Working (No Data)** | "No products available yet!" | N/A | "Successfully fetched 0 products" |
| **API Token Missing** | Red error box | Error | "Missing WEBFLOW_CMS_SITE_API_TOKEN" |
| **Network Error** | Red error box | Error | "Failed to fetch products: 502" |
| **Products in Draft** | "No products available yet!" | N/A | Products filtered out in logs |

## 📸 Visual Reference

### Healthy Homepage
- Hero section with CTA
- Product grid (1-4 columns based on screen size)
- Each card has image, title, price, buttons
- Orange accents throughout
- No error messages

### Healthy Product Page
- Large main image
- Product info section
- Shop details
- Clear "Buy Now" button
- Additional images/videos

## 🆘 Still Need Help?

If your setup doesn't match the "Working Correctly" scenarios:

1. Open browser console (F12)
2. Copy all error messages
3. Check Network tab for failed requests
4. Take screenshots
5. Review [TROUBLESHOOTING_CMS.md](./TROUBLESHOOTING_CMS.md)

## ⏱️ After Making Changes

Always do these steps:
1. **Save** in Webflow CMS
2. **Publish** the product
3. **Hard refresh** browser (Ctrl+Shift+R or Cmd+Shift+R)
4. **Check console** for new logs
5. **Verify** product appears

---

**Collection ID**: 69158c209e29b59a86d4b534  
**API Endpoint**: `/api/cms/products`  
**Last Updated**: November 13, 2025
