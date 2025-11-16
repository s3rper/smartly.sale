globalThis.process ??= {}; globalThis.process.env ??= {};
import { e as createComponent, k as renderComponent, r as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_Dcy_I8BC.mjs';
import { $ as $$Main } from '../chunks/main_Dc8zYyi9.mjs';
export { r as renderers } from '../chunks/_@astro-renderers_DuI-Zzmn.mjs';

const $$Products = createComponent(($$result, $$props, $$slots) => {
  const pageTitle = "All Products - smartly.sale";
  const pageDescription = "Browse our complete collection of trending Shopee products, budget gadgets, and must-have deals.";
  return renderTemplate`${renderComponent($$result, "MainLayout", $$Main, { "title": pageTitle, "description": pageDescription }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12"> <!-- Page Header --> <div class="text-center mb-12"> <h1 class="text-4xl md:text-5xl font-bold text-foreground mb-4">
All Products
</h1> <p class="text-xl text-muted-foreground max-w-2xl mx-auto">
Discover our complete catalog of trending products and amazing deals
</p> </div> <!-- Products List Component --> ${renderComponent($$result2, "AllProductsList", null, { "client:only": "react", "client:component-hydration": "only", "client:component-path": "/app/src/components/AllProductsList", "client:component-export": "default" })} </div> ` })}`;
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
