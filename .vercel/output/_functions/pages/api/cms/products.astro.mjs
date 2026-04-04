import { f as fetchProductsFromWebflow } from '../../../chunks/products_BcPmpf2E.mjs';
export { renderers } from '../../../renderers.mjs';

const GET = async ({ request, locals }) => {
  try {
    const token = locals?.runtime?.env?.WEBFLOW_CMS_SITE_API_TOKEN || "4ef8f1b1fec9c33d3c8dd01de18ae1e5aaa91fbedd605fdd5dd8a0fe99ba43b7";
    if (!token) ;
    const apiBaseUrl = locals?.runtime?.env?.WEBFLOW_API_HOST || "https://api-cdn.webflow.com/v2";
    const url = new URL(request.url);
    const limit = Math.min(Number(url.searchParams.get("limit") ?? 20), 100);
    const offset = Number(url.searchParams.get("offset") ?? 0);
    const res = await fetchProductsFromWebflow(token, limit, offset, apiBaseUrl);
    return new Response(JSON.stringify(res), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        // Cache 1 hour on CDN, serve stale up to 24h while revalidating
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400"
      }
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: "Error fetching products", message, timestamp: (/* @__PURE__ */ new Date()).toISOString() }),
      { status: 502, headers: { "Content-Type": "application/json" } }
    );
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
