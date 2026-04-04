#!/usr/bin/env node
/**
 * Submit newly generated blog post URLs to Google Indexing API
 * Runs automatically after generate-blog.mjs in GitHub Actions
 *
 * Requires:
 *   GOOGLE_INDEXING_SA_JSON  — full service account JSON as a string (GitHub Secret)
 */

import { createSign } from 'crypto';
import { readFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const DATA_FILE = join(ROOT, 'src/data/blog-posts.json');
const BASE_URL = 'https://smartly.sale';

// ── JWT / token helpers ────────────────────────────────────────────────────

function base64url(str) {
  return Buffer.from(str).toString('base64')
    .replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
}

async function getAccessToken(saJson) {
  const sa = JSON.parse(saJson);
  const now = Math.floor(Date.now() / 1000);

  const header  = base64url(JSON.stringify({ alg: 'RS256', typ: 'JWT' }));
  const payload = base64url(JSON.stringify({
    iss: sa.client_email,
    sub: sa.client_email,
    aud: 'https://oauth2.googleapis.com/token',
    iat: now,
    exp: now + 3600,
    scope: 'https://www.googleapis.com/auth/indexing',
  }));

  const signingInput = `${header}.${payload}`;
  const sign = createSign('RSA-SHA256');
  sign.update(signingInput);
  const sig = sign.sign(sa.private_key.replace(/\\n/g, '\n'), 'base64')
    .replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');

  const jwt = `${signingInput}.${sig}`;

  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `grant_type=urn%3Aietf%3Aparams%3Aoauth%3Agrant-type%3Ajwt-bearer&assertion=${jwt}`,
  });

  const data = await res.json();
  if (!data.access_token) {
    throw new Error(`Token error: ${data.error_description ?? data.error ?? JSON.stringify(data)}`);
  }
  return data.access_token;
}

async function submitUrl(url, token) {
  const res = await fetch('https://indexing.googleapis.com/v3/urlNotifications:publish', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ url, type: 'URL_UPDATED' }),
  });

  if (res.ok) {
    console.log(`  ✅ Submitted: ${url}`);
    return true;
  }

  const data = await res.json();
  console.warn(`  ⚠️  Failed: ${url} — ${data.error?.message ?? `HTTP ${res.status}`}`);
  return false;
}

// ── Main ───────────────────────────────────────────────────────────────────

async function main() {
  const saJson = process.env.GOOGLE_INDEXING_SA_JSON;
  if (!saJson) {
    console.log('ℹ️  GOOGLE_INDEXING_SA_JSON not set — skipping Google indexing');
    process.exit(0); // non-fatal: blog still works without this
  }

  // Build URL list: new post + key pages
  const urls = [
    `${BASE_URL}/blog`,
    `${BASE_URL}/sitemap.xml`,
  ];

  // Add the newest generated post (first entry in the JSON file)
  if (existsSync(DATA_FILE)) {
    const posts = JSON.parse(readFileSync(DATA_FILE, 'utf-8'));
    if (posts.length > 0) {
      const newest = posts[0];
      // Auto-generated posts are at /post/slug, hardcoded ones at /blog/slug
      const postUrl = newest.generated
        ? `${BASE_URL}/post/${newest.slug}`
        : `${BASE_URL}/blog/${newest.slug}`;
      urls.unshift(postUrl); // put the post first
      console.log(`\nNew post to index: ${postUrl}`);
    }
  }

  console.log(`\nSubmitting ${urls.length} URLs to Google Indexing API...`);

  let token;
  try {
    token = await getAccessToken(saJson);
  } catch (err) {
    console.error('Failed to get Google access token:', err.message);
    process.exit(0); // non-fatal
  }

  let ok = 0;
  for (const url of urls) {
    const success = await submitUrl(url, token);
    if (success) ok++;
  }

  console.log(`\n✅ Google indexing: ${ok}/${urls.length} URLs submitted`);
  // Google Indexing API allows 200 requests/day — we use 3 per run
}

main().catch(err => {
  console.error('Google indexing script error:', err.message);
  process.exit(0); // non-fatal — don't fail the whole workflow
});
