import 'kleur/colors';
import { o as decodeKey } from './chunks/astro/server_B_OFuUZx.mjs';
import 'clsx';
import 'cookie';
import './chunks/astro-designed-error-pages_BWI6uBTk.mjs';
import 'es-module-lexer';
import { N as NOOP_MIDDLEWARE_FN } from './chunks/noop-middleware_DYmVJhEu.mjs';

function sanitizeParams(params) {
  return Object.fromEntries(
    Object.entries(params).map(([key, value]) => {
      if (typeof value === "string") {
        return [key, value.normalize().replace(/#/g, "%23").replace(/\?/g, "%3F")];
      }
      return [key, value];
    })
  );
}
function getParameter(part, params) {
  if (part.spread) {
    return params[part.content.slice(3)] || "";
  }
  if (part.dynamic) {
    if (!params[part.content]) {
      throw new TypeError(`Missing parameter: ${part.content}`);
    }
    return params[part.content];
  }
  return part.content.normalize().replace(/\?/g, "%3F").replace(/#/g, "%23").replace(/%5B/g, "[").replace(/%5D/g, "]");
}
function getSegment(segment, params) {
  const segmentPath = segment.map((part) => getParameter(part, params)).join("");
  return segmentPath ? "/" + segmentPath : "";
}
function getRouteGenerator(segments, addTrailingSlash) {
  return (params) => {
    const sanitizedParams = sanitizeParams(params);
    let trailing = "";
    if (addTrailingSlash === "always" && segments.length) {
      trailing = "/";
    }
    const path = segments.map((segment) => getSegment(segment, sanitizedParams)).join("") + trailing;
    return path || "/";
  };
}

function deserializeRouteData(rawRouteData) {
  return {
    route: rawRouteData.route,
    type: rawRouteData.type,
    pattern: new RegExp(rawRouteData.pattern),
    params: rawRouteData.params,
    component: rawRouteData.component,
    generate: getRouteGenerator(rawRouteData.segments, rawRouteData._meta.trailingSlash),
    pathname: rawRouteData.pathname || void 0,
    segments: rawRouteData.segments,
    prerender: rawRouteData.prerender,
    redirect: rawRouteData.redirect,
    redirectRoute: rawRouteData.redirectRoute ? deserializeRouteData(rawRouteData.redirectRoute) : void 0,
    fallbackRoutes: rawRouteData.fallbackRoutes.map((fallback) => {
      return deserializeRouteData(fallback);
    }),
    isIndex: rawRouteData.isIndex,
    origin: rawRouteData.origin
  };
}

function deserializeManifest(serializedManifest) {
  const routes = [];
  for (const serializedRoute of serializedManifest.routes) {
    routes.push({
      ...serializedRoute,
      routeData: deserializeRouteData(serializedRoute.routeData)
    });
    const route = serializedRoute;
    route.routeData = deserializeRouteData(serializedRoute.routeData);
  }
  const assets = new Set(serializedManifest.assets);
  const componentMetadata = new Map(serializedManifest.componentMetadata);
  const inlinedScripts = new Map(serializedManifest.inlinedScripts);
  const clientDirectives = new Map(serializedManifest.clientDirectives);
  const serverIslandNameMap = new Map(serializedManifest.serverIslandNameMap);
  const key = decodeKey(serializedManifest.key);
  return {
    // in case user middleware exists, this no-op middleware will be reassigned (see plugin-ssr.ts)
    middleware() {
      return { onRequest: NOOP_MIDDLEWARE_FN };
    },
    ...serializedManifest,
    assets,
    componentMetadata,
    inlinedScripts,
    clientDirectives,
    routes,
    serverIslandNameMap,
    key
  };
}

const manifest = deserializeManifest({"hrefRoot":"file:///app/","cacheDir":"file:///app/node_modules/.astro/","outDir":"file:///app/dist/","srcDir":"file:///app/src/","publicDir":"file:///app/public/","buildClientDir":"file:///app/dist/client/","buildServerDir":"file:///app/dist/server/","adapterName":"@astrojs/vercel","routes":[{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"page","component":"_server-islands.astro","params":["name"],"segments":[[{"content":"_server-islands","dynamic":false,"spread":false}],[{"content":"name","dynamic":true,"spread":false}]],"pattern":"^\\/_server-islands\\/([^/]+?)\\/?$","prerender":false,"isIndex":false,"fallbackRoutes":[],"route":"/_server-islands/[name]","origin":"internal","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_image","pattern":"^\\/_image\\/?$","segments":[[{"content":"_image","dynamic":false,"spread":false}]],"params":[],"component":"node_modules/astro/dist/assets/endpoint/generic.js","pathname":"/_image","prerender":false,"fallbackRoutes":[],"origin":"internal","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[{"type":"external","src":"/_astro/about.tPyTOJQx.css"}],"routeData":{"route":"/about","isIndex":false,"type":"page","pattern":"^\\/about\\/?$","segments":[[{"content":"about","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/about.astro","pathname":"/about","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/api/cms/products/[productid]","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/cms\\/products\\/([^/]+?)\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"cms","dynamic":false,"spread":false}],[{"content":"products","dynamic":false,"spread":false}],[{"content":"productId","dynamic":true,"spread":false}]],"params":["productId"],"component":"src/pages/api/cms/products/[productId].ts","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/api/cms/products","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/cms\\/products\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"cms","dynamic":false,"spread":false}],[{"content":"products","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/cms/products.ts","pathname":"/api/cms/products","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/api/cms/test","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/cms\\/test\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"cms","dynamic":false,"spread":false}],[{"content":"test","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/cms/test.ts","pathname":"/api/cms/test","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[{"type":"external","src":"/_astro/about.tPyTOJQx.css"}],"routeData":{"route":"/blog","isIndex":false,"type":"page","pattern":"^\\/blog\\/?$","segments":[[{"content":"blog","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/blog.astro","pathname":"/blog","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[{"type":"external","src":"/_astro/about.tPyTOJQx.css"}],"routeData":{"route":"/categories","isIndex":false,"type":"page","pattern":"^\\/categories\\/?$","segments":[[{"content":"categories","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/categories.astro","pathname":"/categories","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[{"type":"external","src":"/_astro/about.tPyTOJQx.css"}],"routeData":{"route":"/contact","isIndex":false,"type":"page","pattern":"^\\/contact\\/?$","segments":[[{"content":"contact","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/contact.astro","pathname":"/contact","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[{"type":"external","src":"/_astro/about.tPyTOJQx.css"}],"routeData":{"route":"/post/[slug]","isIndex":false,"type":"page","pattern":"^\\/post\\/([^/]+?)\\/?$","segments":[[{"content":"post","dynamic":false,"spread":false}],[{"content":"slug","dynamic":true,"spread":false}]],"params":["slug"],"component":"src/pages/post/[slug].astro","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[{"type":"external","src":"/_astro/about.tPyTOJQx.css"}],"routeData":{"route":"/privacy","isIndex":false,"type":"page","pattern":"^\\/privacy\\/?$","segments":[[{"content":"privacy","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/privacy.astro","pathname":"/privacy","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[{"type":"external","src":"/_astro/about.tPyTOJQx.css"}],"routeData":{"route":"/product/[slug]","isIndex":false,"type":"page","pattern":"^\\/product\\/([^/]+?)\\/?$","segments":[[{"content":"product","dynamic":false,"spread":false}],[{"content":"slug","dynamic":true,"spread":false}]],"params":["slug"],"component":"src/pages/product/[slug].astro","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[{"type":"external","src":"/_astro/about.tPyTOJQx.css"}],"routeData":{"route":"/products","isIndex":false,"type":"page","pattern":"^\\/products\\/?$","segments":[[{"content":"products","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/products.astro","pathname":"/products","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[{"type":"external","src":"/_astro/about.tPyTOJQx.css"}],"routeData":{"route":"/terms","isIndex":false,"type":"page","pattern":"^\\/terms\\/?$","segments":[[{"content":"terms","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/terms.astro","pathname":"/terms","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[{"type":"external","src":"/_astro/about.tPyTOJQx.css"}],"routeData":{"route":"/","isIndex":true,"type":"page","pattern":"^\\/$","segments":[],"params":[],"component":"src/pages/index.astro","pathname":"/","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}}],"base":"/","trailingSlash":"ignore","compressHTML":true,"componentMetadata":[["/app/src/pages/about.astro",{"propagation":"none","containsHead":true}],["/app/src/pages/blog.astro",{"propagation":"none","containsHead":true}],["/app/src/pages/categories.astro",{"propagation":"none","containsHead":true}],["/app/src/pages/contact.astro",{"propagation":"none","containsHead":true}],["/app/src/pages/index.astro",{"propagation":"none","containsHead":true}],["/app/src/pages/post/[slug].astro",{"propagation":"none","containsHead":true}],["/app/src/pages/privacy.astro",{"propagation":"none","containsHead":true}],["/app/src/pages/product/[slug].astro",{"propagation":"none","containsHead":true}],["/app/src/pages/products.astro",{"propagation":"none","containsHead":true}],["/app/src/pages/terms.astro",{"propagation":"none","containsHead":true}]],"renderers":[],"clientDirectives":[["idle","(()=>{var l=(n,t)=>{let i=async()=>{await(await n())()},e=typeof t.value==\"object\"?t.value:void 0,s={timeout:e==null?void 0:e.timeout};\"requestIdleCallback\"in window?window.requestIdleCallback(i,s):setTimeout(i,s.timeout||200)};(self.Astro||(self.Astro={})).idle=l;window.dispatchEvent(new Event(\"astro:idle\"));})();"],["load","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).load=e;window.dispatchEvent(new Event(\"astro:load\"));})();"],["media","(()=>{var n=(a,t)=>{let i=async()=>{await(await a())()};if(t.value){let e=matchMedia(t.value);e.matches?i():e.addEventListener(\"change\",i,{once:!0})}};(self.Astro||(self.Astro={})).media=n;window.dispatchEvent(new Event(\"astro:media\"));})();"],["only","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).only=e;window.dispatchEvent(new Event(\"astro:only\"));})();"],["visible","(()=>{var a=(s,i,o)=>{let r=async()=>{await(await s())()},t=typeof i.value==\"object\"?i.value:void 0,c={rootMargin:t==null?void 0:t.rootMargin},n=new IntersectionObserver(e=>{for(let l of e)if(l.isIntersecting){n.disconnect(),r();break}},c);for(let e of o.children)n.observe(e)};(self.Astro||(self.Astro={})).visible=a;window.dispatchEvent(new Event(\"astro:visible\"));})();"]],"entryModules":{"\u0000astro-internal:middleware":"_astro-internal_middleware.mjs","\u0000noop-actions":"_noop-actions.mjs","\u0000@astro-page:src/pages/about@_@astro":"pages/about.astro.mjs","\u0000@astro-page:src/pages/api/cms/products/[productId]@_@ts":"pages/api/cms/products/_productid_.astro.mjs","\u0000@astro-page:src/pages/api/cms/products@_@ts":"pages/api/cms/products.astro.mjs","\u0000@astro-page:src/pages/api/cms/test@_@ts":"pages/api/cms/test.astro.mjs","\u0000@astro-page:src/pages/blog@_@astro":"pages/blog.astro.mjs","\u0000@astro-page:src/pages/categories@_@astro":"pages/categories.astro.mjs","\u0000@astro-page:src/pages/contact@_@astro":"pages/contact.astro.mjs","\u0000@astro-page:src/pages/post/[slug]@_@astro":"pages/post/_slug_.astro.mjs","\u0000@astro-page:src/pages/privacy@_@astro":"pages/privacy.astro.mjs","\u0000@astro-page:src/pages/product/[slug]@_@astro":"pages/product/_slug_.astro.mjs","\u0000@astro-page:src/pages/products@_@astro":"pages/products.astro.mjs","\u0000@astro-page:src/pages/terms@_@astro":"pages/terms.astro.mjs","\u0000@astro-page:src/pages/index@_@astro":"pages/index.astro.mjs","\u0000@astrojs-ssr-virtual-entry":"entry.mjs","\u0000@astro-renderers":"renderers.mjs","\u0000@astro-page:node_modules/astro/dist/assets/endpoint/generic@_@js":"pages/_image.astro.mjs","\u0000@astrojs-ssr-adapter":"_@astrojs-ssr-adapter.mjs","\u0000@astrojs-manifest":"manifest_DDihELgV.mjs","/app/node_modules/astro/dist/assets/services/sharp.js":"chunks/sharp_DYLCc6Gq.mjs","/app/src/components/BlogList":"_astro/BlogList.DeR70Mog.js","/app/src/components/CategoryGrid":"_astro/CategoryGrid.BgxCk3xP.js","/app/src/components/ContactForm":"_astro/ContactForm.CA5thGSn.js","/app/src/components/PostContent":"_astro/PostContent.BwhlXI8J.js","/app/src/components/ProductDetail":"_astro/ProductDetail.CfpRO3I7.js","/app/src/components/AllProductsList":"_astro/AllProductsList.D3LIZRBw.js","/app/src/components/Hero":"_astro/Hero.CxabaTD5.js","/app/src/components/FeaturedProducts":"_astro/FeaturedProducts.DGAiEF__.js","/app/src/components/WhyChooseUs":"_astro/WhyChooseUs.BKDmSgIj.js","/app/src/components/HowItWorks":"_astro/HowItWorks.B8pO_WrS.js","/app/src/components/TrustIndicators":"_astro/TrustIndicators.aaf1sN8F.js","/app/src/components/Newsletter":"_astro/Newsletter.Dd_AXbgQ.js","/app/src/components/Navbar":"_astro/Navbar.BJY4mIG9.js","/app/src/components/Footer":"_astro/Footer.Cd2kaylZ.js","@astrojs/react/client.js":"_astro/client.D2WMwoKK.js","astro:scripts/before-hydration.js":""},"inlinedScripts":[],"assets":["/_astro/about.tPyTOJQx.css","/favicon.ico","/_astro/AllProductsList.D3LIZRBw.js","/_astro/BlogList.DeR70Mog.js","/_astro/CategoryGrid.BgxCk3xP.js","/_astro/ContactForm.CA5thGSn.js","/_astro/FeaturedProducts.DGAiEF__.js","/_astro/Footer.Cd2kaylZ.js","/_astro/Hero.CxabaTD5.js","/_astro/HowItWorks.B8pO_WrS.js","/_astro/Navbar.BJY4mIG9.js","/_astro/Newsletter.Dd_AXbgQ.js","/_astro/PostContent.BwhlXI8J.js","/_astro/ProductDetail.CfpRO3I7.js","/_astro/TrustIndicators.aaf1sN8F.js","/_astro/WhyChooseUs.BKDmSgIj.js","/_astro/base-url.DVjYrgnb.js","/_astro/calendar.DaglYBx2.js","/_astro/client.D2WMwoKK.js","/_astro/clock.yzeEU3jt.js","/_astro/createLucideIcon.9Ba1PYor.js","/_astro/external-link.DaFhyQvp.js","/_astro/eye.-UYQ0fWG.js","/_astro/index.RH_Wq4ov.js","/_astro/product.CBRk_9LV.js","/_astro/search.OG2Vyx6o.js","/_astro/send.JsKkL9zs.js","/_astro/shopping-bag.Dsyaiulm.js","/_astro/star.CrJF5TtN.js","/_astro/trending-up.D_WhSMMB.js","/_astro/x.CfUYmgah.js"],"buildFormat":"directory","checkOrigin":true,"serverIslandNameMap":[],"key":"ATEXx0tJjl4Dd4IEtoPan7FOM6Z2JrAcx5Xj5GEvHoU="});
if (manifest.sessionConfig) manifest.sessionConfig.driverModule = null;

export { manifest };
