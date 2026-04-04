import React from 'react';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';

export const AegixHero: React.FC = () => {
  const { ref, isVisible } = useScrollAnimation(0.1);

  return (
    <section
      ref={ref}
      className="relative bg-gradient-to-br from-gray-900 via-background to-gray-950 py-20 md:py-32 overflow-hidden"
    >
      {/* Background pattern overlay */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`text-center ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>
          {/* Main Headline */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-6">
            The Hacker's Favorite Target:
            <br />
            <span className="text-brand">Unprepared Founders & Business Owners</span>
          </h1>

          {/* Subheadline */}
          <p className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto mb-8">
            Free, non-technical webinar about the decisions that determine how cyber incidents end
          </p>

          {/* Speaker Card */}
          <div className="inline-flex items-center gap-4 bg-card border border-border rounded-2xl p-6 mb-10">
            <div className="w-16 h-16 rounded-full bg-brand flex items-center justify-center text-white font-bold text-2xl">
              RB
            </div>
            <div className="text-left">
              <p className="font-bold text-foreground text-lg">René Bos</p>
              <p className="text-muted-foreground">Cyber Resilience Expert</p>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="#register"
              className="inline-flex items-center justify-center px-8 py-4 bg-brand text-white font-bold rounded-full hover:bg-brand/90 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Sign up for free
            </a>
            <a
              href="#replay"
              className="inline-flex items-center justify-center px-8 py-4 bg-card border-2 border-border text-foreground font-bold rounded-full hover:bg-muted transition-all"
            >
              Watch the replay
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
