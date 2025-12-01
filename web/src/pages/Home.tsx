import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Trophy, Target, Clock, ArrowRight, Sparkles, Users, Award } from 'lucide-react';

const Home: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-charcoal-50 via-white to-charcoal-50 overflow-hidden">
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
              <div className="grid grid-cols-3 gap-6 mt-12 pt-12 border-t border-charcoal-200">
                <div>
                  <div className="font-display font-bold text-3xl text-charcoal-950">500+</div>
                  <div className="text-sm text-charcoal-600 mt-1">Students Trained</div>
                </div>
                <div>
                  <div className="font-display font-bold text-3xl text-charcoal-950">15+</div>
                  <div className="text-sm text-charcoal-600 mt-1">Years Experience</div>
                </div>
                <div>
                  <div className="font-display font-bold text-3xl text-charcoal-950">98%</div>
                  <div className="text-sm text-charcoal-600 mt-1">Satisfaction Rate</div>
                </div>
              </div>
            </motion.div>

            {/* Hero Image Placeholder */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="relative"
            >
              <div className="aspect-[4/3] rounded-2xl bg-gradient-to-br from-charcoal-100 to-charcoal-200 shadow-elegant-xl overflow-hidden">
                {/* Placeholder for stock photo: Professional table tennis player in action */}
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-center">
                    <Trophy className="w-24 h-24 text-charcoal-400 mx-auto mb-4" />
                    <p className="text-charcoal-500 font-medium">Stock Photo: Player in Action</p>
                    <p className="text-charcoal-400 text-sm mt-2">Professional table tennis gameplay</p>
                  </div>
                </div>
              </div>
              {/* Decorative Element */}
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-accent-500 rounded-2xl opacity-20 blur-2xl"></div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white">
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
      <section className="py-24 bg-charcoal-950 text-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="aspect-[4/3] rounded-2xl bg-charcoal-800 shadow-elegant-xl overflow-hidden">
                {/* Placeholder for stock photo: Coaching session or training facility */}
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-center">
                    <Users className="w-24 h-24 text-charcoal-600 mx-auto mb-4" />
                    <p className="text-charcoal-400 font-medium">Stock Photo: Coaching Session</p>
                    <p className="text-charcoal-500 text-sm mt-2">Professional training environment</p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="font-display font-bold text-4xl lg:text-5xl mb-6">
                Our Mission
              </h2>
              <p className="text-lg text-charcoal-300 leading-relaxed mb-6">
                With over 15 years of experience in table tennis coaching and equipment retail, 
                we're dedicated to helping players of all levels achieve their goals.
              </p>
              <p className="text-lg text-charcoal-300 leading-relaxed mb-8">
                Our mission is to promote the sport and provide the best resources for your success, 
                combining expert coaching with premium equipment to create an unmatched training experience.
              </p>
              <Link to="/contact" className="inline-flex items-center text-accent-500 font-medium hover:text-accent-400 transition-colors group">
                <span>Get in touch with us</span>
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-charcoal-50 to-white">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Award className="w-16 h-16 text-accent-500 mx-auto mb-6" />
            <h2 className="font-display font-bold text-4xl lg:text-5xl text-charcoal-950 mb-6">
              Ready to Start Your Journey?
            </h2>
            <p className="text-lg text-charcoal-600 mb-8 max-w-2xl mx-auto">
              Join hundreds of satisfied players who have elevated their game with our expert coaching and premium equipment.
            </p>
            <Link to="/coaching" className="elegant-button inline-flex items-center group">
              <span>Book Your First Session</span>
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
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
      <div className="w-14 h-14 bg-gradient-to-br from-accent-500 to-accent-600 rounded-xl flex items-center justify-center mb-6 shadow-md group-hover:shadow-lg transition-shadow">
        <Icon className="w-7 h-7 text-white" />
      </div>
      <h3 className="font-display font-semibold text-xl text-charcoal-950 mb-3">
        {title}
      </h3>
      <p className="text-charcoal-600 leading-relaxed">
        {description}
      </p>
    </motion.div>
  );
}

export default Home;
