import { e as createComponent, f as createAstro, k as renderComponent, r as renderTemplate } from '../../chunks/astro/server_B7CNsfjb.mjs';
import 'kleur/colors';
import { $ as $$Main } from '../../chunks/main__TEui6ED.mjs';
import { b as blogPosts } from '../../chunks/blog-data_DcMpk2U-.mjs';
export { renderers } from '../../renderers.mjs';

const $$Astro = createAstro();
function getStaticPaths() {
  return blogPosts.map((post) => ({
    params: { slug: post.slug },
    props: { post }
  }));
}
const $$slug = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$slug;
  const { post } = Astro2.props;
  const pageTitle = post.metaTitle || `${post.title} - smartly.sale`;
  const pageDescription = post.metaDescription || post.excerpt;
  return renderTemplate`${renderComponent($$result, "MainLayout", $$Main, { "title": pageTitle, "description": pageDescription, "ogImage": post.featuredImage }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "PostContent", null, { "client:only": "react", "post": post, "client:component-hydration": "only", "client:component-path": "/app/src/components/PostContent", "client:component-export": "default" })} ` })}`;
}, "/app/src/pages/post/[slug].astro", void 0);

const $$file = "/app/src/pages/post/[slug].astro";
const $$url = "/post/[slug]";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$slug,
  file: $$file,
  getStaticPaths,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
