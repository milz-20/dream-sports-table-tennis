'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, Camera, Package, Clock, AlertCircle, CheckCircle, DollarSign, Send, ArrowRight } from 'lucide-react';

interface RacketSubmission {
  // Racket Details
  bladeBrand: string;
  bladeModel: string;
  forehandRubber: string;
  backhandRubber: string;
  
  // Usage Information
  monthsUsed: string;
  playingFrequency: string;
  condition: string;
  
  // Contact Information
  name: string;
  phone: string;
  email: string;
  city: string;
  
  // Additional Details
  purchasePrice: string;
  expectedPrice: string;
  additionalNotes: string;
  
  // Images
  images: File[];
}

export default function SellRacketClient() {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState<RacketSubmission>({
    bladeBrand: '',
    bladeModel: '',
    forehandRubber: '',
    backhandRubber: '',
    monthsUsed: '',
    playingFrequency: '',
    condition: '',
    name: '',
    phone: '',
    email: '',
    city: '',
    purchasePrice: '',
    expectedPrice: '',
    additionalNotes: '',
    images: [],
  });
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length + formData.images.length > 5) {
      alert('Maximum 5 images allowed');
      return;
    }

    setFormData({
      ...formData,
      images: [...formData.images, ...files],
    });

    // Create preview URLs
    const newPreviews = files.map(file => URL.createObjectURL(file));
    setImagePreviews([...imagePreviews, ...newPreviews]);
  };

  const removeImage = (index: number) => {
    const newImages = formData.images.filter((_, i) => i !== index);
    const newPreviews = imagePreviews.filter((_, i) => i !== index);
    setFormData({ ...formData, images: newImages });
    setImagePreviews(newPreviews);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Here you would typically send to an API endpoint
    // For now, we'll send via WhatsApp with the details
    
    const message = `
🏓 *Sell My Racket Submission*

*Racket Details:*
• Blade: ${formData.bladeBrand} ${formData.bladeModel}
• Forehand Rubber: ${formData.forehandRubber}
• Backhand Rubber: ${formData.backhandRubber}

*Usage Information:*
• Months Used: ${formData.monthsUsed}
• Playing Frequency: ${formData.playingFrequency}
• Condition: ${formData.condition}

*Pricing:*
• Original Purchase Price: ₹${formData.purchasePrice}
• Expected Selling Price: ₹${formData.expectedPrice}

*Contact Information:*
• Name: ${formData.name}
• Phone: ${formData.phone}
• Email: ${formData.email}
• City: ${formData.city}

*Additional Notes:*
${formData.additionalNotes || 'None'}

Note: Images will be shared separately.
    `.trim();

    const whatsappUrl = `https://wa.me/918830771691?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    
    setSubmitted(true);
  };

  const nextStep = () => {
    setStep(step + 1);
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50 py-20">
        <div className="max-w-3xl mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl p-12 shadow-2xl text-center"
          >
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
            <h2 className="font-display font-bold text-3xl text-black mb-4">
              Submission Received!
            </h2>
            <p className="text-gray-600 text-lg mb-8">
              Thank you for your submission. Our team will review your racket details and contact you within 24-48 hours with a price quote.
            </p>
            <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-6 mb-8">
              <h3 className="font-bold text-lg mb-3">📋 What Happens Next?</h3>
              <ul className="text-left space-y-2 text-sm text-gray-700">
                <li>✓ We'll review the images and details you provided</li>
                <li>✓ Our experts will assess the racket condition</li>
                <li>✓ You'll receive a price quote via WhatsApp/Email</li>
                <li>✓ If you accept, we'll arrange pickup and payment</li>
              </ul>
            </div>
            <Link
              href="/"
              className="elegant-button inline-flex items-center justify-center gap-3"
            >
              <span>Back to Home</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-amber-50 py-20">
      <div className="max-w-4xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="font-display font-bold text-4xl lg:text-5xl text-black mb-4">
            💰 Sell Your Used Racket
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Got a racket you no longer use? Sell it to us! We'll evaluate your racket and offer you a fair price.
          </p>
        </motion.div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-12">
          <div className="flex items-center">
            <div className={`flex items-center justify-center w-10 h-10 rounded-full ${step >= 1 ? 'bg-primary text-white' : 'bg-gray-200 text-gray-500'} font-bold`}>
              1
            </div>
            <div className={`h-1 w-16 mx-2 ${step >= 2 ? 'bg-primary' : 'bg-gray-200'}`} />
            <div className={`flex items-center justify-center w-10 h-10 rounded-full ${step >= 2 ? 'bg-primary text-white' : 'bg-gray-200 text-gray-500'} font-bold`}>
              2
            </div>
            <div className={`h-1 w-16 mx-2 ${step >= 3 ? 'bg-primary' : 'bg-gray-200'}`} />
            <div className={`flex items-center justify-center w-10 h-10 rounded-full ${step >= 3 ? 'bg-primary text-white' : 'bg-gray-200 text-gray-500'} font-bold`}>
              3
            </div>
          </div>
        </div>

        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
        >
          <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-8 lg:p-12 shadow-2xl">
            {/* Step 1: Racket Details */}
            {step === 1 && (
              <div className="space-y-6">
                <h2 className="font-display font-bold text-2xl text-black mb-6 flex items-center gap-3">
                  <Package className="w-7 h-7 text-primary" />
                  Racket Details
                </h2>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Blade Brand *
                    </label>
                    <input
                      type="text"
                      name="bladeBrand"
                      value={formData.bladeBrand}
                      onChange={handleInputChange}
                      placeholder="e.g., Butterfly, Stiga, Yasaka"
                      required
                      className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-primary focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Blade Model *
                    </label>
                    <input
                      type="text"
                      name="bladeModel"
                      value={formData.bladeModel}
                      onChange={handleInputChange}
                      placeholder="e.g., Viscaria, Carbonado"
                      required
                      className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-primary focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Forehand Rubber *
                    </label>
                    <input
                      type="text"
                      name="forehandRubber"
                      value={formData.forehandRubber}
                      onChange={handleInputChange}
                      placeholder="e.g., Tenergy 05"
                      required
                      className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-primary focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Backhand Rubber *
                    </label>
                    <input
                      type="text"
                      name="backhandRubber"
                      value={formData.backhandRubber}
                      onChange={handleInputChange}
                      placeholder="e.g., Tenergy 64"
                      required
                      className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-primary focus:outline-none"
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={nextStep}
                    className="elegant-button inline-flex items-center justify-center gap-3"
                  >
                    <span>Next Step</span>
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Usage & Condition */}
            {step === 2 && (
              <div className="space-y-6">
                <h2 className="font-display font-bold text-2xl text-black mb-6 flex items-center gap-3">
                  <Clock className="w-7 h-7 text-primary" />
                  Usage & Condition
                </h2>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      How long have you used it? *
                    </label>
                    <select
                      name="monthsUsed"
                      value={formData.monthsUsed}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-primary focus:outline-none"
                    >
                      <option value="">Select duration</option>
                      <option value="0-3">0-3 months</option>
                      <option value="3-6">3-6 months</option>
                      <option value="6-12">6-12 months</option>
                      <option value="12-24">1-2 years</option>
                      <option value="24+">2+ years</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Playing Frequency *
                    </label>
                    <select
                      name="playingFrequency"
                      value={formData.playingFrequency}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-primary focus:outline-none"
                    >
                      <option value="">Select frequency</option>
                      <option value="daily">Daily (7 days/week)</option>
                      <option value="frequent">Frequent (4-6 days/week)</option>
                      <option value="moderate">Moderate (2-3 days/week)</option>
                      <option value="occasional">Occasional (1 day/week)</option>
                      <option value="rare">Rare (few times/month)</option>
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Overall Condition *
                    </label>
                    <select
                      name="condition"
                      value={formData.condition}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-primary focus:outline-none"
                    >
                      <option value="">Select condition</option>
                      <option value="excellent">Excellent - Like new, minimal wear</option>
                      <option value="very-good">Very Good - Well maintained, light wear</option>
                      <option value="good">Good - Normal wear, fully functional</option>
                      <option value="fair">Fair - Visible wear, still usable</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Original Purchase Price (₹) *
                    </label>
                    <input
                      type="number"
                      name="purchasePrice"
                      value={formData.purchasePrice}
                      onChange={handleInputChange}
                      placeholder="e.g., 15000"
                      required
                      className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-primary focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Expected Selling Price (₹)
                    </label>
                    <input
                      type="number"
                      name="expectedPrice"
                      value={formData.expectedPrice}
                      onChange={handleInputChange}
                      placeholder="e.g., 8000"
                      className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-primary focus:outline-none"
                    />
                  </div>
                </div>

                <div className="flex justify-between">
                  <button
                    type="button"
                    onClick={prevStep}
                    className="px-6 py-3 rounded-lg border-2 border-gray-300 text-gray-700 font-medium hover:bg-gray-50"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={nextStep}
                    className="elegant-button inline-flex items-center justify-center gap-3"
                  >
                    <span>Next Step</span>
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Images & Contact */}
            {step === 3 && (
              <div className="space-y-6">
                <h2 className="font-display font-bold text-2xl text-black mb-6 flex items-center gap-3">
                  <Camera className="w-7 h-7 text-primary" />
                  Images & Contact Info
                </h2>

                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Upload Images (Max 5) *
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-4">
                      Upload clear photos of both sides, blade, and any wear
                    </p>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageUpload}
                      className="hidden"
                      id="image-upload"
                    />
                    <label
                      htmlFor="image-upload"
                      className="cursor-pointer inline-block px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors"
                    >
                      Choose Images
                    </label>
                  </div>

                  {/* Image Previews */}
                  {imagePreviews.length > 0 && (
                    <div className="grid grid-cols-3 md:grid-cols-5 gap-4 mt-4">
                      {imagePreviews.map((preview, index) => (
                        <div key={index} className="relative">
                          <img
                            src={preview}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-24 object-cover rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Contact Information */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-primary focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-primary focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-primary focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      City *
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-primary focus:outline-none"
                    />
                  </div>
                </div>

                {/* Additional Notes */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Additional Notes
                  </label>
                  <textarea
                    name="additionalNotes"
                    value={formData.additionalNotes}
                    onChange={handleInputChange}
                    rows={4}
                    placeholder="Any other details about the racket, damages, or special features..."
                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-primary focus:outline-none"
                  />
                </div>

                {/* Info Box */}
                <div className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-6">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-1" />
                    <div>
                      <h4 className="font-bold text-amber-900 mb-2">How We Evaluate</h4>
                      <ul className="text-sm text-amber-800 space-y-1">
                        <li>• Blade condition (structural integrity, wear)</li>
                        <li>• Rubber life remaining (grip, thickness)</li>
                        <li>• Brand and model value</li>
                        <li>• Usage duration and frequency</li>
                        <li>• Current market demand</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between">
                  <button
                    type="button"
                    onClick={prevStep}
                    className="px-6 py-3 rounded-lg border-2 border-gray-300 text-gray-700 font-medium hover:bg-gray-50"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={formData.images.length === 0}
                    className="elegant-button inline-flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send className="w-5 h-5" />
                    <span>Submit for Evaluation</span>
                  </button>
                </div>
              </div>
            )}
          </form>
        </motion.div>

        {/* Benefits Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-12 grid md:grid-cols-3 gap-6"
        >
          <div className="bg-white rounded-2xl p-6 shadow-lg text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="font-bold text-lg mb-2">Fair Pricing</h3>
            <p className="text-gray-600 text-sm">
              We offer competitive prices based on market value and condition
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Package className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="font-bold text-lg mb-2">Easy Process</h3>
            <p className="text-gray-600 text-sm">
              Simple form, quick evaluation, fast payment
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="font-bold text-lg mb-2">Trusted Service</h3>
            <p className="text-gray-600 text-sm">
              Professional evaluation and secure transactions
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
