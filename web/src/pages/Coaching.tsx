import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Zap, TrendingUp, Flame, User, Clock, Check, ArrowRight, Award } from 'lucide-react';

const Coaching: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-gray-50 via-white to-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-center mb-12"
          >
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="inline-flex items-center space-x-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6 border border-primary/20"
            >
              <Award className="w-4 h-4" />
              <span>Expert-Led Training Programs</span>
            </motion.div>
            <h1 className="font-display font-bold text-5xl lg:text-6xl text-foreground mb-6">
              Coaching Programs
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Personalized training programs designed to elevate your game, from foundational skills to advanced competitive strategies.
            </p>
          </motion.div>

        </div>
      </section>

      {/* Programs Grid */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8">
            {programs.map((program, index) => (
              <ProgramCard key={index} {...program} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* What You'll Learn Section */}
      <section className="py-20 bg-gradient-to-br from-black/95 via-gray-900/95 to-black/95 backdrop-blur-md text-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="font-display font-bold text-4xl lg:text-5xl mb-6">
                What You'll Learn
              </h2>
              <p className="text-lg text-slate-300 mb-8">
                Our comprehensive training program covers all aspects of table tennis, from fundamental techniques to advanced competitive strategies.
              </p>
              
              <div className="space-y-4">
                {skills.map((skill, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                    className="flex items-start space-x-3"
                  >
                    <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-white mb-1">{skill.title}</h4>
                      <p className="text-slate-400 text-sm">{skill.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="aspect-[4/5] rounded-2xl bg-slate-800/80 backdrop-blur-sm shadow-ios-xl overflow-hidden border border-slate-700/50">
                {/* Placeholder for stock photo: Training techniques collage */}
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-center p-8">
                    <TrendingUp className="w-24 h-24 text-slate-600 mx-auto mb-4" />
                    <p className="text-slate-400 font-medium">Stock Photo: Training Techniques</p>
                    <p className="text-slate-500 text-sm mt-2">Professional skill development</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50/60 to-white/60 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-display font-bold text-4xl lg:text-5xl text-foreground mb-6">
              Ready to Begin?
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Take the first step towards mastering table tennis. Contact us to discuss which program is right for you.
            </p>
            <Link to="/contact" className="elegant-button inline-flex items-center group">
              <span>Get Started Today</span>
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </section>
    </motion.div>
  );
};

// Program data
const programs = [
  {
    icon: Zap,
    title: 'Beginner Program',
    duration: '8 sessions',
    price: '$320',
    priceUnit: '$40 per session',
    focus: 'Basic techniques, grip, stance, and fundamental strokes',
    perfectFor: 'New players and those returning to the sport',
    features: ['Proper grip techniques', 'Basic stroke fundamentals', 'Court positioning', 'Introduction to spin'],
    color: 'from-primary to-red-600',
  },
  {
    icon: TrendingUp,
    title: 'Intermediate Program',
    duration: '12 sessions',
    price: '$540',
    priceUnit: '$45 per session',
    focus: 'Advanced strokes, spin control, and match strategy',
    perfectFor: 'Players looking to compete at higher levels',
    features: ['Advanced stroke techniques', 'Spin mastery', 'Match strategies', 'Footwork optimization'],
    color: 'from-secondary to-black',
    featured: true,
  },
  {
    icon: Flame,
    title: 'Advanced Training',
    duration: 'Customized',
    price: 'Custom',
    priceUnit: 'Tailored pricing',
    focus: 'Competition preparation, advanced tactics, physical conditioning',
    perfectFor: 'Tournament players and serious competitors',
    features: ['Competition preparation', 'Advanced tactics', 'Physical conditioning', 'Mental game training'],
    color: 'from-red-500 to-red-600',
  },
  {
    icon: User,
    title: 'Private Lessons',
    duration: 'Flexible',
    price: '$75',
    priceUnit: 'per hour',
    focus: 'Personalized one-on-one training tailored to your needs',
    perfectFor: 'Anyone seeking individual attention',
    features: ['One-on-one coaching', 'Flexible scheduling', 'Customized curriculum', 'Video analysis'],
    color: 'from-primary to-secondary',
  },
];

// Skills data
const skills = [
  {
    title: 'Proper Grip & Stance',
    description: 'Master the foundational elements that every great player builds upon',
  },
  {
    title: 'Stroke Techniques',
    description: 'Develop powerful and accurate forehand and backhand strokes',
  },
  {
    title: 'Serving Strategies',
    description: 'Learn advanced serving techniques to gain the upper hand',
  },
  {
    title: 'Spin Generation',
    description: 'Control and manipulate spin to dominate rallies',
  },
  {
    title: 'Footwork & Movement',
    description: 'Enhance court coverage and positioning for optimal play',
  },
  {
    title: 'Match Tactics',
    description: 'Develop strategic thinking and mental resilience',
  },
];

// Program Card Component
function ProgramCard({ icon: Icon, title, duration, price, priceUnit, focus, perfectFor, features, color, featured, index }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      whileHover={{ y: -8, transition: { duration: 0.3 } }}
      className={`elegant-card p-8 relative overflow-hidden group ${
        featured ? 'ring-2 ring-primary/30 border-primary/20' : ''
      }`}
    >
      {featured && (
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.3 }}
          className="absolute top-0 right-0 bg-gradient-to-br from-primary to-orange-600 text-white text-xs font-bold px-4 py-1 rounded-bl-lg shadow-ios"
        >
          MOST POPULAR
        </motion.div>
      )}

      <motion.div 
        whileHover={{ scale: 1.1, rotate: 5 }}
        transition={{ duration: 0.3 }}
        className={`w-16 h-16 bg-gradient-to-br ${color} rounded-xl flex items-center justify-center mb-6 shadow-ios group-hover:shadow-ios-lg`}
      >
        <Icon className="w-8 h-8 text-white drop-shadow-md" />
      </motion.div>

      <h3 className="font-display font-bold text-2xl text-foreground mb-2">
        {title}
      </h3>

      <div className="flex items-baseline space-x-2 mb-6">
        <span className="font-display font-bold text-4xl text-charcoal-950">{price}</span>
        <span className="text-charcoal-500 text-sm">{priceUnit}</span>
      </div>

      <div className="space-y-3 mb-6">
        <div className="flex items-center space-x-2 text-sm">
          <Clock className="w-4 h-4 text-charcoal-400" />
          <span className="text-charcoal-600">{duration}</span>
        </div>
      </div>

      <div className="space-y-4 mb-6">
        <div>
          <p className="text-sm font-semibold text-charcoal-900 mb-1">Focus:</p>
          <p className="text-charcoal-600 text-sm">{focus}</p>
        </div>
        <div>
          <p className="text-sm font-semibold text-charcoal-900 mb-1">Perfect for:</p>
          <p className="text-charcoal-600 text-sm">{perfectFor}</p>
        </div>
      </div>

      <div className="border-t border-charcoal-200 pt-6 mb-6">
        <p className="text-sm font-semibold text-charcoal-900 mb-3">What's Included:</p>
        <ul className="space-y-2">
          {features.map((feature: string, idx: number) => (
            <li key={idx} className="flex items-start space-x-2 text-sm text-charcoal-600">
              <Check className="w-4 h-4 text-accent-500 flex-shrink-0 mt-0.5" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </div>

      <Link
        to="/contact"
        className={`w-full ${
          featured ? 'elegant-button' : 'elegant-button-outline'
        } inline-flex items-center justify-center group`}
      >
        <span>Book Now</span>
        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
      </Link>
    </motion.div>
  );
}

export default Coaching;
