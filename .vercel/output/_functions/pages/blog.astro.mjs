import { e as createComponent, k as renderComponent, r as renderTemplate, h as addAttribute, m as maybeRenderHead, u as unescapeHTML } from '../chunks/astro/server_B7CNsfjb.mjs';
import 'kleur/colors';
import { $ as $$Main } from '../chunks/main__TEui6ED.mjs';
import { jsxs, jsx } from 'react/jsx-runtime';
import { useState, useMemo } from 'react';
import { B as BlogCard } from '../chunks/BlogCard_D1TT-0ZP.mjs';
import { b as blogPosts, a as blogCategories } from '../chunks/blog-data_DcMpk2U-.mjs';
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
  return /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsx("section", { className: "pb-12", children: /* @__PURE__ */ jsx("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-3 justify-center", children: [
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => handleCategoryChange("all"),
          className: `px-4 py-2 rounded-full text-sm font-medium transition-colors ${selectedCategory === "all" ? "bg-brand !text-white" : "bg-white text-gray-700 border border-gray-300 hover:border-brand hover:text-brand"}`,
          children: "All Posts"
        }
      ),
      blogCategories.map((category) => /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => handleCategoryChange(category.slug),
          className: `px-4 py-2 rounded-full text-sm font-medium transition-colors ${selectedCategory === category.slug ? "bg-brand !text-white" : "bg-white text-gray-700 border border-gray-300 hover:border-brand hover:text-brand"}`,
          children: category.name
        },
        category.slug
      ))
    ] }) }) }),
    /* @__PURE__ */ jsx("section", { className: "pb-12", children: /* @__PURE__ */ jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", children: [
      /* @__PURE__ */ jsx("div", { className: "mb-6 text-center text-gray-600", children: /* @__PURE__ */ jsxs("p", { className: "text-sm", children: [
        "Showing ",
        startIndex + 1,
        "-",
        Math.min(endIndex, filteredPosts.length),
        " of ",
        filteredPosts.length,
        " ",
        filteredPosts.length === 1 ? "post" : "posts",
        selectedCategory !== "all" && /* @__PURE__ */ jsxs("span", { children: [
          " ",
          "in ",
          /* @__PURE__ */ jsx("span", { className: "font-semibold text-brand", children: blogCategories.find((c) => c.slug === selectedCategory)?.name })
        ] })
      ] }) }),
      /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8", children: currentPosts.map((post) => /* @__PURE__ */ jsx(BlogCard, { post }, post.id)) }),
      filteredPosts.length === 0 && /* @__PURE__ */ jsxs("div", { className: "text-center py-16", children: [
        /* @__PURE__ */ jsx("p", { className: "text-gray-500 text-lg mb-16", children: "No blog posts found in this category. Check back soon for new content!" }),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => handleCategoryChange("all"),
            className: "inline-flex items-center justify-center px-6 py-3 bg-brand !text-white font-bold rounded-full hover:opacity-90 transition-colors",
            children: "View All Posts"
          }
        )
      ] })
    ] }) }),
    totalPages > 1 && /* @__PURE__ */ jsx("section", { className: "pb-20", children: /* @__PURE__ */ jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center gap-2", children: [
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => handlePageChange(currentPage - 1),
            disabled: currentPage === 1,
            className: `p-2 rounded-lg transition-colors ${currentPage === 1 ? "text-gray-400 cursor-not-allowed" : "text-gray-700 hover:bg-gray-100"}`,
            "aria-label": "Previous page",
            children: /* @__PURE__ */ jsx(ChevronLeft, { className: "w-5 h-5" })
          }
        ),
        /* @__PURE__ */ jsx("div", { className: "flex items-center gap-1", children: getPageNumbers().map((page, index) => /* @__PURE__ */ jsx("div", { children: page === "..." ? /* @__PURE__ */ jsx("span", { className: "px-3 py-2 text-gray-500", children: "..." }) : /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => handlePageChange(page),
            className: `min-w-[40px] px-3 py-2 rounded-lg text-sm font-medium transition-colors ${currentPage === page ? "bg-brand !text-white" : "text-gray-700 hover:bg-gray-100"}`,
            children: page
          }
        ) }, index)) }),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => handlePageChange(currentPage + 1),
            disabled: currentPage === totalPages,
            className: `p-2 rounded-lg transition-colors ${currentPage === totalPages ? "text-gray-400 cursor-not-allowed" : "text-gray-700 hover:bg-gray-100"}`,
            "aria-label": "Next page",
            children: /* @__PURE__ */ jsx(ChevronRight, { className: "w-5 h-5" })
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "mt-4 text-center text-sm text-gray-600 md:hidden", children: [
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
  return renderTemplate`${renderComponent($$result, "MainLayout", $$Main, { "title": pageTitle, "description": pageDescription, "ogImage": "/images/blog-og.jpg" }, { "default": ($$result2) => renderTemplate(_a || (_a = __template(['  <script type="application/ld+json">', "<\/script> ", '<div class="bg-gradient-to-b from-orange-50 to-white"> <!-- Hero Section --> <section class="py-16 md:py-24"> <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center"> <h1 class="text-4xl md:text-5xl font-bold text-gray-900 mb-6">\nSmart Shopping Blog\n</h1> <p class="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">\nExpert reviews, buying guides, and insider tips to help you shop smarter on Shopee Philippines\n</p> </div> </section> <!-- Blog List with Filters --> ', ' <!-- CTA Section --> <section class="py-16 bg-brand"> <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center"> <h2 class="text-3xl md:text-4xl font-bold text-white mb-6">\nNever Miss a Deal or Review\n</h2> <p class="text-white/90 text-lg mb-8">\nSubscribe to our newsletter for the latest product reviews, buying guides, and exclusive Shopee deals.\n</p> <a', ' class="inline-flex items-center justify-center px-8 py-4 bg-white text-brand font-bold rounded-full hover:bg-gray-100 transition-colors">\nSubscribe Now\n</a> </div> </section> </div> '])), unescapeHTML(JSON.stringify({
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
  })), maybeRenderHead(), renderComponent($$result2, "BlogList", BlogList, { "client:load": true, "client:component-hydration": "load", "client:component-path": "/app/src/components/BlogList", "client:component-export": "default" }), addAttribute(`${baseUrl}/contact`, "href")) })}`;
}, "/app/src/pages/blog.astro", void 0);

const $$file = "/app/src/pages/blog.astro";
const $$url = "/blog";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Blog,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
