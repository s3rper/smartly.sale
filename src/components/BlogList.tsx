import React, { useState, useEffect } from 'react';
import { Search, Calendar, Tag } from 'lucide-react';
import { baseUrl } from '../lib/base-url';

interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  featuredImage: string;
  slug: string;
  category: string;
  publishDate: string;
  readTime: string;
}

const BlogList: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('recent');

  // Mock data - will be replaced with CMS data
  useEffect(() => {
    const mockPosts: BlogPost[] = [
      {
        id: 1,
        title: "Top 5 Budget Gadgets Under ₱500 in 2025",
        excerpt: "Discover the most affordable tech gadgets that won't break the bank. From wireless earbuds to power banks, we've got you covered!",
        featuredImage: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=800&h=600&fit=crop",
        slug: "top-5-budget-gadgets-under-500-2025",
        category: "gadgets",
        publishDate: "2025-01-15",
        readTime: "5 min read"
      },
      {
        id: 2,
        title: "Must-Have Funny T-Shirts for Filipinos",
        excerpt: "Hilarious and relatable designs that showcase Filipino humor. These shirts are trending on social media!",
        featuredImage: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&h=600&fit=crop",
        slug: "must-have-funny-tshirts-filipinos",
        category: "fashion",
        publishDate: "2025-01-12",
        readTime: "4 min read"
      },
      {
        id: 3,
        title: "Best Korean Skincare Products in Shopee PH",
        excerpt: "Achieve that K-beauty glow with these top-rated products. Affordable and effective solutions for every skin type.",
        featuredImage: "https://images.unsplash.com/photo-1571875257727-256c39da42af?w=800&h=600&fit=crop",
        slug: "best-korean-skincare-products-shopee-ph",
        category: "beauty",
        publishDate: "2025-01-10",
        readTime: "6 min read"
      },
      {
        id: 4,
        title: "Aesthetic Room Decor Ideas Under ₱1000",
        excerpt: "Transform your room into an Instagram-worthy space without spending a fortune. LED lights, wall art, and more!",
        featuredImage: "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=800&h=600&fit=crop",
        slug: "aesthetic-room-decor-ideas-under-1000",
        category: "home",
        publishDate: "2025-01-08",
        readTime: "7 min read"
      },
      {
        id: 5,
        title: "Top 10 Kitchen Gadgets Every Filipino Home Needs",
        excerpt: "Make cooking easier with these innovative and affordable kitchen tools. Perfect for busy households!",
        featuredImage: "https://images.unsplash.com/photo-1556911220-bff31c812dba?w=800&h=600&fit=crop",
        slug: "top-10-kitchen-gadgets-filipino-home",
        category: "home",
        publishDate: "2025-01-05",
        readTime: "8 min read"
      },
      {
        id: 6,
        title: "Trendy Sneakers for Men and Women 2025",
        excerpt: "Step up your shoe game with these stylish and comfortable sneakers. From running to casual wear!",
        featuredImage: "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=800&h=600&fit=crop",
        slug: "trendy-sneakers-men-women-2025",
        category: "fashion",
        publishDate: "2025-01-03",
        readTime: "5 min read"
      },
      {
        id: 7,
        title: "Best Wireless Earbuds Under ₱1500",
        excerpt: "Premium sound quality without the premium price. Compare the best budget-friendly wireless earbuds available now.",
        featuredImage: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&h=600&fit=crop",
        slug: "best-wireless-earbuds-under-1500",
        category: "gadgets",
        publishDate: "2025-01-01",
        readTime: "6 min read"
      },
      {
        id: 8,
        title: "Fitness Equipment for Home Workouts",
        excerpt: "Stay fit at home with these affordable workout essentials. Resistance bands, yoga mats, and more!",
        featuredImage: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&h=600&fit=crop",
        slug: "fitness-equipment-home-workouts",
        category: "sports",
        publishDate: "2024-12-28",
        readTime: "5 min read"
      }
    ];
    setPosts(mockPosts);
    setFilteredPosts(mockPosts);

    // Get query parameters from URL
    const params = new URLSearchParams(window.location.search);
    const categoryParam = params.get('category');
    const searchParam = params.get('search');
    
    if (categoryParam) setSelectedCategory(categoryParam);
    if (searchParam) setSearchQuery(searchParam);
  }, []);

  // Filter posts based on search and category
  useEffect(() => {
    let filtered = [...posts];

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(post => post.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(post =>
        post.title.toLowerCase().includes(query) ||
        post.excerpt.toLowerCase().includes(query)
      );
    }

    // Sort posts
    if (sortBy === 'recent') {
      filtered.sort((a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime());
    } else if (sortBy === 'oldest') {
      filtered.sort((a, b) => new Date(a.publishDate).getTime() - new Date(b.publishDate).getTime());
    }

    setFilteredPosts(filtered);
  }, [posts, searchQuery, selectedCategory, sortBy]);

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'gadgets', label: 'Gadgets & Tech' },
    { value: 'fashion', label: 'Fashion & Apparel' },
    { value: 'home', label: 'Home & Living' },
    { value: 'beauty', label: 'Beauty & Health' },
    { value: 'food', label: 'Food & Snacks' },
    { value: 'sports', label: 'Sports & Outdoor' }
  ];

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <section className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Filters */}
        <div className="bg-card rounded-2xl shadow-lg p-6 mb-8 border border-border">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search posts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-[#FF6600]"
              />
            </div>

            {/* Category Filter */}
            <div className="relative">
              <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-[#FF6600] appearance-none cursor-pointer"
              >
                {categories.map(cat => (
                  <option key={cat.value} value={cat.value}>{cat.label}</option>
                ))}
              </select>
            </div>

            {/* Sort By */}
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-[#FF6600] appearance-none cursor-pointer"
              >
                <option value="recent">Most Recent</option>
                <option value="oldest">Oldest First</option>
              </select>
            </div>
          </div>

          {/* Results Count */}
          <div className="mt-4 text-sm text-muted-foreground">
            Showing {filteredPosts.length} {filteredPosts.length === 1 ? 'post' : 'posts'}
          </div>
        </div>

        {/* Posts Grid */}
        {filteredPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post) => (
              <a
                key={post.id}
                href={`${baseUrl}/post/${post.slug}`}
                className="group bg-card rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 border border-border hover:border-[#FF6600]"
              >
                {/* Featured Image */}
                <div className="aspect-video overflow-hidden">
                  <img
                    src={post.featuredImage}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>

                {/* Post Content */}
                <div className="p-6 space-y-3">
                  {/* Meta */}
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span className="bg-[#FF6600]/10 text-[#FF6600] px-3 py-1 rounded-full font-medium capitalize">
                      {post.category}
                    </span>
                    <span>{post.readTime}</span>
                  </div>

                  {/* Title */}
                  <h3 className="font-bold text-xl text-foreground group-hover:text-[#FF6600] transition-colors line-clamp-2">
                    {post.title}
                  </h3>

                  {/* Excerpt */}
                  <p className="text-muted-foreground line-clamp-3">
                    {post.excerpt}
                  </p>

                  {/* Date */}
                  <div className="flex items-center text-sm text-muted-foreground pt-2 border-t border-border">
                    <Calendar className="w-4 h-4 mr-2" />
                    {formatDate(post.publishDate)}
                  </div>
                </div>
              </a>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-xl text-muted-foreground">No posts found matching your criteria.</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
              }}
              className="mt-4 text-[#FF6600] font-semibold hover:underline"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default BlogList;
