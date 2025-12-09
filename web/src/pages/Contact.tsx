import React, { useState, useEffect } from 'react';
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

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    document.title = 'Contact Us - Pune Table Tennis Coaching & Equipment';
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Contact Pune Table Tennis for coaching inquiries, equipment purchases, or trial sessions. Located in Pune, Maharashtra. Call or visit us for expert guidance on table tennis.');
    }
  }, []);

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
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="inline-flex items-center space-x-2 bg-primary/10 text-primary border border-primary/20 px-4 py-2 rounded-full text-sm font-medium mb-6"
            >
              <Mail className="w-4 h-4" />
              <span>Get in Touch</span>
            </motion.div>
            <h1 className="font-display font-bold text-5xl lg:text-6xl text-foreground mb-6">
              <span className="bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent">
                Contact Us
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
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
              <h2 className="font-display font-bold text-3xl text-foreground mb-6">
                Let's Connect
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-8">
                Whether you're a beginner looking to start your table tennis journey or an experienced player seeking advanced training, we're here to help. Our team typically responds within 24 hours.
              </p>

              {/* Contact Cards */}
              <div className="space-y-4">
                <ContactInfoCard
                  icon={Mail}
                  title="Email"
                  content="dstta786@gmail.com"
                  subtext="We'll respond within 24 hours"
                />
                <ContactInfoCard
                  icon={Phone}
                  title="Phone"
                  content="+91 88307 71691"
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
                  title="Main Location"
                  content="Deccan Gymkhana, Pune"
                  subtext="Other branches: R Square, Lodha Belmondo"
                />
              </div>

              {/* Map/Location Image */}
              <div className="mt-8 aspect-video rounded-xl shadow-ios overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1524661135-423995f22d0b?w=800&h=450&fit=crop&auto=format&q=80"
                  alt="Sports facility location"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
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
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, type: "spring" }}
                  className="elegant-card p-12 text-center"
                >
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1, rotate: [0, 10, -10, 0] }}
                    transition={{ delay: 0.2, duration: 0.6 }}
                    className="w-24 h-24 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-ios-lg"
                  >
                    <CheckCircle className="w-12 h-12 text-white drop-shadow-md" />
                  </motion.div>
                  <h3 className="font-display font-bold text-3xl text-foreground mb-3">
                    Message Sent Successfully!
                  </h3>
                  <p className="text-muted-foreground text-lg">
                    Thank you for reaching out. We'll get back to you within 24 hours.
                  </p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="elegant-card p-8">
                  <h3 className="font-display font-bold text-2xl text-foreground mb-2">
                    Send us a Message
                  </h3>
                  <p className="text-muted-foreground mb-6">Fill out the form below and we'll respond as soon as possible</p>

                  <div className="space-y-6">
                    {/* Name Input */}
                    <div>
                      <label className="block text-sm font-semibold text-charcoal-900 mb-2">
                        Full Name <span className="text-primary">*</span>
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
                        Email Address <span className="text-primary">*</span>
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
                        Subject <span className="text-primary">*</span>
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
                        Message <span className="text-primary">*</span>
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
    <motion.div 
      whileHover={{ x: 4, transition: { duration: 0.2 } }}
      className="elegant-card p-5 group cursor-pointer"
    >
      <div className="flex items-start space-x-4">
        <motion.div 
          whileHover={{ scale: 1.1, rotate: 5 }}
          transition={{ duration: 0.3 }}
          className="w-12 h-12 bg-gradient-to-br from-primary to-red-700 rounded-lg flex items-center justify-center flex-shrink-0 shadow-ios group-hover:shadow-ios-lg"
        >
          <Icon className="w-5 h-5 text-white drop-shadow-md" />
        </motion.div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">
            {title}
          </p>
          <p className="font-semibold text-foreground mb-1">
            {content}
          </p>
          <p className="text-sm text-muted-foreground">
            {subtext}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

export default Contact;
