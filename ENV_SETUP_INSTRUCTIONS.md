# 🔐 Environment Variables Setup for Shopee AI Assistant

## OpenAI API Integration Setup

Your Shopee AI Assistant now supports **real AI-powered recommendations** using OpenAI's GPT-4-turbo!

---

## 📋 Quick Setup Instructions

### Step 1: Get Your OpenAI API Key

1. Go to [OpenAI Platform](https://platform.openai.com/api-keys)
2. Sign in or create an account
3. Click "Create new secret key"
4. Copy your API key (it starts with `sk-...`)
5. **IMPORTANT**: Save it securely - you won't see it again!

### Step 2: Add to Environment Variables

Add this line to your `.env` file:

```bash
OPENAI_API_KEY=sk-your-actual-api-key-here
```

**Replace** `sk-your-actual-api-key-here` with your actual OpenAI API key.

### Step 3: Restart Your Development Server

```bash
npm run dev
```

---

## ✅ How It Works

### Without OpenAI API Key
- Uses smart keyword matching
- Returns relevant Shopee products
- Basic conversational responses
- Still fully functional!

### With OpenAI API Key (GPT-4-turbo)
- **Intelligent conversation** - Understands context and nuance
- **Personalized responses** - Adapts to user preferences
- **Better recommendations** - AI analyzes requirements
- **Natural dialogue** - Feels like talking to a real shopping assistant
- **Filipino context** - Understands local shopping behavior

---

## 🛍️ Product Database

The system includes a comprehensive **product database** with real Shopee-style products:

### Categories Available:
- 🤖 **Robotics & STEM Toys** (for kids, educational)
- 📱 **Smartphones** (budget to mid-range)
- 🍳 **Air Fryers** (kitchen appliances)
- 👗 **Dresses** (fashion, beach weddings)
- 🎁 **Gifts** (anniversary, birthdays)
- 💻 **Laptops** (work & study)
- 🪑 **Desks** (home office furniture)

### Smart Features:
- **Budget filtering** - Automatically filters by price mentioned
- **Rating-based sorting** - Shows best-rated products first
- **Discount highlighting** - Shows savings from original price
- **Review counts** - Displays social proof
- **Custom recommendations** - AI explains why each product fits

---

## 🔒 Security Notes

### ✅ SAFE:
- API key stored in `.env` file (server-side only)
- Never exposed to frontend/browser
- Protected by `.gitignore`
- API calls made from secure backend route

### ⚠️ NEVER DO:
- Don't commit `.env` to git
- Don't share API keys publicly
- Don't put API key in frontend code
- Don't expose in browser console

---

## 💰 OpenAI API Costs

### GPT-4-turbo Pricing (as of 2025):
- **Input**: ~$0.01 per 1K tokens
- **Output**: ~$0.03 per 1K tokens

### Estimated Costs:
- Per conversation: ~$0.002 - $0.005 (very cheap!)
- 1,000 conversations: ~$2-5
- Monthly for moderate use: ~$10-30

### Cost Optimization:
- Max tokens limited to 200 (keeps responses concise)
- Only AI responses use API (products are from local DB)
- Conversation history kept minimal

---

## 🎯 Testing the Integration

### Test Queries to Try:

1. **Budget-specific**:
   - "Find me a gift under 800 PHP"
   - "Best smartphone under 10,000 PHP"

2. **Occasion-based**:
   - "Anniversary gift for my wife"
   - "Birthday gift for 12-year-old who loves robotics"

3. **Comparison**:
   - "Compare air fryer options"
   - "Which laptop is best value?"

4. **Specific requirements**:
   - "Beach wedding dress, elegant but casual"
   - "Small space home office desk"

---

## 🔧 Troubleshooting

### API Not Working?

1. **Check API Key Format**:
   - Should start with `sk-`
   - No spaces or quotes in `.env`
   - Format: `OPENAI_API_KEY=sk-abc123...`

2. **Check Credits**:
   - Visit [OpenAI Usage](https://platform.openai.com/usage)
   - Ensure you have credits available
   - New accounts get $5 free credits

3. **Check Console Logs**:
   - Open browser DevTools (F12)
   - Look for API errors in console
   - Backend logs will show OpenAI errors

4. **Fallback Mode**:
   - System works WITHOUT OpenAI too!
   - If API fails, uses smart keyword matching
   - Products still show correctly

---

## 📊 Features Breakdown

### Core Functionality (Always Works):
✅ Product search and recommendations
✅ Budget filtering
✅ Category browsing
✅ Product cards with images, prices, ratings
✅ Direct Shopee links
✅ Mobile-responsive design

### Enhanced with OpenAI (When API Key Added):
✨ Natural language understanding
✨ Context-aware responses
✨ Personalized recommendations
✨ Filipino shopping context
✨ Smart follow-up suggestions
✨ Better conversation flow

---

## 🚀 Deployment Notes

### For Cloudflare Workers:

Add environment variable in **wrangler.toml** or Cloudflare dashboard:

```toml
[env.production]
OPENAI_API_KEY = "your-api-key-here"
```

Or in Cloudflare Dashboard:
1. Go to Workers & Pages
2. Select your worker
3. Settings → Variables
4. Add `OPENAI_API_KEY`

### For Vercel:

```bash
vercel env add OPENAI_API_KEY
```

Or in Vercel Dashboard:
1. Project Settings
2. Environment Variables
3. Add `OPENAI_API_KEY`

---

## 📝 Next Steps

### Current Implementation:
✅ OpenAI GPT-4-turbo integration ready
✅ Smart product database with 20+ products
✅ Budget filtering
✅ Category-based search
✅ Secure API key handling
✅ Fallback mode (works without API key)

### Future Enhancements (Optional):
- 🔗 Real Shopee API integration
- 💾 User accounts & saved searches
- 🔔 Price drop alerts (email notifications)
- 📊 Product comparison tables
- 🌟 Wishlist functionality
- 📱 PWA support for mobile app-like experience

---

## 🆘 Need Help?

### Common Issues:

**Q: "AI responses are generic"**
A: Add your OpenAI API key to `.env` for intelligent responses

**Q: "Products not showing"**
A: Check console for errors, ensure API route is working

**Q: "API key error"**
A: Verify format in `.env`: `OPENAI_API_KEY=sk-...` (no quotes)

**Q: "Too expensive?"**
A: System is very cost-efficient (~$0.002 per conversation)

---

## 🎉 You're All Set!

Your Shopee AI Assistant is now powered by:
- 🤖 GPT-4-turbo AI (when API key added)
- 🛍️ Smart product database
- 💬 Natural conversation
- 🎯 Personalized recommendations

Just add your OpenAI API key to `.env` and start shopping! 🚀
