/**
 * Google Indexing API — Submit pages for fast SEO indexing
 * POST /api/google-index   (manual trigger)
 * GET  /api/google-index   (cron-friendly, indexes new pages)
 *
 * Auth: Authorization: Bearer CRON_SECRET
 *
 * Setup:
 * 1. Create a Google Cloud Service Account with "Owner" or "Indexing API" role
 * 2. Download JSON key → set GOOGLE_INDEXING_SA_JSON env var (entire JSON as string)
 * 3. Add service account email to Google Search Console as a property owner
 */
import type { APIRoute } from 'astro';

function env(key: string): string {
  return (typeof process !== 'undefined' ? process.env[key] : undefined) ?? '';
}

// Pages to submit to Google Indexing API
const PAGES_TO_INDEX = [
  'https://smartly.sale/',
  'https://smartly.sale/earn-gcash',
  'https://smartly.sale/win-free-phone',
  'https://smartly.sale/online-contests-philippines',
  'https://smartly.sale/free-gift-cards-philippines',
  'https://smartly.sale/free-imvu-credits',
  'https://smartly.sale/earn',
  'https://smartly.sale/products',
  'https://smartly.sale/cheapest-near-me',
  'https://smartly.sale/aegix',
  'https://smartly.sale/blog',
];

interface ServiceAccountKey {
  type: string;
  project_id: string;
  private_key_id: string;
  private_key: string;
  client_email: string;
  client_id: string;
  auth_uri: string;
  token_uri: string;
}

async function getGoogleAccessToken(saJson: string): Promise<string> {
  let sa: ServiceAccountKey;
  try {
    sa = JSON.parse(saJson) as ServiceAccountKey;
  } catch {
    throw new Error('Invalid GOOGLE_INDEXING_SA_JSON — must be valid JSON');
  }

  const now = Math.floor(Date.now() / 1000);
  const header = { alg: 'RS256', typ: 'JWT' };
  const payload = {
    iss: sa.client_email,
    sub: sa.client_email,
    aud: 'https://oauth2.googleapis.com/token',
    iat: now,
    exp: now + 3600,
    scope: 'https://www.googleapis.com/auth/indexing',
  };

  // Build JWT
  const base64url = (obj: unknown) =>
    btoa(JSON.stringify(obj))
      .replace(/=/g, '')
      .replace(/\+/g, '-')
      .replace(/\//g, '_');

  const header64 = base64url(header);
  const payload64 = base64url(payload);
  const signingInput = `${header64}.${payload64}`;

  // Import private key and sign
  const privateKeyPem = sa.private_key.replace(/\\n/g, '\n');
  const pemBody = privateKeyPem
    .replace('-----BEGIN PRIVATE KEY-----', '')
    .replace('-----END PRIVATE KEY-----', '')
    .replace(/\s+/g, '');
  const keyBytes = Uint8Array.from(atob(pemBody), (c) => c.charCodeAt(0));

  const cryptoKey = await crypto.subtle.importKey(
    'pkcs8',
    keyBytes,
    { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
    false,
    ['sign'],
  );

  const encoder = new TextEncoder();
  const signature = await crypto.subtle.sign(
    'RSASSA-PKCS1-v1_5',
    cryptoKey,
    encoder.encode(signingInput),
  );

  const sig64 = btoa(String.fromCharCode(...new Uint8Array(signature)))
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');

  const jwt = `${signingInput}.${sig64}`;

  // Exchange JWT for access token
  const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `grant_type=urn%3Aietf%3Aparams%3Aoauth%3Agrant-type%3Ajwt-bearer&assertion=${jwt}`,
    signal: AbortSignal.timeout(10_000),
  });

  const tokenData = (await tokenRes.json()) as {
    access_token?: string;
    error?: string;
    error_description?: string;
  };

  if (!tokenData.access_token) {
    throw new Error(
      `Token exchange failed: ${tokenData.error_description ?? tokenData.error ?? 'unknown'}`,
    );
  }

  return tokenData.access_token;
}

async function submitUrl(
  url: string,
  accessToken: string,
): Promise<{ url: string; ok: boolean; error?: string }> {
  try {
    const res = await fetch(
      'https://indexing.googleapis.com/v3/urlNotifications:publish',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ url, type: 'URL_UPDATED' }),
        signal: AbortSignal.timeout(8_000),
      },
    );

    if (res.ok) return { url, ok: true };

    const data = (await res.json()) as { error?: { message: string } };
    return { url, ok: false, error: data.error?.message ?? `HTTP ${res.status}` };
  } catch (err) {
    return {
      url,
      ok: false,
      error: err instanceof Error ? err.message : String(err),
    };
  }
}

export const GET: APIRoute = async ({ request }) => {
  const cronSecret = env('CRON_SECRET');
  const authHeader = request.headers.get('Authorization') ?? '';
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const saJson = env('GOOGLE_INDEXING_SA_JSON');
  if (!saJson) {
    return new Response(
      JSON.stringify({
        ok: false,
        error: 'GOOGLE_INDEXING_SA_JSON not configured',
        help: 'Set GOOGLE_INDEXING_SA_JSON env var with your service account JSON key',
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } },
    );
  }

  try {
    const accessToken = await getGoogleAccessToken(saJson);

    // Submit all pages (Google allows 200/day; we have far fewer)
    const results = await Promise.all(
      PAGES_TO_INDEX.map((url) => submitUrl(url, accessToken)),
    );

    const succeeded = results.filter((r) => r.ok).length;
    const failed = results.filter((r) => !r.ok);

    console.log(
      `[google-index] submitted ${succeeded}/${PAGES_TO_INDEX.length} pages`,
    );

    return new Response(
      JSON.stringify({ ok: true, submitted: succeeded, failed, results }),
      { status: 200, headers: { 'Content-Type': 'application/json' } },
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('[google-index] error:', message);
    return new Response(JSON.stringify({ ok: false, error: message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

export const POST: APIRoute = async ({ request }) => {
  // Allow manual trigger with a specific URL
  const cronSecret = env('CRON_SECRET');
  const authHeader = request.headers.get('Authorization') ?? '';
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Same logic as GET — just forward to the GET handler
  return GET({ request } as Parameters<typeof GET>[0]);
};
