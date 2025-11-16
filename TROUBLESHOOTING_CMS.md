# Troubleshooting CMS Connection

If you see "Failed to load products. Please try again later." on your website, follow these steps to diagnose and fix the issue.

## Quick Checklist

1. **Products Added to CMS**: Ensure you've added at least one product to the Affiliate Products collection in Webflow
2. **Products Published**: Make sure products are published (not in draft mode)
3. **Required Fields**: Each product must have:
   - Name (required)
   - Slug (required)
   - At least one image (recommended)

## Step-by-Step Debugging

### 1. Check if Products Exist in CMS

Open your browser console (F12) and look at the logs:

```
API: Token available: true
API: Fetching products with limit: 100 offset: 0
API: Successfully fetched X products
```

If you see `Successfully fetched 0 products`, it means:
- No products exist in the collection, OR
- All products are in draft mode, OR
- Products are archived

**Solution**: Add products in Webflow CMS and publish them.

### 2. Check API Token

If you see `API: Missing WEBFLOW_CMS_SITE_API_TOKEN`:

**Solution**: 
- Verify `.env` file has `WEBFLOW_CMS_SITE_API_TOKEN=your_token_here`
- Restart your development server after adding the token
- For production, ensure environment variables are set in your deployment platform

### 3. Check API Response

Open browser Network tab (F12 > Network) and filter for `products`:

**200 OK Response**: API is working correctly
- Check console logs for transformation errors
- Verify product data structure

**502 Bad Gateway**: API call to Webflow failed
- Check if API token is valid
- Verify collection ID is correct: `69158c209e29b59a86d4b534`
- Check Webflow API status

**500 Internal Server Error**: Configuration issue
- Missing API token
- Check server logs for details

### 4. Test API Directly

Open this URL in your browser (replace with your actual domain):

```
https://your-domain.com/api/cms/products?limit=10
```

You should see a JSON response like:
```json
{
  "items": [
    {
      "id": "...",
      "fieldData": {
        "name": "Product Name",
        "slug": "product-slug",
        "image-1": { "url": "https://..." },
        ...
      }
    }
  ],
  "pagination": {
    "limit": 10,
    "offset": 0,
    "total": 5
  }
}
```

### 5. Check Product Data Structure

If products load but display incorrectly, check the console for:

```
Transforming item: [Product Name]
```

Common issues:
- **Missing images**: Ensure `image-1` field has a value
- **Missing price**: Add price in the `price` field
- **No affiliate link**: Add URL in `product-offer-link` field

## Common Issues & Solutions

### Issue: "Failed to load products"

**Possible Causes**:
1. No products in CMS
2. All products are drafts
3. API token missing or invalid
4. Network error

**Solutions**:
1. Add and publish products in Webflow
2. Set products to "published" status
3. Verify `.env` has correct token
4. Check network connectivity

### Issue: Products show but no images

**Cause**: Image fields are empty

**Solution**: Add images to `image-1`, `image-2`, etc. fields in Webflow CMS

### Issue: "Buy Now" button missing

**Cause**: No affiliate link set

**Solution**: Add Shopee affiliate link to `product-offer-link` field

### Issue: Price shows as "₱0"

**Cause**: Price field is empty

**Solution**: Add price value to `price` field in CMS

## Verifying CMS Collection ID

The collection ID is hardcoded in the API: `69158c209e29b59a86d4b534`

To verify this is correct:
1. Go to Webflow CMS
2. Open Affiliate Products collection
3. Check the URL - it should contain this ID

If the ID is different, update it in:
- `src/pages/api/cms/products.ts`
- `src/pages/api/cms/products/[productId].ts`

## Environment Variables

Required environment variables:

```bash
# Webflow API Host (optional, uses default if not set)
WEBFLOW_API_HOST=your_api_host

# Webflow CMS API Token (required)
WEBFLOW_CMS_SITE_API_TOKEN=your_token_here
```

### For Development:
Add to `.env` file in project root

### For Production (Cloudflare):
1. Go to Cloudflare Dashboard
2. Select your Worker
3. Go to Settings > Variables
4. Add `WEBFLOW_CMS_SITE_API_TOKEN` as environment variable

## Testing Checklist

- [ ] At least 1 product exists in Affiliate Products collection
- [ ] Product has name and slug
- [ ] Product is published (not draft)
- [ ] Product has at least one image
- [ ] Product has price set
- [ ] Product has affiliate link (for Buy Now button)
- [ ] API token is set in `.env`
- [ ] Development server restarted after adding token
- [ ] Browser console shows no errors
- [ ] Network tab shows 200 response from `/api/cms/products`

## Still Having Issues?

1. **Clear browser cache**: Hard refresh with Ctrl+Shift+R (Cmd+Shift+R on Mac)
2. **Restart dev server**: Stop and start `npm run dev`
3. **Check browser console**: Look for detailed error messages
4. **Check network tab**: See exact API responses
5. **Verify Webflow CMS**: Ensure products are visible in Webflow designer

## Debug Mode

The current code includes extensive console logging. Open your browser console to see:

- When products are being fetched
- How many products were received
- What products are being transformed
- Any errors during the process

## Contact Support

If you've tried all the above and still have issues:

1. Take screenshots of:
   - Browser console (F12 > Console)
   - Network tab (F12 > Network, filter by 'products')
   - Webflow CMS showing your products

2. Note:
   - How many products are in your CMS
   - Whether they're published
   - Any error messages

3. Share this information when seeking help

---

**Last Updated**: November 13, 2025
**Collection ID**: 69158c209e29b59a86d4b534
**API Endpoint**: `/api/cms/products`
