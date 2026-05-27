#!/usr/bin/env node
/**
 * Shopee Programmatic SEO Page Generator -- smartly.sale
 *
 * Workflow:
 *  1. Read Shopee product data from /shopee/*.json
 *  2. Cluster products by price bracket & category
 *  3. Use Claude to generate SEO-optimised roundup pages
 *  4. Prepend to src/data/blog-posts.json
 *
 * Usage:
 *   node --env-file=.env scripts/generate-seo-pages.mjs
 *   node --env-file=.env scripts/generate-seo-pages.mjs --dry-run   # preview without writing
 *   node --env-file=.env scripts/generate-seo-pages.mjs --count=3   # generate N pages (default 5)
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

// ── Image pools (shopping / product oriented) ────────────────────────────────
const IMAGE_POOLS = {
  gadgets: [
    'photo-1468495244123-6c6c332eeece', // headphones
    'photo-1519389950473-47ba0277781c', // laptop desk
    'photo-1526738549149-8e07eca6c147', // phone
    'photo-1550009158-9ebf69173e03', // earbuds
    'photo-1593642632559-0c6d3fc62b89', // smart watch
  ],
  home: [
    'photo-1556909114-f6e7ad7d3136', // kitchen
    'photo-1583847268964-b28dc8f51f92', // living room
    'photo-1616046229478-9901c5536a45', // home decor
    'photo-1586023492125-27b2c045efd7', // cozy room
    'photo-1556228453-efd6c1ff04f6', // organized desk
  ],
  fashion: [
    'photo-1441986300917-64674bd600d8', // fashion store
    'photo-1483985988355-763728e1935b', // fashion model
    'photo-1445205170230-053b83016050', // street fashion
    'photo-1558618666-fcd25c85cd64', // accessories
  ],
  beauty: [
    'photo-1596462502278-27bfdc403348', // skincare
    'photo-1522335789203-aabd1fc54bc9', // beauty products
    'photo-1512496015851-a90fb38ba796', // makeup
  ],
  food: [
    'photo-1504674900247-0877df9cc836', // food flat lay
    'photo-1490818387583-1baba5e638af', // food prep
    'photo-1498837167922-ddd27525d352', // healthy food
  ],
  sports: [
    'photo-1571019613454-1cb2f99b2d8b', // fitness
    'photo-1517836357463-d25dfeac3438', // gym
    'photo-1461896836934-bd45ba79af0b', // outdoor sports
  ],
  deals: [
    'photo-1556742049-0cfed4f6a45d', // shopping bags
    'photo-1472851294608-062f824d29cc', // shopping mall
    'photo-1607083206869-4c7672e72a8a', // online shopping
    'photo-1556742111-a301076d9d18', // sale tags
    'photo-1563013544-824ae1b704d3', // gift boxes
  ],
  default: [
    'photo-1556742049-0cfed4f6a45d',
    'photo-1472851294608-062f824d29cc',
    'photo-1607083206869-4c7672e72a8a',
    'photo-1556742111-a301076d9d18',
    'photo-1563013544-824ae1b704d3',
    'photo-1519389950473-47ba0277781c',
  ],
};

function unsplashUrl(photoId) {
  return `https://images.unsplash.com/${photoId}?w=1200&h=630&fit=crop&q=80`;
}

function pickFromPool(pool, slug) {
  const hashHex = createHash('md5').update(slug || 'default').digest('hex');
  const idx = parseInt(hashHex.slice(0, 6), 16) % pool.length;
  return unsplashUrl(pool[idx]);
}

// ── Internal Link Map ────────────────────────────────────────────────────────
const INTERNAL_LINKS = [
  { href: '/products',    anchors: ['best deals on Shopee Philippines', 'trending Shopee products', 'top Shopee deals'] },
  { href: '/earn-gcash',  anchors: ['earn free GCash online', 'free GCash Philippines 2026', 'legit ways to earn GCash'] },
  { href: '/best-deals',  anchors: ['best deals Philippines today', 'top deals Philippines', 'online deals Philippines'] },
  { href: '/shopee-sales-2026', anchors: ['Shopee sales calendar 2026', 'upcoming Shopee sales', 'Shopee mega sale schedule'] },
  { href: '/free-gift-cards-philippines', anchors: ['free gift cards Philippines', 'claim free gift cards', 'free gift cards PH'] },
  { href: '/online-contests-philippines', anchors: ['online contests Philippines 2026', 'legit online giveaways Philippines'] },
  { href: '/category/gadgets', anchors: ['best Shopee gadgets', 'trending gadgets on Shopee', 'top tech deals Shopee'] },
  { href: '/category/home-living', anchors: ['Shopee home essentials', 'home & living deals', 'best home finds Shopee'] },
  { href: '/category/fashion', anchors: ['Shopee fashion finds', 'trending fashion on Shopee', 'best fashion deals Shopee'] },
  { href: '/category/beauty', anchors: ['Shopee beauty deals', 'beauty & health finds Shopee', 'best skincare deals Shopee'] },
  { href: '/deals/under-500', anchors: ['best Shopee deals under 500 pesos', 'budget finds under ₱500'] },
  { href: '/deals/under-1000', anchors: ['Shopee deals under 1000 pesos', 'budget picks under ₱1,000'] },
];

function buildLinkInstructions() {
  return INTERNAL_LINKS.map(({ href, anchors }) =>
    `  • ${href}  →  anchors: "${anchors.join('" | "')}"`
  ).join('\n');
}

// ── Load Shopee products ─────────────────────────────────────────────────────
function loadShopeeProducts() {
  const files = readdirSync(SHOPEE_DIR).filter(f => f.endsWith('.json'));
  const productMap = new Map(); // dedupe by item_id

  for (const file of files) {
    try {
      const data = JSON.parse(readFileSync(join(SHOPEE_DIR, file), 'utf-8'));
      if (!Array.isArray(data)) continue;
      for (const item of data) {
        const p = item.batch_item_for_item_card_full;
        if (!p || !p.name) continue;
        const id = String(p.itemid || item.item_id);
        if (!productMap.has(id)) {
          productMap.set(id, {
            id,
            name: p.name,
            price: Math.round(parseInt(p.price_min || p.price || '0', 10) / 100000),
            priceMax: Math.round(parseInt(p.price_max || p.price || '0', 10) / 100000),
            originalPrice: Math.round(parseInt(p.price_min_before_discount || '0', 10) / 100000),
            discount: p.discount || '',
            sold: p.sold_text || p.historical_sold_text || '0',
            historicalSold: p.historical_sold || 0,
            rating: p.item_rating?.rating_star || 0,
            reviews: p.cmt_count || 0,
            catId: p.catid,
            image: p.image,
            shopId: p.shopid,
            link: item.product_link || `https://shopee.ph/product/${p.shopid}/${id}`,
            affiliateLink: item.long_link || item.product_link,
            commissionRate: item.seller_commission_rate || item.default_commission_rate || '0%',
          });
        }
      }
    } catch { /* skip bad files */ }
  }

  return [...productMap.values()];
}

// ── Cluster products into SEO page topics ────────────────────────────────────
function clusterProducts(products) {
  const clusters = [];
  const now = new Date();
  const monthNames = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  const month = monthNames[now.getMonth()];
  const year = now.getFullYear();

  // Price bracket pages
  const brackets = [
    { max: 100,  label: 'Under ₱100',    slug: 'under-100' },
    { max: 300,  label: 'Under ₱300',    slug: 'under-300' },
    { max: 500,  label: 'Under ₱500',    slug: 'under-500' },
    { max: 1000, label: 'Under ₱1,000',  slug: 'under-1000' },
    { max: 2000, label: 'Under ₱2,000',  slug: 'under-2000' },
    { max: 5000, label: 'Under ₱5,000',  slug: 'under-5000' },
  ];

  for (const b of brackets) {
    const items = products
      .filter(p => p.price > 0 && p.price < b.max)
      .sort((a, z) => z.historicalSold - a.historicalSold)
      .slice(0, 15);
    if (items.length >= 5) {
      clusters.push({
        type: 'price-roundup',
        slug: `best-shopee-finds-${b.slug}-${month.toLowerCase()}-${year}`,
        title: `Best Shopee Finds ${b.label} — ${month} ${year}`,
        keyword: `best shopee products ${b.slug} pesos ${year}`,
        products: items,
        imagePool: 'deals',
        category: 'deals-steals',
      });
    }
  }

  // "Most sold" / viral products page
  const viral = products
    .filter(p => p.historicalSold >= 500 && p.price > 0)
    .sort((a, z) => z.historicalSold - a.historicalSold)
    .slice(0, 15);
  if (viral.length >= 5) {
    clusters.push({
      type: 'viral-roundup',
      slug: `viral-shopee-products-philippines-${month.toLowerCase()}-${year}`,
      title: `Most Viral Shopee Products Philippines — ${month} ${year}`,
      keyword: `viral shopee products philippines ${year}`,
      products: viral,
      imagePool: 'deals',
      category: 'deals-steals',
    });
  }

  // "Biggest discounts" page
  const discounted = products
    .filter(p => {
      const disc = parseInt(p.discount) || 0;
      return disc >= 30 && p.price > 0;
    })
    .sort((a, z) => parseInt(z.discount) - parseInt(a.discount))
    .slice(0, 15);
  if (discounted.length >= 5) {
    clusters.push({
      type: 'discount-roundup',
      slug: `biggest-shopee-discounts-${month.toLowerCase()}-${year}`,
      title: `Biggest Shopee Discounts Right Now — ${month} ${year}`,
      keyword: `shopee biggest discounts philippines ${month.toLowerCase()} ${year}`,
      products: discounted,
      imagePool: 'deals',
      category: 'deals-steals',
    });
  }

  // "Budget gadgets" (tech items under 2000)
  const budgetGadgets = products
    .filter(p => {
      const name = p.name.toLowerCase();
      return p.price > 0 && p.price < 2000 &&
        (name.includes('speaker') || name.includes('earphone') || name.includes('headphone') ||
         name.includes('bluetooth') || name.includes('charger') || name.includes('power bank') ||
         name.includes('cable') || name.includes('usb') || name.includes('phone') ||
         name.includes('tablet') || name.includes('watch') || name.includes('camera') ||
         name.includes('led') || name.includes('fan') || name.includes('lamp'));
    })
    .sort((a, z) => z.historicalSold - a.historicalSold)
    .slice(0, 12);
  if (budgetGadgets.length >= 4) {
    clusters.push({
      type: 'category-roundup',
      slug: `budget-gadgets-shopee-philippines-${month.toLowerCase()}-${year}`,
      title: `Budget Gadgets on Shopee Philippines — ${month} ${year}`,
      keyword: `budget gadgets shopee philippines ${year}`,
      products: budgetGadgets,
      imagePool: 'gadgets',
      category: 'tech-gadgets',
    });
  }

  // "Home essentials" roundup
  const homeItems = products
    .filter(p => {
      const name = p.name.toLowerCase();
      return p.price > 0 &&
        (name.includes('organizer') || name.includes('kitchen') || name.includes('storage') ||
         name.includes('towel') || name.includes('hanger') || name.includes('container') ||
         name.includes('rack') || name.includes('holder') || name.includes('mat') ||
         name.includes('curtain') || name.includes('pillow') || name.includes('blanket'));
    })
    .sort((a, z) => z.historicalSold - a.historicalSold)
    .slice(0, 12);
  if (homeItems.length >= 4) {
    clusters.push({
      type: 'category-roundup',
      slug: `home-essentials-shopee-${month.toLowerCase()}-${year}`,
      title: `Top Home Essentials on Shopee — ${month} ${year}`,
      keyword: `home essentials shopee philippines ${year}`,
      products: homeItems,
      imagePool: 'home',
      category: 'home-living',
    });
  }

  return clusters;
}

// ── Format products for Claude prompt ────────────────────────────────────────
function formatProductsForPrompt(products) {
  return products.map((p, i) => {
    const priceRange = p.priceMax && p.priceMax !== p.price
      ? `₱${p.price}–₱${p.priceMax}`
      : `₱${p.price}`;
    return [
      `${i + 1}. ${p.name}`,
      `   Price: ${priceRange}${p.originalPrice ? ` (was ₱${p.originalPrice})` : ''}`,
      `   Discount: ${p.discount || 'N/A'}`,
      `   Sold: ${p.sold}${p.historicalSold ? ` (${p.historicalSold} total)` : ''}`,
      `   Reviews: ${p.reviews}`,
      `   Link: ${p.link}`,
    ].join('\n');
  }).join('\n\n');
}

// ── Generate a single SEO page with Claude ───────────────────────────────────
async function generatePage(client, cluster, existingSlugs) {
  const productList = formatProductsForPrompt(cluster.products);

  const system = `You are a senior SEO content strategist and product reviewer for smartly.sale — a Shopee Philippines affiliate shopping guide trusted by thousands of Filipino shoppers.

Your articles:
- Rank on Google by being genuinely the best, most helpful buying guide on the topic
- Follow Google E-E-A-T principles (Experience, Expertise, Authoritativeness, Trust)
- Are written in natural Filipino-English (Taglish where appropriate) for Filipino readers
- Use proper semantic HTML
- Contain honest product opinions, not just feature lists
- Include practical buying tips and value-for-money analysis
- Use keyword-rich, descriptive anchor text for internal links`;

  const user = `Write a complete, publication-ready product roundup blog post.

TOPIC: ${cluster.title}
TARGET KEYWORD: "${cluster.keyword}"
CATEGORY: ${cluster.category}

PRODUCT DATA (real Shopee products with prices and sales data):
${productList}

ARTICLE REQUIREMENTS:
- Length: 1800-2500 words
- Title: 55-65 characters, keyword-first, include year/month
- Meta description: 150-160 characters with CTA
- Table of Contents (HTML ordered list linking to each H2)
- 5-7 H2 sections minimum:
  1. Introduction (what this roundup covers, why these products)
  2. Quick comparison table (HTML table with Name, Price, Discount, Rating columns)
  3-6. Individual product mini-reviews (group related products, 150-250 words each)
  7. Buying tips / how to get the best deal
  8. Final verdict / editor's picks
- FAQ section: 5 questions as <details><summary>Q</summary><p>A</p></details>
  (use questions real Filipino shoppers would search: "sulit ba?", "legit ba?", etc.)

PRODUCT LINKS:
- For each product mentioned, include a "Buy on Shopee" link:
  <a href="PRODUCT_LINK" target="_blank" rel="noopener noreferrer sponsored">Buy on Shopee →</a>
- Use the product_link URL from the data above

INTERNAL LINKS (choose 4-5 that fit naturally):
${buildLinkInstructions()}

Rules for internal links:
- Place links within body paragraphs naturally
- Use provided anchor text options
- Never use "click here" or "read more"
- Aim for 1 internal link per ~400 words

HTML: Use <article>, <section>, <h2 id="...">, <h3>, <p>, <ul>, <ol>, <strong>, <em>, <table>
Info boxes: <div class="info-box"><strong>Tip:</strong> ...</div>
Warning boxes: <div class="warning-box"><strong>Warning:</strong> ...</div>

RESPONSE FORMAT — use these exact tags:

<META>
{
  "title": "55-65 char title with keyword",
  "metaTitle": "SEO title variation (max 60 chars)",
  "metaDescription": "150-160 char description with CTA",
  "excerpt": "2-3 sentence plain-text summary for social sharing and TL;DR",
  "slug": "${cluster.slug}",
  "category": "${cluster.category}",
  "tags": ["tag1", "tag2", "tag3", "tag4", "tag5"],
  "keywords": ["primary keyword", "secondary keyword", "long-tail phrase", "related term", "location keyword"],
  "featuredImage": ""
}
</META>
<CONTENT>
[Write the full HTML article here — raw HTML, no escaping needed]
</CONTENT>
<FAQS>
[{"q": "Question 1?", "a": "Answer 1."}, {"q": "Question 2?", "a": "Answer 2."}, {"q": "Question 3?", "a": "Answer 3."}, {"q": "Question 4?", "a": "Answer 4."}, {"q": "Question 5?", "a": "Answer 5."}]
</FAQS>

Leave featuredImage as an empty string — the system auto-selects an image.
Write the slug exactly as: ${cluster.slug}`;

  console.log(`  Calling Claude for: "${cluster.title}"...`);

  const response = await client.messages.create({
    model: 'claude-sonnet-4-5',
    max_tokens: 12000,
    system,
    messages: [{ role: 'user', content: user }],
  });

  const fullText = response.content
    .filter(b => b.type === 'text')
    .map(b => b.text)
    .join('\n');

  // Extract blocks
  const metaRaw = extractBlock(fullText, 'META');
  const content = extractBlock(fullText, 'CONTENT');
  const faqsRaw = extractBlock(fullText, 'FAQS');

  if (!metaRaw) throw new Error('No <META> block in response');
  if (!content) throw new Error('No <CONTENT> block in response');

  const meta = JSON.parse(metaRaw);
  let faqs = [];
  try { faqs = JSON.parse(faqsRaw || '[]'); } catch { /* skip */ }

  // Resolve slug conflicts
  let slug = (meta.slug || cluster.slug)
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');

  if (existingSlugs.has(slug)) {
    slug = `${slug}-${Date.now().toString(36)}`;
    console.log(`  Slug conflict resolved: ${slug}`);
  }
  existingSlugs.add(slug);

  const pool = IMAGE_POOLS[cluster.imagePool] || IMAGE_POOLS.default;
  const featuredImage = pickFromPool(pool, slug);

  const wc = wordCount(content);

  return {
    id:              createHash('md5').update(slug).digest('hex').slice(0, 8),
    slug,
    title:           meta.title || cluster.title,
    metaTitle:       meta.metaTitle || meta.title || cluster.title,
    metaDescription: meta.metaDescription || '',
    excerpt:         meta.excerpt || '',
    content,
    featuredImage,
    featuredImageAlt: meta.title || cluster.title,
    category:        meta.category || cluster.category,
    tags:            Array.isArray(meta.tags) ? meta.tags : [],
    keywords:        Array.isArray(meta.keywords) ? meta.keywords : [],
    faqs:            Array.isArray(faqs) ? faqs : [],
    author:          'smartly.sale Team',
    publishDate:     new Date().toISOString(),
    wordCount:       wc,
    readingTime:     Math.max(1, Math.ceil(wc / 220)),
    generated:       true,
  };
}

// ── Helpers ──────────────────────────────────────────────────────────────────
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
  if (!process.env.ANTHROPIC_API_KEY) {
    throw new Error('ANTHROPIC_API_KEY environment variable is not set');
  }

  console.log('╔════════════════════════════════════════════════════════╗');
  console.log('║  Shopee Programmatic SEO Generator — smartly.sale     ║');
  console.log('╚════════════════════════════════════════════════════════╝\n');

  // Load existing posts
  const existing = existsSync(DATA_FILE)
    ? JSON.parse(readFileSync(DATA_FILE, 'utf-8'))
    : [];
  const existingSlugs = new Set(existing.map(p => p.slug));
  console.log(`Existing posts: ${existing.length}`);

  // Load and cluster products
  console.log('Loading Shopee product data...');
  const products = loadShopeeProducts();
  console.log(`Loaded ${products.length} unique products\n`);

  const clusters = clusterProducts(products);
  console.log(`Generated ${clusters.length} page clusters:`);
  clusters.forEach((c, i) => {
    const dupe = existingSlugs.has(c.slug) ? ' [SKIP — already exists]' : '';
    console.log(`  ${i + 1}. ${c.title} (${c.products.length} products)${dupe}`);
  });

  // Filter out already-generated pages
  const newClusters = clusters.filter(c => !existingSlugs.has(c.slug));
  const toGenerate = newClusters.slice(0, COUNT);

  if (toGenerate.length === 0) {
    console.log('\nNo new pages to generate — all clusters already exist.');
    return;
  }

  console.log(`\nGenerating ${toGenerate.length} pages${DRY_RUN ? ' (DRY RUN)' : ''}...\n`);

  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  const generated = [];

  for (const cluster of toGenerate) {
    try {
      const post = await generatePage(client, cluster, existingSlugs);
      generated.push(post);
      console.log(`  ✓ "${post.title}"`);
      console.log(`    URL:   /post/${post.slug}`);
      console.log(`    Words: ${post.wordCount} | Read: ${post.readingTime} min`);
      console.log(`    Image: ${post.featuredImage}\n`);
    } catch (err) {
      console.error(`  ✗ Failed: ${cluster.title} — ${err.message}\n`);
    }
  }

  if (generated.length === 0) {
    console.log('No pages were generated successfully.');
    return;
  }

  if (DRY_RUN) {
    console.log('═══════════════════════════════════════');
    console.log(`DRY RUN complete — ${generated.length} pages would be created.`);
    console.log('Run without --dry-run to save to blog-posts.json');
    return;
  }

  // Prepend new posts (newest first), cap at 500
  const updated = [...generated, ...existing].slice(0, 500);
  writeFileSync(DATA_FILE, JSON.stringify(updated, null, 2));

  console.log('═══════════════════════════════════════');
  console.log(`✓ ${generated.length} pages saved to ${DATA_FILE}`);
  console.log(`  Total posts now: ${updated.length}`);
  console.log('\nGenerated URLs:');
  generated.forEach(p => console.log(`  https://smartly.sale/post/${p.slug}`));
}

main().catch(err => {
  console.error('\nSEO page generation failed:', err.message);
  process.exit(1);
});
