import type { APIRoute } from 'astro';
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({ apiKey: import.meta.env.ANTHROPIC_API_KEY });

const PROMPTS: Record<string, (input: string, extra?: string) => string> = {
  'review-summarizer': (reviews) => `You are a helpful product review analyst. Analyze the following Shopee product reviews and provide a structured summary.

Reviews:
${reviews}

Respond in this exact JSON format (no markdown, just pure JSON):
{
  "pros": ["pro 1", "pro 2", "pro 3"],
  "cons": ["con 1", "con 2", "con 3"],
  "verdict": "One sentence overall verdict",
  "rating": 8,
  "whoShouldBuy": "Description of who this product is ideal for",
  "whoShouldAvoid": "Description of who should skip this product",
  "summary": "2-3 sentence overall review summary"
}`,

  'budget-planner': (input, budget) => `You are a smart shopping advisor for Shopee Philippines. Help plan a shopping list.

Budget: ₱${budget}
Shopping needs: ${input}

Respond in this exact JSON format (no markdown, just pure JSON):
{
  "items": [
    {
      "name": "Item name",
      "estimatedPrice": 500,
      "priority": "high",
      "tip": "Short buying tip for this item on Shopee Philippines"
    }
  ],
  "totalEstimate": 2500,
  "budgetLeft": 500,
  "overallTip": "General shopping strategy tip",
  "bestTimeToShop": "When to buy these items for best deals",
  "savingsTip": "One specific way to save on this shopping list"
}`,
};

export const POST: APIRoute = async ({ request }) => {
  try {
    const { type, input, extra } = await request.json();

    if (!type || !input) {
      return new Response(JSON.stringify({ error: 'type and input are required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const promptFn = PROMPTS[type];
    if (!promptFn) {
      return new Response(JSON.stringify({ error: `Unknown tool type: ${type}` }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const message = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1024,
      messages: [{ role: 'user', content: promptFn(input, extra) }],
    });

    const text = message.content[0].type === 'text' ? message.content[0].text : '';

    return new Response(JSON.stringify({ result: text }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('[ai-tool]', error);
    return new Response(JSON.stringify({ error: 'AI processing failed' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
