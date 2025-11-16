globalThis.process ??= {}; globalThis.process.env ??= {};
import { e as createComponent, k as renderComponent, r as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_Dcy_I8BC.mjs';
import { $ as $$Main } from '../chunks/main_Dc8zYyi9.mjs';
import { a as reactExports } from '../chunks/_@astro-renderers_DuI-Zzmn.mjs';
export { r as renderers } from '../chunks/_@astro-renderers_DuI-Zzmn.mjs';

/**
 * @license lucide-react v0.533.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */

const toKebabCase = (string) => string.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
const toCamelCase = (string) => string.replace(
  /^([A-Z])|[\s-_]+(\w)/g,
  (match, p1, p2) => p2 ? p2.toUpperCase() : p1.toLowerCase()
);
const toPascalCase = (string) => {
  const camelCase = toCamelCase(string);
  return camelCase.charAt(0).toUpperCase() + camelCase.slice(1);
};
const mergeClasses = (...classes) => classes.filter((className, index, array) => {
  return Boolean(className) && className.trim() !== "" && array.indexOf(className) === index;
}).join(" ").trim();
const hasA11yProp = (props) => {
  for (const prop in props) {
    if (prop.startsWith("aria-") || prop === "role" || prop === "title") {
      return true;
    }
  }
};

/**
 * @license lucide-react v0.533.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */

var defaultAttributes = {
  xmlns: "http://www.w3.org/2000/svg",
  width: 24,
  height: 24,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round"
};

/**
 * @license lucide-react v0.533.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */


const Icon = reactExports.forwardRef(
  ({
    color = "currentColor",
    size = 24,
    strokeWidth = 2,
    absoluteStrokeWidth,
    className = "",
    children,
    iconNode,
    ...rest
  }, ref) => reactExports.createElement(
    "svg",
    {
      ref,
      ...defaultAttributes,
      width: size,
      height: size,
      stroke: color,
      strokeWidth: absoluteStrokeWidth ? Number(strokeWidth) * 24 / Number(size) : strokeWidth,
      className: mergeClasses("lucide", className),
      ...!children && !hasA11yProp(rest) && { "aria-hidden": "true" },
      ...rest
    },
    [
      ...iconNode.map(([tag, attrs]) => reactExports.createElement(tag, attrs)),
      ...Array.isArray(children) ? children : [children]
    ]
  )
);

/**
 * @license lucide-react v0.533.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */


const createLucideIcon = (iconName, iconNode) => {
  const Component = reactExports.forwardRef(
    ({ className, ...props }, ref) => reactExports.createElement(Icon, {
      ref,
      iconNode,
      className: mergeClasses(
        `lucide-${toKebabCase(toPascalCase(iconName))}`,
        `lucide-${iconName}`,
        className
      ),
      ...props
    })
  );
  Component.displayName = toPascalCase(iconName);
  return Component;
};

/**
 * @license lucide-react v0.533.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */


const __iconNode$3 = [
  [
    "path",
    {
      d: "M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5",
      key: "mvr1a0"
    }
  ]
];
const Heart = createLucideIcon("heart", __iconNode$3);

/**
 * @license lucide-react v0.533.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */


const __iconNode$2 = [
  ["path", { d: "M16 10a4 4 0 0 1-8 0", key: "1ltviw" }],
  ["path", { d: "M3.103 6.034h17.794", key: "awc11p" }],
  [
    "path",
    {
      d: "M3.4 5.467a2 2 0 0 0-.4 1.2V20a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6.667a2 2 0 0 0-.4-1.2l-2-2.667A2 2 0 0 0 17 2H7a2 2 0 0 0-1.6.8z",
      key: "o988cm"
    }
  ]
];
const ShoppingBag = createLucideIcon("shopping-bag", __iconNode$2);

/**
 * @license lucide-react v0.533.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */


const __iconNode$1 = [
  ["path", { d: "M16 7h6v6", key: "box55l" }],
  ["path", { d: "m22 7-8.5 8.5-5-5L2 17", key: "1t1m79" }]
];
const TrendingUp = createLucideIcon("trending-up", __iconNode$1);

/**
 * @license lucide-react v0.533.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */


const __iconNode = [
  ["path", { d: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2", key: "1yyitq" }],
  ["path", { d: "M16 3.128a4 4 0 0 1 0 7.744", key: "16gr8j" }],
  ["path", { d: "M22 21v-2a4 4 0 0 0-3-3.87", key: "kshegd" }],
  ["circle", { cx: "9", cy: "7", r: "4", key: "nufk8" }]
];
const Users = createLucideIcon("users", __iconNode);

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
