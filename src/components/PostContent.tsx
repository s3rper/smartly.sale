import React, { useEffect, useState, useRef } from 'react';
import { Calendar, Clock, Share2, ChevronUp, Tag } from 'lucide-react';

interface Post {
  title: string;
  excerpt: string;
  featuredImage: string;
  featuredImageAlt?: string;
  category: string;
  publishDate: string;
  readTime?: number;
  readingTime?: number;
  content: string;
  author?: string;
  tags?: string[];
  faqs?: { q: string; a: string }[];
}

const PostContent: React.FC<{ post: Post }> = ({ post }) => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showBackTop, setShowBackTop] = useState(false);
  const [copied, setCopied] = useState(false);
  const articleRef = useRef<HTMLDivElement>(null);

  const readTime = post.readingTime || post.readTime || 5;

  useEffect(() => {
    const onScroll = () => {
      const el = articleRef.current;
      if (!el) return;
      const scrolled = window.scrollY;
      const total = el.offsetTop + el.offsetHeight - window.innerHeight;
      setScrollProgress(Math.min(100, Math.max(0, (scrolled / total) * 100)));
      setShowBackTop(scrolled > 600);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({ title: post.title, text: post.excerpt, url: window.location.href });
    } else {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const formattedDate = new Date(post.publishDate).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
  });

  const categoryLabel = post.category
    ? post.category.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
    : 'Gaming';

  return (
    <>
      {/* Reading progress bar */}
      <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-black/10">
        <div
          className="h-full transition-all duration-100"
          style={{ width: `${scrollProgress}%`, background: 'linear-gradient(90deg, #f97316, #ea580c)' }}
        />
      </div>

      <article ref={articleRef}>
        {/* ── Hero ── aspect-ratio reserves space before image loads, preventing CLS */}
        <div className="relative w-full overflow-hidden" style={{ aspectRatio: '21/9', maxHeight: '520px' }}>
          <img
            src={post.featuredImage}
            alt={post.featuredImageAlt || post.title}
            className="absolute inset-0 w-full h-full object-cover"
            fetchPriority="high"
            decoding="async"
            style={{ objectPosition: 'center' }}
          />
          {/* Gradient overlay */}
          <div
            className="absolute inset-0"
            style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.45) 55%, rgba(0,0,0,0.1) 100%)' }}
          />
          {/* Hero text */}
          <div className="absolute bottom-0 left-0 right-0 px-6 py-8 md:px-12 md:py-10 max-w-5xl mx-auto w-full">
            <span
              className="inline-block text-white text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-4"
              style={{ background: '#f97316' }}
            >
              {categoryLabel}
            </span>
            <h1 className="text-3xl md:text-5xl font-bold text-white leading-tight drop-shadow-lg">
              {post.title}
            </h1>
          </div>
        </div>

        {/* ── Meta bar ── */}
        <div className="border-b border-border bg-card">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              {post.author && (
                <div className="flex items-center gap-2">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                    style={{ background: '#f97316' }}
                  >
                    {post.author.charAt(0)}
                  </div>
                  <span className="font-medium text-foreground">{post.author}</span>
                </div>
              )}
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                <span>{formattedDate}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                <span>{readTime} min read</span>
              </div>
            </div>

            <button
              onClick={handleShare}
              className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border border-border hover:bg-muted transition-colors"
            >
              <Share2 className="w-4 h-4" />
              {copied ? 'Copied!' : 'Share'}
            </button>
          </div>
        </div>

        {/* ── Excerpt ── */}
        {post.excerpt && (
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
            <p
              className="text-lg md:text-xl text-muted-foreground leading-relaxed border-l-4 pl-5 italic"
              style={{ borderColor: '#f97316' }}
            >
              {post.excerpt}
            </p>
          </div>
        )}

        {/* ── Article body ── */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16">
          <div
            className="article-content"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* ── Shopee affiliate banner ── */}
          <div className="my-8 rounded-2xl border border-orange-200 bg-gradient-to-r from-orange-50 to-amber-50 p-4 flex items-center gap-4 shadow-sm">
            <span className="text-3xl flex-shrink-0">🛍️</span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-800 mb-0.5">Shop the products mentioned in this article</p>
              <p className="text-xs text-gray-500">Best prices · Fast shipping · Authentic items on Shopee</p>
            </div>
            <a
              href={`https://shopee.ph/search?keyword=${encodeURIComponent(post.tags?.[0] ?? 'Philippines')}&af_id=13391000172&af_siteid=smartly_sale&smtt=1`}
              target="_blank"
              rel="noopener noreferrer sponsored"
              className="flex-shrink-0 inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-white text-xs font-bold hover:opacity-90 transition-opacity whitespace-nowrap"
              style={{ background: '#ee4d2d' }}
            >
              Shop Now →
            </a>
          </div>

          {/* ── FAQs (if separate from content) ── */}
          {post.faqs && post.faqs.length > 0 && (
            <section className="mt-12 pt-10 border-t border-border">
              <h2 className="text-2xl font-bold text-foreground mb-6">Frequently Asked Questions</h2>
              <div className="space-y-3">
                {post.faqs.map((faq, i) => (
                  <details
                    key={i}
                    className="group rounded-xl border border-border overflow-hidden"
                  >
                    <summary className="flex items-center justify-between gap-4 px-5 py-4 cursor-pointer font-semibold text-foreground hover:bg-muted transition-colors list-none">
                      <span>{faq.q}</span>
                      <ChevronUp className="w-4 h-4 text-muted-foreground flex-shrink-0 rotate-180 group-open:rotate-0 transition-transform duration-200" />
                    </summary>
                    <div className="px-5 pb-4 pt-1 text-muted-foreground leading-relaxed border-t border-border bg-muted/30">
                      {faq.a}
                    </div>
                  </details>
                ))}
              </div>
            </section>
          )}

          {/* ── Tags ── */}
          {post.tags && post.tags.length > 0 && (
            <div className="mt-10 pt-8 border-t border-border flex flex-wrap items-center gap-2">
              <Tag className="w-4 h-4 text-muted-foreground" />
              {post.tags.map(tag => (
                <span
                  key={tag}
                  className="px-3 py-1 rounded-full text-sm font-medium bg-muted text-muted-foreground hover:bg-orange-100 hover:text-orange-700 transition-colors cursor-default"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* ── Share ── */}
          <div className="mt-10 pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm font-medium text-muted-foreground">Enjoyed this article? Share it!</p>
            <button
              onClick={handleShare}
              className="flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-semibold text-white transition-opacity hover:opacity-90"
              style={{ background: '#f97316' }}
            >
              <Share2 className="w-4 h-4" />
              {copied ? 'Link Copied!' : 'Share Article'}
            </button>
          </div>

          {/* ── Author bio ── */}
          {post.author && (
            <div className="mt-12 rounded-2xl border border-border bg-card p-6 md:p-8 flex gap-5">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center text-white text-2xl font-bold flex-shrink-0"
                style={{ background: 'linear-gradient(135deg, #f97316, #ea580c)' }}
              >
                {post.author.charAt(0)}
              </div>
              <div>
                <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">Written by</p>
                <h3 className="text-lg font-bold text-foreground mb-2">{post.author}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Gaming journalist and deals expert covering the latest in gaming news, tips, and
                  free-to-play opportunities for Filipino gamers and beyond.
                </p>
              </div>
            </div>
          )}
        </div>
      </article>

      {/* ── Back to top ── */}
      {showBackTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-6 right-6 z-40 w-11 h-11 rounded-full shadow-lg flex items-center justify-center text-white transition-all hover:scale-110"
          style={{ background: '#f97316' }}
          aria-label="Back to top"
        >
          <ChevronUp className="w-5 h-5" />
        </button>
      )}
    </>
  );
};

export default PostContent;
