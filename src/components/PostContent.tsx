import React from 'react';
import { Calendar, Clock, Tag, Share2, ExternalLink, Star } from 'lucide-react';
import { baseUrl } from '../lib/base-url';

interface Post {
  title: string;
  excerpt: string;
  featuredImage: string;
  category: string;
  publishDate: string;
  readTime: string;
  slug: string;
}

interface Product {
  id: number;
  name: string;
  price: string;
  originalPrice: string;
  discount: string;
  rating: number;
  image: string;
  shopeeLink: string;
  description: string;
}

interface PostContentProps {
  post: Post;
}

const PostContent: React.FC<PostContentProps> = ({ post }) => {
  // Mock products data - will be connected to CMS
  const affiliateProducts: Product[] = [
    {
      id: 1,
      name: "Wireless Bluetooth Earbuds TWS",
      price: "₱299",
      originalPrice: "₱999",
      discount: "70% OFF",
      rating: 4.8,
      image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400&h=400&fit=crop",
      shopeeLink: "https://shopee.ph",
      description: "Premium sound quality with noise cancellation. Perfect for music lovers on a budget!"
    },
    {
      id: 2,
      name: "Mini Portable Power Bank 10000mAh",
      price: "₱399",
      originalPrice: "₱899",
      discount: "56% OFF",
      rating: 4.7,
      image: "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=400&h=400&fit=crop",
      shopeeLink: "https://shopee.ph",
      description: "Compact and lightweight power bank that fits in your pocket. Fast charging support!"
    },
    {
      id: 3,
      name: "LED Ring Light with Tripod Stand",
      price: "₱349",
      originalPrice: "₱799",
      discount: "56% OFF",
      rating: 4.6,
      image: "https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=400&h=400&fit=crop",
      shopeeLink: "https://shopee.ph",
      description: "Perfect for TikTok, selfies, and video calls. Adjustable brightness levels!"
    },
    {
      id: 4,
      name: "USB Type-C Fast Charging Cable",
      price: "₱99",
      originalPrice: "₱299",
      discount: "67% OFF",
      rating: 4.9,
      image: "https://images.unsplash.com/photo-1588508065123-287b28e013da?w=400&h=400&fit=crop",
      shopeeLink: "https://shopee.ph",
      description: "Durable braided cable with fast charging support. Compatible with most devices!"
    },
    {
      id: 5,
      name: "Smartphone Holder Car Mount",
      price: "₱149",
      originalPrice: "₱399",
      discount: "63% OFF",
      rating: 4.5,
      image: "https://images.unsplash.com/photo-1585060544812-6b45742d762f?w=400&h=400&fit=crop",
      shopeeLink: "https://shopee.ph",
      description: "Secure phone mount for safe driving. 360-degree rotation and adjustable grip!"
    }
  ];

  // Mock related posts
  const relatedPosts = [
    {
      id: 1,
      title: "Best Wireless Earbuds Under ₱1500",
      image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400&h=300&fit=crop",
      slug: "best-wireless-earbuds-under-1500"
    },
    {
      id: 2,
      title: "Top 10 Kitchen Gadgets Every Filipino Home Needs",
      image: "https://images.unsplash.com/photo-1556911220-bff31c812dba?w=400&h=300&fit=crop",
      slug: "top-10-kitchen-gadgets-filipino-home"
    },
    {
      id: 3,
      title: "Trendy Sneakers for Men and Women 2025",
      image: "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=400&h=300&fit=crop",
      slug: "trendy-sneakers-men-women-2025"
    }
  ];

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
      <div className="w-full aspect-video md:aspect-[21/9] overflow-hidden">
        <img
          src={post.featuredImage}
          alt={post.title}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Article Header */}
        <div className="py-8 space-y-4">
          {/* Meta */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <span className="bg-[#FF6600]/10 text-[#FF6600] px-4 py-2 rounded-full font-semibold">
              {post.category}
            </span>
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4" />
              <span>{post.publishDate}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4" />
              <span>{post.readTime}</span>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-bold text-foreground leading-tight">
            {post.title}
          </h1>

          {/* Share Button */}
          <div className="flex items-center justify-between pt-4 border-t border-border">
            <p className="text-lg text-muted-foreground">{post.excerpt}</p>
            <button
              onClick={handleShare}
              className="flex items-center space-x-2 px-4 py-2 bg-muted hover:bg-muted/80 rounded-full transition-colors"
            >
              <Share2 className="w-4 h-4" />
              <span className="hidden sm:inline">Share</span>
            </button>
          </div>
        </div>

        {/* Top Ad */}
        <div className="bg-muted rounded-lg p-8 text-center text-sm text-muted-foreground border mb-8">
          Advertisement Space (728x90)
        </div>

        {/* Article Content */}
        <div className="prose prose-lg max-w-none mb-12">
          <p className="text-lg leading-relaxed text-foreground">
            Looking for amazing tech gadgets that won't destroy your budget? You're in the right place! 
            We've scoured Shopee Philippines to find the best budget-friendly gadgets under ₱500. 
            These products have thousands of positive reviews and are perfect for students, young professionals, 
            or anyone who loves a good deal!
          </p>

          <h2 className="text-3xl font-bold text-foreground mt-8 mb-4">Why These Gadgets?</h2>
          <p className="text-lg leading-relaxed text-foreground mb-6">
            We tested and reviewed dozens of products to bring you only the best. Each item on this list offers 
            incredible value for money, high ratings from verified buyers, and reliable performance. Plus, they're 
            all available with fast shipping across the Philippines!
          </p>

          <h2 className="text-3xl font-bold text-foreground mt-8 mb-4">Our Top Picks</h2>
          <p className="text-lg leading-relaxed text-foreground mb-6">
            Below are our carefully selected budget gadgets that deliver premium features without the premium price tag. 
            Click on any product to check current prices and availability on Shopee!
          </p>
        </div>

        {/* Affiliate Product Cards */}
        <div className="space-y-6 mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-6">Featured Products</h2>
          {affiliateProducts.map((product, index) => (
            <div
              key={product.id}
              className="bg-card rounded-2xl shadow-lg overflow-hidden border border-border hover:border-[#FF6600] transition-all"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
                {/* Product Image */}
                <div className="relative">
                  <div className="aspect-square rounded-xl overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute top-3 right-3 bg-[#FF6600] text-white text-xs font-bold px-3 py-1 rounded-full">
                    #{index + 1}
                  </div>
                </div>

                {/* Product Info */}
                <div className="md:col-span-2 flex flex-col justify-between">
                  <div className="space-y-3">
                    <h3 className="text-2xl font-bold text-foreground">{product.name}</h3>
                    
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center space-x-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-5 h-5 ${
                              i < Math.floor(product.rating)
                                ? 'fill-[#FF6600] text-[#FF6600]'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="font-semibold text-foreground">{product.rating}</span>
                      <span className="text-sm text-muted-foreground">(3.2k reviews)</span>
                    </div>

                    <p className="text-muted-foreground leading-relaxed">{product.description}</p>

                    <div className="flex items-center space-x-3">
                      <span className="text-3xl font-bold text-[#FF6600]">{product.price}</span>
                      <span className="text-lg text-muted-foreground line-through">{product.originalPrice}</span>
                      <span className="bg-[#FF6600]/10 text-[#FF6600] px-3 py-1 rounded-full text-sm font-bold">
                        {product.discount}
                      </span>
                    </div>
                  </div>

                  <a
                    href={product.shopeeLink}
                    target="_blank"
                    rel="noopener noreferrer nofollow"
                    className="inline-flex items-center justify-center px-8 py-4 bg-[#FF6600] text-white font-bold rounded-full hover:bg-[#FF6600]/90 transition-all transform hover:scale-105 mt-4"
                  >
                    <ExternalLink className="w-5 h-5 mr-2" />
                    View on Shopee
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Middle Ad */}
        <div className="bg-muted rounded-lg p-8 text-center text-sm text-muted-foreground border my-12">
          Advertisement Space (728x90)
        </div>

        {/* Conclusion */}
        <div className="prose prose-lg max-w-none mb-12">
          <h2 className="text-3xl font-bold text-foreground mt-8 mb-4">Final Thoughts</h2>
          <p className="text-lg leading-relaxed text-foreground mb-6">
            These budget gadgets prove that you don't need to spend a fortune to get quality tech products. 
            Each item on this list offers exceptional value and has been tried and tested by thousands of 
            Filipino shoppers. Don't miss out on these amazing deals – they're selling fast!
          </p>
          
          <div className="bg-[#FF6600]/10 border-l-4 border-[#FF6600] p-6 rounded-lg my-8">
            <p className="text-foreground font-semibold mb-2">💡 Pro Tip:</p>
            <p className="text-muted-foreground">
              Make sure to check the seller's ratings and read recent reviews before purchasing. 
              Also, watch out for flash sales and vouchers to save even more!
            </p>
          </div>
        </div>

        {/* You Might Also Like */}
        <div className="mt-16 pt-8 border-t border-border">
          <h2 className="text-3xl font-bold text-foreground mb-8">You Might Also Like</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedPosts.map((relatedPost) => (
              <a
                key={relatedPost.id}
                href={`${baseUrl}/post/${relatedPost.slug}`}
                className="group bg-card rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all border border-border hover:border-[#FF6600]"
              >
                <div className="aspect-video overflow-hidden">
                  <img
                    src={relatedPost.image}
                    alt={relatedPost.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-foreground group-hover:text-[#FF6600] transition-colors line-clamp-2">
                    {relatedPost.title}
                  </h3>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </article>
  );
};

export default PostContent;
