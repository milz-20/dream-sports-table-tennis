'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Clock, Send } from 'lucide-react';

export default function ContactClient() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission - could send to API or WhatsApp
    const whatsappMessage = `Name: ${formData.name}%0AEmail: ${formData.email}%0APhone: ${formData.phone}%0AMessage: ${formData.message}`;
    window.open(`https://wa.me/918830771691?text=${whatsappMessage}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 py-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="font-display font-bold text-5xl lg:text-6xl text-black mb-6">
            Get in Touch
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Have questions about coaching or equipment? We're here to help!
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="space-y-8">
              <div className="flex items-start gap-4">
                <div className="bg-primary/10 p-4 rounded-full">
                  <MapPin className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold text-xl mb-2">Visit Us</h3>
                  <p className="text-gray-600">
                    Dream Sports Table Tennis Academy<br />
                    Pune, Maharashtra<br />
                    India
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-primary/10 p-4 rounded-full">
                  <Phone className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold text-xl mb-2">Call Us</h3>
                  <a href="tel:+918830771691" className="text-gray-600 hover:text-primary transition-colors">
                    +91 88307 71691
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-primary/10 p-4 rounded-full">
                  <Mail className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold text-xl mb-2">Email Us</h3>
                  <a href="mailto:info@dreamsportstt.com" className="text-gray-600 hover:text-primary transition-colors">
                    info@dreamsportstt.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-primary/10 p-4 rounded-full">
                  <Clock className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold text-xl mb-2">Academy Hours</h3>
                  <p className="text-gray-600">
                    Monday - Saturday: 6:00 AM - 10:00 PM<br />
                    Sunday: 7:00 AM - 8:00 PM
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-8 shadow-lg border-2 border-gray-100">
              <div className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none transition-colors"
                    placeholder="Enter your name"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none transition-colors"
                    placeholder="your.email@example.com"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none transition-colors"
                    placeholder="+91 XXXXX XXXXX"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    required
                    rows={5}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none transition-colors resize-none"
                    placeholder="Tell us how we can help you..."
                  />
                </div>

                <button
                  type="submit"
                  className="elegant-button w-full py-4 inline-flex items-center justify-center gap-2"
                >
                  <Send className="w-5 h-5" />
                  <span>Send Message</span>
                </button>

                <p className="text-sm text-gray-500 text-center">
                  Or WhatsApp us directly at{' '}
                  <a href="https://wa.me/918830771691" className="text-primary hover:underline">
                    +91 88307 71691
                  </a>
                </p>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
