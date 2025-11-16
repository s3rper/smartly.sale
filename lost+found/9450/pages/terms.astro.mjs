globalThis.process ??= {}; globalThis.process.env ??= {};
import { e as createComponent, k as renderComponent, r as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_EdVLS0R4.mjs';
import { $ as $$Main } from '../chunks/main_DoTm7gE3.mjs';
export { r as renderers } from '../chunks/_@astro-renderers_Br4-2xqD.mjs';

const $$Terms = createComponent(($$result, $$props, $$slots) => {
  const pageTitle = "Terms of Service - SmartFinds PH";
  const pageDescription = "Read our terms of service and understand the rules for using SmartFinds PH.";
  return renderTemplate`${renderComponent($$result, "MainLayout", $$Main, { "title": pageTitle, "description": pageDescription }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="py-16"> <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8"> <h1 class="text-4xl md:text-5xl font-bold text-foreground mb-4">Terms of Service</h1> <p class="text-muted-foreground mb-8">Last updated: January 2025</p> <div class="prose prose-lg max-w-none space-y-8"> <section> <h2 class="text-2xl font-bold text-foreground mb-4">Agreement to Terms</h2> <p class="text-muted-foreground leading-relaxed">
By accessing or using SmartFinds PH, you agree to be bound by these Terms of Service. 
            If you disagree with any part of these terms, you may not access our website.
</p> </section> <section> <h2 class="text-2xl font-bold text-foreground mb-4">Use of Our Service</h2> <p class="text-muted-foreground leading-relaxed mb-4">
SmartFinds PH provides product reviews, recommendations, and affiliate links to Shopee Philippines. 
            By using our service, you agree to:
</p> <ul class="list-disc pl-6 space-y-2 text-muted-foreground"> <li>Use the website for lawful purposes only</li> <li>Not engage in any activity that disrupts or interferes with the website</li> <li>Not attempt to gain unauthorized access to any part of the website</li> <li>Respect intellectual property rights</li> </ul> </section> <section> <h2 class="text-2xl font-bold text-foreground mb-4">Affiliate Disclaimer</h2> <p class="text-muted-foreground leading-relaxed">
SmartFinds PH is a participant in affiliate marketing programs, including Shopee's affiliate program. 
            We earn commissions from qualifying purchases made through our affiliate links. This does not affect 
            the price you pay, and we only recommend products we genuinely believe in.
</p> </section> <section> <h2 class="text-2xl font-bold text-foreground mb-4">Content Accuracy</h2> <p class="text-muted-foreground leading-relaxed">
While we strive to provide accurate and up-to-date information, we make no warranties about the 
            completeness, reliability, or accuracy of the content on our website. Product prices, availability, 
            and specifications are subject to change without notice.
</p> </section> <section> <h2 class="text-2xl font-bold text-foreground mb-4">External Links</h2> <p class="text-muted-foreground leading-relaxed">
Our website contains links to third-party websites, including Shopee Philippines. We are not 
            responsible for the content, privacy policies, or practices of these external sites. When you 
            click on affiliate links, you will be directed to the merchant's website.
</p> </section> <section> <h2 class="text-2xl font-bold text-foreground mb-4">Intellectual Property</h2> <p class="text-muted-foreground leading-relaxed">
All content on SmartFinds PH, including text, images, logos, and graphics, is the property of 
            SmartFinds PH or its content suppliers and is protected by copyright laws. You may not reproduce, 
            distribute, or use any content without our written permission.
</p> </section> <section> <h2 class="text-2xl font-bold text-foreground mb-4">Limitation of Liability</h2> <p class="text-muted-foreground leading-relaxed">
SmartFinds PH and its affiliates shall not be liable for any damages arising from your use of 
            the website or from any information, products, or services obtained through our affiliate links.
</p> </section> <section> <h2 class="text-2xl font-bold text-foreground mb-4">Changes to Terms</h2> <p class="text-muted-foreground leading-relaxed">
We reserve the right to modify these Terms of Service at any time. Changes will be effective 
            immediately upon posting to the website. Your continued use of the website after changes are 
            posted constitutes your acceptance of the modified terms.
</p> </section> <section> <h2 class="text-2xl font-bold text-foreground mb-4">Governing Law</h2> <p class="text-muted-foreground leading-relaxed">
These Terms of Service are governed by and construed in accordance with the laws of the Philippines.
</p> </section> <section> <h2 class="text-2xl font-bold text-foreground mb-4">Contact Us</h2> <p class="text-muted-foreground leading-relaxed">
If you have questions about these Terms of Service, please contact us at hello@smartfindsph.com or 
            visit our <a href="/contact" class="text-[#FF6600] hover:underline">contact page</a>.
</p> </section> </div> </div> </div> ` })}`;
}, "/app/src/pages/terms.astro", void 0);

const $$file = "/app/src/pages/terms.astro";
const $$url = "/terms";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Terms,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
