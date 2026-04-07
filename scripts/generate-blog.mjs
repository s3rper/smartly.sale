#!/usr/bin/env node
/**
 * Gaming Blog Auto-Generator -- smartly.sale
 *
 * Workflow:
 *  1. Fetch latest headlines from gaming RSS feeds
 *  2. Use Claude claude-sonnet-4-5 + web_search to research the trending topic
 *  3. Generate a 2000-2500 word SEO-optimised article
 *  4. Prepend to src/data/blog-posts.json
 *
 * Runs via GitHub Actions: Mon / Wed / Fri at 02:00 UTC (10:00 AM PH)
 */

import Anthropic from '@anthropic-ai/sdk';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { createHash } from 'crypto';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT      = join(__dirname, '..');
const DATA_FILE = join(ROOT, 'src/data/blog-posts.json');

// RSS feeds
const RSS_FEEDS = [
  { url: 'https://feeds.ign.com/ign/all',              source: 'IGN' },
  { url: 'https://www.polygon.com/rss/index.xml',      source: 'Polygon' },
  { url: 'https://www.gamespot.com/feeds/mashup/',     source: 'GameSpot' },
  { url: 'https://blog.playstation.com/feed/',         source: 'PlayStation Blog' },
  { url: 'https://news.xbox.com/en-us/feed/',          source: 'Xbox Wire' },
  { url: 'https://www.pcgamer.com/rss/',               source: 'PC Gamer' },
];

// Curated pools — all IDs verified 200 OK as of 2026-04-07.
// Each post picks from its topic pool using slug-hash so the same slug
// always gets the same image; different slugs get different images.
const TOPIC_IMAGE_POOLS = {
  playstation: [
    'photo-1606144042614-b2417e99c4e3', // PS controller
    'photo-1592155931584-901ac15763e3',
    'photo-1526374965328-7f61d4dc18c5',
    'photo-1553481187-be93c21490a9',    // gamepad
  ],
  xbox: [
    'photo-1621259182978-fbf93132d53d', // Xbox Series X
    'photo-1553481187-be93c21490a9',
    'photo-1560419015-7c427e8ae5ba',
  ],
  nintendo: [
    'photo-1612287230202-1ff1d85d1bdf',
    'photo-1585620385456-4759f9b5c7d9',
    'photo-1558618666-fcd25c85cd64',
  ],
  roblox: [
    'photo-1633356122544-f134324a6cee',
    'photo-1640955014216-75201056c829',
  ],
  minecraft: [
    'photo-1558618666-fcd25c85cd64',
    'photo-1607853202273-797f1c22a38e',
    'photo-1548686304-89d188a80029',
  ],
  mobile: [
    'photo-1552820728-8b83bb6b773f',    // mobile gaming
    'photo-1512941937669-90a1b58e7e9c',
    'photo-1485827404703-89b55fcc595e',
  ],
  esports: [
    'photo-1593642702821-c8da6771f0c6', // esports arena
    'photo-1546519638-68e109498ffc',
    'photo-1542751110-97427bbecf20',
    'photo-1551698618-1dfe5d97d256',
  ],
  fortnite: [
    'photo-1616588589676-62b3bd4ff6d2',
    'photo-1493711662062-fa541adb3fc8',
    'photo-1542751371-adc38448a05e',
  ],
  valorant: [
    'photo-1542751110-97427bbecf20',
    'photo-1597872200969-2b65d56bd16b',
    'photo-1593642702821-c8da6771f0c6',
  ],
  gta: [
    'photo-1612287230202-1ff1d85d1bdf',
    'photo-1550745165-9bc0b252726f',
    'photo-1493711662062-fa541adb3fc8',
  ],
  genshin: [
    'photo-1614294149010-950b698f72c0',
    'photo-1625895197185-efcec01cffe0',
    'photo-1551103782-8ab07afd45c1',
    'photo-1563207153-f403bf289096',
  ],
  pokemon: [
    'photo-1612287230202-1ff1d85d1bdf',
    'photo-1633356122544-f134324a6cee',
    'photo-1585620385456-4759f9b5c7d9',
  ],
  callofduty: [
    'photo-1542751110-97427bbecf20',
    'photo-1546519638-68e109498ffc',
    'photo-1551698618-1dfe5d97d256',
  ],
  apex: [
    'photo-1593642702821-c8da6771f0c6',
    'photo-1542751110-97427bbecf20',
    'photo-1597872200969-2b65d56bd16b',
  ],
  // default pool — wide variety of verified gaming photos
  default: [
    'photo-1542751371-adc38448a05e',    // dark gaming desk
    'photo-1493711662062-fa541adb3fc8', // gaming setup
    'photo-1550745165-9bc0b252726f',    // gaming monitors
    'photo-1486572788966-cfd3df1f5b42', // gaming keyboard
    'photo-1614294149010-950b698f72c0', // gaming chair glow
    'photo-1563207153-f403bf289096',    // gaming headset
    'photo-1551103782-8ab07afd45c1',    // controller closeup
    'photo-1625895197185-efcec01cffe0', // gaming room
    'photo-1616588589676-62b3bd4ff6d2', // neon gaming
    'photo-1597872200969-2b65d56bd16b', // gaming mouse
    'photo-1612287230202-1ff1d85d1bdf', // handheld gaming
    'photo-1560419015-7c427e8ae5ba',    // gaming setup wide
  ],
};

// Build the Unsplash URL from a photo ID
function unsplashUrl(photoId) {
  return `https://images.unsplash.com/${photoId}?w=1200&h=630&fit=crop&q=80`;
}

// Pick from a pool using the slug hash — same slug always → same image,
// different slugs → different images even within the same topic pool.
function pickFromPool(pool, slug) {
  const hashHex = createHash('md5').update(slug || 'default').digest('hex');
  const idx = parseInt(hashHex.slice(0, 6), 16) % pool.length;
  return unsplashUrl(pool[idx]);
}

// Maps keyword phrases (checked against title) to pool keys
const TOPIC_KEYWORDS = [
  ['genshin', 'genshin'],
  ['call of duty', 'callofduty'], ['cod ', 'callofduty'], ['warzone', 'callofduty'],
  ['apex legends', 'apex'], ['apex ', 'apex'],
  ['pokemon', 'pokemon'], ['pokémon', 'pokemon'],
  ['fortnite', 'fortnite'],
  ['valorant', 'valorant'],
  ['roblox', 'roblox'],
  ['minecraft', 'minecraft'],
  ['grand theft auto', 'gta'], ['gta', 'gta'],
  ['playstation', 'playstation'], ['ps5', 'playstation'], ['ps4', 'playstation'],
  ['xbox', 'xbox'],
  ['nintendo', 'nintendo'], ['switch', 'nintendo'], ['mario', 'nintendo'], ['zelda', 'nintendo'],
  ['mobile legends', 'mobile'], ['free fire', 'mobile'], ['pubg mobile', 'mobile'],
  ['esports', 'esports'], ['tournament', 'esports'], ['championship', 'esports'],
];

function getFallbackImage(title = '', content = '', slug = '') {
  const titleLower = title.toLowerCase();
  // Check title first (higher signal than body)
  for (const [keyword, pool] of TOPIC_KEYWORDS) {
    if (titleLower.includes(keyword)) return pickFromPool(TOPIC_IMAGE_POOLS[pool], slug);
  }
  // Fall back to body text check
  const bodyLower = content.toLowerCase().slice(0, 500);
  for (const [keyword, pool] of TOPIC_KEYWORDS) {
    if (bodyLower.includes(keyword)) return pickFromPool(TOPIC_IMAGE_POOLS[pool], slug);
  }
  return pickFromPool(TOPIC_IMAGE_POOLS.default, slug);
}

// Fetch RSS and extract article titles/descriptions
async function fetchRSS(feed) {
  try {
    const res = await fetch(feed.url, {
      headers: { 'User-Agent': 'smartly.sale-blog-bot/1.0' },
      signal: AbortSignal.timeout(8_000),
    });
    if (!res.ok) return [];
    const xml = await res.text();

    const titleRe = /<title>(?:<!\[CDATA\[)?(.*?)(?:\]\]>)?<\/title>/gs;
    const titles  = [...xml.matchAll(titleRe)]
      .map(m => m[1].trim())
      .slice(1, 8) // skip channel title
      .filter(t => t.length > 20 && t.length < 150);

    return titles.map(title => ({ source: feed.source, title }));
  } catch (err) {
    console.warn(`  Warning: ${feed.source} RSS failed: ${err.message}`);
    return [];
  }
}

async function getLatestNews() {
  const results = await Promise.allSettled(RSS_FEEDS.map(fetchRSS));
  return results.flatMap(r => r.status === 'fulfilled' ? r.value : []).slice(0, 25);
}

// Extract section between delimiters
function extractBlock(text, tag) {
  const re = new RegExp(`<${tag}>\\s*([\\s\\S]*?)\\s*<\\/${tag}>`, 'i');
  const m = text.match(re);
  return m ? m[1].trim() : null;
}

// Generate blog post with Claude
async function generatePost(articles) {
  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  const headlines = articles
    .slice(0, 12)
    .map(a => `[${a.source}] ${a.title}`)
    .join('\n');

  const system = `You are a senior SEO content strategist and gaming journalist for smartly.sale -- a gaming and deals website popular in the Philippines and globally.

Your articles:
- Rank #1 on Google by being genuinely the best, most helpful resource on the topic
- Follow Google E-E-A-T principles (Experience, Expertise, Authoritativeness, Trust)
- Are written for real gamers, not bots
- Use proper semantic HTML
- Always contain unique angles, real stats, and actionable advice`;

  const user = `Here are today's latest gaming headlines. Pick the single most trending or newsworthy topic and write a complete, publication-ready blog post about it.

LATEST HEADLINES:
${headlines}

PRIORITY TOPICS (if trending): Roblox, PlayStation, Xbox, IMVU, Mobile Legends, Free Fire, Fortnite, GTA 6, Minecraft, Call of Duty, Nintendo Switch 2, Valorant, Genshin Impact.

ARTICLE REQUIREMENTS:
- Length: 2000-2500 words of real content
- Title: 55-60 characters, keyword-first
- Meta description: 155-160 characters with CTA
- Table of Contents (HTML ordered list with anchor links to each H2)
- 6-8 H2 sections with H3 subsections
- Real specific details (dates, prices, patch notes, stats)
- Practical takeaways in every section
- FAQ section: 5 questions as <details><summary>Q</summary><p>A</p></details>
- 3-4 internal links: /free-mlbb-diamonds, /free-fire-codes, /free-robux-philippines, /earn-gcash, /products
- 2 external authority links with rel="nofollow noopener" target="_blank"
- Closing CTA paragraph

HTML: Use <article>, <section>, <h2 id="...">, <h3>, <p>, <ul>, <ol>, <strong>, <em>, <table>
Info boxes: <div class="info-box"><strong>Note:</strong> ...</div>
Warning boxes: <div class="warning-box"><strong>Warning:</strong> ...</div>

RESPONSE FORMAT -- use these exact tags (this prevents JSON escaping issues with HTML):

<META>
{
  "title": "Your 55-60 char title",
  "metaTitle": "Same or variation",
  "metaDescription": "155-160 char description ending with CTA",
  "excerpt": "2-3 sentence plain-text summary",
  "slug": "keyword-url-slug-here",
  "category": "gaming-news",
  "tags": ["tag1", "tag2", "tag3", "tag4", "tag5"],
  "keywords": ["primary keyword", "secondary keyword", "long-tail phrase"],
  "featuredImage": ""
}
</META>
<CONTENT>
[Write the full HTML article here -- raw HTML, no escaping needed]
</CONTENT>
<FAQS>
[{"q": "Question 1?", "a": "Answer 1."}, {"q": "Question 2?", "a": "Answer 2."}, {"q": "Question 3?", "a": "Answer 3."}, {"q": "Question 4?", "a": "Answer 4."}, {"q": "Question 5?", "a": "Answer 5."}]
</FAQS>

Leave featuredImage as an empty string -- the system will automatically select a unique image based on the article topic and slug.`;

  console.log('Calling Claude claude-sonnet-4-5 with web search...');

  // Run the agentic loop — web_search is a server-side tool that may cause
  // pause_turn if it hits the 10-iteration limit; we must continue until end_turn.
  const MODEL = 'claude-sonnet-4-5';
  const MAX_TOKENS = 16000;
  const MAX_CONTINUATIONS = 5;

  async function runWithWebSearch() {
    const messages = [{ role: 'user', content: user }];
    const allTextBlocks = [];
    let continuations = 0;

    let response = await client.messages.create({
      model: MODEL,
      max_tokens: MAX_TOKENS,
      system,
      tools: [{ type: 'web_search_20250305', name: 'web_search' }],
      messages,
    });

    while (true) {
      // Collect text from this turn
      const textBlocks = response.content.filter(b => b.type === 'text');
      allTextBlocks.push(...textBlocks);

      console.log(`  stop_reason: ${response.stop_reason} | text blocks: ${textBlocks.length} | total text blocks so far: ${allTextBlocks.length}`);

      if (response.stop_reason === 'end_turn') break;

      if (response.stop_reason === 'pause_turn') {
        // Server-side tool hit its iteration limit — append and continue
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

      // Any other stop reason (max_tokens, stop_sequence) — use what we have
      console.warn(`  Unexpected stop_reason: ${response.stop_reason}, using text collected so far`);
      break;
    }

    return allTextBlocks.map(b => b.text).join('\n');
  }

  let fullText;
  try {
    fullText = await runWithWebSearch();
  } catch (err) {
    console.warn('  Web search failed, falling back to headlines only:', err.message);
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

  // Debug: show how much text we got and whether the blocks are present
  console.log(`  Total response text length: ${fullText.length} chars`);
  console.log(`  Has <META>: ${fullText.includes('<META>')}`);
  console.log(`  Has <CONTENT>: ${fullText.includes('<CONTENT>')}`);
  console.log(`  Has <FAQS>: ${fullText.includes('<FAQS>')}`);

  // Extract each block
  const metaRaw = extractBlock(fullText, 'META');
  const content = extractBlock(fullText, 'CONTENT');
  const faqsRaw = extractBlock(fullText, 'FAQS');

  if (!metaRaw) throw new Error('No <META> block found in response');
  if (!content) throw new Error('No <CONTENT> block found in response');

  let meta;
  try {
    meta = JSON.parse(metaRaw);
  } catch (err) {
    throw new Error(`Failed to parse META JSON: ${err.message}\n\nMETA block:\n${metaRaw.slice(0, 400)}`);
  }

  let faqs = [];
  if (faqsRaw) {
    try {
      faqs = JSON.parse(faqsRaw);
    } catch {
      // Non-fatal -- FAQs are optional
      console.warn('  Could not parse FAQS block, skipping');
    }
  }

  return { ...meta, content, faqs };
}

// Helpers
function wordCount(html) {
  return html.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length;
}
function readingTime(html) {
  return Math.max(1, Math.ceil(wordCount(html) / 220));
}

// Main
async function main() {
  if (!process.env.ANTHROPIC_API_KEY) {
    throw new Error('ANTHROPIC_API_KEY environment variable is not set');
  }

  const existing = existsSync(DATA_FILE)
    ? JSON.parse(readFileSync(DATA_FILE, 'utf-8'))
    : [];

  console.log(`Existing posts: ${existing.length}`);
  console.log('Fetching latest gaming news...');

  const articles = await getLatestNews();
  console.log(`Found ${articles.length} headlines from ${RSS_FEEDS.length} feeds`);

  const raw = await generatePost(articles);

  // Clean and dedupe slug
  let slug = (raw.slug || '')
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');

  if (!slug) slug = 'gaming-news-' + Date.now();

  if (existing.some(p => p.slug === slug)) {
    slug = `${slug}-${new Date().toISOString().slice(0, 10)}`;
    console.log(`  Slug conflict resolved: ${slug}`);
  }

  // Pick topic-specific image from verified pool using slug hash
  const featuredImage = getFallbackImage(raw.title, raw.content, slug);

  const now = new Date().toISOString();
  const post = {
    id:              createHash('md5').update(slug).digest('hex').slice(0, 8),
    slug,
    title:           raw.title || 'Gaming News',
    metaTitle:       raw.metaTitle || raw.title,
    metaDescription: raw.metaDescription || '',
    excerpt:         raw.excerpt || '',
    content:         raw.content,
    featuredImage,
    category:        raw.category || 'gaming-news',
    tags:            Array.isArray(raw.tags) ? raw.tags : [],
    keywords:        Array.isArray(raw.keywords) ? raw.keywords : [],
    faqs:            Array.isArray(raw.faqs) ? raw.faqs : [],
    author:          'smartly.sale Team',
    publishDate:     now,
    wordCount:       wordCount(raw.content),
    readingTime:     readingTime(raw.content),
    generated:       true,
  };

  console.log(`\nGenerated: "${post.title}"`);
  console.log(`  URL:      /post/${post.slug}`);
  console.log(`  Category: ${post.category}`);
  console.log(`  Words:    ${post.wordCount}`);
  console.log(`  Read:     ${post.readingTime} min`);
  console.log(`  Image:    ${post.featuredImage}`);

  // Newest first, cap at 300
  const updated = [post, ...existing].slice(0, 300);
  writeFileSync(DATA_FILE, JSON.stringify(updated, null, 2));
  console.log(`\nSaved to ${DATA_FILE}`);
}

main().catch(err => {
  console.error('\nBlog generation failed:', err.message);
  process.exit(1);
});
