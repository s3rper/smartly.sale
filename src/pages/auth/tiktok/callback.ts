import type { APIRoute } from 'astro';

/**
 * GET /auth/tiktok/callback
 *
 * Handles the OAuth callback from TikTok. Exchanges the authorization code
 * for an access token and displays the result.
 */
export const GET: APIRoute = async ({ request, locals }) => {
  const reqUrl = new URL(request.url);
  const code = reqUrl.searchParams.get('code');
  const error = reqUrl.searchParams.get('error');
  const errorDescription = reqUrl.searchParams.get('error_description');

  if (error) {
    return new Response(
      JSON.stringify({ error, error_description: errorDescription }),
      { status: 400, headers: { 'Content-Type': 'application/json' } },
    );
  }

  if (!code) {
    return new Response(
      JSON.stringify({ error: 'Missing authorization code' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } },
    );
  }

  const runtimeEnv = (locals as any)?.runtime?.env ?? {};
  const clientKey =
    runtimeEnv.TIKTOK_CLIENT_KEY ??
    import.meta.env.TIKTOK_CLIENT_KEY ??
    process.env.TIKTOK_CLIENT_KEY ??
    '';
  const clientSecret =
    runtimeEnv.TIKTOK_CLIENT_SECRET ??
    import.meta.env.TIKTOK_CLIENT_SECRET ??
    process.env.TIKTOK_CLIENT_SECRET ??
    '';

  if (!clientKey || !clientSecret) {
    return new Response(
      JSON.stringify({ error: 'TikTok client credentials not configured' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } },
    );
  }

  const redirectUri = `${reqUrl.protocol}//${reqUrl.host}/auth/tiktok/callback`;

  try {
    const tokenRes = await fetch('https://open.tiktokapis.com/v2/oauth/token/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_key: clientKey,
        client_secret: clientSecret,
        code,
        grant_type: 'authorization_code',
        redirect_uri: redirectUri,
      }),
    });

    const tokenData = await tokenRes.json();

    if (!tokenRes.ok || tokenData.error) {
      return new Response(JSON.stringify(tokenData, null, 2), {
        status: tokenRes.status || 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const accessToken = tokenData.access_token ?? '';
    const refreshToken = tokenData.refresh_token ?? '';
    const openId = tokenData.open_id ?? '';
    const expiresIn = tokenData.expires_in ?? 0;
    const scope = tokenData.scope ?? '';

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="robots" content="noindex, nofollow" />
  <title>TikTok Auth Success - smartly.sale</title>
  <style>
    body { font-family: system-ui, sans-serif; max-width: 640px; margin: 40px auto; padding: 0 20px; background: #f5f5f5; color: #333; }
    .card { background: white; border-radius: 16px; padding: 32px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
    h1 { color: #16a34a; font-size: 1.5rem; margin: 0 0 8px; }
    .subtitle { color: #666; margin-bottom: 24px; font-size: 0.95rem; }
    label { display: block; font-weight: 600; font-size: 0.85rem; color: #333; margin-bottom: 4px; margin-top: 16px; }
    .field { background: #f0f0f0; border: 1px solid #ddd; border-radius: 8px; padding: 10px 14px; font-family: monospace; font-size: 0.8rem; word-break: break-all; cursor: text; user-select: all; }
    .meta { display: flex; gap: 24px; margin-top: 20px; padding-top: 16px; border-top: 1px solid #eee; font-size: 0.85rem; color: #666; }
    .warn { background: #fffbeb; border: 1px solid #fde68a; border-radius: 8px; padding: 12px; margin-top: 20px; font-size: 0.8rem; color: #92400e; }
    .back { display: inline-block; margin-top: 20px; color: #2563eb; text-decoration: none; font-size: 0.9rem; }
  </style>
</head>
<body>
  <div class="card">
    <h1>TikTok Connected</h1>
    <p class="subtitle">OAuth flow completed. Copy the tokens below into your environment variables.</p>

    <label>Access Token</label>
    <div class="field">${escapeHtml(accessToken)}</div>

    <label>Refresh Token</label>
    <div class="field">${escapeHtml(refreshToken)}</div>

    <label>Open ID</label>
    <div class="field">${escapeHtml(openId)}</div>

    <label>Scopes</label>
    <div class="field">${escapeHtml(scope)}</div>

    <div class="meta">
      <div><strong>Expires in:</strong> ${Math.round(expiresIn / 3600)}h</div>
      <div><strong>Status:</strong> Connected</div>
    </div>

    <div class="warn">
      Save these tokens now. Add <code>TIKTOK_ACCESS_TOKEN</code> and <code>TIKTOK_REFRESH_TOKEN</code> to your <code>.env</code> and Vercel environment variables.
    </div>

    <a href="/" class="back">&larr; Back to smartly.sale</a>
  </div>
</body>
</html>`;

    return new Response(html, {
      status: 200,
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
    });
  } catch (err) {
    return new Response(
      JSON.stringify({ error: 'Token exchange failed', details: String(err) }),
      { status: 500, headers: { 'Content-Type': 'application/json' } },
    );
  }
};

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
