# ✅ Vercel Deployment Checklist

Use this quick checklist to deploy your smartly.sale site.

---

## Before You Start
- [ ] GitHub account created
- [ ] Vercel account created (vercel.com)
- [ ] Webflow CMS API token ready
- [ ] At least 5-10 products added in Webflow CMS
- [ ] Products published in Webflow

---

## Step 1: GitHub Setup (5 minutes)
- [ ] Code pushed to GitHub repository
- [ ] Repository is accessible (public or private)
- [ ] Main branch exists

---

## Step 2: Vercel Import (2 minutes)
- [ ] Logged into Vercel
- [ ] Clicked "Add New → Project"
- [ ] Connected GitHub account
- [ ] Selected smartly-sale repository
- [ ] Clicked Import

---

## Step 3: Configuration (3 minutes)
- [ ] Framework: Astro (auto-detected)
- [ ] Build Command: `npm run build`
- [ ] Output Directory: `dist`
- [ ] Environment variables added:
  - [ ] `WEBFLOW_CMS_SITE_API_TOKEN` = (your token)
  - [ ] `WEBFLOW_API_HOST` = `https://api.webflow.com`
- [ ] Clicked Deploy

---

## Step 4: Wait for Deployment (2-3 minutes)
- [ ] Build started
- [ ] Build completed successfully
- [ ] Deployment live
- [ ] Visited the `.vercel.app` URL

---

## Step 5: Test Your Site
- [ ] Homepage loads
- [ ] Products display correctly
- [ ] Product images show
- [ ] Product detail pages work
- [ ] "Shop Now" buttons work
- [ ] Navigation works
- [ ] Footer loads
- [ ] Mobile view looks good
- [ ] Shopee affiliate links work

---

## Step 6: Domain Setup (Optional, 30 minutes)
- [ ] Decided on domain strategy:
  - [ ] Use free Vercel subdomain (smartly.vercel.app)
  - [ ] Connect custom domain (smartly.sale)
- [ ] If custom domain:
  - [ ] Added domain in Vercel Settings → Domains
  - [ ] Updated DNS records at domain registrar
  - [ ] Waited for DNS propagation (10-30 min)
  - [ ] SSL certificate issued automatically
  - [ ] Verified domain works

---

## Step 7: SEO Setup
- [ ] Submitted site to Google Search Console
- [ ] Created and submitted sitemap
- [ ] Verified meta tags on all pages
- [ ] Checked Open Graph images

---

## Step 8: Analytics (Optional)
- [ ] Set up Vercel Analytics (free tier)
- [ ] Added Google Analytics (optional)
- [ ] Set up Shopee tracking (for commissions)

---

## Step 9: Content
- [ ] Added 10-20 quality products in Webflow CMS
- [ ] All products have images (3-10 per product)
- [ ] All products have Shopee affiliate links
- [ ] Products categorized properly
- [ ] Pricing and stock info accurate

---

## Step 10: Launch! 🚀
- [ ] Final mobile test
- [ ] Final desktop test
- [ ] All links tested
- [ ] Shared on social media
- [ ] Started Facebook Ads (optional)

---

## Ongoing Maintenance

### Weekly
- [ ] Add new trending products
- [ ] Update out-of-stock items
- [ ] Check affiliate link performance
- [ ] Review analytics

### Monthly
- [ ] Analyze best-performing products
- [ ] Update meta descriptions
- [ ] Remove low-performing products
- [ ] Check for broken links

---

## Common Issues & Fixes

### ❌ Products not loading
**Fix:** Check environment variables in Vercel Settings

### ❌ Images not showing
**Fix:** Verify images are published in Webflow CMS

### ❌ Build failed
**Fix:** Check build logs in Vercel dashboard

### ❌ Domain not working
**Fix:** Wait 30 min, verify DNS records

### ❌ Slow performance
**Fix:** Optimize images, check Vercel Analytics

---

## Support Resources

- 📖 Full guide: `VERCEL_DEPLOYMENT_GUIDE.md`
- 🐛 Troubleshooting: `TROUBLESHOOTING_CMS.md`
- 💰 Monetization: `MONETIZATION_GUIDE.md`
- 📊 CMS Setup: `CMS_SETUP_GUIDE.md`

---

**Estimated Total Time:** 20-30 minutes (excluding DNS wait time)

**Result:** Fully functional, SEO-optimized affiliate site! 🎉
