globalThis.process ??= {}; globalThis.process.env ??= {};
import { r as renderers } from './chunks/_@astro-renderers_DuI-Zzmn.mjs';
import { c as createExports, s as serverEntrypointModule } from './chunks/_@astrojs-ssr-adapter_Bd76XzgX.mjs';
import { manifest } from './manifest_BxviPDdU.mjs';

const serverIslandMap = new Map();;

const _page0 = () => import('./pages/_image.astro.mjs');
const _page1 = () => import('./pages/about.astro.mjs');
const _page2 = () => import('./pages/api/cms/products/_productid_.astro.mjs');
const _page3 = () => import('./pages/api/cms/products.astro.mjs');
const _page4 = () => import('./pages/api/cms/test.astro.mjs');
const _page5 = () => import('./pages/blog.astro.mjs');
const _page6 = () => import('./pages/categories.astro.mjs');
const _page7 = () => import('./pages/contact.astro.mjs');
const _page8 = () => import('./pages/post/_slug_.astro.mjs');
const _page9 = () => import('./pages/privacy.astro.mjs');
const _page10 = () => import('./pages/product/_slug_.astro.mjs');
const _page11 = () => import('./pages/products.astro.mjs');
const _page12 = () => import('./pages/terms.astro.mjs');
const _page13 = () => import('./pages/index.astro.mjs');
const pageMap = new Map([
    ["node_modules/@astrojs/cloudflare/dist/entrypoints/image-endpoint.js", _page0],
    ["src/pages/about.astro", _page1],
    ["src/pages/api/cms/products/[productId].ts", _page2],
    ["src/pages/api/cms/products.ts", _page3],
    ["src/pages/api/cms/test.ts", _page4],
    ["src/pages/blog.astro", _page5],
    ["src/pages/categories.astro", _page6],
    ["src/pages/contact.astro", _page7],
    ["src/pages/post/[slug].astro", _page8],
    ["src/pages/privacy.astro", _page9],
    ["src/pages/product/[slug].astro", _page10],
    ["src/pages/products.astro", _page11],
    ["src/pages/terms.astro", _page12],
    ["src/pages/index.astro", _page13]
]);

const _manifest = Object.assign(manifest, {
    pageMap,
    serverIslandMap,
    renderers,
    actions: () => import('./_noop-actions.mjs'),
    middleware: () => import('./_astro-internal_middleware.mjs')
});
const _args = undefined;
const _exports = createExports(_manifest);
const __astrojsSsrVirtualEntry = _exports.default;
const _start = 'start';
if (Object.prototype.hasOwnProperty.call(serverEntrypointModule, _start)) {
	serverEntrypointModule[_start](_manifest, _args);
}

export { __astrojsSsrVirtualEntry as default, pageMap };
