import React from 'react';
import { Users, ShoppingBag, Star, TrendingUp } from 'lucide-react';

const TrustIndicators: React.FC = () => {
  const stats = [
    {
      icon: <Users className="w-8 h-8" />,
      value: "50K+",
      label: "Happy Shoppers",
      color: "from-blue-500 to-blue-600"
    },
    {
      icon: <ShoppingBag className="w-8 h-8" />,
      value: "500+",
      label: "Products Reviewed",
      color: "from-[#FF6600] to-orange-600"
    },
    {
      icon: <Star className="w-8 h-8" />,
      value: "4.9/5",
      label: "Average Rating",
      color: "from-yellow-500 to-yellow-600"
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      value: "100%",
      label: "Verified Finds",
      color: "from-green-500 to-green-600"
    }
  ];

  return (
    <section className="py-16 bg-gradient-to-br from-[#FF6600]/5 to-background relative overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-[#FF6600]/5 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#FF6600]/5 rounded-full blur-3xl -z-10"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Trusted by <span className="text-[#FF6600]">Thousands</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Join our growing community of smart shoppers across the Philippines
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-card rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-border text-center group hover:scale-105"
            >
              <div className={`w-16 h-16 bg-gradient-to-br ${stat.color} rounded-2xl flex items-center justify-center text-white mb-4 mx-auto group-hover:rotate-6 transition-transform duration-300`}>
                {stat.icon}
              </div>
              <div className="text-3xl md:text-4xl font-bold text-foreground mb-1">
                {stat.value}
              </div>
              <div className="text-sm md:text-base text-muted-foreground">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Social Proof */}
        <div className="mt-12 text-center">
          <div className="inline-flex items-center space-x-2 bg-card rounded-full px-6 py-3 shadow-lg border border-border">
            <div className="flex -space-x-2">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="w-8 h-8 rounded-full bg-gradient-to-br from-[#FF6600] to-orange-600 border-2 border-background flex items-center justify-center text-white text-xs font-bold"
                >
                  {String.fromCharCode(64 + i)}
                </div>
              ))}
            </div>
            <span className="text-sm text-muted-foreground">
              <span className="font-bold text-foreground">2,500+</span> joined this week
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustIndicators;
