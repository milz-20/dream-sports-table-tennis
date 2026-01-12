'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { ShoppingBag, CreditCard, MapPin, Phone, Mail, User as UserIcon, Truck } from 'lucide-react';
import AuthModal from '@/components/AuthModal';

// Razorpay types
declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function CheckoutClient() {
  const router = useRouter();
  const { items, getTotalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    pincode: '',
    paymentMethod: 'online',
    deliveryType: 'standard', // 'standard' or 'express'
  });
  const [isProcessing, setIsProcessing] = useState(false);

  // Calculate delivery charges
  const subtotal = getTotalPrice();
  const freeDeliveryThreshold = 10000;
  const expressDeliveryCharge = 250;
  
  const getDeliveryCharge = () => {
    if (formData.deliveryType === 'express') {
      return expressDeliveryCharge;
    }
    // Standard delivery is free above threshold, otherwise ₹100
    return subtotal >= freeDeliveryThreshold ? 0 : 100;
  };

  const deliveryCharge = getDeliveryCharge();
  const totalPrice = subtotal + deliveryCharge;

  // Pre-fill form with user data
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.name || '',
        email: user.email || '',
      }));
    }
  }, [user]);

  // Show auth modal if user is not logged in
  useEffect(() => {
    if (!user && items.length > 0) {
      setShowAuthModal(true);
    }
  }, [user, items.length]);

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
    // Check if user is logged in
    if (!user) {
      setShowAuthModal(true);
      return;
    }

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
      console.log('Creating order with amount:', totalPrice);
      console.log('Customer ID:', (user as any).customerId);
      
      // Create order on backend
      const orderResponse = await fetch(`${apiUrl}/payment/create-order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: totalPrice,
          currency: 'INR',
          receipt: `order_${Date.now()}`,
          customerId: (user as any).customerId, // Add customer ID from auth
          notes: {
            customerId: (user as any).customerId,
            customerName: formData.name,
            customerEmail: formData.email,
            customerPhone: formData.phone,
            customerAddress: formData.address,
            customerCity: formData.city,
            customerPincode: formData.pincode,
            deliveryType: formData.deliveryType,
            deliveryCharge: deliveryCharge,
            subtotal: subtotal,
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
        handler: async function (response: any) {
          // Payment successful
          console.log('Payment successful:', response);
          
          // Send WhatsApp notification
          try {
            await fetch('/api/notify-order', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                orderId: orderData.order.id,
                paymentId: response.razorpay_payment_id,
                customerName: formData.name,
                customerEmail: formData.email,
                customerPhone: formData.phone,
                customerAddress: formData.address,
                customerCity: formData.city,
                customerPincode: formData.pincode,
                items: items.map(item => ({
                  name: item.name,
                  quantity: item.quantity,
                  price: item.price,
                  category: item.category,
                })),
                subtotal: subtotal,
                deliveryType: formData.deliveryType,
                deliveryCharge: deliveryCharge,
                totalAmount: totalPrice,
                paymentMethod: 'Online Payment',
              }),
            });
          } catch (notifError) {
            console.error('Failed to send notification:', notifError);
            // Don't block the order flow if notification fails
          }
          
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

  const handleCODOrder = async () => {
    // Check if user is logged in
    if (!user) {
      setShowAuthModal(true);
      return;
    }

    // Handle Cash on Delivery
    const orderId = `COD_${Date.now()}`;
    
    // Send SMS notification
    try {
      await fetch('/api/notify-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderId: orderId,
          customerId: (user as any).customerId,
          customerName: formData.name,
          customerEmail: formData.email,
          customerPhone: formData.phone,
          customerAddress: formData.address,
          customerCity: formData.city,
          customerPincode: formData.pincode,
          items: items.map(item => ({
            name: item.name,
            quantity: item.quantity,
            price: item.price,
            category: item.category,
          })),
          subtotal: subtotal,
          deliveryType: formData.deliveryType,
          deliveryCharge: deliveryCharge,
          totalAmount: totalPrice,
          paymentMethod: 'Cash on Delivery',
        }),
      });
    } catch (error) {
      console.error('Failed to send notification:', error);
      // Don't block the order flow if notification fails
    }
    
    // Clear cart
    clearCart();
    
    router.push(`/order-success?orderId=${orderId}`);
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
    <>
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => {
          setShowAuthModal(false);
          if (!user) {
            router.push('/equipment');
          }
        }}
        redirectTo="/checkout"
      />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 py-20">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-display font-bold text-5xl text-black mb-12 text-center"
          >
            Checkout
          </motion.h1>

          {/* User Info Banner */}
          {user && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3"
            >
              <UserIcon className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-sm font-medium text-green-900">
                  Signed in as <span className="font-bold">{user.name}</span>
                </p>
                <p className="text-xs text-green-700">{user.email}</p>
              </div>
            </motion.div>
          )}

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

                <div>
                  <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                    <Truck className="w-5 h-5 text-primary" />
                    Delivery Options
                  </h3>
                  {subtotal >= freeDeliveryThreshold && (
                    <div className="mb-3 bg-green-50 border border-green-200 rounded-lg p-3 text-sm text-green-700">
                      🎉 You qualify for free standard delivery!
                    </div>
                  )}
                  <div className="space-y-3">
                    <label className="flex items-start gap-3 p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-primary transition-colors">
                      <input
                        type="radio"
                        name="delivery"
                        value="standard"
                        checked={formData.deliveryType === 'standard'}
                        onChange={(e) => setFormData({ ...formData, deliveryType: e.target.value })}
                        className="w-5 h-5 text-primary mt-0.5"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium">Standard Delivery</span>
                          <span className="font-bold text-primary">
                            {subtotal >= freeDeliveryThreshold ? 'FREE' : '₹100'}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">Delivery in 2-3 business days</p>
                        {subtotal < freeDeliveryThreshold && (
                          <p className="text-xs text-gray-500 mt-1">
                            Add ₹{(freeDeliveryThreshold - subtotal).toLocaleString('en-IN')} more for free delivery
                          </p>
                        )}
                      </div>
                    </label>
                    <label className="flex items-start gap-3 p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-primary transition-colors">
                      <input
                        type="radio"
                        name="delivery"
                        value="express"
                        checked={formData.deliveryType === 'express'}
                        onChange={(e) => setFormData({ ...formData, deliveryType: e.target.value })}
                        className="w-5 h-5 text-primary mt-0.5"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium">Express Delivery</span>
                          <span className="font-bold text-primary">₹{expressDeliveryCharge}</span>
                        </div>
                        <p className="text-sm text-gray-600">Next day delivery</p>
                      </div>
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
                  <span>₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span className="flex items-center gap-2">
                    <Truck className="w-4 h-4" />
                    Delivery ({formData.deliveryType === 'express' ? 'Express' : 'Standard'})
                  </span>
                  <span className={deliveryCharge === 0 ? "text-green-600 font-medium" : "text-gray-900"}>
                    {deliveryCharge === 0 ? 'FREE' : `₹${deliveryCharge.toLocaleString('en-IN')}`}
                  </span>
                </div>
                <div className="flex justify-between text-xl font-bold border-t-2 border-gray-200 pt-3">
                  <span>Total</span>
                  <span className="text-primary">₹{totalPrice.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>
          </div>
          </div>
        </div>
      </div>
    </>
  );
}
