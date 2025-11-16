# 📸 Vercel Deployment - Visual Step-by-Step Guide

This guide shows you exactly what to click and where. Perfect for first-time deployers!

---

## 🎬 Part 1: GitHub Setup

### Screenshot 1: GitHub Desktop (Easiest Method)

**What you'll see:**
```
┌─────────────────────────────────────────┐
│ GitHub Desktop                          │
├─────────────────────────────────────────┤
│ File  Edit  View  Repository  Branch   │
│                                         │
│ [+] Add Local Repository               │ ← Click this
│                                         │
└─────────────────────────────────────────┘
```

1. Open GitHub Desktop
2. Click **File → Add Local Repository**
3. Browse to your project folder
4. Click **Add Repository**

### Screenshot 2: Publish to GitHub

**What you'll see:**
```
┌─────────────────────────────────────────┐
│ Publish repository                      │
├─────────────────────────────────────────┤
│ Name: smartly-sale                      │
│ Description: Shopee Affiliate Site      │
│                                         │
│ ☑ Keep this code private               │
│                                         │
│         [Publish Repository]            │ ← Click this
└─────────────────────────────────────────┘
```

5. Name your repository: `smartly-sale`
6. Add description (optional)
7. Choose public or private
8. Click **Publish Repository**

---

## 🎬 Part 2: Vercel Dashboard

### Screenshot 3: Vercel Homepage

**What you'll see when you log in:**
```
┌─────────────────────────────────────────────┐
│ Vercel                              [Login] │
├─────────────────────────────────────────────┤
│                                             │
│ Your Projects                               │
│                                             │
│  [+ Add New ▼]                              │ ← Click this
│    ├─ Project                               │
│    ├─ Team                                  │
│    └─ Domain                                │
└─────────────────────────────────────────────┘
```

1. Go to https://vercel.com
2. Click **Sign Up** or **Login** (use GitHub account)
3. Click **Add New...** dropdown
4. Select **Project**

### Screenshot 4: Import Git Repository

**What you'll see:**
```
┌─────────────────────────────────────────────────┐
│ Import Git Repository                          │
├─────────────────────────────────────────────────┤
│                                                 │
│ Search repositories...                         │
│                                                 │
│ 📁 smartly-sale                    [Import]    │ ← Click Import
│    github.com/yourusername/smartly-sale        │
│                                                 │
│ 📁 other-repo                      [Import]    │
│ 📁 another-repo                    [Import]    │
│                                                 │
└─────────────────────────────────────────────────┘
```

5. Find your `smartly-sale` repository
6. Click **Import** next to it

### Screenshot 5: Configure Project

**What you'll see:**
```
┌────────────────────────────────────────────────────────┐
│ Configure Project                                      │
├────────────────────────────────────────────────────────┤
│                                                        │
│ Framework Preset: [Astro ▼]                           │ ← Auto-detected
│                                                        │
│ Root Directory: ./                                     │ ← Leave as is
│                                                        │
│ Build Command: npm run build                          │ ← Auto-filled
│                                                        │
│ Output Directory: dist                                │ ← Auto-filled
│                                                        │
│ ▼ Environment Variables                               │ ← Click to expand
│                                                        │
└────────────────────────────────────────────────────────┘
```

7. Verify **Framework Preset** shows **Astro**
8. Leave **Root Directory** as `./`
9. Verify **Build Command** is `npm run build`
10. Verify **Output Directory** is `dist`

### Screenshot 6: Add Environment Variables

**What you'll see after expanding:**
```
┌────────────────────────────────────────────────────────┐
│ Environment Variables                                  │
├────────────────────────────────────────────────────────┤
│                                                        │
│ Key                              Value                │
│ ┌──────────────────────────┐  ┌─────────────────────┐│
│ │ WEBFLOW_CMS_SITE_API_TO │  │ your-token-here     ││ ← Paste token
│ └──────────────────────────┘  └─────────────────────┘│
│                                                   [+]  │ ← Add another
│                                                        │
│ Key                              Value                │
│ ┌──────────────────────────┐  ┌─────────────────────┐│
│ │ WEBFLOW_API_HOST        │  │ https://api.webflo  ││
│ └──────────────────────────┘  └─────────────────────┘│
│                                                        │
└────────────────────────────────────────────────────────┘
```

11. Click **Add** to add variables
12. First variable:
    - **Key:** `WEBFLOW_CMS_SITE_API_TOKEN`
    - **Value:** (paste your Webflow token)
13. Click **Add** again
14. Second variable:
    - **Key:** `WEBFLOW_API_HOST`
    - **Value:** `https://api.webflow.com`

### Screenshot 7: Deploy!

**What you'll see:**
```
┌────────────────────────────────────────────────────────┐
│                                                        │
│                                                        │
│                    [Deploy]                           │ ← Click this!
│                                                        │
│                                                        │
└────────────────────────────────────────────────────────┘
```

15. Click the big **Deploy** button
16. Wait 2-3 minutes...

---

## 🎬 Part 3: Deployment Progress

### Screenshot 8: Building

**What you'll see:**
```
┌────────────────────────────────────────────────────────┐
│ smartly-sale                                           │
├────────────────────────────────────────────────────────┤
│                                                        │
│ 🔄 Building...                                         │
│                                                        │
│ ✅ Installing dependencies                             │
│ ⏳ Running build command                               │
│ ⏳ Uploading to CDN                                    │
│                                                        │
│ View build logs ↓                                      │
│                                                        │
└────────────────────────────────────────────────────────┘
```

**Wait for:**
1. Installing dependencies ✅
2. Running build command ✅
3. Uploading to CDN ✅

### Screenshot 9: Success!

**What you'll see:**
```
┌────────────────────────────────────────────────────────┐
│ 🎉 Deployment Ready                                    │
├────────────────────────────────────────────────────────┤
│                                                        │
│ Your project is now live at:                          │
│                                                        │
│ 🔗 https://smartly-sale.vercel.app                    │ ← Click to visit
│                                                        │
│    [Visit]  [View Logs]  [Assign Domain]             │
│                                                        │
└────────────────────────────────────────────────────────┘
```

17. Click **Visit** to see your live site!
18. Test that products load correctly

---

## 🎬 Part 4: Connect Custom Domain (Optional)

### Screenshot 10: Domain Settings

**What you'll see:**
```
┌────────────────────────────────────────────────────────┐
│ Project Settings                                       │
├────────────────────────────────────────────────────────┤
│ General | Git | Functions | Environment Variables |   │
│ Domains | Analytics | Logs                            │
│         ↑ Click this                                   │
├────────────────────────────────────────────────────────┤
│                                                        │
│ Add domain to smartly-sale                            │
│                                                        │
│ ┌──────────────────────────────────────┐             │
│ │ smartly.sale                         │  [Add]      │ ← Type domain
│ └──────────────────────────────────────┘             │
│                                                        │
└────────────────────────────────────────────────────────┘
```

19. Click **Settings** at the top
20. Click **Domains** tab
21. Type your domain: `smartly.sale`
22. Click **Add**

### Screenshot 11: DNS Configuration

**What you'll see:**
```
┌────────────────────────────────────────────────────────┐
│ Configure DNS for smartly.sale                        │
├────────────────────────────────────────────────────────┤
│                                                        │
│ Add these records to your domain registrar:           │
│                                                        │
│ Type    Name    Value                                 │
│ ────────────────────────────────────────────────────  │
│ A       @       76.76.21.21                           │ ← Copy this
│ CNAME   www     cname.vercel-dns.com                  │ ← Copy this
│                                                        │
│ [Copy DNS Records]                                    │
│                                                        │
└────────────────────────────────────────────────────────┘
```

23. Copy the DNS records shown
24. Go to your domain registrar (GoDaddy, Namecheap, etc.)
25. Add these DNS records there
26. Wait 10-30 minutes

---

## 🎬 Part 5: Domain Registrar (Example: GoDaddy)

### Screenshot 12: GoDaddy DNS Management

**What you'll see in GoDaddy:**
```
┌────────────────────────────────────────────────────────┐
│ smartly.sale - DNS Management                         │
├────────────────────────────────────────────────────────┤
│                                              [+ Add]   │ ← Click this
│                                                        │
│ Type    Name    Value              TTL    Actions     │
│ ──────────────────────────────────────────────────    │
│ (empty - add new records below)                       │
│                                                        │
└────────────────────────────────────────────────────────┘
```

### Screenshot 13: Add A Record

**What you'll see:**
```
┌────────────────────────────────────────────┐
│ Add DNS Record                             │
├────────────────────────────────────────────┤
│                                            │
│ Type:     [A Record ▼]                    │
│                                            │
│ Name:     [@]                             │ ← Use @
│                                            │
│ Value:    [76.76.21.21]                   │ ← From Vercel
│                                            │
│ TTL:      [1 Hour ▼]                      │
│                                            │
│           [Save]  [Cancel]                │
│                                            │
└────────────────────────────────────────────┘
```

27. Click **Add** in DNS Management
28. Select **A Record**
29. Name: `@`
30. Value: `76.76.21.21`
31. Click **Save**

### Screenshot 14: Add CNAME Record

**Repeat for CNAME:**
```
┌────────────────────────────────────────────┐
│ Add DNS Record                             │
├────────────────────────────────────────────┤
│                                            │
│ Type:     [CNAME ▼]                       │
│                                            │
│ Name:     [www]                           │ ← Use www
│                                            │
│ Value:    [cname.vercel-dns.com]          │ ← From Vercel
│                                            │
│ TTL:      [1 Hour ▼]                      │
│                                            │
│           [Save]  [Cancel]                │
│                                            │
└────────────────────────────────────────────┘
```

32. Click **Add** again
33. Select **CNAME**
34. Name: `www`
35. Value: `cname.vercel-dns.com`
36. Click **Save**

---

## 🎬 Part 6: Verification

### Screenshot 15: Vercel Domain Status

**After 10-30 minutes, you'll see:**
```
┌────────────────────────────────────────────────────────┐
│ Domains                                                │
├────────────────────────────────────────────────────────┤
│                                                        │
│ smartly.sale                                          │
│ ✅ Valid Configuration                                 │ ← Success!
│ 🔒 SSL Certificate: Active                            │
│                                                        │
│ www.smartly.sale                                      │
│ ✅ Valid Configuration                                 │
│ 🔒 SSL Certificate: Active                            │
│                                                        │
└────────────────────────────────────────────────────────┘
```

37. Check back in Vercel Domains tab
38. Wait for green checkmarks ✅
39. SSL certificate issued automatically 🔒

### Screenshot 16: Your Live Site!

**Visit your domain and see:**
```
┌────────────────────────────────────────────────────────┐
│ 🌐 https://smartly.sale                        🔒     │
├────────────────────────────────────────────────────────┤
│                                                        │
│              🛍️ smartly.sale                          │
│                                                        │
│     Discover Viral Shopee Finds                       │
│     [Shop Now]                                        │
│                                                        │
│     [Product images loading...]                       │
│                                                        │
└────────────────────────────────────────────────────────┘
```

🎉 **You're live!**

---

## 📊 What Each Icon Means

**During deployment:**
- 🔄 = In progress
- ⏳ = Waiting
- ✅ = Complete
- ❌ = Error

**Domain status:**
- ⏳ = DNS propagating (wait)
- ✅ = Working correctly
- ⚠️ = Configuration issue
- 🔒 = SSL secured

---

## 🆘 Troubleshooting Visual Guide

### Problem: Build Failed

**What you'll see:**
```
┌────────────────────────────────────────────┐
│ ❌ Build Failed                            │
├────────────────────────────────────────────┤
│                                            │
│ View logs for details                     │
│ [View Full Logs]                          │ ← Click this
└────────────────────────────────────────────┘
```

**Fix:** Check environment variables are correct

### Problem: Products Not Loading

**What you'll see in browser console (F12):**
```
❌ Failed to fetch products
❌ 401 Unauthorized
```

**Fix:** Check WEBFLOW_CMS_SITE_API_TOKEN is correct

---

## ✅ Success Checklist

After following this guide, you should see:

- ✅ Green checkmarks in Vercel dashboard
- ✅ Live site at your domain
- ✅ Products loading from CMS
- ✅ Images displaying
- ✅ All buttons working
- ✅ Mobile view looking good
- ✅ SSL padlock 🔒 in browser

---

**Congratulations! You're now live! 🚀**

**Next:** Add more products in Webflow CMS and start marketing!
