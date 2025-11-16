# SmartFinds PH - Quick Reference Card

## 🚀 Essential Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🔗 Important URLs (Local Dev)

- **Homepage**: http://localhost:4321/
- **Test API Connection**: http://localhost:4321/api/cms/test
- **Get All Products**: http://localhost:4321/api/cms/products
- **Product Detail**: http://localhost:4321/product/[slug]

## 📦 CMS Quick Facts

**Collection ID**: `69158c209e29b59a86d4b534`  
**Collection Name**: Affiliate Products  
**Total Fields**: 43  
**Required Fields**: name, slug  

## 🎯 Key File Locations

```
src/
├── components/
│   ├── FeaturedProducts.tsx    # Homepage product grid
│   ├── ProductDetail.tsx       # Single product page
│   ├── Navbar.tsx             # Navigation
│   └── Footer.tsx             # Footer
├── pages/
│   ├── index.astro            # Homepage
│   ├── product/[slug].astro   # Product pages
│   └── api/cms/
│       ├── test.ts            # Test endpoint
│       ├── products.ts        # List products
│       └── products/[id].ts   # Get single product
├── types/
│   └── product.ts             # TypeScript types
└── styles/
    └── global.css             # Global styles
```

## 🎨 Brand Colors

```css
--primary: #FF6600        /* Orange */
--background: #FFFFFF     /* White */
--foreground: #333333     /* Dark gray */
--muted: #F8F8F8         /* Light gray */
```

## 📝 Adding a Product (Quick)

1. Go to Webflow CMS → Affiliate Products
2. Click "+ New Product"
3. Fill required:
   - Name ✅
   - Slug ✅
4. Fill recommended:
   - Image 1 ✅
   - Price ✅
   - Product Offer Link ✅
5. Click "Publish"
6. Refresh website

## 🐛 Quick Troubleshooting

| Problem | Quick Fix |
|---------|-----------|
| No products showing | Add & publish products in CMS |
| "Failed to load" | Check `.env` has API token |
| Images not showing | Add image to `image-1` field |
| No "Buy Now" button | Add URL to `product-offer-link` |
| Changes not visible | Hard refresh (Ctrl+Shift+R) |

## 🔧 Environment Variables

```bash
# .env file
WEBFLOW_API_HOST="https://api-cdn.webflow.com/v2"
WEBFLOW_CMS_SITE_API_TOKEN="your_token_here"
```

## 📊 Product Card Fields (Homepage)

Displays:
- Main image (`image-1`)
- Name
- Price + Currency
- Discount badge
- Stock status
- Shop name + location
- Star rating
- "View Details" button
- "Buy Now" button (if link exists)

## 📄 Product Detail Page Fields

Shows:
- All images (`image-1` to `image-10`)
- All videos (`video-1-url` to `video-11-url`)
- Complete product info
- Shop details
- "Buy Now on Shopee" button

## 🎯 Next 3 Steps

1. **Add 5 products** to CMS
2. **Run** `npm run dev`
3. **Visit** http://localhost:4321/

## 📚 Full Documentation

- **Setup**: [QUICK_START.md](./QUICK_START.md)
- **CMS Details**: [CMS_SETUP_GUIDE.md](./CMS_SETUP_GUIDE.md)
- **Troubleshooting**: [TROUBLESHOOTING_CMS.md](./TROUBLESHOOTING_CMS.md)
- **Full Guide**: [README.md](./README.md)
- **Status**: [FINAL_STATUS.md](./FINAL_STATUS.md)

## 🔍 Health Check

Run these to verify everything works:

```bash
# 1. Check API token
curl http://localhost:4321/api/cms/test

# 2. Check products
curl http://localhost:4321/api/cms/products

# 3. Check build
npm run build
```

All should return success! ✅

## 💰 Monetization Paths

1. **Shopee Affiliate**: Commission on sales
2. **Google AdSense**: Display ads
3. **Facebook Ads**: Drive traffic
4. **Sponsored Posts**: Partner with brands

## 📱 Social Media

Update these in `src/components/Footer.tsx`:
- Facebook URL
- TikTok URL
- Instagram URL (optional)

## ⚡ Performance Tips

- Images lazy-loaded ✅
- API responses cached (5 min) ✅
- Mobile-first design ✅
- Fast loading times ✅

## 🎉 You're Set!

**Start**: `npm run dev`  
**Add Products**: Webflow CMS  
**Test**: Open localhost  
**Deploy**: When ready  

---

**Need Help?** See [TROUBLESHOOTING_CMS.md](./TROUBLESHOOTING_CMS.md)  
**Ready to Launch?** See [FINAL_STATUS.md](./FINAL_STATUS.md)
