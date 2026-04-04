import { e as createComponent, f as createAstro, k as renderComponent, r as renderTemplate, aj as Fragment, u as unescapeHTML } from '../../chunks/astro/server_QTRnay6T.mjs';
import 'kleur/colors';
import { $ as $$Main } from '../../chunks/main_U5mpiJ65.mjs';
import { a as fetchProductBySlug } from '../../chunks/products_BcPmpf2E.mjs';
import { t as transformCMSProduct } from '../../chunks/product_DJYQ59Q4.mjs';
export { renderers } from '../../renderers.mjs';

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a, _b;
const $$Astro = createAstro();
const $$slug = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$slug;
  const { slug } = Astro2.params;
  let product = null;
  try {
    const runtime = Astro2.locals?.runtime;
    const token = runtime?.env?.WEBFLOW_CMS_SITE_API_TOKEN || "4ef8f1b1fec9c33d3c8dd01de18ae1e5aaa91fbedd605fdd5dd8a0fe99ba43b7";
    if (token) {
      const apiBaseUrl = runtime?.env?.WEBFLOW_API_HOST || "https://api-cdn.webflow.com/v2";
      const cmsProduct = await fetchProductBySlug(slug, token, apiBaseUrl);
      if (cmsProduct) {
        product = transformCMSProduct(cmsProduct);
      }
    }
  } catch (_e) {
  }
  const productName = product?.name ?? slug?.replace(/-/g, " ");
  const productPrice = product ? `${product.currency}${product.price}` : null;
  const productImage = product?.images[0] ?? "https://smartly.sale/og-image.jpg";
  const shopName = product?.shopName;
  const discount = product?.discount;
  const soldText = product?.soldText;
  const pageTitle = product ? `${product.name} - Buy on Shopee Philippines | smartly.sale` : `Product Details - Best Shopee Deals | smartly.sale`;
  const pageDescription = product ? [
    `Buy ${product.name} on Shopee Philippines.`,
    shopName ? `Sold by ${shopName}.` : "",
    productPrice ? `Price: ${productPrice}.` : "",
    discount ? `Get ${discount} off!` : "",
    soldText ? `${soldText} sold.` : "",
    "Fast shipping & trusted seller. Shop smart with smartly.sale."
  ].filter(Boolean).join(" ") : "Discover amazing deals on Shopee Philippines. Check out this trending product and shop smart with smartly.sale.";
  const pageKeywords = [
    productName,
    "Shopee Philippines",
    "buy online Philippines",
    "Shopee deals",
    shopName ?? "",
    "smartly.sale",
    "affiliate shopping"
  ].filter(Boolean).join(", ");
  const canonicalUrl = `https://smartly.sale/product/${slug}`;
  const breadcrumbData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://smartly.sale" },
      { "@type": "ListItem", "position": 2, "name": "Products", "item": "https://smartly.sale/products" },
      { "@type": "ListItem", "position": 3, "name": productName, "item": canonicalUrl }
    ]
  };
  const productSchema = product ? {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.name,
    "image": product.images,
    "description": pageDescription,
    "url": canonicalUrl,
    ...shopName && {
      "brand": { "@type": "Brand", "name": shopName }
    },
    "offers": {
      "@type": "Offer",
      "url": product.affiliateLink ?? canonicalUrl,
      "priceCurrency": "PHP",
      "price": product.price.replace(/[^0-9.]/g, "") || "0",
      "priceValidUntil": new Date(Date.now() + 30 * 24 * 60 * 60 * 1e3).toISOString().split("T")[0],
      "availability": "https://schema.org/InStock",
      "seller": {
        "@type": "Organization",
        "name": shopName ?? "Shopee Philippines"
      }
    },
    ...product.shopRating && product.shopRating > 0 && {
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": product.shopRating.toFixed(1),
        "bestRating": "5",
        "worstRating": "1",
        "ratingCount": "1"
      }
    }
  } : null;
  return renderTemplate`${renderComponent($$result, "MainLayout", $$Main, { "title": pageTitle, "description": pageDescription, "keywords": pageKeywords, "canonicalUrl": canonicalUrl, "ogImage": productImage }, { "default": async ($$result2) => renderTemplate`   ${renderComponent($$result2, "ProductDetail", null, { "client:only": "react", "client:component-hydration": "only", "client:component-path": "/Users/kirbydimsontompong/smartly.sale/src/components/ProductDetail", "client:component-export": "default" })} `, "head": async ($$result2) => renderTemplate`${renderComponent($$result2, "Fragment", Fragment, { "slot": "head" }, { "default": async ($$result3) => renderTemplate(_b || (_b = __template([' <script type="application/ld+json">', "</script> ", '<meta property="og:type" content="product"> '])), unescapeHTML(JSON.stringify(breadcrumbData)), productSchema && renderTemplate(_a || (_a = __template(['<script type="application/ld+json">', "</script>"])), unescapeHTML(JSON.stringify(productSchema)))) })}` })}`;
}, "/Users/kirbydimsontompong/smartly.sale/src/pages/product/[slug].astro", void 0);
const $$file = "/Users/kirbydimsontompong/smartly.sale/src/pages/product/[slug].astro";
const $$url = "/product/[slug]";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$slug,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
