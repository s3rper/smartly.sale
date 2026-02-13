import { e as createComponent, k as renderComponent, r as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_B7CNsfjb.mjs';
import 'kleur/colors';
import { $ as $$Main } from '../chunks/main__TEui6ED.mjs';
export { renderers } from '../renderers.mjs';

const $$Categories = createComponent(($$result, $$props, $$slots) => {
  const pageTitle = "Categories - smartly.sale";
  const pageDescription = "Browse products by category - gadgets, fashion, home & living, beauty, and more.";
  return renderTemplate`${renderComponent($$result, "MainLayout", $$Main, { "title": pageTitle, "description": pageDescription }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">  <div class="text-center mb-12"> <h1 class="text-4xl md:text-5xl font-bold text-foreground mb-4">
Shop by Category
</h1> <p class="text-xl text-muted-foreground max-w-2xl mx-auto">
Find exactly what you're looking for in our organized categories
</p> </div>  ${renderComponent($$result2, "CategoryGrid", null, { "client:only": "react", "client:component-hydration": "only", "client:component-path": "/app/src/components/CategoryGrid", "client:component-export": "default" })} </div> ` })}`;
}, "/app/src/pages/categories.astro", void 0);

const $$file = "/app/src/pages/categories.astro";
const $$url = "/categories";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Categories,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
