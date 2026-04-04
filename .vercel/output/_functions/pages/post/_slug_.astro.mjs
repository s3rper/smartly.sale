import { e as createComponent, f as createAstro, k as renderComponent, r as renderTemplate, aj as Fragment, h as addAttribute, u as unescapeHTML } from '../../chunks/astro/server_QTRnay6T.mjs';
import 'kleur/colors';
import { $ as $$Main } from '../../chunks/main_U5mpiJ65.mjs';
import { b as blogPosts } from '../../chunks/blog-data_yMNsm19I.mjs';
export { renderers } from '../../renderers.mjs';

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const $$Astro = createAstro();
const $$slug = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$slug;
  const { slug } = Astro2.params;
  const post = blogPosts.find((p) => p.slug === slug);
  if (!post) {
    return Astro2.redirect("/blog");
  }
  const pageTitle = post.metaTitle || `${post.title} - smartly.sale`;
  const pageDescription = post.metaDescription || post.excerpt;
  const canonicalUrl = `https://smartly.sale/post/${post.slug}`;
  const keywords = post.keywords?.join(", ") || void 0;
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.title,
    "description": post.metaDescription || post.excerpt,
    "image": post.featuredImage,
    "url": canonicalUrl,
    "datePublished": post.publishDate,
    "dateModified": post.publishDate,
    "author": {
      "@type": "Person",
      "name": post.author
    },
    "publisher": {
      "@type": "Organization",
      "name": "smartly.sale",
      "logo": {
        "@type": "ImageObject",
        "url": "https://smartly.sale/og-image.jpg"
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": canonicalUrl
    }
  };
  const breadcrumbData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://smartly.sale" },
      { "@type": "ListItem", "position": 2, "name": "Blog", "item": "https://smartly.sale/blog" },
      { "@type": "ListItem", "position": 3, "name": post.title, "item": canonicalUrl }
    ]
  };
  return renderTemplate`${renderComponent($$result, "MainLayout", $$Main, { "title": pageTitle, "description": pageDescription, "ogImage": post.featuredImage, "keywords": keywords, "canonicalUrl": canonicalUrl }, { "default": ($$result2) => renderTemplate`  ${renderComponent($$result2, "PostContent", null, { "client:only": "react", "post": post, "client:component-hydration": "only", "client:component-path": "/Users/kirbydimsontompong/smartly.sale/src/components/PostContent", "client:component-export": "default" })} `, "head": ($$result2) => renderTemplate`${renderComponent($$result2, "Fragment", Fragment, { "slot": "head" }, { "default": ($$result3) => renderTemplate(_a || (_a = __template([' <script type="application/ld+json">', '<\/script> <script type="application/ld+json">', '<\/script> <meta property="og:type" content="article"> <meta property="article:published_time"', '> <meta property="article:author"', '> <meta property="article:section"', "> ", ""])), unescapeHTML(JSON.stringify(articleSchema)), unescapeHTML(JSON.stringify(breadcrumbData)), addAttribute(post.publishDate, "content"), addAttribute(post.author, "content"), addAttribute(post.category, "content"), post.tags?.map((tag) => renderTemplate`<meta property="article:tag"${addAttribute(tag, "content")}>`)) })}` })}`;
}, "/Users/kirbydimsontompong/smartly.sale/src/pages/post/[slug].astro", void 0);

const $$file = "/Users/kirbydimsontompong/smartly.sale/src/pages/post/[slug].astro";
const $$url = "/post/[slug]";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$slug,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
