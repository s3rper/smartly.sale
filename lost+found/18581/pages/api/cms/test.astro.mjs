globalThis.process ??= {}; globalThis.process.env ??= {};
export { r as renderers } from '../../../chunks/_@astro-renderers_DuI-Zzmn.mjs';

const GET = async ({ locals }) => {
  const token = locals?.runtime?.env?.WEBFLOW_CMS_SITE_API_TOKEN || process.env.WEBFLOW_CMS_SITE_API_TOKEN;
  const apiHost = locals?.runtime?.env?.WEBFLOW_API_HOST || "https://api-cdn.webflow.com/v2";
  const hasToken = !!token;
  const tokenPreview = token ? `${token.substring(0, 8)}...${token.substring(token.length - 8)}` : "NOT SET";
  const response = {
    status: "ok",
    timestamp: (/* @__PURE__ */ new Date()).toISOString(),
    environment: {
      hasToken,
      tokenPreview: hasToken ? tokenPreview : "MISSING",
      apiHost: apiHost,
      collectionId: "69158c209e29b59a86d4b534"
    },
    message: hasToken ? "✅ API token is configured. Your CMS connection should work!" : "❌ API token is missing. Add WEBFLOW_CMS_SITE_API_TOKEN to your .env file"
  };
  return new Response(JSON.stringify(response, null, 2), {
    status: hasToken ? 200 : 500,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-cache"
    }
  });
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
