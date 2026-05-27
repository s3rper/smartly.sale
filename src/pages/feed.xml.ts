import type { APIRoute } from 'astro';
import { blogPosts } from '../lib/blog-data';

export const GET: APIRoute = async () => {
  const baseUrl = 'https://smartly.sale';
  const now = new Date().toUTCString();

  // Sort by publish date descending, take latest 30
  const sorted = [...blogPosts]
    .sort((a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime())
    .slice(0, 30);

  const items = sorted.map(post => {
    const isGenerated = (post as any).generated === true;
    const path = isGenerated ? `/post/${post.slug}` : `/blog/${post.slug}`;
    const pubDate = new Date(post.publishDate).toUTCString();
    const title = escXml(post.title);
    const desc = escXml(post.excerpt || post.metaDescription);
    const img = post.featuredImage
      ? `<enclosure url="${escXml(post.featuredImage)}" type="image/jpeg" length="0" />`
      : '';

    return `    <item>
      <title>${title}</title>
      <link>${baseUrl}${path}</link>
      <guid isPermaLink="true">${baseUrl}${path}</guid>
      <pubDate>${pubDate}</pubDate>
      <description>${desc}</description>
      <category>${escXml(post.category)}</category>
      <author>team@smartly.sale (${escXml(post.author)})</author>
      ${img}
    </item>`;
  }).join('\n');

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"
     xmlns:atom="http://www.w3.org/2005/Atom"
     xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>smartly.sale - Shopee Deals &amp; Guides Philippines</title>
    <link>${baseUrl}</link>
    <description>Discover trending Shopee products, viral finds, budget gadgets, and exclusive deals in the Philippines. Smart shopping made easy.</description>
    <language>en-ph</language>
    <lastBuildDate>${now}</lastBuildDate>
    <atom:link href="${baseUrl}/feed.xml" rel="self" type="application/rss+xml" />
    <image>
      <url>${baseUrl}/og-image.jpg</url>
      <title>smartly.sale</title>
      <link>${baseUrl}</link>
      <width>144</width>
      <height>144</height>
    </image>
    <ttl>60</ttl>
${items}
  </channel>
</rss>`;

  return new Response(rss, {
    status: 200,
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
};

function escXml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}
