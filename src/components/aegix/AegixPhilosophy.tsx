import React from 'react';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';
import { ArrowBullet } from './ArrowBullet';

export const AegixPhilosophy: React.FC = () => {
  const { ref, isVisible } = useScrollAnimation(0.2);

  const focusAreas = [
    'What risks you accept',
    'What you prepare for',
    'And who owns the response when something goes wrong',
  ];

  return (
    <section ref={ref} className="py-16 md:py-24 bg-card">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-gray-900 to-background border border-border rounded-3xl p-8 md:p-12">
          {/* Main Heading */}
          <h2
            className={`text-3xl md:text-4xl lg:text-5xl font-bold text-center text-foreground mb-8 ${
              isVisible ? 'animate-fade-in-up' : 'opacity-0'
            }`}
          >
            Cybersecurity is not about
            <br />
            preventing every possible incident.
          </h2>

          {/* Subheading */}
          <p
            className={`text-2xl md:text-3xl text-center text-muted-foreground mb-10 ${
              isVisible ? 'animate-fade-in-up animate-delay-100' : 'opacity-0'
            }`}
          >
            It is about being intentional about:
          </p>

          {/* Focus Areas with Staggered Animation */}
          <div className="max-w-3xl mx-auto space-y-6">
            {focusAreas.map((area, index) => (
              <div
                key={index}
                className={`${
                  isVisible ? `animate-slide-in-left animate-delay-${(index + 2) * 100}` : 'opacity-0'
                }`}
              >
                <ArrowBullet>{area}</ArrowBullet>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
