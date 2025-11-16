globalThis.process ??= {}; globalThis.process.env ??= {};
import { w as webflowApiExports } from '../../../chunks/index_CHabB8Oo.mjs';
export { r as renderers } from '../../../chunks/_@astro-renderers_DuI-Zzmn.mjs';

const GET = async ({ request, locals }) => {
  const token = locals?.runtime?.env?.WEBFLOW_CMS_SITE_API_TOKEN || process.env.WEBFLOW_CMS_SITE_API_TOKEN;
  if (!token) return new Response("Missing token", { status: 500 });
  const baseUrl = locals?.runtime?.env?.WEBFLOW_API_HOST || "https://api-cdn.webflow.com/v2";
  const client = new webflowApiExports.WebflowClient({
    accessToken: token,
    ...{ baseUrl }
  });
  const url = new URL(request.url);
  url.searchParams.get("featured");
  const limit = Math.min(Number(url.searchParams.get("limit") ?? 20), 100);
  const offset = Number(url.searchParams.get("offset") ?? 0);
  try {
    const collectionId = "69158c209e29b59a86d4b534";
    const res = await client.collections.items.listItemsLive(collectionId, {
      limit,
      offset
    });
    return new Response(JSON.stringify(res), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, max-age=300"
        // Cache for 5 minutes
      }
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    return new Response(JSON.stringify({ error: "Error fetching products" }), {
      status: 502,
      headers: { "Content-Type": "application/json" }
    });
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
