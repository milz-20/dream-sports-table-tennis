'use client';

import Link from 'next/link';
import { Mail, Phone, MapPin, Facebook, Instagram, Youtube } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-black text-white mt-auto">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-10 bg-gradient-to-br from-primary to-red-700 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm tracking-tight">AATT</span>
              </div>
              <span className="font-display font-bold text-lg">
                All About Table Tennis
              </span>
            </div>
            <p className="text-gray-400 text-sm">
              Premium table tennis equipment and accessories in India
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold mb-4">Quick Links</h3>
            <div className="space-y-2">
              <Link href="/" className="block text-gray-400 hover:text-white transition-colors">
                Home
              </Link>
              <Link href="/equipment" className="block text-gray-400 hover:text-white transition-colors">
                Shop
              </Link>
              <Link href="/contact" className="block text-gray-400 hover:text-white transition-colors">
                Contact
              </Link>
              <Link href="/sell-racket" className="block text-gray-400 hover:text-white transition-colors">
                Sell Your Racket
              </Link>
            </div>
          </div>

          {/* Policies */}
          <div>
            <h3 className="font-bold mb-4">Policies</h3>
            <div className="space-y-2">
              <Link href="/privacy-policy" className="block text-gray-400 hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms-conditions" className="block text-gray-400 hover:text-white transition-colors">
                Terms & Conditions
              </Link>
              <Link href="/shipping-policy" className="block text-gray-400 hover:text-white transition-colors">
                Shipping Policy
              </Link>
              <Link href="/refund-policy" className="block text-gray-400 hover:text-white transition-colors">
                Refund Policy
              </Link>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-bold mb-4">Contact Us</h3>
            <div className="space-y-3">
              <a
                href="tel:+919325173787"
                className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
              >
                <Phone className="w-4 h-4" />
                <span>+91 93251 73787</span>
              </a>
              <a
                href="mailto:contact@allabouttabletennis.in"
                className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
              >
                <Mail className="w-4 h-4" />
                <span>contact@allabouttabletennis.in</span>
              </a>
              <div className="flex items-start space-x-2 text-gray-400">
                <MapPin className="w-4 h-4 mt-1 flex-shrink-0" />
                <span>India</span>
              </div>
            </div>
          </div>

          {/* Social */}
          <div>
            <h3 className="font-bold mb-4">Follow Us</h3>
            <div className="flex space-x-4">
              <a
                href="#"
                className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-white/20 transition-colors"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-white/20 transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-white/20 transition-colors"
              >
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 mt-12 pt-8 text-center text-gray-400 text-sm">
          <p>&copy; {new Date().getFullYear()} All About Table Tennis. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
