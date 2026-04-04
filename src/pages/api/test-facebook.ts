/**
 * Facebook Page Post Test — GET /api/test-facebook
 * 1. Generates a short post with Claude
 * 2. Posts it to your Facebook Page
 * 3. Returns the post URL to verify
 */
import type { APIRoute } from 'astro';
import Anthropic from '@anthropic-ai/sdk';

function env(key: string): string {
  return (
    (import.meta.env as Record<string, string>)[key] ??
    (typeof process !== 'undefined' ? process.env[key] : undefined) ??
    ''
  );
}

export const GET: APIRoute = async () => {
  const pageId    = env('FB_PAGE_ID')    || env('FACEBOOK_PAGE_ID');
  const pageToken = env('FB_PAGE_ACCESS_TOKEN') || env('FACEBOOK_ACCESS_TOKEN');
  const anthropicKey = env('ANTHROPIC_API_KEY');

  // ── 1. Check credentials ────────────────────────────────────────────────────
  if (!pageId || !pageToken) {
    return new Response(
      JSON.stringify({
        ok: false,
        step: 'credentials',
        error: 'FB_PAGE_ID or FB_PAGE_ACCESS_TOKEN not set in .env',
        found: { pageId: !!pageId, pageToken: !!pageToken },
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } },
    );
  }

  // ── 2. Generate post with Claude ────────────────────────────────────────────
  let postText = '🎁 Manalo ng libreng prizes online sa Pilipinas! iPhone, GCash rewards, at marami pa. Libre sumali — claim na! 👉 https://smartly.sale/earn-gcash #GCash #Pilipinas #LibreAngSumali';

  if (anthropicKey) {
    try {
      const client = new Anthropic({ apiKey: anthropicKey });
      const response = await client.messages.create({
        model: 'claude-haiku-4-5',
        max_tokens: 256,
        messages: [
          {
            role: 'user',
            content: `Write an engaging Facebook post (max 280 chars) in Taglish (mix of Tagalog and English) for smartly.sale — a Philippine prize and rewards site. Promote that users can win free iPhones, GCash rewards, and gift cards. Use 3 emojis, create FOMO, end with the link https://smartly.sale/earn-gcash and hashtags #GCash #Pilipinas #LibreAngSumali. Output only the post text, nothing else.`,
          },
        ],
      });
      const block = response.content[0];
      if (block.type === 'text') postText = block.text.trim();
    } catch (err) {
      // Fall back to static text — not a fatal error
      console.warn('[test-facebook] Claude generation failed:', err instanceof Error ? err.message : err);
    }
  }

  // ── 3. Post to Facebook Page ────────────────────────────────────────────────
  let fbResult: { id?: string; error?: { message: string; code?: number } };
  try {
    const res = await fetch(
      `https://graph.facebook.com/v21.0/${pageId}/feed`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: postText,
          link: 'https://smartly.sale/earn-gcash',
          access_token: pageToken,
        }),
        signal: AbortSignal.timeout(10_000),
      },
    );
    fbResult = (await res.json()) as typeof fbResult;
  } catch (err) {
    return new Response(
      JSON.stringify({
        ok: false,
        step: 'facebook_api',
        error: err instanceof Error ? err.message : String(err),
        generated_post: postText,
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } },
    );
  }

  if (fbResult.error) {
    return new Response(
      JSON.stringify({
        ok: false,
        step: 'facebook_api',
        error: fbResult.error.message,
        error_code: fbResult.error.code,
        generated_post: postText,
        hint: fbResult.error.code === 190
          ? 'Access token expired or invalid. Regenerate it from Facebook Business → Settings → Page Access Tokens.'
          : fbResult.error.code === 200
          ? 'Missing permission. Make sure the token has pages_manage_posts and pages_read_engagement permissions.'
          : undefined,
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } },
    );
  }

  // ── 4. Success ──────────────────────────────────────────────────────────────
  const postId = fbResult.id ?? '';
  const postUrl = postId
    ? `https://www.facebook.com/${postId.replace('_', '/posts/')}`
    : `https://www.facebook.com/${pageId}`;

  return new Response(
    JSON.stringify({
      ok: true,
      post_id: postId,
      post_url: postUrl,
      generated_post: postText,
      message: 'Successfully posted to Facebook Page!',
    }),
    { status: 200, headers: { 'Content-Type': 'application/json' } },
  );
};
