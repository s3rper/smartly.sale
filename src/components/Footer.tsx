import React from 'react';
import { Facebook, Send, ShoppingBag, Home, Mail, DollarSign } from 'lucide-react';
import { baseUrl } from '../lib/base-url';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <>
      {/* Mobile Bottom Navigation Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-brand text-white shadow-lg md:hidden">
        <div className="flex justify-around items-center py-3">
          <a
            href={baseUrl}
            className="flex flex-col items-center space-y-1 hover:opacity-80 transition-opacity"
          >
            <Home className="w-5 h-5" />
            <span className="text-xs font-medium">Home</span>
          </a>
          <a
            href={`${baseUrl}/products`}
            className="flex flex-col items-center space-y-1 hover:opacity-80 transition-opacity"
          >
            <ShoppingBag className="w-5 h-5" />
            <span className="text-xs font-medium">Products</span>
          </a>
          <a
            href={`${baseUrl}/earn`}
            className="flex flex-col items-center space-y-1 hover:opacity-80 transition-opacity"
          >
            <DollarSign className="w-5 h-5" />
            <span className="text-xs font-medium">Earn</span>
          </a>
          <a
            href={`${baseUrl}/contact`}
            className="flex flex-col items-center space-y-1 hover:opacity-80 transition-opacity"
          >
            <Mail className="w-5 h-5" />
            <span className="text-xs font-medium">Contact</span>
          </a>
        </div>
      </div>

      {/* Main Footer */}
      <footer className="bg-[#1a202c] text-white pb-16 md:pb-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            {/* Brand */}
            <div className="space-y-5">
              <div className="flex items-center space-x-2">
                <div className="w-12 h-12 bg-brand rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-2xl">S</span>
                </div>
                <span className="text-2xl font-bold">smartly.sale</span>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">
                Your ultimate guide to discovering the best viral and trending products from Shopee Philippines.
              </p>
              <div className="flex space-x-3 pt-2">
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-11 h-11 bg-white/10 rounded-xl flex items-center justify-center hover:bg-brand transition-all duration-300 hover:scale-110"
                  aria-label="Visit our Facebook page"
                >
                  <Facebook className="w-5 h-5" />
                </a>
                <a
                  href="https://tiktok.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-11 h-11 bg-white/10 rounded-xl flex items-center justify-center hover:bg-brand transition-all duration-300 hover:scale-110"
                  aria-label="Visit our TikTok page"
                >
                  <Send className="w-5 h-5" />
                </a>
                <a
                  href="https://shopee.ph"
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                  className="w-11 h-11 bg-white/10 rounded-xl flex items-center justify-center hover:bg-brand transition-all duration-300 hover:scale-110"
                  aria-label="Visit Shopee Philippines"
                >
                  <ShoppingBag className="w-5 h-5" />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="font-bold text-white text-base uppercase tracking-wider">Quick Links</h3>
              <ul className="space-y-3.5 mt-4">
                <li>
                  <a 
                    href={baseUrl} 
                    className="text-gray-400 hover:text-white transition-colors duration-200 text-sm inline-block"
                  >
                    Home
                  </a>
                </li>
                <li>
                  <a 
                    href={`${baseUrl}/products`} 
                    className="text-gray-400 hover:text-white transition-colors duration-200 text-sm inline-block"
                  >
                    Products
                  </a>
                </li>
                <li>
                  <a 
                    href={`${baseUrl}/earn`} 
                    className="text-gray-400 hover:text-white transition-colors duration-200 text-sm inline-block"
                  >
                    Earn Money
                  </a>
                </li>
                <li>
                  <a 
                    href={`${baseUrl}/blog`} 
                    className="text-gray-400 hover:text-white transition-colors duration-200 text-sm inline-block"
                  >
                    Blog
                  </a>
                </li>
                <li>
                  <a 
                    href={`${baseUrl}/about`} 
                    className="text-gray-400 hover:text-white transition-colors duration-200 text-sm inline-block"
                  >
                    About Us
                  </a>
                </li>
                <li>
                  <a 
                    href={`${baseUrl}/contact`} 
                    className="text-gray-400 hover:text-white transition-colors duration-200 text-sm inline-block"
                  >
                    Contact Us
                  </a>
                </li>
              </ul>
            </div>

            {/* Categories */}
            <div>
              <h3 className="font-bold text-white text-base uppercase tracking-wider">Categories</h3>
              <ul className="space-y-3.5 mt-4">
                <li>
                  <a 
                    href={`${baseUrl}/products?search=gadgets`} 
                    className="text-gray-400 hover:text-white transition-colors duration-200 text-sm inline-block"
                  >
                    Budget Gadgets
                  </a>
                </li>
                <li>
                  <a 
                    href={`${baseUrl}/products?search=fashion`} 
                    className="text-gray-400 hover:text-white transition-colors duration-200 text-sm inline-block"
                  >
                    Fashion & Apparel
                  </a>
                </li>
                <li>
                  <a 
                    href={`${baseUrl}/products?search=home`} 
                    className="text-gray-400 hover:text-white transition-colors duration-200 text-sm inline-block"
                  >
                    Home & Living
                  </a>
                </li>
                <li>
                  <a 
                    href={`${baseUrl}/products?search=beauty`} 
                    className="text-gray-400 hover:text-white transition-colors duration-200 text-sm inline-block"
                  >
                    Beauty & Health
                  </a>
                </li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h3 className="font-bold text-white text-base uppercase tracking-wider">Legal</h3>
              <ul className="space-y-3.5 mt-4">
                <li>
                  <a 
                    href={`${baseUrl}/contact`} 
                    className="text-gray-400 hover:text-white transition-colors duration-200 text-sm inline-block"
                  >
                    Contact Us
                  </a>
                </li>
                <li>
                  <a 
                    href={`${baseUrl}/privacy`} 
                    className="text-gray-400 hover:text-white transition-colors duration-200 text-sm inline-block"
                  >
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a 
                    href={`${baseUrl}/terms`} 
                    className="text-gray-400 hover:text-white transition-colors duration-200 text-sm inline-block"
                  >
                    Terms of Service
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-gray-700 pt-8 mt-8">
            <div className="text-center space-y-3">
              <p className="text-gray-400 text-sm leading-relaxed max-w-3xl mx-auto">
                <strong className="text-gray-300">Affiliate Disclosure:</strong> smartly.sale participates in affiliate marketing programs. 
                We may earn a commission when you make purchases through our links at no additional cost to you.
              </p>
              <p className="text-gray-500 text-sm">
                © {currentYear} smartly.sale. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
