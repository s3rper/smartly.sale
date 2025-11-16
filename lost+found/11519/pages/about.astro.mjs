import { e as createComponent, k as renderComponent, r as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_B_OFuUZx.mjs';
import 'kleur/colors';
import { $ as $$Main } from '../chunks/main_C3qUMH6Z.mjs';
import { Heart, TrendingUp, ShoppingBag, Users } from 'lucide-react';
export { renderers } from '../renderers.mjs';

const $$About = createComponent(($$result, $$props, $$slots) => {
  const pageTitle = "About Us - smartly.sale";
  const pageDescription = "Learn about smartly.sale and our mission to help Filipinos discover the best trending products on Shopee.";
  return renderTemplate`${renderComponent($$result, "MainLayout", $$Main, { "title": pageTitle, "description": pageDescription }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">  <div class="text-center mb-12"> <h1 class="text-4xl md:text-5xl font-bold text-foreground mb-4">
Welcome to <span class="text-[#FF6600]">smartly.sale</span> </h1> <p class="text-xl text-muted-foreground">
Your trusted guide to smart shopping in the Philippines
</p> </div>  <div class="prose prose-lg max-w-none mb-12"> <div class="bg-background rounded-xl p-8 shadow-md border border-border"> <h2 class="text-2xl font-bold text-foreground mb-4">Our Story</h2> <p class="text-muted-foreground mb-4">
smartly.sale was born from a simple idea: help Filipinos make smarter shopping decisions. 
          We know how overwhelming it can be to browse through thousands of products online, 
          wondering which ones are actually worth your hard-earned money.
</p> <p class="text-muted-foreground mb-4">
That's why we created this platform. We do the research, testing, and comparison so you don't have to. 
          Our team scours Shopee daily to find the most viral products, best deals, and trending items that 
          Filipino shoppers are loving.
</p> <p class="text-muted-foreground">
Whether you're looking for budget-friendly gadgets, the latest fashion trends, home essentials, 
          or beauty must-haves, we've got you covered. Every product we feature is carefully evaluated 
          for quality, value, and customer satisfaction.
</p> </div> </div>  <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12"> <div class="bg-background rounded-xl p-6 shadow-md border border-border"> <div class="w-12 h-12 bg-[#FF6600]/10 rounded-lg flex items-center justify-center mb-4"> ${renderComponent($$result2, "Heart", Heart, { "class": "w-6 h-6 text-[#FF6600]" })} </div> <h3 class="text-xl font-bold text-foreground mb-2">Customer First</h3> <p class="text-muted-foreground text-sm">
Your satisfaction is our priority. We only recommend products we would buy ourselves.
</p> </div> <div class="bg-background rounded-xl p-6 shadow-md border border-border"> <div class="w-12 h-12 bg-[#FF6600]/10 rounded-lg flex items-center justify-center mb-4"> ${renderComponent($$result2, "TrendingUp", TrendingUp, { "class": "w-6 h-6 text-[#FF6600]" })} </div> <h3 class="text-xl font-bold text-foreground mb-2">Always Current</h3> <p class="text-muted-foreground text-sm">
We stay on top of trends to bring you the freshest and most relevant products daily.
</p> </div> <div class="bg-background rounded-xl p-6 shadow-md border border-border"> <div class="w-12 h-12 bg-[#FF6600]/10 rounded-lg flex items-center justify-center mb-4"> ${renderComponent($$result2, "ShoppingBag", ShoppingBag, { "class": "w-6 h-6 text-[#FF6600]" })} </div> <h3 class="text-xl font-bold text-foreground mb-2">Best Value</h3> <p class="text-muted-foreground text-sm">
We hunt for the best deals and prices so you get maximum value for your money.
</p> </div> <div class="bg-background rounded-xl p-6 shadow-md border border-border"> <div class="w-12 h-12 bg-[#FF6600]/10 rounded-lg flex items-center justify-center mb-4"> ${renderComponent($$result2, "Users", Users, { "class": "w-6 h-6 text-[#FF6600]" })} </div> <h3 class="text-xl font-bold text-foreground mb-2">Community Driven</h3> <p class="text-muted-foreground text-sm">
We listen to our community and feature products based on real feedback and requests.
</p> </div> </div>  <div class="bg-accent/50 rounded-xl p-8 border border-border"> <h2 class="text-2xl font-bold text-foreground mb-4">Affiliate Disclosure</h2> <p class="text-muted-foreground mb-4">
smartly.sale is a participant in affiliate marketing programs, including Shopee's affiliate program. 
        This means when you click on links to products and make a purchase, we may receive a small commission 
        at no additional cost to you.
</p> <p class="text-muted-foreground mb-4">
These commissions help us keep our website running and allow us to continue providing valuable 
        product recommendations to the Filipino shopping community. However, our integrity is never 
        compromised by these partnerships.
</p> <p class="text-muted-foreground font-semibold">
We only recommend products that we genuinely believe will provide value to our readers. 
        Your trust is our most valuable asset.
</p> </div>  <div class="text-center mt-12"> <h2 class="text-2xl font-bold text-foreground mb-4">
Ready to Start Smart Shopping?
</h2> <a href="/" class="inline-flex items-center justify-center px-8 py-3 bg-[#FF6600] text-white font-bold rounded-full hover:bg-[#FF6600]/90 transition-all shadow-lg">
Explore Products
</a> </div> </div> ` })}`;
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
