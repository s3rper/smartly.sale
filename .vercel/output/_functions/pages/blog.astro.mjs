import { e as createComponent, k as renderComponent, r as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_B_OFuUZx.mjs';
import 'kleur/colors';
import { $ as $$Main } from '../chunks/main_C3qUMH6Z.mjs';
export { renderers } from '../renderers.mjs';

const $$Blog = createComponent(($$result, $$props, $$slots) => {
  const pageTitle = "Blog - smartly.sale | Product Reviews & Shopping Guides";
  const pageDescription = "Read our latest product reviews, shopping guides, and tips for finding the best deals on Shopee Philippines.";
  return renderTemplate`${renderComponent($$result, "MainLayout", $$Main, { "title": pageTitle, "description": pageDescription }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">  <div class="text-center mb-12"> <h1 class="text-4xl md:text-5xl font-bold text-foreground mb-4">
Blog & Reviews
</h1> <p class="text-xl text-muted-foreground max-w-2xl mx-auto">
Your guide to smart shopping with product reviews, comparisons, and shopping tips
</p> </div>  ${renderComponent($$result2, "BlogList", null, { "client:only": "react", "client:component-hydration": "only", "client:component-path": "/app/src/components/BlogList", "client:component-export": "default" })} </div> ` })}`;
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
