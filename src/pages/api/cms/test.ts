import type { APIRoute } from 'astro';

/**
 * Simple test endpoint to verify CMS API connection
 * Visit /api/cms/test to check if your API token and environment are configured correctly
 */
export const GET: APIRoute = async ({ locals }) => {
  const token = locals?.runtime?.env?.WEBFLOW_CMS_SITE_API_TOKEN || 
                import.meta.env.WEBFLOW_CMS_SITE_API_TOKEN;
  
  const apiHost = locals?.runtime?.env?.WEBFLOW_API_HOST || 
                  import.meta.env.WEBFLOW_API_HOST;

  const hasToken = !!token;
  const tokenPreview = token ? `${token.substring(0, 8)}...${token.substring(token.length - 8)}` : 'NOT SET';
  
  const response = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: {
      hasToken,
      tokenPreview: hasToken ? tokenPreview : 'MISSING',
      apiHost: apiHost || 'default (https://api.webflow.com)',
      collectionId: '69158c209e29b59a86d4b534'
    },
    message: hasToken 
      ? '✅ API token is configured. Your CMS connection should work!'
      : '❌ API token is missing. Add WEBFLOW_CMS_SITE_API_TOKEN to your .env file'
  };

  return new Response(JSON.stringify(response, null, 2), {
    status: hasToken ? 200 : 500,
    headers: { 
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache'
    }
  });
};
