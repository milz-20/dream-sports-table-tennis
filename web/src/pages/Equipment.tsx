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
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="inline-flex items-center space-x-2 bg-primary/10 text-primary border border-primary/20 px-4 py-2 rounded-full text-sm font-medium mb-6"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Premium Quality Equipment</span>
            </motion.div>
            <h1 className="font-display font-bold text-5xl lg:text-6xl text-foreground mb-6">
              <span className="bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent">
                Table Tennis Equipment
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Browse our curated selection of premium table tennis equipment. Every product is carefully chosen to ensure exceptional quality and performance.
            </p>
            <div className="flex items-center justify-center gap-8 mt-8 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-primary"></div>
                <span>Authentic Products</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-primary"></div>
                <span>Expert Guidance</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-primary"></div>
                <span>Best Prices</span>
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
            <h2 className="font-display font-bold text-4xl text-foreground mb-4">
              Premium Brands
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
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
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
                className="elegant-card p-8 text-center group cursor-pointer"
              >
                <motion.div 
                  whileHover={{ scale: 1.15, rotate: 360 }}
                  transition={{ duration: 0.6 }}
                  className="w-16 h-16 bg-gradient-to-br from-primary/20 to-orange-200 rounded-xl mx-auto mb-4 flex items-center justify-center shadow-ios"
                >
                  <Star className="w-8 h-8 text-primary" />
                </motion.div>
                <p className="font-display font-semibold text-foreground">{brand}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Help Section */}
      <section className="py-20 bg-gradient-to-br from-charcoal-900 via-charcoal-950 to-charcoal-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              animate={{ 
                rotate: [0, 10, -10, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{ 
                duration: 3,
                repeat: Infinity,
                repeatType: "reverse"
              }}
              className="w-20 h-20 bg-gradient-to-br from-primary to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-ios-lg"
            >
              <Package className="w-10 h-10 text-white drop-shadow-md" />
            </motion.div>
            <h2 className="font-display font-bold text-4xl lg:text-5xl mb-6">
              Need Help Choosing?
            </h2>
            <p className="text-lg text-charcoal-300 mb-8 max-w-2xl mx-auto leading-relaxed">
              Not sure which equipment is right for you? Our experts are here to help you find the perfect gear for your playing style and level. Free consultation included with every purchase.
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
    image: 'https://images.unsplash.com/photo-1593786481097-4c428e9eef4b?w=600&h=450&fit=crop&auto=format&q=80',
  },
  {
    icon: Circle,
    title: 'Balls',
    description: 'Competition-grade and training balls. Available in 3-star, 2-star, and practice ball options.',
    price: '$9.99',
    color: 'from-orange-500 to-orange-600',
    image: 'https://images.unsplash.com/photo-1565630916779-e303be97b6f5?w=600&h=450&fit=crop&auto=format&q=80',
  },
  {
    icon: Grid3x3,
    title: 'Rubbers',
    description: 'Premium rubber sheets for custom racket assembly. Various types: inverted, pips-out, long pips, and anti-spin.',
    price: '$19.99',
    color: 'from-amber-500 to-amber-600',
    image: 'https://images.unsplash.com/photo-1611765517661-1735c60a2aee?w=600&h=450&fit=crop&auto=format&q=80',
  },
  {
    icon: Table2,
    title: 'Tables',
    description: 'Indoor and outdoor table tennis tables. Competition standard and recreational models available.',
    price: '$399.99',
    color: 'from-blue-500 to-blue-600',
    image: 'https://images.unsplash.com/photo-1534158914592-062992fbe900?w=600&h=450&fit=crop&auto=format&q=80',
  },
  {
    icon: Shirt,
    title: 'Apparel',
    description: 'Performance clothing designed for table tennis. Shirts, shorts, shoes, and accessories.',
    price: '$24.99',
    color: 'from-purple-500 to-purple-600',
    image: 'https://images.unsplash.com/photo-1556906781-9a412961c28c?w=600&h=450&fit=crop&auto=format&q=80',
  },
  {
    icon: Package,
    title: 'Accessories',
    description: 'Racket cases, ball holders, nets, edge tape, cleaning supplies, and other essential accessories.',
    price: '$4.99',
    color: 'from-green-500 to-green-600',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&h=450&fit=crop&auto=format&q=80',
  },
];

// Product Card Component
function ProductCard({ icon: Icon, title, description, price, color, image, index }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      whileHover={{ y: -8, transition: { duration: 0.3 } }}
      className="elegant-card overflow-hidden group cursor-pointer"
    >
      {/* Product Icon */}
      <div className="aspect-[4/3] bg-gradient-to-br from-muted/30 to-muted/50 relative overflow-hidden flex items-center justify-center">
        <motion.div
          whileHover={{ scale: 1.2, rotate: 5 }}
          transition={{ duration: 0.3 }}
        >
          <Icon className="w-24 h-24 text-muted-foreground/40" />
        </motion.div>
      </div>

      {/* Content */}
      <div className="p-6">
        <motion.div 
          whileHover={{ scale: 1.1, rotate: 5 }}
          transition={{ duration: 0.3 }}
          className={`w-14 h-14 bg-gradient-to-br ${color} rounded-xl flex items-center justify-center mb-4 shadow-ios group-hover:shadow-ios-lg`}
        >
          <Icon className="w-7 h-7 text-white drop-shadow-md" />
        </motion.div>

        <h3 className="font-display font-bold text-xl text-foreground mb-3">
          {title}
        </h3>

        <p className="text-muted-foreground text-sm leading-relaxed mb-4">
          {description}
        </p>

        <div className="flex items-center justify-between pt-4 border-t">
          <div>
            <p className="text-xs text-muted-foreground mb-1">Starting from</p>
            <p className="font-display font-bold text-2xl bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">{price}</p>
          </div>
          <Link
            to="/contact"
            className="elegant-button-outline py-2 px-4 text-sm inline-flex items-center group/btn"
          >
            <span>View</span>
            <ArrowRight className="w-3 h-3 ml-2 group-hover/btn:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

export default Equipment;
