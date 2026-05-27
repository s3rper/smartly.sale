#!/usr/bin/env node
/**
 * Taglish Buyer Guide & VS Comparison Generator — smartly.sale
 *
 * Generates two types of high-conversion SEO pages:
 *  1. "X vs Y" product comparisons (buyer deciding between 2 products)
 *  2. "Best X for Y" buyer guides (buyer with a specific need + budget)
 *
 * These page types have 3-5x higher conversion than roundups because
 * the reader is already deciding what to buy.
 *
 * Usage:
 *   node --env-file=.env scripts/generate-buyer-guides.mjs
 *   node --env-file=.env scripts/generate-buyer-guides.mjs --dry-run
 *   node --env-file=.env scripts/generate-buyer-guides.mjs --count=3
 *   node --env-file=.env scripts/generate-buyer-guides.mjs --type=vs        # only comparisons
 *   node --env-file=.env scripts/generate-buyer-guides.mjs --type=guide     # only buyer guides
 */

import Anthropic from '@anthropic-ai/sdk';
import { readFileSync, writeFileSync, existsSync, readdirSync } from 'fs';
import { createHash } from 'crypto';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT      = join(__dirname, '..');
const DATA_FILE = join(ROOT, 'src/data/blog-posts.json');
const SHOPEE_DIR = join(ROOT, 'shopee');

// ── CLI flags ────────────────────────────────────────────────────────────────
const args = process.argv.slice(2);
const DRY_RUN = args.includes('--dry-run');
const COUNT   = parseInt((args.find(a => a.startsWith('--count=')) || '--count=5').split('=')[1], 10);
const TYPE    = (args.find(a => a.startsWith('--type=')) || '').split('=')[1] || 'both';

// ── Image pools ──────────────────────────────────────────────────────────────
const IMAGE_POOLS = {
  tech:    ['photo-1468495244123-6c6c332eeece','photo-1550009158-9ebf69173e03','photo-1593642632559-0c6d3fc62b89','photo-1526738549149-8e07eca6c147'],
  home:    ['photo-1556909114-f6e7ad7d3136','photo-1583847268964-b28dc8f51f92','photo-1616046229478-9901c5536a45','photo-1586023492125-27b2c045efd7'],
  fashion: ['photo-1441986300917-64674bd600d8','photo-1483985988355-763728e1935b','photo-1445205170230-053b83016050'],
  beauty:  ['photo-1596462502278-27bfdc403348','photo-1522335789203-aabd1fc54bc9','photo-1512496015851-a90fb38ba796'],
  deals:   ['photo-1556742049-0cfed4f6a45d','photo-1472851294608-062f824d29cc','photo-1607083206869-4c7672e72a8a','photo-1563013544-824ae1b704d3'],
  default: ['photo-1556742049-0cfed4f6a45d','photo-1607083206869-4c7672e72a8a','photo-1472851294608-062f824d29cc','photo-1519389950473-47ba0277781c'],
};

function unsplashUrl(id) {
  return `https://images.unsplash.com/${id}?w=1200&h=630&fit=crop&q=80`;
}
function pickImage(pool, slug) {
  const h = createHash('md5').update(slug).digest('hex');
  return unsplashUrl((IMAGE_POOLS[pool] || IMAGE_POOLS.default)[parseInt(h.slice(0, 6), 16) % (IMAGE_POOLS[pool] || IMAGE_POOLS.default).length]);
}

// ── Internal links ───────────────────────────────────────────────────────────
const INTERNAL_LINKS = [
  { href: '/products',    anchors: ['best deals on Shopee Philippines', 'trending Shopee products'] },
  { href: '/earn-gcash',  anchors: ['earn free GCash online', 'free GCash Philippines 2026'] },
  { href: '/best-deals',  anchors: ['best deals Philippines today', 'online deals Philippines'] },
  { href: '/shopee-sales-2026', anchors: ['Shopee sales calendar 2026', 'upcoming Shopee sales'] },
  { href: '/free-gift-cards-philippines', anchors: ['free gift cards Philippines', 'claim free gift cards'] },
  { href: '/category/gadgets', anchors: ['best Shopee gadgets', 'trending gadgets on Shopee'] },
  { href: '/category/home-living', anchors: ['Shopee home essentials', 'home & living deals'] },
  { href: '/category/fashion', anchors: ['Shopee fashion finds', 'trending fashion on Shopee'] },
  { href: '/deals/under-500', anchors: ['best Shopee deals under 500 pesos', 'budget finds under ₱500'] },
  { href: '/deals/under-1000', anchors: ['Shopee deals under 1000 pesos', 'budget picks under ₱1,000'] },
];

function linkInstructions() {
  return INTERNAL_LINKS.map(l => `  • ${l.href} → "${l.anchors.join('" | "')}"`).join('\n');
}

// ── Load products ────────────────────────────────────────────────────────────
function loadProducts() {
  const files = readdirSync(SHOPEE_DIR).filter(f => f.endsWith('.json'));
  const map = new Map();
  for (const file of files) {
    try {
      const data = JSON.parse(readFileSync(join(SHOPEE_DIR, file), 'utf-8'));
      if (!Array.isArray(data)) continue;
      for (const item of data) {
        const p = item.batch_item_for_item_card_full;
        if (!p?.name) continue;
        const id = String(p.itemid || item.item_id);
        if (!map.has(id)) {
          map.set(id, {
            id, name: p.name,
            price: Math.round(parseInt(p.price_min || p.price || '0') / 100000),
            priceMax: Math.round(parseInt(p.price_max || p.price || '0') / 100000),
            originalPrice: Math.round(parseInt(p.price_min_before_discount || '0') / 100000),
            discount: p.discount || '', sold: p.sold_text || '0',
            historicalSold: p.historical_sold || 0, reviews: p.cmt_count || 0,
            link: item.product_link || `https://shopee.ph/product/${p.shopid}/${id}`,
            affiliateLink: item.long_link || item.product_link,
          });
        }
      }
    } catch { /* skip */ }
  }
  return [...map.values()].filter(p => p.price > 0);
}

// ── Product classification ───────────────────────────────────────────────────
const PRODUCT_TYPES = [
  { key: 'fan',         match: ['fan','electric fan','desk fan','portable fan','handheld fan'], label: 'Portable Fan', labelTl: 'Portable Fan', imagePool: 'home', category: 'home-living' },
  { key: 'speaker',     match: ['speaker','karaoke','bluetooth speaker'], label: 'Bluetooth Speaker', labelTl: 'Bluetooth Speaker', imagePool: 'tech', category: 'tech-gadgets' },
  { key: 'earphone',    match: ['earphone','earbuds','headphone','headset','tws','anc'], label: 'Earphones', labelTl: 'Earphones', imagePool: 'tech', category: 'tech-gadgets' },
  { key: 'powerbank',   match: ['power bank','powerbank','portable charger'], label: 'Power Bank', labelTl: 'Power Bank', imagePool: 'tech', category: 'tech-gadgets' },
  { key: 'charger',     match: ['charger','fast charge','charging'], label: 'Charger', labelTl: 'Charger', imagePool: 'tech', category: 'tech-gadgets' },
  { key: 'watch',       match: ['watch','smartwatch','smart watch'], label: 'Watch', labelTl: 'Relo', imagePool: 'tech', category: 'tech-gadgets' },
  { key: 'shirt',       match: ['shirt','tshirt','t-shirt','polo','blouse','top'], label: 'Shirt', labelTl: 'Damit', imagePool: 'fashion', category: 'fashion-style' },
  { key: 'bag',         match: ['bag','backpack','sling bag','tote','crossbody'], label: 'Bag', labelTl: 'Bag', imagePool: 'fashion', category: 'fashion-style' },
  { key: 'shoes',       match: ['shoes','sneakers','sandals','slippers','footwear'], label: 'Shoes', labelTl: 'Sapatos', imagePool: 'fashion', category: 'fashion-style' },
  { key: 'organizer',   match: ['organizer','storage','rack','cabinet','shelf','trolley'], label: 'Storage Organizer', labelTl: 'Organizer', imagePool: 'home', category: 'home-living' },
  { key: 'lamp',        match: ['lamp','light','led light','ring light','solar light','night light'], label: 'LED Light', labelTl: 'Ilaw', imagePool: 'home', category: 'home-living' },
  { key: 'cable',       match: ['cable','extension','socket','outlet','plug','strip'], label: 'Extension Cable', labelTl: 'Extension', imagePool: 'home', category: 'home-living' },
  { key: 'tumbler',     match: ['tumbler','bottle','flask','water bottle','insulated'], label: 'Tumbler', labelTl: 'Tumbler', imagePool: 'home', category: 'home-living' },
  { key: 'skincare',    match: ['serum','sunscreen','moisturizer','toner','cleanser','skincare'], label: 'Skincare', labelTl: 'Skincare', imagePool: 'beauty', category: 'beauty-wellness' },
];

function classify(product) {
  const name = product.name.toLowerCase();
  for (const type of PRODUCT_TYPES) {
    if (type.match.some(kw => name.includes(kw))) return type;
  }
  return null;
}

// ── Generate VS comparison topics ────────────────────────────────────────────
function generateVsTopics(products) {
  const buckets = {};
  for (const p of products) {
    const type = classify(p);
    if (!type) continue;
    if (!buckets[type.key]) buckets[type.key] = { type, products: [] };
    buckets[type.key].products.push(p);
  }

  const topics = [];
  const now = new Date();
  const year = now.getFullYear();

  for (const [, bucket] of Object.entries(buckets)) {
    const sorted = bucket.products.sort((a, b) => b.historicalSold - a.historicalSold);
    if (sorted.length < 2) continue;

    // Top 2 best-sellers = natural VS matchup
    const [a, b] = sorted.slice(0, 2);
    // Only pair if they're genuinely different products
    if (a.id === b.id) continue;

    const nameA = a.name.length > 50 ? a.name.substring(0, 50).trim() + '…' : a.name;
    const nameB = b.name.length > 50 ? b.name.substring(0, 50).trim() + '…' : b.name;

    const slug = `${slugify(a.name)}-vs-${slugify(b.name)}-${year}`;

    topics.push({
      type: 'vs',
      slug: slug.substring(0, 80),
      title: `${shortName(a.name)} vs ${shortName(b.name)} — Alin ang Mas Sulit?`,
      keyword: `${bucket.type.label.toLowerCase()} shopee comparison ${year}`,
      productA: a,
      productB: b,
      allInCategory: sorted.slice(0, 6),
      imagePool: bucket.type.imagePool,
      category: bucket.type.category,
      productType: bucket.type,
    });
  }

  return topics;
}

// ── Generate "Best X for Y" guide topics ─────────────────────────────────────
function generateGuideTopics(products) {
  const buckets = {};
  for (const p of products) {
    const type = classify(p);
    if (!type) continue;
    if (!buckets[type.key]) buckets[type.key] = { type, products: [] };
    buckets[type.key].products.push(p);
  }

  const topics = [];
  const now = new Date();
  const year = now.getFullYear();

  // "Best X for Y" use case templates
  const useCases = {
    fan:       [{ use: 'Online Class at Work From Home', budget: 1000 }, { use: 'Outdoor at Travel', budget: 500 }],
    speaker:   [{ use: 'Karaoke at Home', budget: 2000 }, { use: 'Outdoor at Beach Trip', budget: 1000 }],
    earphone:  [{ use: 'Online Class at WFH', budget: 1000 }, { use: 'Gaming at Mobile Legends', budget: 500 }],
    powerbank: [{ use: 'Travel at Commute', budget: 1500 }, { use: 'Camping at Outdoor', budget: 2000 }],
    watch:     [{ use: 'Fitness at Health Tracking', budget: 2000 }],
    shirt:     [{ use: 'Office at Casual Work', budget: 500 }],
    bag:       [{ use: 'School at College Students', budget: 500 }, { use: 'Travel at Weekend Trips', budget: 1000 }],
    shoes:     [{ use: 'Everyday na Lakad', budget: 500 }],
    organizer: [{ use: 'Maliit na Kwarto o Dorm', budget: 1000 }],
    skincare:  [{ use: 'Oily Skin sa Mainit na Panahon', budget: 500 }],
    tumbler:   [{ use: 'School at Office Daily Use', budget: 500 }],
    lamp:      [{ use: 'Brownout at Emergency', budget: 500 }],
  };

  for (const [key, bucket] of Object.entries(buckets)) {
    const cases = useCases[key];
    if (!cases || bucket.products.length < 3) continue;

    for (const { use, budget } of cases) {
      const eligible = bucket.products
        .filter(p => p.price <= budget)
        .sort((a, b) => b.historicalSold - a.historicalSold)
        .slice(0, 8);

      if (eligible.length < 3) continue;

      const slug = `best-${key}-for-${slugify(use)}-under-${budget}-shopee-${year}`;

      topics.push({
        type: 'guide',
        slug: slug.substring(0, 80),
        title: `Best ${bucket.type.label} for ${use} Under ₱${budget.toLocaleString()} — Shopee ${year}`,
        keyword: `best ${bucket.type.label.toLowerCase()} for ${use.toLowerCase().split(' at ')[0]} shopee philippines ${year}`,
        products: eligible,
        budget,
        useCase: use,
        imagePool: bucket.type.imagePool,
        category: bucket.type.category,
        productType: bucket.type,
      });
    }
  }

  return topics;
}

// ── Slug helpers ─────────────────────────────────────────────────────────────
function slugify(text) {
  return text.toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .substring(0, 35)
    .replace(/-$/, '');
}

function shortName(name) {
  // Extract brand + key product identifier (first 4-5 meaningful words)
  return name
    .replace(/【.*?】/g, '')
    .replace(/\(.*?\)/g, '')
    .replace(/\[.*?\]/g, '')
    .trim()
    .split(/\s+/)
    .slice(0, 5)
    .join(' ')
    .trim();
}

function formatProduct(p) {
  const priceStr = p.priceMax && p.priceMax !== p.price
    ? `₱${p.price}–₱${p.priceMax}`
    : `₱${p.price}`;
  return [
    `  Name: ${p.name}`,
    `  Price: ${priceStr}${p.originalPrice ? ` (was ₱${p.originalPrice})` : ''}`,
    `  Discount: ${p.discount || 'None'}`,
    `  Units Sold: ${p.sold} (${p.historicalSold} total)`,
    `  Reviews: ${p.reviews}`,
    `  Link: ${p.link}`,
  ].join('\n');
}

// ── Claude generation: VS comparison ─────────────────────────────────────────
async function generateVsPage(client, topic) {
  const system = `You are a senior product reviewer and SEO writer for smartly.sale — a Shopee Philippines affiliate shopping guide.

You write in natural Taglish (mix of Filipino and English) that feels authentic to Filipino readers. Example tone:
- "Sulit ba talaga 'to? Tingnan natin."
- "Kung budget-conscious ka, ito ang mas okay."
- "Para sa price na 'to, surprising ang quality."

Your reviews are honest, practical, and help readers make a real buying decision. You mention both pros and cons.`;

  const user = `Write a complete VS comparison article in Taglish.

PRODUCT A:
${formatProduct(topic.productA)}

PRODUCT B:
${formatProduct(topic.productB)}

ALSO MENTION (as alternatives at the end):
${topic.allInCategory.slice(2, 5).map((p, i) => `${i + 3}. ${p.name} — ₱${p.price} (${p.sold} sold)`).join('\n')}

ARTICLE REQUIREMENTS:
- Length: 1800-2500 words
- Title format: "[Product A short name] vs [Product B short name] — Alin ang Mas Sulit? (${new Date().getFullYear()})"
- Write in Taglish — mix Filipino and English naturally
- Meta description: 150-160 chars, Taglish, with CTA
- Structure:
  1. Quick Verdict (TL;DR box — 2-3 sentences, who should buy which)
  2. Side-by-Side Comparison Table (HTML table: Feature, Product A, Product B)
  3. Price & Value for Money analysis
  4. Build Quality & Design (based on reviews/sold count as proxy for reliability)
  5. Performance & Features deep dive
  6. Sino Ang Dapat Bumili ng Alin? (recommendation by use case)
  7. Other Options Worth Considering (mention 2-3 alternatives)
  8. Final Verdict (clear winner with nuance)
  9. FAQ section: 5 questions as <details><summary>Q</summary><p>A</p></details>

PRODUCT LINKS — for each product, include:
  <a href="PRODUCT_LINK" target="_blank" rel="noopener noreferrer sponsored">Bilhin sa Shopee →</a>

INTERNAL LINKS (choose 3-4):
${linkInstructions()}

HTML: <article>, <section>, <h2 id="...">, <h3>, <p>, <ul>, <table>, <strong>, <em>
Quick Verdict box: <div class="info-box"><strong>Quick Verdict:</strong> ...</div>
Warning boxes: <div class="warning-box"><strong>Paalala:</strong> ...</div>

RESPONSE FORMAT:
<META>
{
  "title": "55-65 char Taglish title",
  "metaTitle": "SEO title (max 60 chars)",
  "metaDescription": "150-160 char Taglish description with CTA",
  "excerpt": "2-3 sentence Taglish summary — this appears as TL;DR",
  "slug": "${topic.slug}",
  "category": "${topic.category}",
  "tags": ["tag1", "tag2", "tag3", "tag4", "tag5"],
  "keywords": ["primary keyword", "secondary keyword", "long-tail phrase", "taglish keyword", "comparison keyword"],
  "featuredImage": ""
}
</META>
<CONTENT>
[Full HTML article in Taglish]
</CONTENT>
<FAQS>
[{"q":"Taglish question?","a":"Taglish answer."},...]
</FAQS>`;

  return callClaude(client, system, user, topic.slug);
}

// ── Claude generation: Best X for Y guide ────────────────────────────────────
async function generateGuidePage(client, topic) {
  const system = `You are a senior product reviewer and SEO writer for smartly.sale — a Shopee Philippines affiliate shopping guide.

You write in natural Taglish (mix of Filipino and English) that feels authentic to Filipino readers. Example tone:
- "Sulit ba talaga 'to? Tingnan natin."
- "Para sa students na laging naka-online class, ito ang best."
- "Hindi mo kailangang gumastos ng malaki para sa quality na ganito."

Your guides are practical — you understand Filipino budgets and real-world use cases.`;

  const productList = topic.products.map((p, i) =>
    `${i + 1}. ${p.name}\n${formatProduct(p)}`
  ).join('\n\n');

  const user = `Write a complete "Best ${topic.productType.label} for ${topic.useCase}" buyer's guide in Taglish.

BUDGET: Under ₱${topic.budget.toLocaleString()}
USE CASE: ${topic.useCase}

PRODUCTS TO REVIEW:
${productList}

ARTICLE REQUIREMENTS:
- Length: 1800-2500 words
- Title format: "Best ${topic.productType.label} for ${topic.useCase} Under ₱${topic.budget.toLocaleString()} — Shopee ${new Date().getFullYear()}"
- Write in Taglish — mix Filipino and English naturally
- Meta description: 150-160 chars, Taglish, with CTA
- Structure:
  1. Introduction — explain the use case, why this budget range, what to look for
  2. Quick Picks Table (HTML table: Rank, Product, Price, Best For)
  3. Editor's Top Pick (detailed 300-word review of #1 recommendation)
  4. Best Budget Pick (the cheapest-but-good option)
  5. Best Premium Pick (best within budget ceiling)
  6-7. Individual mini-reviews for remaining products (100-150 words each)
  8. Buyer's Guide: Ano ang Dapat Hanapin? (buying criteria for this category)
  9. Saan Bumili at Paano Mag-ipon (where to buy + tips to save more)
  10. Final Verdict & Recommendations
  11. FAQ: 5 questions as <details><summary>Q</summary><p>A</p></details>

PRODUCT LINKS — for each product:
  <a href="PRODUCT_LINK" target="_blank" rel="noopener noreferrer sponsored">Bilhin sa Shopee →</a>

INTERNAL LINKS (choose 3-4):
${linkInstructions()}

HTML: <article>, <section>, <h2 id="...">, <h3>, <p>, <ul>, <table>, <strong>, <em>
Tip boxes: <div class="info-box"><strong>Pro Tip:</strong> ...</div>
Warning boxes: <div class="warning-box"><strong>Paalala:</strong> ...</div>

RESPONSE FORMAT:
<META>
{
  "title": "55-65 char Taglish title with keyword",
  "metaTitle": "SEO title (max 60 chars)",
  "metaDescription": "150-160 char Taglish description with CTA",
  "excerpt": "2-3 sentence Taglish summary — appears as TL;DR",
  "slug": "${topic.slug}",
  "category": "${topic.category}",
  "tags": ["tag1", "tag2", "tag3", "tag4", "tag5"],
  "keywords": ["primary keyword", "secondary keyword", "long-tail phrase", "taglish keyword", "buying guide keyword"],
  "featuredImage": ""
}
</META>
<CONTENT>
[Full HTML article in Taglish]
</CONTENT>
<FAQS>
[{"q":"Taglish question?","a":"Taglish answer."},...]
</FAQS>`;

  return callClaude(client, system, user, topic.slug);
}

// ── Shared Claude caller ─────────────────────────────────────────────────────
async function callClaude(client, system, user, slug) {
  const response = await client.messages.create({
    model: 'claude-sonnet-4-5',
    max_tokens: 12000,
    system,
    messages: [{ role: 'user', content: user }],
  });

  const fullText = response.content.filter(b => b.type === 'text').map(b => b.text).join('\n');

  const metaRaw = extractBlock(fullText, 'META');
  const content = extractBlock(fullText, 'CONTENT');
  const faqsRaw = extractBlock(fullText, 'FAQS');

  if (!metaRaw) throw new Error('No <META> block');
  if (!content) throw new Error('No <CONTENT> block');

  const meta = JSON.parse(metaRaw);
  let faqs = [];
  try { faqs = JSON.parse(faqsRaw || '[]'); } catch { /* skip */ }

  let finalSlug = (meta.slug || slug)
    .toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');

  const wc = wordCount(content);

  return {
    ...meta, slug: finalSlug, content, faqs,
    wordCount: wc, readingTime: Math.max(1, Math.ceil(wc / 220)),
  };
}

function extractBlock(text, tag) {
  const re = new RegExp(`<${tag}>\\s*([\\s\\S]*?)\\s*<\\/${tag}>`, 'i');
  const m = text.match(re);
  return m ? m[1].trim() : null;
}

function wordCount(html) {
  return html.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length;
}

// ── Main ─────────────────────────────────────────────────────────────────────
async function main() {
  if (!process.env.ANTHROPIC_API_KEY) throw new Error('ANTHROPIC_API_KEY not set');

  console.log('╔════════════════════════════════════════════════════════════╗');
  console.log('║  Taglish Buyer Guide & VS Generator — smartly.sale       ║');
  console.log('╚════════════════════════════════════════════════════════════╝\n');

  const existing = existsSync(DATA_FILE) ? JSON.parse(readFileSync(DATA_FILE, 'utf-8')) : [];
  const existingSlugs = new Set(existing.map(p => p.slug));
  console.log(`Existing posts: ${existing.length}`);

  console.log('Loading Shopee products...');
  const products = loadProducts();
  console.log(`Loaded ${products.length} products\n`);

  // Generate topics
  let allTopics = [];
  if (TYPE === 'vs' || TYPE === 'both') {
    const vsTopics = generateVsTopics(products);
    console.log(`VS comparison topics: ${vsTopics.length}`);
    allTopics.push(...vsTopics);
  }
  if (TYPE === 'guide' || TYPE === 'both') {
    const guideTopics = generateGuideTopics(products);
    console.log(`Buyer guide topics: ${guideTopics.length}`);
    allTopics.push(...guideTopics);
  }

  // Interleave: alternate VS and guide for variety
  if (TYPE === 'both') {
    const vs = allTopics.filter(t => t.type === 'vs');
    const guides = allTopics.filter(t => t.type === 'guide');
    allTopics = [];
    const maxLen = Math.max(vs.length, guides.length);
    for (let i = 0; i < maxLen; i++) {
      if (i < vs.length) allTopics.push(vs[i]);
      if (i < guides.length) allTopics.push(guides[i]);
    }
  }

  console.log(`\nAll topics (${allTopics.length}):`);
  allTopics.forEach((t, i) => {
    const tag = t.type === 'vs' ? '[VS]' : '[GUIDE]';
    const dupe = existingSlugs.has(t.slug) ? ' [SKIP]' : '';
    console.log(`  ${i + 1}. ${tag} ${t.title.substring(0, 70)}${dupe}`);
  });

  const newTopics = allTopics.filter(t => !existingSlugs.has(t.slug)).slice(0, COUNT);

  if (newTopics.length === 0) {
    console.log('\nNo new topics to generate.');
    return;
  }

  console.log(`\nGenerating ${newTopics.length} pages${DRY_RUN ? ' (DRY RUN)' : ''}...\n`);

  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  const generated = [];

  for (const topic of newTopics) {
    try {
      console.log(`  Calling Claude for: [${topic.type.toUpperCase()}] "${topic.title.substring(0, 60)}..."`);

      const raw = topic.type === 'vs'
        ? await generateVsPage(client, topic)
        : await generateGuidePage(client, topic);

      let slug = raw.slug;
      if (existingSlugs.has(slug)) slug = `${slug}-${Date.now().toString(36)}`;
      existingSlugs.add(slug);

      const post = {
        id:              createHash('md5').update(slug).digest('hex').slice(0, 8),
        slug,
        title:           raw.title || topic.title,
        metaTitle:       raw.metaTitle || raw.title,
        metaDescription: raw.metaDescription || '',
        excerpt:         raw.excerpt || '',
        content:         raw.content,
        featuredImage:   pickImage(topic.imagePool, slug),
        featuredImageAlt: raw.title || topic.title,
        category:        raw.category || topic.category,
        tags:            Array.isArray(raw.tags) ? raw.tags : [],
        keywords:        Array.isArray(raw.keywords) ? raw.keywords : [],
        faqs:            Array.isArray(raw.faqs) ? raw.faqs : [],
        author:          'smartly.sale Team',
        publishDate:     new Date().toISOString(),
        wordCount:       raw.wordCount,
        readingTime:     raw.readingTime,
        generated:       true,
      };

      generated.push(post);
      console.log(`  ✓ "${post.title}"`);
      console.log(`    URL:   /post/${post.slug}`);
      console.log(`    Words: ${post.wordCount} | Read: ${post.readingTime} min\n`);
    } catch (err) {
      console.error(`  ✗ Failed: ${topic.title.substring(0, 50)} — ${err.message}\n`);
    }
  }

  if (generated.length === 0) { console.log('No pages generated.'); return; }

  if (DRY_RUN) {
    console.log(`═══════════════════════════════════════`);
    console.log(`DRY RUN — ${generated.length} pages would be created.`);
    return;
  }

  const updated = [...generated, ...existing].slice(0, 500);
  writeFileSync(DATA_FILE, JSON.stringify(updated, null, 2));

  console.log(`═══════════════════════════════════════`);
  console.log(`✓ ${generated.length} pages saved to blog-posts.json`);
  console.log(`  Total posts now: ${updated.length}`);
  console.log('\nGenerated URLs:');
  generated.forEach(p => console.log(`  https://smartly.sale/post/${p.slug}`));
}

main().catch(err => { console.error('\nFailed:', err.message); process.exit(1); });
