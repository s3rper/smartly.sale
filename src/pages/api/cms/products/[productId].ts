import type { APIRoute } from 'astro';
import { WebflowClient } from 'webflow-api';

export const GET: APIRoute = async ({ params, locals }) => {
  const token = locals?.runtime?.env?.WEBFLOW_CMS_SITE_API_TOKEN || 
                import.meta.env.WEBFLOW_CMS_SITE_API_TOKEN;
  
  if (!token) return new Response('Missing token', { status: 500 });

  const baseUrl = locals?.runtime?.env?.WEBFLOW_API_HOST || 
                  import.meta.env.WEBFLOW_API_HOST;
  
  const client = new WebflowClient({
    accessToken: token,
    ...(baseUrl && { baseUrl })
  });

  const { productId } = params;
  
  if (!productId) {
    return new Response(JSON.stringify({ error: 'Product ID required' }), { 
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    // Affiliate Products collection ID
    const collectionId = '69158c209e29b59a86d4b534';
    
    const item = await client.collections.items.getItemLive(collectionId, productId);
    
    return new Response(JSON.stringify(item), {
      status: 200,
      headers: { 
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=300'
      }
    });
  } catch (error) {
    console.error('Error fetching product:', error);
    return new Response(JSON.stringify({ error: 'Product not found' }), { 
      status: 404,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
