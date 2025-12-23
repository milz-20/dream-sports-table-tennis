'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useCart } from '@/contexts/CartContext';
import { ShoppingBag, CreditCard, MapPin, Phone, Mail } from 'lucide-react';

// Razorpay types
declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function CheckoutClient() {
  const router = useRouter();
  const { items, getTotalPrice, clearCart } = useCart();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    pincode: '',
    paymentMethod: 'online',
  });
  const [isProcessing, setIsProcessing] = useState(false);

  // Load Razorpay script
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    setIsProcessing(true);

    try {
      // Load Razorpay script
      const isLoaded = await loadRazorpayScript();
      if (!isLoaded) {
        alert('Failed to load Razorpay SDK. Please check your connection.');
        setIsProcessing(false);
        return;
      }

      // Get API Gateway URL from environment or use default
      const apiUrl = process.env.NEXT_PUBLIC_PAYMENT_API_URL;
      
      if (!apiUrl || apiUrl === 'YOUR_API_GATEWAY_URL') {
        alert('Payment API is not configured. Please restart the dev server after adding .env.local file.');
        console.error('NEXT_PUBLIC_PAYMENT_API_URL not set. Current value:', apiUrl);
        setIsProcessing(false);
        return;
      }
      
      console.log('API URL:', apiUrl);
      console.log('Creating order with amount:', getTotalPrice());
      
      // Create order on backend
      const orderResponse = await fetch(`${apiUrl}/payment/create-order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: getTotalPrice(),
          currency: 'INR',
          receipt: `order_${Date.now()}`,
          notes: {
            customerName: formData.name,
            customerEmail: formData.email,
            customerPhone: formData.phone,
            customerAddress: formData.address,
            customerCity: formData.city,
            customerPincode: formData.pincode,
            items: JSON.stringify(items.map(item => ({
              id: item.id,
              name: item.name,
              quantity: item.quantity,
              price: item.price,
            }))),
          },
        }),
      });

      console.log('Order response status:', orderResponse.status);
      const orderData = await orderResponse.json();
      console.log('Order data:', orderData);

      if (!orderData.success) {
        throw new Error(orderData.error || 'Failed to create order');
      }

      // Razorpay options
      const options = {
        key: orderData.key_id,
        amount: orderData.order.amount,
        currency: orderData.order.currency,
        name: 'All About Table Tennis',
        description: 'Table Tennis Equipment Purchase',
        order_id: orderData.order.id,
        prefill: {
          name: formData.name,
          email: formData.email,
          contact: formData.phone,
        },
        theme: {
          color: '#dc2626',
        },
        handler: function (response: any) {
          // Payment successful
          console.log('Payment successful:', response);
          
          // Clear cart
          clearCart();
          
          // Redirect to success page
          router.push(`/order-success?orderId=${orderData.order.id}&paymentId=${response.razorpay_payment_id}`);
        },
        modal: {
          ondismiss: function () {
            setIsProcessing(false);
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error('Payment error:', error);
      console.error('Error details:', error instanceof Error ? error.message : error);
      alert(`Payment failed: ${error instanceof Error ? error.message : 'Please try again.'}`);
      setIsProcessing(false);
    }
  };

  const handleCODOrder = () => {
    // Handle Cash on Delivery
    router.push('/order-success');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.paymentMethod === 'online') {
      handlePayment();
    } else {
      handleCODOrder();
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <ShoppingBag className="w-24 h-24 text-gray-300 mx-auto mb-6" />
          <h1 className="font-display font-bold text-4xl text-black mb-4">Your cart is empty</h1>
          <p className="text-gray-600 mb-8">Add some items to your cart before checking out.</p>
          <a href="/equipment" className="elegant-button inline-flex items-center gap-2">
            Browse Equipment
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 py-20">
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-display font-bold text-5xl text-black mb-12 text-center"
        >
          Checkout
        </motion.h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-8 shadow-lg border-2 border-gray-100">
              <h2 className="font-bold text-2xl mb-6 flex items-center gap-2">
                <MapPin className="w-6 h-6 text-primary" />
                Delivery Information
              </h2>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none"
                    placeholder="Enter your full name"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none"
                      placeholder="your.email@example.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone *</label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none"
                      placeholder="+91 XXXXX XXXXX"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Delivery Address *</label>
                  <textarea
                    required
                    rows={3}
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none resize-none"
                    placeholder="Enter your complete address"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">City *</label>
                    <input
                      type="text"
                      required
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Pincode *</label>
                    <input
                      type="text"
                      required
                      value={formData.pincode}
                      onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none"
                      placeholder="411001"
                    />
                  </div>
                </div>

                <div>
                  <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-primary" />
                    Payment Method
                  </h3>
                  <div className="space-y-3">
                    <label className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-primary transition-colors">
                      <input
                        type="radio"
                        name="payment"
                        value="online"
                        checked={formData.paymentMethod === 'online'}
                        onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                        className="w-5 h-5 text-primary"
                      />
                      <div className="flex-1">
                        <span className="font-medium">Online Payment (Razorpay)</span>
                        <p className="text-sm text-gray-600">Pay securely with UPI, Cards, Netbanking</p>
                      </div>
                    </label>
                    <label className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-primary transition-colors">
                      <input
                        type="radio"
                        name="payment"
                        value="cod"
                        checked={formData.paymentMethod === 'cod'}
                        onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                        className="w-5 h-5 text-primary"
                      />
                      <span className="font-medium">Cash on Delivery</span>
                    </label>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isProcessing}
                  className="elegant-button w-full py-4 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isProcessing ? 'Processing...' : formData.paymentMethod === 'online' ? 'Proceed to Payment' : 'Place Order'}
                </button>
              </div>
            </form>
          </div>

          {/* Order Summary */}
          <div>
            <div className="bg-white rounded-2xl p-8 shadow-lg border-2 border-gray-100 sticky top-24">
              <h2 className="font-bold text-2xl mb-6">Order Summary</h2>
              
              <div className="space-y-4 mb-6">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-lg" />
                    <div className="flex-1">
                      <h3 className="font-medium text-sm line-clamp-2">{item.name}</h3>
                      <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                      <p className="font-bold text-primary">₹{(item.price * item.quantity).toLocaleString('en-IN')}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t-2 border-gray-200 pt-6 space-y-3">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>₹{getTotalPrice().toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Delivery</span>
                  <span className="text-green-600 font-medium">FREE</span>
                </div>
                <div className="flex justify-between text-xl font-bold border-t-2 border-gray-200 pt-3">
                  <span>Total</span>
                  <span className="text-primary">₹{getTotalPrice().toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
