#!/usr/bin/env node
/**
 * Fetch Shopee affiliate products locally (requires PH IP) and save to
 * src/data/shopee-products.json for use by generate-products.mjs in CI.
 *
 * Usage:
 *   node scripts/fetch-products-local.mjs
 *
 * Requires SHOPEE_AFFILIATE_TOKEN in .env (your browser cookie from affiliate.shopee.ph).
 * Run this from your local machine (PH IP), then commit the JSON file.
 */

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT      = join(__dirname, '..');
const OUT_FILE  = join(ROOT, 'src/data/shopee-products.json');

// ── Load .env manually (no dotenv dependency) ────────────────────────────────
const envPath = join(ROOT, '.env');
if (existsSync(envPath)) {
  readFileSync(envPath, 'utf-8').split('\n').forEach(line => {
    const m = line.match(/^([^#=\s]+)\s*=\s*"?([^"]*)"?\s*$/);
    if (m) process.env[m[1]] = m[2];
  });
}

const token = process.env.SHOPEE_AFFILIATE_TOKEN;
if (!token) {
  console.error('❌  SHOPEE_AFFILIATE_TOKEN not set in .env');
  process.exit(1);
}

// ── API constants ─────────────────────────────────────────────────────────────

const LIST_URL = 'https://affiliate.shopee.ph/api/v3/offer/product/list?list_type=0&sort_type=1&page_offset=0&page_limit=50&client_type=1';
const GQL_URL  = 'https://affiliate.shopee.ph/api/v3/gql?q=productOfferLinks';

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

function slugify(text) {
  return (text || '')
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 80);
}

// ── Main fetch ────────────────────────────────────────────────────────────────

async function main() {
  const isBearer = token.trim().toLowerCase().startsWith('bearer ');
  const headers = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Referer': 'https://affiliate.shopee.ph/offer/product_selection',
    ...(isBearer ? { Authorization: token } : { Cookie: token }),
  };

  console.log('Fetching product list from Shopee Affiliate API...');
  const listResp = await fetch(LIST_URL, { headers, signal: AbortSignal.timeout(15_000) });

  if (!listResp.ok) {
    console.error(`❌  List API returned HTTP ${listResp.status}`);
    if (listResp.status === 403) {
      console.error('   Geo-restriction: this script must be run from a Philippine IP.');
    }
    process.exit(1);
  }

  const listJson = await listResp.json();

  if (listJson?.is_login === false) {
    console.error('❌  Not logged in — SHOPEE_AFFILIATE_TOKEN is expired or invalid.');
    console.error('   Refresh: log into affiliate.shopee.ph → DevTools → Network → copy Cookie header.');
    process.exit(1);
  }

  const rawProducts = listJson?.data?.list ?? [];
  if (!rawProducts.length) {
    console.error('❌  API returned 0 products. Check list_type / sort_type params.');
    process.exit(1);
  }
  console.log(`  ✅ Got ${rawProducts.length} products`);

  // ── Fetch affiliate promo links in batches ──────────────────────────────────
  const params = rawProducts.map(p => {
    const card   = p?.batch_item_for_item_card_full ?? {};
    const shopId = card.shopid ?? p?.shopid ?? p?.shop_id ?? null;
    return { itemId: Number(p.item_id), shopId: Number(shopId), trace: p.trace ?? '' };
  }).filter(x => Number.isFinite(x.itemId) && Number.isFinite(x.shopId));

  const linkMap = new Map();
  const batches = chunkArray(params, 10);
  console.log(`  Fetching promo links in ${batches.length} batches...`);

  for (const [i, batch] of batches.entries()) {
    const resp = await fetch(GQL_URL, {
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
      signal: AbortSignal.timeout(10_000),
    });

    if (resp.ok) {
      const json = await resp.json();
      (json?.data?.productOfferLinks ?? []).forEach(r =>
        linkMap.set(`${r.itemId}:${r.shopId}`, r.productOfferLink)
      );
      process.stdout.write(`    batch ${i + 1}/${batches.length} ✅\r`);
    } else {
      console.warn(`    batch ${i + 1}/${batches.length} ⚠️  HTTP ${resp.status}, skipping`);
    }
    await new Promise(r => setTimeout(r, 150));
  }
  console.log('');

  // ── Map to Webflow CMS schema ───────────────────────────────────────────────
  const products = rawProducts.map(p => {
    const card   = p?.batch_item_for_item_card_full ?? {};
    const shopId = card.shopid ?? p?.shopid ?? null;
    const key    = `${Number(p.item_id)}:${Number(shopId)}`;
    const link   = linkMap.get(key) ?? null;
    const discount = card.raw_discount ?? 0;
    const name     = card.name ?? `Product ${p.item_id}`;

    return {
      name,
      slug:                slugify(name),
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
  }).filter(p => p['product-offer-link']);

  const withLinks = products.length;
  const total     = rawProducts.length;
  console.log(`  ${withLinks}/${total} products have affiliate links`);

  if (!withLinks) {
    console.error('❌  No products with affiliate links found. Nothing to save.');
    process.exit(1);
  }

  // ── Save ──────────────────────────────────────────────────────────────────
  const out = {
    fetchedAt: new Date().toISOString(),
    count:     products.length,
    products,
  };
  writeFileSync(OUT_FILE, JSON.stringify(out, null, 2));
  console.log(`\n✅  Saved ${products.length} products to ${OUT_FILE}`);
  console.log('\nNext steps:');
  console.log('  git add src/data/shopee-products.json');
  console.log('  git commit -m "chore: refresh Shopee products"');
  console.log('  git push');
}

main().catch(err => {
  console.error('Script error:', err.message);
  process.exit(1);
});
