import React from 'react';
import { ShoppingBag } from 'lucide-react';
import { baseUrl } from '../lib/base-url';

const Hero: React.FC = () => {
  return (
    <section
      className="relative bg-gradient-to-br from-brand/10 via-background to-background py-20 md:py-32 overflow-hidden"
      style={{ minHeight: '560px', contain: 'layout style paint' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-6">
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 bg-brand/10 text-brand px-4 py-2 rounded-full text-sm font-semibold border border-brand/20">
            <span className="text-xl" role="img" aria-label="fire">🔥</span>
            <span>Trending Now in the Philippines</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl md:text-6xl font-bold text-foreground leading-tight">
            Discover Viral <span className="text-brand">Shopee Finds</span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            From budget gadgets to must-have fashion items, we curate the best trending products
            that Filipinos are loving right now. Shop smart, save more!
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row justify-center items-center gap-3 pt-4 mb-4">
            <a
              href={`${baseUrl}/products`}
              className="inline-flex items-center justify-center px-10 py-4 bg-brand text-white font-bold rounded-full hover:bg-[#B34700] transition-all text-lg shadow-lg hover:shadow-xl hover:-translate-y-0.5"
            >
              <ShoppingBag className="w-5 h-5 mr-2" />
              Shop Now
            </a>
            <a
              href={`${baseUrl}/blog`}
              className="inline-flex items-center justify-center px-8 py-4 bg-background text-foreground font-semibold rounded-full border border-border hover:border-brand hover:text-brand transition-all text-lg"
            >
              Browse Guides
            </a>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 md:gap-8 max-w-2xl mx-auto pt-10">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-brand">500+</div>
              <div className="text-sm md:text-base text-muted-foreground mt-1">Products Reviewed</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-brand">50K+</div>
              <div className="text-sm md:text-base text-muted-foreground mt-1">Happy Shoppers</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-brand">100%</div>
              <div className="text-sm md:text-base text-muted-foreground mt-1">Verified Finds</div>
            </div>
          </div>

          {/* Trust strip */}
          <div className="pt-4 text-sm text-muted-foreground flex flex-wrap justify-center items-center gap-2">
            <span>🎵 As seen on TikTok</span>
            <span className="text-border">•</span>
            <span>📱 Shopee PH Affiliate Partner</span>
            <span className="text-border">•</span>
            <span>🇵🇭 Made for Filipinos</span>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-brand/5 rounded-full blur-3xl -z-10" aria-hidden="true"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-brand/5 rounded-full blur-3xl -z-10" aria-hidden="true"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand/3 rounded-full blur-3xl -z-10" aria-hidden="true"></div>
    </section>
  );
};

export default Hero;
