'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home as HomeIcon, ShoppingBag, Mail, ShoppingCart, Menu, X, ChevronDown, ChevronRight, Search } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import CartDrawer from './CartDrawer';

export default function Navigation() {
  const pathname = usePathname();
  const { getTotalItems } = useCart();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCollectionsOpen, setIsCollectionsOpen] = useState(false);
  const [isAccessoriesOpen, setIsAccessoriesOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const collectionsLinks = [
    { href: '/equipment/blades', label: 'Blades' },
    { href: '/equipment/rubbers', label: 'Rubbers' },
    { href: '/equipment/shoes', label: 'Shoes' },
    { href: '/equipment/balls', label: 'Balls' },
    { href: '/equipment/tables', label: 'Tables' },
    { href: '/equipment/preowned', label: 'Pre-Owned Rackets' },
  ];

  const accessoriesLinks = [
    { href: '/equipment/accessories', label: 'Edge Tape' },
    { href: '/equipment/accessories', label: 'Racket Cleaner' },
    { href: '/equipment/accessories', label: 'Handle Grip' },
  ];

  const isActive = (path: string) => pathname === path;

  return (
    <>
      <header className="sticky top-0 z-50 glass-effect border-b border-border">
        <nav className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Brand */}
            <Link href="/" className="group flex items-center space-x-3">
              <div className="w-12 h-10 bg-gradient-to-br from-primary to-red-700 rounded-lg flex items-center justify-center shadow-md group-hover:shadow-lg transition-all duration-300">
                <span className="text-white font-bold text-sm drop-shadow-md tracking-tight">AATT</span>
              </div>
              <span className="font-display font-bold text-xl text-black tracking-tight">
                All About Table Tennis
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-1">
              {/* Home Link */}
              <Link
                href="/"
                className={`px-3 py-2 rounded-lg font-medium transition-all duration-200 inline-flex items-center space-x-2 ${
                  isActive('/')
                    ? 'bg-primary text-white'
                    : 'text-foreground hover:bg-muted'
                }`}
              >
                <HomeIcon className="w-4 h-4" />
                <span>Home</span>
              </Link>

              {/* Collections Dropdown */}
              <div className="relative group">
                <button
                  className="px-3 py-2 rounded-lg font-medium transition-all duration-200 inline-flex items-center space-x-2 text-foreground hover:bg-muted"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Collections</span>
                  <ChevronDown className="w-4 h-4" />
                </button>
                <div className="absolute left-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="py-2">
                    {collectionsLinks.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        className="block px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors"
                      >
                        {link.label}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

              {/* Accessories Dropdown */}
              <div className="relative group">
                <button
                  className="px-3 py-2 rounded-lg font-medium transition-all duration-200 inline-flex items-center space-x-2 text-foreground hover:bg-muted"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Accessories</span>
                  <ChevronDown className="w-4 h-4" />
                </button>
                <div className="absolute left-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="py-2">
                    {accessoriesLinks.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        className="block px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors"
                      >
                        {link.label}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

              {/* Sell Racket Link */}
              <Link
                href="/sell-racket"
                className={`px-3 py-2 rounded-lg font-medium transition-all duration-200 inline-flex items-center space-x-2 ${
                  isActive('/sell-racket')
                    ? 'bg-emerald-600 text-white'
                    : 'text-emerald-600 hover:bg-emerald-50 border border-emerald-600'
                }`}
              >
                <span>💰</span>
                <span>Sell Racket</span>
              </Link>

              {/* Contact Link */}
              <Link
                href="/contact"
                className={`px-3 py-2 rounded-lg font-medium transition-all duration-200 inline-flex items-center space-x-2 ${
                  isActive('/contact')
                    ? 'bg-primary text-white'
                    : 'text-foreground hover:bg-muted'
                }`}
              >
                <Mail className="w-4 h-4" />
                <span>Contact</span>
              </Link>

              {/* Search Button */}
              <button
                onClick={() => setIsSearchOpen(true)}
                className="px-3 py-2 rounded-lg font-medium transition-all duration-200 inline-flex items-center space-x-2 text-foreground hover:bg-muted"
              >
                <Search className="w-4 h-4" />
                <span>Search</span>
              </button>

              {/* Cart Button */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative px-3 py-2 rounded-lg font-medium transition-all duration-200 inline-flex items-center space-x-2 text-foreground hover:bg-muted"
              >
                <ShoppingCart className="w-4 h-4" />
                <span>Cart</span>
                {getTotalItems() > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {getTotalItems()}
                  </span>
                )}
              </button>
            </div>

            {/* Mobile: Search and Hamburger Menu Buttons */}
            <div className="lg:hidden flex items-center gap-2">
              <button
                onClick={() => setIsSearchOpen(true)}
                className="p-2 rounded-lg hover:bg-muted transition-colors"
              >
                <Search className="w-5 h-5" />
              </button>
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 rounded-lg hover:bg-muted transition-colors"
              >
                {isMobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>

          {/* Hamburger Menu */}
          {isMobileMenuOpen && (
            <div className="py-4 border-t border-border">
              <div className="flex flex-col space-y-2">
                {/* Home Link */}
                <Link
                  href="/"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`px-4 py-3 rounded-lg font-medium transition-all duration-200 inline-flex items-center space-x-3 ${
                    isActive('/')
                      ? 'bg-primary text-white'
                      : 'text-foreground hover:bg-muted'
                  }`}
                >
                  <HomeIcon className="w-5 h-5" />
                  <span>Home</span>
                </Link>

                {/* Collections Dropdown */}
                <div>
                  <button
                    onClick={() => setIsCollectionsOpen(!isCollectionsOpen)}
                    className="w-full px-4 py-3 rounded-lg font-medium transition-all duration-200 inline-flex items-center justify-between text-foreground hover:bg-muted"
                  >
                    <div className="inline-flex items-center space-x-3">
                      <ShoppingBag className="w-5 h-5" />
                      <span>Collections</span>
                    </div>
                    {isCollectionsOpen ? (
                      <ChevronDown className="w-5 h-5" />
                    ) : (
                      <ChevronRight className="w-5 h-5" />
                    )}
                  </button>
                  {isCollectionsOpen && (
                    <div className="ml-8 mt-2 space-y-1">
                      {collectionsLinks.map((link) => (
                        <Link
                          key={link.href}
                          href={link.href}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="block px-4 py-2 rounded-lg text-sm text-foreground hover:bg-muted transition-colors"
                        >
                          {link.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>

                {/* Accessories Dropdown */}
                <div>
                  <button
                    onClick={() => setIsAccessoriesOpen(!isAccessoriesOpen)}
                    className="w-full px-4 py-3 rounded-lg font-medium transition-all duration-200 inline-flex items-center justify-between text-foreground hover:bg-muted"
                  >
                    <div className="inline-flex items-center space-x-3">
                      <ShoppingBag className="w-5 h-5" />
                      <span>Accessories</span>
                    </div>
                    {isAccessoriesOpen ? (
                      <ChevronDown className="w-5 h-5" />
                    ) : (
                      <ChevronRight className="w-5 h-5" />
                    )}
                  </button>
                  {isAccessoriesOpen && (
                    <div className="ml-8 mt-2 space-y-1">
                      {accessoriesLinks.map((link) => (
                        <Link
                          key={link.href}
                          href={link.href}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="block px-4 py-2 rounded-lg text-sm text-foreground hover:bg-muted transition-colors"
                        >
                          {link.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>

                {/* Sell Racket Link */}
                <Link
                  href="/sell-racket"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`px-4 py-3 rounded-lg font-medium transition-all duration-200 inline-flex items-center space-x-3 ${
                    isActive('/sell-racket')
                      ? 'bg-emerald-600 text-white'
                      : 'text-emerald-600 hover:bg-emerald-50 border-2 border-emerald-600'
                  }`}
                >
                  <span>💰</span>
                  <span>Sell Your Racket</span>
                </Link>

                {/* Contact Link */}
                <Link
                  href="/contact"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`px-4 py-3 rounded-lg font-medium transition-all duration-200 inline-flex items-center space-x-3 ${
                    isActive('/contact')
                      ? 'bg-primary text-white'
                      : 'text-foreground hover:bg-muted'
                  }`}
                >
                  <Mail className="w-5 h-5" />
                  <span>Contact</span>
                </Link>

                {/* Cart Button */}
                <button
                  onClick={() => {
                    setIsCartOpen(true);
                    setIsMobileMenuOpen(false);
                  }}
                  className="relative px-4 py-3 rounded-lg font-medium transition-all duration-200 inline-flex items-center space-x-3 text-foreground hover:bg-muted text-left"
                >
                  <ShoppingCart className="w-5 h-5" />
                  <span>Cart {getTotalItems() > 0 && `(${getTotalItems()})`}</span>
                </button>
              </div>
            </div>
          )}
        </nav>
      </header>

      {/* Search Modal */}
      {isSearchOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center pt-20 px-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl max-h-[80vh] overflow-hidden">
            <div className="p-6 border-b border-gray-200 flex items-center gap-4">
              <Search className="w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search for blades, rubbers, shoes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && searchQuery.trim()) {
                    window.location.href = `/equipment/blades?search=${encodeURIComponent(searchQuery)}`;
                  }
                }}
                autoFocus
                className="flex-1 text-lg outline-none"
              />
              <button
                onClick={() => {
                  setIsSearchOpen(false);
                  setSearchQuery('');
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            {searchQuery.trim() && (
              <div className="p-4">
                <Link
                  href={`/equipment/blades?search=${encodeURIComponent(searchQuery)}`}
                  onClick={() => {
                    setIsSearchOpen(false);
                    setSearchQuery('');
                  }}
                  className="elegant-button w-full py-3 text-center"
                >
                  Search for "{searchQuery}"
                </Link>
                <p className="text-sm text-gray-500 text-center mt-3">
                  Press Enter or click to search
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
}
