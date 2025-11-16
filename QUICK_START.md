# SmartFinds PH - Quick Start Guide

Welcome to SmartFinds PH! This guide will get you up and running quickly.

## 🚀 What You Have

A complete, production-ready Shopee affiliate marketing website with:

✅ **Home page** with hero, featured products, and popular posts  
✅ **Blog page** with search and category filtering  
✅ **Single post template** with affiliate product cards  
✅ **About page** with brand story and disclosure  
✅ **Contact form** for business inquiries  
✅ **Categories page** for browsing products  
✅ **Privacy policy** and **Terms of service** pages  
✅ **Mobile-responsive design** with sticky navigation  
✅ **SEO optimized** with meta tags and OpenGraph  
✅ **Ad placeholders** ready for monetization  

## 🎨 Design Features

- **Color Scheme**: Orange (#FF6600) primary, white background, gray text
- **Typography**: Clean, modern fonts from Webflow design system
- **Components**: Rounded cards, hover effects, smooth transitions
- **Mobile**: Sticky footer bar for easy navigation
- **Performance**: Fast loading, optimized for Facebook Ads traffic

## 📁 Key Pages

| Page | URL | Purpose |
|------|-----|---------|
| Home | `/` | Hero, featured products, popular posts |
| Blog | `/blog` | All posts with filters |
| Single Post | `/post/[slug]` | Product review with affiliate links |
| Categories | `/categories` | Browse by category |
| About | `/about` | Brand story |
| Contact | `/contact` | Business inquiries |
| Privacy | `/privacy` | Privacy policy |
| Terms | `/terms` | Terms of service |

## 🛠️ Development

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🎯 Next Steps

### 1. Customize Content (5 minutes)

Currently using placeholder data. Update these components:

**Components to update**:
- `src/components/FeaturedProducts.tsx` - Featured product cards
- `src/components/PopularPosts.tsx` - Top 3 blog posts
- `src/components/BlogList.tsx` - All blog posts
- `src/components/PostContent.tsx` - Single post content

**Quick edit**: Search for "Mock data" comments in each file.

### 2. Add Shopee Affiliate Links (10 minutes)

1. Sign up: https://affiliate.shopee.ph
2. Get your affiliate ID
3. Generate links for products
4. Replace placeholder URLs in components

**Example link**:
```
https://shp.ee/YOUR_CODE
```

### 3. Connect CMS (Optional)

For dynamic content management, see **CMS_SETUP_GUIDE.md**

Create 3 collections:
- Posts
- Categories  
- Affiliate Products

### 4. Add Analytics (5 minutes)

**Google Analytics**:
Add to `src/layouts/main.astro` in `<head>`:
```html
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

**Facebook Pixel**:
```html
<script>
  !function(f,b,e,v,n,t,s)
  {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
  n.callMethod.apply(n,arguments):n.queue.push(arguments)};
  if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
  n.queue=[];t=b.createElement(e);t.async=!0;
  t.src=v;s=b.getElementsByTagName(e)[0];
  s.parentNode.insertBefore(t,s)}(window, document,'script',
  'https://connect.facebook.net/en_US/fbevents.js');
  fbq('init', 'YOUR_PIXEL_ID');
  fbq('track', 'PageView');
</script>
```

### 5. Add Display Ads (10 minutes)

Replace ad placeholders in:
- `src/pages/index.astro` (3 spots)
- `src/pages/blog.astro` (2 spots)
- `src/components/PostContent.tsx` (2 spots)

**Google AdSense code**:
```html
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXX"
     crossorigin="anonymous"></script>
<ins class="adsbygoogle"
     style="display:block"
     data-ad-client="ca-pub-XXXXXXX"
     data-ad-slot="XXXXXXX"
     data-ad-format="auto"></ins>
<script>
     (adsbygoogle = window.adsbygoogle || []).push({});
</script>
```

## 💰 Monetization Setup

### Shopee Affiliate (Primary Revenue)

1. **Sign Up**: https://affiliate.shopee.ph
2. **Get Approved**: Usually 1-3 business days
3. **Generate Links**: Use the Shopee Affiliate dashboard
4. **Track Performance**: Monitor clicks and conversions

**Expected Commission**: 3-8% per sale

### Facebook Ads (Traffic Source)

1. **Create Business Manager**: business.facebook.com
2. **Set Up Pixel**: Add to website (see above)
3. **Create Campaign**: Traffic objective
4. **Target Audience**: Philippines, ages 18-45, shopping interests
5. **Budget**: Start with ₱500/day

See **MONETIZATION_GUIDE.md** for detailed strategy.

### Display Ads (Secondary Revenue)

1. **Google AdSense**: Apply at google.com/adsense
2. **Requirements**: 20+ posts, privacy policy, contact page
3. **Setup**: Add ad code to placeholders
4. **Optimize**: Test different placements

**Expected RPM**: ₱50-200 per 1000 views

## 📊 Success Metrics

### Month 1 Goals
- [ ] 20 published posts
- [ ] 10,000 monthly visitors
- [ ] ₱10,000-30,000 revenue
- [ ] 100+ affiliate clicks

### Month 3 Goals
- [ ] 50 published posts
- [ ] 30,000 monthly visitors
- [ ] ₱30,000-60,000 revenue
- [ ] 500+ affiliate clicks

### Month 6 Goals
- [ ] 100 published posts
- [ ] 50,000+ monthly visitors
- [ ] ₱60,000-150,000 revenue
- [ ] 1000+ affiliate clicks

## 📝 Content Strategy

### Post Ideas (Start Here)

1. **Top 5 Budget Gadgets Under ₱500**
2. **Must-Have Funny T-Shirts for Filipinos**
3. **Best Korean Skincare Products in Shopee**
4. **Aesthetic Room Decor Ideas Under ₱1000**
5. **Top 10 Kitchen Gadgets for Filipino Homes**
6. **Wireless Earbuds Under ₱1500**
7. **Trendy Sneakers for Men and Women 2025**
8. **Fitness Equipment for Home Workouts**
9. **Back to School Essentials Under ₱2000**
10. **Valentine's Gift Ideas from Shopee**

### Publishing Schedule

- **Monday**: Product roundup (Top 5/10 lists)
- **Wednesday**: Category deep-dive
- **Friday**: Trending/viral products

**Consistency is key!** 2-3 posts per week minimum.

## 🎯 Facebook Ads Quick Setup

### Campaign Settings
- **Objective**: Traffic
- **Budget**: ₱500/day
- **Optimization**: Landing Page Views

### Targeting
- **Location**: Philippines
- **Age**: 18-45
- **Interests**: Shopee, Online Shopping, Fashion, Electronics

### Ad Creative
- **Format**: Carousel (3-5 products)
- **Image**: 1200x628px
- **Headline**: "Top 5 [Category] Under ₱[Price]"
- **Text**: Hook + benefit + urgency
- **CTA**: "Learn More"

See **MONETIZATION_GUIDE.md** for templates and optimization tips.

## 🔧 Customization

### Change Colors

Edit `generated/webflow.css`:
- Primary orange: Search for `#FF6600` or `#ea5820`
- Update color variables

### Update Logo

Replace in `src/components/Navbar.tsx` and `src/components/Footer.tsx`:
```tsx
<div className="w-10 h-10 bg-[#FF6600] rounded-lg flex items-center justify-center">
  <span className="text-white font-bold text-xl">SF</span>
</div>
```

### Add Social Links

Update `src/components/Footer.tsx`:
- Facebook: Replace `https://facebook.com`
- TikTok: Replace `https://tiktok.com`
- Email: Replace `hello@smartfindsph.com`

## 📚 Documentation

- **README.md** - Project overview and structure
- **CMS_SETUP_GUIDE.md** - Connect to Webflow CMS
- **MONETIZATION_GUIDE.md** - Revenue strategies and Facebook Ads
- **QUICK_START.md** - This file

## ⚡ Performance Tips

1. **Optimize Images**:
   - Use WebP format
   - Max 500KB file size
   - 1200px width for featured images

2. **Lazy Load**:
   - Images below fold
   - Ad scripts

3. **Caching**:
   - Already configured for Cloudflare
   - Automatic edge caching

4. **Mobile Speed**:
   - Test with Google PageSpeed Insights
   - Aim for 90+ score

## 🆘 Troubleshooting

### Build Errors
```bash
# Clear cache and rebuild
rm -rf node_modules dist .astro
npm install
npm run build
```

### Links Not Working
- Check `baseUrl` import in components
- Ensure using `${baseUrl}/page` format

### Images Not Showing
- Check image URLs
- Ensure proper file paths
- Test in both dev and production

## 📧 Support

Questions? Need help?
- **Email**: hello@smartfindsph.com
- **Issues**: Check documentation first
- **Updates**: Pull latest from repository

## 🎉 Launch Checklist

Before going live:
- [ ] Update all placeholder content
- [ ] Add real affiliate links
- [ ] Install analytics (GA + Facebook Pixel)
- [ ] Test all links on mobile and desktop
- [ ] Add at least 10 quality posts
- [ ] Set up Google Search Console
- [ ] Create social media accounts
- [ ] Prepare launch Facebook Ad campaign
- [ ] Test contact form
- [ ] Review privacy policy and terms

---

## 🚀 Ready to Launch!

You're all set! Focus on creating great content and driving traffic through Facebook Ads. The affiliate commissions will follow.

**Pro Tip**: Start with 10 solid posts, then launch your first Facebook Ad campaign with a ₱500/day budget targeting one of your best posts.

Good luck with SmartFinds PH! 🇵🇭💰

---

**Need more help?** Read the detailed guides:
- CMS_SETUP_GUIDE.md for content management
- MONETIZATION_GUIDE.md for revenue strategies
