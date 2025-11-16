import { e as createComponent, k as renderComponent, r as renderTemplate } from '../../chunks/astro/server_B_OFuUZx.mjs';
import 'kleur/colors';
import { $ as $$Main } from '../../chunks/main_C3qUMH6Z.mjs';
export { renderers } from '../../renderers.mjs';

const $$slug = createComponent(($$result, $$props, $$slots) => {
  const post = { title: "Blog Post" };
  const pageTitle = `${post.title} - smartly.sale`;
  const pageDescription = "Read our latest product review and shopping guide.";
  return renderTemplate`${renderComponent($$result, "MainLayout", $$Main, { "title": pageTitle, "description": pageDescription }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "PostContent", null, { "client:only": "react", "client:component-hydration": "only", "client:component-path": "/app/src/components/PostContent", "client:component-export": "default" })} ` })}`;
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
