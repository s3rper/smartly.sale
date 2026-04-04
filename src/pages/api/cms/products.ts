import type { APIRoute } from 'astro';
import { fetchProductsFromWebflow } from '../../../lib/products';

export const GET: APIRoute = async ({ request, locals }) => {
  try {
    const token = (locals as any)?.runtime?.env?.WEBFLOW_CMS_SITE_API_TOKEN ||
                  import.meta.env.WEBFLOW_CMS_SITE_API_TOKEN;

    if (!token) {
      return new Response(
        JSON.stringify({ error: 'Missing token', message: 'WEBFLOW_CMS_SITE_API_TOKEN is not configured' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const apiBaseUrl = (locals as any)?.runtime?.env?.WEBFLOW_API_HOST ||
                       import.meta.env.WEBFLOW_API_HOST;

    const url = new URL(request.url);
    const limit = Math.min(Number(url.searchParams.get('limit') ?? 20), 100);
    const offset = Number(url.searchParams.get('offset') ?? 0);

    const res = await fetchProductsFromWebflow(token, limit, offset, apiBaseUrl);

    return new Response(JSON.stringify(res), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        // Cache 1 hour on CDN, serve stale up to 24h while revalidating
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400'
      }
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: 'Error fetching products', message, timestamp: new Date().toISOString() }),
      { status: 502, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
