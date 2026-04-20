import { useState, useEffect, useRef } from 'react';

interface Props {
  source?: string; // which page triggered it, e.g. "earn-gcash"
}

export default function EmailCapturePopup({ source = 'cpa-page' }: Props) {
  const [visible,  setVisible]  = useState(false);
  const [email,    setEmail]    = useState('');
  const [status,   setStatus]   = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message,  setMessage]  = useState('');
  const dismissed = useRef(false);

  useEffect(() => {
    // Don't show if already subscribed or dismissed this session
    if (sessionStorage.getItem('popup_dismissed') || localStorage.getItem('email_subscribed')) return;

    function show() {
      if (!dismissed.current) setVisible(true);
    }

    // Trigger 1: exit intent — mouse leaves viewport through the top
    function handleMouseLeave(e: MouseEvent) {
      if (e.clientY <= 0) show();
    }

    // Trigger 2: time delay (35 seconds) so monetized CTAs stay first
    const timer = setTimeout(show, 35_000);

    document.addEventListener('mouseleave', handleMouseLeave);
    return () => {
      clearTimeout(timer);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  function dismiss() {
    dismissed.current = true;
    setVisible(false);
    sessionStorage.setItem('popup_dismissed', '1');
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;

    setStatus('loading');
    try {
      const res  = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source }),
      });
      const data = await res.json() as { ok?: boolean; message?: string; error?: string };

      if (data.ok) {
        setStatus('success');
        setMessage(data.message ?? 'Subscribed!');
        localStorage.setItem('email_subscribed', '1');
        setTimeout(dismiss, 3_000);
      } else {
        setStatus('error');
        setMessage(data.error ?? 'Something went wrong. Please try again.');
      }
    } catch {
      setStatus('error');
      setMessage('Network error. Please try again.');
    }
  }

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Get prize alerts"
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={dismiss}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
        {/* Top gradient bar */}
        <div className="h-1.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />

        {/* Close button */}
        <button
          onClick={dismiss}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 transition-colors"
          aria-label="Close"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="px-6 pt-6 pb-7">
          {status === 'success' ? (
            <div className="text-center py-4">
              <div className="text-5xl mb-4">🎉</div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">You're in!</h2>
              <p className="text-gray-500 text-sm">{message}</p>
            </div>
          ) : (
            <>
              {/* Icon + headline */}
              <div className="text-center mb-5">
                <div className="w-16 h-16 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4">
                  🔔
                </div>
                <h2 className="text-xl font-extrabold text-gray-900 mb-1">
                  Never Miss a Free Prize!
                </h2>
                <p className="text-gray-500 text-sm leading-relaxed">
                  Get notified about new giveaways, iPhone draws, and GCash rewards
                  available in your area — straight to your inbox.
                </p>
              </div>

              {/* Social proof */}
              <div className="flex items-center justify-center gap-1.5 mb-5">
                <div className="flex -space-x-1.5">
                  {['🧑', '👩', '🧑‍💻', '👨‍💼'].map((e, i) => (
                    <div key={i} className="w-7 h-7 rounded-full bg-indigo-100 border-2 border-white flex items-center justify-center text-xs">{e}</div>
                  ))}
                </div>
                <span className="text-xs text-gray-400 font-medium">+2,400 subscribers already!</span>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-3">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent placeholder-gray-400"
                  autoComplete="email"
                />
                {status === 'error' && (
                  <p className="text-xs text-red-500">{message}</p>
                )}
                <button
                  type="submit"
                  disabled={status === 'loading'}
                  style={{ color: '#ffffff' }}
                  className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 font-bold text-sm rounded-xl transition-all active:scale-[0.98] disabled:opacity-60"
                >
                  {status === 'loading' ? 'Subscribing…' : '🔔 Yes, Alert Me About Free Prizes!'}
                </button>
              </form>

              <p className="text-center text-[11px] text-gray-400 mt-3">
                🔒 No spam. Unsubscribe anytime. 100% free.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
