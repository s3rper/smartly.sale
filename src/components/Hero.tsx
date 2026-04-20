import React, { useEffect, useState } from 'react';
import { ShoppingBag, ChevronDown } from 'lucide-react';
import { baseUrl } from '../lib/base-url';

interface Particle {
  id: number;
  left: string;
  delay: string;
  duration: string;
  size: string;
  opacity: number;
}

// Cubic ease-out counter animation — same easing as aegixcyber.com
function useCounter(target: number, duration: number, started: boolean): number {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!started) return;
    let startTime: number | null = null;
    let rafId: number;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) rafId = requestAnimationFrame(step);
    };
    rafId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafId);
  }, [started, target, duration]);
  return count;
}

const STATS = [
  { target: 500, display: (n: number) => `${n}+`,  label: 'Products Reviewed' },
  { target: 50,  display: (n: number) => `${n}K+`, label: 'Happy Shoppers' },
  { target: 100, display: (n: number) => `${n}%`,  label: 'Verified Finds' },
];

const Hero: React.FC = () => {
  const [particles, setParticles]     = useState<Particle[]>([]);
  const [show, setShow]               = useState(false);
  const [countersOn, setCountersOn]   = useState(false);

  const c0 = useCounter(STATS[0].target, 1400, countersOn);
  const c1 = useCounter(STATS[1].target, 1700, countersOn);
  const c2 = useCounter(STATS[2].target, 1200, countersOn);
  const counts = [c0, c1, c2];

  useEffect(() => {
    // Particles: generated client-side to avoid SSR hydration mismatch
    setParticles(
      Array.from({ length: 18 }, (_, i) => ({
        id: i,
        left:     `${5 + Math.random() * 90}%`,
        delay:    `${Math.random() * 9}s`,
        duration: `${5 + Math.random() * 5}s`,
        size:     `${2 + Math.random() * 2.5}px`,
        opacity:  0.2 + Math.random() * 0.45,
      }))
    );
    // Staged entrance — trigger on next frame
    requestAnimationFrame(() => setShow(true));
    // Counter animation fires after entrance settles
    setTimeout(() => setCountersOn(true), 900);
  }, []);

  // Inline style helper for staged entrance (decorative elements: badge, stats, trust strip)
  const entrance = (delay: number) => ({
    opacity:    show ? 1 : 0,
    transform:  show ? 'translateY(0)' : 'translateY(22px)',
    transition: `opacity 0.65s ease-out ${delay}ms, transform 0.65s ease-out ${delay}ms`,
  } as React.CSSProperties);

  // LCP-safe entrance: transform only — element is visible from first paint for LCP scoring
  const entranceSolid = (delay: number) => ({
    transform:  show ? 'translateY(0)' : 'translateY(22px)',
    transition: `transform 0.65s ease-out ${delay}ms`,
  } as React.CSSProperties);

  return (
    <section
      className="relative overflow-hidden"
      style={{ minHeight: '640px', background: '#070709' }}
    >
      {/* ── Layered radial gradient glows (animated pulse) ── */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse 80% 50% at 50% -5%,  rgba(194,79,0,0.38) 0%, transparent 62%),
            radial-gradient(ellipse 50% 40% at 88% 88%,  rgba(194,79,0,0.14) 0%, transparent 58%),
            radial-gradient(ellipse 45% 38% at 12% 78%,  rgba(194,79,0,0.12) 0%, transparent 58%)
          `,
          animation: 'hero-glow-pulse 10s ease-in-out infinite',
        }}
      />

      {/* ── Grid dot pattern with radial mask fade ── */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:  'radial-gradient(circle, rgba(194,79,0,0.2) 1px, transparent 1px)',
          backgroundSize:   '44px 44px',
          maskImage:        'radial-gradient(ellipse 80% 65% at 50% 38%, black 25%, transparent 100%)',
          WebkitMaskImage:  'radial-gradient(ellipse 80% 65% at 50% 38%, black 25%, transparent 100%)',
        }}
      />

      {/* ── Floating particles ── */}
      <div aria-hidden="true" className="absolute inset-0 overflow-hidden pointer-events-none">
        {particles.map(p => (
          <div
            key={p.id}
            className="absolute rounded-full"
            style={{
              left:            p.left,
              bottom:          '-8px',
              width:           p.size,
              height:          p.size,
              backgroundColor: 'var(--brand-orange)',
              opacity:         p.opacity,
              animation:       `hero-float-particle ${p.duration} ease-in-out ${p.delay} infinite`,
            }}
          />
        ))}
      </div>

      {/* ── Main content ── */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-36">
        <div className="text-center space-y-7">

          {/* Badge */}
          <div style={entrance(0)}>
            <div
              className="inline-flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-semibold"
              style={{
                background:  'rgba(194,79,0,0.13)',
                border:      '1px solid rgba(194,79,0,0.32)',
                color:       '#FF7A33',
              }}
            >
              <span role="img" aria-label="fire">🔥</span>
              <span>Trending Now in the Philippines</span>
            </div>
          </div>

          {/* Headline — uses entranceSolid so it's visible from first paint (LCP) */}
          <h1
            className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight"
            style={{ color: '#ffffff', ...entranceSolid(150) }}
          >
            Discover Viral{' '}
            <span style={{ color: '#FF7A33' }}>Shopee Finds</span>
          </h1>

          {/* Subheadline */}
          <p
            className="text-lg md:text-xl max-w-3xl mx-auto leading-relaxed"
            style={{ color: 'rgba(255,255,255,0.62)', ...entranceSolid(300) }}
          >
            Discover the fastest-moving reward pages, giveaways, and sulit finds on smartly.sale.
            Start with the highest-intent offers, then browse product deals after.
          </p>

          {/* CTA Buttons */}
          <div
            className="flex flex-col sm:flex-row justify-center items-center gap-3 pt-2"
            style={entranceSolid(500)}
          >
            <a
              href={`${baseUrl}/earn-gcash`}
              className="inline-flex items-center justify-center px-10 py-4 font-bold rounded-full text-lg transition-all duration-200 hover:-translate-y-0.5"
              style={{
                background:  '#C24F00',
                color:       '#ffffff',
                boxShadow:   '0 4px 28px rgba(194,79,0,0.5)',
              }}
              onMouseEnter={e => (e.currentTarget.style.background = '#A84400')}
              onMouseLeave={e => (e.currentTarget.style.background = '#C24F00')}
            >
              <ShoppingBag className="w-5 h-5 mr-2" />
              Earn GCash Now
            </a>
            <a
              href={`${baseUrl}/products`}
              className="inline-flex items-center justify-center px-8 py-4 font-semibold rounded-full text-lg transition-all duration-200 hover:-translate-y-0.5"
              style={{
                background:    'rgba(255,255,255,0.07)',
                color:         'rgba(255,255,255,0.88)',
                border:        '1px solid rgba(255,255,255,0.15)',
                backdropFilter:'blur(8px)',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background    = 'rgba(255,255,255,0.12)';
                e.currentTarget.style.borderColor   = 'rgba(194,79,0,0.5)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background    = 'rgba(255,255,255,0.07)';
                e.currentTarget.style.borderColor   = 'rgba(255,255,255,0.15)';
              }}
            >
              Browse Deals
            </a>
          </div>

          {/* Stats with counter animation */}
          <div
            className="grid grid-cols-3 gap-4 md:gap-10 max-w-lg mx-auto pt-8"
            style={entrance(700)}
          >
            {STATS.map((stat, i) => (
              <div key={i} className="text-center">
                <div
                  className="text-3xl md:text-4xl font-bold tabular-nums"
                  style={{ color: '#FF7A33' }}
                >
                  {stat.display(counts[i])}
                </div>
                <div className="text-sm md:text-base mt-1" style={{ color: 'rgba(255,255,255,0.48)' }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>

          {/* Trust strip */}
          <div
            className="pt-2 text-sm flex flex-wrap justify-center items-center gap-2"
            style={{ color: 'rgba(255,255,255,0.38)', ...entrance(900) }}
          >
            <span>🎵 As seen on TikTok</span>
            <span style={{ color: 'rgba(255,255,255,0.18)' }}>•</span>
            <span>📱 Shopee PH Affiliate Partner</span>
            <span style={{ color: 'rgba(255,255,255,0.18)' }}>•</span>
            <span>🇵🇭 Made for Filipinos</span>
          </div>
        </div>
      </div>

      {/* ── Scroll indicator ── */}
      <div
        aria-hidden="true"
        className="absolute bottom-7 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1"
        style={{
          opacity:    show ? 0.55 : 0,
          transition: 'opacity 0.6s ease-out 1100ms',
        }}
      >
        <span
          className="text-xs uppercase tracking-widest"
          style={{ color: 'rgba(255,255,255,0.35)', letterSpacing: '0.13em' }}
        >
          Scroll
        </span>
        <ChevronDown
          className="w-5 h-5"
          style={{
            color:     '#C24F00',
            animation: 'hero-chevron-bounce 2.2s ease-in-out infinite',
          }}
        />
      </div>
    </section>
  );
};

export default Hero;
