import React from 'react';
import { Calendar, Clock, Share2 } from 'lucide-react';

interface PostContentProps {
  post: {
    title: string;
    excerpt: string;
    featuredImage: string;
    featuredImageAlt?: string;
    category: string;
    publishDate: string;
    readTime: number;
    content: string;
    author?: string;
  };
}

const PostContent: React.FC<PostContentProps> = ({ post }) => {
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: post.title,
        text: post.excerpt,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  return (
    <article className="py-8">
      {/* Featured Image */}
      <div className="w-full aspect-video md:aspect-[21/9] overflow-hidden mb-8">
        <img
          src={post.featuredImage}
          alt={post.featuredImageAlt || post.title}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Article Header */}
        <div className="py-8 space-y-6">
          {/* Meta */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <span className="bg-brand/10 text-brand px-4 py-2 rounded-full font-semibold">
              {post.category}
            </span>
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4" />
              <span>{new Date(post.publishDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4" />
              <span>{post.readTime} min read</span>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-bold text-foreground leading-tight">
            {post.title}
          </h1>

          {/* Excerpt & Share */}
          <div className="flex items-start justify-between pt-4 border-t border-border gap-4">
            <p className="text-lg text-muted-foreground flex-1">{post.excerpt}</p>
            <button
              onClick={handleShare}
              className="flex items-center space-x-2 px-4 py-2 bg-muted hover:bg-muted/80 rounded-full transition-colors whitespace-nowrap"
              aria-label="Share article"
            >
              <Share2 className="w-4 h-4" />
              <span className="hidden sm:inline">Share</span>
            </button>
          </div>

          {/* Author */}
          {post.author && (
            <div className="flex items-center space-x-3 pt-4">
              <div className="w-12 h-12 rounded-full bg-brand/10 flex items-center justify-center">
                <span className="text-brand font-bold text-lg">
                  {post.author.charAt(0)}
                </span>
              </div>
              <div>
                <p className="font-semibold text-foreground">{post.author}</p>
                <p className="text-sm text-muted-foreground">Content Writer</p>
              </div>
            </div>
          )}
        </div>

        {/* Article Content with Beautiful Styling */}
        <div 
          className="article-content prose prose-lg max-w-none mb-16"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* ShareThis Inline Share Buttons */}
        <div className="border-t border-b border-border py-8 my-12">
          <p className="text-sm text-muted-foreground mb-4 text-center">Share this article:</p>
          <div className="sharethis-inline-share-buttons"></div>
        </div>

        {/* Author Bio */}
        {post.author && (
          <div className="bg-muted/50 rounded-2xl p-8 mt-12 border border-border">
            <div className="flex items-start space-x-4">
              <div className="w-16 h-16 rounded-full bg-brand/10 flex items-center justify-center flex-shrink-0">
                <span className="text-brand font-bold text-2xl">
                  {post.author.charAt(0)}
                </span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-foreground mb-2">About {post.author}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Our team of expert writers researches and tests products to bring you honest, 
                  detailed reviews and buying guides. We're passionate about helping Filipino 
                  shoppers find the best deals and quality products on Shopee.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </article>
  );
};

export default PostContent;
