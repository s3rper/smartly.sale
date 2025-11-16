import { e as createComponent, k as renderComponent, r as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_B_OFuUZx.mjs';
import 'kleur/colors';
import { $ as $$Main } from '../chunks/main_C3qUMH6Z.mjs';
export { renderers } from '../renderers.mjs';

const $$Privacy = createComponent(($$result, $$props, $$slots) => {
  const pageTitle = "Privacy Policy - smartly.sale";
  const pageDescription = "Learn how smartly.sale collects, uses, and protects your personal information.";
  return renderTemplate`${renderComponent($$result, "MainLayout", $$Main, { "title": pageTitle, "description": pageDescription }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16"> <h1 class="text-4xl md:text-5xl font-bold text-foreground mb-6">Privacy Policy</h1> <div class="prose prose-lg max-w-none"> <div class="bg-accent/50 rounded-xl p-6 mb-8 border border-border"> <p class="text-muted-foreground mb-2"> <strong>Last Updated:</strong> January 2025
</p> <p class="text-muted-foreground">
At smartly.sale, we take your privacy seriously. This Privacy Policy explains how we collect, 
          use, and protect your personal information.
</p> </div> <section class="mb-8"> <h2 class="text-2xl font-bold text-foreground mb-4">Information We Collect</h2> <div class="bg-background rounded-xl p-6 shadow-md border border-border"> <p class="text-muted-foreground mb-3">
We may collect the following types of information:
</p> <ul class="list-disc pl-6 space-y-2 text-muted-foreground"> <li>Contact information (name, email address) when you subscribe to our newsletter or contact us</li> <li>Usage data (pages visited, time spent, device information) through analytics tools</li> <li>Cookies and similar tracking technologies to enhance your browsing experience</li> </ul> </div> </section> <section class="mb-8"> <h2 class="text-2xl font-bold text-foreground mb-4">How We Use Your Information</h2> <div class="bg-background rounded-xl p-6 shadow-md border border-border"> <ul class="list-disc pl-6 space-y-2 text-muted-foreground"> <li>To send you newsletters and product recommendations (only if you've subscribed)</li> <li>To respond to your inquiries and provide customer support</li> <li>To analyze website traffic and improve our content and services</li> <li>To comply with legal obligations</li> </ul> </div> </section> <section class="mb-8"> <h2 class="text-2xl font-bold text-foreground mb-4">Affiliate Links & Cookies</h2> <div class="bg-background rounded-xl p-6 shadow-md border border-border"> <p class="text-muted-foreground mb-3">
smartly.sale participates in affiliate marketing programs. When you click on affiliate links and 
            make purchases, we may receive a commission. These programs may use cookies to track referrals.
</p> <p class="text-muted-foreground">
You can control cookies through your browser settings. However, disabling cookies may affect 
            your experience on our website.
</p> </div> </section> <section class="mb-8"> <h2 class="text-2xl font-bold text-foreground mb-4">Third-Party Services</h2> <div class="bg-background rounded-xl p-6 shadow-md border border-border"> <p class="text-muted-foreground mb-3">
We use third-party services for analytics, advertising, and affiliate tracking. These services 
            may collect information about your browsing behavior:
</p> <ul class="list-disc pl-6 space-y-2 text-muted-foreground"> <li>Google Analytics for website traffic analysis</li> <li>Shopee Affiliate Program for tracking purchases</li> <li>Social media platforms for sharing functionality</li> </ul> </div> </section> <section class="mb-8"> <h2 class="text-2xl font-bold text-foreground mb-4">Your Rights</h2> <div class="bg-background rounded-xl p-6 shadow-md border border-border"> <p class="text-muted-foreground mb-3">You have the right to:</p> <ul class="list-disc pl-6 space-y-2 text-muted-foreground"> <li>Access the personal information we hold about you</li> <li>Request correction of inaccurate information</li> <li>Request deletion of your personal information</li> <li>Opt-out of marketing communications at any time</li> </ul> </div> </section> <section class="mb-8"> <h2 class="text-2xl font-bold text-foreground mb-4">Data Security</h2> <div class="bg-background rounded-xl p-6 shadow-md border border-border"> <p class="text-muted-foreground">
We implement reasonable security measures to protect your personal information. However, 
            no method of transmission over the internet is 100% secure. We cannot guarantee absolute security.
</p> </div> </section> <section class="mb-8"> <h2 class="text-2xl font-bold text-foreground mb-4">Changes to This Policy</h2> <div class="bg-background rounded-xl p-6 shadow-md border border-border"> <p class="text-muted-foreground">
We may update this Privacy Policy from time to time. Changes will be posted on this page 
            with an updated revision date.
</p> </div> </section> <section> <h2 class="text-2xl font-bold text-foreground mb-4">Contact Us</h2> <div class="bg-background rounded-xl p-6 shadow-md border border-border"> <p class="text-muted-foreground">
If you have questions about this Privacy Policy, please contact us at:
<a href="/contact" class="text-[#FF6600] hover:underline font-semibold">Contact Page</a> </p> </div> </section> </div> </div> ` })}`;
}, "/app/src/pages/privacy.astro", void 0);

const $$file = "/app/src/pages/privacy.astro";
const $$url = "/privacy";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Privacy,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
