import { e as createComponent, k as renderComponent, r as renderTemplate } from '../../chunks/astro/server_B_OFuUZx.mjs';
import 'kleur/colors';
import { $ as $$Main } from '../../chunks/main_C3qUMH6Z.mjs';
export { renderers } from '../../renderers.mjs';

const $$slug = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "MainLayout", $$Main, { "title": "Product Details - smartly.sale", "description": "View detailed information about this trending product from Shopee Philippines." }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "ProductDetail", null, { "client:only": "react", "client:component-hydration": "only", "client:component-path": "/app/src/components/ProductDetail", "client:component-export": "default" })} ` })}`;
}, "/app/src/pages/product/[slug].astro", void 0);

const $$file = "/app/src/pages/product/[slug].astro";
const $$url = "/product/[slug]";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$slug,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
