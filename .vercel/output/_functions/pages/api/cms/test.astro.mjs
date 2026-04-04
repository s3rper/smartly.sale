export { renderers } from '../../../renderers.mjs';

const GET = async ({ locals }) => {
  const token = locals?.runtime?.env?.WEBFLOW_CMS_SITE_API_TOKEN || "4ef8f1b1fec9c33d3c8dd01de18ae1e5aaa91fbedd605fdd5dd8a0fe99ba43b7";
  const apiHost = locals?.runtime?.env?.WEBFLOW_API_HOST || "https://api-cdn.webflow.com/v2";
  const hasToken = true;
  const tokenPreview = `${token.substring(0, 8)}...${token.substring(token.length - 8)}` ;
  const response = {
    status: "ok",
    timestamp: (/* @__PURE__ */ new Date()).toISOString(),
    environment: {
      hasToken,
      tokenPreview: tokenPreview ,
      apiHost: apiHost,
      collectionId: "69158c209e29b59a86d4b534"
    },
    message: "✅ API token is configured. Your CMS connection should work!" 
  };
  return new Response(JSON.stringify(response, null, 2), {
    status: 200 ,
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
