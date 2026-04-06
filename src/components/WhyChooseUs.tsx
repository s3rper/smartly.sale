import React from 'react';
import { CheckCircle, Shield, Zap, ThumbsUp } from 'lucide-react';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import { useCardTilt } from '../hooks/useCardTilt';

// Individual card with 3D tilt — each card needs its own tilt ref
const FeatureCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  description: string;
  delay: number;
  visible: boolean;
}> = ({ icon, title, description, delay, visible }) => {
  const { ref, onMouseMove, onMouseLeave } = useCardTilt(7);

  return (
    <div
      ref={ref}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      className={`bg-background p-6 rounded-xl shadow-md text-center cursor-default ${visible ? `animate-fade-in-up animate-delay-${delay}` : 'opacity-0'}`}
      style={{ willChange: 'transform' }}
    >
      <div className="flex justify-center mb-4">{icon}</div>
      <h3 className="text-xl font-bold text-foreground mb-4">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
};

const WhyChooseUs: React.FC = () => {
  const { ref, isVisible } = useScrollAnimation();

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
      description: "Stay ahead of the trends with daily product recommendations and flash deals you won't find anywhere else."
    },
    {
      icon: <ThumbsUp className="w-12 h-12 text-brand" />,
      title: 'Best Price Guarantee',
      description: 'We track prices and alert you to the best deals, ensuring you always get the most value for your money.'
    }
  ];

  return (
    <section className="py-16 bg-muted" ref={ref}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`text-center mb-12 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
            Why Choose smartly.sale?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Your trusted partner in discovering the best Shopee deals and trending products
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              delay={(index + 1) * 100}
              visible={isVisible}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
