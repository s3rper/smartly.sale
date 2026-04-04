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

// Topic -> image mapping
const TOPIC_IMAGES = {
  roblox:      'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=1200&h=630&fit=crop&q=80',
  playstation: 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=1200&h=630&fit=crop&q=80',
  xbox:        'https://images.unsplash.com/photo-1621259182978-fbf93132d53d?w=1200&h=630&fit=crop&q=80',
  nintendo:    'https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?w=1200&h=630&fit=crop&q=80',
  minecraft:   'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&h=630&fit=crop&q=80',
  mobile:      'https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=1200&h=630&fit=crop&q=80',
  esports:     'https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?w=1200&h=630&fit=crop&q=80',
  default:     'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1200&h=630&fit=crop&q=80',
};

function getFallbackImage(title = '', content = '') {
  const text = (title + ' ' + content).toLowerCase();
  for (const [key, url] of Object.entries(TOPIC_IMAGES)) {
    if (key !== 'default' && text.includes(key)) return url;
  }
  return TOPIC_IMAGES.default;
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
  "featuredImage": "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1200&h=630&fit=crop&q=80"
}
</META>
<CONTENT>
[Write the full HTML article here -- raw HTML, no escaping needed]
</CONTENT>
<FAQS>
[{"q": "Question 1?", "a": "Answer 1."}, {"q": "Question 2?", "a": "Answer 2."}, {"q": "Question 3?", "a": "Answer 3."}, {"q": "Question 4?", "a": "Answer 4."}, {"q": "Question 5?", "a": "Answer 5."}]
</FAQS>

For featuredImage pick the most relevant:
- General gaming: https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1200&h=630&fit=crop&q=80
- Roblox/Kids: https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=1200&h=630&fit=crop&q=80
- PlayStation: https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=1200&h=630&fit=crop&q=80
- Xbox: https://images.unsplash.com/photo-1621259182978-fbf93132d53d?w=1200&h=630&fit=crop&q=80
- Mobile gaming: https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=1200&h=630&fit=crop&q=80
- Esports: https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?w=1200&h=630&fit=crop&q=80`;

  console.log('Calling Claude claude-sonnet-4-5 with web search...');

  let response;
  try {
    response = await client.messages.create({
      model: 'claude-sonnet-4-5',
      max_tokens: 8192,
      system,
      tools: [{ type: 'web_search_20250305', name: 'web_search' }],
      messages: [{ role: 'user', content: user }],
    });
  } catch (err) {
    console.warn('  Web search unavailable, falling back to headlines only:', err.message);
    response = await client.messages.create({
      model: 'claude-sonnet-4-5',
      max_tokens: 8192,
      system,
      messages: [{ role: 'user', content: user }],
    });
  }

  // Collect all text blocks
  const fullText = response.content
    .filter(b => b.type === 'text')
    .map(b => b.text)
    .join('\n');

  // Extract each block
  const metaRaw    = extractBlock(fullText, 'META');
  const content    = extractBlock(fullText, 'CONTENT');
  const faqsRaw    = extractBlock(fullText, 'FAQS');

  if (!metaRaw) throw new Error('No <META> block found in response');
  if (!content)  throw new Error('No <CONTENT> block found in response');

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

  const now = new Date().toISOString();
  const post = {
    id:              createHash('md5').update(slug).digest('hex').slice(0, 8),
    slug,
    title:           raw.title || 'Gaming News',
    metaTitle:       raw.metaTitle || raw.title,
    metaDescription: raw.metaDescription || '',
    excerpt:         raw.excerpt || '',
    content:         raw.content,
    featuredImage:   raw.featuredImage || getFallbackImage(raw.title, raw.content),
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

  // Newest first, cap at 300
  const updated = [post, ...existing].slice(0, 300);
  writeFileSync(DATA_FILE, JSON.stringify(updated, null, 2));
  console.log(`\nSaved to ${DATA_FILE}`);
}

main().catch(err => {
  console.error('\nBlog generation failed:', err.message);
  process.exit(1);
});
