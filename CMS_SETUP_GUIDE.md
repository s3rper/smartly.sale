# SmartFinds PH - CMS Setup Guide

This guide will help you connect SmartFinds PH to Webflow CMS for dynamic content management.

## 📋 CMS Collections to Create

### 1. Posts Collection

Create a collection named "Posts" with the following fields:

| Field Name | Field Type | Settings | Required |
|------------|-----------|----------|----------|
| Name | Plain Text | Max 100 chars | Yes |
| Slug | Plain Text | Auto-generate from Name | Yes |
| Featured Image | Image | Max 5MB | Yes |
| Short Description | Plain Text | Max 250 chars | Yes |
| Body Content | Rich Text | No limit | Yes |
| Category | Reference | Categories collection | Yes |
| Publish Date | Date | Include time | Yes |
| Read Time | Plain Text | e.g., "5 min read" | No |
| View Count | Number | Default: 0 | No |
| Meta Description | Plain Text | Max 160 chars for SEO | No |

### 2. Categories Collection

Create a collection named "Categories" with the following fields:

| Field Name | Field Type | Settings | Required |
|------------|-----------|----------|----------|
| Name | Plain Text | Max 50 chars | Yes |
| Slug | Plain Text | Auto-generate from Name | Yes |
| Description | Plain Text | Max 200 chars | No |
| Icon Name | Plain Text | e.g., "smartphone", "shirt" | No |
| Product Count | Number | Auto-calculate if possible | No |

### 3. Affiliate Products Collection

Create a collection named "Affiliate Products" with the following fields:

| Field Name | Field Type | Settings | Required |
|------------|-----------|----------|----------|
| Name | Plain Text | Max 100 chars | Yes |
| Slug | Plain Text | Auto-generate from Name | Yes |
| Product Image | Image | Max 2MB | Yes |
| Description | Plain Text | Max 300 chars | Yes |
| Current Price | Plain Text | e.g., "₱399" | Yes |
| Original Price | Plain Text | e.g., "₱999" | No |
| Discount | Plain Text | e.g., "60% OFF" | No |
| Rating | Number | 0-5 scale | No |
| Review Count | Number | Default: 0 | No |
| Shopee Link | Link | Affiliate URL | Yes |
| Category | Reference | Categories collection | Yes |
| Related Post | Reference | Posts collection | No |
| Featured | Switch | Default: Off | No |
| Is Active | Switch | Default: On | Yes |

## 🔌 Connecting CMS to Components

### Step 1: Set up API Routes

Create these API routes to fetch CMS data:

**File: `src/pages/api/cms/posts.ts`**
```typescript
import type { APIRoute } from 'astro';
import { WebflowClient } from 'webflow-api';

export const GET: APIRoute = async ({ request, locals }) => {
  const token = locals?.runtime?.env?.WEBFLOW_CMS_SITE_API_TOKEN || 
                import.meta.env.WEBFLOW_CMS_SITE_API_TOKEN;
  
  if (!token) return new Response('Missing token', { status: 500 });

  const baseUrl = locals?.runtime?.env?.WEBFLOW_API_HOST || 
                  import.meta.env.WEBFLOW_API_HOST;
  
  const client = new WebflowClient({
    accessToken: token,
    ...(baseUrl && { baseUrl })
  });

  const url = new URL(request.url);
  const category = url.searchParams.get('category');
  const search = url.searchParams.get('search');
  const limit = Math.min(Number(url.searchParams.get('limit') ?? 20), 100);

  try {
    // Replace 'YOUR_POSTS_COLLECTION_ID' with actual collection ID
    const res = await client.collections.items.listItemsLive(
      'YOUR_POSTS_COLLECTION_ID',
      { limit }
    );
    
    return new Response(JSON.stringify(res), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response('Error fetching posts', { status: 502 });
  }
};
```

### Step 2: Update Components to Fetch CMS Data

**Update `FeaturedProducts.tsx`:**

```typescript
const [products, setProducts] = useState<Product[]>([]);

useEffect(() => {
  fetch(`${baseUrl}/api/cms/products?featured=true&limit=4`)
    .then(res => res.json())
    .then(data => {
      const formattedProducts = data.items.map((item: any) => ({
        id: item.id,
        title: item.fieldData.name,
        description: item.fieldData.description,
        price: item.fieldData['current-price'],
        originalPrice: item.fieldData['original-price'],
        discount: item.fieldData.discount,
        rating: item.fieldData.rating || 4.5,
        image: item.fieldData['product-image'].url,
        slug: item.fieldData.slug,
        category: item.fieldData.category?.name || 'General'
      }));
      setProducts(formattedProducts);
    })
    .catch(err => console.error('Error loading products:', err));
}, []);
```

### Step 3: Update Blog List

**Update `BlogList.tsx`:**

```typescript
useEffect(() => {
  const queryParams = new URLSearchParams();
  if (selectedCategory !== 'all') queryParams.set('category', selectedCategory);
  if (searchQuery) queryParams.set('search', searchQuery);
  
  fetch(`${baseUrl}/api/cms/posts?${queryParams.toString()}`)
    .then(res => res.json())
    .then(data => {
      const formattedPosts = data.items.map((item: any) => ({
        id: item.id,
        title: item.fieldData.name,
        excerpt: item.fieldData['short-description'],
        featuredImage: item.fieldData['featured-image'].url,
        slug: item.fieldData.slug,
        category: item.fieldData.category?.fieldData?.slug || 'general',
        publishDate: item.fieldData['publish-date'],
        readTime: item.fieldData['read-time'] || '5 min read'
      }));
      setPosts(formattedPosts);
    });
}, [selectedCategory, searchQuery]);
```

## 📝 Content Strategy

### Sample Posts to Create

1. **Top 5 Budget Gadgets Under ₱500 in 2025**
   - Category: Gadgets & Tech
   - Products: Wireless earbuds, power bank, LED lights, USB cables, phone mount
   - Target: Budget-conscious shoppers

2. **Must-Have Funny T-Shirts for Filipinos**
   - Category: Fashion & Apparel
   - Products: Oversized shirts with Filipino humor designs
   - Target: Young adults, students

3. **Best Korean Skincare Products in Shopee PH**
   - Category: Beauty & Health
   - Products: Cleansers, toners, serums, moisturizers, sunscreen
   - Target: K-beauty enthusiasts

4. **Aesthetic Room Decor Ideas Under ₱1000**
   - Category: Home & Living
   - Products: LED strips, wall art, organizers, fairy lights
   - Target: Students, young professionals

5. **Top 10 Kitchen Gadgets Every Filipino Home Needs**
   - Category: Home & Living
   - Products: Air fryer, rice cooker accessories, storage containers
   - Target: Homemakers, cooking enthusiasts

### SEO Tips for Each Post

1. **Title**: Include keywords like "budget", "best", "top", year
2. **Short Description**: Clear value proposition + call-to-action
3. **Body**: 
   - Start with problem statement
   - List products with detailed descriptions
   - Include pros and cons
   - End with strong CTA
4. **Meta Description**: Focus on benefits, include price range

## 🎯 Affiliate Link Setup

### Shopee Affiliate Program

1. Sign up at: https://affiliate.shopee.ph
2. Get your unique affiliate ID
3. Generate tracking links for each product

### Link Format

Standard Shopee affiliate link structure:
```
https://shp.ee/YOUR_AFFILIATE_CODE
```

Or with parameters:
```
https://shopee.ph/product-name-i.123456789.987654321?
utm_source=smartfindsph&utm_medium=affiliate&utm_campaign=blog_post
```

### Add to CMS

For each product in the Affiliate Products collection:
- Paste the full affiliate link in the "Shopee Link" field
- Test the link to ensure it tracks correctly
- Monitor click-through rates using Shopee's dashboard

## 📊 Tracking & Analytics

### View Count Implementation

Add a page view tracker to `PostContent.tsx`:

```typescript
useEffect(() => {
  // Increment view count
  fetch(`${baseUrl}/api/cms/posts/${postId}/increment-views`, {
    method: 'POST'
  }).catch(err => console.error('Error tracking view:', err));
}, [postId]);
```

### Most Popular Posts

Query posts by view count:
```typescript
fetch(`${baseUrl}/api/cms/posts?sort=views&order=desc&limit=3`)
```

## 🚀 Publishing Workflow

### Before Publishing a Post

- [ ] Add 5+ quality product images
- [ ] Write engaging title (60-70 characters)
- [ ] Create compelling meta description (150-160 characters)
- [ ] Add at least 3 affiliate products
- [ ] Check all affiliate links are working
- [ ] Preview on mobile and desktop
- [ ] Set publish date and time

### After Publishing

- [ ] Share on Facebook page
- [ ] Share on TikTok
- [ ] Post to relevant Facebook groups
- [ ] Monitor initial engagement
- [ ] Respond to comments
- [ ] Track click-through rates

## 💡 Pro Tips

1. **Publish Consistently**: Aim for 2-3 posts per week
2. **Update Popular Posts**: Refresh top-performing content quarterly
3. **Seasonal Content**: Create holiday and sale-specific guides
4. **User Feedback**: Monitor comments and create content based on requests
5. **A/B Testing**: Test different CTAs and product placements
6. **Mobile First**: Ensure all images and layouts work on mobile
7. **Loading Speed**: Optimize images (WebP format, max 500KB)
8. **Internal Linking**: Link related posts to increase session duration

## 🔧 Maintenance

### Weekly Tasks
- Check for broken affiliate links
- Update out-of-stock products
- Review and respond to contact form submissions
- Monitor Google Analytics for top-performing content

### Monthly Tasks
- Analyze conversion rates
- Update pricing on popular products
- Refresh featured products on homepage
- Review and update meta descriptions
- Check site speed and performance

### Quarterly Tasks
- Comprehensive SEO audit
- Content refresh for top 10 posts
- Review and update categories
- Analyze competitor strategies
- Update privacy policy if needed

## 🎨 Image Guidelines

### Product Images
- **Size**: 800x800px minimum
- **Format**: JPG or WebP
- **Quality**: High resolution but optimized for web
- **Background**: Clean white or lifestyle shots
- **Naming**: descriptive-product-name.jpg

### Featured Images
- **Size**: 1200x600px (2:1 ratio)
- **Format**: JPG or WebP
- **Text Overlay**: Avoid text that covers important areas
- **Faces**: Include if relevant (increases engagement)
- **Branding**: Optional SmartFinds PH watermark

## 📱 Facebook Ads Integration

### Campaign Structure

**Campaign 1: Cold Traffic**
- Objective: Traffic
- Audience: Broad Philippines, ages 18-45
- Placements: Facebook Feed, Instagram Feed
- Budget: Start with ₱500/day

**Campaign 2: Retargeting**
- Objective: Conversions
- Audience: Website visitors (last 30 days)
- Placements: All automatic
- Budget: ₱300/day

### Ad Creative Tips

1. **Headline**: "[Number] [Products] Under ₱[Price] | 2025"
2. **Primary Text**: Hook + benefit + urgency
3. **Image/Video**: Product showcase or compilation
4. **CTA Button**: "Learn More" or "Shop Now"

### Landing Page Best Practices

- Direct to specific blog post, not homepage
- Ensure fast loading (< 3 seconds)
- Clear product images above fold
- Multiple "View on Shopee" CTAs
- Mobile-optimized layout

## 🔍 SEO Checklist

### On-Page SEO
- [x] Title tag (50-60 characters)
- [x] Meta description (150-160 characters)
- [x] H1 heading with target keyword
- [x] H2-H3 subheadings for structure
- [x] Alt text for all images
- [x] Internal links to related posts
- [x] External links to authoritative sources
- [x] Readable URL slug

### Technical SEO
- [x] Mobile responsive design
- [x] Fast page load speed
- [x] HTTPS enabled
- [x] XML sitemap
- [x] Schema markup (Product/Article)
- [x] Canonical URLs
- [x] No broken links

### Content SEO
- [x] 1000+ words per post
- [x] Natural keyword placement
- [x] Answer user questions
- [x] Include statistics/numbers
- [x] Use bullet points and lists
- [x] Add call-to-action
- [x] Update publish date regularly

## 💰 Monetization Optimization

### Ad Placement Strategy

**Homepage**
- Top banner: 728x90 (Above Hero)
- Mid-page: 970x250 (After Featured Products)
- Bottom: 728x90 (Before Footer)

**Blog Listing**
- Sidebar: 300x600 (Desktop only)
- In-feed: 336x280 (Every 6 posts)
- Bottom: 728x90

**Single Post**
- Top: 728x90 (Before title)
- Mid-content: 336x280 (After intro paragraph)
- Between products: 300x250
- Bottom: 728x90 (After related posts)

### Affiliate Link Best Practices

1. **Disclosure**: Always mention affiliate relationship
2. **Relevance**: Only promote products you've researched
3. **Variety**: Mix different price points
4. **Tracking**: Use UTM parameters
5. **Testing**: A/B test button text and placement
6. **Updates**: Keep links fresh and working

### Revenue Streams

1. **Shopee Affiliate Commissions**: 3-8% per sale
2. **Display Ads**: CPM-based (AdSense, Ezoic)
3. **Sponsored Posts**: Direct brand partnerships
4. **Product Reviews**: Paid reviews (with disclosure)
5. **Email Marketing**: Newsletter with exclusive deals

## 📧 Email Marketing Setup

### Build Your List

1. **Exit Intent Popup**: "Get exclusive Shopee deals!"
2. **Content Upgrades**: PDF guides, checklists
3. **Footer Signup**: Newsletter subscription
4. **Post CTAs**: "Get deals in your inbox"

### Email Sequence

**Welcome Series**
- Email 1: Welcome + top 5 posts
- Email 2: Best-selling products
- Email 3: How to shop smart tips
- Email 4: Exclusive flash sale alert

**Weekly Newsletter**
- Subject: "This Week's Hottest Shopee Finds 🔥"
- New post roundup
- Featured product of the week
- Flash sale alerts
- Tips and tricks

## 🎯 Conversion Rate Optimization

### Button Copy Testing
- ✅ "View on Shopee"
- ✅ "Check Price"
- ✅ "Shop Now"
- ✅ "Get This Deal"
- ❌ "Click Here"
- ❌ "Learn More" (too vague)

### Trust Signals
- Customer review count
- Star ratings
- "Verified Purchase" badges
- Free shipping mentions
- Money-back guarantees
- "As Seen On" media mentions

### Urgency Tactics
- "Limited Stock"
- "Sale Ends Tonight"
- "2.5K+ Sold This Week"
- "Price Dropped Recently"
- Flash sale countdown timers

## 📈 Analytics to Track

### Key Metrics

**Traffic Metrics**
- Pageviews per day
- Unique visitors
- Bounce rate (aim < 60%)
- Average session duration
- Pages per session

**Engagement Metrics**
- Click-through rate on affiliate links
- Social shares
- Comments per post
- Email signup rate
- Return visitor rate

**Conversion Metrics**
- Affiliate click-through rate (CTR)
- Conversion rate (clicks to sales)
- Average order value
- Revenue per 1000 visitors (RPM)
- Cost per acquisition (CPA)

### Tools to Use

1. **Google Analytics**: Traffic and behavior
2. **Shopee Affiliate Dashboard**: Commission tracking
3. **Facebook Pixel**: Ad performance
4. **Hotjar**: User behavior recording
5. **Google Search Console**: SEO performance

## 🚀 Growth Strategies

### Month 1-3: Foundation
- Publish 20-30 quality posts
- Build core categories
- Set up social media profiles
- Join Filipino shopping groups
- Start basic Facebook Ads (₱500/day)

### Month 4-6: Growth
- Publish 3-4 posts per week
- Launch email newsletter
- Increase ad spend (₱1000/day)
- Partner with micro-influencers
- Guest post on related blogs

### Month 7-12: Scale
- Publish 5+ posts per week
- Hire content writers
- Launch YouTube channel
- Expand to TikTok Shop
- Negotiate better affiliate rates
- Explore sponsored content deals

## 🤝 Partnership Opportunities

### Brands to Approach

1. **Tech Brands**: Xiaomi, Realme, Anker
2. **Beauty Brands**: Korean skincare, local brands
3. **Fashion**: Shopee partner brands
4. **Home & Living**: Lifestyle brands
5. **Food & Beverage**: Snack companies

### Pitch Template

```
Subject: Partnership Opportunity - SmartFinds PH

Hi [Brand Name],

I'm reaching out from SmartFinds PH, a growing product review 
website focused on Shopee Philippines deals. We help 50K+ 
monthly Filipino shoppers discover trending products.

We'd love to feature [Product Name] in an upcoming review post. 
Our typical posts get 5K-10K views and include:
- Detailed product review
- High-quality images
- Social media promotion
- Affiliate/direct purchase links

Would you be interested in collaborating?

Best regards,
[Your Name]
SmartFinds PH
```

---

## 📞 Support & Resources

**Need Help?**
- Email: hello@smartfindsph.com
- Documentation: This guide
- Webflow Support: webflow.com/support
- Shopee Affiliate Support: affiliate.shopee.ph/support

**Useful Links**
- [Shopee Affiliate Dashboard](https://affiliate.shopee.ph)
- [Google Analytics](https://analytics.google.com)
- [Facebook Ads Manager](https://business.facebook.com)
- [Canva for Graphics](https://canva.com)
- [Unsplash for Images](https://unsplash.com)

---

**Last Updated**: January 2025  
**Version**: 1.0

Good luck with SmartFinds PH! 🚀
