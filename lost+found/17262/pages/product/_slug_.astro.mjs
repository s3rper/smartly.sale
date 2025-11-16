globalThis.process ??= {}; globalThis.process.env ??= {};
import { e as createComponent, k as renderComponent, r as renderTemplate } from '../../chunks/astro/server_Dcy_I8BC.mjs';
import { $ as $$Main } from '../../chunks/main_yP04zD6K.mjs';
export { r as renderers } from '../../chunks/_@astro-renderers_DuI-Zzmn.mjs';

const $$slug = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "MainLayout", $$Main, { "title": "Product Details - SmartFinds PH", "description": "View detailed product information, images, videos, and shop now on Shopee" }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "ProductDetail", null, { "client:only": "react", "client:component-hydration": "only", "client:component-path": "/app/src/components/ProductDetail", "client:component-export": "default" })} ` })}`;
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
