'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { Star, ShoppingBag, ArrowRight, ShoppingCart, Package, Zap, MapPin, TrendingUp, Plus, Minus } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import CustomizeRacket from '@/components/CustomizeRacket';
import type { BladeData, RubberData } from '@/components/CustomizeRacket';

interface EquipmentClientProps {
  blades: any[];
  rubbers: any[];
  shoes: any[];
  accessories: any[];
  preOwnedRackets: any[];
  enhancedBlades: BladeData[];
  enhancedRubbers: RubberData[];
  initialCategory?: 'blades' | 'rubbers' | 'shoes' | 'balls' | 'tables' | 'accessories' | 'preowned';
}

export default function EquipmentClient({ 
  blades, 
  rubbers,
  shoes,
  accessories,
  preOwnedRackets,
  enhancedBlades,
  enhancedRubbers,
  initialCategory 
}: EquipmentClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get('search');
  const brandParam = searchParams.get('brand');
  const accessoryTypeParam = searchParams.get('type');
  
  const [activeCategory, setActiveCategory] = useState<'blades' | 'rubbers' | 'shoes' | 'balls' | 'tables' | 'accessories' | 'preowned'>(initialCategory || 'blades');
  const [selectedBrand, setSelectedBrand] = useState<string>(brandParam || '');
  const [selectedAccessoryType, setSelectedAccessoryType] = useState<string>(accessoryTypeParam || '');
  const [showCustomizer, setShowCustomizer] = useState<boolean>(false);
  
  // Function to update URL with filter params
  const updateURLParams = (brand?: string, accessoryType?: string) => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (brand !== undefined) {
      if (brand) {
        params.set('brand', brand);
      } else {
        params.delete('brand');
      }
    }
    
    if (accessoryType !== undefined) {
      if (accessoryType) {
        params.set('type', accessoryType);
      } else {
        params.delete('type');
      }
    }
    
    const queryString = params.toString();
    router.replace(`${pathname}${queryString ? '?' + queryString : ''}`, { scroll: false });
  };
  
  // Function to search products
  const searchProducts = (products: any[], query: string) => {
    const lowerQuery = query.toLowerCase();
    return products.filter(product => 
      product.name.toLowerCase().includes(lowerQuery) ||
      product.brand?.toLowerCase().includes(lowerQuery) ||
      product.description?.toLowerCase().includes(lowerQuery) ||
      product.category?.toLowerCase().includes(lowerQuery) ||
      product.type?.toLowerCase().includes(lowerQuery) ||
      product.composition?.toLowerCase().includes(lowerQuery)
    );
  };
  
  useEffect(() => {
    // Set category from initialCategory prop (path parameter)
    if (initialCategory) {
      setActiveCategory(initialCategory);
    }
    // Restore filters from URL params
    if (brandParam) {
      setSelectedBrand(brandParam);
    }
    if (accessoryTypeParam) {
      setSelectedAccessoryType(accessoryTypeParam);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [initialCategory, searchQuery, brandParam, accessoryTypeParam]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-gray-50 via-white to-gray-50 py-10 md:py-16 lg:py-20">
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
            <h1 className="font-display font-bold text-5xl lg:text-6xl text-black mb-6">
              Premium Table Tennis Equipment
            </h1>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed mb-8">
              Professional Butterfly, Stiga table tennis equipment with fast delivery across India. Shop professional blades and rubbers used by champions.
            </p>

            {/* Category Tabs */}
            <div className="flex flex-col items-center gap-4 mt-6 md:mt-8">
              <div className="flex flex-wrap items-center justify-center gap-2 md:gap-4">
                <Link
                  href="/equipment/blades"
                  className={`px-4 py-2 md:px-6 md:py-2.5 lg:px-8 lg:py-3 rounded-lg font-semibold text-xs md:text-sm lg:text-base transition-all duration-300 ${
                    activeCategory === 'blades' && !showCustomizer
                      ? 'bg-primary text-white shadow-lg'
                      : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-primary'
                  }`}
                >
                  <span className="hidden sm:inline">🏓 Professional Blades</span>
                  <span className="sm:hidden">🏓 Blades</span>
                </Link>
                <Link
                  href="/equipment/rubbers"
                  className={`px-4 py-2 md:px-6 md:py-2.5 lg:px-8 lg:py-3 rounded-lg font-semibold text-xs md:text-sm lg:text-base transition-all duration-300 ${
                    activeCategory === 'rubbers' && !showCustomizer
                      ? 'bg-primary text-white shadow-lg'
                      : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-primary'
                  }`}
                >
                  <span className="hidden sm:inline">🎯 Premium Rubbers</span>
                  <span className="sm:hidden">🎯 Rubbers</span>
                </Link>
                <Link
                  href="/equipment/shoes"
                  className={`px-4 py-2 md:px-6 md:py-2.5 lg:px-8 lg:py-3 rounded-lg font-semibold text-xs md:text-sm lg:text-base transition-all duration-300 ${
                    activeCategory === 'shoes' && !showCustomizer
                      ? 'bg-primary text-white shadow-lg'
                      : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-primary'
                  }`}
                >
                  <span className="hidden sm:inline">👟 Professional Shoes</span>
                  <span className="sm:hidden">👟 Shoes</span>
                </Link>
                <Link
                  href="/equipment/preowned"
                  className={`px-4 py-2 md:px-6 md:py-2.5 lg:px-8 lg:py-3 rounded-lg font-semibold text-xs md:text-sm lg:text-base transition-all duration-300 ${
                    activeCategory === 'preowned' && !showCustomizer
                      ? 'bg-primary text-white shadow-lg'
                      : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-primary'
                  }`}
                >
                  <span className="hidden sm:inline">♻️ Pre-Owned Rackets</span>
                  <span className="sm:hidden">♻️ Pre-Owned</span>
                </Link>
                <Link
                  href="/equipment/accessories"
                  className={`px-4 py-2 md:px-6 md:py-2.5 lg:px-8 lg:py-3 rounded-lg font-semibold text-xs md:text-sm lg:text-base transition-all duration-300 ${
                    activeCategory === 'accessories' && !showCustomizer
                      ? 'bg-primary text-white shadow-lg'
                      : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-primary'
                  }`}
                >
                  <span className="hidden sm:inline">🎨 Accessories</span>
                  <span className="sm:hidden">🎨 Accessories</span>
                </Link>
              </div>
              
              {/* Accessories Sub-buttons - Only show when accessories is active */}
              {activeCategory === 'accessories' && !showCustomizer && (
                <div className="flex flex-wrap items-center justify-center gap-2 md:gap-3">
                  <button
                    onClick={() => {
                      setSelectedAccessoryType('');
                      updateURLParams(undefined, '');
                    }}
                    className={`px-3 py-1.5 md:px-4 md:py-2 rounded-full text-xs md:text-sm font-medium transition-all ${
                      selectedAccessoryType === ''
                        ? 'bg-primary text-white shadow-md'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    All Accessories
                  </button>
                  <button
                    onClick={() => {
                      setSelectedAccessoryType('Racket Case');
                      updateURLParams(undefined, 'Racket Case');
                    }}
                    className={`px-3 py-1.5 md:px-4 md:py-2 rounded-full text-xs md:text-sm font-medium transition-all ${
                      selectedAccessoryType === 'Racket Case'
                        ? 'bg-primary text-white shadow-md'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    💼 Racket Case
                  </button>
                  <button
                    onClick={() => {
                      setSelectedAccessoryType('Edge Tape');
                      updateURLParams(undefined, 'Edge Tape');
                    }}
                    className={`px-3 py-1.5 md:px-4 md:py-2 rounded-full text-xs md:text-sm font-medium transition-all ${
                      selectedAccessoryType === 'Edge Tape'
                        ? 'bg-primary text-white shadow-md'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    🎨 Edge Tape
                  </button>
                  <button
                    onClick={() => {
                      setSelectedAccessoryType('Racket Cleaner');
                      updateURLParams(undefined, 'Racket Cleaner');
                    }}
                    className={`px-3 py-1.5 md:px-4 md:py-2 rounded-full text-xs md:text-sm font-medium transition-all ${
                      selectedAccessoryType === 'Racket Cleaner'
                        ? 'bg-primary text-white shadow-md'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    🧼 Racket Cleaner
                  </button>
                  <button
                    onClick={() => {
                      setSelectedAccessoryType('Handle Grip');
                      updateURLParams(undefined, 'Handle Grip');
                    }}
                    className={`px-3 py-1.5 md:px-4 md:py-2 rounded-full text-xs md:text-sm font-medium transition-all ${
                      selectedAccessoryType === 'Handle Grip'
                        ? 'bg-primary text-white shadow-md'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    🤝 Handle Grip
                  </button>
                </div>
              )}
              
              {/* Customize Racket Button */}
              <button
                onClick={() => setShowCustomizer(!showCustomizer)}
                className={`px-6 py-3 md:px-8 md:py-4 rounded-lg font-bold text-sm md:text-base lg:text-lg transition-all duration-300 inline-flex items-center gap-3 ${
                  showCustomizer
                    ? 'bg-gradient-to-r from-primary to-primary/80 text-white shadow-2xl scale-105'
                    : 'bg-gradient-to-r from-white to-pink-50 border-2 border-black text-black shadow-lg hover:shadow-xl hover:scale-105 hover:from-pink-50 hover:to-pink-100'
                }`}
              >
                <span className="text-2xl">🎯</span>
                <span>Customize Your Racket</span>
                {showCustomizer && <span className="text-xs bg-white/20 px-2 py-1 rounded-full">Active</span>}
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Customize Racket Section */}
      {showCustomizer && (
        <CustomizeRacket blades={enhancedBlades} rubbers={enhancedRubbers} />
      )}

      {/* Products Grid */}
      {!showCustomizer && (
      <section className="py-8 md:py-12 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <h2 className="font-display font-bold text-3xl text-black mb-4 text-center">
            {activeCategory === 'blades' && '🏓 Professional Blades'}
            {activeCategory === 'rubbers' && '🎯 Premium Rubbers'}
            {activeCategory === 'shoes' && '👟 Table Tennis Shoes'}
            {activeCategory === 'balls' && '⚪ Competition Balls'}
            {activeCategory === 'tables' && '🏓 Table Tennis Tables'}
            {activeCategory === 'accessories' && '🎒 Table Tennis Accessories'}
            {activeCategory === 'preowned' && '♻️ Pre-Owned Rackets'}
          </h2>
          <p className="text-gray-600 text-center mb-6 md:mb-8 max-w-2xl mx-auto text-sm md:text-base">
            {activeCategory === 'blades' && 'Premium quality blades for every playing style and skill level'}
            {activeCategory === 'rubbers' && 'High-performance rubbers for maximum spin, speed, and control'}
            {activeCategory === 'shoes' && 'Professional table tennis footwear for optimal performance'}
            {activeCategory === 'balls' && 'Competition grade balls for training and tournaments'}
            {activeCategory === 'tables' && 'Professional quality table tennis tables'}
            {activeCategory === 'accessories' && 'Essential equipment protection and storage solutions'}
            {activeCategory === 'preowned' && 'Quality inspected used rackets at great prices - Final Sale, No Returns'}
          </p>

          {/* Brand Filter - Show for blades and rubbers */}
          {(activeCategory === 'blades' || activeCategory === 'rubbers') && (
            <div className="flex flex-wrap justify-center gap-2 md:gap-3 mb-8 md:mb-12">
              <button
                onClick={() => {
                  setSelectedBrand('');
                  updateURLParams('');
                }}
                className={`px-3 py-1.5 md:px-4 md:py-2 rounded-full text-xs md:text-sm font-medium transition-all ${
                  selectedBrand === ''
                    ? 'bg-primary text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All Brands
              </button>
              {['Butterfly', 'Stiga', 'Yasaka', 'Donic', 'Xiom'].map((brand) => (
                <button
                  key={brand}
                  onClick={() => {
                    setSelectedBrand(brand);
                    updateURLParams(brand);
                  }}
                  className={`px-3 py-1.5 md:px-4 md:py-2 rounded-full text-xs md:text-sm font-medium transition-all ${
                    selectedBrand === brand
                      ? 'bg-primary text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {brand}
                </button>
              ))}
            </div>
          )}

          {(activeCategory === 'balls' || activeCategory === 'tables') ? (
            <div className="text-center py-16">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-100 mb-6">
                <ShoppingBag className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">
                Coming Soon!
              </h3>
              <p className="text-gray-600 mb-6">
                We're working on adding {activeCategory === 'balls' ? 'balls' : 'tables'} to our inventory.
              </p>
              <a 
                href="https://wa.me/919325173787?text=Hi%20I%20am%20interested%20in%20table%20tennis%20equipment" 
                target="_blank" 
                rel="noopener noreferrer"
                className="elegant-button inline-flex items-center justify-center group"
              >
                <span>Contact Us for Availability</span>
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </a>
            </div>
          ) : (
            <>
              {/* Search Results Info */}
              {searchQuery && (
                <div className="mb-6 text-center">
                  <p className="text-gray-600">
                    Showing results for: <span className="font-semibold text-gray-900">{searchQuery}</span>
                  </p>
                  <a 
                    href="/equipment/blades" 
                    className="text-primary hover:underline text-sm mt-2 inline-block"
                  >
                    Clear search
                  </a>
                </div>
              )}
              
              {(() => {
                // Get all products from the active category
                let productsToDisplay = activeCategory === 'blades' 
                  ? blades.filter(blade => !selectedBrand || blade.brand === selectedBrand)
                  : activeCategory === 'rubbers'
                  ? rubbers.filter(rubber => !selectedBrand || rubber.name.includes(selectedBrand))
                  : activeCategory === 'shoes'
                  ? shoes
                  : activeCategory === 'accessories'
                  ? accessories.filter(accessory => !selectedAccessoryType || accessory.type === selectedAccessoryType)
                  : preOwnedRackets;
                
                // Apply search filter if query exists
                if (searchQuery) {
                  // If there's a search query, search across ALL categories
                  const allProducts = [...blades, ...rubbers, ...shoes, ...accessories, ...preOwnedRackets];
                  productsToDisplay = searchProducts(allProducts, searchQuery);
                }
                
                // Show coming soon message for accessories without products in the selected type
                if (activeCategory === 'accessories' && selectedAccessoryType && 
                    selectedAccessoryType !== 'Racket Case' && productsToDisplay.length === 0) {
                  return (
                    <div className="text-center py-16">
                      <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-100 mb-6">
                        <ShoppingBag className="w-10 h-10 text-gray-400" />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-800 mb-4">
                        Coming Soon!
                      </h3>
                      <p className="text-gray-600 mb-6">
                        We're working on adding {selectedAccessoryType.toLowerCase()} to our inventory.
                      </p>
                      <button
                        onClick={() => {
                          setSelectedAccessoryType('');
                          updateURLParams(undefined, '');
                        }}
                        className="elegant-button inline-flex items-center justify-center group"
                      >
                        <span>View All Accessories</span>
                        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  );
                }
                
                return productsToDisplay.length > 0 ? (
                  <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-6 lg:gap-8">
                    {productsToDisplay.map((product, index) => (
                      <ProductCard key={product.id} {...product} index={index} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-100 mb-6">
                      <ShoppingBag className="w-10 h-10 text-gray-400" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-4">
                      No results found
                    </h3>
                    <p className="text-gray-600 mb-6">
                      {searchQuery 
                        ? `We couldn't find any products matching "${searchQuery}"`
                        : 'No products available in this category'
                      }
                    </p>
                    <a 
                      href="/equipment/blades" 
                      className="elegant-button inline-flex items-center justify-center group"
                    >
                      <span>View All Products</span>
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </a>
                  </div>
                );
              })()}
            </>
          )}
        </div>
      </section>
      )}

      {/* Fast Delivery Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <h2 className="font-display font-bold text-3xl text-black mb-12 text-center">
            🚚 Fast Delivery Across India
          </h2>
          <p className="text-gray-600 text-center mb-12">
            Get your equipment delivered quickly and safely
          </p>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl p-8 border-2 border-gray-200"
            >
              <h3 className="font-display font-bold text-2xl text-black mb-2">Standard Delivery</h3>
              <p className="text-4xl font-bold text-primary mb-4">2-3 Days</p>
              <p className="text-gray-600">
                Fast and reliable delivery across India. Order today and receive your equipment within 2-3 business days!
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
              <h3 className="font-display font-bold text-2xl mb-2">Express Delivery</h3>
              <p className="text-4xl font-bold mb-4">Next Day</p>
              <p className="text-white/90">
                Need it urgently? Get express delivery and receive your order the next day in major cities!
              </p>
            </motion.div>
          </div>

          <p className="text-center text-sm text-gray-500 mt-8">
            * Delivery times may vary based on location. Free shipping on orders above ₹2000. Contact us for more details.
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

// Product Card Component
interface ProductCardProps {
  id: string;
  name: string;
  brand?: string;
  category: string;
  rating: number;
  reviews: number;
  composition?: string;
  speed?: string;
  origin?: string;
  type?: string;
  hardness?: string;
  arc?: string;
  size?: string;
  material?: string;
  sole?: string;
  capacity?: string;
  features?: string;
  description: string;
  price: number;
  originalPrice: number;
  image: string;
  index: number;
}

function ProductCard({
  id,
  name,
  brand,
  category,
  rating,
  reviews,
  composition,
  speed,
  origin,
  type,
  hardness,
  arc,
  size,
  material,
  sole,
  capacity,
  features,
  description,
  price,
  originalPrice,
  image,
  index,
}: ProductCardProps) {
  const { addToCart, updateQuantity, items } = useCart();
  
  const cartItem = items.find(item => item.id === id);
  const quantity = cartItem?.quantity || 0;
  
  // Check if this is a coming soon item (shoes except Xiom or pre-owned)
  const isComingSoon = category === 'Pre-Owned Racket' || (category === 'Shoes' && brand !== 'Xiom');
  
  const handleAddToCart = () => {
    if (isComingSoon) return; // Prevent adding coming soon items
    addToCart({
      id,
      name,
      category,
      price,
      originalPrice,
      image,
    });
  };
  
  const handleIncrement = () => {
    if (isComingSoon) return; // Prevent adding coming soon items
    if (cartItem) {
      updateQuantity(id, quantity + 1);
    } else {
      handleAddToCart();
    }
  };
  
  const handleDecrement = () => {
    if (isComingSoon || quantity === 0) return;
    updateQuantity(id, quantity - 1);
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05, duration: 0.5 }}
      whileHover={{ y: -8, transition: { duration: 0.3 } }}
      className={`elegant-card overflow-hidden group cursor-pointer ${isComingSoon ? 'relative' : ''}`}
    >
      {/* Coming Soon Overlay */}
      {isComingSoon && (
        <div className="absolute inset-0 bg-gray-900/75 z-10 flex items-center justify-center backdrop-blur-sm">
          <div className="text-center">
            <div className="text-white text-2xl font-bold mb-2">Coming Soon</div>
            <div className="text-gray-300 text-sm">Currently Unavailable</div>
          </div>
        </div>
      )}
      {/* Product Image */}
      <div className="aspect-square md:aspect-[4/3] bg-gradient-to-br from-muted/30 to-muted/50 relative overflow-hidden">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute top-1 right-1 md:top-2 md:right-2 lg:top-4 lg:right-4 bg-primary text-white px-1.5 py-0.5 md:px-2 md:py-1 lg:px-3 lg:py-1 rounded-full text-[10px] md:text-xs lg:text-sm font-bold">
          {Math.round(((originalPrice - price) / originalPrice) * 100)}% OFF
        </div>
      </div>

      {/* Content */}
      <div className="p-2 sm:p-3 md:p-4 lg:p-6">
        <h3 className="font-display font-bold text-xs sm:text-sm md:text-base lg:text-lg text-foreground mb-1 md:mb-2 line-clamp-2">
          {name}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-1 md:gap-2 mb-2 md:mb-3">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-2.5 h-2.5 md:w-3 md:h-3 lg:w-4 lg:h-4 ${
                  i < Math.floor(rating)
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          <span className="text-[10px] md:text-xs lg:text-sm text-muted-foreground">
            {rating}
          </span>
        </div>

        {/* Specifications - Hidden on mobile, shown on md+ */}
        <div className="hidden md:block space-y-2 mb-4">
          {composition && (
            <div className="flex items-start gap-2 text-sm">
              <Package className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
              <span className="text-muted-foreground">{composition}</span>
            </div>
          )}
          {speed && (
            <div className="flex items-start gap-2 text-sm">
              <Zap className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
              <span className="text-muted-foreground">Speed: {speed}</span>
            </div>
          )}
          {origin && (
            <div className="flex items-start gap-2 text-sm">
              <MapPin className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
              <span className="text-muted-foreground">{origin}</span>
            </div>
          )}
          {type && (
            <div className="flex items-start gap-2 text-sm">
              <Package className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
              <span className="text-muted-foreground">{type}</span>
            </div>
          )}
          {hardness && (
            <div className="flex items-start gap-2 text-sm">
              <Zap className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
              <span className="text-muted-foreground">Hardness: {hardness}</span>
            </div>
          )}
          {arc && (
            <div className="flex items-start gap-2 text-sm">
              <TrendingUp className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
              <span className="text-muted-foreground">Arc: {arc}</span>
            </div>
          )}
          {capacity && (
            <div className="flex items-start gap-2 text-sm">
              <Package className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
              <span className="text-muted-foreground">{capacity}</span>
            </div>
          )}
          {size && (
            <div className="flex items-start gap-2 text-sm">
              <Package className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
              <span className="text-muted-foreground">{size}</span>
            </div>
          )}
          {material && (
            <div className="flex items-start gap-2 text-sm">
              <Package className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
              <span className="text-muted-foreground">{material}</span>
            </div>
          )}
          {sole && (
            <div className="flex items-start gap-2 text-sm">
              <Zap className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
              <span className="text-muted-foreground">Sole: {sole}</span>
            </div>
          )}
          {features && (
            <div className="flex items-start gap-2 text-sm">
              <Zap className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
              <span className="text-muted-foreground">{features}</span>
            </div>
          )}
        </div>

        {/* Mobile: Show compact specs */}
        <div className="md:hidden mb-2 text-[10px] text-muted-foreground">
          {speed && <span className="block">{speed}</span>}
          {type && <span className="block">{type}</span>}
          {capacity && <span className="block">{capacity}</span>}
          {size && <span className="block">{size}</span>}
        </div>

        <p className="hidden md:block text-muted-foreground text-sm leading-relaxed mb-4 line-clamp-2">
          {description}
        </p>

        {/* Pricing */}
        <div className="flex flex-col md:flex-row md:items-center gap-0.5 md:gap-3 mb-2 md:mb-4">
          <span className="font-display font-bold text-sm sm:text-base md:text-lg lg:text-2xl text-foreground">
            ₹{price.toLocaleString('en-IN')}
          </span>
          <span className="text-muted-foreground line-through text-xs md:text-sm lg:text-lg">
            ₹{originalPrice.toLocaleString('en-IN')}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col md:flex-row gap-1.5 md:gap-2">
          <Link
            href={`/equipment/product/${id}`}
            className="elegant-button-outline flex-1 py-1.5 md:py-2 px-2 md:px-4 text-[10px] sm:text-xs md:text-sm inline-flex items-center justify-center group/btn"
          >
            <span className="hidden sm:inline">View Details</span>
            <span className="sm:hidden">View</span>
            <ArrowRight className="w-2.5 h-2.5 md:w-3 md:h-3 ml-1 md:ml-2 group-hover/btn:translate-x-1 transition-transform" />
          </Link>
          
          {quantity === 0 ? (
            <button
              className={`elegant-button py-1.5 md:py-2 px-2 md:px-4 text-[10px] sm:text-xs md:text-sm inline-flex items-center justify-center gap-1 md:gap-2 flex-1 md:flex-initial ${
                isComingSoon ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              onClick={handleAddToCart}
              disabled={isComingSoon}
            >
              <ShoppingCart className="w-3 h-3 md:w-4 md:h-4" />
              <span className="hidden sm:inline">{isComingSoon ? 'Coming Soon' : 'Add to Cart'}</span>
              <span className="sm:hidden">{isComingSoon ? 'Soon' : 'Add'}</span>
            </button>
          ) : (
            <div className="flex items-center justify-between border-2 border-primary rounded-lg px-2 md:px-3 py-1 md:py-1.5 flex-1 md:flex-initial bg-white">
              <button
                className="text-primary hover:bg-primary/10 rounded p-1 transition-colors"
                onClick={handleDecrement}
              >
                <Minus className="w-3 h-3 md:w-4 md:h-4" />
              </button>
              <span className="font-bold text-sm md:text-base px-3 md:px-4 text-foreground">
                {quantity}
              </span>
              <button
                className="text-primary hover:bg-primary/10 rounded p-1 transition-colors"
                onClick={handleIncrement}
              >
                <Plus className="w-3 h-3 md:w-4 md:h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
