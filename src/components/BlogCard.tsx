import React from 'react';
import { Calendar, Clock } from 'lucide-react';
import type { BlogPost } from '../types/blog';
import { baseUrl } from '../lib/base-url';

interface BlogCardProps {
  post: BlogPost;
}

const BlogCard: React.FC<BlogCardProps> = ({ post }) => {
  const formattedDate = new Date(post.publishDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  const readTime = (post as any).readingTime || post.readTime || 5;

  const categoryLabel = post.category
    ? post.category.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
    : 'Gaming';

  // Auto-generated posts live at /post/slug, hardcoded ones at /blog/slug
  const href = (post as any).generated
    ? `${baseUrl}/post/${post.slug}`
    : `${baseUrl}/blog/${post.slug}`;

  return (
    <article className="group bg-card rounded-2xl border border-border overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
      <a href={href} className="block">
        {/* Image */}
        <div className="relative overflow-hidden aspect-[16/9]">
          <img
            src={post.featuredImage}
            alt={post.featuredImageAlt || post.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          {/* Category badge */}
          <span
            className="absolute top-3 left-3 text-white text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full"
            style={{ background: '#f97316' }}
          >
            {categoryLabel}
          </span>
        </div>

        {/* Content */}
        <div className="p-5">
          <h3 className="text-base font-bold text-foreground mb-2 line-clamp-2 leading-snug group-hover:text-[#f97316] transition-colors duration-200">
            {post.title}
          </h3>

          <p className="text-sm text-muted-foreground mb-4 line-clamp-2 leading-relaxed">
            {post.excerpt}
          </p>

          {/* Meta */}
          <div className="flex items-center justify-between text-xs text-muted-foreground border-t border-border pt-3 mt-auto">
            <div className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 flex-shrink-0" />
              <span>{formattedDate}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 flex-shrink-0" />
              <span>{readTime} min read</span>
            </div>
          </div>
        </div>
      </a>
    </article>
  );
};

export default BlogCard;
