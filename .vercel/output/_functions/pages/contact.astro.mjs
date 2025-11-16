import { e as createComponent, k as renderComponent, r as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_B_OFuUZx.mjs';
import 'kleur/colors';
import { $ as $$Main } from '../chunks/main_C3qUMH6Z.mjs';
export { renderers } from '../renderers.mjs';

const $$Contact = createComponent(($$result, $$props, $$slots) => {
  const pageTitle = "Contact Us - smartly.sale";
  const pageDescription = "Get in touch with smartly.sale for business inquiries, partnerships, or product review requests.";
  return renderTemplate`${renderComponent($$result, "MainLayout", $$Main, { "title": pageTitle, "description": pageDescription }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">  <div class="text-center mb-12"> <h1 class="text-4xl md:text-5xl font-bold text-foreground mb-4">
Get in Touch
</h1> <p class="text-xl text-muted-foreground">
Have questions or want to collaborate? We'd love to hear from you!
</p> </div>  ${renderComponent($$result2, "ContactForm", null, { "client:only": "react", "client:component-hydration": "only", "client:component-path": "/app/src/components/ContactForm", "client:component-export": "default" })}  <div class="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6"> <div class="bg-background rounded-xl p-6 shadow-md border border-border text-center"> <div class="w-12 h-12 bg-[#FF6600]/10 rounded-lg flex items-center justify-center mx-auto mb-4"> <svg class="w-6 h-6 text-[#FF6600]" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path> </svg> </div> <h3 class="font-bold text-lg mb-2">Email Us</h3> <p class="text-muted-foreground text-sm">contact@smartly.sale</p> </div> <div class="bg-background rounded-xl p-6 shadow-md border border-border text-center"> <div class="w-12 h-12 bg-[#FF6600]/10 rounded-lg flex items-center justify-center mx-auto mb-4"> <svg class="w-6 h-6 text-[#FF6600]" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"></path> </svg> </div> <h3 class="font-bold text-lg mb-2">Social Media</h3> <p class="text-muted-foreground text-sm">Follow us @smartly.sale</p> </div> <div class="bg-background rounded-xl p-6 shadow-md border border-border text-center"> <div class="w-12 h-12 bg-[#FF6600]/10 rounded-lg flex items-center justify-center mx-auto mb-4"> <svg class="w-6 h-6 text-[#FF6600]" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path> </svg> </div> <h3 class="font-bold text-lg mb-2">Response Time</h3> <p class="text-muted-foreground text-sm">Within 24-48 hours</p> </div> </div>  <div class="mt-12 bg-accent/50 rounded-xl p-6 border border-border"> <h3 class="font-bold text-lg mb-3">Business Inquiries</h3> <p class="text-muted-foreground mb-2">
We welcome partnerships, sponsored posts, and product review opportunities. 
        Please use the form above to reach out with your proposal.
</p> <p class="text-muted-foreground text-sm">
Note: We carefully select partnerships that align with our values and provide genuine value to our community.
</p> </div> </div> ` })}`;
}, "/app/src/pages/contact.astro", void 0);

const $$file = "/app/src/pages/contact.astro";
const $$url = "/contact";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Contact,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
