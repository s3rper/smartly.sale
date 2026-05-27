import type { APIRoute } from 'astro';

/**
 * GET /auth/tiktok
 *
 * Starts the TikTok OAuth 2.0 flow by redirecting the user to TikTok's
 * authorization page. The redirect_uri is built dynamically from the
 * request host so it works on localhost, preview deploys, and production.
 */
export const GET: APIRoute = async ({ request, locals }) => {
  const runtimeEnv = (locals as any)?.runtime?.env ?? {};
  const clientKey =
    runtimeEnv.TIKTOK_CLIENT_KEY ??
    import.meta.env.TIKTOK_CLIENT_KEY ??
    process.env.TIKTOK_CLIENT_KEY ??
    '';

  if (!clientKey) {
    return new Response(
      JSON.stringify({ error: 'TIKTOK_CLIENT_KEY is not configured' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } },
    );
  }

  // Build redirect URI from the current request host
  const reqUrl = new URL(request.url);
  const redirectUri = `${reqUrl.protocol}//${reqUrl.host}/auth/tiktok/callback`;

  // CSRF protection — random state token
  const state = crypto.randomUUID();

  // Scopes: user.info.basic is the minimum for sandbox
  const scopes = ['user.info.basic', 'user.info.profile', 'video.list'];

  const authUrl = new URL('https://www.tiktok.com/v2/auth/authorize/');
  authUrl.searchParams.set('client_key', clientKey);
  authUrl.searchParams.set('response_type', 'code');
  authUrl.searchParams.set('scope', scopes.join(','));
  authUrl.searchParams.set('redirect_uri', redirectUri);
  authUrl.searchParams.set('state', state);

  return Response.redirect(authUrl.toString(), 302);
};
