/**
 * Daily Broadcast — Master automation cron
 * Runs daily at 1:00 AM UTC (9 AM Philippines time)
 * 1. Fetches top CPABuild offers
 * 2. Uses Claude (claude-haiku-4-5) to generate platform-specific content
 * 3. Posts to: Telegram, Facebook Page, Pinterest
 * 4. Sends Brevo email broadcast to subscribers
 *
 * Trigger: GET /api/daily-broadcast
 * Auth: Authorization: Bearer CRON_SECRET
 */
import type { APIRoute } from 'astro';
import Anthropic from '@anthropic-ai/sdk';

// ── helpers ──────────────────────────────────────────────────────────────────

function env(key: string): string {
  return (
    (import.meta.env as Record<string, string>)[key] ??
    (typeof process !== 'undefined' ? process.env[key] : undefined) ??
    ''
  );
}

interface CPAOffer {
  id: string | number;
  name: string;
  anchor?: string;
  conversion?: string;
  payout?: number;
  user_payout?: number;
  url?: string;
  network_icon?: string;
}

async function fetchTopOffers(): Promise<CPAOffer[]> {
  const userId = env('CPABUILD_USER_ID') || '48201';
  const apiKey = env('CPABUILD_API_KEY');
  if (!apiKey) return [];

  const feedUrl = new URL(
    'https://d2dzcaq3bhqk1m.cloudfront.net/public/offers/feed.php',
  );
  feedUrl.searchParams.set('user_id', userId);
  feedUrl.searchParams.set('api_key', apiKey);
  feedUrl.searchParams.set('s1', 'daily-broadcast');
  feedUrl.searchParams.set('s2', 'cron');

  try {
    const res = await fetch(feedUrl.toString(), {
      headers: { Accept: 'application/json' },
      signal: AbortSignal.timeout(10_000),
    });
    const text = await res.text();
    const raw = JSON.parse(text.trim());
    const offers: CPAOffer[] = Array.isArray(raw)
      ? raw
      : ((raw.offers ?? raw.data ?? []) as CPAOffer[]);
    // Return top 3 by payout
    return offers
      .sort((a, b) => (b.user_payout ?? 0) - (a.user_payout ?? 0))
      .slice(0, 3);
  } catch {
    return [];
  }
}

// ── Claude content generation ─────────────────────────────────────────────────

async function generateContent(
  offers: CPAOffer[],
  platform: 'telegram' | 'facebook' | 'pinterest' | 'email',
): Promise<string> {
  const anthropicKey = env('ANTHROPIC_API_KEY');
  if (!anthropicKey) return '';

  const client = new Anthropic({ apiKey: anthropicKey });

  const offerList = offers
    .map(
      (o, i) =>
        `${i + 1}. ${o.name} — ${o.anchor ?? 'Join now'} (Prize/Reward)`,
    )
    .join('\n');

  const instructions: Record<string, string> = {
    telegram: `Write a short, exciting Telegram message (max 300 chars) in Taglish (mix of Tagalog and English) promoting these Philippine prize offers. Use 2-3 emojis. End with a call to action. Format: plain text with HTML bold <b>text</b> allowed.`,
    facebook: `Write an engaging Facebook post (max 400 chars) in Taglish promoting these Philippine prize draws. Use 3-4 emojis. Create FOMO (fear of missing out). End with "Mag-claim na!" Include hashtags: #GCash #Pilipinas #LibreAngSumali`,
    pinterest: `Write a Pinterest pin description (max 200 chars) in English for these Philippine prize offers. Include keywords: free prizes Philippines, win online, gift cards. Professional tone.`,
    email: `Write a short email body (max 500 chars) in Taglish for Filipino subscribers about these prize draws. Subject line first on its own line starting with "SUBJECT:". Friendly and exciting tone. Include a call to action button text on last line starting with "CTA:".`,
  };

  const response = await client.messages.create({
    model: 'claude-haiku-4-5',
    max_tokens: 512,
    messages: [
      {
        role: 'user',
        content: `You are a social media marketer for smartly.sale, a Philippine prize/rewards site. Today's offers:\n${offerList}\n\n${instructions[platform]}\n\nSite URL: https://smartly.sale/earn-gcash`,
      },
    ],
  });

  const block = response.content[0];
  return block.type === 'text' ? block.text.trim() : '';
}

// ── Platform poster functions ──────────────────────────────────────────────

async function postToTelegram(content: string): Promise<{ ok: boolean; error?: string }> {
  const token = env('TELEGRAM_BOT_TOKEN');
  const channelId = env('TELEGRAM_CHANNEL_ID');
  if (!token || !channelId) return { ok: false, error: 'Telegram not configured' };

  const res = await fetch(
    `https://api.telegram.org/bot${token}/sendMessage`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: channelId,
        text: `${content}\n\n🔗 https://smartly.sale/earn-gcash`,
        parse_mode: 'HTML',
        disable_web_page_preview: false,
      }),
    },
  );
  const data = (await res.json()) as { ok: boolean; description?: string };
  return { ok: data.ok, error: data.description };
}

async function postToFacebook(content: string): Promise<{ ok: boolean; error?: string }> {
  const pageId    = env('FACEBOOK_PAGE_ID')    || env('FB_PAGE_ID');
  const pageToken = env('FACEBOOK_ACCESS_TOKEN') || env('FB_PAGE_ACCESS_TOKEN');
  if (!pageId || !pageToken) return { ok: false, error: 'Facebook Page not configured' };

  const res = await fetch(
    `https://graph.facebook.com/v21.0/${pageId}/feed`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: content,
        link: 'https://smartly.sale/earn-gcash',
        access_token: pageToken,
      }),
    },
  );
  const data = (await res.json()) as { id?: string; error?: { message: string } };
  return { ok: !!data.id, error: data.error?.message };
}

async function pinToPinterest(
  content: string,
  offer: CPAOffer,
): Promise<{ ok: boolean; error?: string }> {
  const token = env('PINTEREST_ACCESS_TOKEN');
  const boardId = env('PINTEREST_BOARD_ID');
  if (!token || !boardId) return { ok: false, error: 'Pinterest not configured' };

  const res = await fetch('https://api.pinterest.com/v5/pins', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      board_id: boardId,
      title: offer.name ?? 'Win Prizes in Philippines 2025',
      description: content,
      link: 'https://smartly.sale/earn-gcash',
      media_source: {
        source_type: 'image_url',
        url:
          offer.network_icon ??
          'https://smartly.sale/og-image.jpg',
      },
    }),
  });
  const data = (await res.json()) as { id?: string; code?: number; message?: string };
  return { ok: !!data.id, error: data.message };
}

async function sendBrevoEmail(
  content: string,
): Promise<{ ok: boolean; error?: string }> {
  const apiKey = env('BREVO_API_KEY');
  const listId = env('BREVO_LIST_ID');
  if (!apiKey || !listId) return { ok: false, error: 'Brevo not configured' };

  // Parse subject and CTA from Claude-generated content
  const lines = content.split('\n');
  const subjectLine = lines.find((l) => l.startsWith('SUBJECT:')) ?? '';
  const ctaLine = lines.find((l) => l.startsWith('CTA:')) ?? '';
  const subject = subjectLine.replace('SUBJECT:', '').trim() ||
    '🎁 Bagong Prize Draws Available — Claim Now!';
  const ctaText = ctaLine.replace('CTA:', '').trim() || 'I-claim ang Prize Ko';
  const body = lines
    .filter((l) => !l.startsWith('SUBJECT:') && !l.startsWith('CTA:'))
    .join('\n')
    .trim();

  const htmlBody = `
<div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:20px">
  <h2 style="color:#7c3aed">🎁 Smartly.Sale — Bagong Rewards!</h2>
  <p style="color:#374151;line-height:1.6">${body.replace(/\n/g, '<br>')}</p>
  <div style="text-align:center;margin:24px 0">
    <a href="https://smartly.sale/earn-gcash"
       style="background:#7c3aed;color:#fff;padding:12px 28px;border-radius:8px;text-decoration:none;font-weight:bold;display:inline-block">
      ${ctaText}
    </a>
  </div>
  <p style="color:#9ca3af;font-size:12px">
    Smartly.Sale · Philippines Prize &amp; Rewards Hub<br>
    <a href="{{unsubscribe}}" style="color:#9ca3af">Unsubscribe</a>
  </p>
</div>`;

  const today = new Date().toLocaleDateString('en-PH', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const res = await fetch('https://api.brevo.com/v3/emailCampaigns', {
    method: 'POST',
    headers: {
      'api-key': apiKey,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: `Daily Broadcast ${today}`,
      subject,
      sender: { name: 'Smartly Sale', email: 'hello@smartly.sale' },
      type: 'classic',
      htmlContent: htmlBody,
      recipients: { listIds: [parseInt(listId, 10)] },
      scheduledAt: new Date(Date.now() + 2 * 60 * 1000).toISOString(), // 2 min from now
    }),
  });

  if (!res.ok) {
    const err = (await res.json()) as { message?: string };
    return { ok: false, error: err.message };
  }
  return { ok: true };
}

// ── Main handler ──────────────────────────────────────────────────────────────

export const GET: APIRoute = async ({ request }) => {
  // Auth check
  const cronSecret = env('CRON_SECRET');
  const authHeader = request.headers.get('Authorization') ?? '';
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const results: Record<string, unknown> = {};
  const startTime = Date.now();

  try {
    // 1. Fetch offers
    const offers = await fetchTopOffers();
    results.offers_count = offers.length;

    if (offers.length === 0) {
      return new Response(
        JSON.stringify({ ok: false, error: 'No offers fetched', results }),
        { status: 200, headers: { 'Content-Type': 'application/json' } },
      );
    }

    // 2. Generate platform-specific content with Claude (parallel)
    const [telegramContent, fbContent, pinterestContent, emailContent] =
      await Promise.all([
        generateContent(offers, 'telegram'),
        generateContent(offers, 'facebook'),
        generateContent(offers, 'pinterest'),
        generateContent(offers, 'email'),
      ]);

    // 3. Post to all platforms (parallel)
    const [telegramResult, fbResult, pinterestResult, emailResult] =
      await Promise.all([
        telegramContent
          ? postToTelegram(telegramContent)
          : Promise.resolve({ ok: false, error: 'No content' }),
        fbContent
          ? postToFacebook(fbContent)
          : Promise.resolve({ ok: false, error: 'No content' }),
        pinterestContent
          ? pinToPinterest(pinterestContent, offers[0])
          : Promise.resolve({ ok: false, error: 'No content' }),
        emailContent
          ? sendBrevoEmail(emailContent)
          : Promise.resolve({ ok: false, error: 'No content' }),
      ]);

    results.telegram = telegramResult;
    results.facebook = fbResult;
    results.pinterest = pinterestResult;
    results.email = emailResult;
    results.duration_ms = Date.now() - startTime;

    console.log('[daily-broadcast] completed', JSON.stringify(results));

    return new Response(JSON.stringify({ ok: true, results }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('[daily-broadcast] error:', message);
    return new Response(
      JSON.stringify({ ok: false, error: message, results }),
      { status: 500, headers: { 'Content-Type': 'application/json' } },
    );
  }
};
