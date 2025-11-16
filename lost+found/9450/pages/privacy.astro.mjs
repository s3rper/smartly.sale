globalThis.process ??= {}; globalThis.process.env ??= {};
import { e as createComponent, k as renderComponent, r as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_EdVLS0R4.mjs';
import { $ as $$Main } from '../chunks/main_DoTm7gE3.mjs';
export { r as renderers } from '../chunks/_@astro-renderers_Br4-2xqD.mjs';

const $$Privacy = createComponent(($$result, $$props, $$slots) => {
  const pageTitle = "Privacy Policy - SmartFinds PH";
  const pageDescription = "Learn how SmartFinds PH collects, uses, and protects your personal information.";
  return renderTemplate`${renderComponent($$result, "MainLayout", $$Main, { "title": pageTitle, "description": pageDescription }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="py-16"> <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8"> <h1 class="text-4xl md:text-5xl font-bold text-foreground mb-4">Privacy Policy</h1> <p class="text-muted-foreground mb-8">Last updated: January 2025</p> <div class="prose prose-lg max-w-none space-y-8"> <section> <h2 class="text-2xl font-bold text-foreground mb-4">Introduction</h2> <p class="text-muted-foreground leading-relaxed">
At SmartFinds PH, we take your privacy seriously. This Privacy Policy explains how we collect, 
            use, disclose, and safeguard your information when you visit our website.
</p> </section> <section> <h2 class="text-2xl font-bold text-foreground mb-4">Information We Collect</h2> <p class="text-muted-foreground leading-relaxed mb-4">
We may collect information about you in a variety of ways. The information we may collect includes:
</p> <ul class="list-disc pl-6 space-y-2 text-muted-foreground"> <li>Personal data such as name and email address when you contact us</li> <li>Usage data including your IP address, browser type, and pages visited</li> <li>Cookie data to enhance your browsing experience</li> </ul> </section> <section> <h2 class="text-2xl font-bold text-foreground mb-4">How We Use Your Information</h2> <p class="text-muted-foreground leading-relaxed mb-4">
We use the information we collect in the following ways:
</p> <ul class="list-disc pl-6 space-y-2 text-muted-foreground"> <li>To respond to your inquiries and provide customer support</li> <li>To improve our website and user experience</li> <li>To analyze site usage and trends</li> <li>To send promotional emails about products and deals (with your consent)</li> </ul> </section> <section> <h2 class="text-2xl font-bold text-foreground mb-4">Affiliate Links Disclosure</h2> <p class="text-muted-foreground leading-relaxed">
SmartFinds PH participates in affiliate marketing programs. When you click on affiliate links and 
            make a purchase, we may earn a commission at no additional cost to you. This helps us maintain the 
            website and continue providing valuable content.
</p> </section> <section> <h2 class="text-2xl font-bold text-foreground mb-4">Cookies</h2> <p class="text-muted-foreground leading-relaxed">
We use cookies to enhance your browsing experience, analyze site traffic, and personalize content. 
            You can control cookie settings through your browser preferences.
</p> </section> <section> <h2 class="text-2xl font-bold text-foreground mb-4">Third-Party Services</h2> <p class="text-muted-foreground leading-relaxed">
We may use third-party services such as Google Analytics and social media platforms. These services 
            have their own privacy policies that govern their use of your information.
</p> </section> <section> <h2 class="text-2xl font-bold text-foreground mb-4">Your Rights</h2> <p class="text-muted-foreground leading-relaxed">
You have the right to access, update, or delete your personal information at any time. To exercise 
            these rights, please contact us at hello@smartfindsph.com.
</p> </section> <section> <h2 class="text-2xl font-bold text-foreground mb-4">Contact Us</h2> <p class="text-muted-foreground leading-relaxed">
If you have questions about this Privacy Policy, please contact us at hello@smartfindsph.com or 
            visit our <a href="/contact" class="text-[#FF6600] hover:underline">contact page</a>.
</p> </section> </div> </div> </div> ` })}`;
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
