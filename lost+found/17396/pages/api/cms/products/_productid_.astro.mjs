globalThis.process ??= {}; globalThis.process.env ??= {};
import { w as webflowApiExports } from '../../../../chunks/index_CHabB8Oo.mjs';
export { r as renderers } from '../../../../chunks/_@astro-renderers_DuI-Zzmn.mjs';

const GET = async ({ params, locals }) => {
  const token = locals?.runtime?.env?.WEBFLOW_CMS_SITE_API_TOKEN || process.env.WEBFLOW_CMS_SITE_API_TOKEN;
  if (!token) return new Response("Missing token", { status: 500 });
  const baseUrl = locals?.runtime?.env?.WEBFLOW_API_HOST || "https://api-cdn.webflow.com/v2";
  const client = new webflowApiExports.WebflowClient({
    accessToken: token,
    ...{ baseUrl }
  });
  const { productId } = params;
  if (!productId) {
    return new Response(JSON.stringify({ error: "Product ID required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" }
    });
  }
  try {
    const collectionId = "69158c209e29b59a86d4b534";
    const item = await client.collections.items.getItemLive(collectionId, productId);
    return new Response(JSON.stringify(item), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, max-age=300"
      }
    });
  } catch (error) {
    console.error("Error fetching product:", error);
    return new Response(JSON.stringify({ error: "Product not found" }), {
      status: 404,
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
