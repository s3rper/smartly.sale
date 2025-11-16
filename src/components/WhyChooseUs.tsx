import React from 'react';
import { Shield, TrendingUp, Award, Clock } from 'lucide-react';

const WhyChooseUs: React.FC = () => {
  const benefits = [
    {
      icon: Shield,
      title: 'Verified Products',
      description: 'Every product is carefully vetted and tested by our team to ensure quality and authenticity.'
    },
    {
      icon: TrendingUp,
      title: 'Latest Trends',
      description: 'Stay ahead with the hottest viral products that Filipinos are loving right now.'
    },
    {
      icon: Award,
      title: 'Best Deals',
      description: 'We hunt down the most competitive prices and exclusive discounts just for you.'
    },
    {
      icon: Clock,
      title: 'Updated Daily',
      description: 'Fresh finds added every day so you never miss out on the next must-have item.'
    }
  ];

  return (
    <section className="py-16 bg-muted/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Why Choose <span className="text-[#FF6600]">smartly.sale?</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            We're more than just a product listing site. We're your trusted shopping companion.
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <div
                key={index}
                className="bg-background rounded-xl p-6 shadow-md hover:shadow-xl transition-all duration-300 border border-border group hover:border-[#FF6600]"
              >
                {/* Icon */}
                <div className="w-12 h-12 bg-[#FF6600]/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-[#FF6600] transition-colors">
                  <Icon className="w-6 h-6 text-[#FF6600] group-hover:text-white transition-colors" />
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-foreground mb-2">
                  {benefit.title}
                </h3>

                {/* Description */}
                <p className="text-muted-foreground text-sm">
                  {benefit.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Trust Badge */}
        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-2 bg-background px-6 py-3 rounded-full border border-border shadow-sm">
            <Shield className="w-5 h-5 text-[#FF6600]" />
            <span className="text-sm font-medium text-foreground">
              Trusted by <strong className="text-[#FF6600]">50,000+</strong> Smart Shoppers
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
