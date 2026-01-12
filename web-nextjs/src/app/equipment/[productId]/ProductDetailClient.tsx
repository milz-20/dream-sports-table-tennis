'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Star, ShoppingCart, Package, Zap, MapPin, TrendingUp, ArrowLeft, Plus, Minus, CheckCircle } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';

interface ProductDetailClientProps {
  product: any;
}

export default function ProductDetailClient({ product }: ProductDetailClientProps) {
  const router = useRouter();
  const { addToCart, updateQuantity, items } = useCart();
  const [showAddedMessage, setShowAddedMessage] = useState(false);

  const cartItem = items.find(item => item.id === product.id);
  const quantity = cartItem?.quantity || 0;

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      category: product.category,
      price: product.price,
      originalPrice: product.originalPrice,
      image: product.image,
    });
    setShowAddedMessage(true);
    setTimeout(() => setShowAddedMessage(false), 3000);
  };

  const handleIncrement = () => {
    if (cartItem) {
      updateQuantity(product.id, quantity + 1);
    } else {
      handleAddToCart();
    }
  };

  const handleDecrement = () => {
    if (quantity > 0) {
      updateQuantity(product.id, quantity - 1);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 py-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="mb-8 inline-flex items-center gap-2 text-gray-600 hover:text-primary transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Equipment</span>
        </button>

        {/* Added to Cart Message */}
        {showAddedMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="fixed top-24 right-6 bg-green-500 text-white px-6 py-4 rounded-lg shadow-lg z-50 flex items-center gap-2"
          >
            <CheckCircle className="w-5 h-5" />
            <span>Added to cart!</span>
          </motion.div>
        )}

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Product Image */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-3xl p-8 shadow-lg border-2 border-gray-100"
          >
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-auto object-contain rounded-2xl"
            />
          </motion.div>

          {/* Product Details */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="inline-block bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4">
              {product.category}
            </div>

            <h1 className="font-display font-bold text-4xl lg:text-5xl text-black mb-4">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < Math.floor(product.rating)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-gray-600">
                {product.rating} ({product.reviews} reviews)
              </span>
            </div>

            <p className="text-gray-600 text-lg mb-8 leading-relaxed">
              {product.description}
            </p>

            {/* Specifications */}
            <div className="bg-gray-50 rounded-2xl p-6 mb-8 space-y-4">
              <h3 className="font-bold text-xl mb-4">
                {product.category === 'Pre-Owned Racket' ? 'Condition Report' : 'Specifications'}
              </h3>
              
              {/* Pre-Owned Specific Fields */}
              {product.category === 'Pre-Owned Racket' && (
                <>
                  {product.condition && (
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-amber-600 mt-0.5" />
                      <div>
                        <span className="text-gray-500 text-sm">Overall Condition:</span>
                        <p className="font-medium text-amber-700">{product.condition}</p>
                      </div>
                    </div>
                  )}

                  {product.bladeCondition && (
                    <div className="flex items-start gap-3">
                      <Package className="w-5 h-5 text-primary" />
                      <div>
                        <span className="text-gray-500 text-sm">Blade Condition:</span>
                        <p className="font-medium">{product.bladeCondition}</p>
                      </div>
                    </div>
                  )}

                  {product.rubberCondition && (
                    <div className="flex items-start gap-3">
                      <Zap className="w-5 h-5 text-primary" />
                      <div>
                        <span className="text-gray-500 text-sm">Rubber Condition:</span>
                        <p className="font-medium">{product.rubberCondition}</p>
                      </div>
                    </div>
                  )}

                  {product.inspection && (
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <div>
                        <span className="text-gray-500 text-sm">Inspection:</span>
                        <p className="font-medium text-green-700">{product.inspection}</p>
                      </div>
                    </div>
                  )}

                  {product.quantity && (
                    <div className="flex items-start gap-3">
                      <Package className="w-5 h-5 text-orange-600" />
                      <div>
                        <span className="text-gray-500 text-sm">Availability:</span>
                        <p className="font-medium text-orange-700">{product.quantity}</p>
                      </div>
                    </div>
                  )}

                  {product.warranty && (
                    <div className="flex items-start gap-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                      <span className="text-amber-600 font-bold text-lg">⚠️</span>
                      <div>
                        <span className="text-gray-500 text-sm">Warranty Policy:</span>
                        <p className="font-bold text-amber-800">{product.warranty}</p>
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* Regular Product Fields */}
              {product.category !== 'Pre-Owned Racket' && (
                <>
                  {product.composition && (
                    <div className="flex items-center gap-3">
                      <Package className="w-5 h-5 text-primary" />
                      <div>
                        <span className="text-gray-500 text-sm">Composition:</span>
                        <p className="font-medium">{product.composition}</p>
                      </div>
                    </div>
                  )}

                  {product.speed && (
                    <div className="flex items-center gap-3">
                      <Zap className="w-5 h-5 text-primary" />
                      <div>
                        <span className="text-gray-500 text-sm">Speed:</span>
                        <p className="font-medium">{product.speed}</p>
                      </div>
                    </div>
                  )}

                  {product.origin && (
                    <div className="flex items-center gap-3">
                      <MapPin className="w-5 h-5 text-primary" />
                      <div>
                        <span className="text-gray-500 text-sm">Origin:</span>
                        <p className="font-medium">{product.origin}</p>
                      </div>
                    </div>
                  )}

                  {product.type && (
                    <div className="flex items-center gap-3">
                      <Package className="w-5 h-5 text-primary" />
                      <div>
                        <span className="text-gray-500 text-sm">Type:</span>
                        <p className="font-medium">{product.type}</p>
                      </div>
                    </div>
                  )}

                  {product.hardness && (
                    <div className="flex items-center gap-3">
                      <Zap className="w-5 h-5 text-primary" />
                      <div>
                        <span className="text-gray-500 text-sm">Hardness:</span>
                        <p className="font-medium">{product.hardness}</p>
                      </div>
                    </div>
                  )}

                  {product.arc && (
                    <div className="flex items-center gap-3">
                      <TrendingUp className="w-5 h-5 text-primary" />
                      <div>
                        <span className="text-gray-500 text-sm">Arc:</span>
                        <p className="font-medium">{product.arc}</p>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Pricing */}
            <div className="flex items-center gap-6 mb-8">
              <span className="font-display font-bold text-5xl text-primary">
                ₹{product.price.toLocaleString('en-IN')}
              </span>
              <div>
                <span className="text-gray-400 line-through text-2xl block">
                  ₹{product.originalPrice.toLocaleString('en-IN')}
                </span>
                <span className="text-green-600 font-bold text-sm">
                  Save {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                </span>
              </div>
            </div>

            {/* Add to Cart */}
            <div className="flex gap-4 mb-8">
              {quantity === 0 ? (
                <button
                  onClick={handleAddToCart}
                  className="elegant-button flex-1 py-4 text-lg inline-flex items-center justify-center gap-3"
                >
                  <ShoppingCart className="w-6 h-6" />
                  <span>Add to Cart</span>
                </button>
              ) : (
                <div className="flex items-center gap-4 border-2 border-primary rounded-lg px-6 py-4 flex-1 bg-white">
                  <button
                    onClick={handleDecrement}
                    className="text-primary hover:bg-primary/10 rounded p-2 transition-colors"
                  >
                    <Minus className="w-6 h-6" />
                  </button>
                  <span className="font-bold text-2xl px-6 text-foreground">
                    {quantity}
                  </span>
                  <button
                    onClick={handleIncrement}
                    className="text-primary hover:bg-primary/10 rounded p-2 transition-colors"
                  >
                    <Plus className="w-6 h-6" />
                  </button>
                </div>
              )}
            </div>

            {/* Shipping Info */}
            <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-6">
              <h4 className="font-bold text-lg mb-3">🚚 Fast Shipping Across India</h4>
              <ul className="space-y-2 text-gray-700">
                <li>✓ Standard Shipping: 4-5 business days (₹100, FREE above ₹10,000)</li>
                <li>✓ Express Shipping: 1-2 business days (₹250)</li>
                <li>✓ Cash on Delivery available</li>
              </ul>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
