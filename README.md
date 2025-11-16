# smartly.sale - Shopee Affiliate Website

A modern, responsive affiliate marketing website designed to showcase trending Shopee products and generate ROI through affiliate commissions.

---

## 🚀 DEPLOYMENT READY!

Your site is configured and ready to deploy to Vercel for **FREE hosting with full SEO optimization**!

### 📋 Quick Deploy (20 minutes)

**👉 [START HERE - Follow the Quick Start Guide](./START_HERE.md)**

Everything you need is documented:

| Guide | Purpose | Time |
|-------|---------|------|
| **[START_HERE.md](./START_HERE.md)** | 🚀 Fastest path to deployment | 20 min |
| **[VERCEL_VISUAL_GUIDE.md](./VERCEL_VISUAL_GUIDE.md)** | 📸 Visual step-by-step with screenshots | 25 min |
| **[VERCEL_DEPLOYMENT_GUIDE.md](./VERCEL_DEPLOYMENT_GUIDE.md)** | 📚 Complete detailed instructions | 30 min |
| **[DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md)** | ✅ Quick checklist format | 20 min |
| **[DEPLOYMENT_SUMMARY.md](./DEPLOYMENT_SUMMARY.md)** | 📖 Overview and reference | Read |

**Already familiar with Vercel?** Just:
1. Push to GitHub
2. Import to Vercel
3. Add environment variables
4. Deploy!

---

## ✨ Features

### Core Functionality
- **Home Page**: Hero section with featured products and engaging sections
- **All Products Page**: Complete catalog with search and filtering
- **Product Detail Pages**: Full showcase with image gallery and videos
- **About Page**: Brand story and affiliate disclosure
- **Contact Page**: Business inquiry form

### CMS Integration
- ✅ **Webflow CMS Connected**: 43 fields including:
  - 10 image fields for product photos
  - 11 video URL fields for product demonstrations
  - Pricing, discount, and stock information
  - Shop details (name, location, rating)
  - Affiliate links to Shopee
- ✅ **Dynamic Product Display**: Real-time from CMS
- ✅ **SEO Optimized**: Server-side rendering

### Design & UX
- Clean, minimal, mobile-first design
- Orange (#FF6600) brand color
- Responsive navigation
- Image galleries
- Video embeds
- Trust indicators

### Monetization Ready
- Affiliate product cards with "Shop Now" CTAs
- Optimized for Facebook Ads traffic
- Full SEO and OpenGraph meta tags

---

## 🎯 Purpose

smartly.sale helps Filipino shoppers discover trending Shopee products and deals, generating affiliate commissions through Shopee's affiliate program.

---

## 🚀 Local Development

### Prerequisites
- Node.js 18+ installed
- npm package manager
- Webflow CMS API token

### Setup

1. **Install dependencies:**
```bash
npm install
```

2. **Set up environment variables:**
Create a `.env` file:
```bash
WEBFLOW_CMS_SITE_API_TOKEN=your_token_here
WEBFLOW_API_HOST=https://api.webflow.com
```

3. **Start development server:**
```bash
npm run dev
```

4. **Open browser to** `http://localhost:3000`

---

## 📊 Adding Products

### In Webflow CMS:

1. Go to Webflow CMS → "Affiliate Products" collection
2. Add a new product:
   - **Name** (required): Product title
   - **Slug** (required): URL-friendly name (auto-generated)
   - **Images**: Add 1-10 product photos to `image-1` through `image-10`
   - **Price**: Product price (e.g., "299.00")
   - **Currency**: Currency symbol (e.g., "₱")
   - **Discount**: Discount percentage (e.g., "20% OFF")
   - **Stock**: Stock status (e.g., "100 available")
   - **Shop Name**: Seller name
   - **Shop Location**: Seller location
   - **Shop Rating**: Star rating (1-5)
   - **Product Offer Link**: Shopee affiliate URL ⭐ Important!
   - **Videos**: Add video URLs to `video-1-url` through `video-11-url`
3. **Publish** the product

**Products must be published (not draft) to appear on your site!**

---

## 📁 Project Structure

```
src/
├── components/          # React components
│   ├── Navbar.tsx
│   ├── Footer.tsx
│   ├── Hero.tsx
│   ├── FeaturedProducts.tsx
│   ├── AllProductsList.tsx
│   ├── ProductDetail.tsx
│   ├── WhyChooseUs.tsx
│   ├── HowItWorks.tsx
│   ├── TrustIndicators.tsx
│   └── Newsletter.tsx
├── layouts/
│   └── main.astro      # Main layout with SEO
├── pages/
│   ├── index.astro     # Home page
│   ├── products.astro  # All products page
│   ├── about.astro
│   ├── contact.astro
│   ├── privacy.astro
│   ├── terms.astro
│   ├── product/
│   │   └── [slug].astro     # Dynamic product pages
│   └── api/
│       └── cms/
│           ├── products.ts         # List products API
│           └── products/[productId].ts  # Single product API
└── types/
    └── product.ts      # TypeScript types
```

---

## 🎨 Design System

### Colors
- **Primary Orange**: #FF6600 (brand color)
- **Background**: White with dark mode support
- **Text**: Deep gray hierarchy
- **Borders**: Subtle grays

### Typography
- **Headings**: Inter (bold, large)
- **Body**: Poppins (readable, comfortable)
- **Buttons**: Inter (bold CTAs)

### Components
- Rounded corners (0.63em)
- Soft shadows
- Smooth hover effects
- Mobile-responsive grids

---

## 🔧 Tech Stack

- **Framework**: Astro (server-side rendering)
- **UI Library**: React 19
- **Styling**: Tailwind CSS 4
- **CMS**: Webflow CMS
- **Deployment**: Vercel (recommended) or Cloudflare
- **Type Safety**: TypeScript

---

## 💰 Monetization

### Affiliate Marketing
1. Sign up: [Shopee Affiliate Program](https://affiliate.shopee.ph)
2. Generate affiliate links
3. Add to `product-offer-link` in CMS
4. Track in Shopee dashboard

**Expected Earnings:**
- Month 1: ₱500-2,000
- Month 2: ₱2,000-5,000
- Month 3+: ₱5,000-15,000+

### Marketing Strategy
- Facebook Ads targeting Filipino shoppers
- Social media sharing (TikTok, Facebook)
- SEO optimization for organic traffic
- Product review content

**Full guide:** See [MONETIZATION_GUIDE.md](./MONETIZATION_GUIDE.md)

---

## 📈 SEO Features

✅ Server-side rendering (fast!)  
✅ Meta tags on all pages  
✅ OpenGraph for social sharing  
✅ Clean, semantic HTML  
✅ Mobile-responsive design  
✅ Fast loading times  
✅ Clean URLs with slugs  

**Your products will rank on Google!**

---

## 🆘 Troubleshooting

### "Failed to load products"
1. Check products exist and are published in Webflow CMS
2. Verify `.env` has correct API token
3. See [TROUBLESHOOTING_CMS.md](./TROUBLESHOOTING_CMS.md)

### Products show but no images
- Add images to `image-1`, `image-2`, etc. in CMS

### "Shop Now" button missing
- Add Shopee URL to `product-offer-link` field

### Build errors
- Run `npm run build` to see detailed errors
- Check Node.js version is 18+

---

## 📚 Full Documentation

- **[CMS Setup Guide](./CMS_SETUP_GUIDE.md)** - Configure Webflow CMS
- **[Monetization Guide](./MONETIZATION_GUIDE.md)** - Revenue strategies
- **[Troubleshooting](./TROUBLESHOOTING_CMS.md)** - Fix common issues
- **[Quick Start](./QUICK_START.md)** - Development setup
- **[Quick Reference](./QUICK_REFERENCE.md)** - Common tasks

---

## 🎯 After Deployment

### Week 1: Content
- Add 10-20 quality products
- Ensure all have images and affiliate links
- Test all product pages

### Week 2: Marketing
- Submit to Google Search Console
- Share on social media
- Start Facebook Ads (optional)

### Week 3: Optimize
- Check analytics
- Add best-performing products
- Update SEO descriptions

---

## 🚀 Ready to Deploy?

**👉 [Open START_HERE.md and follow the guide](./START_HERE.md)**

You'll be live in 20 minutes! 🎉

---

## 📧 Support

- **Vercel Docs**: https://vercel.com/docs
- **Astro Docs**: https://docs.astro.build
- **Webflow API**: https://developers.webflow.com

---

Built with ❤️ for Filipino shoppers

**Deployed on Vercel** | **Powered by Webflow CMS** | **Made with Astro**
