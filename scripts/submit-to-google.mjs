#!/usr/bin/env node
/**
 * SEO URL submission for new blog posts
 *
 * Method 1 — IndexNow  (Bing/Yandex, instant, no auth needed)
 * Method 2 — Google Indexing API (instant on Google, requires Search Console ownership)
 *
 * Note: Google deprecated the sitemap ping (/ping?sitemap=...) in Jan 2024.
 * IndexNow is the modern replacement for instant notification.
 */

import { createSign } from 'crypto';
import { readFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT      = join(__dirname, '..');
const DATA_FILE = join(ROOT, 'src/data/blog-posts.json');
const BASE_URL  = 'https://smartly.sale';

// IndexNow key — must match the file at https://smartly.sale/{KEY}.txt
const INDEXNOW_KEY = 'b45707508af47de0b4658caed1fcafcc';

// ── Method 1: IndexNow ───────────────────────────────────────────────────────
// Submits URLs to Bing, Yandex, and other IndexNow-compatible search engines.
// No ownership verification required — just needs the key file hosted on the domain.

async function submitIndexNow(urls) {
  const endpoint = 'https://api.indexnow.org/indexnow';

  try {
    const res = await fetch(endpoint, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body:    JSON.stringify({
        host:        'smartly.sale',
        key:         INDEXNOW_KEY,
        keyLocation: `${BASE_URL}/${INDEXNOW_KEY}.txt`,
        urlList:     urls,
      }),
      signal: AbortSignal.timeout(10_000),
    });

    if (res.ok || res.status === 202) {
      console.log(`  ✅ IndexNow accepted ${urls.length} URL(s) (HTTP ${res.status})`);
      urls.forEach(u => console.log(`     ${u}`));
      return true;
    }

    const body = await res.text().catch(() => '');
    console.warn(`  ⚠️  IndexNow returned HTTP ${res.status}: ${body.slice(0, 200)}`);
    return false;
  } catch (err) {
    console.warn(`  ⚠️  IndexNow request failed: ${err.message}`);
    return false;
  }
}

// ── Method 2: Google Indexing API ───────────────────────────────────────────
// Requires the service account to be added as an Owner in Google Search Console.

function base64url(str) {
  return Buffer.from(str).toString('base64')
    .replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
}

async function getGoogleToken(sa) {
  const now = Math.floor(Date.now() / 1000);
  const header  = base64url(JSON.stringify({ alg: 'RS256', typ: 'JWT' }));
  const payload = base64url(JSON.stringify({
    iss: sa.client_email, sub: sa.client_email,
    aud: 'https://oauth2.googleapis.com/token',
    iat: now, exp: now + 3600,
    scope: 'https://www.googleapis.com/auth/indexing',
  }));

  const signingInput = `${header}.${payload}`;
  const sign = createSign('RSA-SHA256');
  sign.update(signingInput);
  const sig = sign.sign(sa.private_key.replace(/\\n/g, '\n'), 'base64')
    .replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');

  const res  = await fetch('https://oauth2.googleapis.com/token', {
    method:  'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body:    `grant_type=urn%3Aietf%3Aparams%3Aoauth%3Agrant-type%3Ajwt-bearer&assertion=${signingInput}.${sig}`,
  });
  const data = await res.json();
  if (!data.access_token) throw new Error(data.error_description ?? data.error ?? JSON.stringify(data));
  return data.access_token;
}

async function submitGoogleIndexingApi(urls, saJson) {
  let sa;
  try { sa = JSON.parse(saJson); } catch {
    console.warn('  ⚠️  GOOGLE_INDEXING_SA_JSON is invalid JSON — skipping');
    return;
  }

  console.log(`\n[Google Indexing API]`);
  console.log(`  Service account: ${sa.client_email}`);

  let token;
  try {
    token = await getGoogleToken(sa);
    console.log('  ✅ Access token obtained');
  } catch (err) {
    console.warn(`  ⚠️  Token error: ${err.message}`);
    return;
  }

  let ok = 0;
  for (const url of urls) {
    const res = await fetch('https://indexing.googleapis.com/v3/urlNotifications:publish', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body:    JSON.stringify({ url, type: 'URL_UPDATED' }),
      signal:  AbortSignal.timeout(10_000),
    }).catch(err => ({ ok: false, _err: err.message }));

    if (res.ok) {
      console.log(`  ✅ Submitted: ${url}`);
      ok++;
    } else {
      const data = await res.json().catch(() => ({}));
      const msg  = data.error?.message ?? `HTTP ${res.status}`;
      console.warn(`  ⚠️  Failed: ${url}`);
      console.warn(`      ${msg}`);

      if (msg.includes('verify the URL ownership') || data.error?.code === 403) {
        console.warn('');
        console.warn('  ── ACTION REQUIRED ─────────────────────────────────────────');
        console.warn('  The service account is not a verified Owner in Search Console.');
        console.warn('  Steps to fix:');
        console.warn('    1. Go to https://search.google.com/search-console');
        console.warn('    2. Select the https://smartly.sale/ property');
        console.warn('    3. Settings → Users and permissions → Add user');
        console.warn(`    4. Email: ${sa.client_email}`);
        console.warn('    5. Role: Owner  (not Full user)');
        console.warn('  ─────────────────────────────────────────────────────────────');
        break;
      }
    }
  }

  if (ok > 0) console.log(`  ${ok}/${urls.length} URLs submitted to Google`);
}

// ── Main ────────────────────────────────────────────────────────────────────

async function main() {
  // Build URL list
  const urls = [];

  if (existsSync(DATA_FILE)) {
    const posts = JSON.parse(readFileSync(DATA_FILE, 'utf-8'));
    if (posts.length > 0) {
      const p   = posts[0];
      const url = p.generated ? `${BASE_URL}/post/${p.slug}` : `${BASE_URL}/blog/${p.slug}`;
      urls.push(url);
      console.log(`New post: ${url}`);
    }
  }

  urls.push(`${BASE_URL}/blog`);

  // Method 1 — IndexNow (always runs)
  console.log('\n[IndexNow] Submitting to Bing/Yandex...');
  await submitIndexNow(urls);

  // Method 2 — Google Indexing API (runs if secret is set)
  const saJson = process.env.GOOGLE_INDEXING_SA_JSON;
  if (saJson) {
    await submitGoogleIndexingApi(urls, saJson);
  } else {
    console.log('\n[Google Indexing API] GOOGLE_INDEXING_SA_JSON not set — skipping');
    console.log('  (IndexNow above is sufficient for Bing/Yandex; Google crawls via sitemap)');
  }

  console.log('\nDone.');
}

main().catch(err => {
  console.error('Script error:', err.message);
  process.exit(0); // non-fatal
});
