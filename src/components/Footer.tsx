import React from 'react';
import { Facebook, Send, ShoppingBag } from 'lucide-react';
import { baseUrl } from '../lib/base-url';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <>
      {/* Sticky Footer Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-[#FF6600] text-white shadow-lg md:hidden">
        <div className="flex justify-around items-center py-3">
          <a
            href={baseUrl}
            className="flex flex-col items-center space-y-1 hover:opacity-80 transition-opacity"
          >
            <ShoppingBag className="w-5 h-5" />
            <span className="text-xs font-medium">Home</span>
          </a>
          <a
            href={`${baseUrl}/blog`}
            className="flex flex-col items-center space-y-1 hover:opacity-80 transition-opacity"
          >
            <Search className="w-5 h-5" />
            <span className="text-xs font-medium">Browse</span>
          </a>
          <a
            href="https://shopee.ph"
            target="_blank"
            rel="noopener noreferrer nofollow"
            className="flex flex-col items-center space-y-1 hover:opacity-80 transition-opacity"
          >
            <ShoppingBag className="w-5 h-5" />
            <span className="text-xs font-medium">Shopee</span>
          </a>
        </div>
      </div>

      {/* Main Footer */}
      <footer className="bg-[#2D3748] text-white mt-16 pb-16 md:pb-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Brand */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-[#FF6600] rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-xl">S</span>
                </div>
                <span className="text-xl font-bold">smartly.sale</span>
              </div>
              <p className="text-gray-300 text-sm">
                Your ultimate guide to finding the best viral and trending products from Shopee Philippines.
              </p>
              <div className="flex space-x-4">
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-[#FF6600] transition-colors"
                >
                  <Facebook className="w-5 h-5" />
                </a>
                <a
                  href="https://tiktok.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-[#FF6600] transition-colors"
                >
                  <Send className="w-5 h-5" />
                </a>
                <a
                  href="https://shopee.ph"
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                  className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-[#FF6600] transition-colors"
                >
                  <ShoppingBag className="w-5 h-5" />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="font-bold text-lg mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <a href={baseUrl} className="text-gray-300 hover:text-[#FF6600] transition-colors">
                    Home
                  </a>
                </li>
                <li>
                  <a href={`${baseUrl}/blog`} className="text-gray-300 hover:text-[#FF6600] transition-colors">
                    Blog
                  </a>
                </li>
                <li>
                  <a href={`${baseUrl}/categories`} className="text-gray-300 hover:text-[#FF6600] transition-colors">
                    Categories
                  </a>
                </li>
                <li>
                  <a href={`${baseUrl}/about`} className="text-gray-300 hover:text-[#FF6600] transition-colors">
                    About Us
                  </a>
                </li>
              </ul>
            </div>

            {/* Categories */}
            <div>
              <h3 className="font-bold text-lg mb-4">Popular Categories</h3>
              <ul className="space-y-2">
                <li>
                  <a href={`${baseUrl}/blog?category=gadgets`} className="text-gray-300 hover:text-[#FF6600] transition-colors">
                    Budget Gadgets
                  </a>
                </li>
                <li>
                  <a href={`${baseUrl}/blog?category=fashion`} className="text-gray-300 hover:text-[#FF6600] transition-colors">
                    Fashion & Apparel
                  </a>
                </li>
                <li>
                  <a href={`${baseUrl}/blog?category=home`} className="text-gray-300 hover:text-[#FF6600] transition-colors">
                    Home & Living
                  </a>
                </li>
                <li>
                  <a href={`${baseUrl}/blog?category=beauty`} className="text-gray-300 hover:text-[#FF6600] transition-colors">
                    Beauty & Health
                  </a>
                </li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h3 className="font-bold text-lg mb-4">Legal</h3>
              <ul className="space-y-2">
                <li>
                  <a href={`${baseUrl}/contact`} className="text-gray-300 hover:text-[#FF6600] transition-colors">
                    Contact Us
                  </a>
                </li>
                <li>
                  <a href={`${baseUrl}/privacy`} className="text-gray-300 hover:text-[#FF6600] transition-colors">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href={`${baseUrl}/terms`} className="text-gray-300 hover:text-[#FF6600] transition-colors">
                    Terms of Service
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-gray-600 mt-8 pt-8 text-center text-gray-400 text-sm">
            <p className="mb-2">
              <strong>Affiliate Disclosure:</strong> smartly.sale participates in affiliate marketing programs. 
              We may earn a commission when you make purchases through our links at no additional cost to you.
            </p>
            <p>© {currentYear} smartly.sale. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </>
  );
};

// Import Search icon
const Search = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
    />
  </svg>
);

export default Footer;
