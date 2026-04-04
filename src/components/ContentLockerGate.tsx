import { useState, useEffect } from 'react';

// ─── CPABuild offer shape ──────────────────────────────────────────────────────
interface CPAOffer {
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
  link?: string;
  epc?: string | number;
}

interface NormalizedOffer {
  id: string;
  name: string;
  anchor: string;
  conversion: string;
  payout: number;
  image: string;
  link: string;
}

function normalize(o: CPAOffer): NormalizedOffer {
  return {
    id: String(o.id ?? o.offer_id ?? Math.random()),
    name: o.name ?? 'Exclusive Offer',
    anchor: o.anchor ?? o.name ?? 'Claim your reward now',
    conversion: o.conversion ?? 'Complete the task to earn',
    payout: parseFloat(String(o.user_payout ?? o.payout ?? '0')),
    image: o.network_icon ?? o.picture ?? o.image ?? '',
    link: o.url ?? o.link ?? '#',
  };
}

// ─── Unlocked content item ─────────────────────────────────────────────────────
export interface UnlockedItem {
  icon: string;
  title: string;
  body: string;
}

// ─── Props ────────────────────────────────────────────────────────────────────
interface Props {
  initialOffers?: unknown[];
  s1?: string;
  s2?: string;
  /** Theme accent colour — "blue" | "orange" | "green" | "purple" */
  accent?: string;
  lockedLabel?: string;
  lockedDescription?: string;
  unlockedTitle?: string;
  unlockedItems?: UnlockedItem[];
  lockedEmoji?: string;
}

// ─── Accent palette (inline styles avoid Tailwind purge issues) ───────────────
const ACCENTS: Record<string, {
  gradFrom: string; gradTo: string;
  btnBg: string; btnHover: string;
  badgeBg: string; badgeText: string;
  ring: string;
}> = {
  blue:   { gradFrom: '#1a73e8', gradTo: '#1557b0', btnBg: '#1a73e8', btnHover: '#1557b0', badgeBg: '#dbeafe', badgeText: '#1e40af', ring: '#93c5fd' },
  orange: { gradFrom: '#f97316', gradTo: '#ea580c', btnBg: '#f97316', btnHover: '#ea580c', badgeBg: '#ffedd5', badgeText: '#9a3412', ring: '#fdba74' },
  green:  { gradFrom: '#16a34a', gradTo: '#15803d', btnBg: '#16a34a', btnHover: '#15803d', badgeBg: '#dcfce7', badgeText: '#166534', ring: '#86efac' },
  purple: { gradFrom: '#7c3aed', gradTo: '#6d28d9', btnBg: '#7c3aed', btnHover: '#6d28d9', badgeBg: '#ede9fe', badgeText: '#5b21b6', ring: '#c4b5fd' },
};
function ac(accent: string) {
  return ACCENTS[accent] ?? ACCENTS['purple'];
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────
function SkeletonRow() {
  return (
    <div className="flex items-center gap-3 bg-white rounded-xl p-4 border border-gray-100 animate-pulse">
      <div className="w-12 h-12 rounded-lg bg-gray-200 flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="h-3 bg-gray-200 rounded w-1/3" />
        <div className="h-3 bg-gray-200 rounded w-2/3" />
      </div>
      <div className="w-20 h-10 bg-gray-200 rounded-lg flex-shrink-0" />
    </div>
  );
}

// ─── Inline-styled CTA button ─────────────────────────────────────────────────
function AccentButton({
  onClick,
  children,
  palette,
  size = 'sm',
  fullWidth = false,
}: {
  onClick: () => void;
  children: React.ReactNode;
  palette: ReturnType<typeof ac>;
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}) {
  const [hover, setHover] = useState(false);
  const pad = size === 'lg' ? '12px 28px' : size === 'md' ? '10px 20px' : '8px 16px';
  const fontSize = size === 'lg' ? '15px' : size === 'md' ? '13px' : '12px';
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        background: hover ? palette.btnHover : palette.btnBg,
        color: '#ffffff',
        fontWeight: 700,
        fontSize,
        padding: pad,
        borderRadius: '10px',
        border: 'none',
        cursor: 'pointer',
        transition: 'background 0.15s, transform 0.1s, box-shadow 0.15s',
        boxShadow: hover ? '0 4px 12px rgba(0,0,0,0.25)' : '0 2px 6px rgba(0,0,0,0.18)',
        transform: hover ? 'translateY(-1px)' : 'none',
        flexShrink: 0,
        width: fullWidth ? '100%' : undefined,
        whiteSpace: 'nowrap',
      }}
    >
      {children}
    </button>
  );
}

// ─── Main component ────────────────────────────────────────────────────────────
export default function ContentLockerGate({
  initialOffers = [],
  s1 = 'locker',
  s2 = 'organic',
  accent = 'purple',
  lockedLabel = 'Exclusive Gaming Guide',
  lockedDescription = 'Complete 1 quick offer to unlock your free guide instantly.',
  unlockedTitle = 'Your Guide is Unlocked! 🎉',
  unlockedItems = [],
  lockedEmoji = '🔒',
}: Props) {
  const STORAGE_KEY = `locker_unlocked_${s1}`;

  const [offers, setOffers] = useState<NormalizedOffer[]>(() =>
    (initialOffers as CPAOffer[]).map(normalize),
  );
  const [loading, setLoading] = useState(initialOffers.length === 0);
  const [unlocked, setUnlocked] = useState(false);
  const [justUnlocked, setJustUnlocked] = useState(false);
  const [claimedId, setClaimedId] = useState<string | null>(null);

  // Check sessionStorage on mount
  useEffect(() => {
    try {
      if (sessionStorage.getItem(STORAGE_KEY) === '1') {
        setUnlocked(true);
      }
    } catch {}
  }, []);

  // Client-side fetch if no SSR offers
  useEffect(() => {
    if (initialOffers.length > 0) return;
    fetch(`/api/cpabuild-proxy?s1=${encodeURIComponent(s1)}&s2=${encodeURIComponent(s2)}`)
      .then((r) => r.json())
      .then((data: unknown) => {
        const raw: CPAOffer[] = ((data as { offers?: CPAOffer[] }).offers) ?? [];
        setOffers(raw.map(normalize));
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  function handleClaim(offer: NormalizedOffer) {
    if (typeof window !== 'undefined' && (window as any).fbq) {
      (window as any).fbq('track', 'Lead', {
        content_name: offer.name,
        value: offer.payout,
        currency: 'USD',
      });
    }
    setClaimedId(offer.id);
    window.open(offer.link, '_blank', 'noopener,noreferrer');
    setTimeout(() => {
      setUnlocked(true);
      setJustUnlocked(true);
      try { sessionStorage.setItem(STORAGE_KEY, '1'); } catch {}
    }, 1200);
  }

  const palette = ac(accent);

  // ── UNLOCKED STATE ───────────────────────────────────────────────────────────
  if (unlocked) {
    return (
      <div className="max-w-2xl mx-auto">
        {justUnlocked && (
          <div className="bg-green-50 border border-green-200 rounded-2xl p-5 mb-6 flex items-start gap-3">
            <span className="text-2xl">✅</span>
            <div>
              <p className="font-bold text-green-800 text-sm">Offer submitted! Check your inbox or the offer page.</p>
              <p className="text-xs text-green-600 mt-0.5">Your guide is now fully unlocked below. Enjoy!</p>
            </div>
          </div>
        )}

        {/* Unlocked guide card */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-md overflow-hidden mb-8">
          <div
            style={{ background: `linear-gradient(135deg, ${palette.gradFrom}, ${palette.gradTo})` }}
            className="px-6 py-5"
          >
            <p className="text-white font-extrabold text-xl tracking-tight">{unlockedTitle}</p>
            <p className="text-white/75 text-xs mt-0.5">All methods below are legit and verified.</p>
          </div>
          <div className="p-6 space-y-5">
            {unlockedItems.map((item, i) => (
              <div key={i} className="flex gap-4 group">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                  style={{ background: palette.badgeBg }}
                >
                  {item.icon}
                </div>
                <div className="flex-1">
                  <p className="font-bold text-gray-900 text-sm mb-0.5">{item.title}</p>
                  <p className="text-sm text-gray-500 leading-relaxed">{item.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* More offers */}
        {offers.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
              </span>
              <p className="text-xs font-bold text-gray-600 uppercase tracking-wide">More Rewards Available</p>
            </div>
            <div className="space-y-3">
              {offers.slice(0, 3).map((offer) => (
                <div
                  key={offer.id}
                  className="flex items-center gap-3 bg-white rounded-xl p-4 border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="w-11 h-11 rounded-lg overflow-hidden border border-gray-100 flex-shrink-0 bg-gray-50">
                    {offer.image ? (
                      <img src={offer.image} alt={offer.name} className="w-full h-full object-cover" width={44} height={44} />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-lg">🎁</div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-gray-900 truncate">{offer.anchor}</p>
                    <p className="text-[11px] text-gray-400 truncate mt-0.5">{offer.conversion}</p>
                  </div>
                  <AccentButton
                    onClick={() => window.open(offer.link, '_blank', 'noopener,noreferrer')}
                    palette={palette}
                    size="sm"
                  >
                    Claim →
                  </AccentButton>
                </div>
              ))}
            </div>
            <p className="text-center text-[11px] text-gray-300 mt-4">
              🔒 SSL Secured · ✅ Verified offers · No credit card needed
            </p>
          </div>
        )}
      </div>
    );
  }

  // ── LOCKED STATE ─────────────────────────────────────────────────────────────
  return (
    <div className="max-w-2xl mx-auto">

      {/* Lock hero card */}
      <div
        className="relative rounded-2xl p-7 text-center text-white mb-6 shadow-xl overflow-hidden"
        style={{ background: `linear-gradient(135deg, ${palette.gradFrom}, ${palette.gradTo})` }}
      >
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-8 -left-8 w-36 h-36 bg-black/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative">
          <div className="text-5xl mb-4">{lockedEmoji}</div>
          <p className="font-extrabold text-xl mb-2 leading-tight">{lockedLabel}</p>
          <p className="text-white/75 text-sm max-w-xs mx-auto leading-relaxed">{lockedDescription}</p>

          {/* Steps */}
          <div className="flex items-center justify-center gap-2 mt-6">
            {['Pick offer', 'Complete task', 'Unlock guide'].map((step, i) => (
              <div key={i} className="flex items-center gap-1.5">
                <div className="w-6 h-6 rounded-full bg-white/20 text-[11px] font-bold flex items-center justify-center border border-white/30">
                  {i + 1}
                </div>
                <span className="text-white/70 text-[11px] hidden sm:block">{step}</span>
                {i < 2 && <span className="text-white/30 text-xs mx-0.5">›</span>}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Blurred content preview */}
      <div className="relative mb-6">
        <div className="bg-white rounded-2xl border border-gray-100 p-5 blur-sm pointer-events-none select-none" aria-hidden="true">
          <div className="space-y-4">
            {(unlockedItems.length > 0 ? unlockedItems : [
              { icon: '💎', title: 'Secret Method #1', body: 'Lorem ipsum dolor sit amet consectetur adipiscing elit.' },
              { icon: '🎮', title: 'Secret Method #2', body: 'Sed do eiusmod tempor incididunt ut labore et dolore.' },
              { icon: '⚡', title: 'Secret Method #3', body: 'Ut enim ad minim veniam quis nostrud exercitation.' },
            ]).slice(0, 3).map((item, i) => (
              <div key={i} className="flex gap-3">
                <span className="text-2xl">{item.icon}</span>
                <div className="flex-1">
                  <div className="h-3 bg-gray-300 rounded w-1/3 mb-2" />
                  <div className="h-2.5 bg-gray-200 rounded w-4/5" />
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/60 backdrop-blur-[2px] rounded-2xl">
          <div className="bg-white rounded-xl px-5 py-3 shadow-lg text-center border border-gray-100">
            <span className="text-2xl">🔒</span>
            <p className="text-xs font-bold text-gray-700 mt-1">Complete 1 offer below to unlock</p>
          </div>
        </div>
      </div>

      {/* Live badge */}
      <div className="flex items-center gap-2 mb-2">
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400" />
        </span>
        <p className="text-sm font-bold text-gray-800">
          {loading ? 'Loading offers…' : `${offers.length} Offer${offers.length !== 1 ? 's' : ''} Available — Pick One to Unlock`}
        </p>
      </div>
      <p className="text-xs text-gray-400 mb-4">Geo-targeted for your location. Free to join — no credit card needed.</p>

      {/* Offer list */}
      <div className="space-y-3">
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => <SkeletonRow key={i} />)
        ) : offers.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <p className="text-5xl mb-3">🌍</p>
            <p className="font-semibold text-gray-600">No offers in your region right now</p>
            <p className="text-xs mt-1">Check back soon — new offers are added daily.</p>
          </div>
        ) : (
          offers.map((offer, i) => (
            <div
              key={offer.id}
              className={`flex items-center gap-3 bg-white rounded-xl p-4 border transition-all duration-200 shadow-sm hover:shadow-md
                ${i === 0 ? 'border-amber-300 ring-1 ring-amber-200' : 'border-gray-100 hover:border-gray-200'}
                ${claimedId === offer.id ? 'opacity-50 pointer-events-none' : ''}`}
            >
              {/* Icon */}
              <div className="w-12 h-12 rounded-xl overflow-hidden border border-gray-100 flex-shrink-0 bg-gray-50">
                {offer.image ? (
                  <img src={offer.image} alt={offer.name} className="w-full h-full object-cover" width={48} height={48} />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-xl">🎁</div>
                )}
              </div>

              {/* Text */}
              <div className="flex-1 min-w-0">
                {i === 0 && (
                  <span className="inline-block text-[10px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full mb-1">
                    ⭐ TOP PICK
                  </span>
                )}
                <p className="text-sm font-bold text-gray-900 line-clamp-1">{offer.anchor}</p>
                <p className="text-[11px] text-gray-400 line-clamp-1 mt-0.5">{offer.conversion}</p>
              </div>

              {/* CTA */}
              <AccentButton
                onClick={() => handleClaim(offer)}
                palette={palette}
                size="md"
              >
                {claimedId === offer.id ? '✓ Done' : 'Unlock →'}
              </AccentButton>
            </div>
          ))
        )}
      </div>

      {/* Trust line */}
      <p className="text-center text-[11px] text-gray-300 mt-6 leading-relaxed">
        🔒 SSL Secured · ✅ Verified offers · No credit card needed · Free to join
      </p>
    </div>
  );
}
