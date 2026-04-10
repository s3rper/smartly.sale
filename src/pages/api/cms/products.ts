import type { APIRoute } from 'astro';
import { fetchProductsFromWebflow } from '../../../lib/products';

export const GET: APIRoute = async ({ request }) => {
  try {
    const url = new URL(request.url);
    const limit = Math.min(Number(url.searchParams.get('limit') ?? 20), 5000);
    const offset = Number(url.searchParams.get('offset') ?? 0);

    const res = await fetchProductsFromWebflow(undefined, limit, offset);

    return new Response(JSON.stringify(res), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
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
