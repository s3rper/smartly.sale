import { renderers } from './renderers.mjs';
import { c as createExports, s as serverEntrypointModule } from './chunks/_@astrojs-ssr-adapter_8qFbKegY.mjs';
import { manifest } from './manifest_CAuRunKr.mjs';

const serverIslandMap = new Map();;

const _page0 = () => import('./pages/_image.astro.mjs');
const _page1 = () => import('./pages/about.astro.mjs');
const _page2 = () => import('./pages/api/cms/products/_productid_.astro.mjs');
const _page3 = () => import('./pages/api/cms/products.astro.mjs');
const _page4 = () => import('./pages/api/cms/test.astro.mjs');
const _page5 = () => import('./pages/api/cpa-offers.astro.mjs');
const _page6 = () => import('./pages/blog/affordable-fashion-finds-shopee-closet-to-cart.astro.mjs');
const _page7 = () => import('./pages/blog/biggest-game-releases-november-2025.astro.mjs');
const _page8 = () => import('./pages/blog/declutter-closet-10-minutes-shopee.astro.mjs');
const _page9 = () => import('./pages/blog/deep-rock-galactic-survivor-mobile-2025.astro.mjs');
const _page10 = () => import('./pages/blog/free-psn-codes-shopee-tips.astro.mjs');
const _page11 = () => import('./pages/blog/how-to-get-free-roblox-robux-shopee-2025.astro.mjs');
const _page12 = () => import('./pages/blog/how-to-get-free-xbox-codes-shopee-2025.astro.mjs');
const _page13 = () => import('./pages/blog/how-to-spot-shopee-bestsellers-2025.astro.mjs');
const _page14 = () => import('./pages/blog/kitchen-gadgets-save-time-shopee.astro.mjs');
const _page15 = () => import('./pages/blog/maximize-small-spaces-home-living-hacks-shopee.astro.mjs');
const _page16 = () => import('./pages/blog/november-2025-game-releases-calendar.astro.mjs');
const _page17 = () => import('./pages/blog/optimize-desk-maximum-focus-shopee.astro.mjs');
const _page18 = () => import('./pages/blog/shopee-free-roblox-robux-claim-rewards.astro.mjs');
const _page19 = () => import('./pages/blog/shopee-free-shipping-voucher-guide.astro.mjs');
const _page20 = () => import('./pages/blog/shopee-free-voucher-discount-codes-2025.astro.mjs');
const _page21 = () => import('./pages/blog/shopee-hidden-vouchers-secret-codes.astro.mjs');
const _page22 = () => import('./pages/blog/shopee-roblox-robux-giveaway-2025.astro.mjs');
const _page23 = () => import('./pages/blog/smart-home-shopping-guide-budget-gadgets-shopee.astro.mjs');
const _page24 = () => import('./pages/blog/starter-kit-under-500-budget-shopping-shopee.astro.mjs');
const _page25 = () => import('./pages/blog/support-local-handmade-filipino-products-shopee.astro.mjs');
const _page26 = () => import('./pages/blog/this-week-mobile-games-november-13-2025.astro.mjs');
const _page27 = () => import('./pages/blog/top-10-eco-friendly-sustainable-products-shopee-ph-2025.astro.mjs');
const _page28 = () => import('./pages/blog/top-mobile-games-november-2025.astro.mjs');
const _page29 = () => import('./pages/blog/wellness-self-care-beauty-skincare-essentials-shopee-2025.astro.mjs');
const _page30 = () => import('./pages/blog/_slug_.astro.mjs');
const _page31 = () => import('./pages/blog.astro.mjs');
const _page32 = () => import('./pages/bonus.astro.mjs');
const _page33 = () => import('./pages/categories.astro.mjs');
const _page34 = () => import('./pages/contact.astro.mjs');
const _page35 = () => import('./pages/earn.astro.mjs');
const _page36 = () => import('./pages/jokes.astro.mjs');
const _page37 = () => import('./pages/post/_slug_.astro.mjs');
const _page38 = () => import('./pages/privacy.astro.mjs');
const _page39 = () => import('./pages/product/_slug_.astro.mjs');
const _page40 = () => import('./pages/product-details.astro.mjs');
const _page41 = () => import('./pages/product-details-demo.astro.mjs');
const _page42 = () => import('./pages/products.astro.mjs');
const _page43 = () => import('./pages/sitemap.xml.astro.mjs');
const _page44 = () => import('./pages/terms.astro.mjs');
const _page45 = () => import('./pages/tiktok-viral.astro.mjs');
const _page46 = () => import('./pages/index.astro.mjs');
const pageMap = new Map([
    ["node_modules/astro/dist/assets/endpoint/generic.js", _page0],
    ["src/pages/about.astro", _page1],
    ["src/pages/api/cms/products/[productId].ts", _page2],
    ["src/pages/api/cms/products.ts", _page3],
    ["src/pages/api/cms/test.ts", _page4],
    ["src/pages/api/cpa-offers.ts", _page5],
    ["src/pages/blog/affordable-fashion-finds-shopee-closet-to-cart.astro", _page6],
    ["src/pages/blog/biggest-game-releases-november-2025.astro", _page7],
    ["src/pages/blog/declutter-closet-10-minutes-shopee.astro", _page8],
    ["src/pages/blog/deep-rock-galactic-survivor-mobile-2025.astro", _page9],
    ["src/pages/blog/free-psn-codes-shopee-tips.astro", _page10],
    ["src/pages/blog/how-to-get-free-roblox-robux-shopee-2025.astro", _page11],
    ["src/pages/blog/how-to-get-free-xbox-codes-shopee-2025.astro", _page12],
    ["src/pages/blog/how-to-spot-shopee-bestsellers-2025.astro", _page13],
    ["src/pages/blog/kitchen-gadgets-save-time-shopee.astro", _page14],
    ["src/pages/blog/maximize-small-spaces-home-living-hacks-shopee.astro", _page15],
    ["src/pages/blog/november-2025-game-releases-calendar.astro", _page16],
    ["src/pages/blog/optimize-desk-maximum-focus-shopee.astro", _page17],
    ["src/pages/blog/shopee-free-roblox-robux-claim-rewards.astro", _page18],
    ["src/pages/blog/shopee-free-shipping-voucher-guide.astro", _page19],
    ["src/pages/blog/shopee-free-voucher-discount-codes-2025.astro", _page20],
    ["src/pages/blog/shopee-hidden-vouchers-secret-codes.astro", _page21],
    ["src/pages/blog/shopee-roblox-robux-giveaway-2025.astro", _page22],
    ["src/pages/blog/smart-home-shopping-guide-budget-gadgets-shopee.astro", _page23],
    ["src/pages/blog/starter-kit-under-500-budget-shopping-shopee.astro", _page24],
    ["src/pages/blog/support-local-handmade-filipino-products-shopee.astro", _page25],
    ["src/pages/blog/this-week-mobile-games-november-13-2025.astro", _page26],
    ["src/pages/blog/top-10-eco-friendly-sustainable-products-shopee-ph-2025.astro", _page27],
    ["src/pages/blog/top-mobile-games-november-2025.astro", _page28],
    ["src/pages/blog/wellness-self-care-beauty-skincare-essentials-shopee-2025.astro", _page29],
    ["src/pages/blog/[slug].astro", _page30],
    ["src/pages/blog.astro", _page31],
    ["src/pages/bonus.astro", _page32],
    ["src/pages/categories.astro", _page33],
    ["src/pages/contact.astro", _page34],
    ["src/pages/earn.astro", _page35],
    ["src/pages/jokes.astro", _page36],
    ["src/pages/post/[slug].astro", _page37],
    ["src/pages/privacy.astro", _page38],
    ["src/pages/product/[slug].astro", _page39],
    ["src/pages/product-details.astro", _page40],
    ["src/pages/product-details-demo.astro", _page41],
    ["src/pages/products.astro", _page42],
    ["src/pages/sitemap.xml.ts", _page43],
    ["src/pages/terms.astro", _page44],
    ["src/pages/tiktok-viral.astro", _page45],
    ["src/pages/index.astro", _page46]
]);

const _manifest = Object.assign(manifest, {
    pageMap,
    serverIslandMap,
    renderers,
    actions: () => import('./_noop-actions.mjs'),
    middleware: () => import('./_astro-internal_middleware.mjs')
});
const _args = {
    "middlewareSecret": "7194d447-028f-43df-851e-7ee11fd8cfe1",
    "skewProtection": false
};
const _exports = createExports(_manifest, _args);
const __astrojsSsrVirtualEntry = _exports.default;
const _start = 'start';
if (Object.prototype.hasOwnProperty.call(serverEntrypointModule, _start)) ;

export { __astrojsSsrVirtualEntry as default, pageMap };
