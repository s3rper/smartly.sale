import { e as createComponent, k as renderComponent, r as renderTemplate, m as maybeRenderHead, u as unescapeHTML } from '../chunks/astro/server_B7CNsfjb.mjs';
import 'kleur/colors';
import { $ as $$Main } from '../chunks/main__TEui6ED.mjs';
export { renderers } from '../renderers.mjs';

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const $$Products = createComponent(($$result, $$props, $$slots) => {
  const pageTitle = "All Products - Best Shopee Deals & Viral Finds | smartly.sale";
  const pageDescription = "Browse our complete catalog of viral Shopee products, budget gadgets, and trending deals in the Philippines. Filter by price, category, and rating to find the best deals!";
  const pageKeywords = "Shopee products, all Shopee deals, product catalog, budget gadgets Philippines, viral products list, Shopee finds, online shopping catalog";
  return renderTemplate`${renderComponent($$result, "MainLayout", $$Main, { "title": pageTitle, "description": pageDescription, "ogImage": "/og-products.jpg", "keywords": pageKeywords }, { "default": ($$result2) => renderTemplate(_a || (_a = __template(['  <script type="application/ld+json">', "<\/script>  ", '<div class="bg-gradient-to-r from-orange-50 to-white py-8 border-b"> <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"> <h1 class="text-3xl md:text-4xl font-bold text-foreground mb-2">\nAll Products - Viral Shopee Finds & Deals\n</h1> <p class="text-muted-foreground">\nBrowse our complete collection of trending products, budget gadgets, and exclusive Shopee deals\n</p> </div> </div>  ', " "])), unescapeHTML(JSON.stringify({
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "All Products - smartly.sale",
    "description": pageDescription,
    "url": "https://smartly.sale/products",
    "breadcrumb": {
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://smartly.sale"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Products",
          "item": "https://smartly.sale/products"
        }
      ]
    }
  })), maybeRenderHead(), renderComponent($$result2, "AllProductsList", null, { "client:only": "react", "client:component-hydration": "only", "client:component-path": "/app/src/components/AllProductsList", "client:component-export": "default" })) })}`;
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
