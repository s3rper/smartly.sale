import React from 'react';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';
import { ArrowBullet } from './ArrowBullet';

export const AegixTargetAudience: React.FC = () => {
  const { ref, isVisible } = useScrollAnimation(0.2);

  const audiencePoints = [
    'Rely on cloud tools and email',
    'Store business data online',
    'Want to reduce risk without becoming technical experts',
  ];

  return (
    <section ref={ref} className="py-16 md:py-24 bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <h2
          className={`text-3xl md:text-4xl lg:text-5xl font-bold text-center text-foreground mb-12 ${
            isVisible ? 'animate-fade-in-up' : 'opacity-0'
          }`}
        >
          This session is for founders, business owners,
          <br />
          and solopreneurs who:
        </h2>

        {/* Bullet Points with Staggered Animation */}
        <div className="max-w-3xl mx-auto space-y-6 mb-12">
          {audiencePoints.map((point, index) => (
            <div
              key={index}
              className={`${
                isVisible ? `animate-slide-in-left animate-delay-${(index + 1) * 100}` : 'opacity-0'
              }`}
            >
              <ArrowBullet>{point}</ArrowBullet>
            </div>
          ))}
        </div>

        {/* Emphasis Text */}
        <div
          className={`text-center max-w-3xl mx-auto ${
            isVisible ? 'animate-fade-in-up animate-delay-400' : 'opacity-0'
          }`}
        >
          <p className="text-2xl md:text-3xl font-bold text-foreground mb-3">
            No technical deep dives.
          </p>
          <p className="text-2xl md:text-3xl font-bold text-foreground mb-3">No jargon.</p>
          <p className="text-2xl md:text-3xl font-bold text-brand">
            Just clarity and practical decision-making.
          </p>
        </div>
      </div>
    </section>
  );
};
