#!/usr/bin/env node
/**
 * Product Research Blog Auto-Generator — smartly.sale
 *
 * Workflow:
 *  1. Pick a product category based on day-of-week rotation + seasonal weighting
 *  2. Use Claude claude-sonnet-4-5 + web_search to research what's actually trending
 *     on Shopee Philippines, TikTok, and social media right now
 *  3. Generate a 2000-2500 word SEO-optimised buying guide / product article
 *  4. Prepend to src/data/blog-posts.json (same pipeline as gaming blog)
 *
 * Runs via GitHub Actions: Tue / Thu / Sat at 03:00 UTC (11:00 AM PH)
 * Alternates with gaming blog (Mon / Wed / Fri) → 6 fresh posts/week total
 */

import Anthropic from '@anthropic-ai/sdk';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { createHash } from 'crypto';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT      = join(__dirname, '..');
const DATA_FILE = join(ROOT, 'src/data/blog-posts.json');

// ── Category Rotation ──────────────────────────────────────────────────────────
// Each entry defines what Claude should research and which blog category to use.
// Seasonal weights boost relevance (1 = normal, 2 = boosted this season).
const PRODUCT_CATEGORIES = [
  {
    id:       'tech-gadgets',
    category: 'tech-gadgets',
    theme:    'best tech gadgets and electronics Philippines',
    angle:    'budget-friendly tech gadgets, smart home devices, productivity tools available on Shopee Philippines',
    season:   { all: 2 }, // always popular
  },
  {
    id:       'home-living',
    category: 'home-living',
    theme:    'best home and living products Philippines',
    angle:    'home decor, organization products, aesthetic room essentials trending on Shopee Philippines',
    season:   { all: 1 },
  },
  {
    id:       'beauty-wellness',
    category: 'beauty-wellness',
    theme:    'best beauty skincare wellness products Philippines',
    angle:    'Korean skincare, trending beauty products, self-care essentials affordable on Shopee Philippines',
    season:   { all: 2 },
  },
  {
    id:       'kitchen-hacks',
    category: 'kitchen-hacks',
    theme:    'best kitchen gadgets and cooking tools Philippines',
    angle:    'viral kitchen gadgets, time-saving cooking tools, affordable kitchen essentials on Shopee Philippines',
    season:   { all: 1 },
  },
  {
    id:       'budget-shopping',
    category: 'budget-shopping',
    theme:    'best budget finds and affordable products Philippines',
    angle:    'best Shopee finds under PHP 500, budget-friendly products with great reviews, value-for-money items',
    season:   { all: 2 },
  },
  {
    id:       'fashion-style',
    category: 'fashion-style',
    theme:    'trending fashion and clothing Philippines',
    angle:    'trending fashion finds, affordable outfit ideas, viral clothing items on Shopee Philippines TikTok',
    season:   { all: 1 },
  },
  {
    id:       'home-organization',
    category: 'home-organization',
    theme:    'best home organization and storage products Philippines',
    angle:    'storage solutions, decluttering products, space-saving organizers popular on Shopee Philippines',
    season:   { all: 1 },
  },
  {
    id:       'product-reviews',
    category: 'product-reviews',
    theme:    'most viral and trending products Philippines right now',
    angle:    'viral Shopee products 2025-2026, TikTok made me buy it items, bestsellers Philippines this month',
    season:   { all: 2 },
  },
  {
    id:       'buying-guides',
    category: 'buying-guides',
    theme:    'smart buying guide for popular product category Philippines',
    angle:    'comprehensive buyer\'s guide comparing popular products, what to look for, best value options on Shopee PH',
    season:   { all: 1 },
  },
  {
    id:       'sustainability',
    category: 'sustainability',
    theme:    'best eco-friendly and sustainable products Philippines',
    angle:    'eco-friendly alternatives, reusable products, sustainable lifestyle items affordable on Shopee Philippines',
    season:   { all: 1 },
  },
];

// Pick category: deterministic rotation by day-of-year so each run gets a different category
function pickCategory() {
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0)) / 86400000);
  // Weight doubled categories get two slots in the pool
  const pool = PRODUCT_CATEGORIES.flatMap(c => {
    const weight = c.season.all ?? 1;
    return Array(weight).fill(c);
  });
  return pool[dayOfYear % pool.length];
}

// ── Image Pools ────────────────────────────────────────────────────────────────
// Curated Unsplash photo IDs by product category — all verified 200 OK
const IMAGE_POOLS = {
  'tech-gadgets': [
    'photo-1518770660439-4636190af475', // circuit board
    'photo-1496181133206-80ce9b88a853', // laptop setup
    'photo-1526374965328-7f61d4dc18c5', // code screen neon
    'photo-1485827404703-89b55fcc595e', // robot / AI
    'photo-1558618666-fcd25c85cd64',    // Nintendo controller (generic gadget)
    'photo-1609151376730-f246ec0b99e5', // smart watch
  ],
  'home-living': [
    'photo-1556909114-f6e7ad7d3136', // kitchen counter
    'photo-1484154218962-a197022b5858', // modern kitchen
    'photo-1513694203232-719a280e022f', // cozy living room
    'photo-1586023492125-27b2c045efd7', // modern sofa
    'photo-1555041469-a586c61ea9bc', // gray couch
  ],
  'beauty-wellness': [
    'photo-1596755389378-c31d21fd1273', // skincare products
    'photo-1571781926291-c477ebfd024b', // face cream
    'photo-1522335789203-aabd1fc54bc9', // makeup brushes
    'photo-1508214751196-bcfd4ca60f91', // woman skincare routine
    'photo-1559056199-641a0ac8b55e', // beauty flatlay
  ],
  'kitchen-hacks': [
    'photo-1556909114-f6e7ad7d3136', // kitchen
    'photo-1466637574441-749b8f19452f', // kitchen tools
    'photo-1556909172-8c2f041fca1e', // cooking setup
    'photo-1574269909862-7e1d70bb8078', // modern kitchen appliance
    'photo-1590779033100-9f60a05a013d', // coffee maker
  ],
  'budget-shopping': [
    'photo-1607082348824-0a96f2a4b9da', // online shopping
    'photo-1556742111-a301076d9d18', // shopping cart
    'photo-1556742502-ec7c0e9f34b1', // shopping bags
    'photo-1472851294608-062f824d29cc', // shopping haul
    'photo-1483985988355-763728e1935b', // shopping fashion
  ],
  'fashion-style': [
    'photo-1441986300917-64674bd600d8', // fashion store
    'photo-1483985988355-763728e1935b', // fashion shopping
    'photo-1558618666-fcd25c85cd64',    // clothing rack
    'photo-1469334031218-e382a71b716b', // fashion outfit
    'photo-1515886657613-9f3515b0c78f', // model fashion
  ],
  'home-organization': [
    'photo-1595428774223-ef52624120d2', // organized closet
    'photo-1558618047-3c8c76ca7d13', // organized shelf
    'photo-1507003211169-0a1dd7228f2d', // storage boxes
    'photo-1484101403633-562f891dc89a', // clean desk
    'photo-1556909114-f6e7ad7d3136', // organized kitchen
  ],
  'product-reviews': [
    'photo-1607082348824-0a96f2a4b9da', // online shopping
    'photo-1556742049-0cfed4f6a45d', // shopping research
    'photo-1556740749-887f6717d7e4', // product unboxing
    'photo-1556742111-a301076d9d18', // products
    'photo-1472851294608-062f824d29cc', // haul
  ],
  'buying-guides': [
    'photo-1556742049-0cfed4f6a45d', // research / laptop
    'photo-1507003211169-0a1dd7228f2d', // choosing products
    'photo-1484101403633-562f891dc89a', // desk with products
    'photo-1583394293214-0b7b0b71cd0a', // comparison
    'photo-1486312338219-ce68d2c6f44d', // guide / research
  ],
  'sustainability': [
    'photo-1542601906990-b4d3fb778b09', // eco / nature
    'photo-1497435334941-8c899ee9e8e9', // eco products
    'photo-1567306226416-28f0efdc88ce', // green living
    'photo-1556742111-a301076d9d18', // reusable products
    'photo-1542601906990-b4d3fb778b09', // sustainability
  ],
  default: [
    'photo-1607082348824-0a96f2a4b9da',
    'photo-1556742111-a301076d9d18',
    'photo-1556742502-ec7c0e9f34b1',
    'photo-1472851294608-062f824d29cc',
    'photo-1483985988355-763728e1935b',
    'photo-1484101403633-562f891dc89a',
  ],
};

function unsplashUrl(photoId) {
  return `https://images.unsplash.com/${photoId}?w=1200&h=630&fit=crop&q=80`;
}

function pickImage(categoryId, slug) {
  const pool = IMAGE_POOLS[categoryId] ?? IMAGE_POOLS.default;
  const hashHex = createHash('md5').update(slug || 'default').digest('hex');
  const idx = parseInt(hashHex.slice(0, 6), 16) % pool.length;
  return unsplashUrl(pool[idx]);
}

// ── Internal Link Map ──────────────────────────────────────────────────────────
// Same structure as generate-blog.mjs — category-grouped with anchor text options
const INTERNAL_LINK_MAP = {
  universal: [
    { href: '/products',    anchors: ['best deals on Shopee Philippines', 'trending Shopee products 2026', 'top Shopee deals Philippines'] },
    { href: '/earn-gcash',  anchors: ['earn free GCash online Philippines', 'free GCash Philippines 2026', 'legit ways to earn GCash'] },
    { href: '/best-deals',  anchors: ['best deals Philippines today', 'top online deals Philippines', 'hottest deals this week PH'] },
    { href: '/earn',        anchors: ['earn money online Philippines', 'legit online earning Philippines', 'ways to earn extra income PH'] },
  ],
  shopping: [
    { href: '/daily',                anchors: ['daily deals Philippines', 'Shopee daily deals today', 'daily online deals PH'] },
    { href: '/shopee-sales-2026',    anchors: ['Shopee sales calendar 2026', 'upcoming Shopee mega sales', 'next Shopee sale date'] },
    { href: '/shopee-ai-assistant',  anchors: ['Shopee AI shopping assistant', 'AI product finder Philippines', 'smart Shopee product search'] },
    { href: '/free-gift-cards-philippines', anchors: ['free gift cards Philippines', 'free e-gift cards PH', 'claim free gift cards Philippines'] },
    { href: '/win-free-phone',       anchors: ['win a free phone Philippines', 'free smartphone giveaway Philippines', 'win free gadget online PH'] },
    { href: '/online-contests-philippines', anchors: ['online contests Philippines 2026', 'join contests Philippines', 'online giveaways Philippines'] },
  ],
};

function buildLinkInstructions() {
  const allLinks = [...INTERNAL_LINK_MAP.universal, ...INTERNAL_LINK_MAP.shopping];
  return allLinks.map(({ href, anchors }) =>
    `  • ${href}  →  anchors: "${anchors.join('" | "')}"`
  ).join('\n');
}

// ── Helpers ────────────────────────────────────────────────────────────────────
function extractBlock(text, tag) {
  const re = new RegExp(`<${tag}>\\s*([\\s\\S]*?)\\s*<\\/${tag}>`, 'i');
  const m = text.match(re);
  return m ? m[1].trim() : null;
}

function wordCount(html) {
  return html.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length;
}

function readingTime(html) {
  return Math.max(1, Math.ceil(wordCount(html) / 220));
}

// ── Claude Generation ──────────────────────────────────────────────────────────
async function generatePost(topicConfig) {
  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  const currentMonth = new Date().toLocaleString('en-PH', { month: 'long', timeZone: 'Asia/Manila' });
  const currentYear  = new Date().getFullYear();

  const system = `You are a senior product journalist and SEO content strategist for smartly.sale — a Shopee deals and product discovery website popular in the Philippines.

Your product articles:
- Are genuinely the most helpful, specific buying guides on the internet for Filipino shoppers
- Follow Google E-E-A-T (Experience, Expertise, Authoritativeness, Trust) — include real prices in PHP, specific product names, seller tips
- Feature products actually available on Shopee Philippines with realistic PHP price ranges
- Are written for real Filipino consumers, not bots
- Use proper semantic HTML throughout
- Include specific, actionable buying advice Filipino shoppers care about
- Use keyword-rich, descriptive anchor text for every internal link (never "click here" or "read more")
- Place internal links contextually within paragraph body text for maximum SEO value`;

  const user = `Research and write a complete, publication-ready product buying guide for Filipino shoppers.

TOPIC: ${topicConfig.theme}
FOCUS: ${topicConfig.angle}
MONTH/YEAR: ${currentMonth} ${currentYear}

YOUR TASK:
1. Use web_search to find what's actually trending RIGHT NOW:
   - Search for trending ${topicConfig.theme} on Shopee Philippines ${currentYear}
   - Search for viral ${topicConfig.theme} TikTok Philippines ${currentYear}
   - Search for best ${topicConfig.theme} Philippines reviews ${currentYear}
   - Search for ${topicConfig.theme} price Philippines ${currentYear}

2. Based on your research, write a comprehensive product guide featuring 8-12 REAL, SPECIFIC products

ARTICLE REQUIREMENTS:
- Length: 2000-2500 words of genuine, helpful content
- Title: 55-65 characters, keyword-first, includes "Philippines" or "PH" or year
- Meta description: 155-160 characters ending with a CTA
- Table of Contents: HTML ordered list with anchor links to each H2
- 6-8 H2 sections with H3 subsections
- REAL product details: specific product names, PHP price ranges (₱XXX–₱X,XXX), why it's trending, where to buy, what to look for
- Comparison or "best for" callouts (e.g., "Best for small budgets", "Best premium pick")
- Practical Filipino shopper tips: how to use Shopee vouchers, flash sales, verified sellers
- FAQ section: 5 questions as <details><summary>Q</summary><p>A</p></details>

INTERNAL LINKS (choose 4-5 most contextually relevant):
${buildLinkInstructions()}

Rules for internal links:
- Place links naturally WITHIN body paragraphs (not in lists/headings)
- Use one of the provided anchor text options — pick the most natural fit for the sentence
- Vary anchor text: never use the same anchor twice
- Do NOT use generic anchors like "click here", "this page", "here"
- Aim for 1 internal link per ~400-500 words

- 2 external authority links with rel="nofollow noopener" target="_blank" (use reputable sources like consumer review sites, official brand pages, or well-known tech/lifestyle publications)
- Closing CTA paragraph encouraging readers to browse products or earn GCash

HTML ELEMENTS TO USE:
- Structure: <article>, <section>, <h2 id="...">, <h3>, <p>, <ul>, <ol>, <strong>, <em>, <table>
- Info boxes: <div class="info-box"><strong>💡 Tip:</strong> ...</div>
- Warning boxes: <div class="warning-box"><strong>⚠️ Watch out:</strong> ...</div>
- Price callouts: <div class="info-box"><strong>💰 Price range:</strong> ₱XXX–₱X,XXX on Shopee PH</div>

RESPONSE FORMAT — use these exact tags (prevents JSON/HTML escaping issues):

<META>
{
  "title": "Your 55-65 char title",
  "metaTitle": "Same or slight variation",
  "metaDescription": "155-160 char description ending with CTA",
  "excerpt": "2-3 sentence plain-text summary of what the article covers",
  "slug": "keyword-rich-url-slug-here",
  "category": "${topicConfig.category}",
  "tags": ["tag1", "tag2", "tag3", "tag4", "tag5"],
  "keywords": ["primary keyword Philippines", "secondary keyword", "long-tail buying phrase"],
  "featuredImage": ""
}
</META>
<CONTENT>
[Full HTML article here — raw HTML, no escaping needed]
</CONTENT>
<FAQS>
[{"q": "Question 1?", "a": "Answer 1."}, {"q": "Question 2?", "a": "Answer 2."}, {"q": "Question 3?", "a": "Answer 3."}, {"q": "Question 4?", "a": "Answer 4."}, {"q": "Question 5?", "a": "Answer 5."}]
</FAQS>

Leave featuredImage empty — the system assigns it automatically based on category.`;

  console.log(`Researching topic: "${topicConfig.theme}"`);
  console.log('Calling Claude claude-sonnet-4-5 with web_search...');

  const MODEL         = 'claude-sonnet-4-5';
  const MAX_TOKENS    = 16000;
  const MAX_CONTINUES = 5;

  async function runWithWebSearch() {
    const messages      = [{ role: 'user', content: user }];
    const allTextBlocks = [];
    let continuations   = 0;

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

      console.log(`  stop_reason: ${response.stop_reason} | text: ${textBlocks.length} blocks | total: ${allTextBlocks.length}`);

      if (response.stop_reason === 'end_turn') break;

      if (response.stop_reason === 'pause_turn') {
        if (++continuations > MAX_CONTINUES) {
          console.warn('  Max continuations reached — using collected text');
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

      console.warn(`  Unexpected stop_reason: ${response.stop_reason}`);
      break;
    }

    return allTextBlocks.map(b => b.text).join('\n');
  }

  let fullText;
  try {
    fullText = await runWithWebSearch();
  } catch (err) {
    console.warn('  Web search failed, falling back to knowledge-only:', err.message);
    const response = await client.messages.create({
      model: MODEL,
      max_tokens: MAX_TOKENS,
      system,
      messages: [{ role: 'user', content: user }],
    });
    fullText = response.content
      .filter(b => b.type === 'text')
      .map(b => b.text)
      .join('\n');
  }

  console.log(`  Response length: ${fullText.length} chars`);
  console.log(`  Has <META>: ${fullText.includes('<META>')}`);
  console.log(`  Has <CONTENT>: ${fullText.includes('<CONTENT>')}`);
  console.log(`  Has <FAQS>: ${fullText.includes('<FAQS>')}`);

  const metaRaw   = extractBlock(fullText, 'META');
  const content   = extractBlock(fullText, 'CONTENT');
  const faqsRaw   = extractBlock(fullText, 'FAQS');

  if (!metaRaw) throw new Error('No <META> block in response');
  if (!content)  throw new Error('No <CONTENT> block in response');

  let meta;
  try {
    meta = JSON.parse(metaRaw);
  } catch (err) {
    throw new Error(`Failed to parse META JSON: ${err.message}\n\n${metaRaw.slice(0, 400)}`);
  }

  let faqs = [];
  if (faqsRaw) {
    try { faqs = JSON.parse(faqsRaw); }
    catch { console.warn('  Could not parse FAQS block, skipping'); }
  }

  return { ...meta, content, faqs };
}

// ── Main ───────────────────────────────────────────────────────────────────────
async function main() {
  if (!process.env.ANTHROPIC_API_KEY) {
    throw new Error('ANTHROPIC_API_KEY environment variable is not set');
  }

  const existing = existsSync(DATA_FILE)
    ? JSON.parse(readFileSync(DATA_FILE, 'utf-8'))
    : [];

  console.log(`Existing posts: ${existing.length}`);

  const topicConfig = pickCategory();
  console.log(`\nSelected category: ${topicConfig.id}`);
  console.log(`Theme: ${topicConfig.theme}\n`);

  const raw = await generatePost(topicConfig);

  // Sanitise slug
  let slug = (raw.slug || '')
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');

  if (!slug) slug = `${topicConfig.id}-guide-${Date.now()}`;

  if (existing.some(p => p.slug === slug)) {
    slug = `${slug}-${new Date().toISOString().slice(0, 10)}`;
    console.log(`  Slug conflict resolved: ${slug}`);
  }

  // Force the category to match the chosen topic (override any Claude hallucination)
  const category = topicConfig.category;

  const featuredImage = pickImage(topicConfig.id, slug);

  const post = {
    id:              createHash('md5').update(slug).digest('hex').slice(0, 8),
    slug,
    title:           raw.title || `Best ${topicConfig.theme} Guide`,
    metaTitle:       raw.metaTitle || raw.title,
    metaDescription: raw.metaDescription || '',
    excerpt:         raw.excerpt || '',
    content:         raw.content,
    featuredImage,
    featuredImageAlt: raw.title || '',
    category,
    tags:            Array.isArray(raw.tags)     ? raw.tags     : [],
    keywords:        Array.isArray(raw.keywords) ? raw.keywords : [],
    faqs:            Array.isArray(raw.faqs)     ? raw.faqs     : [],
    author:          'smartly.sale Team',
    publishDate:     new Date().toISOString(),
    wordCount:       wordCount(raw.content),
    readingTime:     readingTime(raw.content),
    generated:       true,
  };

  console.log(`\n✅ Generated: "${post.title}"`);
  console.log(`   URL:      /blog/${post.slug}`);
  console.log(`   Category: ${post.category}`);
  console.log(`   Words:    ${post.wordCount}`);
  console.log(`   Read:     ${post.readingTime} min`);
  console.log(`   Image:    ${post.featuredImage}`);

  // Newest first, cap at 300
  const updated = [post, ...existing].slice(0, 300);
  writeFileSync(DATA_FILE, JSON.stringify(updated, null, 2));
  console.log(`\nSaved → ${DATA_FILE}`);
}

main().catch(err => {
  console.error('\nProduct blog generation failed:', err.message);
  process.exit(1);
});
