import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Zap, TrendingUp, Flame, User, Clock, Check, ArrowRight, Award, ChevronLeft, ChevronRight } from 'lucide-react';
import whatWillYouLearn from '@/assets/images/whatWillYouLearn1.jpg';

// Image Carousel Component
const ImageCarousel: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const images = [
    { src: whatWillYouLearn, alt: 'What You Will Learn' }
  ];

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const goToImage = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="relative"
    >
      <div className="aspect-[4/5] rounded-2xl bg-slate-800/80 backdrop-blur-sm shadow-ios-xl overflow-hidden border border-slate-700/50 relative group">
        {/* Images */}
        <AnimatePresence mode="wait">
          <motion.img
            key={currentIndex}
            src={images[currentIndex].src}
            alt={images[currentIndex].alt}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.3 }}
            className="w-full h-full object-cover"
            loading="eager"
            style={{ imageRendering: 'crisp-edges' } as React.CSSProperties}
          />
        </AnimatePresence>

        {/* Navigation Arrows */}
        <button
          onClick={prevImage}
          className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 hover:bg-black/70 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          aria-label="Previous image"
        >
          <ChevronLeft className="w-6 h-6 text-white" />
        </button>
        <button
          onClick={nextImage}
          className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 hover:bg-black/70 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          aria-label="Next image"
        >
          <ChevronRight className="w-6 h-6 text-white" />
        </button>

        {/* Dots Indicator */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => goToImage(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? 'bg-white w-8'
                  : 'bg-white/50 hover:bg-white/75'
              }`}
              aria-label={`Go to image ${index + 1}`}
            />
          ))}
        </div>

        {/* Image Counter */}
        <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm px-3 py-1 rounded-full">
          <span className="text-white text-sm font-medium">
            {currentIndex + 1} / {images.length}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

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
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="max-w-3xl mx-auto text-center"
            >
              <h2 className="font-display font-bold text-4xl lg:text-5xl mb-6">
                What You'll Learn
              </h2>
              <p className="text-lg text-slate-300 mb-12">
                Our comprehensive training program covers all aspects of table tennis, from fundamental techniques to advanced competitive strategies.
              </p>
              
              <div className="grid md:grid-cols-2 gap-6">
                {skills.map((skill, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                    className="text-left"
                  >
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-white mb-1">{skill.title}</h4>
                        <p className="text-slate-400 text-sm">{skill.description}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Know the Coach Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="inline-flex items-center space-x-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6 border border-primary/20"
            >
              <User className="w-4 h-4" />
              <span>Meet Your Coach</span>
            </motion.div>
            <h2 className="font-display font-bold text-4xl lg:text-5xl text-foreground mb-6">
              Know the Coach
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Train with an experienced professional who has dedicated his life to mastering and teaching table tennis
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Coach Info */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h3 className="font-display font-bold text-3xl text-foreground mb-4">
                Danish Aga
              </h3>
              <p className="text-lg text-primary font-semibold mb-6">
                Commonwealth Certified Coach | National Level Player
              </p>

              <div className="space-y-4 mb-8">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                  <p className="text-muted-foreground">
                    <span className="font-semibold text-foreground">Commonwealth Certified Coach</span> - Internationally recognized coaching qualification
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                  <p className="text-muted-foreground">
                    <span className="font-semibold text-foreground">National Level Player</span> - Competed at the highest level in India
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                  <p className="text-muted-foreground">
                    <span className="font-semibold text-foreground">10+ Years of Coaching Experience</span> - Trained hundreds of players from beginners to competitive athletes
                  </p>
                </div>
              </div>

              <p className="text-muted-foreground leading-relaxed mb-6">
                Coach Danish brings a wealth of experience and expertise to every training session. His passion for table tennis and dedication to student development has helped countless players achieve their goals, from mastering basic techniques to competing at state and national levels.
              </p>

              <div className="flex flex-wrap gap-3">
                <div className="elegant-card px-4 py-3">
                  <p className="text-xs text-muted-foreground mb-1">Experience</p>
                  <p className="font-bold text-xl text-foreground">10+ Years</p>
                </div>
                <div className="elegant-card px-4 py-3">
                  <p className="text-xs text-muted-foreground mb-1">Students Trained</p>
                  <p className="font-bold text-xl text-foreground">500+</p>
                </div>
                <div className="elegant-card px-4 py-3">
                  <p className="text-xs text-muted-foreground mb-1">Success Rate</p>
                  <p className="font-bold text-xl text-foreground">95%</p>
                </div>
              </div>
            </motion.div>

            {/* Coach Media */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              {/* Coach Photo */}
              <div className="elegant-card overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1622163642998-1ea32b0bbc67?w=800&h=600&fit=crop&auto=format&q=80"
                  alt="Coach Danish Aga"
                  className="w-full aspect-[4/3] object-cover"
                />
                <div className="p-4 bg-gradient-to-br from-primary/5 to-red-700/5">
                  <p className="text-sm font-semibold text-foreground">Coach Danish Aga in action</p>
                  <p className="text-xs text-muted-foreground">Demonstrating professional techniques</p>
                </div>
              </div>

              {/* Coach Video */}
              <div className="elegant-card overflow-hidden">
                <div className="aspect-video bg-slate-900 relative group">
                  {/* Video placeholder - replace with actual video */}
                  <img
                    src="https://images.unsplash.com/photo-1611916656173-875e4277bea6?w=800&h=450&fit=crop&auto=format&q=80"
                    alt="Coach Danish Aga Skills Video"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                    <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center shadow-lg cursor-pointer group-hover:scale-110 transition-transform">
                      <div className="w-0 h-0 border-t-8 border-t-transparent border-l-12 border-l-white border-b-8 border-b-transparent ml-1"></div>
                    </div>
                  </div>
                </div>
                <div className="p-4 bg-gradient-to-br from-primary/5 to-red-700/5">
                  <p className="text-sm font-semibold text-foreground">Watch Coach Danish's Skills</p>
                  <p className="text-xs text-muted-foreground">See professional techniques in action</p>
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
