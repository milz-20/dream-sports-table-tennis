'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home as HomeIcon, ShoppingBag, Mail, ShoppingCart, Menu, X, ChevronDown, ChevronRight } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import CartDrawer from './CartDrawer';

export default function Navigation() {
  const pathname = usePathname();
  const { getTotalItems } = useCart();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCollectionsOpen, setIsCollectionsOpen] = useState(false);
  const [isAccessoriesOpen, setIsAccessoriesOpen] = useState(false);

  const collectionsLinks = [
    { href: '/equipment?category=blades', label: 'Blades' },
    { href: '/equipment?category=rubbers', label: 'Rubbers' },
    { href: '/equipment?category=shoes', label: 'Shoes' },
    { href: '/equipment?category=balls', label: 'Balls' },
    { href: '/equipment?category=tables', label: 'Tables' },
    { href: '/equipment?category=preowned', label: 'Pre-Owned Rackets' },
  ];

  const accessoriesLinks = [
    { href: '/equipment?category=accessories', label: 'Edge Tape' },
    { href: '/equipment?category=accessories', label: 'Racket Cleaner' },
    { href: '/equipment?category=accessories', label: 'Handle Grip' },
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

            {/* Hamburger Menu Button - Visible on tablet and mobile */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-muted transition-colors"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
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

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
}
