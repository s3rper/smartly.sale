/**
 * Facebook Conversions API (CAPI) — Server-side pixel events
 * POST /api/capi
 *
 * Receives browser-side events (ViewContent, Lead, etc.) and forwards them
 * to Facebook CAPI for better attribution. Deduplicates with browser pixel
 * using event_id.
 *
 * Body: { eventName, eventId, url, email?, phone?, fbclid?, fbp?, fbc?, userAgent, ip }
 */
import type { APIRoute } from 'astro';
import { createHash } from 'node:crypto';

function env(key: string): string {
  return (typeof process !== 'undefined' ? process.env[key] : undefined) ?? '';
}

function sha256(value: string): string {
  return createHash('sha256').update(value.trim().toLowerCase()).digest('hex');
}

interface CAPIBody {
  eventName: string;
  eventId?: string;
  url?: string;
  email?: string;
  phone?: string;
  fbclid?: string;
  fbp?: string;
  fbc?: string;
  userAgent?: string;
  ip?: string;
}

export const POST: APIRoute = async ({ request }) => {
  const pixelId = env('FB_PIXEL_ID') || '849998290917290';
  const accessToken = env('FB_ACCESS_TOKEN');

  if (!accessToken) {
    // Silently succeed — CAPI just won't fire without a token
    return new Response(JSON.stringify({ ok: true, note: 'CAPI not configured' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  let body: CAPIBody;
  try {
    body = (await request.json()) as CAPIBody;
  } catch {
    return new Response(JSON.stringify({ ok: false, error: 'Invalid JSON' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const { eventName, eventId, url, email, phone, fbclid, fbp, fbc, userAgent } = body;

  // Get real IP from headers
  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    body.ip ||
    '';

  // Build user data with hashed PII
  const userData: Record<string, string> = {};
  if (email) userData.em = sha256(email);
  if (phone) userData.ph = sha256(phone.replace(/\D/g, ''));
  if (ip) userData.client_ip_address = ip;
  if (userAgent) userData.client_user_agent = userAgent;
  if (fbp) userData.fbp = fbp;
  if (fbc) userData.fbc = fbc;
  else if (fbclid)
    userData.fbc = `fb.1.${Date.now()}.${fbclid}`;

  const event: Record<string, unknown> = {
    event_name: eventName,
    event_time: Math.floor(Date.now() / 1000),
    event_source_url: url ?? 'https://smartly.sale',
    action_source: 'website',
    user_data: userData,
  };
  if (eventId) event.event_id = eventId;

  try {
    const res = await fetch(
      `https://graph.facebook.com/v21.0/${pixelId}/events?access_token=${accessToken}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          data: [event],
          test_event_code: env('FB_TEST_EVENT_CODE') || undefined,
        }),
        signal: AbortSignal.timeout(8_000),
      },
    );

    const data = (await res.json()) as { events_received?: number; error?: { message: string } };

    if (!res.ok || data.error) {
      console.error('[capi] FB error:', data.error?.message);
      return new Response(
        JSON.stringify({ ok: false, error: data.error?.message }),
        { status: 200, headers: { 'Content-Type': 'application/json' } },
      );
    }

    return new Response(
      JSON.stringify({ ok: true, events_received: data.events_received }),
      { status: 200, headers: { 'Content-Type': 'application/json' } },
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('[capi] error:', message);
    return new Response(JSON.stringify({ ok: false, error: message }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

// CORS preflight
export const OPTIONS: APIRoute = async () => {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
};
