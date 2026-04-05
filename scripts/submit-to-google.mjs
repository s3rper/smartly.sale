#!/usr/bin/env node
/**
 * Google SEO submission for new blog posts
 *
 * Two methods (both run every time):
 *  1. Sitemap ping  — always works, no auth required
 *  2. Indexing API  — instant indexing, requires Search Console ownership
 *
 * Requires:
 *   GOOGLE_INDEXING_SA_JSON  — full service account JSON (optional, for method 2)
 */

import { createSign } from 'crypto';
import { readFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT      = join(__dirname, '..');
const DATA_FILE = join(ROOT, 'src/data/blog-posts.json');
const BASE_URL  = 'https://smartly.sale';

// ── 1. Sitemap ping ─────────────────────────────────────────────────────────
// Google's official sitemap notification endpoint. No API key needed.
// Tells Google to re-crawl the sitemap and discover new URLs.

async function pingSitemap() {
  const sitemapUrl = `${BASE_URL}/sitemap.xml`;
  const pingUrl    = `https://www.google.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`;

  try {
    const res = await fetch(pingUrl, { signal: AbortSignal.timeout(10_000) });
    if (res.ok) {
      console.log(`  ✅ Sitemap ping sent: ${sitemapUrl}`);
      return true;
    }
    console.warn(`  ⚠️  Sitemap ping returned HTTP ${res.status}`);
    return false;
  } catch (err) {
    console.warn(`  ⚠️  Sitemap ping failed: ${err.message}`);
    return false;
  }
}

// ── 2. Indexing API ─────────────────────────────────────────────────────────
// Instant URL submission. Requires the service account to be added as an
// Owner in Google Search Console for the https://smartly.sale/ property.

function base64url(str) {
  return Buffer.from(str).toString('base64')
    .replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
}

async function getAccessToken(sa) {
  const now = Math.floor(Date.now() / 1000);

  const header  = base64url(JSON.stringify({ alg: 'RS256', typ: 'JWT' }));
  const payload = base64url(JSON.stringify({
    iss:   sa.client_email,
    sub:   sa.client_email,
    aud:   'https://oauth2.googleapis.com/token',
    iat:   now,
    exp:   now + 3600,
    scope: 'https://www.googleapis.com/auth/indexing',
  }));

  const signingInput = `${header}.${payload}`;
  const sign = createSign('RSA-SHA256');
  sign.update(signingInput);
  const sig = sign.sign(sa.private_key.replace(/\\n/g, '\n'), 'base64')
    .replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');

  const res = await fetch('https://oauth2.googleapis.com/token', {
    method:  'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body:    `grant_type=urn%3Aietf%3Aparams%3Aoauth%3Agrant-type%3Ajwt-bearer&assertion=${signingInput}.${sig}`,
  });

  const data = await res.json();
  if (!data.access_token) {
    throw new Error(data.error_description ?? data.error ?? JSON.stringify(data));
  }
  return data.access_token;
}

async function submitViaIndexingApi(urls, saJson) {
  let sa;
  try {
    sa = JSON.parse(saJson);
  } catch {
    console.warn('  ⚠️  GOOGLE_INDEXING_SA_JSON is not valid JSON — skipping Indexing API');
    return;
  }

  console.log(`\n[Indexing API] Service account: ${sa.client_email}`);
  console.log(`[Indexing API] Project: ${sa.project_id}`);

  let token;
  try {
    token = await getAccessToken(sa);
    console.log('  ✅ Access token obtained');
  } catch (err) {
    console.warn(`  ⚠️  Could not get access token: ${err.message}`);
    console.warn('  → Check that the service account JSON in GOOGLE_INDEXING_SA_JSON is correct');
    return;
  }

  let ok = 0;
  for (const url of urls) {
    try {
      const res = await fetch('https://indexing.googleapis.com/v3/urlNotifications:publish', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body:    JSON.stringify({ url, type: 'URL_UPDATED' }),
        signal:  AbortSignal.timeout(10_000),
      });

      if (res.ok) {
        console.log(`  ✅ Indexed: ${url}`);
        ok++;
      } else {
        const data = await res.json();
        const msg  = data.error?.message ?? `HTTP ${res.status}`;
        const code = data.error?.code ?? res.status;
        console.warn(`  ⚠️  Failed (${code}): ${url}`);
        console.warn(`      Reason: ${msg}`);

        if (msg.includes('verify the URL ownership') || code === 403) {
          console.warn('');
          console.warn('  ── FIX REQUIRED ────────────────────────────────────────────');
          console.warn(`  Add "${sa.client_email}" as an Owner in Google Search Console:`);
          console.warn('  1. Go to https://search.google.com/search-console');
          console.warn('  2. Select your https://smartly.sale/ property');
          console.warn('  3. Settings → Users and permissions → Add user');
          console.warn(`  4. Email: ${sa.client_email}`);
          console.warn('  5. Role: Owner  ← must be Owner, not Full user');
          console.warn('  ────────────────────────────────────────────────────────────');
          console.warn('');
          break; // All URLs will fail with the same error — no point continuing
        }
      }
    } catch (err) {
      console.warn(`  ⚠️  Network error for ${url}: ${err.message}`);
    }
  }

  if (ok > 0) {
    console.log(`\n[Indexing API] ${ok}/${urls.length} URLs submitted instantly`);
  }
}

// ── Main ───────────────────────────────────────────────────────────────────

async function main() {
  // Collect URLs to submit
  const urls = [];

  if (existsSync(DATA_FILE)) {
    const posts = JSON.parse(readFileSync(DATA_FILE, 'utf-8'));
    if (posts.length > 0) {
      const newest  = posts[0];
      const postUrl = newest.generated
        ? `${BASE_URL}/post/${newest.slug}`
        : `${BASE_URL}/blog/${newest.slug}`;
      urls.push(postUrl);
      console.log(`New post: ${postUrl}`);
    }
  }

  urls.push(`${BASE_URL}/blog`, `${BASE_URL}/sitemap.xml`);

  // ── Method 1: Sitemap ping (always runs, no config needed) ──
  console.log('\n[Sitemap Ping] Notifying Google of new content...');
  await pingSitemap();

  // ── Method 2: Indexing API (runs if secret is configured) ──
  const saJson = process.env.GOOGLE_INDEXING_SA_JSON;
  if (saJson) {
    await submitViaIndexingApi(urls, saJson);
  } else {
    console.log('\n[Indexing API] GOOGLE_INDEXING_SA_JSON not set — skipping (sitemap ping is enough)');
  }

  console.log('\nDone. Google will crawl the sitemap and discover new posts within 24-48h.');
}

main().catch(err => {
  console.error('Script error:', err.message);
  process.exit(0); // non-fatal — never fail the whole workflow
});
