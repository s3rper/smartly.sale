globalThis.process ??= {}; globalThis.process.env ??= {};
import { e as createComponent, k as renderComponent, r as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_Dcy_I8BC.mjs';
import { $ as $$Main } from '../chunks/main_BX65iaGT.mjs';
import { c as createLucideIcon } from '../chunks/createLucideIcon_D3dtv2As.mjs';
export { r as renderers } from '../chunks/_@astro-renderers_DuI-Zzmn.mjs';

/**
 * @license lucide-react v0.533.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */


const __iconNode$1 = [
  [
    "path",
    {
      d: "m15.477 12.89 1.515 8.526a.5.5 0 0 1-.81.47l-3.58-2.687a1 1 0 0 0-1.197 0l-3.586 2.686a.5.5 0 0 1-.81-.469l1.514-8.526",
      key: "1yiouv"
    }
  ],
  ["circle", { cx: "12", cy: "8", r: "6", key: "1vp47v" }]
];
const Award = createLucideIcon("award", __iconNode$1);

/**
 * @license lucide-react v0.533.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */


const __iconNode = [
  ["path", { d: "M16 7h6v6", key: "box55l" }],
  ["path", { d: "m22 7-8.5 8.5-5-5L2 17", key: "1t1m79" }]
];
const TrendingUp = createLucideIcon("trending-up", __iconNode);

const $$About = createComponent(($$result, $$props, $$slots) => {
  const pageTitle = "About Us - SmartFinds PH";
  const pageDescription = "Learn about SmartFinds PH and our mission to help Filipinos discover the best trending products on Shopee.";
  return renderTemplate`${renderComponent($$result, "MainLayout", $$Main, { "title": pageTitle, "description": pageDescription }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="py-16"> <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">  <div class="text-center mb-16"> <div class="inline-flex items-center justify-center w-20 h-20 bg-[#FF6600] rounded-full mb-6"> <span class="text-white font-bold text-3xl">SF</span> </div> <h1 class="text-4xl md:text-5xl font-bold text-foreground mb-4">
Welcome to <span class="text-[#FF6600]">SmartFinds PH</span> </h1> <p class="text-xl text-muted-foreground max-w-2xl mx-auto">
Your trusted guide to discovering viral products and smart deals on Shopee Philippines
</p> </div>  <div class="prose prose-lg max-w-none mb-16"> <h2 class="text-3xl font-bold text-foreground mb-4">Our Story</h2> <p class="text-lg text-muted-foreground leading-relaxed mb-4">
SmartFinds PH was born from a simple idea: help Filipinos make smarter shopping decisions. 
          We know how overwhelming it can be to scroll through thousands of products on Shopee, 
          wondering which ones are actually worth your hard-earned money.
</p> <p class="text-lg text-muted-foreground leading-relaxed mb-4">
That's why we created this platform – to do the research for you. Our team spends hours 
          testing products, reading reviews, and comparing prices to bring you only the best deals 
          and trending items that Filipinos are loving right now.
</p> <p class="text-lg text-muted-foreground leading-relaxed">
From budget gadgets to must-have fashion items, from home essentials to beauty products, 
          we curate everything so you can shop with confidence. We're not just another blog – 
          we're your shopping buddy who always knows where the best deals are!
</p> </div>  <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16"> <div class="bg-card rounded-2xl p-8 shadow-lg border border-border"> <div class="w-12 h-12 bg-[#FF6600]/10 rounded-full flex items-center justify-center mb-4"> ${renderComponent($$result2, "TrendingUp", TrendingUp, { "class": "w-6 h-6 text-[#FF6600]" })} </div> <h3 class="text-2xl font-bold text-foreground mb-3">Our Mission</h3> <p class="text-muted-foreground leading-relaxed">
To empower Filipino shoppers with honest reviews, smart recommendations, and exclusive 
            deals that help them save money while discovering amazing products.
</p> </div> <div class="bg-card rounded-2xl p-8 shadow-lg border border-border"> <div class="w-12 h-12 bg-[#FF6600]/10 rounded-full flex items-center justify-center mb-4"> ${renderComponent($$result2, "Award", Award, { "class": "w-6 h-6 text-[#FF6600]" })} </div> <h3 class="text-2xl font-bold text-foreground mb-3">Our Values</h3> <p class="text-muted-foreground leading-relaxed">
We believe in transparency, authenticity, and putting our community first. Every product 
            we recommend is thoroughly researched and genuinely useful for Filipino lifestyles.
</p> </div> </div>  <div class="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16"> <div class="text-center"> <div class="text-4xl font-bold text-[#FF6600] mb-2">500+</div> <div class="text-sm text-muted-foreground">Products Reviewed</div> </div> <div class="text-center"> <div class="text-4xl font-bold text-[#FF6600] mb-2">50K+</div> <div class="text-sm text-muted-foreground">Community Members</div> </div> <div class="text-center"> <div class="text-4xl font-bold text-[#FF6600] mb-2">100K+</div> <div class="text-sm text-muted-foreground">Happy Shoppers</div> </div> <div class="text-center"> <div class="text-4xl font-bold text-[#FF6600] mb-2">4.9</div> <div class="text-sm text-muted-foreground">Average Rating</div> </div> </div>  <div class="bg-[#FF6600]/10 border-l-4 border-[#FF6600] p-8 rounded-lg"> <h3 class="text-2xl font-bold text-foreground mb-4">Affiliate Disclosure</h3> <p class="text-muted-foreground leading-relaxed mb-3">
SmartFinds PH is a participant in affiliate marketing programs, including Shopee's affiliate program. 
          This means we may earn a commission when you make a purchase through our links, at no additional 
          cost to you.
</p> <p class="text-muted-foreground leading-relaxed mb-3">
We want to be completely transparent with our community: these commissions help us keep the website 
          running and allow us to continue providing you with honest, detailed product reviews and 
          recommendations.
</p> <p class="text-muted-foreground leading-relaxed font-semibold">
Rest assured, we only recommend products we genuinely believe in and that offer real value to 
          Filipino shoppers. Your trust is our most valuable asset, and we never compromise on that.
</p> </div>  <div class="text-center mt-16 pt-8 border-t border-border"> <h3 class="text-2xl font-bold text-foreground mb-4">Join Our Community</h3> <p class="text-muted-foreground mb-6">
Stay updated with the latest deals, product reviews, and shopping tips!
</p> <div class="flex flex-col sm:flex-row gap-4 justify-center"> <a href="/blog" class="inline-flex items-center justify-center px-8 py-4 bg-[#FF6600] text-white font-bold rounded-full hover:bg-[#FF6600]/90 transition-all">
Browse Products
</a> <a href="/contact" class="inline-flex items-center justify-center px-8 py-4 bg-background text-foreground font-bold rounded-full border-2 border-[#FF6600] hover:bg-[#FF6600]/10 transition-all">
Get in Touch
</a> </div> </div> </div> </div> ` })}`;
}, "/app/src/pages/about.astro", void 0);

const $$file = "/app/src/pages/about.astro";
const $$url = "/about";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$About,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
