import type { APIRoute } from 'astro';

const PUB_ID = '1392970';
const CPAGRIP_URL = 'http://www.cpagrip.com/script_include_proxy.php';

export const GET: APIRoute = async ({ request, url }) => {
  const id = url.searchParams.get('id') ?? '';
  const trackingId = url.searchParams.get('tracking_id') ?? '';

  const visitorIp =
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    '';

  const ref = Buffer.from(request.headers.get('referer') ?? '').toString('base64');
  const userAgent = Buffer.from(request.headers.get('user-agent') ?? '').toString('base64');

  const upstream = new URL(CPAGRIP_URL);
  upstream.searchParams.set('custom_domain', '');
  upstream.searchParams.set('id', id);
  upstream.searchParams.set('visitor_ip', visitorIp);
  upstream.searchParams.set('pubid', PUB_ID);
  upstream.searchParams.set('ref', ref);
  upstream.searchParams.set('user_agent', userAgent);
  upstream.searchParams.set('tracking_id', trackingId);

  try {
    const res = await fetch(upstream.toString(), {
      signal: AbortSignal.timeout(10_000),
    });

    const text = await res.text();

    return new Response(text, {
      status: 200,
      headers: {
        'Content-Type': 'application/javascript; charset=utf-8',
        'Cache-Control': 'no-store',
      },
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error('[s-include] fetch error:', msg);
    return new Response(`/* s-include error: ${msg} */`, {
      status: 200,
      headers: { 'Content-Type': 'application/javascript' },
    });
  }
};
