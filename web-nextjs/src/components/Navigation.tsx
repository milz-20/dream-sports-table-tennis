'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home as HomeIcon, Users, ShoppingBag, Mail, ShoppingCart, Menu, X } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import CartDrawer from './CartDrawer';

export default function Navigation() {
  const pathname = usePathname();
  const { getTotalItems } = useCart();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: '/', label: 'Home', icon: HomeIcon },
    { href: '/coaching', label: 'Coaching', icon: Users },
    { href: '/equipment', label: 'Equipment', icon: ShoppingBag },
    { href: '/contact', label: 'Contact', icon: Mail },
  ];

  const isActive = (path: string) => pathname === path;

  return (
    <>
      <header className="sticky top-0 z-50 glass-effect border-b border-border">
        <nav className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Brand */}
            <Link href="/" className="group flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-red-700 rounded-lg flex items-center justify-center shadow-md group-hover:shadow-lg transition-all duration-300">
                <span className="text-white font-bold text-xl drop-shadow-md">PT</span>
              </div>
              <span className="font-display font-bold text-xl text-black tracking-tight">
                Pune Table Tennis
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1">
              {navLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 inline-flex items-center space-x-2 ${
                      isActive(link.href)
                        ? 'bg-primary text-white shadow-md'
                        : 'text-foreground hover:bg-muted'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{link.label}</span>
                  </Link>
                );
              })}

              {/* Cart Button */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative px-4 py-2 rounded-lg font-medium transition-all duration-200 inline-flex items-center space-x-2 text-foreground hover:bg-muted"
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

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-muted transition-colors"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-border">
              <div className="flex flex-col space-y-2">
                {navLinks.map((link) => {
                  const Icon = link.icon;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`px-4 py-3 rounded-lg font-medium transition-all duration-200 inline-flex items-center space-x-3 ${
                        isActive(link.href)
                          ? 'bg-primary text-white'
                          : 'text-foreground hover:bg-muted'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span>{link.label}</span>
                    </Link>
                  );
                })}

                {/* Mobile Cart Button */}
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
