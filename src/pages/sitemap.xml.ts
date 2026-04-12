import type { APIRoute } from 'astro';
import { shopeeProducts } from '../lib/shopee-loader';
import { blogPosts } from '../lib/blog-data';

export const GET: APIRoute = async () => {
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
    { url: '/free-robux',                  priority: '0.8', changefreq: 'daily'   },
    { url: '/free-imvu-credits',           priority: '0.8', changefreq: 'daily'   },
    { url: '/free-gaming-credits',         priority: '0.8', changefreq: 'daily'   },
    { url: '/shopee-ai-assistant',         priority: '0.7', changefreq: 'monthly' },
    { url: '/category/gadgets',            priority: '0.8', changefreq: 'weekly'  },
    { url: '/category/home-living',        priority: '0.8', changefreq: 'weekly'  },
    { url: '/category/fashion',            priority: '0.8', changefreq: 'weekly'  },
    { url: '/category/beauty',             priority: '0.8', changefreq: 'weekly'  },
    { url: '/category/sports-outdoor',     priority: '0.8', changefreq: 'weekly'  },
    { url: '/category/food-snacks',        priority: '0.8', changefreq: 'weekly'  },
    { url: '/about',                       priority: '0.6', changefreq: 'monthly' },
    { url: '/contact',                     priority: '0.6', changefreq: 'monthly' },
    { url: '/privacy',                     priority: '0.4', changefreq: 'yearly'  },
    { url: '/terms',                       priority: '0.4', changefreq: 'yearly'  },
    { url: '/editorial-policy',            priority: '0.4', changefreq: 'yearly'  },
  ];

  // Use all shopee products directly — bypasses the old 100-item limit
  const productUrls = shopeeProducts
    .filter(item => !item.fieldData._draft && !item.fieldData._archived)
    .map(item => ({
      slug: item.fieldData.slug,
      updatedOn: item.fieldData['updated-on'] ?? item.fieldData['published-on']
    }));

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
  // Exclude thin generated posts (noindexed) from sitemap — saves crawl budget
  const indexablePosts = blogPosts.filter(post => {
    const isGenerated = (post as any).generated === true;
    const wc = (post as any).wordCount ?? 0;
    return !(isGenerated && wc < 600);
  });

  const blogXml = indexablePosts.map(post => {
    const path    = (post as any).generated ? `/post/${post.slug}` : `/blog/${post.slug}`;
    const lastmod = today; // SSR renders today's date = always fresh for Google
    // Differentiate priority by category and content depth
    const cat = ((post as any).category ?? '').toLowerCase();
    const wc  = (post as any).wordCount ?? 0;
    let priority = '0.7';
    if (cat.includes('gaming') || cat.includes('game')) priority = '0.8';
    else if (wc < 800) priority = '0.6';
    return `  <url>
    <loc>${baseUrl}${path}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${priority}</priority>
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
