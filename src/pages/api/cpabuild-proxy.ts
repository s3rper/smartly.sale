import type { APIRoute } from 'astro';

const CPABUILD_FEED_URL = 'https://d2dzcaq3bhqk1m.cloudfront.net/public/offers/feed.php';

export const GET: APIRoute = async ({ request, url, locals }) => {
  const s1 = url.searchParams.get('s1') ?? '';
  const s2 = url.searchParams.get('s2') ?? '';

  // Resolve env vars — try Vercel edge runtime, then Astro/Vite import.meta.env, then Node process.env
  const runtimeEnv = (locals as any)?.runtime?.env;
  const userId =
    runtimeEnv?.CPABUILD_USER_ID ??
    import.meta.env.CPABUILD_USER_ID ??
    process.env.CPABUILD_USER_ID ??
    '48201';
  const apiKey =
    runtimeEnv?.CPABUILD_API_KEY ??
    import.meta.env.CPABUILD_API_KEY ??
    process.env.CPABUILD_API_KEY ??
    '';

  if (!apiKey) {
    console.error('[cpabuild-proxy] CPABUILD_API_KEY is not set');
    return new Response(JSON.stringify({ offers: [], error: 'API key not configured' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Forward the real visitor IP so CPABuild returns geo-targeted offers
  const clientIp =
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    '';

  const feedUrl = new URL(CPABUILD_FEED_URL);
  feedUrl.searchParams.set('user_id', userId);
  feedUrl.searchParams.set('api_key', apiKey);
  feedUrl.searchParams.set('s1', s1);
  feedUrl.searchParams.set('s2', s2);

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
      console.error(`[cpabuild-proxy] upstream ${res.status}:`, text.slice(0, 200));
      return new Response(JSON.stringify({ offers: [], error: `Feed returned ${res.status}` }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    let raw: unknown;
    try {
      raw = JSON.parse(text.trim());
    } catch {
      console.error('[cpabuild-proxy] non-JSON response:', text.slice(0, 200));
      return new Response(JSON.stringify({ offers: [], error: `Feed error: ${text.slice(0, 100)}` }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // CPABuild returns an array directly or { offers: [...] }
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
    console.error('[cpabuild-proxy] fetch error:', message);
    return new Response(JSON.stringify({ offers: [], error: message }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
