/**
 * CPABuild S2S Postback — Conversion webhook receiver
 * GET /api/cpabuild-postback?payout={payout}&s1={s1}&s2={s2}&offer_id={offer_id}&status={status}
 *
 * Set this URL in CPABuild Settings → Postback URL:
 *   https://smartly.sale/api/cpabuild-postback?payout={payout}&s1={s1}&s2={s2}&offer_id={offer_id}&status={status}
 *
 * Logs conversions + fires Facebook CAPI Lead event.
 * Stores earnings in a simple JSON log (Vercel KV or filesystem in dev).
 */
import type { APIRoute } from 'astro';

function env(key: string): string {
  return (typeof process !== 'undefined' ? process.env[key] : undefined) ?? '';
}

interface ConversionRecord {
  timestamp: string;
  offer_id: string;
  payout: number;
  s1: string;
  s2: string;
  status: string;
}

// In-memory earnings log (survives for the lifetime of the serverless instance)
// For persistent storage, integrate with a KV store (Vercel KV, Upstash Redis, etc.)
const earningsLog: ConversionRecord[] = [];

export const GET: APIRoute = async ({ url, request }) => {
  const payout = parseFloat(url.searchParams.get('payout') ?? '0');
  const s1 = url.searchParams.get('s1') ?? '';
  const s2 = url.searchParams.get('s2') ?? '';
  const offerId = url.searchParams.get('offer_id') ?? '';
  const status = url.searchParams.get('status') ?? 'approved';

  // Optional: verify postback secret token
  const secret = env('CPABUILD_POSTBACK_SECRET');
  const token = url.searchParams.get('token') ?? '';
  if (secret && token !== secret) {
    console.warn('[postback] invalid token received');
    // Still return 200 to prevent retries, but don't log
    return new Response('OK', { status: 200 });
  }

  const record: ConversionRecord = {
    timestamp: new Date().toISOString(),
    offer_id: offerId,
    payout,
    s1,
    s2,
    status,
  };

  earningsLog.push(record);
  console.log('[postback] conversion:', JSON.stringify(record));

  // Fire Facebook CAPI Lead event for conversion tracking
  if (payout > 0) {
    try {
      const siteUrl = 'https://smartly.sale';
      const capiUrl = `${siteUrl}/api/capi`;
      const sourceUrl = s1 ? `${siteUrl}/${s1}` : siteUrl;

      await fetch(capiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventName: 'Lead',
          eventId: `cpabuild-${offerId}-${Date.now()}`,
          url: sourceUrl,
          ip: request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? '',
        }),
        signal: AbortSignal.timeout(5_000),
      });
    } catch {
      // Non-critical — don't fail the postback response
    }
  }

  // Respond with "1" as CPABuild expects
  return new Response('1', {
    status: 200,
    headers: { 'Content-Type': 'text/plain' },
  });
};

// Expose earnings data for the dashboard
export function getEarnings(): ConversionRecord[] {
  return [...earningsLog];
}

export function getTotalEarnings(): number {
  return earningsLog
    .filter((r) => r.status === 'approved')
    .reduce((sum, r) => sum + r.payout, 0);
}
