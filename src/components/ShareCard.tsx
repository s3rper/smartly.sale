import { useState, useRef, useEffect } from 'react';

interface Props {
  prizeName: string;
  offerUrl: string;
  pageUrl?: string;
  onClose: () => void;
}

const PAGE_URL = 'smartly.sale/win-free-phone';
const CARD_SIZE = 1080;

function drawCard(canvas: HTMLCanvasElement, prizeName: string, shareUrl: string) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  canvas.width  = CARD_SIZE;
  canvas.height = CARD_SIZE;

  // ── Background gradient ─────────────────────────────────────────────────
  const bg = ctx.createLinearGradient(0, 0, CARD_SIZE, CARD_SIZE);
  bg.addColorStop(0, '#1e1b4b');
  bg.addColorStop(0.5, '#312e81');
  bg.addColorStop(1, '#4c1d95');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, CARD_SIZE, CARD_SIZE);

  // ── Decorative circles ──────────────────────────────────────────────────
  ctx.beginPath();
  ctx.arc(950, 130, 340, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(255,255,255,0.04)';
  ctx.fill();

  ctx.beginPath();
  ctx.arc(100, 950, 280, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(255,255,255,0.04)';
  ctx.fill();

  // ── Top brand badge ─────────────────────────────────────────────────────
  ctx.fillStyle = 'rgba(255,255,255,0.12)';
  roundRect(ctx, CARD_SIZE / 2 - 140, 60, 280, 50, 25);
  ctx.fill();

  ctx.font = 'bold 22px sans-serif';
  ctx.fillStyle = 'rgba(255,255,255,0.7)';
  ctx.textAlign = 'center';
  ctx.fillText('🏆  smartly.sale', CARD_SIZE / 2, 92);

  // ── Trophy emoji ────────────────────────────────────────────────────────
  ctx.font = '140px serif';
  ctx.textAlign = 'center';
  ctx.fillText('🎁', CARD_SIZE / 2, 340);

  // ── "I just entered to win!" ────────────────────────────────────────────
  ctx.font = 'bold 52px sans-serif';
  ctx.fillStyle = 'rgba(255,255,255,0.75)';
  ctx.fillText('I just entered to win!', CARD_SIZE / 2, 430);

  // ── Prize name (wrapped) ────────────────────────────────────────────────
  ctx.font = 'bold 68px sans-serif';
  ctx.fillStyle = '#fbbf24'; // amber-400
  wrapText(ctx, prizeName, CARD_SIZE / 2, 530, 920, 80);

  // ── Divider ─────────────────────────────────────────────────────────────
  ctx.strokeStyle = 'rgba(255,255,255,0.15)';
  ctx.lineWidth   = 2;
  ctx.beginPath();
  ctx.moveTo(180, 710);
  ctx.lineTo(900, 710);
  ctx.stroke();

  // ── CTA ─────────────────────────────────────────────────────────────────
  ctx.font = '38px sans-serif';
  ctx.fillStyle = 'rgba(255,255,255,0.5)';
  ctx.fillText('Join me — libre & verified! 👇', CARD_SIZE / 2, 775);

  // ── URL pill ────────────────────────────────────────────────────────────
  ctx.fillStyle = 'rgba(255,255,255,0.1)';
  roundRect(ctx, CARD_SIZE / 2 - 260, 808, 520, 60, 30);
  ctx.fill();

  ctx.font = 'bold 32px monospace';
  ctx.fillStyle = '#a5f3fc'; // cyan-200
  ctx.fillText(shareUrl, CARD_SIZE / 2, 847);

  // ── Bottom "free to join" badge ─────────────────────────────────────────
  ctx.font = '28px sans-serif';
  ctx.fillStyle = 'rgba(255,255,255,0.35)';
  ctx.fillText('✅ Libre sumali  •  🔒 Verified  •  ⚡ Real prizes', CARD_SIZE / 2, 960);
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.arcTo(x + w, y, x + w, y + r, r);
  ctx.lineTo(x + w, y + h - r);
  ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
  ctx.lineTo(x + r, y + h);
  ctx.arcTo(x, y + h, x, y + h - r, r);
  ctx.lineTo(x, y + r);
  ctx.arcTo(x, y, x + r, y, r);
  ctx.closePath();
}

function wrapText(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, maxWidth: number, lineHeight: number) {
  const words = text.split(' ');
  let line    = '';
  let offsetY = y;

  for (let i = 0; i < words.length; i++) {
    const test = line ? `${line} ${words[i]}` : words[i];
    if (ctx.measureText(test).width > maxWidth && line) {
      ctx.fillText(line, x, offsetY);
      line    = words[i];
      offsetY += lineHeight;
    } else {
      line = test;
    }
  }
  ctx.fillText(line, x, offsetY);
}

export default function ShareCard({ prizeName, offerUrl, pageUrl = PAGE_URL, onClose }: Props) {
  const canvasRef  = useRef<HTMLCanvasElement>(null);
  const [copied,   setCopied]   = useState(false);
  const [imgUrl,   setImgUrl]   = useState('');

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    drawCard(canvas, prizeName, pageUrl);
    setImgUrl(canvas.toDataURL('image/png'));
  }, [prizeName, pageUrl]);

  function handleDownload() {
    const link    = document.createElement('a');
    link.download = 'my-prize-entry.png';
    link.href     = imgUrl;
    link.click();
  }

  function handleFacebookShare() {
    const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent('https://' + pageUrl)}`;
    window.open(shareUrl, '_blank', 'noopener,width=600,height=400');
  }

  async function handleCopyLink() {
    try {
      await navigator.clipboard.writeText('https://' + pageUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2_500);
    } catch {
      // Fallback
    }
  }

  async function handleNativeShare() {
    if (!navigator.share) return;
    try {
      // Try sharing the image blob
      const blob  = await (await fetch(imgUrl)).blob();
      const file  = new File([blob], 'my-prize-entry.png', { type: 'image/png' });
      await navigator.share({
        title: `I just entered to win ${prizeName}!`,
        text:  `I just entered a FREE prize draw to win ${prizeName}! Join me at https://${pageUrl}`,
        files: [file],
      });
    } catch {
      // If file share fails, fall back to URL share
      try {
        await navigator.share({
          title: `I just entered to win ${prizeName}!`,
          text:  `I just entered a FREE prize draw! Join me 👇`,
          url:   'https://' + pageUrl,
        });
      } catch { /* user cancelled */ }
    }
  }

  const canNativeShare = typeof navigator !== 'undefined' && !!navigator.share;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Share your entry"
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden">
        {/* Top bar */}
        <div className="h-1.5 bg-gradient-to-r from-amber-400 via-orange-400 to-pink-500" />

        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 transition-colors"
          aria-label="Close"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="px-5 pt-5 pb-6">
          <div className="text-center mb-4">
            <p className="font-extrabold text-gray-900 text-lg">🎉 Entry Submitted!</p>
            <p className="text-gray-500 text-sm mt-1">
              Share this card to invite friends — more entries for your network!
            </p>
          </div>

          {/* Card preview (downscaled from 1080×1080) */}
          <div className="rounded-2xl overflow-hidden border border-gray-100 shadow-sm mb-4 aspect-square">
            {imgUrl
              ? <img src={imgUrl} alt="Your shareable contest card" className="w-full h-full object-cover" />
              : <div className="w-full h-full bg-indigo-900 animate-pulse" />
            }
          </div>

          {/* Hidden canvas used for drawing */}
          <canvas ref={canvasRef} className="hidden" />

          {/* Action buttons */}
          <div className="space-y-2.5">
            {canNativeShare && (
              <button
                onClick={handleNativeShare}
                className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold text-sm rounded-xl transition-all active:scale-[0.98] flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
                Share Card (TikTok, IG, FB…)
              </button>
            )}

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={handleDownload}
                className="py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold text-sm rounded-xl transition-colors flex items-center justify-center gap-1.5"
              >
                📥 Download
              </button>
              <button
                onClick={handleFacebookShare}
                className="py-2.5 bg-[#1877f2] hover:bg-[#166fe5] text-white font-semibold text-sm rounded-xl transition-colors flex items-center justify-center gap-1.5"
              >
                📘 Facebook
              </button>
            </div>

            <button
              onClick={handleCopyLink}
              className="w-full py-2.5 border border-gray-200 hover:border-indigo-300 text-gray-600 hover:text-indigo-700 font-semibold text-sm rounded-xl transition-colors flex items-center justify-center gap-1.5"
            >
              {copied ? '✅ Link Copied!' : '🔗 Copy Link'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
