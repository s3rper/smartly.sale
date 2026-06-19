import { useState, useEffect, useRef } from 'react';
import ShareCard from './ShareCard';

// ─── CPAGrip offer shape ──────────────────────────────────────────────────────
interface CPAOffer {
  // CPAGrip fields
  offerid?: string | number;
  short_description?: string;
  requirements?: string;
  link?: string;
  offerlink?: string;
  // CPAbuild legacy fields
  id?: string | number;
  offer_id?: string | number;
  name?: string;
  anchor?: string;
  conversion?: string;
  payout?: string | number;
  user_payout?: string | number;
  network_icon?: string;
  picture?: string;
  image?: string;
  url?: string;
  epc?: string | number;
  category_id?: string;
  category?: string;
  url_domain?: string;
}

interface NormalizedOffer {
  id: string;
  name: string;
  anchor: string;
  conversion: string;
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
    id: String(o.offerid ?? o.id ?? o.offer_id ?? Math.random()),
    name: o.name ?? 'Exclusive Offer',
    anchor: o.short_description ?? o.anchor ?? o.name ?? 'Claim your reward now',
    conversion: o.requirements ?? o.conversion ?? 'Complete the task to earn',
    payout: parseFloat(String(o.payout ?? o.user_payout ?? '0')),
    image: o.image ?? o.network_icon ?? o.picture ?? '',
    link: o.link ?? o.offerlink ?? o.url ?? '#',
    category: inferCategory(o),
  };
}

// ─── Deterministic urgency numbers seeded by offer id ────────────────────────
function seededRandom(seed: string): number {
  let h = 0;
  for (let i = 0; i < seed.length; i++) {
    h = Math.imul(31, h) + seed.charCodeAt(i) | 0;
  }
  return Math.abs(h) / 2147483647;
}
function getUrgencyStats(id: string): { claimed: number; left: number } {
  const r = seededRandom(id);
  const claimed = 23 + Math.floor(r * 60);       // 23–82
  const left    = 3  + Math.floor(seededRandom(id + 'l') * 9); // 3–11
  return { claimed, left };
}

// ─── PH proof feed data ───────────────────────────────────────────────────────
const PROOF_NAMES = [
  'Maria','Juan','Ana','Jose','Mariz','Carlo','Liza','Mark','Jenny','Paolo',
  'Cris','Divine','Rommel','Alma','Kris','Renz','Jasmine','Arnel','Pia','Ben',
];
const PROOF_CITIES = [
  'Cebu','Manila','Davao','Quezon City','Iloilo','Cagayan de Oro','Batangas',
  'Pampanga','Baguio','Laguna','Cavite','Zamboanga','Bacolod','Bulacan','Taguig',
];
const PROOF_TEMPLATES = [
  (name: string, city: string) => `${name} from ${city} just claimed their reward`,
  (name: string, city: string) => `${name} from ${city} completed an offer`,
  (name: string, city: string) => `${name} in ${city} unlocked GCash rewards`,
  (name: string, city: string) => `${name} from ${city} just earned their prize`,
];
function generateProofEntry(seed: number) {
  const name = PROOF_NAMES[seed % PROOF_NAMES.length];
  const city = PROOF_CITIES[(seed * 7) % PROOF_CITIES.length];
  const tmpl = PROOF_TEMPLATES[(seed * 3) % PROOF_TEMPLATES.length];
  const mins = 1 + (seed % 12);
  return { text: tmpl(name, city), mins };
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

// ─── Proof Feed Ticker ────────────────────────────────────────────────────────
function ProofTicker() {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const cycle = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setIndex(i => (i + 1) % 20);
        setVisible(true);
      }, 400);
    }, 3500);
    return () => clearInterval(cycle);
  }, []);

  const entry = generateProofEntry(index * 13 + 7);

  return (
    <div className="bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-2.5 flex items-center gap-2.5 mb-4">
      <span className="relative flex h-2 w-2 flex-shrink-0">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
      </span>
      <p
        className="text-xs text-emerald-800 font-medium transition-opacity duration-300"
        style={{ opacity: visible ? 1 : 0 }}
      >
        🎉 {entry.text} · {entry.mins}m ago
      </p>
    </div>
  );
}

// ─── Unlock Incentive Banner (shown after claiming) ───────────────────────────
function UnlockBanner({ nextOffer, onClaim }: { nextOffer: NormalizedOffer; onClaim: () => void }) {
  const [seconds, setSeconds] = useState(30);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (seconds <= 0) { setDone(true); return; }
    const t = setTimeout(() => setSeconds(s => s - 1), 1000);
    return () => clearTimeout(t);
  }, [seconds]);

  const pct = ((30 - seconds) / 30) * 100;

  return (
    <div className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl p-5 mb-4 shadow-lg shadow-emerald-200/50">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0 text-xl">
          🔓
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-white font-bold text-sm leading-snug">
            {done ? '✅ Next reward unlocked!' : `Complete your offer to unlock a higher reward`}
          </p>
          <p className="text-white/80 text-xs mt-0.5 line-clamp-1">
            Next: {nextOffer.anchor}
          </p>
          {!done && (
            <>
              <div className="mt-2 h-1.5 bg-white/20 rounded-full overflow-hidden">
                <div
                  className="h-full bg-white rounded-full transition-all duration-1000"
                  style={{ width: `${pct}%` }}
                />
              </div>
              <p className="text-white/70 text-[11px] mt-1">
                Auto-unlocking in {seconds}s…
              </p>
            </>
          )}
        </div>
      </div>
      {done && (
        <button
          onClick={onClaim}
          className="mt-3 w-full py-2.5 rounded-xl bg-white text-emerald-700 text-sm font-bold tracking-wide transition-all active:scale-[0.98] hover:bg-emerald-50"
        >
          Claim via GCash →
        </button>
      )}
    </div>
  );
}

// ─── Exit Intent Popup ────────────────────────────────────────────────────────
function ExitIntentPopup({ topOffer, onClose, onClaim }: {
  topOffer: NormalizedOffer;
  onClose: () => void;
  onClaim: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-[9998] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-[340px] overflow-hidden"
        style={{ animation: 'shopeePopupIn 0.3s ease-out' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-gradient-to-r from-[#1e1b4b] to-[#4c1d95] px-5 py-4 text-white text-center">
          <button
            onClick={onClose}
            className="absolute top-3 right-3 w-7 h-7 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 text-white text-sm font-bold"
          >✕</button>
          <div className="text-3xl mb-1">⚠️</div>
          <p className="font-extrabold text-base leading-tight">Wait — may unclaimed reward sa area mo!</p>
        </div>
        <div className="px-5 py-4 text-center">
          <p className="text-gray-500 text-xs mb-3">
            ₱{(topOffer.payout * 55).toFixed(0)} worth of GCash rewards ang hindi pa nai-claim ngayon.
          </p>
          <p className="font-bold text-gray-800 text-sm mb-4 line-clamp-2">{topOffer.anchor}</p>
          <button
            onClick={() => { onClaim(); onClose(); }}
            className="w-full py-3 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 active:scale-[0.98] transition-all shadow-md"
          >
            Claim via GCash →
          </button>
          <button onClick={onClose} className="w-full mt-2 text-xs text-gray-400 hover:text-gray-600">
            Hindi, salamat
          </button>
        </div>
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
  const { claimed: claimedCount, left } = getUrgencyStats(offer.id);

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

          {/* ── Urgency row ── */}
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-[10px] text-orange-600 font-semibold bg-orange-50 border border-orange-100 px-1.5 py-0.5 rounded">
              🔥 {claimedCount} claimed today
            </span>
            <span className="text-[10px] text-red-600 font-semibold bg-red-50 border border-red-100 px-1.5 py-0.5 rounded">
              ⏳ {left} slots left
            </span>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="px-5 pb-5">
        <button
          onClick={onClaim}
          style={{ color: '#ffffff' }}
          className={`w-full py-3 rounded-xl text-sm font-bold tracking-wide transition-all duration-150 active:scale-[0.98]
            ${isTop
              ? 'bg-gradient-to-r from-amber-400 to-orange-400 hover:from-amber-500 hover:to-orange-500 shadow-md shadow-amber-200'
              : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-md shadow-indigo-200/50'
            }`}
        >
          {claimed ? '✓ Claimed' : 'Claim via GCash →'}
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

// ─── Shopee product for popup ────────────────────────────────────────────────
interface ShopeeProduct {
  name: string;
  image: string;
  price: number;
  offerLink?: string;
  longLink?: string;
  link?: string;
}

function shopeeImageUrl(hash: string): string {
  return `https://down-ph.img.susercontent.com/file/${hash}_tn`;
}

function getShopeeLink(product: ShopeeProduct): string {
  return product.offerLink || product.longLink || product.link || '#';
}

// ─── Shopee Popup ────────────────────────────────────────────────────────────
function ShopeePopup({ product, onClose }: { product: ShopeeProduct; onClose: () => void }) {
  return (
    <>
    <style>{`@keyframes shopeePopupIn{from{opacity:0;transform:translateY(20px)scale(.95)}to{opacity:1;transform:translateY(0)scale(1)}}`}</style>
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" onClick={onClose}>
      <div
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-[360px] overflow-hidden"
        style={{ animation: 'shopeePopupIn 0.3s ease-out' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-[#ee4d2d] to-[#f56942] px-5 py-3 text-white">
          <button onClick={onClose} className="absolute top-3 right-3 w-7 h-7 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 text-white text-sm font-bold transition-colors">
            ✕
          </button>
          <p className="text-[10px] font-semibold uppercase tracking-wider opacity-80">While you wait for your reward</p>
          <p className="text-sm font-extrabold leading-tight mt-0.5">Deal of the Day on Shopee</p>
        </div>

        {/* Product card */}
        <div className="px-5 py-4">
          <div className="flex gap-3 items-center mb-5">
            <div className="w-[88px] h-[88px] rounded-2xl overflow-hidden border-2 border-orange-100 flex-shrink-0 bg-white">
              <img
                src={shopeeImageUrl(product.image)}
                alt={product.name}
                className="w-full h-full object-cover"
                loading="eager"
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-bold text-gray-900 leading-snug line-clamp-2">{product.name}</p>
              <div className="flex items-baseline gap-1.5 mt-1.5">
                <span className="text-xl font-extrabold text-[#ee4d2d]">₱{product.price.toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-1.5 mt-1">
                <span className="text-[10px] text-emerald-600 font-semibold bg-emerald-50 px-1.5 py-0.5 rounded">Free Shipping</span>
                <span className="text-[10px] text-orange-600 font-semibold bg-orange-50 px-1.5 py-0.5 rounded">Official Store</span>
              </div>
            </div>
          </div>
          <a
            href={getShopeeLink(product)}
            target="_blank"
            rel="noopener noreferrer sponsored"
            onClick={onClose}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              width: '100%',
              padding: '14px 0',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #ee4d2d 0%, #f0613a 100%)',
              color: '#ffffff',
              fontSize: '15px',
              fontWeight: 800,
              textDecoration: 'none',
              boxShadow: '0 4px 14px rgba(238, 77, 45, 0.4)',
              letterSpacing: '0.01em',
            }}
          >
            View Deal on Shopee →
          </a>
          <button onClick={onClose} className="w-full mt-3 text-xs text-gray-400 hover:text-gray-600 transition-colors text-center">
            No thanks, maybe later
          </button>
        </div>
      </div>
    </div>
    </>
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
  const [shopeeProduct, setShopeeProduct] = useState<ShopeeProduct | null>(null);
  const [shopeeProducts, setShopeeProducts] = useState<ShopeeProduct[]>([]);
  // #4 exit intent
  const [exitOffer, setExitOffer] = useState<NormalizedOffer | null>(null);
  const exitFiredRef = useRef(false);
  // #8 unlock incentive: track last claimed offer to show next unlock
  const [unlockOffer, setUnlockOffer] = useState<NormalizedOffer | null>(null);
  const [lastClaimedIndex, setLastClaimedIndex] = useState<number | null>(null);

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

  // Pre-fetch Shopee products for popup
  useEffect(() => {
    fetch('/data/shopee-popup-products.json')
      .then((r) => r.json())
      .then((data) => setShopeeProducts(data as ShopeeProduct[]))
      .catch(() => {});
  }, []);

  // #4 Exit intent — desktop mouseleave, mobile pagehide
  useEffect(() => {
    if (offers.length === 0) return;

    function fireExit() {
      if (exitFiredRef.current) return;
      exitFiredRef.current = true;
      setExitOffer(offers[0]);
    }

    function onMouseLeave(e: MouseEvent) {
      if (e.clientY <= 5) fireExit();
    }
    function onVisibilityChange() {
      if (document.visibilityState === 'hidden') fireExit();
    }

    document.addEventListener('mouseleave', onMouseLeave);
    document.addEventListener('visibilitychange', onVisibilityChange);
    return () => {
      document.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('visibilitychange', onVisibilityChange);
    };
  }, [offers]);

  function handleClaim(offer: NormalizedOffer, index: number) {
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

    // #8 Unlock incentive: point to next unclaimed offer
    const nextIndex = offers.findIndex((o, i) => i > index && !claimedIds.has(o.id));
    if (nextIndex !== -1) {
      setUnlockOffer(offers[nextIndex]);
      setLastClaimedIndex(index);
    }

    // Show Shopee popup after a short delay
    if (shopeeProducts.length > 0) {
      const randomProduct = shopeeProducts[Math.floor(Math.random() * shopeeProducts.length)];
      setTimeout(() => setShopeeProduct(randomProduct), 1200);
    }
    // Show share card after longer delay
    setTimeout(() => setShareOffer(offer), 4000);
  }

  const offerCount = offers.length;
  const totalPayout = offers.reduce((s, o) => s + o.payout, 0);

  return (
    <>
    <style>{`@keyframes shopeePopupIn{from{opacity:0;transform:translateY(20px)scale(.95)}to{opacity:1;transform:translateY(0)scale(1)}}`}</style>

    {/* Exit intent popup */}
    {exitOffer && !shopeeProduct && !shareOffer && (
      <ExitIntentPopup
        topOffer={exitOffer}
        onClose={() => setExitOffer(null)}
        onClaim={() => handleClaim(exitOffer, 0)}
      />
    )}

    {shopeeProduct && (
      <ShopeePopup product={shopeeProduct} onClose={() => setShopeeProduct(null)} />
    )}
    {shareOffer && !shopeeProduct && (
      <ShareCard
        prizeName={shareOffer.anchor}
        offerUrl={shareOffer.link}
        onClose={() => setShareOffer(null)}
      />
    )}
    <div className="bg-[#f5f6fa]">

      {/* ── Hero ── */}
      <div className="relative bg-gradient-to-br from-[#1e1b4b] via-[#312e81] to-[#4c1d95] overflow-hidden">
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
                ? `${offerCount} GCash Rewards Available in Your Area`
                : 'Loading available rewards…'}
            </span>
          </div>

          {/* Headline — h2, not h1: this widget is embedded in pages that already
              have their own page-level <h1>, so it must not introduce a second one. */}
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight tracking-tight mb-3">
            Earn GCash Free —<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-orange-300">
              Prizes Near You Today
            </span>
          </h2>

          <p className="text-white/60 text-sm sm:text-base mb-7 max-w-sm mx-auto">
            Complete simple tasks and receive your GCash payout. Limited slots — claim yours now.
          </p>

          {/* Total payout pill */}
          {totalPayout > 0 && (
            <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl px-6 py-3 mb-7">
              <div className="text-left">
                <p className="text-white/60 text-[11px] uppercase tracking-widest font-semibold">Today's GCash Pool</p>
                <p className="text-2xl font-extrabold text-white">₱{(totalPayout * 55).toFixed(0)}</p>
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
            <StatBadge icon="💸" label="GCash Payouts" />
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
            { step: '3', icon: '💸', label: 'GCash payout' },
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
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-bold text-gray-800">
            Available GCash Offers
            {offerCount > 0 && (
              <span className="ml-2 text-xs font-semibold bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full">
                {offerCount}
              </span>
            )}
          </h2>
          <span className="text-xs text-gray-400">Sorted by value</span>
        </div>

        {/* #2 Proof feed ticker */}
        {!loading && offerCount > 0 && <ProofTicker />}

        {/* #8 Unlock incentive banner */}
        {unlockOffer && (
          <UnlockBanner
            nextOffer={unlockOffer}
            onClaim={() => {
              const idx = offers.findIndex(o => o.id === unlockOffer.id);
              handleClaim(unlockOffer, idx);
              setUnlockOffer(null);
            }}
          />
        )}

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
                onClaim={() => handleClaim(offer, i)}
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
              { icon: '💸', title: 'GCash Ready', sub: 'Direct to your e-wallet' },
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
          <p className="text-center text-[11px] text-gray-400 leading-relaxed">
            Rewards and prizes are provided by third-party advertisers via CPAGrip network.
            Availability varies by region. Terms and conditions apply to each individual offer.
          </p>
        </div>
      </div>
    </div>
    </>
  );
}
