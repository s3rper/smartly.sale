# 🚀 Deploy smartly.sale to Vercel - Complete Guide

Your app is now ready to deploy to Vercel! Follow these steps carefully.

---

## 📋 Prerequisites

Before starting, make sure you have:
- ✅ A GitHub account
- ✅ A Vercel account (free) - Sign up at https://vercel.com
- ✅ Your Webflow CMS API token ready

---

## Step 1: Push Your Code to GitHub

### Option A: Using GitHub Desktop (Easiest)
1. Download and install [GitHub Desktop](https://desktop.github.com/)
2. Click **File → Add Local Repository**
3. Select your project folder
4. Click **Publish repository**
5. Name it `smartly-sale` or similar
6. Choose **Public** or **Private**
7. Click **Publish repository**

### Option B: Using Command Line (Git)
```bash
# Navigate to your project folder
cd /path/to/your/project

# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial deployment setup"

# Create repository on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/smartly-sale.git
git branch -M main
git push -u origin main
```

---

## Step 2: Deploy to Vercel

### A. Connect Your Repository

1. **Go to [Vercel](https://vercel.com)** and log in
2. Click **Add New... → Project**
3. Click **Import Git Repository**
4. **Select your GitHub account** (authorize if needed)
5. **Find and select** your `smartly-sale` repository
6. Click **Import**

### B. Configure Project Settings

On the configuration screen:

**Framework Preset:** Astro (should auto-detect)  
**Root Directory:** `./` (leave as is)  
**Build Command:** `npm run build` (auto-filled)  
**Output Directory:** `dist` (auto-filled)

### C. Add Environment Variables

Click **Environment Variables** and add:

| Name | Value |
|------|-------|
| `WEBFLOW_CMS_SITE_API_TOKEN` | Your Webflow API token |
| `WEBFLOW_API_HOST` | `https://api.webflow.com` |

**How to get your Webflow API token:**
1. Go to Webflow Designer → Site Settings
2. Navigate to **Apps & Integrations**
3. Find your **CMS Site API Token**
4. Copy and paste it into Vercel

### D. Deploy!

1. Click **Deploy**
2. Wait 2-3 minutes for the build to complete
3. 🎉 Your site is live!

---

## Step 3: Connect Your Custom Domain

### Option 1: Use Your Own Domain (smartly.sale)

1. In your Vercel project, click **Settings → Domains**
2. Enter your domain: `smartly.sale`
3. Click **Add**
4. Vercel will show you DNS records to add

**In your domain registrar (GoDaddy, Namecheap, etc.):**

Add these DNS records:
- **Type:** A Record
- **Name:** `@`
- **Value:** `76.76.21.21`

And:
- **Type:** CNAME
- **Name:** `www`
- **Value:** `cname.vercel-dns.com`

5. Wait 10-30 minutes for DNS propagation
6. Vercel will automatically issue an SSL certificate

### Option 2: Use Free Vercel Subdomain

Your app is automatically available at:
```
https://smartly-sale.vercel.app
```

You can customize it:
1. Go to **Settings → Domains**
2. Click on your `.vercel.app` domain
3. Edit to something like: `smartly.vercel.app`

---

## Step 4: Verify Everything Works

1. **Visit your live site**
2. Check that products load from Webflow CMS
3. Test product pages
4. Verify all buttons and links work
5. Test on mobile

### If products don't load:
- Check environment variables are set correctly
- View deployment logs in Vercel dashboard
- Make sure you've published products in Webflow CMS

---

## Step 5: Automatic Deployments

🎉 **Good news!** Every time you push to GitHub, Vercel automatically redeploys.

**To update your site:**
```bash
git add .
git commit -m "Update products"
git push
```

Vercel will rebuild and deploy automatically!

---

## 📊 Monitor Your Site

### Vercel Dashboard provides:
- ✅ Real-time deployment status
- ✅ Analytics (page views, visitors)
- ✅ Performance metrics
- ✅ Error logs
- ✅ Build logs

Access at: https://vercel.com/dashboard

---

## 🔧 Troubleshooting

### Build Failed?
1. Check the build logs in Vercel dashboard
2. Common issues:
   - Missing environment variables
   - Node version mismatch (Vercel uses Node 18 by default)

### Products Not Loading?
1. Verify environment variables are set
2. Check Webflow API token is valid
3. Ensure products are published in Webflow CMS
4. Check browser console for errors

### Domain Not Working?
1. DNS can take up to 48 hours (usually 10-30 min)
2. Verify DNS records are correct
3. Check domain registrar settings

---

## 🎯 Next Steps After Deployment

1. **Add Products in Webflow CMS** (10-20 products)
2. **Test affiliate links** work correctly
3. **Set up Google Analytics** (optional)
4. **Submit to Google Search Console** for SEO
5. **Start marketing!** Facebook Ads, social media, etc.

---

## 🆘 Need Help?

- **Vercel Docs:** https://vercel.com/docs
- **Astro Docs:** https://docs.astro.build
- **Webflow API Docs:** https://developers.webflow.com

---

## 🎉 You're Live!

Congratulations! Your smartly.sale site is now live on Vercel with:
- ✅ Automatic HTTPS/SSL
- ✅ Global CDN (fast worldwide)
- ✅ Automatic deployments
- ✅ Free hosting
- ✅ SEO-optimized (server-side rendering)

**Your products will now rank on Google!** 🚀

---

## Quick Reference Commands

```bash
# Update your site
git add .
git commit -m "Your update message"
git push

# View local preview
npm run dev

# Test production build locally
npm run build
npm run preview
```

---

**Happy selling! 💰**
