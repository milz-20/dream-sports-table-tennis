import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Star, Package, Zap, MapPin, TrendingUp, ShoppingCart, MessageCircle, Shield, Truck } from 'lucide-react';

interface ProductSpec {
  name: string;
  category: string;
  rating: number;
  reviews: number;
  composition?: string;
  speed?: string;
  control?: string;
  spin?: string;
  origin?: string;
  type?: string;
  hardness?: string;
  arc?: string;
  level?: string;
  playingStyle?: string;
  weight?: string;
  thickness?: string;
  description: string;
  fullDescription?: string;
  price: number;
  originalPrice: number;
  image: string;
  features?: string[];
}

const allProducts: { [key: string]: ProductSpec } = {
  // Blades
  'butterfly-timo-boll-alc': {
    name: 'Butterfly Timo Boll ALC',
    category: 'Blade',
    rating: 4.9,
    reviews: 187,
    composition: '5+2 (5 Wood + 2 Arylate-Carbon)',
    speed: 'OFF+ (Mid-Fast)',
    control: '9/10',
    spin: '9/10',
    origin: 'Made in Japan',
    level: 'Advanced / Professional',
    playingStyle: 'Offensive All-Round',
    weight: '86g',
    thickness: '5.7mm',
    description: 'Legendary blade used by Timo Boll. Perfect balance of speed and control with Arylate Carbon layers.',
    fullDescription: 'The Butterfly Timo Boll ALC is one of the most popular professional blades in the world. Designed in collaboration with German legend Timo Boll, this blade features 5 plies of wood combined with 2 layers of Arylate Carbon fiber. The Arylate Carbon layers provide explosive power while maintaining the soft feel and excellent control that Timo Boll is known for. This blade is perfect for offensive players who want to dominate with powerful loops while maintaining precision and consistency.',
    price: 14299,
    originalPrice: 16999,
    image: 'https://worldoftabletennis.com/cdn/shop/files/TimoBollALC_1.jpg?v=1706350573&width=800',
    features: [
      'Arylate Carbon fiber for explosive power',
      'Soft feel with excellent control',
      'Perfect for offensive topspin play',
      'Used by Timo Boll',
      'Made in Japan with premium craftsmanship',
      'Ideal for tournament play'
    ]
  },
  'butterfly-zhang-jike-alc': {
    name: 'Butterfly Zhang Jike ALC',
    category: 'Blade',
    rating: 4.8,
    reviews: 156,
    composition: '5+2 (5 Wood + 2 Arylate-Carbon)',
    speed: 'OFF (Fast)',
    control: '8.5/10',
    spin: '9.5/10',
    origin: 'Made in Japan',
    level: 'Advanced / Professional',
    playingStyle: 'Offensive',
    weight: '88g',
    thickness: '5.9mm',
    description: 'Signature blade of Olympic Champion Zhang Jike. Excellent for aggressive play with superior control.',
    fullDescription: 'The Butterfly Zhang Jike ALC is the signature blade of Olympic and World Champion Zhang Jike. This blade features a slightly harder construction compared to the Timo Boll ALC, making it faster and more suited for aggressive attacking play. The Arylate Carbon layers provide explosive power for powerful loops and smashes, while still maintaining enough control for precision placement. Perfect for players who want to dominate with aggressive topspin attacks.',
    price: 13849,
    originalPrice: 15999,
    image: 'https://worldoftabletennis.com/cdn/shop/files/ZhangJikeALC1.jpg?v=1706361517&width=800',
    features: [
      'Faster than Timo Boll ALC',
      'Explosive power for aggressive attacks',
      'Excellent spin generation',
      'Used by Zhang Jike',
      'Premium Japanese craftsmanship',
      'Great for tournament play'
    ]
  },
  'butterfly-lin-yun-ju-super-zlc': {
    name: 'Butterfly Lin Yun-Ju Super ZLC',
    category: 'Blade',
    rating: 4.9,
    reviews: 98,
    composition: '5+2 (5 Wood + 2 Super ZL Carbon)',
    speed: 'OFF++ (Very Fast)',
    control: '7.5/10',
    spin: '9/10',
    origin: 'Made in Japan',
    level: 'Professional',
    playingStyle: 'Ultra Offensive',
    weight: '85g',
    thickness: '5.9mm',
    description: 'Ultra-fast Super ZLC blade for explosive power. Ideal for advanced players seeking maximum speed.',
    fullDescription: 'The Butterfly Lin Yun-Ju Super ZLC is one of the fastest blades available. Featuring Super ZL Carbon fiber, this blade provides incredible speed and power for players who want to overwhelm opponents with fast attacks. Despite its extreme speed, the blade maintains good control thanks to the quality construction. Used by rising star Lin Yun-Ju, this blade is perfect for players with excellent technique who want to play at the highest speeds.',
    price: 26499,
    originalPrice: 29999,
    image: 'https://worldoftabletennis.com/cdn/shop/files/lin1.jpg?v=1740485439&width=800',
    features: [
      'Super ZL Carbon for extreme speed',
      'Wide sweet spot for stability',
      'Inspires chiquita backhands',
      'Used by Lin Yun-Ju',
      'Premium Japanese construction',
      'For players with advanced technique'
    ]
  },
  'butterfly-viscaria': {
    name: 'Butterfly Viscaria',
    category: 'Blade',
    rating: 4.9,
    reviews: 234,
    composition: '5+2 (5 Wood + 2 Arylate-Carbon)',
    speed: 'OFF (Fast)',
    control: '9/10',
    spin: '9/10',
    origin: 'Made in Japan',
    level: 'Intermediate to Professional',
    playingStyle: 'Offensive All-Round',
    weight: '87g',
    thickness: '5.8mm',
    description: 'Most popular professional blade. Used by Jan-Ove Waldner. Perfect for all-round offensive play.',
    fullDescription: 'The Butterfly Viscaria is arguably the most popular professional blade ever made. Used by the legendary Jan-Ove Waldner, this blade has set the standard for offensive all-round play for decades. The Arylate Carbon layers provide excellent speed and power, while the construction maintains superb control and feel. This blade is versatile enough for players who want to loop, block, and counterhit with equal effectiveness.',
    price: 15299,
    originalPrice: 17499,
    image: 'https://worldoftabletennis.com/cdn/shop/files/vc.jpg?v=1711086820&width=800',
    features: [
      'Most popular pro blade worldwide',
      'Perfect balance of speed and control',
      'Versatile for all offensive techniques',
      'Used by Jan-Ove Waldner',
      'Legendary Japanese quality',
      'Suitable for various playing styles'
    ]
  },
  'butterfly-innerforce-layer-alc': {
    name: 'Butterfly Innerforce Layer ALC',
    category: 'Blade',
    rating: 4.7,
    reviews: 145,
    composition: '5+2 (5 Wood + 2 Arylate-Carbon)',
    speed: 'OFF- (Medium-Fast)',
    control: '9.5/10',
    spin: '8.5/10',
    origin: 'Made in Japan',
    level: 'Intermediate to Advanced',
    playingStyle: 'Controlled Offensive',
    weight: '84g',
    thickness: '5.6mm',
    description: 'Inner fiber construction for excellent feel. Great for controlled offensive play and precision.',
    fullDescription: 'The Butterfly Innerforce Layer ALC features an inner carbon construction, where the Arylate Carbon layers are positioned closer to the core. This design provides excellent feeling and touch, making it easier to control the ball while still maintaining good speed. Perfect for players who prioritize control and precision over raw speed, or for players transitioning from all-wood blades to carbon blades.',
    price: 12549,
    originalPrice: 14499,
    image: 'https://worldoftabletennis.com/cdn/shop/files/inner1.webp?v=1735216037&width=800',
    features: [
      'Inner carbon for better feel',
      'Excellent control and touch',
      'Good speed with more control',
      'Great for technical players',
      'Premium Japanese quality',
      'Ideal for transitioning players'
    ]
  },
  'butterfly-harimoto-tomokazu-innerforce-alc': {
    name: 'Butterfly Harimoto Tomokazu Innerforce ALC',
    category: 'Blade',
    rating: 4.8,
    reviews: 112,
    composition: '5+2 (5 Wood + 2 Arylate-Carbon)',
    speed: 'OFF+ (Very Fast)',
    control: '8/10',
    spin: '9.5/10',
    origin: 'Made in Japan',
    level: 'Advanced / Professional',
    playingStyle: 'Aggressive Offensive',
    weight: '89g',
    thickness: '6.0mm',
    description: 'Signature blade of young prodigy Harimoto. Exceptional balance of speed, spin, and control.',
    fullDescription: 'The Butterfly Harimoto Tomokazu Innerforce ALC is the signature blade of Japanese sensation Tomokazu Harimoto. Despite featuring inner carbon construction, this blade is faster and more powerful than most outer carbon blades. The unique construction provides incredible spin generation and speed while maintaining the excellent feel of inner carbon. Perfect for aggressive players who want to generate heavy topspin with maximum speed.',
    price: 15849,
    originalPrice: 17999,
    image: 'https://worldoftabletennis.com/cdn/shop/files/IMG-8909.jpg?v=1692577357&width=800',
    features: [
      'Fast inner carbon construction',
      'Incredible spin generation',
      'Aggressive attacking blade',
      'Used by Harimoto Tomokazu',
      'Japanese premium quality',
      'For advanced aggressive players'
    ]
  },

  // Rubbers
  'butterfly-tenergy-05': {
    name: 'Butterfly Tenergy 05',
    category: 'Rubber',
    rating: 4.8,
    reviews: 312,
    type: 'Inverted (Tensioned)',
    hardness: '36° (Medium-Soft)',
    arc: 'High Arc',
    speed: '8.5/10',
    control: '8/10',
    spin: '10/10',
    level: 'Intermediate to Professional',
    playingStyle: 'Offensive Topspin',
    description: 'The most popular rubber worldwide. Spring Sponge X technology for maximum spin and speed.',
    fullDescription: 'Butterfly Tenergy 05 is the most popular and versatile offensive rubber in the world. Featuring Spring Sponge X technology and High Tension topsheet, this rubber provides incredible spin generation and catapult effect. The 36-degree hardness makes it accessible to a wide range of players while still providing professional-level performance. Perfect for players who want to dominate with heavy topspin loops from all distances.',
    price: 4599,
    originalPrice: 5499,
    image: 'https://worldoftabletennis.com/cdn/shop/products/rubber_tenergy_05_cover_1_1.jpg?v=1706344500&width=800',
    features: [
      'Spring Sponge X technology',
      'Maximum spin generation',
      'High arc trajectory',
      'Versatile for all distances',
      'Most popular rubber worldwide',
      'Great for looping and blocking'
    ]
  },
  'butterfly-dignics-09c': {
    name: 'Butterfly Dignics 09C',
    category: 'Rubber',
    rating: 4.9,
    reviews: 187,
    type: 'Inverted (Tensioned)',
    hardness: '40° (Medium)',
    arc: 'Medium-High Arc',
    speed: '9/10',
    control: '9/10',
    spin: '9.5/10',
    level: 'Advanced / Professional',
    playingStyle: 'Control + Speed',
    description: 'Latest flagship rubber. Combines speed and control with new High Tension technology.',
    fullDescription: 'Butterfly Dignics 09C is the latest evolution in Butterfly\'s flagship rubber series. Featuring upgraded High Tension technology and a 40-degree hardness, this rubber provides incredible grip and control while maintaining high speed. The medium-high arc makes it easier to control powerful shots, making it perfect for players who want to combine speed with precision. Used by many top professionals worldwide.',
    price: 6549,
    originalPrice: 7499,
    image: 'https://worldoftabletennis.com/cdn/shop/products/butterfly-dignics-09c.jpg?v=1704533936&width=800',
    features: [
      'Latest High Tension technology',
      'Incredible grip and control',
      'Fast with controlled arc',
      'Used by top professionals',
      'Premium Japanese quality',
      'Great for modern attacking play'
    ]
  },
  'butterfly-dignics-05': {
    name: 'Butterfly Dignics 05',
    category: 'Rubber',
    rating: 4.8,
    reviews: 234,
    type: 'Inverted (Tensioned)',
    hardness: '36° (Medium-Soft)',
    arc: 'High Arc',
    speed: '9/10',
    control: '8.5/10',
    spin: '10/10',
    level: 'Intermediate to Professional',
    playingStyle: 'Power Topspin',
    description: 'Evolution of Tenergy 05. Enhanced spin capability with improved durability and consistency.',
    fullDescription: 'Butterfly Dignics 05 is the evolution of the legendary Tenergy 05. With upgraded sponge and topsheet technology, this rubber provides even better spin generation and more consistent performance. The high arc trajectory makes it easier to loop from any distance, while the improved durability means the rubber maintains its performance characteristics longer. Perfect for power loopers who want maximum spin.',
    price: 6299,
    originalPrice: 7299,
    image: 'https://worldoftabletennis.com/cdn/shop/products/butterfly-dignics-05.jpg?v=1704533956&width=800',
    features: [
      'Evolution of Tenergy 05',
      'Enhanced spin generation',
      'Improved durability',
      'High arc for safety',
      'Consistent performance',
      'For power topspin players'
    ]
  },
  'butterfly-tenergy-64': {
    name: 'Butterfly Tenergy 64',
    category: 'Rubber',
    rating: 4.7,
    reviews: 267,
    type: 'Inverted (Tensioned)',
    hardness: '36° (Medium-Soft)',
    arc: 'Medium Arc',
    speed: '9/10',
    control: '9/10',
    spin: '8.5/10',
    level: 'Intermediate to Professional',
    playingStyle: 'All-Round Offensive',
    description: 'Perfect for all-round players. Balanced speed and spin with excellent control and consistency.',
    fullDescription: 'Butterfly Tenergy 64 is the most balanced rubber in the Tenergy series. With a medium arc trajectory and excellent control, this rubber is perfect for players who want to play close to the table with fast attacks and counterloops. The 36-degree hardness provides good speed while maintaining excellent feeling. Great for players who value consistency and versatility over raw power.',
    price: 4599,
    originalPrice: 5499,
    image: 'https://worldoftabletennis.com/cdn/shop/products/rubber_tenergy_64_cover_1.webp?v=1704535746&width=800',
    features: [
      'Most balanced Tenergy',
      'Medium arc for control',
      'Great for close-to-table play',
      'Excellent consistency',
      'Versatile for many styles',
      'Good speed and control'
    ]
  },
  'butterfly-tenergy-80': {
    name: 'Butterfly Tenergy 80',
    category: 'Rubber',
    rating: 4.6,
    reviews: 198,
    type: 'Inverted (Tensioned)',
    hardness: '36° (Medium-Soft)',
    arc: 'Low-Medium Arc',
    speed: '9.5/10',
    control: '8/10',
    spin: '8/10',
    level: 'Advanced',
    playingStyle: 'Speed Attack',
    description: 'Fast and direct trajectory. Ideal for players who prefer speed over high arc shots.',
    fullDescription: 'Butterfly Tenergy 80 is the fastest rubber in the Tenergy series. With a low-medium arc trajectory, this rubber provides direct and fast attacks that keep opponents under pressure. The flat trajectory makes it harder for opponents to return, but requires good technique to use effectively. Perfect for players who want to play fast and direct attacking table tennis.',
    price: 4599,
    originalPrice: 5499,
    image: 'https://worldoftabletennis.com/cdn/shop/products/rubber_tenergy_80_cover_1_1.jpg?v=1704535791&width=800',
    features: [
      'Fastest Tenergy rubber',
      'Low arc for direct attacks',
      'Maximum speed',
      'Great for counterlooping',
      'Keeps opponents under pressure',
      'For advanced technique'
    ]
  },
  'butterfly-rozena': {
    name: 'Butterfly Rozena',
    category: 'Rubber',
    rating: 4.5,
    reviews: 156,
    type: 'Inverted (Tensioned)',
    hardness: '35° (Soft)',
    arc: 'High Arc',
    speed: '7.5/10',
    control: '9/10',
    spin: '8.5/10',
    level: 'Beginner to Intermediate',
    playingStyle: 'All-Round',
    description: 'Entry-level tensioned rubber. Great spin and control for developing players at an affordable price.',
    fullDescription: 'Butterfly Rozena is an entry-level tensioned rubber that provides excellent value for money. With a soft 35-degree sponge, this rubber is easy to control while still providing good spin and speed. The high arc trajectory makes it forgiving for players learning proper topspin technique. Perfect for beginners and intermediate players who want to experience tensioned rubber technology without the premium price.',
    price: 3399,
    originalPrice: 3999,
    image: 'https://worldoftabletennis.com/cdn/shop/products/rubber_rozena_cover_1.webp?v=1704535600&width=800',
    features: [
      'Affordable tensioned rubber',
      'Easy to control',
      'Good spin for learning',
      'High arc for safety',
      'Great value for money',
      'Perfect for developing players'
    ]
  }
};

const ProductDetail: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const product = productId ? allProducts[productId] : null;

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
          <Link to="/equipment" className="elegant-button inline-flex items-center">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Equipment
          </Link>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-background"
    >
      {/* Back Button */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 pt-8">
        <button
          onClick={() => navigate('/equipment')}
          className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Equipment
        </button>
      </div>

      {/* Product Detail */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Product Image */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="elegant-card overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-auto object-cover"
                />
                <div className="absolute top-4 right-4 bg-primary text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                  {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                </div>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-4 mt-6">
                <div className="text-center p-4 bg-muted/30 rounded-lg">
                  <Shield className="w-8 h-8 mx-auto mb-2 text-primary" />
                  <p className="text-xs font-semibold">100% Authentic</p>
                </div>
                <div className="text-center p-4 bg-muted/30 rounded-lg">
                  <Truck className="w-8 h-8 mx-auto mb-2 text-primary" />
                  <p className="text-xs font-semibold">Fast Delivery</p>
                </div>
                <div className="text-center p-4 bg-muted/30 rounded-lg">
                  <Package className="w-8 h-8 mx-auto mb-2 text-primary" />
                  <p className="text-xs font-semibold">Secure Packaging</p>
                </div>
              </div>
            </motion.div>

            {/* Product Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="mb-4">
                <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-sm font-semibold rounded-full mb-4">
                  {product.category}
                </span>
                <h1 className="font-display font-bold text-4xl text-foreground mb-4">
                  {product.name}
                </h1>

                {/* Rating */}
                <div className="flex items-center gap-2 mb-6">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${
                          i < Math.floor(product.rating)
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-lg font-semibold">
                    {product.rating}
                  </span>
                  <span className="text-muted-foreground">
                    ({product.reviews} reviews)
                  </span>
                </div>

                {/* Price */}
                <div className="flex items-center gap-4 mb-8">
                  <span className="font-display font-bold text-4xl text-foreground">
                    ₹{product.price.toLocaleString('en-IN')}
                  </span>
                  <span className="text-muted-foreground line-through text-2xl">
                    ₹{product.originalPrice.toLocaleString('en-IN')}
                  </span>
                </div>

                {/* Description */}
                <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                  {product.fullDescription || product.description}
                </p>

                {/* Specifications */}
                <div className="bg-muted/30 rounded-xl p-6 mb-8">
                  <h3 className="font-display font-bold text-xl mb-4">Specifications</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {product.composition && (
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Composition</p>
                        <p className="font-semibold flex items-center gap-2">
                          <Package className="w-4 h-4 text-primary" />
                          {product.composition}
                        </p>
                      </div>
                    )}
                    {product.speed && (
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Speed</p>
                        <p className="font-semibold flex items-center gap-2">
                          <Zap className="w-4 h-4 text-primary" />
                          {product.speed}
                        </p>
                      </div>
                    )}
                    {product.control && (
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Control</p>
                        <p className="font-semibold">{product.control}</p>
                      </div>
                    )}
                    {product.spin && (
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Spin</p>
                        <p className="font-semibold">{product.spin}</p>
                      </div>
                    )}
                    {product.origin && (
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Origin</p>
                        <p className="font-semibold flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-primary" />
                          {product.origin}
                        </p>
                      </div>
                    )}
                    {product.level && (
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Level</p>
                        <p className="font-semibold">{product.level}</p>
                      </div>
                    )}
                    {product.playingStyle && (
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Playing Style</p>
                        <p className="font-semibold">{product.playingStyle}</p>
                      </div>
                    )}
                    {product.type && (
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Type</p>
                        <p className="font-semibold">{product.type}</p>
                      </div>
                    )}
                    {product.hardness && (
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Hardness</p>
                        <p className="font-semibold">{product.hardness}</p>
                      </div>
                    )}
                    {product.arc && (
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Arc</p>
                        <p className="font-semibold flex items-center gap-2">
                          <TrendingUp className="w-4 h-4 text-primary" />
                          {product.arc}
                        </p>
                      </div>
                    )}
                    {product.weight && (
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Weight</p>
                        <p className="font-semibold">{product.weight}</p>
                      </div>
                    )}
                    {product.thickness && (
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Thickness</p>
                        <p className="font-semibold">{product.thickness}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Features */}
                {product.features && (
                  <div className="mb-8">
                    <h3 className="font-display font-bold text-xl mb-4">Key Features</h3>
                    <ul className="space-y-2">
                      {product.features.map((feature, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-primary mt-1">✓</span>
                          <span className="text-muted-foreground">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-4">
                  <button
                    className="elegant-button flex-1 py-4 text-lg inline-flex items-center justify-center gap-2"
                    onClick={() => {
                      alert(`Added ${product.name} to cart!`);
                    }}
                  >
                    <ShoppingCart className="w-5 h-5" />
                    <span>Add to Cart</span>
                  </button>
                  <a
                    href={`https://wa.me/919823192792?text=${encodeURIComponent(
                      `Hi, I'm interested in ${product.name} (₹${product.price.toLocaleString('en-IN')})`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="elegant-button-outline py-4 px-6 text-lg inline-flex items-center gap-2"
                  >
                    <MessageCircle className="w-5 h-5" />
                    <span>WhatsApp</span>
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </motion.div>
  );
};

export default ProductDetail;
