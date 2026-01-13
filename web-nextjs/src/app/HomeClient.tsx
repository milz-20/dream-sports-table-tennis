'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ShoppingBag, ArrowRight, Package, Zap, Headphones } from 'lucide-react';
import CustomizeRacket from '@/components/CustomizeRacket';
import type { BladeData, RubberData } from '@/components/CustomizeRacket';

interface HomeClientProps {
  blades: any[];
  rubbers: any[];
  enhancedBlades: BladeData[];
  enhancedRubbers: RubberData[];
}

interface CategoryCard {
  id: string;
  title: string;
  icon: string;
  description: string;
  href: string;
  available: boolean;
  gradient: string;
  image: string;
}

const categories: CategoryCard[] = [
  {
    id: 'blades',
    title: 'Blades',
    icon: '🏓',
    description: 'Professional blades for every playing style',
    href: '/equipment/blades',
    available: true,
    gradient: 'from-blue-500 to-blue-600',
    image: '/assets/images/blades_table_tennis.jpg'
  },
  {
    id: 'rubbers',
    title: 'Rubbers',
    icon: '🎯',
    description: 'High-performance rubbers for maximum spin',
    href: '/equipment/rubbers',
    available: true,
    gradient: 'from-red-500 to-red-600',
    image: '/assets/images/rubbers/rubbers.webp'
  },
  {
    id: 'shoes',
    title: 'Shoes',
    icon: '👟',
    description: 'Professional footwear for optimal performance',
    href: '/equipment/shoes',
    available: true,
    gradient: 'from-green-500 to-green-600',
    image: '/assets/images/shoes.jpg'
  },
  {
    id: 'accessories',
    title: 'Accessories',
    icon: '🎨',
    description: 'Essential accessories for your equipment',
    href: '/equipment/accessories',
    available: true,
    gradient: 'from-pink-500 to-pink-600',
    image: '/assets/images/edge-tape/joola.webp'
  },
  {
    id: 'preowned',
    title: 'Pre-Owned Rackets',
    icon: '♻️',
    description: 'Quality inspected used rackets at great prices',
    href: '/equipment/preowned',
    available: true,
    gradient: 'from-amber-500 to-amber-600',
    image: '/assets/images/viscaria.jpg'
  },
  {
    id: 'sell',
    title: 'Sell Your Racket',
    icon: '💰',
    description: 'Get instant quote for your used equipment',
    href: '/sell-racket',
    available: true,
    gradient: 'from-emerald-500 to-emerald-600',
    image: '/assets/images/Sell_racket.avif'
  },
  {
    id: 'balls',
    title: 'Balls',
    icon: '⚪',
    description: 'Competition grade balls for training',
    href: '/equipment/balls',
    available: true,
    gradient: 'from-orange-500 to-orange-600',
    image: '/assets/images//balls/balls.jpg'
  },
  {
    id: 'tables',
    title: 'Tables',
    icon: '🏓',
    description: 'Professional quality table tennis tables',
    href: '/equipment/tables',
    available: false,
    gradient: 'from-purple-500 to-purple-600',
    image: '/assets/images/table.webp'
  }
];

export default function HomeClient({ 
  blades, 
  rubbers,
  enhancedBlades,
  enhancedRubbers 
}: HomeClientProps) {
  const [showCustomizer, setShowCustomizer] = useState<boolean>(false);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-gray-50 via-white to-gray-50 py-12 md:py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-center mb-12"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="inline-flex items-center space-x-2 bg-primary/10 text-primary border border-primary/20 px-4 py-2 rounded-full text-sm font-medium mb-6"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Premium Quality Equipment</span>
            </motion.div>
            <h1 className="font-display font-bold text-5xl lg:text-7xl text-black mb-6">
              All About Table Tennis
            </h1>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed mb-10">
              Professional Butterfly, Stiga, and other premium table tennis equipment with fast shipping across India. 
              Shop professional gear used by champions.
            </p>

            {/* Customize Racket Button */}
            <button
              onClick={() => setShowCustomizer(!showCustomizer)}
              className={`px-8 py-4 md:px-10 md:py-5 rounded-xl font-bold text-base md:text-lg transition-all duration-300 inline-flex items-center gap-3 ${
                showCustomizer
                  ? 'bg-gradient-to-r from-primary to-primary/80 text-white shadow-2xl scale-105'
                  : 'bg-gradient-to-r from-white to-pink-50 border-2 border-black text-black shadow-lg hover:shadow-xl hover:scale-105 hover:from-pink-50 hover:to-pink-100'
              }`}
            >
              <span className="text-2xl">🎯</span>
              <span>Customize Your Racket</span>
              {showCustomizer && <span className="text-xs bg-white/20 px-2 py-1 rounded-full">Active</span>}
            </button>
          </motion.div>
        </div>
      </section>

      {/* Customize Racket Section */}
      {showCustomizer && (
        <CustomizeRacket blades={enhancedBlades} rubbers={enhancedRubbers} />
      )}

      {/* Shop by Category */}
      {!showCustomizer && (
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-display font-bold text-4xl text-black mb-4">
              Shop by Category
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Explore our premium collection of table tennis equipment
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {categories.map((category, index) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link
                  href={category.available ? category.href : '#'}
                  className={`block group relative overflow-hidden rounded-2xl border-2 transition-all duration-500 ${
                    category.available
                      ? 'border-gray-200 hover:border-primary hover:shadow-2xl hover:-translate-y-2'
                      : 'border-gray-200 opacity-75 cursor-not-allowed'
                  }`}
                >
                  {/* Background Image */}
                  <div className="relative h-80 overflow-hidden">
                    <img
                      src={category.image}
                      alt={category.title}
                      className={`w-full h-full object-cover transition-all duration-500 ${
                        category.available 
                          ? 'group-hover:scale-110 group-hover:brightness-110' 
                          : 'grayscale'
                      }`}
                    />
                    
                    {/* Dark Gradient Overlay */}
                    <div className={`absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent transition-opacity duration-500 ${
                      category.available ? 'group-hover:from-black/70' : ''
                    }`} />
                    
                    {/* Coming Soon Badge */}
                    {!category.available && (
                      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm text-gray-800 px-4 py-2 rounded-full text-sm font-bold">
                        Coming Soon
                      </div>
                    )}
                    
                    {/* Category Title - Bottom Left */}
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <h3 className={`font-display font-bold text-4xl text-white mb-2 transition-all duration-300 ${
                        category.available ? 'group-hover:underline decoration-4 underline-offset-8' : ''
                      }`}>
                        {category.title}
                      </h3>
                      <p className="text-white/90 text-sm mb-4">
                        {category.description}
                      </p>
                      
                      {category.available && (
                        <div className="inline-flex items-center text-white font-semibold gap-2 group-hover:gap-3 transition-all">
                          <span>Shop Now</span>
                          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      )}

      {/* Why Choose Us */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <h2 className="font-display font-bold text-3xl text-black mb-12 text-center">
            Why Choose Us?
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                <Package className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-bold text-xl mb-2">Premium Quality</h3>
              <p className="text-gray-600">
                Authentic products from top brands like Butterfly, Stiga, and more
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-center"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                <Zap className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-bold text-xl mb-2">Fast Shipping</h3>
              <p className="text-gray-600">
                Quick shipping across India - get your gear in 4-5 days
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-center"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                <Headphones className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-bold text-xl mb-2">Expert Support</h3>
              <p className="text-gray-600">
                Get personalized recommendations from our expert team
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Fast Shipping Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <h2 className="font-display font-bold text-3xl text-black mb-12 text-center">
            🚚 Fast Shipping Across India
          </h2>
          <p className="text-gray-600 text-center mb-12">
            Get your equipment shipped quickly and safely
          </p>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl p-8 border-2 border-gray-200"
            >
              <h3 className="font-display font-bold text-2xl text-black mb-2">Standard Shipping</h3>
              <p className="text-4xl font-bold text-primary mb-4">4-5 Days</p>
              <p className="text-gray-600">
                Fast and reliable shipping across India. Order today and receive your equipment within 4-5 business days!
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-primary rounded-2xl p-8 border-2 border-primary text-white relative overflow-hidden"
            >
              <div className="absolute top-4 right-4 bg-white text-primary text-xs font-bold px-3 py-1 rounded-full">
                PREMIUM
              </div>
              <h3 className="font-display font-bold text-2xl mb-2">Express Shipping</h3>
              <p className="text-4xl font-bold mb-4">1-2 Days</p>
              <p className="text-white/90">
                Need it urgently? Get express shipping and receive your order within 1-2 business days!
              </p>
            </motion.div>
          </div>

          <p className="text-center text-sm text-gray-500 mt-8">
            * Shipping times may vary based on location. Free shipping on orders above ₹2,000. Contact us for more details.
          </p>
        </div>
      </section>

      {/* Expert Advice Section */}
      <section className="py-20 bg-gradient-to-br from-black via-gray-900 to-black text-white">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="font-display font-bold text-4xl mb-6">
            Need Expert Advice?
          </h2>
          <p className="text-lg text-gray-300 mb-8">
            Our team can help you choose the perfect equipment for your playing style
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="https://wa.me/919325173787?text=Hi%20i%20need%20help%20selecting%20a%20suitable%20equipment%20for%20me" 
              target="_blank" 
              rel="noopener noreferrer"
              className="elegant-button inline-flex items-center justify-center group"
            >
              <span>Contact Us on WhatsApp</span>
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
        </div>
      </section>
    </motion.div>
  );
}
