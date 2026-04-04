import React, { useState } from 'react';
import { X, Share2, Facebook, Mail, Copy, Check } from 'lucide-react';

interface ShareModalProps {
  itemName: string;
  price: number;
  unit: string;
  storeName: string;
  address: string;
  onClose: () => void;
  darkMode: boolean;
}

export default function ShareModal({
  itemName,
  price,
  unit,
  storeName,
  address,
  onClose,
  darkMode,
}: ShareModalProps) {
  const [copied, setCopied] = useState(false);

  // Create share text
  const shareText = `🎉 Found the cheapest ${itemName} at ${storeName}!\n\n💰 Only ₱${price.toFixed(2)}/${unit}\n📍 ${address}\n\nFind more deals at Cheapest Near Me!`;

  const shareUrl = 'https://smartly.sale/cheapest-near-me';

  const encodedText = encodeURIComponent(shareText);
  const encodedUrl = encodeURIComponent(shareUrl);

  // Share URLs
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedText}`;
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`;
  const emailSubject = encodeURIComponent(`Found cheapest ${itemName} at ${storeName}!`);
  const emailBody = encodeURIComponent(`${shareText}\n\nCheck it out: ${shareUrl}`);
  const emailUrl = `mailto:?subject=${emailSubject}&body=${emailBody}`;

  const handleCopyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(`${shareText}\n\n${shareUrl}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const shareOptions = [
    {
      name: 'Facebook',
      icon: Facebook,
      color: 'from-blue-600 to-blue-700',
      hoverColor: 'hover:from-blue-700 hover:to-blue-800',
      url: facebookUrl,
    },
    {
      name: 'X (Twitter)',
      icon: () => (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      ),
      color: 'from-black to-gray-800',
      hoverColor: 'hover:from-gray-800 hover:to-gray-900',
      url: twitterUrl,
    },
    {
      name: 'Email',
      icon: Mail,
      color: 'from-red-600 to-red-700',
      hoverColor: 'hover:from-red-700 hover:to-red-800',
      url: emailUrl,
    },
    {
      name: 'Copy Link',
      icon: copied ? Check : Copy,
      color: 'from-green-600 to-green-700',
      hoverColor: 'hover:from-green-700 hover:to-green-800',
      onClick: handleCopyToClipboard,
    },
  ];

  return (
    <div
      className="fixed inset-0 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm"
      style={{ zIndex: 99999 }}
      onClick={onClose}
    >
      <div
        className={`relative w-full max-w-md rounded-2xl shadow-2xl overflow-hidden ${
          darkMode ? 'bg-gray-800' : 'bg-white'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Share2 className="w-6 h-6 text-white" />
            <h2 className="text-xl font-bold text-white">Share This Deal</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-white/20 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Deal Preview */}
          <div
            className={`mb-6 p-5 rounded-2xl border-2 shadow-sm ${
              darkMode
                ? 'bg-green-900/30 border-green-700'
                : 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-200'
            }`}
          >
            <div className={`font-bold text-xl mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              {itemName}
            </div>
            <div className={`text-4xl font-black mb-3 ${darkMode ? 'text-green-300' : 'text-green-600'}`}>
              ₱{price.toFixed(2)}
              <span className={`text-lg font-normal ml-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                / {unit}
              </span>
            </div>
            <div className={`text-sm font-semibold flex items-center gap-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              <span>📍</span>
              <span>{storeName}</span>
            </div>
            <div className={`text-xs mt-1 ml-5 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {address}
            </div>
          </div>

          {/* Share Options */}
          <div>
            <div className={`text-sm font-semibold mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Share on:
            </div>
            <div className="flex flex-col gap-4">
              {shareOptions.map((option) => {
                const IconComponent = option.icon;
                return (
                  <button
                    key={option.name}
                    onClick={() => {
                      if (option.onClick) {
                        option.onClick();
                      } else if (option.url) {
                        window.open(option.url, '_blank', 'width=600,height=400');
                      }
                    }}
                    className={`w-full flex items-center gap-4 px-6 py-4 rounded-xl font-semibold transition-all hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] bg-gradient-to-r ${option.color} ${option.hoverColor}`}
                    style={{ color: '#ffffff' }}
                  >
                    <div className="w-6 h-6 flex items-center justify-center flex-shrink-0" style={{ color: '#ffffff' }}>
                      {typeof IconComponent === 'function' ? (
                        <IconComponent className="w-6 h-6" />
                      ) : (
                        <IconComponent />
                      )}
                    </div>
                    <span className="flex-1 text-left text-base" style={{ color: '#ffffff' }}>
                      {option.name === 'Copy Link' && copied ? '✓ Copied!' : option.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Instagram Note */}
          <div
            className={`mt-5 p-4 rounded-xl border-2 text-xs ${
              darkMode
                ? 'bg-purple-900/30 border-purple-700 text-purple-200'
                : 'bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200 text-purple-800'
            }`}
          >
            <div className="flex items-start gap-3">
              <span className="text-2xl flex-shrink-0">📱</span>
              <div>
                <div className="font-bold mb-1 text-sm">Instagram Sharing</div>
                <div className={darkMode ? 'text-purple-300' : 'text-purple-700'}>
                  Click "Copy Link" above and paste it in your Instagram story or post!
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
