/**
 * Fetches GSC coverage issues and inspects the problem URLs
 * Run: node --env-file=.env scripts/gsc-coverage-check.mjs
 */
import { createSign } from 'crypto';

const BASE_URL = 'https://smartly.sale';

function base64url(str) {
  return Buffer.from(str).toString('base64')
    .replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
}

async function getToken(sa, scope) {
  const now = Math.floor(Date.now() / 1000);
  const header  = base64url(JSON.stringify({ alg: 'RS256', typ: 'JWT' }));
  const payload = base64url(JSON.stringify({
    iss: sa.client_email, sub: sa.client_email,
    aud: 'https://oauth2.googleapis.com/token',
    iat: now, exp: now + 3600, scope,
  }));
  const input = `${header}.${payload}`;
  const sign  = createSign('RSA-SHA256');
  sign.update(input);
  const sig = sign.sign(sa.private_key.replace(/\\n/g, '\n'), 'base64')
    .replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
  const res  = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `grant_type=urn%3Aietf%3Aparams%3Aoauth%3Agrant-type%3Ajwt-bearer&assertion=${input}.${sig}`,
  });
  const data = await res.json();
  if (!data.access_token) throw new Error(data.error_description ?? JSON.stringify(data));
  return data.access_token;
}

async function inspectUrl(url, siteUrl, token) {
  const res = await fetch('https://searchconsole.googleapis.com/v1/urlInspection/index:inspect', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ inspectionUrl: url, siteUrl }),
    signal: AbortSignal.timeout(15_000),
  });
  if (!res.ok) {
    const d = await res.json().catch(() => ({}));
    return { error: d.error?.message ?? `HTTP ${res.status}` };
  }
  const body   = await res.json();
  const result = body.inspectionResult?.indexStatusResult ?? {};
  return {
    verdict:    result.verdict ?? 'NEUTRAL',
    coverage:   result.coverageState ?? 'Unknown',
    lastCrawl:  result.lastCrawlTime ? new Date(result.lastCrawlTime).toLocaleString('en-PH', { timeZone: 'Asia/Manila' }) : 'Never',
    fetchState: result.pageFetchState ?? '',
    canonical:  result.googleCanonical ?? '',
    userCanon:  result.userCanonical ?? '',
    robotsState: result.robotsTxtState ?? '',
    sitemap:    result.sitemap ?? [],
  };
}

async function checkLiveUrl(url) {
  try {
    const res = await fetch(url, { method: 'HEAD', redirect: 'manual', signal: AbortSignal.timeout(8_000) });
    return { status: res.status, location: res.headers.get('location') ?? '' };
  } catch (e) {
    return { status: 'error', location: e.message };
  }
}

async function main() {
  const saJson = process.env.GOOGLE_INDEXING_SA_JSON;
  if (!saJson) { console.error('GOOGLE_INDEXING_SA_JSON not set'); process.exit(1); }
  const sa = JSON.parse(saJson);

  const token = await getToken(sa, 'https://www.googleapis.com/auth/webmasters');
  console.log('✅ Token obtained\n');

  // Resolve site URL
  const sitesRes = await fetch('https://www.googleapis.com/webmasters/v3/sites',
    { headers: { Authorization: `Bearer ${token}` } });
  const sitesData = await sitesRes.json();
  const entries   = sitesData.siteEntry ?? [];
  const siteUrl   = entries.find(s => s.siteUrl === 'sc-domain:smartly.sale')?.siteUrl
                 ?? entries.find(s => s.siteUrl.includes('smartly.sale'))?.siteUrl
                 ?? 'https://smartly.sale/';
  console.log(`GSC property: ${siteUrl}\n`);

  // URLs to audit — known candidates for 404 / redirect / canonical issues
  const candidates = [
    // Old renamed page
    `${BASE_URL}/free-robux-philippines`,
    // Redirect page itself
    `${BASE_URL}/free-robux`,
    // Cheapest-near-me (noindex)
    `${BASE_URL}/cheapest-near-me`,
    // Common trailing-slash variants
    `${BASE_URL}/earn-gcash/`,
    `${BASE_URL}/earn-gcash`,
    `${BASE_URL}/free-imvu-credits`,
    `${BASE_URL}/free-gaming-credits`,
    `${BASE_URL}/win-free-phone`,
    `${BASE_URL}/online-contests-philippines`,
    `${BASE_URL}/free-gift-cards-philippines`,
    `${BASE_URL}/free-mlbb-diamonds`,
    `${BASE_URL}/free-fire-codes`,
    // blog variants
    `${BASE_URL}/blog`,
    `${BASE_URL}/blog/`,
    // tiktok-viral
    `${BASE_URL}/tiktok-viral`,
    // earn
    `${BASE_URL}/earn`,
    // earn-gcash old variant
    `${BASE_URL}/earn/gcash`,
  ];

  console.log('='.repeat(70));
  console.log('LIVE HTTP STATUS CHECK');
  console.log('='.repeat(70));
  for (const url of candidates) {
    const live = await checkLiveUrl(url);
    const icon = live.status === 200 ? '✅' : live.status === 301 ? '↩️ 301' : live.status === 404 ? '❌ 404' : live.status === 200 ? '✅' : `⚠️  ${live.status}`;
    const loc  = live.location ? ` → ${live.location}` : '';
    console.log(`${icon}  ${url}${loc}`);
  }

  console.log('\n' + '='.repeat(70));
  console.log('GSC URL INSPECTION (known issue candidates)');
  console.log('='.repeat(70));

  const inspectList = [
    `${BASE_URL}/free-robux-philippines`,
    `${BASE_URL}/free-robux`,
    `${BASE_URL}/earn-gcash`,
    `${BASE_URL}/cheapest-near-me`,
    `${BASE_URL}/blog`,
    `${BASE_URL}/tiktok-viral`,
  ];

  for (const url of inspectList) {
    const r = await inspectUrl(url, siteUrl, token);
    if (r.error) {
      console.log(`\n⚠️  ${url}\n   Error: ${r.error}`);
      continue;
    }
    const icon = r.verdict === 'PASS' ? '✅' : r.verdict === 'FAIL' ? '❌' : '⏳';
    console.log(`\n${icon}  ${url}`);
    console.log(`   Coverage  : ${r.coverage}`);
    console.log(`   Last crawl: ${r.lastCrawl}`);
    if (r.fetchState)  console.log(`   Fetch     : ${r.fetchState}`);
    if (r.robotsState) console.log(`   Robots    : ${r.robotsState}`);
    if (r.canonical && r.canonical !== url) console.log(`   Google canonical : ${r.canonical}`);
    if (r.userCanon  && r.userCanon  !== url) console.log(`   User canonical   : ${r.userCanon}`);
  }

  console.log('\nDone.');
}

main().catch(e => { console.error(e.message); process.exit(1); });
