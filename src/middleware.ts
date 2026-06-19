import type {MiddlewareHandler} from 'astro';

export const onRequest: MiddlewareHandler = async (ctx, next) => {
  const {request} = ctx;
  const url = new URL(request.url);

  // Canonical domain enforcement: redirect www → non-www so Google only indexes one version.
  // All canonical tags use https://smartly.sale (no www), so this keeps them consistent.
  if (url.hostname === 'www.smartly.sale') {
    const canonical = new URL(url);
    canonical.hostname = 'smartly.sale';
    return Response.redirect(canonical.toString(), 301);
  }

  if (import.meta.env.DEV && url.pathname === '/-wf/ready') {
    const resHeaders = new Headers({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    });

    return new Response(JSON.stringify({ready: true}), {
      headers: resHeaders,
    });
  }

  return next();
};
