#!/usr/bin/env node
/**
 * Shopee Product Auto-Generator -- smartly.sale
 *
 * Primary:  Shopee Affiliate API (requires SHOPEE_AFFILIATE_TOKEN in env)
 * Fallback: Claude claude-sonnet-4-5 + web_search (no token needed)
 *
 * Products are deduplicated by slug then published to Webflow CMS.
 * Runs via GitHub Actions every Sunday at 02:00 UTC (10:00 AM PH).
 *
 * To get SHOPEE_AFFILIATE_TOKEN:
 *   1. Log into https://affiliate.shopee.ph
 *   2. Open DevTools → Network → any /api/v3/ request → Headers
 *   3. Copy the full "Cookie" header value
 *   4. Set SHOPEE_AFFILIATE_TOKEN="<that cookie string>" in .env / GitHub Secret
 */

import Anthropic from '@anthropic-ai/sdk';
import { WebflowClient } from 'webflow-api';

const COLLECTION_ID = '69158c209e29b59a86d4b534';

// ── Shopee Affiliate API ──────────────────────────────────────────────────────

const SHOPEE_LIST_URL = 'https://affiliate.shopee.ph/api/v3/offer/product/list?list_type=0&sort_type=1&page_offset=0&page_limit=50&client_type=1';
const SHOPEE_GQL_URL  = 'https://affiliate.shopee.ph/api/v3/gql?q=productOfferLinks';

const GQL_QUERY = `
query batchGetProductOfferLink(
  $sourceCaller: SourceCaller!
  $productOfferLinkParams: [ProductOfferLinkParam!]!
  $advancedLinkParams: AdvancedLinkParams
){
  productOfferLinks(
    productOfferLinkParams: $productOfferLinkParams
    sourceCaller: $sourceCaller
    advancedLinkParams: $advancedLinkParams
  ) { itemId shopId productOfferLink }
}`;

function chunkArray(arr, size) {
  const out = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

function shopeeImageUrl(hash) {
  if (!hash) return null;
  if (hash.startsWith('http')) return hash;
  return `https://cf.shopee.ph/file/${hash}`;
}

function formatPrice(raw) {
  if (!raw) return null;
  const php = raw / 100000;
  return `₱${php % 1 === 0 ? php.toLocaleString() : php.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function formatSold(n) {
  if (!n) return null;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K sold`;
  return `${n} sold`;
}

async function fetchShopeeProducts(token) {
  const isBearer = token.trim().toLowerCase().startsWith('bearer ');
  const headers = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Referer': 'https://affiliate.shopee.ph/offer/product_selection',
    ...(isBearer ? { Authorization: token } : { Cookie: token }),
  };

  console.log('Fetching products from Shopee Affiliate API...');
  const listResp = await fetch(SHOPEE_LIST_URL, { headers });
  if (!listResp.ok) throw new Error(`Shopee list API returned ${listResp.status}`);

  const listJson = await listResp.json();
  if (listJson?.is_login === false) throw new Error('Shopee: not logged in — SHOPEE_AFFILIATE_TOKEN is expired or invalid');

  const rawProducts = listJson?.data?.list ?? [];
  if (!rawProducts.length) throw new Error('Shopee list API returned 0 products');
  console.log(`  Got ${rawProducts.length} products from Shopee`);

  // Fetch promo links in batches of 10
  const params = rawProducts.map(p => {
    const card   = p?.batch_item_for_item_card_full ?? {};
    const shopId = card.shopid ?? p?.shopid ?? p?.shop_id ?? null;
    return { itemId: Number(p.item_id), shopId: Number(shopId), trace: p.trace ?? '' };
  }).filter(x => Number.isFinite(x.itemId) && Number.isFinite(x.shopId));

  const linkMap = new Map();
  const batches = chunkArray(params, 10);
  console.log(`  Fetching promo links in ${batches.length} batches...`);

  for (const [i, batch] of batches.entries()) {
    const resp = await fetch(SHOPEE_GQL_URL, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        operationName: 'batchGetProductOfferLink',
        query: GQL_QUERY,
        variables: {
          productOfferLinkParams: batch,
          sourceCaller: 'WEB_SITE_CALLER',
          advancedLinkParams: { subId1: '', subId2: '', subId3: '', subId4: '', subId5: '' },
        },
      }),
    });
    if (resp.ok) {
      const json = await resp.json();
      (json?.data?.productOfferLinks ?? []).forEach(r =>
        linkMap.set(`${r.itemId}:${r.shopId}`, r.productOfferLink)
      );
    } else {
      console.warn(`  Batch ${i + 1} failed (${resp.status}), skipping`);
    }
    await new Promise(r => setTimeout(r, 150));
  }

  // Map to Webflow CMS schema
  return rawProducts.map(p => {
    const card   = p?.batch_item_for_item_card_full ?? {};
    const shopId = card.shopid ?? p?.shopid ?? null;
    const key    = `${Number(p.item_id)}:${Number(shopId)}`;
    const link   = linkMap.get(key) ?? null;

    const discount = card.raw_discount ?? 0;
    const name     = card.name ?? `Product ${p.item_id}`;
    const slug     = slugify(name);

    return {
      name,
      slug,
      price:               formatPrice(card.price),
      'original-price':    formatPrice(card.price_before_discount),
      discount:            discount > 0 ? `${discount}% OFF` : null,
      currency:            '₱',
      stock:               'In Stock',
      'sold-text':         formatSold(card.historical_sold),
      'shop-name':         card.shop_name ?? null,
      'shop-location':     'Philippines',
      'shop-rating':       card.item_rating?.rating_star ?? null,
      'image-1':           shopeeImageUrl((card.images ?? [])[0]),
      'product-offer-link': link,
    };
  }).filter(p => p['product-offer-link']); // only keep products with affiliate links
}

// ── Claude + web_search fallback ─────────────────────────────────────────────

function extractBlock(text, tag) {
  const re = new RegExp(`<${tag}>\\s*([\\s\\S]*?)\\s*<\\/${tag}>`, 'i');
  const m  = text.match(re);
  return m ? m[1].trim() : null;
}

async function researchProductsWithClaude(client) {
  const month = new Date().toLocaleString('en-US', { month: 'long' });
  const year  = new Date().getFullYear();

  const system = `You are a product researcher for smartly.sale, a deals and affiliate website for Filipino shoppers. You MUST always end your response with a <PRODUCTS> JSON block containing the exact fields specified. Never skip this block.`;

  const user   = `Search for the best discounted and trending products on Shopee Philippines right now (${month} ${year}).

Search for products across: gadgets/electronics, beauty, home & living, gaming peripherals, fashion accessories.
Find 6-8 products with at least 20% discount from reputable shops.

YOU MUST respond with EXACTLY this format — a <PRODUCTS> tag wrapping a valid JSON array. No other response format is acceptable:

<PRODUCTS>
[
  {
    "name": "Xiaomi Redmi Buds 5 Pro",
    "slug": "xiaomi-redmi-buds-5-pro",
    "price": "₱1,299",
    "original-price": "₱1,999",
    "discount": "35% OFF",
    "currency": "₱",
    "stock": "In Stock",
    "sold-text": "2.3K sold",
    "shop-name": "Xiaomi Official Store PH",
    "shop-location": "Metro Manila, Philippines",
    "shop-rating": 4.8,
    "image-1": "https://cf.shopee.ph/file/sg-11134201-7rd5h-m0abc123456",
    "product-offer-link": "https://shopee.ph/product/123456/789"
  }
]
</PRODUCTS>

Replace the example above with real products you find. The product-offer-link should be a real Shopee.ph URL if found, otherwise use https://shopee.ph/search?keyword=PRODUCT_NAME. Return ONLY the <PRODUCTS> block with nothing after it.`;

  const MODEL = 'claude-sonnet-4-5';
  const MAX_TOKENS = 8000;
  const messages = [{ role: 'user', content: user }];
  const allText  = [];
  let conts = 0;

  console.log('Calling Claude with web_search to research Shopee products...');
  let response = await client.messages.create({
    model: MODEL, max_tokens: MAX_TOKENS, system,
    tools: [{ type: 'web_search_20250305', name: 'web_search' }],
    messages,
  });

  while (true) {
    allText.push(...response.content.filter(b => b.type === 'text').map(b => b.text));
    console.log(`  stop_reason: ${response.stop_reason}`);
    if (response.stop_reason === 'end_turn') break;
    if (response.stop_reason === 'pause_turn' && ++conts <= 5) {
      messages.push({ role: 'assistant', content: response.content });
      response = await client.messages.create({
        model: MODEL, max_tokens: MAX_TOKENS, system,
        tools: [{ type: 'web_search_20250305', name: 'web_search' }],
        messages,
      });
      continue;
    }
    break;
  }

  const fullText   = allText.join('\n');
  const raw        = extractBlock(fullText, 'PRODUCTS');
  if (!raw) throw new Error('No <PRODUCTS> block found in Claude response');
  const products = JSON.parse(raw);
  if (!Array.isArray(products) || !products.length) throw new Error('PRODUCTS block was empty');
  console.log(`  Found ${products.length} products from Claude`);
  return products;
}

// ── Slug helper ───────────────────────────────────────────────────────────────

function slugify(text) {
  return (text || '')
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 80);
}

// ── Webflow helpers ───────────────────────────────────────────────────────────

async function fetchExistingSlugs(webflow) {
  try {
    const res   = await webflow.collections.items.listItemsLive(COLLECTION_ID, { limit: 100, offset: 0 });
    const slugs = new Set((res.items ?? []).map(i => i.fieldData?.slug).filter(Boolean));
    console.log(`Existing CMS items: ${res.items?.length ?? 0} (${slugs.size} slugs)`);
    return slugs;
  } catch (err) {
    console.warn(`  Could not fetch existing slugs: ${err.message}`);
    return new Set();
  }
}

async function createProduct(webflow, product, existingSlugs) {
  let slug = product.slug ? slugify(product.slug) : slugify(product.name);
  if (!slug) slug = 'product-' + Date.now();

  if (existingSlugs.has(slug)) {
    slug = `${slug}-${new Date().toISOString().slice(0, 10)}`;
    if (existingSlugs.has(slug)) {
      console.log(`  ⚠️  Skip duplicate: ${product.name}`);
      return false;
    }
  }

  const fieldData = { name: product.name, slug, _draft: false, _archived: false };

  if (product.price)              fieldData['price']              = product.price;
  if (product.discount)           fieldData['discount']           = product.discount;
  if (product.currency)           fieldData['currency']           = product.currency;
  if (product.stock)              fieldData['stock']              = product.stock;
  if (product['sold-text'])       fieldData['sold-text']          = product['sold-text'];
  if (product['shop-name'])       fieldData['shop-name']          = product['shop-name'];
  if (product['shop-location'])   fieldData['shop-location']      = product['shop-location'];
  if (typeof product['shop-rating'] === 'number') {
    fieldData['shop-rating'] = Math.min(5, Math.max(1, product['shop-rating']));
  }
  if (product['product-offer-link']) fieldData['product-offer-link'] = product['product-offer-link'];
  if (product['image-1'] && typeof product['image-1'] === 'string' && product['image-1'].startsWith('http')) {
    fieldData['image-1'] = { url: product['image-1'] };
  }

  try {
    await webflow.collections.items.createItem(COLLECTION_ID, { fieldData });
    existingSlugs.add(slug);
    console.log(`  ✅ Created: "${product.name}" → /product/${slug}`);
    return true;
  } catch (err) {
    console.warn(`  ⚠️  Failed "${product.name}": ${err?.body?.message ?? err?.message}`);
    return false;
  }
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  if (!process.env.WEBFLOW_CMS_SITE_API_TOKEN) throw new Error('WEBFLOW_CMS_SITE_API_TOKEN not set');

  const webflow  = new WebflowClient({ accessToken: process.env.WEBFLOW_CMS_SITE_API_TOKEN });
  const shopeeToken = process.env.SHOPEE_AFFILIATE_TOKEN;

  let products;

  if (shopeeToken) {
    // ── Primary: real Shopee affiliate API ──
    console.log('SHOPEE_AFFILIATE_TOKEN found — using Shopee Affiliate API');
    try {
      products = await fetchShopeeProducts(shopeeToken);
      console.log(`  ${products.length} products with affiliate links`);
    } catch (err) {
      console.warn(`Shopee API failed (${err.message}), falling back to Claude web_search`);
      products = null;
    }
  }

  if (!products) {
    // ── Fallback: Claude + web_search ──
    if (!process.env.ANTHROPIC_API_KEY) throw new Error('ANTHROPIC_API_KEY not set (needed for fallback)');
    const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
    products = await researchProductsWithClaude(anthropic);
  }

  console.log('\nFetching existing Webflow CMS products...');
  const existingSlugs = await fetchExistingSlugs(webflow);

  console.log('\nAdding products to Webflow CMS...');
  let added = 0, skipped = 0;
  for (const product of products) {
    const ok = await createProduct(webflow, product, existingSlugs);
    if (ok) added++; else skipped++;
  }

  console.log(`\nDone. Added: ${added} | Skipped (duplicates/errors): ${skipped}`);
}

main().catch(err => {
  console.error('\nProduct generation failed:', err.message);
  process.exit(1);
});
