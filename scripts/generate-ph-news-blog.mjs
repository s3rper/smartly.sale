#!/usr/bin/env node
/**
 * Philippine News Blog Auto-Generator — smartly.sale
 *
 * Workflow:
 *  1. Pick a news topic from rotation (Duterte/ICC, Senate, pro-Duterte bloc, general PH politics)
 *  2. Use Claude claude-sonnet-4-5 + web_search to research latest developments
 *  3. Generate a 2000-2500 word SEO-optimised news analysis article
 *  4. Prepend to src/data/blog-posts.json (same pipeline as gaming/product blogs)
 *
 * Runs via GitHub Actions: Sun & Wed at 04:00 UTC (12:00 PM PH)
 */

import Anthropic from '@anthropic-ai/sdk';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { createHash } from 'crypto';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT      = join(__dirname, '..');
const DATA_FILE = join(ROOT, 'src/data/blog-posts.json');

// ── Topic Rotation ───────────────────────────────────────────────────────────
// Each run picks a different angle. Claude uses web_search to find what's
// actually trending under that umbrella.
const NEWS_TOPICS = [
  {
    id:    'duterte-icc',
    theme: 'Duterte ICC investigation Philippines latest news',
    angle: 'Rodrigo Duterte, ICC investigation, drug war accountability, legal proceedings, international court updates',
    searchQueries: [
      'Duterte ICC investigation latest news',
      'Duterte drug war Philippines update',
      'Rodrigo Duterte news today Philippines',
    ],
  },
  {
    id:    'pro-duterte-bloc',
    theme: 'Pro-Duterte political bloc Philippines latest news',
    angle: 'Sara Duterte, Bong Go, pro-Duterte senators, political alliances, Duterte political dynasty, opposition moves',
    searchQueries: [
      'Sara Duterte news today Philippines',
      'pro-Duterte senators Philippines news',
      'Duterte allies Philippines politics latest',
    ],
  },
  {
    id:    'philippine-senate',
    theme: 'Philippine Senate news legislation latest',
    angle: 'Senate hearings, new bills, Senate investigations, senator statements, legislative updates, Senate vs House conflicts',
    searchQueries: [
      'Philippine Senate news today',
      'Senate hearing Philippines latest',
      'Philippine Senate bills legislation update',
    ],
  },
  {
    id:    'ph-politics-general',
    theme: 'Philippine politics news latest developments',
    angle: 'Marcos administration, PBBM policies, political controversies, elections, government programs, political alliances and rivalries',
    searchQueries: [
      'Philippines politics news today',
      'Marcos administration news latest',
      'Philippine government news update',
    ],
  },
  {
    id:    'ph-politics-economy',
    theme: 'Philippine political economy news',
    angle: 'government economic policies, inflation Philippines, tax reform, OFW issues, minimum wage, cost of living, political decisions affecting Filipino wallets',
    searchQueries: [
      'Philippines economy news today',
      'Philippine government economic policy latest',
      'cost of living Philippines news',
    ],
  },
  {
    id:    'ph-elections',
    theme: 'Philippine elections and political campaigns news',
    angle: 'midterm elections, campaign updates, Comelec decisions, political parties, election controversies, voter issues',
    searchQueries: [
      'Philippines elections news latest',
      'Comelec Philippines update',
      'Philippine midterm elections news',
    ],
  },
];

// Pick topic: deterministic rotation by day-of-year
function pickTopic() {
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0)) / 86400000);
  return NEWS_TOPICS[dayOfYear % NEWS_TOPICS.length];
}

// ── Image Pools ──────────────────────────────────────────────────────────────
// Philippine news / politics themed Unsplash photos
const IMAGE_POOLS = {
  'duterte-icc': [
    'photo-1589994965851-a8f479c573a9', // justice / gavel
    'photo-1436450412740-6b6a0727e78b', // court building
    'photo-1575505586569-646b2ca898fc', // newspaper
    'photo-1504711434969-e33886168d6c', // world news
  ],
  'pro-duterte-bloc': [
    'photo-1529107386315-e1a2ed48a620', // government building
    'photo-1575505586569-646b2ca898fc', // newspaper
    'photo-1495020689067-958852a7765e', // crowd / rally
    'photo-1504711434969-e33886168d6c', // news
  ],
  'philippine-senate': [
    'photo-1529107386315-e1a2ed48a620', // government building
    'photo-1436450412740-6b6a0727e78b', // legislative hall
    'photo-1589994965851-a8f479c573a9', // law / gavel
    'photo-1575505586569-646b2ca898fc', // newspaper
  ],
  'ph-politics-general': [
    'photo-1529107386315-e1a2ed48a620', // government
    'photo-1504711434969-e33886168d6c', // news
    'photo-1575505586569-646b2ca898fc', // newspaper
    'photo-1495020689067-958852a7765e', // crowd
  ],
  'ph-politics-economy': [
    'photo-1611974789855-9c2a0a7236a3', // stocks / economy
    'photo-1526304640581-d334cdbbf45e', // money / coins
    'photo-1504711434969-e33886168d6c', // news
    'photo-1575505586569-646b2ca898fc', // newspaper
  ],
  'ph-elections': [
    'photo-1495020689067-958852a7765e', // crowd / rally
    'photo-1529107386315-e1a2ed48a620', // government
    'photo-1575505586569-646b2ca898fc', // newspaper
    'photo-1504711434969-e33886168d6c', // news
  ],
  default: [
    'photo-1529107386315-e1a2ed48a620',
    'photo-1575505586569-646b2ca898fc',
    'photo-1504711434969-e33886168d6c',
    'photo-1495020689067-958852a7765e',
    'photo-1589994965851-a8f479c573a9',
  ],
};

function unsplashUrl(photoId) {
  return `https://images.unsplash.com/${photoId}?w=1200&h=630&fit=crop&q=80`;
}

function pickImage(topicId, slug) {
  const pool = IMAGE_POOLS[topicId] ?? IMAGE_POOLS.default;
  const hashHex = createHash('md5').update(slug || 'default').digest('hex');
  const idx = parseInt(hashHex.slice(0, 6), 16) % pool.length;
  return unsplashUrl(pool[idx]);
}

// ── Internal Link Map ────────────────────────────────────────────────────────
const INTERNAL_LINK_MAP = {
  universal: [
    { href: '/products',    anchors: ['best deals on Shopee Philippines', 'trending Shopee products', 'top Shopee deals'] },
    { href: '/earn-gcash',  anchors: ['earn free GCash online Philippines', 'free GCash Philippines 2026', 'legit ways to earn GCash'] },
    { href: '/best-deals',  anchors: ['best deals Philippines today', 'top online deals Philippines', 'hottest deals this week PH'] },
    { href: '/earn',        anchors: ['earn money online Philippines', 'legit online earning Philippines', 'ways to earn extra income PH'] },
  ],
  news: [
    { href: '/daily',                anchors: ['daily deals Philippines', 'Shopee daily deals today', 'daily online deals PH'] },
    { href: '/shopee-sales-2026',    anchors: ['Shopee sales calendar 2026', 'upcoming Shopee mega sales', 'next Shopee sale date'] },
    { href: '/free-gift-cards-philippines', anchors: ['free gift cards Philippines', 'free e-gift cards PH', 'claim free gift cards Philippines'] },
  ],
};

function buildLinkInstructions() {
  const allLinks = [...INTERNAL_LINK_MAP.universal, ...INTERNAL_LINK_MAP.news];
  return allLinks.map(({ href, anchors }) =>
    `  • ${href}  →  anchors: "${anchors.join('" | "')}"`
  ).join('\n');
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

function readingTime(html) {
  return Math.max(1, Math.ceil(wordCount(html) / 220));
}

// ── Claude Generation ────────────────────────────────────────────────────────
async function generatePost(topicConfig) {
  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  const currentMonth = new Date().toLocaleString('en-PH', { month: 'long', timeZone: 'Asia/Manila' });
  const currentYear  = new Date().getFullYear();

  const system = `You are a senior Philippine political journalist and SEO content strategist for smartly.sale — a popular Filipino deals and news website.

Your news articles:
- Are factual, well-sourced, and balanced — report multiple perspectives fairly
- Follow Google E-E-A-T (Experience, Expertise, Authoritativeness, Trust)
- Include specific dates, names, bill numbers, and verifiable facts
- Are written for Filipino readers who care about their country's politics
- Use proper semantic HTML throughout
- Present facts and analysis — avoid sensationalism or unverified claims
- Use keyword-rich, descriptive anchor text for every internal link (never "click here" or "read more")
- Place internal links contextually within paragraph body text for maximum SEO value
- IMPORTANT: Always attribute claims to their sources (e.g., "according to...", "as reported by...")
- Present all sides of political issues fairly — do not take partisan positions`;

  const searchInstructions = topicConfig.searchQueries
    .map(q => `   - "${q} ${currentYear}"`)
    .join('\n');

  const user = `Research and write a complete, publication-ready news analysis article about Philippine politics.

TOPIC: ${topicConfig.theme}
FOCUS: ${topicConfig.angle}
MONTH/YEAR: ${currentMonth} ${currentYear}

YOUR TASK:
1. Use web_search to find what's ACTUALLY happening RIGHT NOW:
${searchInstructions}
   - Also search for reactions from key political figures and analysts

2. Based on your research, write a comprehensive news analysis article

ARTICLE REQUIREMENTS:
- Length: 2000-2500 words of factual, well-sourced content
- Title: 55-65 characters, keyword-first, includes current month/year or "Latest"
- Meta description: 155-160 characters ending with a CTA
- Table of Contents: HTML ordered list with anchor links to each H2
- 6-8 H2 sections with H3 subsections covering:
  • What happened (the latest developments)
  • Key players involved
  • Background/context for readers
  • Reactions from different political camps
  • Analysis: what this means for Filipinos
  • What to watch next
- REAL details: specific dates, names, quotes (attributed), bill numbers, official statements
- Multiple perspectives: government position, opposition view, analyst opinions
- FAQ section: 5 questions as <details><summary>Q</summary><p>A</p></details>

EDITORIAL GUIDELINES:
- Be factual and balanced — present all sides
- Attribute all claims: "according to Senator X", "as reported by Inquirer"
- Avoid sensationalism — use measured, professional tone
- Include context so readers understand why this matters
- Filipino-English is fine for natural readability (e.g., common Tagalog political terms)

INTERNAL LINKS (choose 3-4 most contextually relevant — weave naturally into the article):
${buildLinkInstructions()}

Rules for internal links:
- Place links naturally WITHIN body paragraphs (not in lists/headings)
- Use one of the provided anchor text options — pick the most natural fit
- Vary anchor text: never use the same anchor twice
- Aim for 1 internal link per ~500-600 words
- Transition naturally, e.g., "While following these political developments, many Filipinos are also looking for [anchor text link] to cope with rising costs."

- 2-3 external authority links with rel="nofollow noopener" target="_blank" (use reputable PH news sources: Inquirer, Rappler, Philstar, ABS-CBN News, GMA News, Manila Bulletin)
- Closing paragraph with forward-looking analysis

HTML ELEMENTS TO USE:
- Structure: <article>, <section>, <h2 id="...">, <h3>, <p>, <ul>, <ol>, <strong>, <em>, <blockquote>
- Key quotes: <blockquote><p>"Quote here."</p><cite>— Name, Position</cite></blockquote>
- Info boxes: <div class="info-box"><strong>📌 Key Point:</strong> ...</div>
- Warning boxes: <div class="warning-box"><strong>⚠️ Developing Story:</strong> ...</div>

RESPONSE FORMAT — use these exact tags:

<META>
{
  "title": "Your 55-65 char title",
  "metaTitle": "Same or slight variation with Philippines keyword",
  "metaDescription": "155-160 char description ending with CTA",
  "excerpt": "2-3 sentence plain-text summary of the key developments",
  "slug": "keyword-rich-url-slug-here",
  "category": "philippine-news",
  "tags": ["tag1", "tag2", "tag3", "tag4", "tag5"],
  "keywords": ["primary keyword Philippines", "secondary keyword", "long-tail news phrase"],
  "featuredImage": ""
}
</META>
<CONTENT>
[Full HTML article here — raw HTML, no escaping needed]
</CONTENT>
<FAQS>
[{"q": "Question 1?", "a": "Answer 1."}, {"q": "Question 2?", "a": "Answer 2."}, {"q": "Question 3?", "a": "Answer 3."}, {"q": "Question 4?", "a": "Answer 4."}, {"q": "Question 5?", "a": "Answer 5."}]
</FAQS>

Leave featuredImage empty — the system assigns it automatically.`;

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

  const metaRaw = extractBlock(fullText, 'META');
  const content = extractBlock(fullText, 'CONTENT');
  const faqsRaw = extractBlock(fullText, 'FAQS');

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

// ── Main ─────────────────────────────────────────────────────────────────────
async function main() {
  if (!process.env.ANTHROPIC_API_KEY) {
    throw new Error('ANTHROPIC_API_KEY environment variable is not set');
  }

  const existing = existsSync(DATA_FILE)
    ? JSON.parse(readFileSync(DATA_FILE, 'utf-8'))
    : [];

  console.log(`Existing posts: ${existing.length}`);

  const topicConfig = pickTopic();
  console.log(`\nSelected topic: ${topicConfig.id}`);
  console.log(`Theme: ${topicConfig.theme}\n`);

  const raw = await generatePost(topicConfig);

  // Sanitise slug
  let slug = (raw.slug || '')
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');

  if (!slug) slug = `ph-news-${topicConfig.id}-${Date.now()}`;

  if (existing.some(p => p.slug === slug)) {
    slug = `${slug}-${new Date().toISOString().slice(0, 10)}`;
    console.log(`  Slug conflict resolved: ${slug}`);
  }

  const featuredImage = pickImage(topicConfig.id, slug);

  const post = {
    id:              createHash('md5').update(slug).digest('hex').slice(0, 8),
    slug,
    title:           raw.title || 'Philippine News Update',
    metaTitle:       raw.metaTitle || raw.title,
    metaDescription: raw.metaDescription || '',
    excerpt:         raw.excerpt || '',
    content:         raw.content,
    featuredImage,
    featuredImageAlt: raw.title || '',
    category:        'philippine-news',
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
  console.error('\nPH news blog generation failed:', err.message);
  process.exit(1);
});
