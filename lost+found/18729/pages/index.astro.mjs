globalThis.process ??= {}; globalThis.process.env ??= {};
import { e as createComponent, k as renderComponent, r as renderTemplate } from '../chunks/astro/server_Dcy_I8BC.mjs';
import { $ as $$Main } from '../chunks/main_BX65iaGT.mjs';
export { r as renderers } from '../chunks/_@astro-renderers_DuI-Zzmn.mjs';

const $$Index = createComponent(($$result, $$props, $$slots) => {
  const pageTitle = "SmartFinds PH - Discover Viral Shopee Finds!";
  const pageDescription = "Find the best trending products, budget gadgets, and must-have deals from Shopee. Your ultimate guide to smart shopping in the Philippines.";
  return renderTemplate`${renderComponent($$result, "MainLayout", $$Main, { "title": pageTitle, "description": pageDescription, "ogImage": "/og-image.jpg" }, { "default": ($$result2) => renderTemplate`  ${renderComponent($$result2, "Hero", null, { "client:only": "react", "client:component-hydration": "only", "client:component-path": "/app/src/components/Hero", "client:component-export": "default" })}  ${renderComponent($$result2, "FeaturedProducts", null, { "client:only": "react", "client:component-hydration": "only", "client:component-path": "/app/src/components/FeaturedProducts", "client:component-export": "default" })}  ${renderComponent($$result2, "WhyChooseUs", null, { "client:only": "react", "client:component-hydration": "only", "client:component-path": "/app/src/components/WhyChooseUs", "client:component-export": "default" })}  ${renderComponent($$result2, "HowItWorks", null, { "client:only": "react", "client:component-hydration": "only", "client:component-path": "/app/src/components/HowItWorks", "client:component-export": "default" })}  ${renderComponent($$result2, "TrustIndicators", null, { "client:only": "react", "client:component-hydration": "only", "client:component-path": "/app/src/components/TrustIndicators", "client:component-export": "default" })}  ${renderComponent($$result2, "Newsletter", null, { "client:only": "react", "client:component-hydration": "only", "client:component-path": "/app/src/components/Newsletter", "client:component-export": "default" })} ` })}`;
}, "/app/src/pages/index.astro", void 0);

const $$file = "/app/src/pages/index.astro";
const $$url = "";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
