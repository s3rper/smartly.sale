import React from 'react';
import { Search, Eye, ShoppingCart, ThumbsUp } from 'lucide-react';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

const HowItWorks: React.FC = () => {
  const { ref, isVisible } = useScrollAnimation();
  const steps = [
    {
      icon: <Search className="w-12 h-12" strokeWidth={2.5} />,
      step: "01",
      title: "Browse Products",
      description: "Explore our curated collection of trending and viral products"
    },
    {
      icon: <Eye className="w-12 h-12" strokeWidth={2.5} />,
      step: "02",
      title: "Check Details",
      description: "View product images, prices, ratings, and shop information"
    },
    {
      icon: <ShoppingCart className="w-12 h-12" strokeWidth={2.5} />,
      step: "03",
      title: "Buy on Shopee",
      description: "Click 'Buy Now' to purchase directly from trusted Shopee sellers"
    },
    {
      icon: <ThumbsUp className="w-12 h-12" strokeWidth={2.5} />,
      step: "04",
      title: "Enjoy Your Find",
      description: "Receive your product and share your experience with others"
    }
  ];

  return (
    <section className="py-16 bg-background" ref={ref}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className={`text-center mb-12 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
            How <span className="text-brand">It Works</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Finding and buying viral products has never been easier
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {steps.map((item, index) => (
            <div key={index} className={`relative ${isVisible ? `animate-fade-in-up animate-delay-${(index + 1) * 100}` : 'opacity-0'}`}>
              {/* Connector Line (hidden on mobile, last item) */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-16 left-1/2 w-full h-0.5 bg-gradient-to-r from-brand to-brand/20 -z-10"></div>
              )}
              
              <div className="text-center">
                {/* Icon Circle */}
                <div className="relative inline-flex items-center justify-center w-28 h-28 bg-brand rounded-full text-white mb-6 shadow-xl hover:shadow-2xl transition-shadow duration-300">
                  <div className="relative z-10">
                    {item.icon}
                  </div>
                  <div className="absolute -top-2 -right-2 w-12 h-12 bg-foreground rounded-full flex items-center justify-center text-white font-bold text-base shadow-lg border-4 border-background z-20">
                    {item.step}
                  </div>
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-foreground mb-4">
                  {item.title}
                </h3>
                <p className="text-muted-foreground">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
