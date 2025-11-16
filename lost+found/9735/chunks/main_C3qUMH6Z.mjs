import { e as createComponent, f as createAstro, h as addAttribute, l as renderHead, k as renderComponent, n as renderSlot, r as renderTemplate } from './astro/server_B_OFuUZx.mjs';
import 'kleur/colors';
/* empty css                         */

const $$Astro = createAstro();
const $$Main = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Main;
  const {
    title = "smartly.sale - Discover Viral Shopee Finds",
    description = "Find the best trending products, budget gadgets, and must-have deals from Shopee.",
    ogImage = "/og-image.jpg",
    pageClass = ""
  } = Astro2.props;
  return renderTemplate`<html lang="en"${addAttribute(pageClass, "class")}> <head><meta charset="utf-8"><link rel="icon" type="image/png" href="/favicon.ico"><meta name="viewport" content="width=device-width, initial-scale=1.0"><meta name="generator"${addAttribute(Astro2.generator, "content")}><!-- SEO Meta Tags --><title>smartly.sale</title><meta name="description"${addAttribute(description, "content")}><meta name="keywords" content="Shopee Philippines, viral products, budget gadgets, trending deals, affiliate shopping, smartly.sale"><!-- Open Graph / Facebook --><meta property="og:type" content="website"><meta property="og:title"${addAttribute(title, "content")}><meta property="og:description"${addAttribute(description, "content")}><meta property="og:image"${addAttribute(ogImage, "content")}><meta property="og:site_name" content="smartly.sale"><!-- Twitter --><meta name="twitter:card" content="summary_large_image"><meta name="twitter:title"${addAttribute(title, "content")}><meta name="twitter:description"${addAttribute(description, "content")}><meta name="twitter:image"${addAttribute(ogImage, "content")}><!-- Performance Optimization --><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="dns-prefetch" href="https://shopee.ph">${renderHead()}</head> <body class="__DARK_MODE_CLASS__ min-h-screen flex flex-col"> ${renderComponent($$result, "Navbar", null, { "client:only": "react", "client:component-hydration": "only", "client:component-path": "/app/src/components/Navbar", "client:component-export": "default" })} <main class="flex-grow"> ${renderSlot($$result, $$slots["default"])} </main> ${renderComponent($$result, "Footer", null, { "client:only": "react", "client:component-hydration": "only", "client:component-path": "/app/src/components/Footer", "client:component-export": "default" })} </body></html>`;
}, "/app/src/layouts/main.astro", void 0);

export { $$Main as $ };
