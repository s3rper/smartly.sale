import { useState, useEffect } from 'react';
import ShareCard from './ShareCard';

// ─── Real CPABuild offer shape ────────────────────────────────────────────────
interface CPAOffer {
  id?: string | number;
  offer_id?: string | number;
  name?: string;
  anchor?: string;          // tagline / hook copy
  conversion?: string;      // what the user must do
  payout?: string | number;
  user_payout?: string | number;
  network_icon?: string;    // 200×200 offer icon
  picture?: string;
  image?: string;
  url?: string;
  link?: string;
  epc?: string | number;
  category_id?: string;
  category?: string;
  url_domain?: string;
}

interface NormalizedOffer {
  id: string;
  name: string;       // "Prizebox - Visa 500"
  anchor: string;     // "Manalo ng $500 VISA card!"
  conversion: string; // "Complete with valid information"
  payout: number;
  image: string;
  link: string;
  category: string;
}

function inferCategory(o: CPAOffer): string {
  const n = (o.name ?? '').toLowerCase();
  const c = (o.conversion ?? '').toLowerCase();
  if (n.includes('prizebox') || n.includes('prize')) return 'Prize';
  if (n.includes('rewardis') || n.includes('reward')) return 'Reward';
  if (n.includes('clickbox') || c.includes('survey')) return 'Survey';
  if (n.includes('spin')) return 'Spin';
  return 'Offer';
}

function normalizeOffer(o: CPAOffer): NormalizedOffer {
  return {
    id: String(o.id ?? o.offer_id ?? Math.random()),
    name: o.name ?? 'Exclusive Offer',
    anchor: o.anchor ?? o.name ?? 'Claim your reward now',
    conversion: o.conversion ?? 'Complete the task to earn',
    payout: parseFloat(String(o.user_payout ?? o.payout ?? '0')),
    image: o.network_icon ?? o.picture ?? o.image ?? '',
    link: o.url ?? o.link ?? '#',
    category: inferCategory(o),
  };
}

// ─── Category config ──────────────────────────────────────────────────────────
const CATEGORY_CONFIG: Record<string, { bg: string; text: string; icon: string }> = {
  Prize:  { bg: 'bg-amber-50  border-amber-200',  text: 'text-amber-700',  icon: '🏆' },
  Reward: { bg: 'bg-emerald-50 border-emerald-200', text: 'text-emerald-700', icon: '🎁' },
  Survey: { bg: 'bg-blue-50   border-blue-200',   text: 'text-blue-700',   icon: '📋' },
  Spin:   { bg: 'bg-purple-50  border-purple-200',  text: 'text-purple-700',  icon: '🎡' },
  Offer:  { bg: 'bg-gray-50    border-gray-200',    text: 'text-gray-700',    icon: '⚡' },
};
function catCfg(cat: string) {
  return CATEGORY_CONFIG[cat] ?? CATEGORY_CONFIG['Offer'];
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 animate-pulse">
      <div className="h-1.5 bg-gradient-to-r from-gray-200 to-gray-100" />
      <div className="p-5 flex gap-4">
        <div className="w-16 h-16 rounded-xl bg-gray-200 flex-shrink-0" />
        <div className="flex-1 space-y-2.5 pt-1">
          <div className="h-3 bg-gray-200 rounded w-1/3" />
          <div className="h-4 bg-gray-200 rounded w-4/5" />
          <div className="h-3 bg-gray-200 rounded w-2/3" />
        </div>
      </div>
      <div className="px-5 pb-5">
        <div className="h-11 bg-gray-200 rounded-xl" />
      </div>
    </div>
  );
}

// ─── Offer Card ───────────────────────────────────────────────────────────────
function OfferCard({
  offer,
  index,
  onClaim,
  claimed,
}: {
  offer: NormalizedOffer;
  index: number;
  onClaim: () => void;
  claimed: boolean;
}) {
  const cfg = catCfg(offer.category);
  const isTop = index === 0;

  return (
    <div
      className={`relative bg-white rounded-2xl overflow-hidden border transition-all duration-200 flex flex-col
        ${isTop ? 'border-amber-300 shadow-lg shadow-amber-100/60' : 'border-gray-100 shadow-sm hover:shadow-md hover:border-gray-200'}
        ${claimed ? 'opacity-50 pointer-events-none' : ''}`}
    >
      {/* Top accent bar */}
      <div className={`h-1 ${isTop ? 'bg-gradient-to-r from-amber-400 to-orange-400' : 'bg-gradient-to-r from-indigo-500 to-purple-500'}`} />

      {/* Top badge */}
      {isTop && (
        <div className="absolute top-3 right-3 bg-amber-400 text-amber-900 text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm tracking-wide uppercase">
          Top Pick
        </div>
      )}

      {/* Card body */}
      <div className="p-5 flex gap-4 flex-1">
        {/* Icon */}
        <div className={`w-16 h-16 rounded-xl flex-shrink-0 border overflow-hidden ${cfg.bg}`}>
          {offer.image ? (
            <img
              src={offer.image}
              alt={offer.name}
              width={64}
              height={64}
              className="w-full h-full object-cover"
              loading={index < 3 ? 'eager' : 'lazy'}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-2xl">
              {cfg.icon}
            </div>
          )}
        </div>

        {/* Text */}
        <div className="flex flex-col gap-1 flex-1 min-w-0">
          {/* Category pill */}
          <div className="flex items-center gap-2">
            <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full border ${cfg.bg} ${cfg.text}`}>
              <span>{cfg.icon}</span>
              <span>{offer.category}</span>
            </span>
          </div>

          {/* Anchor / hook */}
          <p className="font-bold text-gray-900 text-sm leading-snug line-clamp-2">
            {offer.anchor}
          </p>

          {/* Requirements */}
          <p className="text-xs text-gray-400 flex items-center gap-1">
            <svg className="w-3 h-3 text-emerald-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
            </svg>
            <span className="truncate">{offer.conversion}</span>
          </p>
        </div>
      </div>

      {/* CTA */}
      <div className="px-5 pb-5">
        <button
          onClick={onClaim}
          className={`w-full py-3 rounded-xl text-sm font-bold tracking-wide transition-all duration-150 active:scale-[0.98]
            ${isTop
              ? 'bg-gradient-to-r from-amber-400 to-orange-400 hover:from-amber-500 hover:to-orange-500 text-white shadow-md shadow-amber-200'
              : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-md shadow-indigo-200/50'
            }`}
        >
          {claimed ? '✓ Claimed' : 'Claim Reward →'}
        </button>
      </div>
    </div>
  );
}

// ─── Stat Badge ───────────────────────────────────────────────────────────────
function StatBadge({ icon, label }: { icon: string; label: string }) {
  return (
    <div className="flex items-center gap-1.5 text-white/80 text-xs">
      <span>{icon}</span>
      <span>{label}</span>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
interface Props {
  initialOffers?: CPAOffer[];
  s1?: string;
  s2?: string;
}

export default function CPAOffersWall({ initialOffers = [], s1 = '', s2 = '' }: Props) {
  const [offers, setOffers] = useState<NormalizedOffer[]>(() =>
    initialOffers.map(normalizeOffer)
  );
  const [loading, setLoading] = useState(initialOffers.length === 0);
  const [claimedIds, setClaimedIds] = useState<Set<string>>(new Set());
  const [shareOffer, setShareOffer] = useState<NormalizedOffer | null>(null);

  useEffect(() => {
    if (initialOffers.length > 0) return;
    const params = new URLSearchParams({ s1, s2 });
    fetch(`/api/cpabuild-proxy?${params}`)
      .then((r) => r.json())
      .then((data: unknown) => {
        const raw: CPAOffer[] = ((data as { offers?: CPAOffer[] }).offers) ?? [];
        setOffers(raw.map(normalizeOffer));
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  function handleClaim(offer: NormalizedOffer) {
    if (typeof window !== 'undefined' && (window as any).fbq) {
      (window as any).fbq('track', 'Lead', {
        content_name: offer.name,
        content_category: offer.category,
        value: offer.payout,
        currency: 'USD',
      });
    }
    setClaimedIds((prev) => new Set(prev).add(offer.id));
    window.open(offer.link, '_blank', 'noopener,noreferrer');
    // Show share card after a short delay so the offer tab has time to open
    setTimeout(() => setShareOffer(offer), 800);
  }

  const offerCount = offers.length;
  const totalPayout = offers.reduce((s, o) => s + o.payout, 0);

  return (
    <>
    {shareOffer && (
      <ShareCard
        prizeName={shareOffer.anchor}
        offerUrl={shareOffer.link}
        onClose={() => setShareOffer(null)}
      />
    )}
    <div className="min-h-screen bg-[#f5f6fa]">

      {/* ── Hero ── */}
      <div className="relative bg-gradient-to-br from-[#1e1b4b] via-[#312e81] to-[#4c1d95] overflow-hidden">
        {/* Decorative blobs */}
        <div className="absolute -top-24 -right-24 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-2xl mx-auto px-5 pt-10 pb-12 text-center">

          {/* Live badge */}
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 mb-5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
            </span>
            <span className="text-white text-xs font-medium tracking-wide">
              {offerCount > 0
                ? `${offerCount} Rewards Available in Your Area`
                : 'Loading available rewards…'}
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight tracking-tight mb-3">
            Exclusive Prizes &<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-orange-300">
              Rewards Near You
            </span>
          </h1>

          <p className="text-white/60 text-sm sm:text-base mb-7 max-w-sm mx-auto">
            Limited-time offers available in your region. Complete simple steps and claim your prize.
          </p>

          {/* Total payout pill */}
          {totalPayout > 0 && (
            <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl px-6 py-3 mb-7">
              <div className="text-left">
                <p className="text-white/60 text-[11px] uppercase tracking-widest font-semibold">Today's Pool</p>
                <p className="text-2xl font-extrabold text-white">${totalPayout.toFixed(2)}</p>
              </div>
              <div className="w-px h-10 bg-white/20" />
              <div className="text-left">
                <p className="text-white/60 text-[11px] uppercase tracking-widest font-semibold">Offers</p>
                <p className="text-2xl font-extrabold text-white">{offerCount}</p>
              </div>
            </div>
          )}

          {/* Trust row */}
          <div className="flex flex-wrap justify-center gap-x-5 gap-y-2">
            <StatBadge icon="🔒" label="SSL Secured" />
            <StatBadge icon="⚡" label="Instant Rewards" />
            <StatBadge icon="✅" label="Verified Offers" />
            <StatBadge icon="🌍" label="50K+ Members" />
          </div>
        </div>
      </div>

      {/* ── How It Works ── */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-2xl mx-auto px-5 py-5 grid grid-cols-3 gap-4 text-center">
          {[
            { step: '1', icon: '👆', label: 'Pick an offer' },
            { step: '2', icon: '✍️', label: 'Complete task' },
            { step: '3', icon: '🏆', label: 'Win your prize' },
          ].map(({ step, icon, label }) => (
            <div key={step} className="flex flex-col items-center gap-1">
              <div className="w-9 h-9 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center text-base">
                {icon}
              </div>
              <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Offers ── */}
      <div className="max-w-2xl mx-auto px-4 py-7">
        {/* Section header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-gray-800">
            Available Offers
            {offerCount > 0 && (
              <span className="ml-2 text-xs font-semibold bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full">
                {offerCount}
              </span>
            )}
          </h2>
          <span className="text-xs text-gray-400">Sorted by value</span>
        </div>

        {loading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : offers.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">🌍</div>
            <p className="font-semibold text-gray-700 text-lg">No offers in your region</p>
            <p className="text-sm text-gray-400 mt-1">New offers are added daily — check back soon.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {offers.map((offer, i) => (
              <OfferCard
                key={offer.id}
                offer={offer}
                index={i}
                onClaim={() => handleClaim(offer)}
                claimed={claimedIds.has(offer.id)}
              />
            ))}
          </div>
        )}
      </div>

      {/* ── Trust footer ── */}
      <div className="bg-white border-t border-gray-100 mt-2 py-6 px-5">
        <div className="max-w-2xl mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center mb-5">
            {[
              { icon: '🔒', title: 'SSL Secured', sub: 'Your data is protected' },
              { icon: '💸', title: 'Real Rewards', sub: 'From verified advertisers' },
              { icon: '📱', title: 'Mobile First', sub: 'Works on any device' },
              { icon: '🌍', title: '50K+ Members', sub: 'Worldwide community' },
            ].map(({ icon, title, sub }) => (
              <div key={title} className="flex flex-col items-center gap-1">
                <span className="text-2xl">{icon}</span>
                <p className="text-xs font-semibold text-gray-700">{title}</p>
                <p className="text-[11px] text-gray-400">{sub}</p>
              </div>
            ))}
          </div>
          <p className="text-center text-[11px] text-gray-300 leading-relaxed">
            Rewards and prizes are provided by third-party advertisers via CPABuild network.
            Availability varies by region. Terms and conditions apply to each individual offer.
          </p>
        </div>
      </div>
    </div>
    </>
  );
}
