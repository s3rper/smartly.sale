import React from 'react';
import { TrendingUp, Eye } from 'lucide-react';
import { baseUrl } from '../lib/base-url';

interface PopularPost {
  id: number;
  title: string;
  excerpt: string;
  views: string;
  image: string;
  slug: string;
  publishDate: string;
}

const PopularPosts: React.FC = () => {
  // Mock data - will be replaced with CMS data showing top 3 most viewed
  const posts: PopularPost[] = [
    {
      id: 1,
      title: "Top 5 Budget Gadgets Under ₱500 in 2025",
      excerpt: "Discover the most affordable tech gadgets that won't break the bank. Perfect for students and budget-conscious shoppers!",
      views: "45.2K",
      image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=600&h=400&fit=crop",
      slug: "top-5-budget-gadgets-under-500-2025",
      publishDate: "2 days ago"
    },
    {
      id: 2,
      title: "Must-Have Funny T-Shirts for Filipinos",
      excerpt: "Hilarious and relatable designs that showcase Filipino humor. These shirts are selling out fast!",
      views: "38.9K",
      image: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=600&h=400&fit=crop",
      slug: "must-have-funny-tshirts-filipinos",
      publishDate: "1 week ago"
    },
    {
      id: 3,
      title: "Best Korean Skincare Products in Shopee PH",
      excerpt: "Achieve that K-beauty glow with these top-rated products available in the Philippines.",
      views: "32.5K",
      image: "https://images.unsplash.com/photo-1571875257727-256c39da42af?w=600&h=400&fit=crop",
      slug: "best-korean-skincare-products-shopee-ph",
      publishDate: "3 days ago"
    }
  ];

  return (
    <section className="py-16 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
              <TrendingUp className="inline-block w-8 h-8 text-[#FF6600] mr-2 mb-1" />
              Most <span className="text-[#FF6600]">Popular</span>
            </h2>
            <p className="text-muted-foreground text-lg">
              Our most-read product reviews and buying guides
            </p>
          </div>
        </div>

        {/* Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {posts.map((post, index) => (
            <a
              key={post.id}
              href={`${baseUrl}/post/${post.slug}`}
              className="group bg-card rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 border border-border hover:border-[#FF6600]"
            >
              {/* Ranking Badge */}
              <div className="relative">
                <div className="absolute top-4 left-4 z-10 w-12 h-12 bg-[#FF6600] text-white rounded-full flex items-center justify-center font-bold text-xl shadow-lg">
                  #{index + 1}
                </div>
                <div className="aspect-video overflow-hidden">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
              </div>

              {/* Post Content */}
              <div className="p-6 space-y-3">
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>{post.publishDate}</span>
                  <div className="flex items-center space-x-1">
                    <Eye className="w-4 h-4" />
                    <span className="font-semibold">{post.views}</span>
                  </div>
                </div>

                <h3 className="font-bold text-xl text-foreground group-hover:text-[#FF6600] transition-colors line-clamp-2">
                  {post.title}
                </h3>

                <p className="text-muted-foreground line-clamp-3">
                  {post.excerpt}
                </p>

                <div className="pt-2">
                  <span className="text-[#FF6600] font-semibold group-hover:underline">
                    Read More →
                  </span>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PopularPosts;
