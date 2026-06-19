import { useState, useEffect, useRef } from 'react';

// ── Generate a short referral code from random chars ─────────────────────────
function generateRefCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
  let code = '';
  for (let i = 0; i < 8; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return code;
}

function getOrCreateRefCode(): string {
  if (typeof window === 'undefined') return '';
  let code = localStorage.getItem('smartly_ref_code');
  if (!code) {
    code = generateRefCode();
    localStorage.setItem('smartly_ref_code', code);
  }
  return code;
}

function getReferralStats(): { clicks: number; referrals: number } {
  if (typeof window === 'undefined') return { clicks: 0, referrals: 0 };
  return {
    clicks: parseInt(localStorage.getItem('smartly_ref_clicks') || '0', 10),
    referrals: parseInt(localStorage.getItem('smartly_ref_count') || '0', 10),
  };
}

function trackIncomingReferral() {
  if (typeof window === 'undefined') return;
  const params = new URLSearchParams(window.location.search);
  const ref = params.get('ref');
  if (ref && ref !== localStorage.getItem('smartly_ref_code')) {
    localStorage.setItem('smartly_referred_by', ref);
    const existing = parseInt(localStorage.getItem('smartly_ref_count') || '0', 10);
    localStorage.setItem('smartly_ref_count', String(existing + 1));
  }
}

// ── Share platform configs ───────────────────────────────────────────────────
interface SharePlatform {
  name: string;
  color: string;
  icon: JSX.Element;
  action: 'url' | 'copy';
  getUrl?: (url: string, text: string) => string;
}

const SHARE_PLATFORMS: SharePlatform[] = [
  {
    name: 'Facebook',
    color: 'bg-[#1877f2] hover:bg-[#166fe5]',
    action: 'url',
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
      </svg>
    ),
    getUrl: (url, text) =>
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(text)}`,
  },
  {
    name: 'Messenger',
    color: 'bg-[#0084ff] hover:bg-[#0070e0]',
    action: 'url',
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 0C5.373 0 0 4.974 0 11.111c0 3.497 1.745 6.616 4.472 8.652V24l4.086-2.242c1.09.301 2.246.464 3.442.464 6.627 0 12-4.974 12-11.111S18.627 0 12 0zm1.193 14.963l-3.056-3.26-5.963 3.26L10.733 8.2l3.13 3.26 5.889-3.26-6.559 6.763z"/>
      </svg>
    ),
    getUrl: (url) =>
      `https://www.facebook.com/dialog/send?link=${encodeURIComponent(url)}&app_id=966242223397117&redirect_uri=${encodeURIComponent(url)}`,
  },
  {
    name: 'WhatsApp',
    color: 'bg-[#25d366] hover:bg-[#1fb855]',
    action: 'url',
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
      </svg>
    ),
    getUrl: (url, text) =>
      `https://api.whatsapp.com/send?text=${encodeURIComponent(text + ' ' + url)}`,
  },
  {
    name: 'X / Twitter',
    color: 'bg-black hover:bg-gray-800',
    action: 'url',
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
      </svg>
    ),
    getUrl: (url, text) =>
      `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`,
  },
  {
    name: 'Telegram',
    color: 'bg-[#0088cc] hover:bg-[#0077b5]',
    action: 'url',
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M11.944 0A12 12 0 000 12a12 12 0 0012 12 12 12 0 0012-12A12 12 0 0012 0h-.056zm5.814 7.523s.18-.674-.39-.025l-8.22 5.138a.572.572 0 01-.12.04l-.022.01-1.384.467s-.514.196-.476-.27l.8-3.018s5.652-5.14 5.88-5.356c.228-.216.067-.324-.18-.108L8.1 12.236l-3.3-1.1s-.508-.177-.556-.558c-.048-.381.573-.587.573-.587l13.07-5.056s1.072-.468.872.588z"/>
      </svg>
    ),
    getUrl: (url, text) =>
      `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`,
  },
  {
    name: 'Instagram',
    color: 'bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] hover:opacity-90',
    action: 'copy', // Instagram has no direct share URL — copies link so user can paste in stories/DMs
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
      </svg>
    ),
  },
  {
    name: 'TikTok',
    color: 'bg-[#010101] hover:bg-[#333]',
    action: 'copy', // TikTok has no web share URL — copies link so user can paste in bio/DMs
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
      </svg>
    ),
  },
];

export default function ReferralShare() {
  const [refCode, setRefCode] = useState('');
  const [copied, setCopied] = useState(false);
  const [copiedPlatform, setCopiedPlatform] = useState('');
  const [stats, setStats] = useState({ clicks: 0, referrals: 0 });
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    trackIncomingReferral();
    setRefCode(getOrCreateRefCode());
    setStats(getReferralStats());
  }, []);

  const referralUrl = refCode ? `https://smartly.sale/earn-gcash?ref=${refCode}` : 'https://smartly.sale/earn-gcash';
  const shareText = 'Kumita ng GCash online nang libre! Sumali na sa verified reward offers sa smartly.sale';

  async function copyToClipboard() {
    try {
      await navigator.clipboard.writeText(referralUrl);
    } catch {
      inputRef.current?.select();
      document.execCommand('copy');
    }
  }

  async function handleCopy() {
    await copyToClipboard();
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  }

  function trackClick() {
    const clicks = parseInt(localStorage.getItem('smartly_ref_clicks') || '0', 10) + 1;
    localStorage.setItem('smartly_ref_clicks', String(clicks));
    setStats(prev => ({ ...prev, clicks }));
  }

  async function handleShare(platform: SharePlatform) {
    if (platform.action === 'copy') {
      // For platforms without a web share URL (Instagram, TikTok) — copy the link
      await copyToClipboard();
      setCopiedPlatform(platform.name);
      setTimeout(() => setCopiedPlatform(''), 2500);
      trackClick();
      return;
    }
    if (platform.getUrl) {
      const url = platform.getUrl(referralUrl, shareText);
      window.open(url, '_blank', 'noopener,noreferrer,width=600,height=500');
      trackClick();
    }
  }

  async function handleNativeShare() {
    if (!navigator.share) return;
    try {
      await navigator.share({
        title: 'Earn GCash Online — Libre!',
        text: shareText,
        url: referralUrl,
      });
      trackClick();
    } catch { /* user cancelled */ }
  }

  const canNativeShare = typeof navigator !== 'undefined' && !!navigator.share;

  return (
    <div className="bg-gradient-to-br from-blue-50 via-white to-indigo-50 border border-blue-200 rounded-2xl p-6 sm:p-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-wide mb-4">
          Referral Program
        </div>
        <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 mb-4">
          I-share, Kumita ng Bonus Rewards!
        </h2>
        <p className="text-sm text-gray-500 max-w-md mx-auto leading-relaxed">
          Mag-invite ng kaibigan gamit ang iyong referral link. Mas maraming nag-join, mas maraming reward para sa iyo!
        </p>
      </div>

      {/* Referral Link */}
      <div className="mb-8">
        <label className="block text-xs font-semibold text-gray-600 mb-3 uppercase tracking-wide">
          Your Referral Link
        </label>
        <div className="flex gap-2">
          <input
            ref={inputRef}
            type="text"
            readOnly
            value={referralUrl || 'Generating your link...'}
            className={`flex-1 min-w-0 bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm font-mono select-all focus:outline-none focus:ring-2 focus:ring-blue-300 ${referralUrl ? 'text-gray-700' : 'text-gray-400'}`}
            onClick={e => referralUrl && (e.target as HTMLInputElement).select()}
          />
          <button
            onClick={handleCopy}
            className={`px-5 py-3 rounded-xl font-bold text-sm transition-all active:scale-95 flex items-center gap-2 whitespace-nowrap ${
              copied
                ? 'bg-emerald-500 text-white'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            {copied ? (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Copied!
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                Copy
              </>
            )}
          </button>
        </div>
      </div>

      {/* Share Platforms */}
      <div className="mb-8">
        <p className="text-xs font-semibold text-gray-600 mb-4 uppercase tracking-wide">Share sa Social Media</p>
        <div className="grid grid-cols-4 sm:grid-cols-7 gap-2.5">
          {SHARE_PLATFORMS.map(platform => (
            <button
              key={platform.name}
              onClick={() => handleShare(platform)}
              className={`${platform.color} text-white rounded-xl py-3 px-2 flex flex-col items-center gap-1.5 transition-all active:scale-95 hover:shadow-md relative`}
            >
              {platform.icon}
              <span className="text-[11px] font-semibold leading-tight">{platform.name}</span>
              {copiedPlatform === platform.name && (
                <span className="absolute -top-2 left-1/2 -translate-x-1/2 bg-emerald-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap shadow-lg">
                  Link Copied!
                </span>
              )}
            </button>
          ))}
        </div>
        {/* Hint for Instagram/TikTok */}
        <p className="text-[11px] text-gray-400 mt-3 text-center">
          Para sa Instagram at TikTok, ma-copy ang link mo — i-paste sa Stories, bio, o DMs.
        </p>
      </div>

      {/* Native Share (mobile) */}
      {canNativeShare && (
        <button
          onClick={handleNativeShare}
          className="w-full mb-8 py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold text-sm rounded-xl transition-all active:scale-[0.98] flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
          </svg>
          Share to Any App (Viber, Line, etc.)
        </button>
      )}

      {/* Referral Stats */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white border border-gray-100 rounded-xl p-4 text-center">
          <div className="text-2xl font-extrabold text-blue-600">{stats.clicks}</div>
          <div className="text-xs text-gray-500 mt-2">Link Shares</div>
        </div>
        <div className="bg-white border border-gray-100 rounded-xl p-4 text-center">
          <div className="text-2xl font-extrabold text-emerald-600">{stats.referrals}</div>
          <div className="text-xs text-gray-500 mt-2">Friends Joined</div>
        </div>
      </div>
    </div>
  );
}
