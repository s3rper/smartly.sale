globalThis.process ??= {}; globalThis.process.env ??= {};
import { e as createComponent, k as renderComponent, r as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_Dcy_I8BC.mjs';
import { $ as $$Main } from '../chunks/main_BNZ2ynJ0.mjs';
export { r as renderers } from '../chunks/_@astro-renderers_DuI-Zzmn.mjs';

const $$Products = createComponent(($$result, $$props, $$slots) => {
  const pageTitle = "All Products - SmartFinds PH";
  const pageDescription = "Browse our complete collection of trending products from Shopee. Filter by price, search by name, and find the perfect deals for you.";
  return renderTemplate`${renderComponent($$result, "MainLayout", $$Main, { "title": pageTitle, "description": pageDescription, "ogImage": "/og-image.jpg" }, { "default": ($$result2) => renderTemplate`  ${maybeRenderHead()}<div class="bg-muted border-b border-border"> <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4"> <nav class="flex items-center space-x-2 text-sm"> <a href="/" class="text-muted-foreground hover:text-[#FF6600] transition-colors">
Home
</a> <span class="text-muted-foreground">/</span> <span class="text-foreground font-semibold">All Products</span> </nav> </div> </div> ${renderComponent($$result2, "AllProductsList", null, { "client:only": "react", "client:component-hydration": "only", "client:component-path": "/app/src/components/AllProductsList", "client:component-export": "default" })} ` })}`;
}, "/app/src/pages/products.astro", void 0);

const $$file = "/app/src/pages/products.astro";
const $$url = "/products";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Products,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
