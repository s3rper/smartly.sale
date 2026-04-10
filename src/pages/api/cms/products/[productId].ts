import type { APIRoute } from 'astro';
import { shopeeProducts } from '../../../../lib/shopee-loader';

export const GET: APIRoute = async ({ params }) => {
  const { productId } = params;

  if (!productId) {
    return new Response(JSON.stringify({ error: 'Product ID required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const product = shopeeProducts.find(p => p.id === productId);

  if (!product) {
    return new Response(JSON.stringify({ error: 'Product not found' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  return new Response(JSON.stringify(product), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=300'
    }
  });
};
