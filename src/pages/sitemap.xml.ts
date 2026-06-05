import type { APIRoute } from 'astro';
import { shopeeProducts } from '../lib/shopee-loader';
import { blogPosts } from '../lib/blog-data';

export const GET: APIRoute = async () => {
  const baseUrl = 'https://smartly.sale';
  const today = new Date().toISOString().split('T')[0];

  // Dynamic pages use today's date (SSR renders fresh content); static pages use fixed lastmod
  const staticPages = [
    { url: '',                             priority: '1.0', changefreq: 'daily',   lastmod: today   },
    { url: '/products',                    priority: '0.9', changefreq: 'daily',   lastmod: today   },
    { url: '/blog',                        priority: '0.8', changefreq: 'daily',   lastmod: today   },
    { url: '/categories',                  priority: '0.7', changefreq: 'weekly',  lastmod: today   },
    { url: '/earn-gcash',                  priority: '0.8', changefreq: 'daily',   lastmod: today   },
    { url: '/win-free-phone',              priority: '0.8', changefreq: 'daily',   lastmod: today   },
    { url: '/online-contests-philippines', priority: '0.8', changefreq: 'daily',   lastmod: today   },
    { url: '/free-gift-cards-philippines', priority: '0.8', changefreq: 'daily',   lastmod: today   },
    { url: '/free-mlbb-diamonds',          priority: '0.8', changefreq: 'daily',   lastmod: today   },
    { url: '/free-fire-codes',             priority: '0.8', changefreq: 'daily',   lastmod: today   },
    { url: '/free-robux',                  priority: '0.8', changefreq: 'daily',   lastmod: today   },
    { url: '/free-imvu-credits',           priority: '0.8', changefreq: 'daily',   lastmod: today   },
    { url: '/free-gaming-credits',         priority: '0.8', changefreq: 'daily',   lastmod: today   },
    { url: '/shopee-ai-assistant',         priority: '0.7', changefreq: 'monthly', lastmod: '2026-04-01' },
    { url: '/category/gadgets',            priority: '0.8', changefreq: 'weekly',  lastmod: today   },
    { url: '/category/home-living',        priority: '0.8', changefreq: 'weekly',  lastmod: today   },
    { url: '/category/fashion',            priority: '0.8', changefreq: 'weekly',  lastmod: today   },
    { url: '/category/beauty',             priority: '0.8', changefreq: 'weekly',  lastmod: today   },
    { url: '/category/sports-outdoor',     priority: '0.8', changefreq: 'weekly',  lastmod: today   },
    { url: '/category/food-snacks',        priority: '0.8', changefreq: 'weekly',  lastmod: today   },
    { url: '/about',                       priority: '0.6', changefreq: 'monthly', lastmod: '2026-04-01' },
    { url: '/contact',                     priority: '0.6', changefreq: 'monthly', lastmod: '2026-04-01' },
    { url: '/privacy',                     priority: '0.4', changefreq: 'yearly',  lastmod: '2026-01-15' },
    { url: '/terms',                       priority: '0.4', changefreq: 'yearly',  lastmod: '2026-01-15' },
    { url: '/editorial-policy',            priority: '0.5', changefreq: 'yearly',  lastmod: '2026-04-01' },
    { url: '/faq',                         priority: '0.8', changefreq: 'monthly', lastmod: '2026-04-01' },
    { url: '/shopee-deals-guide',           priority: '0.9', changefreq: 'daily',   lastmod: today   },
    { url: '/shopee-sales-2026',           priority: '0.9', changefreq: 'monthly', lastmod: today   },
    { url: '/earn',                        priority: '0.7', changefreq: 'weekly',  lastmod: today   },
    { url: '/earn/gcash',                  priority: '0.7', changefreq: 'weekly',  lastmod: today   },
    // /jokes and /daily excluded — low-value utility pages, not worth crawl budget
    { url: '/best-deals',                  priority: '0.8', changefreq: 'daily',   lastmod: today   },
    { url: '/tiktok-viral',                priority: '0.7', changefreq: 'weekly',  lastmod: today   },
    // /cheapest-near-me excluded — noindexed page, must not conflict with sitemap
    { url: '/free-robux-philippines',      priority: '0.8', changefreq: 'weekly',  lastmod: today   },
    { url: '/tools',                       priority: '0.7', changefreq: 'monthly', lastmod: '2026-04-01' },
    { url: '/tools/discount-calculator',   priority: '0.7', changefreq: 'monthly', lastmod: '2026-04-01' },
    { url: '/tools/password-generator',    priority: '0.7', changefreq: 'monthly', lastmod: '2026-04-01' },
    { url: '/tools/qr-code',              priority: '0.7', changefreq: 'monthly', lastmod: '2026-04-01' },
    { url: '/tools/word-counter',          priority: '0.7', changefreq: 'monthly', lastmod: '2026-04-01' },
    { url: '/tools/ai-budget-planner',     priority: '0.7', changefreq: 'monthly', lastmod: '2026-04-01' },
    { url: '/tools/ai-review-summarizer',  priority: '0.7', changefreq: 'monthly', lastmod: '2026-04-01' },
    { url: '/tools/cash-tracker',          priority: '0.7', changefreq: 'monthly', lastmod: '2026-04-01' },
    { url: '/tools/json-formatter',        priority: '0.6', changefreq: 'monthly', lastmod: '2026-04-01' },
    { url: '/tools/color-converter',       priority: '0.6', changefreq: 'monthly', lastmod: '2026-04-01' },
    { url: '/tools/base64-image',          priority: '0.6', changefreq: 'monthly', lastmod: '2026-04-01' },
    { url: '/tools/html-entity',           priority: '0.6', changefreq: 'monthly', lastmod: '2026-04-01' },
    { url: '/tools/css-minifier',          priority: '0.6', changefreq: 'monthly', lastmod: '2026-04-01' },
    { url: '/blog/shopee-6-6-mid-year-sale-2026-best-deals-guide', priority: '0.9', changefreq: 'daily', lastmod: today },
    { url: '/blog/best-budget-phones-under-5000-shopee-philippines-2026', priority: '0.8', changefreq: 'weekly', lastmod: today },
    // Programmatic deal pages by price bracket
    { url: '/deals',              priority: '0.8', changefreq: 'daily', lastmod: today },
    { url: '/deals/under-100',    priority: '0.8', changefreq: 'daily', lastmod: today },
    { url: '/deals/under-200',    priority: '0.8', changefreq: 'daily', lastmod: today },
    { url: '/deals/under-500',    priority: '0.8', changefreq: 'daily', lastmod: today },
    { url: '/deals/under-1000',   priority: '0.8', changefreq: 'daily', lastmod: today },
    { url: '/deals/under-2000',   priority: '0.8', changefreq: 'daily', lastmod: today },
    { url: '/deals/under-5000',   priority: '0.8', changefreq: 'daily', lastmod: today },
    // RSS feed for discovery
    { url: '/feed.xml',           priority: '0.3', changefreq: 'daily', lastmod: today },
  ];

  const staticXml = staticPages.map(page => `  <url>
    <loc>${baseUrl}${page.url}</loc>
    <lastmod>${page.lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('\n');

  const productXml = shopeeProducts
    .filter(item => !item.fieldData._draft && !item.fieldData._archived)
    .map(item => {
      const slug = item.fieldData.slug;
      const updatedOn = item.fieldData['updated-on'] ?? item.fieldData['published-on'];
      const lastmod = updatedOn ? updatedOn.split('T')[0] : today;
      const name = item.fieldData.name ?? '';
      const imageUrl = item.fieldData['main-image']?.url ?? item.fieldData['image-url'] ?? '';
      const imageTag = imageUrl ? `
    <image:image>
      <image:loc>${imageUrl.replace(/&/g, '&amp;').replace(/</g, '&lt;')}</image:loc>
      <image:title>${name.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</image:title>
    </image:image>` : '';
      return `  <url>
    <loc>${baseUrl}/product/${slug}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>${imageTag}
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
    // Shopping/deals content gets highest priority (money pages supporting pillar)
    const cat = ((post as any).category ?? '').toLowerCase();
    const wc  = (post as any).wordCount ?? 0;
    let priority = '0.7';
    if (cat.includes('shopping') || cat.includes('deal') || cat.includes('buying') || cat.includes('product-review') || cat.includes('budget')) priority = '0.8';
    else if (cat.includes('gaming') || cat.includes('game')) priority = '0.7';
    else if (wc < 800) priority = '0.6';
    const imgUrl = post.featuredImage ?? '';
    const imgTag = imgUrl ? `
    <image:image>
      <image:loc>${imgUrl.replace(/&/g, '&amp;').replace(/</g, '&lt;')}</image:loc>
      <image:title>${(post.title ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</image:title>
    </image:image>` : '';
    return `  <url>
    <loc>${baseUrl}${path}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${priority}</priority>${imgTag}
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
