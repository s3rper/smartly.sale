import type { APIRoute } from 'astro';
import { fetchProductsFromWebflow } from '../lib/products';
import { blogPosts } from '../lib/blog-data';

export const GET: APIRoute = async ({ locals }) => {
  const baseUrl = 'https://smartly.sale';
  const today = new Date().toISOString().split('T')[0];

  const staticPages = [
    { url: '',                             priority: '1.0', changefreq: 'daily'   },
    { url: '/products',                    priority: '0.9', changefreq: 'daily'   },
    { url: '/blog',                        priority: '0.8', changefreq: 'daily'   },
    { url: '/categories',                  priority: '0.7', changefreq: 'weekly'  },
    { url: '/earn-gcash',                  priority: '0.8', changefreq: 'daily'   },
    { url: '/win-free-phone',              priority: '0.8', changefreq: 'daily'   },
    { url: '/online-contests-philippines', priority: '0.8', changefreq: 'daily'   },
    { url: '/free-gift-cards-philippines', priority: '0.8', changefreq: 'daily'   },
    { url: '/free-mlbb-diamonds',          priority: '0.8', changefreq: 'daily'   },
    { url: '/free-fire-codes',             priority: '0.8', changefreq: 'daily'   },
    { url: '/free-robux-philippines',      priority: '0.8', changefreq: 'daily'   },
    { url: '/free-gaming-credits',         priority: '0.8', changefreq: 'daily'   },
    { url: '/cheapest-near-me',            priority: '0.7', changefreq: 'weekly'  },
    { url: '/about',                       priority: '0.6', changefreq: 'monthly' },
    { url: '/contact',                     priority: '0.6', changefreq: 'monthly' },
    { url: '/privacy',                     priority: '0.4', changefreq: 'yearly'  },
    { url: '/terms',                       priority: '0.4', changefreq: 'yearly'  },
  ];

  // Fetch live products for dynamic URLs
  let productUrls: { slug: string; updatedOn?: string }[] = [];
  try {
    const runtime = (locals as any)?.runtime;
    const token = runtime?.env?.WEBFLOW_CMS_SITE_API_TOKEN ||
                  (import.meta as any).env?.WEBFLOW_CMS_SITE_API_TOKEN;
    if (token) {
      const apiBaseUrl = runtime?.env?.WEBFLOW_API_HOST ||
                         (import.meta as any).env?.WEBFLOW_API_HOST;
      const data = await fetchProductsFromWebflow(token, 100, 0, apiBaseUrl);
      productUrls = (data.items ?? [])
        .filter(item => !item.fieldData._draft && !item.fieldData._archived)
        .map(item => ({
          slug: item.fieldData.slug,
          updatedOn: item.fieldData['updated-on'] ?? item.fieldData['published-on']
        }));
    }
  } catch (_e) {
    // Proceed without product URLs if fetch fails
  }

  const staticXml = staticPages.map(page => `  <url>
    <loc>${baseUrl}${page.url}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('\n');

  const productXml = productUrls.map(({ slug, updatedOn }) => {
    const lastmod = updatedOn ? updatedOn.split('T')[0] : today;
    return `  <url>
    <loc>${baseUrl}/product/${slug}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`;
  }).join('\n');

  // Generated posts live at /post/slug; hardcoded posts live at /blog/slug
  const blogXml = blogPosts.map(post => {
    const path    = (post as any).generated ? `/post/${post.slug}` : `/blog/${post.slug}`;
    const lastmod = post.publishDate ? post.publishDate.split('T')[0] : today;
    return `  <url>
    <loc>${baseUrl}${path}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`;
  }).join('\n');

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${staticXml}
${productXml}
${blogXml}
</urlset>`;

  return new Response(sitemap, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400'
    }
  });
};
