'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Package, Truck, Phone } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';

type OrderSuccessParams = {
  orderId: string | null;
  paymentId: string | null;
};

function OrderSuccessContent({ orderId, paymentId }: OrderSuccessParams) {
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
          <p className="text-xl text-gray-600 mb-4">
            Thank you for your order. We'll deliver your equipment soon!
          </p>
          {orderId && (
            <div className="inline-block bg-gray-100 rounded-lg px-6 py-3 mb-8">
              <p className="text-sm text-gray-600">Order ID</p>
              <p className="font-mono font-bold text-gray-900">{orderId}</p>
            </div>
          )}
          {paymentId && (
            <div className="inline-block bg-green-50 rounded-lg px-6 py-3 mb-8 ml-4">
              <p className="text-sm text-green-600">Payment ID</p>
              <p className="font-mono font-bold text-green-900 text-xs">{paymentId}</p>
            </div>
          )}

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
                We're preparing your order for shipment
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-gray-50 rounded-2xl p-6"
            >
              <Truck className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="font-bold text-lg mb-2">Fast Shipping</h3>
              <p className="text-sm text-gray-600">
                Shipping across India
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
              <a href="https://wa.me/919325173787" className="font-bold hover:underline">
                +91 93251 73787
              </a>
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/equipment" className="elegant-button inline-flex items-center justify-center">
              Continue Shopping
            </a>
            <a href="/" className="elegant-button-outline inline-flex items-center justify-center">
              Back to Home
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default function OrderSuccessClient() {
  const [params, setParams] = useState<OrderSuccessParams>({ orderId: null, paymentId: null });
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const currentParams = new URLSearchParams(window.location.search);
    setParams({
      orderId: currentParams.get('orderId'),
      paymentId: currentParams.get('paymentId'),
    });
    setIsReady(true);
  }, []);

  if (!isReady) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 py-20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return <OrderSuccessContent orderId={params.orderId} paymentId={params.paymentId} />;
}
