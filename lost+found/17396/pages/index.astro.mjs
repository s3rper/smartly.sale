globalThis.process ??= {}; globalThis.process.env ??= {};
import { e as createComponent, k as renderComponent, r as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_Dcy_I8BC.mjs';
import { $ as $$Main } from '../chunks/main_p3xEOEv5.mjs';
export { r as renderers } from '../chunks/_@astro-renderers_DuI-Zzmn.mjs';

const $$Index = createComponent(($$result, $$props, $$slots) => {
  const pageTitle = "SmartFinds PH - Discover Viral Shopee Finds!";
  const pageDescription = "Find the best trending products, budget gadgets, and must-have deals from Shopee. Your ultimate guide to smart shopping in the Philippines.";
  return renderTemplate`${renderComponent($$result, "MainLayout", $$Main, { "title": pageTitle, "description": pageDescription, "ogImage": "/og-image.jpg" }, { "default": ($$result2) => renderTemplate`  ${maybeRenderHead()}<div class="w-full bg-muted py-2 text-center text-sm text-muted-foreground border-b"> <div class="max-w-7xl mx-auto px-4">
Advertisement Space (728x90)
</div> </div> ${renderComponent($$result2, "Hero", null, { "client:only": "react", "client:component-hydration": "only", "client:component-path": "/app/src/components/Hero", "client:component-export": "default" })} ${renderComponent($$result2, "FeaturedProducts", null, { "client:only": "react", "client:component-hydration": "only", "client:component-path": "/app/src/components/FeaturedProducts", "client:component-export": "default" })}    <div class="w-full bg-muted py-8 text-center border-y"> <div class="max-w-7xl mx-auto px-4"> <div class="bg-background rounded-lg shadow-sm p-8 text-muted-foreground">
Advertisement Space (970x250)
</div> </div> </div>   <div class="w-full bg-muted py-8 text-center border-t"> <div class="max-w-7xl mx-auto px-4"> <div class="bg-background rounded-lg shadow-sm p-8 text-muted-foreground">
Advertisement Space (728x90)
</div> </div> </div> ` })}`;
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
