/**
 * shopee-loader.ts
 *
 * Loads ALL JSON files from /shopee/*.json using Vite's import.meta.glob.
 * Adding a new JSON file to the /shopee/ directory and redeploying to Vercel
 * is all that's needed — no code changes required.
 *
 * Expected JSON shape: array of Shopee affiliate offer objects as exported
 * from the Shopee Affiliate Portal (batch_item_for_item_card_full format).
 */

import type { CMSProduct } from '../types/product';

// ── Shopee raw types ──────────────────────────────────────────────────────────

interface ShopeeItemRating {
  rating_star?: number;
  rating_count?: number[];
}

interface ShopeeItemCard {
  itemid?: string | number;
  shopid?: string | number;
  name: string;
  image: string;
  images: string[];
  currency?: string;
  price?: string | number;
  price_min?: string | number;
  price_max?: string | number;
  price_before_discount?: string | number;
  discount?: string;
  show_discount?: number;
  stock?: number;
  sold?: number;
  sold_text?: string;
  historical_sold?: number;
  historical_sold_text?: string;
  item_rating?: ShopeeItemRating;
  video_info_list?: unknown[];
  ctime?: number;
}

interface ShopeeOffer {
  item_id: string;
  productOfferLink?: string;
  long_link?: string;
  product_link?: string;
  batch_item_for_item_card_full: ShopeeItemCard;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

/** Convert a product name + item_id to a URL-safe slug */
function toSlug(name: string, itemId: string): string {
  const base = name
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 55)
    .replace(/-$/, '');
  return `${base}-${itemId}`;
}

/** Build a Shopee CDN image URL from a raw image key */
function imgUrl(key: string): string {
  if (!key) return '';
  // Already a full URL
  if (key.startsWith('http')) return key;
  return `https://cf.shopee.ph/file/${key}`;
}

/** Convert Shopee's internal price (integer × 100000) to a formatted PHP string */
function fmtPrice(raw: string | number | undefined): string {
  if (raw == null || raw === '') return '₱0';
  const num = Math.round(Number(raw) / 100000);
  return `₱${num.toLocaleString('en-PH')}`;
}

// ── Core transformer ──────────────────────────────────────────────────────────

function shopeeOfferToCMSProduct(offer: ShopeeOffer): CMSProduct {
  const d = offer.batch_item_for_item_card_full;
  const slug = toSlug(d.name, offer.item_id);

  // Deduplicate + prefix all image IDs
  const allImageKeys = [d.image, ...(d.images ?? [])].filter(Boolean);
  const seen = new Set<string>();
  const uniqueImages: string[] = [];
  for (const k of allImageKeys) {
    const url = imgUrl(k);
    if (!seen.has(url)) { seen.add(url); uniqueImages.push(url); }
  }

  // Build fieldData matching the CMSProduct interface
  const fieldData: CMSProduct['fieldData'] = {
    name: d.name,
    slug,
    currency: 'PHP',
    price: fmtPrice(d.price_min ?? d.price),
    discount: d.discount ?? (d.show_discount ? `${d.show_discount}%` : undefined),
    stock: d.stock != null ? String(d.stock) : undefined,
    'sold-text': d.sold_text ?? d.historical_sold_text ?? String(d.sold ?? ''),
    'shop-rating': d.item_rating?.rating_star,
    'product-offer-link': offer.productOfferLink ?? offer.long_link ?? offer.product_link ?? '',
    _archived: false,
    _draft: false,
    'created-on': d.ctime ? new Date(d.ctime * 1000).toISOString() : new Date().toISOString(),
    'updated-on': new Date().toISOString(),
    'published-on': new Date().toISOString(),
  };

  // Map images into image-1 … image-10 fields
  uniqueImages.slice(0, 10).forEach((url, i) => {
    (fieldData as Record<string, unknown>)[`image-${i + 1}`] = { url };
  });

  return { id: offer.item_id, fieldData };
}

// ── Load all JSON files from /shopee/ ─────────────────────────────────────────
// Vite processes this glob at build time — adding a new .json file and
// redeploying to Vercel automatically includes it. No code changes needed.

const rawFiles = import.meta.glob('/shopee/*.json', { eager: true }) as Record<string, unknown>;

const allOffers: ShopeeOffer[] = Object.values(rawFiles).flatMap((file) => {
  // Vite wraps default exports; unwrap if needed
  const data = (file as { default?: unknown }).default ?? file;
  return Array.isArray(data) ? (data as ShopeeOffer[]) : [];
});

// Deduplicate by item_id — first occurrence wins if the same product appears
// in multiple JSON files (e.g. overlapping exports from the affiliate portal)
const seenIds = new Set<string>();
const uniqueOffers = allOffers.filter((offer) => {
  if (seenIds.has(offer.item_id)) return false;
  seenIds.add(offer.item_id);
  return true;
});

/** All products from every /shopee/*.json file, as CMSProduct objects */
export const shopeeProducts: CMSProduct[] = uniqueOffers.map(shopeeOfferToCMSProduct);

export const shopeeProductCount = shopeeProducts.length;
