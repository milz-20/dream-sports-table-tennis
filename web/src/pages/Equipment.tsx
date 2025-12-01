import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Star, ShoppingBag, ArrowRight, ShoppingCart, Package, Zap, MapPin, TrendingUp } from 'lucide-react';

const Equipment: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<'blades' | 'rubbers'>('blades');
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
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="inline-flex items-center space-x-2 bg-primary/10 text-primary border border-primary/20 px-4 py-2 rounded-full text-sm font-medium mb-6"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Premium Quality Equipment</span>
            </motion.div>
            <h1 className="font-display font-bold text-5xl lg:text-6xl text-black mb-6">
              Table Tennis Equipment in Pune
            </h1>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed mb-8">
              Professional Butterfly, Stiga table tennis equipment with fast delivery in Pune. Shop professional blades and rubbers used by champions.
            </p>

            {/* Category Tabs */}
            <div className="flex items-center justify-center gap-4 mt-8">
              <button
                onClick={() => setActiveCategory('blades')}
                className={`px-8 py-3 rounded-lg font-semibold transition-all duration-300 ${
                  activeCategory === 'blades'
                    ? 'bg-primary text-white shadow-lg'
                    : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-primary'
                }`}
              >
                🏓 Professional Blades
              </button>
              <button
                onClick={() => setActiveCategory('rubbers')}
                className={`px-8 py-3 rounded-lg font-semibold transition-all duration-300 ${
                  activeCategory === 'rubbers'
                    ? 'bg-primary text-white shadow-lg'
                    : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-primary'
                }`}
              >
                🎯 Premium Rubbers
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <h2 className="font-display font-bold text-3xl text-black mb-4 text-center">
            {activeCategory === 'blades' ? '🏓 Professional Blades' : '🎯 Premium Rubbers'}
          </h2>
          <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
            {activeCategory === 'blades' 
              ? 'Premium quality blades for every playing style and skill level'
              : 'High-performance rubbers for maximum spin, speed, and control'}
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {(activeCategory === 'blades' ? blades : rubbers).map((product, index) => (
              <ProductCard key={index} {...product} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Fast Delivery Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <h2 className="font-display font-bold text-3xl text-black mb-12 text-center">
            🚚 Fast Delivery in Pune
          </h2>
          <p className="text-gray-600 text-center mb-12">
            Get your equipment delivered quickly and safely
          </p>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl p-8 border-2 border-gray-200"
            >
              <h3 className="font-display font-bold text-2xl text-black mb-2">Standard Delivery</h3>
              <p className="text-4xl font-bold text-primary mb-4">24 Hours</p>
              <p className="text-gray-600">
                Free delivery within Pune city limits. Order today and receive your equipment tomorrow!
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-primary rounded-2xl p-8 border-2 border-primary text-white relative overflow-hidden"
            >
              <div className="absolute top-4 right-4 bg-white text-primary text-xs font-bold px-3 py-1 rounded-full">
                FASTEST
              </div>
              <h3 className="font-display font-bold text-2xl mb-2">Instant Delivery</h3>
              <p className="text-4xl font-bold mb-4">3 Hours</p>
              <p className="text-white/90">
                Need it urgently? Get instant delivery within 3 hours anywhere in Pune!
              </p>
            </motion.div>
          </div>

          <p className="text-center text-sm text-gray-500 mt-8">
            * Delivery times applicable for orders placed within Pune city limits. Contact us for delivery outside Pune.
          </p>
        </div>
      </section>

      {/* Expert Advice Section */}
      <section className="py-20 bg-gradient-to-br from-black via-gray-900 to-black text-white">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="font-display font-bold text-4xl mb-6">
            Need Expert Advice?
          </h2>
          <p className="text-lg text-gray-300 mb-8">
            Our coaches can help you choose the perfect equipment for your playing style
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/contact" className="elegant-button inline-flex items-center justify-center group">
              <span>Get Expert Advice</span>
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link to="/coaching" className="elegant-button-outline inline-flex items-center justify-center text-white border-white hover:bg-white hover:text-black">
              View Coaching
            </Link>
          </div>
        </div>
      </section>
    </motion.div>
  );
};

// Product data for Blades
const blades = [
  {
    id: 'butterfly-timo-boll-alc',
    name: 'Butterfly Timo Boll ALC',
    category: 'Blade',
    rating: 4.9,
    reviews: 187,
    composition: '5+2 (5 Wood + 2 Arylate-Carbon)',
    speed: 'OFF+',
    origin: 'Made in Japan',
    description: 'Legendary blade used by Timo Boll. Perfect balance of speed and control with Arylate Carbon layers.',
    price: 14299,
    originalPrice: 16999,
    image: 'https://taurustabletennis.com/public-images/TimoBollALC_1.webp',
  },
  {
    id: 'butterfly-zhang-jike-alc',
    name: 'Butterfly Zhang Jike ALC',
    category: 'Blade',
    rating: 4.8,
    reviews: 156,
    composition: '5+2 (5 Wood + 2 Arylate-Carbon)',
    speed: 'OFF',
    origin: 'Made in Japan',
    description: 'Signature blade of Olympic Champion Zhang Jike. Excellent for aggressive play with superior control.',
    price: 13849,
    originalPrice: 15999,
    image: 'https://worldoftabletennis.com/cdn/shop/files/ZhangJikeALC1.jpg?v=1706361517&width=800',
  },
  {
    id: 'butterfly-lin-yun-ju-super-zlc',
    name: 'Butterfly Lin Yun-Ju Super ZLC',
    category: 'Blade',
    rating: 4.9,
    reviews: 98,
    composition: '5+2 (5 Wood + 2 Super ZL Carbon)',
    speed: 'OFF++',
    origin: 'Made in Japan',
    description: 'Ultra-fast Super ZLC blade for explosive power. Ideal for advanced players seeking maximum speed.',
    price: 26499,
    originalPrice: 29999,
    image: 'https://worldoftabletennis.com/cdn/shop/files/lin1.jpg?v=1740485439&width=800',
  },
  {
    id: 'butterfly-viscaria',
    name: 'Butterfly Viscaria',
    category: 'Blade',
    rating: 4.9,
    reviews: 234,
    composition: '5+2 (5 Wood + 2 Arylate-Carbon)',
    speed: 'OFF',
    origin: 'Made in Japan',
    description: 'Most popular professional blade. Used by Jan-Ove Waldner. Perfect for all-round offensive play.',
    price: 15299,
    originalPrice: 17499,
    image: 'https://worldoftabletennis.com/cdn/shop/files/vc.jpg?v=1711086820&width=800',
  },
  {
    id: 'butterfly-innerforce-layer-alc',
    name: 'Butterfly Innerforce Layer ALC',
    category: 'Blade',
    rating: 4.7,
    reviews: 145,
    composition: '5+2 (5 Wood + 2 Arylate-Carbon)',
    speed: 'OFF-',
    origin: 'Made in Japan',
    description: 'Inner fiber construction for excellent feel. Great for controlled offensive play and precision.',
    price: 12549,
    originalPrice: 14499,
    image: 'https://worldoftabletennis.com/cdn/shop/files/inner1.webp?v=1735216037&width=800',
  },
  {
    id: 'butterfly-harimoto-tomokazu-innerforce-alc',
    name: 'Butterfly Harimoto Tomokazu Innerforce ALC',
    category: 'Blade',
    rating: 4.8,
    reviews: 112,
    composition: '5+2 (5 Wood + 2 Arylate-Carbon)',
    speed: 'OFF',
    origin: 'Made in Japan',
    description: 'Signature blade of young prodigy Harimoto. Exceptional balance of speed, spin, and control.',
    price: 15849,
    originalPrice: 17999,
    image: 'https://worldoftabletennis.com/cdn/shop/files/IMG-8909.jpg?v=1692577357&width=800',
  },
];

// Product data for Rubbers
const rubbers = [
  {
    id: 'butterfly-tenergy-05',
    name: 'Butterfly Tenergy 05',
    category: 'Rubber',
    rating: 4.8,
    reviews: 312,
    type: 'Inverted (Tensioned)',
    hardness: '36° (Medium-Soft)',
    arc: 'High Arc',
    description: 'The most popular rubber worldwide. Spring Sponge X technology for maximum spin and speed.',
    price: 4599,
    originalPrice: 5499,
    image: 'https://worldoftabletennis.com/cdn/shop/products/rubber_tenergy_05_cover_1_1.jpg?v=1706344500&width=800',
  },
  {
    id: 'butterfly-dignics-09c',
    name: 'Butterfly Dignics 09C',
    category: 'Rubber',
    rating: 4.9,
    reviews: 187,
    type: 'Inverted (Tensioned)',
    hardness: '40° (Medium)',
    arc: 'Medium-High Arc',
    description: 'Latest flagship rubber. Combines speed and control with new High Tension technology.',
    price: 6549,
    originalPrice: 7499,
    image: 'https://worldoftabletennis.com/cdn/shop/products/butterfly-dignics-09c.jpg?v=1704533936&width=800',
  },
  {
    id: 'butterfly-dignics-05',
    name: 'Butterfly Dignics 05',
    category: 'Rubber',
    rating: 4.8,
    reviews: 234,
    type: 'Inverted (Tensioned)',
    hardness: '36° (Medium-Soft)',
    arc: 'High Arc',
    description: 'Evolution of Tenergy 05. Enhanced spin capability with improved durability and consistency.',
    price: 6299,
    originalPrice: 7299,
    image: 'https://worldoftabletennis.com/cdn/shop/products/butterfly-dignics-05.jpg?v=1704533956&width=800',
  },
  {
    id: 'butterfly-tenergy-64',
    name: 'Butterfly Tenergy 64',
    category: 'Rubber',
    rating: 4.7,
    reviews: 267,
    type: 'Inverted (Tensioned)',
    hardness: '36° (Medium-Soft)',
    arc: 'Medium Arc',
    description: 'Perfect for all-round players. Balanced speed and spin with excellent control and consistency.',
    price: 4599,
    originalPrice: 5499,
    image: 'https://worldoftabletennis.com/cdn/shop/products/rubber_tenergy_64_cover_1.webp?v=1704535746&width=800',
  },
  {
    id: 'butterfly-tenergy-80',
    name: 'Butterfly Tenergy 80',
    category: 'Rubber',
    rating: 4.6,
    reviews: 198,
    type: 'Inverted (Tensioned)',
    hardness: '36° (Medium-Soft)',
    arc: 'Low-Medium Arc',
    description: 'Fast and direct trajectory. Ideal for players who prefer speed over high arc shots.',
    price: 4599,
    originalPrice: 5499,
    image: 'https://worldoftabletennis.com/cdn/shop/products/rubber_tenergy_80_cover_1_1.jpg?v=1704535791&width=800',
  },
  {
    id: 'butterfly-rozena',
    name: 'Butterfly Rozena',
    category: 'Rubber',
    rating: 4.5,
    reviews: 156,
    type: 'Inverted (Tensioned)',
    hardness: '35° (Soft)',
    arc: 'High Arc',
    description: 'Entry-level tensioned rubber. Great spin and control for developing players at an affordable price.',
    price: 3399,
    originalPrice: 3999,
    image: 'https://worldoftabletennis.com/cdn/shop/products/rubber_rozena_cover_1.webp?v=1704535600&width=800',
  },
];

// Product Card Component with ratings and specs
interface ProductCardProps {
  id: string;
  name: string;
  category: string;
  rating: number;
  reviews: number;
  composition?: string;
  speed?: string;
  origin?: string;
  type?: string;
  hardness?: string;
  arc?: string;
  description: string;
  price: number;
  originalPrice: number;
  image: string;
  index: number;
}

function ProductCard({
  id,
  name,
  category,
  rating,
  reviews,
  composition,
  speed,
  origin,
  type,
  hardness,
  arc,
  description,
  price,
  originalPrice,
  image,
  index,
}: ProductCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      whileHover={{ y: -8, transition: { duration: 0.3 } }}
      className="elegant-card overflow-hidden group cursor-pointer"
    >
      {/* Product Image */}
      <div className="aspect-[4/3] bg-gradient-to-br from-muted/30 to-muted/50 relative overflow-hidden">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute top-4 right-4 bg-primary text-white px-3 py-1 rounded-full text-sm font-bold">
          {Math.round(((originalPrice - price) / originalPrice) * 100)}% OFF
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="font-display font-bold text-lg text-foreground mb-2">
          {name}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-2 mb-3">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i < Math.floor(rating)
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-muted-foreground">
            {rating} ({reviews} reviews)
          </span>
        </div>

        {/* Specifications */}
        <div className="space-y-2 mb-4">
          {composition && (
            <div className="flex items-start gap-2 text-sm">
              <Package className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
              <span className="text-muted-foreground">{composition}</span>
            </div>
          )}
          {speed && (
            <div className="flex items-start gap-2 text-sm">
              <Zap className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
              <span className="text-muted-foreground">Speed: {speed}</span>
            </div>
          )}
          {origin && (
            <div className="flex items-start gap-2 text-sm">
              <MapPin className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
              <span className="text-muted-foreground">{origin}</span>
            </div>
          )}
          {type && (
            <div className="flex items-start gap-2 text-sm">
              <Package className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
              <span className="text-muted-foreground">{type}</span>
            </div>
          )}
          {hardness && (
            <div className="flex items-start gap-2 text-sm">
              <Zap className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
              <span className="text-muted-foreground">Hardness: {hardness}</span>
            </div>
          )}
          {arc && (
            <div className="flex items-start gap-2 text-sm">
              <TrendingUp className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
              <span className="text-muted-foreground">Arc: {arc}</span>
            </div>
          )}
        </div>

        <p className="text-muted-foreground text-sm leading-relaxed mb-4 line-clamp-2">
          {description}
        </p>

        {/* Pricing */}
        <div className="flex items-center gap-3 mb-4">
          <span className="font-display font-bold text-2xl text-foreground">
            ₹{price.toLocaleString('en-IN')}
          </span>
          <span className="text-muted-foreground line-through text-lg">
            ₹{originalPrice.toLocaleString('en-IN')}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Link
            to={`/equipment/${id}`}
            className="elegant-button-outline flex-1 py-2 px-4 text-sm inline-flex items-center justify-center group/btn"
          >
            <span>View Details</span>
            <ArrowRight className="w-3 h-3 ml-2 group-hover/btn:translate-x-1 transition-transform" />
          </Link>
          <button
            className="elegant-button py-2 px-4 text-sm inline-flex items-center gap-2"
            onClick={() => {
              // Add to cart functionality will be implemented here
              alert(`Added ${name} to cart!`);
            }}
          >
            <ShoppingCart className="w-4 h-4" />
            <span>Add to Cart</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
}

export default Equipment;
