import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Disc, Circle, Grid3x3, Table2, Shirt, Package, ArrowRight, Star, ShoppingBag } from 'lucide-react';

const Equipment: React.FC = () => {
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
              <ShoppingBag className="w-4 h-4" />
              <span>Premium Quality Equipment</span>
            </div>
            <h1 className="font-display font-bold text-5xl lg:text-6xl text-charcoal-950 mb-6">
              Table Tennis Equipment
            </h1>
            <p className="text-xl text-charcoal-600 max-w-3xl mx-auto leading-relaxed">
              Browse our curated selection of premium table tennis equipment. Every product is carefully chosen to ensure exceptional quality and performance.
            </p>
          </motion.div>

          {/* Hero Image Placeholder */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="max-w-4xl mx-auto"
          >
            <div className="aspect-[21/9] rounded-2xl bg-gradient-to-br from-charcoal-100 to-charcoal-200 shadow-elegant-xl overflow-hidden">
              {/* Placeholder for stock photo: Equipment display or product showcase */}
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-center">
                  <Package className="w-20 h-20 text-charcoal-400 mx-auto mb-4" />
                  <p className="text-charcoal-500 font-medium">Stock Photo: Premium Equipment Display</p>
                  <p className="text-charcoal-400 text-sm mt-2">Professional table tennis gear showcase</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Product Categories Grid */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product, index) => (
              <ProductCard key={index} {...product} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Featured Brands Section */}
      <section className="py-20 bg-charcoal-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="font-display font-bold text-4xl text-charcoal-950 mb-4">
              Premium Brands
            </h2>
            <p className="text-lg text-charcoal-600 max-w-2xl mx-auto">
              We partner with the world's leading table tennis brands to bring you the finest equipment
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {['Butterfly', 'Stiga', 'DHS', 'Yasaka'].map((brand, index) => (
              <motion.div
                key={brand}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="elegant-card p-8 text-center group hover:scale-105 transition-transform duration-300"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-charcoal-100 to-charcoal-200 rounded-xl mx-auto mb-4 flex items-center justify-center">
                  <Star className="w-8 h-8 text-charcoal-500" />
                </div>
                <p className="font-display font-semibold text-charcoal-950">{brand}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Help Section */}
      <section className="py-20 bg-charcoal-950 text-white">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Package className="w-16 h-16 text-accent-500 mx-auto mb-6" />
            <h2 className="font-display font-bold text-4xl lg:text-5xl mb-6">
              Need Help Choosing?
            </h2>
            <p className="text-lg text-charcoal-300 mb-8 max-w-2xl mx-auto">
              Not sure which equipment is right for you? Our experts are here to help you find the perfect gear for your playing style and level.
            </p>
            <Link to="/contact" className="elegant-button inline-flex items-center group">
              <span>Contact Our Experts</span>
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </section>
    </motion.div>
  );
};

// Product data
const products = [
  {
    icon: Disc,
    title: 'Rackets & Blades',
    description: 'Professional and recreational rackets from leading brands. Pre-assembled rackets and custom blade + rubber combinations available.',
    price: '$29.99',
    color: 'from-red-500 to-red-600',
  },
  {
    icon: Circle,
    title: 'Balls',
    description: 'Competition-grade and training balls. Available in 3-star, 2-star, and practice ball options.',
    price: '$9.99',
    color: 'from-orange-500 to-orange-600',
  },
  {
    icon: Grid3x3,
    title: 'Rubbers',
    description: 'Premium rubber sheets for custom racket assembly. Various types: inverted, pips-out, long pips, and anti-spin.',
    price: '$19.99',
    color: 'from-amber-500 to-amber-600',
  },
  {
    icon: Table2,
    title: 'Tables',
    description: 'Indoor and outdoor table tennis tables. Competition standard and recreational models available.',
    price: '$399.99',
    color: 'from-blue-500 to-blue-600',
  },
  {
    icon: Shirt,
    title: 'Apparel',
    description: 'Performance clothing designed for table tennis. Shirts, shorts, shoes, and accessories.',
    price: '$24.99',
    color: 'from-purple-500 to-purple-600',
  },
  {
    icon: Package,
    title: 'Accessories',
    description: 'Racket cases, ball holders, nets, edge tape, cleaning supplies, and other essential accessories.',
    price: '$4.99',
    color: 'from-green-500 to-green-600',
  },
];

// Product Card Component
function ProductCard({ icon: Icon, title, description, price, color, index }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      className="elegant-card overflow-hidden group hover:scale-[1.02] transition-transform duration-300"
    >
      {/* Image Placeholder */}
      <div className="aspect-[4/3] bg-gradient-to-br from-charcoal-100 to-charcoal-200 relative overflow-hidden">
        <div className="w-full h-full flex items-center justify-center">
          <Icon className="w-20 h-20 text-charcoal-400" />
        </div>
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300"></div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className={`w-12 h-12 bg-gradient-to-br ${color} rounded-lg flex items-center justify-center mb-4 shadow-md`}>
          <Icon className="w-6 h-6 text-white" />
        </div>

        <h3 className="font-display font-bold text-xl text-charcoal-950 mb-3">
          {title}
        </h3>

        <p className="text-charcoal-600 text-sm leading-relaxed mb-4">
          {description}
        </p>

        <div className="flex items-center justify-between pt-4 border-t border-charcoal-200">
          <div>
            <p className="text-xs text-charcoal-500 mb-1">Starting from</p>
            <p className="font-display font-bold text-2xl text-charcoal-950">{price}</p>
          </div>
          <Link
            to="/contact"
            className="elegant-button-outline py-2 px-4 text-sm inline-flex items-center group"
          >
            <span>View</span>
            <ArrowRight className="w-3 h-3 ml-2 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

export default Equipment;
