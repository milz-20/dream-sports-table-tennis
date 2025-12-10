'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { CheckCircle, Package, Truck, Phone } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';

export default function OrderSuccessClient() {
  const { clearCart } = useCart();

  useEffect(() => {
    // Clear cart after order is placed
    clearCart();
  }, [clearCart]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 py-20">
      <div className="max-w-4xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-3xl p-12 shadow-2xl border-2 border-gray-100 text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8"
          >
            <CheckCircle className="w-16 h-16 text-green-600" />
          </motion.div>

          <h1 className="font-display font-bold text-4xl md:text-5xl text-black mb-4">
            Order Confirmed!
          </h1>
          <p className="text-xl text-gray-600 mb-12">
            Thank you for your order. We'll deliver your equipment soon!
          </p>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-gray-50 rounded-2xl p-6"
            >
              <Package className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="font-bold text-lg mb-2">Order Processing</h3>
              <p className="text-sm text-gray-600">
                We're preparing your order for delivery
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-gray-50 rounded-2xl p-6"
            >
              <Truck className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="font-bold text-lg mb-2">Fast Delivery</h3>
              <p className="text-sm text-gray-600">
                Delivery within 24 hours in Pune
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-gray-50 rounded-2xl p-6"
            >
              <Phone className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="font-bold text-lg mb-2">We'll Call You</h3>
              <p className="text-sm text-gray-600">
                Our team will contact you shortly
              </p>
            </motion.div>
          </div>

          <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-6 mb-8">
            <p className="text-blue-900 font-medium mb-2">
              📱 Want to track your order?
            </p>
            <p className="text-blue-700 text-sm">
              WhatsApp us at{' '}
              <a href="https://wa.me/918830771691" className="font-bold hover:underline">
                +91 88307 71691
              </a>
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/equipment" className="elegant-button inline-flex items-center justify-center">
              Continue Shopping
            </Link>
            <Link href="/" className="elegant-button-outline inline-flex items-center justify-center">
              Back to Home
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
