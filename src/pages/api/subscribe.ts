import type { APIRoute } from 'astro';

// Webflow site ID (from API: GET /v2/sites)
const WEBFLOW_SITE_ID = '662c296bd4d3a8028c713c69';

export const POST: APIRoute = async ({ request, locals }) => {
  let email = '';
  let source = 'unknown';

  try {
    const body = await request.json() as { email?: string; source?: string };
    email  = (body.email  ?? '').trim().toLowerCase();
    source = (body.source ?? 'popup').trim();
  } catch {
    return json({ error: 'Invalid JSON body' }, 400);
  }

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return json({ error: 'Invalid email address' }, 422);
  }

  // Always log — shows up in Vercel Function Logs
  console.log(`[subscribe] new subscriber: ${email} (source: ${source})`);

  // ── Webflow form submission ─────────────────────────────────────────────
  // Uses Webflow's public form endpoint (same as native Webflow forms).
  // This creates a form submission visible in: Webflow Dashboard → Forms
  try {
    const formData = new URLSearchParams();
    formData.set('name', 'Email Subscribers');  // form display name in Webflow
    formData.set('Email', email);
    formData.set('Source', source);
    formData.set('Subscribed At', new Date().toISOString());
    formData.set('_gotcha', '');  // honeypot — must be empty

    const res = await fetch(`https://webflow.com/api/v1/form/${WEBFLOW_SITE_ID}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json',
      },
      body: formData.toString(),
    });

    if (res.ok) {
      console.log('[subscribe] Webflow form submission successful');
    } else {
      const msg = await res.text().catch(() => '');
      console.error('[subscribe] Webflow form error:', res.status, msg.slice(0, 300));
    }
  } catch (err) {
    console.error('[subscribe] Webflow form fetch error:', err);
  }

  // ── Optional: also add to Brevo contact list ───────────────────────────
  const runtimeEnv   = (locals as any)?.runtime?.env;
  const brevoKey     = runtimeEnv?.BREVO_API_KEY     ?? import.meta.env.BREVO_API_KEY     ?? process.env.BREVO_API_KEY     ?? '';
  const brevoListId  = runtimeEnv?.BREVO_LIST_ID     ?? import.meta.env.BREVO_LIST_ID     ?? process.env.BREVO_LIST_ID     ?? '';

  if (brevoKey) {
    try {
      const payload: Record<string, unknown> = {
        email,
        updateEnabled: true,
        attributes: { SOURCE: source, SITE: 'smartly.sale' },
      };
      if (brevoListId) payload.listIds = [parseInt(brevoListId, 10)];

      const res = await fetch('https://api.brevo.com/v3/contacts', {
        method: 'POST',
        headers: {
          'api-key': brevoKey,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok && res.status !== 204) {
        const msg = await res.text().catch(() => '');
        // 400 = already exists — treat as success
        if (!msg.includes('already')) {
          console.error('[subscribe] Brevo error:', res.status, msg.slice(0, 200));
        }
      }
    } catch (err) {
      console.error('[subscribe] Brevo fetch error:', err);
    }
  }

  return json({ ok: true, message: 'Subscribed! You\'ll get prize alerts soon.' }, 200);
};

function json(body: unknown, status: number) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}
