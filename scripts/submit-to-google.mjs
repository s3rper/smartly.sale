#!/usr/bin/env node
/**
 * SEO URL submission + indexing status check for new blog posts
 *
 * Method 1 — IndexNow  (Bing/Yandex, instant, no auth needed)
 * Method 2 — Search Console Sitemaps API (most reliable: tells Google to re-crawl sitemap)
 * Method 3 — Google Indexing API (best-effort fast crawl request for the specific URL)
 * Method 4 — Google URL Inspection API (checks real indexing status, same service account)
 *
 * Usage:
 *   node scripts/submit-to-google.mjs           # submit + check
 *   node scripts/submit-to-google.mjs --check   # check status only (no submission)
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
const SITE_URL  = 'https://smartly.sale/'; // trailing slash required by Search Console

// IndexNow key — must match the file at https://smartly.sale/{KEY}.txt
const INDEXNOW_KEY = 'b45707508af47de0b4658caed1fcafcc';

const CHECK_ONLY = process.argv.includes('--check');

// ── Shared JWT helper ────────────────────────────────────────────────────────

function base64url(str) {
  return Buffer.from(str).toString('base64')
    .replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
}

async function getGoogleToken(sa, scope) {
  const now = Math.floor(Date.now() / 1000);
  const header  = base64url(JSON.stringify({ alg: 'RS256', typ: 'JWT' }));
  const payload = base64url(JSON.stringify({
    iss: sa.client_email, sub: sa.client_email,
    aud: 'https://oauth2.googleapis.com/token',
    iat: now, exp: now + 3600,
    scope,
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

// ── Method 1: IndexNow ───────────────────────────────────────────────────────

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

async function submitGoogleIndexingApi(urls, sa) {
  console.log(`\n[Google Indexing API]`);
  console.log(`  Service account: ${sa.client_email}`);

  let token;
  try {
    token = await getGoogleToken(sa, 'https://www.googleapis.com/auth/indexing');
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

// ── Method 3: Search Console Sitemaps API ───────────────────────────────────
// Submits/refreshes the sitemap so Google re-scans it for new URLs.
// This is the most reliable way to get new pages discovered — it tells Google
// "the sitemap changed, please re-read it".
// Scope: webmasters (read-write)

async function submitSitemap(sa) {
  const sitemapUrl    = `${BASE_URL}/sitemap.xml`;
  const encodedSitemap = encodeURIComponent(sitemapUrl);

  console.log('\n[Search Console Sitemaps API] Submitting sitemap...');
  console.log(`  Sitemap: ${sitemapUrl}`);

  let token;
  try {
    token = await getGoogleToken(sa, 'https://www.googleapis.com/auth/webmasters');
    console.log('  ✅ Access token obtained');
  } catch (err) {
    console.warn(`  ⚠️  Token error: ${err.message}`);
    return;
  }

  // Auto-detect the correct GSC property format (URL prefix vs sc-domain:)
  const resolvedSite  = await resolveGscSiteUrl(token);
  const encodedSite   = encodeURIComponent(resolvedSite);
  console.log(`  Site: ${resolvedSite}`);

  const res = await fetch(
    `https://www.googleapis.com/webmasters/v3/sites/${encodedSite}/sitemaps/${encodedSitemap}`,
    {
      method:  'PUT',
      headers: { Authorization: `Bearer ${token}` },
      signal:  AbortSignal.timeout(10_000),
    }
  ).catch(err => ({ ok: false, _err: err.message }));

  if (res.ok || res.status === 204) {
    console.log(`  ✅ Sitemap submitted — Google will re-crawl it shortly`);
    return true;
  }

  const data = await res.json().catch(() => ({}));
  const msg  = data.error?.message ?? `HTTP ${res.status}`;
  console.warn(`  ⚠️  Sitemap submission failed: ${msg}`);

  if (data.error?.code === 403) {
    console.warn('');
    console.warn('  ── ACTION REQUIRED ─────────────────────────────────────────');
    console.warn('  Service account needs "Full" or "Owner" access in Search Console.');
    console.warn('  Steps: Search Console → Settings → Users and permissions → Add user');
    console.warn(`  Email: ${sa.client_email}  |  Role: Full (or Owner)`);
    console.warn('  ─────────────────────────────────────────────────────────────');
  }
  return false;
}

// ── Method 4: Google URL Inspection API ─────────────────────────────────────
// Checks actual indexing status — same data as manual Search Console inspection.
// Auto-discovers the correct siteUrl format (URL prefix vs Domain property).

const VERDICT_ICON = {
  PASS:    '✅',
  FAIL:    '❌',
  NEUTRAL: '⏳',
};

const COVERAGE_NOTES = {
  'Submitted and indexed':               '✅ Fully indexed',
  'Indexed, not submitted in sitemap':   '✅ Indexed (not in sitemap)',
  'Crawled - currently not indexed':     '⏳ Crawled but not indexed yet',
  'Discovered - currently not indexed':  '⏳ Discovered but not yet crawled',
  'Duplicate without user-selected canonical': '⚠️  Duplicate — set canonical',
  'Excluded by \'noindex\' tag':         '🚫 noindex tag found — remove it!',
  'Blocked by robots.txt':               '🚫 Blocked by robots.txt',
  'Page with redirect':                  '↩️  Redirected',
  'Soft 404':                            '⚠️  Soft 404 — fix the page',
  '404':                                 '❌ Page returns 404',
  'Server error (5xx)':                  '❌ Server error',
};

// Fetch all GSC properties the service account can access, pick the one
// that matches smartly.sale. This handles both:
//   URL prefix property : https://smartly.sale/
//   Domain property     : sc-domain:smartly.sale
async function resolveGscSiteUrl(token) {
  const res = await fetch(
    'https://www.googleapis.com/webmasters/v3/sites',
    { headers: { Authorization: `Bearer ${token}` }, signal: AbortSignal.timeout(10_000) }
  ).catch(() => null);

  if (!res?.ok) return SITE_URL; // fall back to hardcoded value

  const data = await res.json().catch(() => ({}));
  const sites = data.siteEntry ?? [];

  console.log(`  GSC properties accessible: ${sites.map(s => s.siteUrl).join(', ') || 'none'}`);

  // Prefer the exact SITE_URL match, then domain property, then any match
  const exact  = sites.find(s => s.siteUrl === SITE_URL);
  const domain = sites.find(s => s.siteUrl === `sc-domain:smartly.sale`);
  const any    = sites.find(s => s.siteUrl.includes('smartly.sale'));

  const resolved = (exact ?? domain ?? any)?.siteUrl ?? SITE_URL;
  if (resolved !== SITE_URL) {
    console.log(`  ℹ️  Using GSC property: ${resolved} (not the hardcoded ${SITE_URL})`);
  }
  return resolved;
}

async function checkUrlInspection(urls, sa) {
  console.log('\n[URL Inspection API] Checking indexing status...');

  let token;
  try {
    // Use full webmasters scope — readonly sometimes causes 403 for URL Inspection
    token = await getGoogleToken(sa, 'https://www.googleapis.com/auth/webmasters');
    console.log('  ✅ Access token obtained');
  } catch (err) {
    console.warn(`  ⚠️  Token error: ${err.message}`);
    return;
  }

  // Auto-detect correct siteUrl format from the service account's property list
  const siteUrl = await resolveGscSiteUrl(token);
  console.log(`  Site: ${siteUrl}`);

  for (const url of urls) {
    const res = await fetch(
      'https://searchconsole.googleapis.com/v1/urlInspection/index:inspect',
      {
        method:  'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body:    JSON.stringify({ inspectionUrl: url, siteUrl }),
        signal:  AbortSignal.timeout(15_000),
      }
    ).catch(err => ({ ok: false, _err: err.message }));

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      const msg  = data.error?.message ?? `HTTP ${res.status}`;
      console.warn(`  ⚠️  Could not inspect ${url}: ${msg}`);

      if (data.error?.code === 403) {
        console.warn('');
        console.warn('  ── ACTION REQUIRED ─────────────────────────────────────────');
        console.warn(`  Service account (${sa.client_email}) needs Full or Owner access.`);
        console.warn('  Search Console → Settings → Users and permissions → Add user');
        console.warn(`  Role: Owner  (Full sometimes still 403s for URL Inspection)`);
        console.warn('  ─────────────────────────────────────────────────────────────');
      }
      continue;
    }

    const body   = await res.json();
    const result = body.inspectionResult?.indexStatusResult ?? {};

    const verdict      = result.verdict ?? 'NEUTRAL';
    const coverage     = result.coverageState ?? 'Unknown';
    const lastCrawl    = result.lastCrawlTime ? new Date(result.lastCrawlTime).toLocaleString('en-PH', { timeZone: 'Asia/Manila' }) : 'Never crawled';
    const fetchState   = result.pageFetchState ?? '';
    const canonical    = result.googleCanonical ?? '';
    const robotsState  = result.robotsTxtState ?? '';
    const icon         = VERDICT_ICON[verdict] ?? '❓';
    const coverageNote = COVERAGE_NOTES[coverage] ?? coverage;

    console.log('');
    console.log(`  ${icon} ${url}`);
    console.log(`     Status    : ${coverageNote}`);
    console.log(`     Last crawl: ${lastCrawl}`);
    if (fetchState)  console.log(`     Fetch     : ${fetchState}`);
    if (robotsState) console.log(`     Robots.txt: ${robotsState}`);
    if (canonical && canonical !== url) {
      console.log(`     ⚠️  Google canonical differs: ${canonical}`);
    }
    if (coverage.includes('not indexed')) {
      console.log(`     💡 Not indexed yet — normal if recently submitted. Re-check in a few hours.`);
    }
  }
}

// ── Main ────────────────────────────────────────────────────────────────────

async function main() {
  // Build URL list from the latest blog post
  const urls = [];

  if (existsSync(DATA_FILE)) {
    const posts = JSON.parse(readFileSync(DATA_FILE, 'utf-8'));
    if (posts.length > 0) {
      const p   = posts[0];
      const url = p.generated ? `${BASE_URL}/post/${p.slug}` : `${BASE_URL}/blog/${p.slug}`;
      urls.push(url);
      console.log(`Post URL: ${url}`);
    }
  }

  urls.push(`${BASE_URL}/blog`);

  const saJson = process.env.GOOGLE_INDEXING_SA_JSON;
  let sa = null;
  if (saJson) {
    try { sa = JSON.parse(saJson); } catch {
      console.warn('⚠️  GOOGLE_INDEXING_SA_JSON is invalid JSON');
    }
  }

  if (CHECK_ONLY) {
    // ── Check-only mode ──────────────────────────────────────────────────────
    console.log('[Mode: check-only — no submissions]\n');

    if (!sa) {
      console.warn('GOOGLE_INDEXING_SA_JSON not set — cannot check status');
      process.exit(0);
    }

    await checkUrlInspection(urls, sa);

  } else {
    // ── Submit + check mode ──────────────────────────────────────────────────

    // Method 1 — IndexNow (always runs)
    console.log('\n[IndexNow] Submitting to Bing/Yandex...');
    await submitIndexNow(urls);

    if (sa) {
      // Method 2 — Search Console Sitemaps API (most reliable for new URL discovery)
      await submitSitemap(sa);

      // Method 3 — Google Indexing API (best-effort fast crawl request)
      await submitGoogleIndexingApi(urls, sa);

      // Method 4 — URL Inspection (check current status immediately after submit)
      await checkUrlInspection(urls, sa);
    } else {
      console.log('\n[Google Indexing API] GOOGLE_INDEXING_SA_JSON not set — skipping');
      console.log('  (IndexNow above is sufficient for Bing/Yandex; Google crawls via sitemap)');
    }
  }

  console.log('\nDone.');
}

main().catch(err => {
  console.error('Script error:', err.message);
  process.exit(0); // non-fatal
});
