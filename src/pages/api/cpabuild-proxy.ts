import type { APIRoute } from 'astro';

const CPAGRIP_FEED_URL = 'https://www.cpagrip.com/common/offer_feed_json.php';
const CPAGRIP_USER_ID  = '1392970';
const CPAGRIP_PUBKEY   = 'a5202038591dd63f9d0dc5e21ca96ecb';

export const GET: APIRoute = async ({ request, url }) => {
  const s1 = url.searchParams.get('s1') ?? '';

  // Forward the real visitor IP so CPAGrip returns geo-targeted offers
  const clientIp =
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    '';

  const feedUrl = new URL(CPAGRIP_FEED_URL);
  feedUrl.searchParams.set('user_id', CPAGRIP_USER_ID);
  feedUrl.searchParams.set('pubkey', CPAGRIP_PUBKEY);
  feedUrl.searchParams.set('tracking_id', s1);

  try {
    const fetchHeaders: Record<string, string> = {
      'Accept': 'application/json, text/plain, */*',
    };
    if (clientIp) fetchHeaders['X-Forwarded-For'] = clientIp;

    const res = await fetch(feedUrl.toString(), {
      headers: fetchHeaders,
      signal: AbortSignal.timeout(10_000),
    });

    const text = await res.text();

    if (!res.ok) {
      console.error(`[cpagrip-proxy] upstream ${res.status}:`, text.slice(0, 200));
      return new Response(JSON.stringify({ offers: [], error: `Feed returned ${res.status}` }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    let raw: unknown;
    try {
      raw = JSON.parse(text.trim());
    } catch {
      console.error('[cpagrip-proxy] non-JSON response:', text.slice(0, 200));
      return new Response(JSON.stringify({ offers: [], error: `Feed error: ${text.slice(0, 100)}` }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // CPAGrip returns an array directly or { offers: [...] }
    const offers = Array.isArray(raw)
      ? raw
      : ((raw as Record<string, unknown>).offers ?? (raw as Record<string, unknown>).data ?? []);

    return new Response(JSON.stringify({ offers }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Cache-Control': 'public, max-age=300, stale-while-revalidate=600',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('[cpagrip-proxy] fetch error:', message);
    return new Response(JSON.stringify({ offers: [], error: message }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
