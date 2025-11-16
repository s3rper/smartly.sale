import type { APIRoute } from 'astro';
import { WebflowClient } from 'webflow-api';

export const GET: APIRoute = async ({ request, locals }) => {
  try {
    const token = locals?.runtime?.env?.WEBFLOW_CMS_SITE_API_TOKEN || 
                  import.meta.env.WEBFLOW_CMS_SITE_API_TOKEN;
    
    console.log('API: Token available:', !!token);
    
    if (!token) {
      console.error('API: Missing WEBFLOW_CMS_SITE_API_TOKEN');
      return new Response(
        JSON.stringify({ 
          error: 'Missing token',
          message: 'WEBFLOW_CMS_SITE_API_TOKEN is not configured'
        }), 
        { 
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    const baseUrl = locals?.runtime?.env?.WEBFLOW_API_HOST || 
                    import.meta.env.WEBFLOW_API_HOST;
    
    console.log('API: Base URL:', baseUrl || 'default');
    
    const client = new WebflowClient({
      accessToken: token,
      ...(baseUrl && { baseUrl })
    });

    const url = new URL(request.url);
    const limit = Math.min(Number(url.searchParams.get('limit') ?? 20), 100);
    const offset = Number(url.searchParams.get('offset') ?? 0);

    console.log('API: Fetching products with limit:', limit, 'offset:', offset);

    // Affiliate Products collection ID
    const collectionId = '69158c209e29b59a86d4b534';
    
    console.log('API: Collection ID:', collectionId);
    
    const res = await client.collections.items.listItemsLive(collectionId, {
      limit,
      offset
    });
    
    console.log('API: Successfully fetched', res.items?.length || 0, 'products');
    
    return new Response(JSON.stringify(res), {
      status: 200,
      headers: { 
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=300' // Cache for 5 minutes
      }
    });
  } catch (error) {
    console.error('API: Error fetching products:', error);
    
    // More detailed error response
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const errorDetails = {
      error: 'Error fetching products',
      message: errorMessage,
      timestamp: new Date().toISOString()
    };
    
    return new Response(JSON.stringify(errorDetails), { 
      status: 502,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
