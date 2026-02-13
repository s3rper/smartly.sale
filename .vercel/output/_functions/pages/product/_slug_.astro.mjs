import { e as createComponent, f as createAstro, k as renderComponent, r as renderTemplate, ai as Fragment, u as unescapeHTML, ak as defineScriptVars, m as maybeRenderHead } from '../../chunks/astro/server_B7CNsfjb.mjs';
import 'kleur/colors';
import { $ as $$Main } from '../../chunks/main__TEui6ED.mjs';
/* empty css                                     */
export { renderers } from '../../renderers.mjs';

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(raw || cooked.slice()) }));
var _a, _b;
const $$Astro = createAstro();
const $$slug = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$slug;
  const { slug } = Astro2.params;
  const specificOgImage = slug === "lampein-baby-diaper-medium-60s" ? "https://cdn.prod.website-files.com/662c296bd4d3a8028c713c69/691e7b8e236a7ab9aec48ef2_unnamed.jpg" : "https://smartly.sale/og-image.jpg";
  const pageTitle = `Product Details - Best Shopee Deals | smartly.sale`;
  const pageDescription = `Discover amazing deals on Shopee Philippines. Check out this trending product and shop smart with smartly.sale.`;
  const pageKeywords = `Shopee Philippines, viral products, online shopping, trending deals, smartly.sale, ${slug}`;
  const canonicalUrl = `https://smartly.sale/product/${slug}`;
  const breadcrumbData = {
    "@context": "https://schema.org",
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
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": "Product Details",
        "item": canonicalUrl
      }
    ]
  };
  return renderTemplate`${renderComponent($$result, "MainLayout", $$Main, { "title": pageTitle, "description": pageDescription, "keywords": pageKeywords, "canonicalUrl": canonicalUrl, "ogImage": specificOgImage, "data-astro-cid-hyvzkcdj": true }, { "default": ($$result2) => renderTemplate(_a || (_a = __template(["      ", '<h1 class="seo-header" data-astro-cid-hyvzkcdj>\nBest Shopee Deals and Viral Products in the Philippines\n</h1> <h2 class="seo-header" data-astro-cid-hyvzkcdj>\nTrending Product from Shopee Philippines with Exclusive Discounts\n</h2> <h3 class="seo-header" data-astro-cid-hyvzkcdj>\nShop Smart and Save Money with smartly.sale - Your Trusted Shopee Affiliate\n</h3>  ', "  <script>(function(){", "\n    // This will update the page title once the product loads\n    window.addEventListener('productLoaded', (event) => {\n      const product = event.detail;\n      if (product) {\n        // Update document title\n        document.title = `${product.name} - Best Shopee Deals | smartly.sale`;\n        \n        // Update meta description\n        const metaDescription = document.querySelector('meta[name=\"description\"]');\n        if (metaDescription) {\n          metaDescription.setAttribute('content', \n            `Buy ${product.name} on Shopee Philippines. ${product.shopName ? `From ${product.shopName}. ` : ''}${product.discount ? `Get ${product.discount} discount!` : ''} Check out viral products and exclusive deals at smartly.sale.`\n          );\n        }\n\n        // Update OG tags\n        const ogTitle = document.querySelector('meta[property=\"og:title\"]');\n        if (ogTitle) {\n          ogTitle.setAttribute('content', `${product.name} - Best Shopee Deals | smartly.sale`);\n        }\n\n        const ogDescription = document.querySelector('meta[property=\"og:description\"]');\n        if (ogDescription) {\n          ogDescription.setAttribute('content', \n            `Buy ${product.name} on Shopee Philippines. ${product.discount ? `Get ${product.discount} discount!` : ''}`\n          );\n        }\n\n        const ogImage = document.querySelector('meta[property=\"og:image\"]');\n        if (ogImage) {\n          // Use specific OG image for lampein-baby-diaper-medium-60s, otherwise use product image\n          if (slug === 'lampein-baby-diaper-medium-60s') {\n            ogImage.setAttribute('content', specificOgImage);\n          } else if (product.images && product.images.length > 0) {\n            ogImage.setAttribute('content', product.images[0]);\n          }\n        }\n\n        // Update Twitter Card tags\n        const twitterTitle = document.querySelector('meta[name=\"twitter:title\"]');\n        if (twitterTitle) {\n          twitterTitle.setAttribute('content', `${product.name} - Best Shopee Deals | smartly.sale`);\n        }\n\n        const twitterImage = document.querySelector('meta[name=\"twitter:image\"]');\n        if (twitterImage) {\n          // Use specific OG image for lampein-baby-diaper-medium-60s, otherwise use product image\n          if (slug === 'lampein-baby-diaper-medium-60s') {\n            twitterImage.setAttribute('content', specificOgImage);\n          } else if (product.images && product.images.length > 0) {\n            twitterImage.setAttribute('content', product.images[0]);\n          }\n        }\n      }\n    });\n  })();<\/script> "], ["      ", '<h1 class="seo-header" data-astro-cid-hyvzkcdj>\nBest Shopee Deals and Viral Products in the Philippines\n</h1> <h2 class="seo-header" data-astro-cid-hyvzkcdj>\nTrending Product from Shopee Philippines with Exclusive Discounts\n</h2> <h3 class="seo-header" data-astro-cid-hyvzkcdj>\nShop Smart and Save Money with smartly.sale - Your Trusted Shopee Affiliate\n</h3>  ', "  <script>(function(){", "\n    // This will update the page title once the product loads\n    window.addEventListener('productLoaded', (event) => {\n      const product = event.detail;\n      if (product) {\n        // Update document title\n        document.title = \\`\\${product.name} - Best Shopee Deals | smartly.sale\\`;\n        \n        // Update meta description\n        const metaDescription = document.querySelector('meta[name=\"description\"]');\n        if (metaDescription) {\n          metaDescription.setAttribute('content', \n            \\`Buy \\${product.name} on Shopee Philippines. \\${product.shopName ? \\`From \\${product.shopName}. \\` : ''}\\${product.discount ? \\`Get \\${product.discount} discount!\\` : ''} Check out viral products and exclusive deals at smartly.sale.\\`\n          );\n        }\n\n        // Update OG tags\n        const ogTitle = document.querySelector('meta[property=\"og:title\"]');\n        if (ogTitle) {\n          ogTitle.setAttribute('content', \\`\\${product.name} - Best Shopee Deals | smartly.sale\\`);\n        }\n\n        const ogDescription = document.querySelector('meta[property=\"og:description\"]');\n        if (ogDescription) {\n          ogDescription.setAttribute('content', \n            \\`Buy \\${product.name} on Shopee Philippines. \\${product.discount ? \\`Get \\${product.discount} discount!\\` : ''}\\`\n          );\n        }\n\n        const ogImage = document.querySelector('meta[property=\"og:image\"]');\n        if (ogImage) {\n          // Use specific OG image for lampein-baby-diaper-medium-60s, otherwise use product image\n          if (slug === 'lampein-baby-diaper-medium-60s') {\n            ogImage.setAttribute('content', specificOgImage);\n          } else if (product.images && product.images.length > 0) {\n            ogImage.setAttribute('content', product.images[0]);\n          }\n        }\n\n        // Update Twitter Card tags\n        const twitterTitle = document.querySelector('meta[name=\"twitter:title\"]');\n        if (twitterTitle) {\n          twitterTitle.setAttribute('content', \\`\\${product.name} - Best Shopee Deals | smartly.sale\\`);\n        }\n\n        const twitterImage = document.querySelector('meta[name=\"twitter:image\"]');\n        if (twitterImage) {\n          // Use specific OG image for lampein-baby-diaper-medium-60s, otherwise use product image\n          if (slug === 'lampein-baby-diaper-medium-60s') {\n            twitterImage.setAttribute('content', specificOgImage);\n          } else if (product.images && product.images.length > 0) {\n            twitterImage.setAttribute('content', product.images[0]);\n          }\n        }\n      }\n    });\n  })();<\/script> "])), maybeRenderHead(), renderComponent($$result2, "ProductDetail", null, { "client:only": "react", "client:component-hydration": "only", "data-astro-cid-hyvzkcdj": true, "client:component-path": "/app/src/components/ProductDetail", "client:component-export": "default" }), defineScriptVars({ slug, specificOgImage })), "head": ($$result2) => renderTemplate(_b || (_b = __template(['<script type="application/ld+json">', "<\/script>", ""])), unescapeHTML(JSON.stringify(breadcrumbData)), renderComponent($$result2, "Fragment", Fragment, { "slot": "head" }, { "default": ($$result3) => renderTemplate`  <meta property="og:type" content="product">  <meta name="pinterest-rich-pin" content="true"> ` })) })} `;
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
