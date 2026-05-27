import type { APIRoute } from 'astro';

// Vercel cron calls this endpoint daily at 1:00 AM UTC (9:00 AM PH time).
// It fetches the live CPABuild offer feed and posts a digest to a Telegram channel.
//
// Required env vars:
//   TELEGRAM_BOT_TOKEN  — from @BotFather on Telegram
//   TELEGRAM_CHANNEL_ID — your channel, e.g. "@LibrengPrizesPH" or "-100123456789"
//   CRON_SECRET         — any random string; add to Vercel env, Vercel sets it automatically for cron calls

export const GET: APIRoute = async ({ request, locals }) => {
  // ── Auth: only Vercel cron or requests with correct secret may call this ──
  const runtimeEnv  = (locals as any)?.runtime?.env;
  const cronSecret  = runtimeEnv?.CRON_SECRET ?? import.meta.env.CRON_SECRET ?? process.env.CRON_SECRET ?? '';
  const authHeader  = request.headers.get('authorization') ?? '';

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return new Response('Unauthorized', { status: 401 });
  }

  const botToken   = runtimeEnv?.TELEGRAM_BOT_TOKEN   ?? import.meta.env.TELEGRAM_BOT_TOKEN   ?? process.env.TELEGRAM_BOT_TOKEN   ?? '';
  const channelId  = runtimeEnv?.TELEGRAM_CHANNEL_ID  ?? import.meta.env.TELEGRAM_CHANNEL_ID  ?? process.env.TELEGRAM_CHANNEL_ID  ?? '';
  if (!botToken || !channelId) {
    return new Response(JSON.stringify({ error: 'TELEGRAM_BOT_TOKEN and TELEGRAM_CHANNEL_ID are required' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // ── Fetch CPAGrip offers ──────────────────────────────────────────────────
  let offers: Array<{ name?: string; short_description?: string; link?: string; payout?: string }> = [];
  try {
    const feedUrl = new URL('https://www.cpagrip.com/common/offer_feed_json.php');
    feedUrl.searchParams.set('user_id', '1392970');
    feedUrl.searchParams.set('pubkey', 'a5202038591dd63f9d0dc5e21ca96ecb');
    feedUrl.searchParams.set('tracking_id', 'telegram');

    const res  = await fetch(feedUrl.toString(), { signal: AbortSignal.timeout(8_000) });
    const text = await res.text();
    const raw  = JSON.parse(text.trim());
    offers     = Array.isArray(raw) ? raw : [];
  } catch (err) {
    console.error('[telegram-notify] feed error:', err);
    return new Response(JSON.stringify({ error: 'Failed to fetch offers' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }

  if (offers.length === 0) {
    return new Response(JSON.stringify({ ok: true, sent: false, reason: 'No offers available' }), {
      status: 200, headers: { 'Content-Type': 'application/json' },
    });
  }

  // ── Build Telegram message ────────────────────────────────────────────────
  const today = new Date().toLocaleDateString('en-PH', { weekday: 'long', month: 'long', day: 'numeric', timeZone: 'Asia/Manila' });

  const offerLines = offers.slice(0, 6).map(o => {
    const name   = o.short_description ?? o.name ?? 'Exclusive Prize';
    const payout = parseFloat(String(o.payout ?? '0'));
    return `🎁 <b>${escapeHtml(name)}</b>\n💰 Advertiser payout: $${payout.toFixed(2)}\n👉 <a href="https://smartly.sale/online-contests-philippines">Claim Entry — Libre!</a>`;
  }).join('\n\n');

  const message = [
    `🔥 <b>BAGONG PRIZES TODAY — ${escapeHtml(today)}</b>`,
    ``,
    `May ${offers.length} active na prize draws available sa Pilipinas ngayon!`,
    ``,
    offerLines,
    ``,
    `━━━━━━━━━━━━━━━━━━━━`,
    `📱 <a href="https://smartly.sale/win-free-phone">Win Free Phone</a>`,
    `💰 <a href="https://smartly.sale/earn-gcash">Earn GCash</a>`,
    `🎁 <a href="https://smartly.sale/free-gift-cards-philippines">Free Gift Cards</a>`,
    ``,
    `<i>Libre sumali. Walang bayad. Verified offers.</i>`,
  ].join('\n');

  // ── Send to Telegram ──────────────────────────────────────────────────────
  try {
    const tgRes = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: channelId,
        text: message,
        parse_mode: 'HTML',
        disable_web_page_preview: false,
      }),
      signal: AbortSignal.timeout(10_000),
    });

    const tgBody = await tgRes.json() as { ok: boolean; description?: string };

    if (!tgBody.ok) {
      console.error('[telegram-notify] Telegram error:', tgBody.description);
      return new Response(JSON.stringify({ error: tgBody.description }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }

    console.log(`[telegram-notify] sent ${offers.length} offers to ${channelId}`);
    return new Response(JSON.stringify({ ok: true, offerCount: offers.length, channel: channelId }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error('[telegram-notify] fetch error:', msg);
    return new Response(JSON.stringify({ error: msg }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
};

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}
