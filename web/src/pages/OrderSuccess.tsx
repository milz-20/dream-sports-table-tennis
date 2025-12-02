import React from 'react';
import { motion } from 'framer-motion';
import { useLocation, Link } from 'react-router-dom';
import { CheckCircle, Package, Truck, Phone, Mail, Home } from 'lucide-react';

const OrderSuccess: React.FC = () => {
  const location = useLocation();
  const orderDetails = location.state?.orderDetails;

  if (!orderDetails) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="text-center">
          <p className="text-gray-600 mb-4">No order details found</p>
          <Link to="/equipment" className="elegant-button">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-3xl mx-auto">
        {/* Success Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200, damping: 15 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h1 className="font-display font-bold text-4xl text-gray-900 mb-2">
            Order Placed Successfully!
          </h1>
          <p className="text-lg text-gray-600">
            Thank you for your order. We'll deliver it soon!
          </p>
        </motion.div>

        {/* Order Details Card */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-6"
        >
          {/* Order ID */}
          <div className="border-b border-gray-200 pb-6 mb-6">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">Order ID</p>
                <p className="font-display font-bold text-2xl text-primary">
                  {orderDetails.orderId}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600 mb-1">Order Date</p>
                <p className="font-semibold text-gray-900">
                  {new Date(orderDetails.orderDate).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </p>
              </div>
            </div>
          </div>

          {/* Customer & Delivery Info */}
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Package className="w-5 h-5 text-primary" />
                Customer Details
              </h3>
              <div className="space-y-2 text-sm">
                <p className="text-gray-600">
                  <span className="font-medium text-gray-900">{orderDetails.fullName}</span>
                </p>
                <p className="text-gray-600 flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  {orderDetails.phone}
                </p>
                <p className="text-gray-600 flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  {orderDetails.email}
                </p>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Truck className="w-5 h-5 text-primary" />
                Delivery Address
              </h3>
              <div className="space-y-1 text-sm text-gray-600">
                <p>{orderDetails.address}</p>
                <p>
                  {orderDetails.city}, {orderDetails.pincode}
                </p>
                <p className="font-medium text-primary mt-2">
                  {orderDetails.deliveryType === 'instant'
                    ? 'Instant Delivery (3 hours)'
                    : 'Standard Delivery (24 hours)'}
                </p>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="border-t border-gray-200 pt-6 mb-6">
            <h3 className="font-semibold text-gray-900 mb-4">Order Items</h3>
            <div className="space-y-3">
              {orderDetails.items.map((item: any) => (
                <div key={item.id} className="flex gap-4 bg-gray-50 p-4 rounded-lg">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{item.name}</p>
                    <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                    <p className="text-sm font-semibold text-primary">
                      ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Price Summary */}
          <div className="border-t border-gray-200 pt-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-semibold">
                  ₹{orderDetails.totalPrice.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Delivery Charges</span>
                <span className="font-semibold">
                  {orderDetails.deliveryCharge === 0 ? (
                    <span className="text-green-600">FREE</span>
                  ) : (
                    `₹${orderDetails.deliveryCharge}`
                  )}
                </span>
              </div>
              <div className="border-t border-gray-300 pt-2 mt-2">
                <div className="flex justify-between">
                  <span className="font-display font-bold text-lg">Total Paid</span>
                  <span className="font-display font-bold text-lg text-primary">
                    ₹{orderDetails.finalTotal.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
              <div className="bg-green-50 border border-green-200 rounded-lg p-3 mt-4">
                <p className="text-sm font-medium text-green-800">
                  Payment Method:{' '}
                  {orderDetails.paymentMethod === 'online'
                    ? 'Online Payment'
                    : 'Cash on Delivery'}
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <Link to="/" className="elegant-button flex-1 inline-flex items-center justify-center gap-2">
            <Home className="w-5 h-5" />
            Back to Home
          </Link>
          <Link
            to="/equipment"
            className="elegant-button-outline flex-1 inline-flex items-center justify-center gap-2"
          >
            Continue Shopping
          </Link>
        </motion.div>

        {/* Contact Support */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 text-center"
        >
          <p className="text-sm text-gray-600">
            Need help with your order?{' '}
            <Link to="/contact" className="text-primary font-semibold hover:underline">
              Contact Support
            </Link>
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default OrderSuccess;
