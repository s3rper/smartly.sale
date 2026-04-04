import { e as createComponent, k as renderComponent, r as renderTemplate, h as addAttribute, m as maybeRenderHead, u as unescapeHTML } from '../chunks/astro/server_QTRnay6T.mjs';
import 'kleur/colors';
import { $ as $$Main } from '../chunks/main_U5mpiJ65.mjs';
import { jsxs, jsx, Fragment } from 'react/jsx-runtime';
import { useState, useMemo } from 'react';
import { B as BlogCard } from '../chunks/BlogCard_DHP3CjzT.mjs';
import { b as blogPosts, a as blogCategories } from '../chunks/blog-data_yMNsm19I.mjs';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { b as baseUrl } from '../chunks/base-url_Cwqyomll.mjs';
export { renderers } from '../renderers.mjs';

const POSTS_PER_PAGE = 10;
function BlogList() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const filteredPosts = useMemo(() => {
    if (selectedCategory === "all") {
      return blogPosts;
    }
    return blogPosts.filter((post) => post.category === selectedCategory);
  }, [selectedCategory]);
  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);
  const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
  const endIndex = startIndex + POSTS_PER_PAGE;
  const currentPosts = filteredPosts.slice(startIndex, endIndex);
  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };
  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);
      if (currentPage > 3) {
        pages.push("...");
      }
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      if (currentPage < totalPages - 2) {
        pages.push("...");
      }
      if (totalPages > 1) {
        pages.push(totalPages);
      }
    }
    return pages;
  };
  return /* @__PURE__ */ jsxs("div", { className: "py-10", children: [
    /* @__PURE__ */ jsx("section", { className: "pb-8", children: /* @__PURE__ */ jsx("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", children: /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-2 justify-center", children: [{ slug: "all", name: "All Posts" }, ...blogCategories].map((cat) => {
      const active = selectedCategory === cat.slug;
      return /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => handleCategoryChange(cat.slug),
          className: "px-4 py-2 rounded-full text-sm font-medium border transition-all duration-200",
          style: active ? { background: "#f97316", color: "#fff", borderColor: "#f97316" } : { background: "transparent", color: "var(--muted-foreground)", borderColor: "var(--border)" },
          children: cat.name
        },
        cat.slug
      );
    }) }) }) }),
    /* @__PURE__ */ jsx("section", { className: "pb-12", children: /* @__PURE__ */ jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", children: [
      /* @__PURE__ */ jsxs("p", { className: "text-sm text-muted-foreground text-center mb-8", children: [
        "Showing ",
        startIndex + 1,
        "–",
        Math.min(endIndex, filteredPosts.length),
        " of ",
        filteredPosts.length,
        " posts",
        selectedCategory !== "all" && /* @__PURE__ */ jsxs(Fragment, { children: [
          " in ",
          /* @__PURE__ */ jsx("span", { className: "font-semibold", style: { color: "#f97316" }, children: blogCategories.find((c) => c.slug === selectedCategory)?.name })
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6", children: currentPosts.map((post) => /* @__PURE__ */ jsx(BlogCard, { post }, post.id)) }),
      filteredPosts.length === 0 && /* @__PURE__ */ jsxs("div", { className: "text-center py-20", children: [
        /* @__PURE__ */ jsx("p", { className: "text-muted-foreground text-lg mb-6", children: "No posts in this category yet. Check back soon!" }),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => handleCategoryChange("all"),
            className: "px-6 py-3 rounded-full text-white font-bold hover:opacity-90 transition-opacity",
            style: { background: "#f97316" },
            children: "View All Posts"
          }
        )
      ] })
    ] }) }),
    totalPages > 1 && /* @__PURE__ */ jsx("section", { className: "pb-16", children: /* @__PURE__ */ jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center gap-1.5", children: [
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => handlePageChange(currentPage - 1),
            disabled: currentPage === 1,
            className: "p-2 rounded-lg border border-border transition-colors disabled:opacity-30 disabled:cursor-not-allowed hover:bg-muted",
            "aria-label": "Previous page",
            children: /* @__PURE__ */ jsx(ChevronLeft, { className: "w-4 h-4" })
          }
        ),
        getPageNumbers().map((page, index) => /* @__PURE__ */ jsx("div", { children: page === "..." ? /* @__PURE__ */ jsx("span", { className: "px-3 py-2 text-muted-foreground text-sm", children: "…" }) : /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => handlePageChange(page),
            className: "min-w-[36px] h-9 px-3 rounded-lg text-sm font-medium transition-all border",
            style: currentPage === page ? { background: "#f97316", color: "#fff", borderColor: "#f97316" } : { background: "transparent", color: "var(--foreground)", borderColor: "var(--border)" },
            children: page
          }
        ) }, index)),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => handlePageChange(currentPage + 1),
            disabled: currentPage === totalPages,
            className: "p-2 rounded-lg border border-border transition-colors disabled:opacity-30 disabled:cursor-not-allowed hover:bg-muted",
            "aria-label": "Next page",
            children: /* @__PURE__ */ jsx(ChevronRight, { className: "w-4 h-4" })
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("p", { className: "mt-3 text-center text-xs text-muted-foreground md:hidden", children: [
        "Page ",
        currentPage,
        " of ",
        totalPages
      ] })
    ] }) })
  ] });
}

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const $$Blog = createComponent(($$result, $$props, $$slots) => {
  const pageTitle = "Blog - Expert Reviews, Guides & Tips | smartly.sale";
  const pageDescription = "Discover expert product reviews, buying guides, and shopping tips. Stay updated with the latest trends and deals from Shopee Philippines.";
  return renderTemplate`${renderComponent($$result, "MainLayout", $$Main, { "title": pageTitle, "description": pageDescription, "ogImage": "/images/blog-og.jpg" }, { "default": ($$result2) => renderTemplate(_a || (_a = __template(['  <script type="application/ld+json">', "<\/script>  ", '<section class="relative overflow-hidden py-20 md:py-28" style="background: linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%);"> <div class="absolute inset-0 opacity-20" style="background-image: radial-gradient(circle at 20% 50%, #f97316 0%, transparent 50%), radial-gradient(circle at 80% 20%, #7c3aed 0%, transparent 40%);"></div> <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center"> <span class="inline-block text-xs font-bold uppercase tracking-widest text-orange-400 mb-4 px-3 py-1 rounded-full border border-orange-400/30 bg-orange-400/10">\nGaming &amp; Deals\n</span> <h1 class="text-4xl md:text-6xl font-extrabold text-white mb-6 leading-tight" style="letter-spacing: -0.02em;">\nThe smartly.sale Blog\n</h1> <p class="text-lg md:text-xl text-white/70 max-w-2xl mx-auto">\nLatest gaming news, tips, free credits, and deals \u2014 updated weekly for Filipino gamers and beyond.\n</p> </div> </section>  <div class="bg-background"> ', ' </div>  <section class="py-16 border-t border-border bg-muted/30"> <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center"> <h2 class="text-2xl md:text-3xl font-bold text-foreground mb-4">\nNever Miss a Post\n</h2> <p class="text-muted-foreground text-lg mb-8">\nNew gaming guides and deals drop every week. Stay in the loop.\n</p> <a', ' class="inline-flex items-center justify-center px-8 py-3.5 text-white font-bold rounded-full hover:opacity-90 transition-opacity" style="background: #f97316;">\nGet in Touch\n</a> </div> </section> '])), unescapeHTML(JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Blog",
    "name": "smartly.sale Blog",
    "description": pageDescription,
    "url": `${baseUrl}/blog`,
    "publisher": {
      "@type": "Organization",
      "name": "smartly.sale",
      "logo": {
        "@type": "ImageObject",
        "url": `${baseUrl}/logo.png`
      }
    }
  })), maybeRenderHead(), renderComponent($$result2, "BlogList", BlogList, { "client:load": true, "client:component-hydration": "load", "client:component-path": "/Users/kirbydimsontompong/smartly.sale/src/components/BlogList", "client:component-export": "default" }), addAttribute(`${baseUrl}/contact`, "href")) })}`;
}, "/Users/kirbydimsontompong/smartly.sale/src/pages/blog.astro", void 0);

const $$file = "/Users/kirbydimsontompong/smartly.sale/src/pages/blog.astro";
const $$url = "/blog";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Blog,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
