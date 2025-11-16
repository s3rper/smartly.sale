globalThis.process ??= {}; globalThis.process.env ??= {};
import { e as createComponent, f as createAstro, k as renderComponent, r as renderTemplate } from '../../chunks/astro/server_Dcy_I8BC.mjs';
import { $ as $$Main } from '../../chunks/main_BNZ2ynJ0.mjs';
export { r as renderers } from '../../chunks/_@astro-renderers_DuI-Zzmn.mjs';

const $$Astro = createAstro();
const $$slug = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$slug;
  const { slug } = Astro2.params;
  const post = {
    title: "Top 5 Budget Gadgets Under \u20B1500 in 2025",
    excerpt: "Discover the most affordable tech gadgets that won't break the bank.",
    featuredImage: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=1200&h=600&fit=crop",
    category: "Gadgets & Tech",
    publishDate: "January 15, 2025",
    readTime: "5 min read",
    slug: slug || "sample-post"
  };
  const pageTitle = `${post.title} - SmartFinds PH`;
  const pageDescription = post.excerpt;
  return renderTemplate`${renderComponent($$result, "MainLayout", $$Main, { "title": pageTitle, "description": pageDescription, "ogImage": post.featuredImage }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "PostContent", null, { "post": post, "client:only": "react", "client:component-hydration": "only", "client:component-path": "/app/src/components/PostContent", "client:component-export": "default" })} ` })}`;
}, "/app/src/pages/post/[slug].astro", void 0);

const $$file = "/app/src/pages/post/[slug].astro";
const $$url = "/post/[slug]";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$slug,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
