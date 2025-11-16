globalThis.process ??= {}; globalThis.process.env ??= {};
import { e as createComponent, k as renderComponent, r as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_Dcy_I8BC.mjs';
import { $ as $$Main } from '../chunks/main_BX65iaGT.mjs';
export { r as renderers } from '../chunks/_@astro-renderers_DuI-Zzmn.mjs';

const $$Blog = createComponent(($$result, $$props, $$slots) => {
  const pageTitle = "Blog - SmartFinds PH | Product Reviews & Shopping Guides";
  const pageDescription = "Browse our collection of product reviews, buying guides, and trending Shopee finds in the Philippines.";
  return renderTemplate`${renderComponent($$result, "MainLayout", $$Main, { "title": pageTitle, "description": pageDescription }, { "default": ($$result2) => renderTemplate`  ${maybeRenderHead()}<section class="bg-gradient-to-br from-[#FF6600]/10 via-background to-background py-12 border-b"> <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"> <div class="text-center"> <h1 class="text-4xl md:text-5xl font-bold text-foreground mb-4">
Product <span class="text-[#FF6600]">Reviews & Guides</span> </h1> <p class="text-lg text-muted-foreground max-w-2xl mx-auto">
Discover honest reviews and expert recommendations for the best Shopee products
</p> </div> </div> </section>  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8"> <div class="bg-muted rounded-lg p-4 text-center text-sm text-muted-foreground border">
Advertisement Space (728x90)
</div> </div> ${renderComponent($$result2, "BlogList", null, { "client:only": "react", "client:component-hydration": "only", "client:component-path": "/app/src/components/BlogList", "client:component-export": "default" })}  <div class="w-full bg-muted py-8 text-center border-t mt-16"> <div class="max-w-7xl mx-auto px-4"> <div class="bg-background rounded-lg shadow-sm p-8 text-muted-foreground">
Advertisement Space (728x90)
</div> </div> </div> ` })}`;
}, "/app/src/pages/blog.astro", void 0);

const $$file = "/app/src/pages/blog.astro";
const $$url = "/blog";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Blog,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
