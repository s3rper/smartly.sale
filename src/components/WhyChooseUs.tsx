import React from 'react';
import { CheckCircle, Shield, Zap, ThumbsUp } from 'lucide-react';

const WhyChooseUs: React.FC = () => {
  const features = [
    {
      icon: <CheckCircle className="w-12 h-12 text-brand" />,
      title: 'Curated Selection',
      description: 'We handpick only the best and most viral products from Shopee Philippines, saving you time from endless scrolling.'
    },
    {
      icon: <Shield className="w-12 h-12 text-brand" />,
      title: 'Verified Reviews',
      description: 'Every product is backed by real customer reviews and ratings. Shop with confidence knowing others loved it first.'
    },
    {
      icon: <Zap className="w-12 h-12 text-brand" />,
      title: 'Daily Updates',
      description: 'Stay ahead of the trends with daily product recommendations and flash deals you won\'t find anywhere else.'
    },
    {
      icon: <ThumbsUp className="w-12 h-12 text-brand" />,
      title: 'Best Price Guarantee',
      description: 'We track prices and alert you to the best deals, ensuring you always get the most value for your money.'
    }
  ];

  return (
    <section className="py-16 bg-muted">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
            Why Choose smartly.sale?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Your trusted partner in discovering the best Shopee deals and trending products
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-background p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 text-center"
            >
              <div className="flex justify-center mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-foreground mb-4">
                {feature.title}
              </h3>
              <p className="text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
