#!/usr/bin/env node
/**
 * Shopee Product Auto-Generator -- smartly.sale
 *
 * Workflow:
 *  1. Use Claude claude-sonnet-4-5 + web_search to research trending/discounted Shopee PH products
 *  2. Generate structured product data matching Webflow CMS schema
 *  3. Deduplicate against existing CMS items
 *  4. Publish new products directly to Webflow CMS
 *
 * Runs via GitHub Actions every Sunday at 02:00 UTC (10:00 AM PH)
 */

import Anthropic from '@anthropic-ai/sdk';
import { WebflowClient } from 'webflow-api';

const COLLECTION_ID = '69158c209e29b59a86d4b534';

// ── Helpers ──────────────────────────────────────────────────────────────────

function extractBlock(text, tag) {
  const re = new RegExp(`<${tag}>\\s*([\\s\\S]*?)\\s*<\\/${tag}>`, 'i');
  const m = text.match(re);
  return m ? m[1].trim() : null;
}

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 80);
}

// ── Step 1: Research products with Claude + web_search ───────────────────────

async function researchProducts(client) {
  const now = new Date();
  const month = now.toLocaleString('en-US', { month: 'long' });
  const year  = now.getFullYear();

  const system = `You are a product researcher for smartly.sale, a deals and affiliate website for Filipino shoppers. Your job is to find real, currently available Shopee Philippines products with genuine discounts and high sales. Focus on value-for-money products that Filipino consumers love.`;

  const user = `Search for the best discounted and trending products on Shopee Philippines right now (${month} ${year}).

Search for these categories:
- Gadgets & electronics (earbuds, phone accessories, smart devices)
- Beauty & personal care
- Home & living
- Gaming peripherals
- Fashion accessories

Find 8 products total that:
- Have significant discounts (at least 20% OFF or notable price drops)
- Are from reputable shops with high ratings
- Are actually available and in-stock on Shopee Philippines

RESPONSE FORMAT — use these exact tags:

<PRODUCTS>
[
  {
    "name": "Full product name (concise, under 80 chars)",
    "slug": "kebab-case-url-slug",
    "price": "₱X,XXX",
    "original-price": "₱X,XXX",
    "discount": "XX% OFF",
    "currency": "₱",
    "stock": "In Stock",
    "sold-text": "X.XK sold",
    "shop-name": "Shop Name",
    "shop-location": "City, Philippines",
    "shop-rating": 4.8,
    "image-1": "https://cf.shopee.ph/file/... or other direct image URL",
    "product-offer-link": "https://shopee.ph/..."
  }
]
</PRODUCTS>

Important:
- Use real Shopee.ph product URLs if found via search
- For image-1, use a direct CDN image URL if available, otherwise omit the field
- shop-rating must be a number between 1 and 5
- slug must be unique kebab-case, no special characters`;

  const MODEL      = 'claude-sonnet-4-5';
  const MAX_TOKENS = 8000;
  const MAX_CONTINUATIONS = 5;

  const messages     = [{ role: 'user', content: user }];
  const allTextBlocks = [];
  let   continuations = 0;

  console.log('Calling Claude with web_search to research Shopee products...');

  let response = await client.messages.create({
    model: MODEL,
    max_tokens: MAX_TOKENS,
    system,
    tools: [{ type: 'web_search_20250305', name: 'web_search' }],
    messages,
  });

  while (true) {
    const textBlocks = response.content.filter(b => b.type === 'text');
    allTextBlocks.push(...textBlocks);

    console.log(`  stop_reason: ${response.stop_reason} | text blocks: ${textBlocks.length}`);

    if (response.stop_reason === 'end_turn') break;

    if (response.stop_reason === 'pause_turn') {
      if (++continuations > MAX_CONTINUATIONS) {
        console.warn('  Max continuations reached, using text collected so far');
        break;
      }
      messages.push({ role: 'assistant', content: response.content });
      response = await client.messages.create({
        model: MODEL,
        max_tokens: MAX_TOKENS,
        system,
        tools: [{ type: 'web_search_20250305', name: 'web_search' }],
        messages,
      });
      continue;
    }

    console.warn(`  Unexpected stop_reason: ${response.stop_reason}, using text collected so far`);
    break;
  }

  const fullText = allTextBlocks.map(b => b.text).join('\n');

  console.log(`  Total response length: ${fullText.length} chars`);
  console.log(`  Has <PRODUCTS>: ${fullText.includes('<PRODUCTS>')}`);

  const productsRaw = extractBlock(fullText, 'PRODUCTS');
  if (!productsRaw) throw new Error('No <PRODUCTS> block found in response');

  let products;
  try {
    products = JSON.parse(productsRaw);
  } catch (err) {
    throw new Error(`Failed to parse PRODUCTS JSON: ${err.message}\n\nBlock:\n${productsRaw.slice(0, 400)}`);
  }

  if (!Array.isArray(products) || products.length === 0) {
    throw new Error('PRODUCTS block parsed but contained no items');
  }

  console.log(`  Found ${products.length} products from Claude`);
  return products;
}

// ── Step 2: Fetch existing slugs from Webflow ─────────────────────────────────

async function fetchExistingSlugs(webflow) {
  try {
    const res = await webflow.collections.items.listItemsLive(COLLECTION_ID, {
      limit: 100,
      offset: 0,
    });
    const items = (res.items ?? []);
    const slugs = new Set(items.map(item => item.fieldData?.slug).filter(Boolean));
    console.log(`Existing CMS items: ${items.length} (${slugs.size} unique slugs)`);
    return slugs;
  } catch (err) {
    console.warn(`  Warning: Could not fetch existing slugs: ${err.message}`);
    return new Set();
  }
}

// ── Step 3: Create items in Webflow CMS ───────────────────────────────────────

async function createProduct(webflow, product, existingSlugs) {
  // Build a clean slug
  let slug = product.slug
    ? slugify(product.slug)
    : slugify(product.name);

  if (!slug) slug = 'product-' + Date.now();

  // Deduplicate
  if (existingSlugs.has(slug)) {
    const date = new Date().toISOString().slice(0, 10);
    slug = `${slug}-${date}`;
    if (existingSlugs.has(slug)) {
      console.log(`  ⚠️  Skipping duplicate: ${product.name} (slug: ${slug})`);
      return false;
    }
  }

  // Build fieldData — only include fields with values
  const fieldData = {
    name:      product.name,
    slug,
    _draft:    false,
    _archived: false,
  };

  if (product.price)                fieldData['price']                = product.price;
  if (product.discount)             fieldData['discount']             = product.discount;
  if (product.currency)             fieldData['currency']             = product.currency;
  if (product.stock)                fieldData['stock']                = product.stock;
  if (product['sold-text'])         fieldData['sold-text']            = product['sold-text'];
  if (product['shop-name'])         fieldData['shop-name']            = product['shop-name'];
  if (product['shop-location'])     fieldData['shop-location']        = product['shop-location'];
  if (typeof product['shop-rating'] === 'number') {
    fieldData['shop-rating'] = Math.min(5, Math.max(1, product['shop-rating']));
  }
  if (product['product-offer-link']) fieldData['product-offer-link']  = product['product-offer-link'];
  if (product['image-1'] && typeof product['image-1'] === 'string' && product['image-1'].startsWith('http')) {
    fieldData['image-1'] = { url: product['image-1'] };
  }

  try {
    await webflow.collections.items.createItem(COLLECTION_ID, { fieldData });
    existingSlugs.add(slug); // prevent same-run duplicates
    console.log(`  ✅ Created: "${product.name}" → /product/${slug}`);
    return true;
  } catch (err) {
    const msg = err?.body?.message ?? err?.message ?? String(err);
    console.warn(`  ⚠️  Failed to create "${product.name}": ${msg}`);
    return false;
  }
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  if (!process.env.ANTHROPIC_API_KEY) {
    throw new Error('ANTHROPIC_API_KEY environment variable is not set');
  }
  if (!process.env.WEBFLOW_CMS_SITE_API_TOKEN) {
    throw new Error('WEBFLOW_CMS_SITE_API_TOKEN environment variable is not set');
  }

  const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  const webflow   = new WebflowClient({ accessToken: process.env.WEBFLOW_CMS_SITE_API_TOKEN });

  // Research products
  let products;
  try {
    products = await researchProducts(anthropic);
  } catch (err) {
    // Fallback: try without web_search
    console.warn(`\nWeb search failed (${err.message}), retrying without search tool...`);
    const fallbackRes = await anthropic.messages.create({
      model: 'claude-sonnet-4-5',
      max_tokens: 4000,
      system: 'You are a product researcher for smartly.sale, a Filipino deals/affiliate site.',
      messages: [{
        role: 'user',
        content: `List 5 popular Shopee Philippines products with discounts from your knowledge. Use the <PRODUCTS> format with JSON array.`
      }],
    });
    const text = fallbackRes.content.filter(b => b.type === 'text').map(b => b.text).join('\n');
    const raw  = extractBlock(text, 'PRODUCTS');
    if (!raw) throw new Error('Fallback also failed: no <PRODUCTS> block');
    products = JSON.parse(raw);
  }

  // Fetch existing slugs
  console.log('\nFetching existing Webflow CMS products...');
  const existingSlugs = await fetchExistingSlugs(webflow);

  // Create new products
  console.log('\nAdding products to Webflow CMS...');
  let added   = 0;
  let skipped = 0;

  for (const product of products) {
    const created = await createProduct(webflow, product, existingSlugs);
    if (created) added++;
    else skipped++;
  }

  console.log(`\nDone. Added: ${added} | Skipped (duplicates/errors): ${skipped}`);
}

main().catch(err => {
  console.error('\nProduct generation failed:', err.message);
  process.exit(1);
});
