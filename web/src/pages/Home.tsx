import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Trophy, Target, Clock, ArrowRight, Sparkles, Users, Award } from 'lucide-react';
import heroImage from '../assets/images/home_hero3.jpg';

const testimonials = [
  {
    quote: "The coaching program transformed my game completely. Within 3 months, I went from a beginner to confidently competing in local tournaments.",
    name: "Sarah Chen",
    role: "Competitive Player",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&auto=format&q=80"
  },
  {
    quote: "Outstanding equipment quality and expert advice. The staff helped me find the perfect paddle setup that matches my playing style perfectly.",
    name: "Michael Rodriguez",
    role: "Club Champion",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&auto=format&q=80"
  },
  {
    quote: "Best investment in my athletic journey. The personalized training plans and professional guidance have been invaluable to my development.",
    name: "Emma Thompson",
    role: "Youth Player",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&auto=format&q=80"
  }
];

const Home: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-slate-50/80 via-white/80 to-slate-50/80 backdrop-blur-sm overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-24 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Hero Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <div className="inline-flex items-center space-x-2 bg-accent-50 text-accent-600 px-4 py-2 rounded-full text-sm font-medium mb-6">
                <Sparkles className="w-4 h-4" />
                <span>Premium Table Tennis Experience</span>
              </div>
              
              <h1 className="font-display font-bold text-5xl lg:text-7xl text-charcoal-950 mb-6 leading-tight">
                Elevate Your
                <span className="text-accent-500"> Game</span>
              </h1>
              
              <p className="text-xl text-charcoal-600 leading-relaxed mb-8 max-w-xl">
                Professional coaching and premium equipment designed to help players of all levels achieve excellence in table tennis.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/coaching" className="elegant-button inline-flex items-center justify-center group">
                  <span>Book a Session</span>
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link to="/equipment" className="elegant-button-outline inline-flex items-center justify-center">
                  Browse Equipment
                </Link>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-8 mt-12 pt-12 border-t border-border">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.8, duration: 0.5 }}
                  className="text-center"
                >
                  <div className="font-display font-bold text-4xl bg-gradient-to-r from-primary to-orange-600 bg-clip-text text-transparent">500+</div>
                  <div className="text-sm text-muted-foreground mt-2 font-medium">Students Trained</div>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.9, duration: 0.5 }}
                  className="text-center"
                >
                  <div className="font-display font-bold text-4xl bg-gradient-to-r from-primary to-orange-600 bg-clip-text text-transparent">15+</div>
                  <div className="text-sm text-muted-foreground mt-2 font-medium">Years Experience</div>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.0, duration: 0.5 }}
                  className="text-center"
                >
                  <div className="font-display font-bold text-4xl bg-gradient-to-r from-primary to-orange-600 bg-clip-text text-transparent">98%</div>
                  <div className="text-sm text-muted-foreground mt-2 font-medium">Satisfaction Rate</div>
                </motion.div>
              </div>
            </motion.div>

            {/* Hero Image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="relative"
            >
              <div className="aspect-[4/3] rounded-2xl shadow-ios-xl overflow-hidden">
                <img 
                  src={heroImage}
                  alt="Professional table tennis player in action"
                  className="w-full h-full object-cover"
                  loading="eager"
                />
              </div>
              {/* Decorative Element */}
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-accent-500 rounded-2xl opacity-20 blur-2xl"></div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gradient-to-br from-slate-50/60 to-white/60 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="font-display font-bold text-4xl lg:text-5xl text-charcoal-950 mb-4">
              Why Choose Dream Sports
            </h2>
            <p className="text-lg text-charcoal-600 max-w-2xl mx-auto">
              Experience excellence in every aspect of your table tennis journey
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <FeatureCard key={index} {...feature} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-12 bg-gradient-to-br from-slate-900/95 via-slate-950/95 to-slate-900/95 backdrop-blur-md">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <div className="p-8 lg:p-12 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-display font-bold text-4xl lg:text-5xl text-white mb-6">
              Our Mission
            </h2>
            <p className="text-lg text-slate-300 leading-relaxed mb-6">
              With over 15 years of experience in table tennis coaching and equipment retail, 
              we're dedicated to helping players of all levels achieve their goals.
            </p>
            <p className="text-lg text-slate-300 leading-relaxed mb-8">
              Our mission is to promote the sport and provide the best resources for your success, 
              combining expert coaching with premium equipment to create an unmatched training experience.
            </p>
            <Link to="/contact" className="elegant-button inline-flex items-center group">
              <span>Get in touch with us</span>
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-12 bg-gradient-to-br from-muted/20 to-background/60 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="font-display font-bold text-4xl lg:text-5xl text-foreground mb-4">
              What Our Players Say
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Real stories from players who transformed their game with us
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="bg-card/80 backdrop-blur-sm rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 border border-border/40"
              >
                <div className="flex items-center gap-4 mb-4">
                  <img 
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-16 h-16 rounded-full object-cover border-2 border-primary/20"
                    loading="lazy"
                  />
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-5 h-5 text-primary fill-current" viewBox="0 0 20 20">
                        <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                      </svg>
                    ))}
                  </div>
                </div>
                <p className="text-muted-foreground mb-4 leading-relaxed italic">"{testimonial.quote}"</p>
                <div className="border-t pt-4">
                  <p className="font-semibold text-foreground">{testimonial.name}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-br from-primary/5 to-background/60 backdrop-blur-sm relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="max-w-4xl mx-auto px-6 lg:px-8 relative z-10">
          <div className="glass-section p-8 lg:p-12 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="w-20 h-20 bg-gradient-to-br from-primary to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-ios-lg">
              <Award className="w-10 h-10 text-white drop-shadow-md" />
            </div>
            <h2 className="font-display font-bold text-4xl lg:text-5xl text-foreground mb-6">
              Ready to Start Your Journey?
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join hundreds of satisfied players who have elevated their game with our expert coaching and premium equipment.
            </p>
            <Link to="/coaching" className="elegant-button inline-flex items-center group">
              <span>Book Your First Session</span>
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
          </div>
        </div>
      </section>
    </motion.div>
  );
};

// Feature data
const features = [
  {
    icon: Trophy,
    title: 'Expert Coaching',
    description: 'Get personalized training from experienced coaches. Whether you\'re a beginner or advanced player, we\'ll help you reach your full potential.',
  },
  {
    icon: Target,
    title: 'Quality Equipment',
    description: 'Browse our curated selection of premium table tennis equipment from top brands, carefully chosen for performance and durability.',
  },
  {
    icon: Clock,
    title: 'Flexible Scheduling',
    description: 'Book coaching sessions at times that work for you with easy online booking and management of your training schedule.',
  },
];

// Feature Card Component
function FeatureCard({ icon: Icon, title, description, index }: { icon: any; title: string; description: string; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      className="elegant-card p-8 group hover:scale-[1.02] transition-transform duration-300"
    >
      <div className="w-16 h-16 bg-gradient-to-br from-primary via-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mb-6 shadow-ios group-hover:shadow-ios-lg transition-all group-hover:scale-110 duration-300">
        <Icon className="w-8 h-8 text-white drop-shadow-md" />
      </div>
      <h3 className="font-display font-semibold text-xl text-foreground mb-3 group-hover:text-primary transition-colors">
        {title}
      </h3>
      <p className="text-muted-foreground leading-relaxed">
        {description}
      </p>
    </motion.div>
  );
}

export default Home;
