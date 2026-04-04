import { renderers } from './renderers.mjs';
import { c as createExports, s as serverEntrypointModule } from './chunks/_@astrojs-ssr-adapter_DdJpfivZ.mjs';
import { manifest } from './manifest_tQNa_NQM.mjs';

const serverIslandMap = new Map();;

const _page0 = () => import('./pages/_image.astro.mjs');
const _page1 = () => import('./pages/about.astro.mjs');
const _page2 = () => import('./pages/admin/earnings.astro.mjs');
const _page3 = () => import('./pages/aegix.astro.mjs');
const _page4 = () => import('./pages/api/aunt-tracker.astro.mjs');
const _page5 = () => import('./pages/api/capi.astro.mjs');
const _page6 = () => import('./pages/api/cms/products/_productid_.astro.mjs');
const _page7 = () => import('./pages/api/cms/products.astro.mjs');
const _page8 = () => import('./pages/api/cms/test.astro.mjs');
const _page9 = () => import('./pages/api/cpa-offers.astro.mjs');
const _page10 = () => import('./pages/api/cpabuild-postback.astro.mjs');
const _page11 = () => import('./pages/api/cpabuild-proxy.astro.mjs');
const _page12 = () => import('./pages/api/daily-broadcast.astro.mjs');
const _page13 = () => import('./pages/api/gcash-conversion.astro.mjs');
const _page14 = () => import('./pages/api/google-index.astro.mjs');
const _page15 = () => import('./pages/api/price-reports.astro.mjs');
const _page16 = () => import('./pages/api/shopee-ai-chat.astro.mjs');
const _page17 = () => import('./pages/api/subscribe.astro.mjs');
const _page18 = () => import('./pages/api/telegram-notify.astro.mjs');
const _page19 = () => import('./pages/api/test-facebook.astro.mjs');
const _page20 = () => import('./pages/blog/affordable-fashion-finds-shopee-closet-to-cart.astro.mjs');
const _page21 = () => import('./pages/blog/biggest-game-releases-november-2025.astro.mjs');
const _page22 = () => import('./pages/blog/declutter-closet-10-minutes-shopee.astro.mjs');
const _page23 = () => import('./pages/blog/deep-rock-galactic-survivor-mobile-2025.astro.mjs');
const _page24 = () => import('./pages/blog/free-psn-codes-shopee-tips.astro.mjs');
const _page25 = () => import('./pages/blog/how-to-get-free-roblox-robux-shopee-2025.astro.mjs');
const _page26 = () => import('./pages/blog/how-to-get-free-xbox-codes-shopee-2025.astro.mjs');
const _page27 = () => import('./pages/blog/how-to-spot-shopee-bestsellers-2025.astro.mjs');
const _page28 = () => import('./pages/blog/kitchen-gadgets-save-time-shopee.astro.mjs');
const _page29 = () => import('./pages/blog/maximize-small-spaces-home-living-hacks-shopee.astro.mjs');
const _page30 = () => import('./pages/blog/november-2025-game-releases-calendar.astro.mjs');
const _page31 = () => import('./pages/blog/optimize-desk-maximum-focus-shopee.astro.mjs');
const _page32 = () => import('./pages/blog/shopee-free-roblox-robux-claim-rewards.astro.mjs');
const _page33 = () => import('./pages/blog/shopee-free-shipping-voucher-guide.astro.mjs');
const _page34 = () => import('./pages/blog/shopee-free-voucher-discount-codes-2025.astro.mjs');
const _page35 = () => import('./pages/blog/shopee-hidden-vouchers-secret-codes.astro.mjs');
const _page36 = () => import('./pages/blog/shopee-roblox-robux-giveaway-2025.astro.mjs');
const _page37 = () => import('./pages/blog/smart-home-shopping-guide-budget-gadgets-shopee.astro.mjs');
const _page38 = () => import('./pages/blog/starter-kit-under-500-budget-shopping-shopee.astro.mjs');
const _page39 = () => import('./pages/blog/support-local-handmade-filipino-products-shopee.astro.mjs');
const _page40 = () => import('./pages/blog/this-week-mobile-games-november-13-2025.astro.mjs');
const _page41 = () => import('./pages/blog/top-10-eco-friendly-sustainable-products-shopee-ph-2025.astro.mjs');
const _page42 = () => import('./pages/blog/top-mobile-games-november-2025.astro.mjs');
const _page43 = () => import('./pages/blog/wellness-self-care-beauty-skincare-essentials-shopee-2025.astro.mjs');
const _page44 = () => import('./pages/blog/_slug_.astro.mjs');
const _page45 = () => import('./pages/blog.astro.mjs');
const _page46 = () => import('./pages/bonus.astro.mjs');
const _page47 = () => import('./pages/categories.astro.mjs');
const _page48 = () => import('./pages/cheapest-near-me.astro.mjs');
const _page49 = () => import('./pages/contact.astro.mjs');
const _page50 = () => import('./pages/daily.astro.mjs');
const _page51 = () => import('./pages/earn.astro.mjs');
const _page52 = () => import('./pages/earn-gcash.astro.mjs');
const _page53 = () => import('./pages/free-fire-codes.astro.mjs');
const _page54 = () => import('./pages/free-gaming-credits.astro.mjs');
const _page55 = () => import('./pages/free-gift-cards-philippines.astro.mjs');
const _page56 = () => import('./pages/free-mlbb-diamonds.astro.mjs');
const _page57 = () => import('./pages/free-robux-philippines.astro.mjs');
const _page58 = () => import('./pages/jokes.astro.mjs');
const _page59 = () => import('./pages/meta-offers.astro.mjs');
const _page60 = () => import('./pages/online-contests-philippines.astro.mjs');
const _page61 = () => import('./pages/post/_slug_.astro.mjs');
const _page62 = () => import('./pages/privacy.astro.mjs');
const _page63 = () => import('./pages/product/_slug_.astro.mjs');
const _page64 = () => import('./pages/product-details.astro.mjs');
const _page65 = () => import('./pages/product-details-demo.astro.mjs');
const _page66 = () => import('./pages/products.astro.mjs');
const _page67 = () => import('./pages/shopee-ai-assistant.astro.mjs');
const _page68 = () => import('./pages/sitemap.xml.astro.mjs');
const _page69 = () => import('./pages/terms.astro.mjs');
const _page70 = () => import('./pages/tiktok-viral.astro.mjs');
const _page71 = () => import('./pages/tools/base64-image.astro.mjs');
const _page72 = () => import('./pages/tools/cash-tracker.astro.mjs');
const _page73 = () => import('./pages/tools/color-converter.astro.mjs');
const _page74 = () => import('./pages/tools/css-minifier.astro.mjs');
const _page75 = () => import('./pages/tools/html-entity.astro.mjs');
const _page76 = () => import('./pages/tools/json-formatter.astro.mjs');
const _page77 = () => import('./pages/tools/readme.astro.mjs');
const _page78 = () => import('./pages/tools.astro.mjs');
const _page79 = () => import('./pages/win-free-phone.astro.mjs');
const _page80 = () => import('./pages/index.astro.mjs');
const pageMap = new Map([
    ["node_modules/astro/dist/assets/endpoint/generic.js", _page0],
    ["src/pages/about.astro", _page1],
    ["src/pages/admin/earnings.astro", _page2],
    ["src/pages/aegix.astro", _page3],
    ["src/pages/api/aunt-tracker.ts", _page4],
    ["src/pages/api/capi.ts", _page5],
    ["src/pages/api/cms/products/[productId].ts", _page6],
    ["src/pages/api/cms/products.ts", _page7],
    ["src/pages/api/cms/test.ts", _page8],
    ["src/pages/api/cpa-offers.ts", _page9],
    ["src/pages/api/cpabuild-postback.ts", _page10],
    ["src/pages/api/cpabuild-proxy.ts", _page11],
    ["src/pages/api/daily-broadcast.ts", _page12],
    ["src/pages/api/gcash-conversion.ts", _page13],
    ["src/pages/api/google-index.ts", _page14],
    ["src/pages/api/price-reports.ts", _page15],
    ["src/pages/api/shopee-ai-chat.ts", _page16],
    ["src/pages/api/subscribe.ts", _page17],
    ["src/pages/api/telegram-notify.ts", _page18],
    ["src/pages/api/test-facebook.ts", _page19],
    ["src/pages/blog/affordable-fashion-finds-shopee-closet-to-cart.astro", _page20],
    ["src/pages/blog/biggest-game-releases-november-2025.astro", _page21],
    ["src/pages/blog/declutter-closet-10-minutes-shopee.astro", _page22],
    ["src/pages/blog/deep-rock-galactic-survivor-mobile-2025.astro", _page23],
    ["src/pages/blog/free-psn-codes-shopee-tips.astro", _page24],
    ["src/pages/blog/how-to-get-free-roblox-robux-shopee-2025.astro", _page25],
    ["src/pages/blog/how-to-get-free-xbox-codes-shopee-2025.astro", _page26],
    ["src/pages/blog/how-to-spot-shopee-bestsellers-2025.astro", _page27],
    ["src/pages/blog/kitchen-gadgets-save-time-shopee.astro", _page28],
    ["src/pages/blog/maximize-small-spaces-home-living-hacks-shopee.astro", _page29],
    ["src/pages/blog/november-2025-game-releases-calendar.astro", _page30],
    ["src/pages/blog/optimize-desk-maximum-focus-shopee.astro", _page31],
    ["src/pages/blog/shopee-free-roblox-robux-claim-rewards.astro", _page32],
    ["src/pages/blog/shopee-free-shipping-voucher-guide.astro", _page33],
    ["src/pages/blog/shopee-free-voucher-discount-codes-2025.astro", _page34],
    ["src/pages/blog/shopee-hidden-vouchers-secret-codes.astro", _page35],
    ["src/pages/blog/shopee-roblox-robux-giveaway-2025.astro", _page36],
    ["src/pages/blog/smart-home-shopping-guide-budget-gadgets-shopee.astro", _page37],
    ["src/pages/blog/starter-kit-under-500-budget-shopping-shopee.astro", _page38],
    ["src/pages/blog/support-local-handmade-filipino-products-shopee.astro", _page39],
    ["src/pages/blog/this-week-mobile-games-november-13-2025.astro", _page40],
    ["src/pages/blog/top-10-eco-friendly-sustainable-products-shopee-ph-2025.astro", _page41],
    ["src/pages/blog/top-mobile-games-november-2025.astro", _page42],
    ["src/pages/blog/wellness-self-care-beauty-skincare-essentials-shopee-2025.astro", _page43],
    ["src/pages/blog/[slug].astro", _page44],
    ["src/pages/blog.astro", _page45],
    ["src/pages/bonus.astro", _page46],
    ["src/pages/categories.astro", _page47],
    ["src/pages/cheapest-near-me.astro", _page48],
    ["src/pages/contact.astro", _page49],
    ["src/pages/daily.astro", _page50],
    ["src/pages/earn.astro", _page51],
    ["src/pages/earn-gcash.astro", _page52],
    ["src/pages/free-fire-codes.astro", _page53],
    ["src/pages/free-gaming-credits.astro", _page54],
    ["src/pages/free-gift-cards-philippines.astro", _page55],
    ["src/pages/free-mlbb-diamonds.astro", _page56],
    ["src/pages/free-robux-philippines.astro", _page57],
    ["src/pages/jokes.astro", _page58],
    ["src/pages/meta-offers.astro", _page59],
    ["src/pages/online-contests-philippines.astro", _page60],
    ["src/pages/post/[slug].astro", _page61],
    ["src/pages/privacy.astro", _page62],
    ["src/pages/product/[slug].astro", _page63],
    ["src/pages/product-details.astro", _page64],
    ["src/pages/product-details-demo.astro", _page65],
    ["src/pages/products.astro", _page66],
    ["src/pages/shopee-ai-assistant.astro", _page67],
    ["src/pages/sitemap.xml.ts", _page68],
    ["src/pages/terms.astro", _page69],
    ["src/pages/tiktok-viral.astro", _page70],
    ["src/pages/tools/base64-image.astro", _page71],
    ["src/pages/tools/cash-tracker.astro", _page72],
    ["src/pages/tools/color-converter.astro", _page73],
    ["src/pages/tools/css-minifier.astro", _page74],
    ["src/pages/tools/html-entity.astro", _page75],
    ["src/pages/tools/json-formatter.astro", _page76],
    ["src/pages/tools/README.md", _page77],
    ["src/pages/tools/index.astro", _page78],
    ["src/pages/win-free-phone.astro", _page79],
    ["src/pages/index.astro", _page80]
]);

const _manifest = Object.assign(manifest, {
    pageMap,
    serverIslandMap,
    renderers,
    actions: () => import('./_noop-actions.mjs'),
    middleware: () => import('./_astro-internal_middleware.mjs')
});
const _args = {
    "middlewareSecret": "74def9ec-550d-42d9-9b8a-ba2366b0fe8c",
    "skewProtection": false
};
const _exports = createExports(_manifest, _args);
const __astrojsSsrVirtualEntry = _exports.default;
const _start = 'start';
if (Object.prototype.hasOwnProperty.call(serverEntrypointModule, _start)) ;

export { __astrojsSsrVirtualEntry as default, pageMap };
