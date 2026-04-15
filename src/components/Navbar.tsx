import React, { useState } from 'react';
import { Menu, X, ShoppingBag } from 'lucide-react';
import { baseUrl } from '../lib/base-url';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const navLinks = [
    { name: 'Home', href: `${baseUrl}/` },
    { name: 'Products', href: `${baseUrl}/products` },
    { name: 'Sale Calendar', href: `${baseUrl}/shopee-sales-2026` },
    { name: 'Earn Money', href: `${baseUrl}/earn` },
    { name: 'Blog', href: `${baseUrl}/blog` },
    { name: 'FAQ', href: `${baseUrl}/faq` },
    { name: 'About', href: `${baseUrl}/about` },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo - Always points to homepage */}
          <a href={`${baseUrl}/`} className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
            <ShoppingBag className="w-8 h-8 text-brand" />
            <span className="text-xl font-bold text-foreground">smartly.sale</span>
          </a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-foreground hover:text-brand transition-colors font-medium"
              >
                {link.name}
              </a>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className="md:hidden p-2 rounded-lg hover:bg-accent transition-colors"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X className="w-6 h-6 text-foreground" />
            ) : (
              <Menu className="w-6 h-6 text-foreground" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <div className="flex flex-col space-y-3">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="px-4 py-2 text-foreground hover:text-brand hover:bg-accent rounded-lg transition-all font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.name}
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
