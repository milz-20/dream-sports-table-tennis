import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, Clock, MapPin, Send, CheckCircle } from 'lucide-react';

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement form submission to DynamoDB via API
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    }, 3000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-charcoal-50 via-white to-charcoal-50 py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center space-x-2 bg-accent-50 text-accent-600 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Mail className="w-4 h-4" />
              <span>Get in Touch</span>
            </div>
            <h1 className="font-display font-bold text-5xl lg:text-6xl text-charcoal-950 mb-6">
              Contact Us
            </h1>
            <p className="text-xl text-charcoal-600 max-w-3xl mx-auto leading-relaxed">
              Have questions about our coaching programs or equipment? We're here to help you get started on your table tennis journey.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-5 gap-12">
            {/* Contact Info Sidebar */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="lg:col-span-2"
            >
              <h2 className="font-display font-bold text-3xl text-charcoal-950 mb-6">
                Let's Connect
              </h2>
              <p className="text-charcoal-600 leading-relaxed mb-8">
                Whether you're a beginner looking to start your table tennis journey or an experienced player seeking advanced training, we're here to help.
              </p>

              {/* Contact Cards */}
              <div className="space-y-4">
                <ContactInfoCard
                  icon={Mail}
                  title="Email"
                  content="info@dreamsports-tt.com"
                  subtext="We'll respond within 24 hours"
                />
                <ContactInfoCard
                  icon={Phone}
                  title="Phone"
                  content="(555) 123-4567"
                  subtext="Mon-Sat, 9AM-7PM"
                />
                <ContactInfoCard
                  icon={Clock}
                  title="Business Hours"
                  content="Monday - Saturday"
                  subtext="9:00 AM - 7:00 PM"
                />
                <ContactInfoCard
                  icon={MapPin}
                  title="Location"
                  content="123 Sports Avenue"
                  subtext="Your City, ST 12345"
                />
              </div>

              {/* Map Placeholder */}
              <div className="mt-8 aspect-video rounded-xl bg-gradient-to-br from-charcoal-100 to-charcoal-200 shadow-elegant overflow-hidden">
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="w-12 h-12 text-charcoal-400 mx-auto mb-2" />
                    <p className="text-charcoal-500 text-sm">Map Location</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="lg:col-span-3"
            >
              {isSubmitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="elegant-card p-12 text-center"
                >
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="w-10 h-10 text-green-600" />
                  </div>
                  <h3 className="font-display font-bold text-2xl text-charcoal-950 mb-3">
                    Message Sent Successfully!
                  </h3>
                  <p className="text-charcoal-600">
                    Thank you for reaching out. We'll get back to you within 24 hours.
                  </p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="elegant-card p-8">
                  <h3 className="font-display font-bold text-2xl text-charcoal-950 mb-6">
                    Send us a Message
                  </h3>

                  <div className="space-y-6">
                    {/* Name Input */}
                    <div>
                      <label className="block text-sm font-semibold text-charcoal-900 mb-2">
                        Full Name <span className="text-accent-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="elegant-input"
                        placeholder="John Doe"
                      />
                    </div>

                    {/* Email Input */}
                    <div>
                      <label className="block text-sm font-semibold text-charcoal-900 mb-2">
                        Email Address <span className="text-accent-500">*</span>
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="elegant-input"
                        placeholder="john@example.com"
                      />
                    </div>

                    {/* Phone Input */}
                    <div>
                      <label className="block text-sm font-semibold text-charcoal-900 mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="elegant-input"
                        placeholder="(555) 123-4567"
                      />
                    </div>

                    {/* Subject Select */}
                    <div>
                      <label className="block text-sm font-semibold text-charcoal-900 mb-2">
                        Subject <span className="text-accent-500">*</span>
                      </label>
                      <select
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                        className="elegant-input"
                      >
                        <option value="">Select a subject</option>
                        <option value="coaching">Coaching Inquiry</option>
                        <option value="equipment">Equipment Question</option>
                        <option value="booking">Session Booking</option>
                        <option value="general">General Inquiry</option>
                      </select>
                    </div>

                    {/* Message Textarea */}
                    <div>
                      <label className="block text-sm font-semibold text-charcoal-900 mb-2">
                        Message <span className="text-accent-500">*</span>
                      </label>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        rows={6}
                        className="elegant-input resize-none"
                        placeholder="Tell us about your table tennis goals and how we can help..."
                      />
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      className="elegant-button w-full inline-flex items-center justify-center group"
                    >
                      <Send className="w-4 h-4 mr-2" />
                      <span>Send Message</span>
                    </button>

                    <p className="text-xs text-charcoal-500 text-center">
                      By submitting this form, you agree to our privacy policy and terms of service.
                    </p>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        </div>
      </section>
    </motion.div>
  );
};

// Contact Info Card Component
function ContactInfoCard({ icon: Icon, title, content, subtext }: { icon: any; title: string; content: string; subtext: string }) {
  return (
    <div className="elegant-card p-5 hover:scale-[1.02] transition-transform duration-300">
      <div className="flex items-start space-x-4">
        <div className="w-12 h-12 bg-gradient-to-br from-accent-500 to-accent-600 rounded-lg flex items-center justify-center flex-shrink-0 shadow-md">
          <Icon className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-charcoal-500 uppercase tracking-wide mb-1">
            {title}
          </p>
          <p className="font-semibold text-charcoal-950 mb-1">
            {content}
          </p>
          <p className="text-sm text-charcoal-600">
            {subtext}
          </p>
        </div>
      </div>
    </div>
  );
}

export default Contact;
