import React from 'react';
import { Smartphone, Shirt, Home, Sparkles, Utensils, Bike } from 'lucide-react';
import { baseUrl } from '../lib/base-url';

interface Category {
  id: number;
  name: string;
  slug: string;
  icon: React.ReactNode;
  count: number;
  color: string;
}

const CategoryGrid: React.FC = () => {
  const categories: Category[] = [
    {
      id: 1,
      name: "Gadgets & Tech",
      slug: "gadgets",
      icon: <Smartphone className="w-8 h-8" />,
      count: 150,
      color: "from-blue-500/20 to-blue-600/20"
    },
    {
      id: 2,
      name: "Fashion & Apparel",
      slug: "fashion",
      icon: <Shirt className="w-8 h-8" />,
      count: 200,
      color: "from-pink-500/20 to-pink-600/20"
    },
    {
      id: 3,
      name: "Home & Living",
      slug: "home",
      icon: <Home className="w-8 h-8" />,
      count: 120,
      color: "from-green-500/20 to-green-600/20"
    },
    {
      id: 4,
      name: "Beauty & Health",
      slug: "beauty",
      icon: <Sparkles className="w-8 h-8" />,
      count: 180,
      color: "from-purple-500/20 to-purple-600/20"
    },
    {
      id: 5,
      name: "Food & Snacks",
      slug: "food",
      icon: <Utensils className="w-8 h-8" />,
      count: 90,
      color: "from-orange-500/20 to-orange-600/20"
    },
    {
      id: 6,
      name: "Sports & Outdoor",
      slug: "sports",
      icon: <Bike className="w-8 h-8" />,
      count: 75,
      color: "from-red-500/20 to-red-600/20"
    }
  ];

  return (
    <section className="py-16 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Shop by <span className="text-brand">Category</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Browse through our curated collections and find exactly what you're looking for
          </p>
        </div>

        {/* Category Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
          {categories.map((category) => (
            <a
              key={category.id}
              href={`${baseUrl}/blog?category=${category.slug}`}
              className="group"
            >
              <div className={`bg-gradient-to-br ${category.color} rounded-2xl p-6 text-center hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-brand cursor-pointer h-full`}>
                <div className="flex flex-col items-center space-y-3">
                  <div className="w-16 h-16 bg-background rounded-full flex items-center justify-center text-brand group-hover:scale-110 transition-transform">
                    {category.icon}
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground text-sm md:text-base group-hover:text-brand transition-colors">
                      {category.name}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      {category.count} products
                    </p>
                  </div>
                </div>
              </div>
            </a>
          ))}
        </div>

        {/* View All Categories */}
        <div className="text-center mt-12">
          <a
            href={`${baseUrl}/categories`}
            className="inline-flex items-center justify-center px-8 py-4 bg-brand text-white font-bold rounded-full hover:bg-brand/90 transition-all transform hover:scale-105"
          >
            View All Categories
          </a>
        </div>
      </div>
    </section>
  );
};

export default CategoryGrid;
