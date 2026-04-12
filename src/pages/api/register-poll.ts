import type { APIRoute } from 'astro';
import { put } from '@vercel/blob';
import { Redis } from '@upstash/redis';

const redis = Redis.fromEnv();

export const POST: APIRoute = async ({ request }) => {
  // ── Auth ──────────────────────────────────────────────────────────────────
  const secret = import.meta.env.REGISTER_POLL_SECRET;
  if (!secret) {
    return new Response(JSON.stringify({ error: 'Server misconfigured: missing REGISTER_POLL_SECRET' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
  const incomingSecret = request.headers.get('x-poll-secret') ?? '';
  if (incomingSecret !== secret) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  // ── Parse body ────────────────────────────────────────────────────────────
  let pollId: string, shopeeUrl: string, imageBase64: string;
  try {
    const body = await request.json() as { pollId?: string; shopeeUrl?: string; imageBase64?: string };
    pollId     = body.pollId     ?? '';
    shopeeUrl  = body.shopeeUrl  ?? '';
    imageBase64 = body.imageBase64 ?? '';
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON body' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  if (!pollId || !shopeeUrl || !imageBase64) {
    return new Response(JSON.stringify({ error: 'Missing required fields: pollId, shopeeUrl, imageBase64' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  // ── Upload image to Vercel Blob ───────────────────────────────────────────
  let imageUrl: string;
  try {
    const imageBuffer = Buffer.from(imageBase64, 'base64');
    const blob = await put(`poll-images/${pollId}.png`, imageBuffer, {
      access: 'public',
      contentType: 'image/png',
    });
    imageUrl = blob.url;
  } catch (err) {
    console.error('[register-poll] Blob upload failed:', err);
    return new Response(JSON.stringify({ error: 'Image upload failed' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  // ── Store poll metadata in Vercel KV ─────────────────────────────────────
  try {
    await redis.set(`poll:${pollId}`, {
      shopeeUrl,
      imageUrl,
      createdAt: new Date().toISOString(),
    }, {
      // Expire after 30 days — polls don't need to live forever
      ex: 60 * 60 * 24 * 30,
    });
  } catch (err) {
    console.error('[register-poll] KV set failed:', err);
    return new Response(JSON.stringify({ error: 'Metadata storage failed' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  return new Response(JSON.stringify({ success: true, imageUrl }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
};
