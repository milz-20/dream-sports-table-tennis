import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Star, ShoppingBag, ArrowRight, ShoppingCart, Package, Zap, MapPin, TrendingUp } from 'lucide-react';

// Import blade images
import timoBollImg from '../assets/images/timoBoll.jpg';
import zhangJikeImg from '../assets/images/zhangJike.jpg';
import linYuJuImg from '../assets/images/linYuJuZLC.jpg';
import viscariaImg from '../assets/images/viscaria.jpg';
import innerforceImg from '../assets/images/innerforce.jpg';
import harimotoImg from '../assets/images/harimotoALC.jpg';
import mizutaniImg from '../assets/images/junMizutani.jpg';
import hadrawImg from '../assets/images/hadraw.jpg';
import primoracImg from '../assets/images/primoracCarbon.jpg';
import fanZhendongImg from '../assets/images/fanzhendongALC.jpg';
import maLongImg from '../assets/images/malongCarbon2.jpg';
import garaydiaImg from '../assets/images/garaydia.jpg';
import korbelImg from '../assets/images/korbel.jpg';
import sardiusImg from '../assets/images/sardius.jpg';
import carbonadoImg from '../assets/images/stigaCarbonado,jpg.jpg';
import cybershapeImg from '../assets/images/cybershapeCarbon.jpg';
import offensiveClassicImg from '../assets/images/stigaOffensiveClassic.jpg';
import clipperWoodImg from '../assets/images/clipperwood.jpg';
import clipperCRImg from '../assets/images/clipperCR.jpg';
import maLinExtraImg from '../assets/images/yakasaMaLin.jpg';
import swedenExtraImg from '../assets/images/swedenExtra.jpg';
import ovtcharovImg from '../assets/images/DonicCarboSpeed.jpg';
import waldnerImg from '../assets/images/DonicSensoCarbon.jpg';
import samsonovImg from '../assets/images/samsonovForce.jpg';
import xiomVegaProImg from '../assets/images/xiomVegaPro.jpg';
import kokiNiwaImg from '../assets/images/kokiNiwa.jpg';

// Import rubber images
import tenergy05Img from '../assets/images/rubbers/tnergy05.jpg';
import dignics09cImg from '../assets/images/rubbers/dignicsO9C.jpg';
import dignics05Img from '../assets/images/rubbers/dignicsO5.jpg';
import tenergy64Img from '../assets/images/rubbers/tenergy64.jpg';
import tenergy80Img from '../assets/images/rubbers/tenergy80.jpg';
import rozenaImg from '../assets/images/rubbers/rozena.jpg';
import tenergy19Img from '../assets/images/rubbers/tenergy19.jpg';
import dignics64Img from '../assets/images/rubbers/dignics64.jpg';
import dignics80Img from '../assets/images/rubbers/dignics80.jpg';
import sriverFXImg from '../assets/images/rubbers/sriverFX.jpg';
import bryceSpeedImg from '../assets/images/rubbers/bryceHighSpeed.jpg';
import vegaEuropeImg from '../assets/images/rubbers/Xiom-Vega-Europe-DF-Cover.jpg';
import vegaProRubberImg from '../assets/images/rubbers/vegapro.jpg';
import bluestormZ1Img from '../assets/images/rubbers/RDBZT-donic-bluestorm-z1-t-blue2.jpg';
import evolutionMXPImg from '../assets/images/rubbers/evolutionMXP.jpg';
import markVImg from '../assets/images/rubbers/yakasamark5.jpg';
import rakza7Img from '../assets/images/rubbers/razka7.jpg';
import rasantPowergripImg from '../assets/images/rubbers/rasantPowergrip.jpg';
import v15ExtraImg from '../assets/images/rubbers/victas-v-15.jpg';

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
      <section className="bg-gradient-to-br from-gray-50 via-white to-gray-50 py-10 md:py-16 lg:py-20">
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
            <div className="flex items-center justify-center gap-2 md:gap-4 mt-6 md:mt-8">
              <button
                onClick={() => setActiveCategory('blades')}
                className={`px-4 py-2 md:px-6 md:py-2.5 lg:px-8 lg:py-3 rounded-lg font-semibold text-xs md:text-sm lg:text-base transition-all duration-300 ${
                  activeCategory === 'blades'
                    ? 'bg-primary text-white shadow-lg'
                    : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-primary'
                }`}
              >
                <span className="hidden sm:inline">🏓 Professional Blades</span>
                <span className="sm:hidden">🏓 Blades</span>
              </button>
              <button
                onClick={() => setActiveCategory('rubbers')}
                className={`px-4 py-2 md:px-6 md:py-2.5 lg:px-8 lg:py-3 rounded-lg font-semibold text-xs md:text-sm lg:text-base transition-all duration-300 ${
                  activeCategory === 'rubbers'
                    ? 'bg-primary text-white shadow-lg'
                    : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-primary'
                }`}
              >
                <span className="hidden sm:inline">🎯 Premium Rubbers</span>
                <span className="sm:hidden">🎯 Rubbers</span>
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-8 md:py-12 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <h2 className="font-display font-bold text-3xl text-black mb-4 text-center">
            {activeCategory === 'blades' ? '🏓 Professional Blades' : '🎯 Premium Rubbers'}
          </h2>
          <p className="text-gray-600 text-center mb-8 md:mb-12 max-w-2xl mx-auto text-sm md:text-base">
            {activeCategory === 'blades' 
              ? 'Premium quality blades for every playing style and skill level'
              : 'High-performance rubbers for maximum spin, speed, and control'}
          </p>

          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-6 lg:gap-8">
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
    price: 19999,
    originalPrice: 22999,
    image: timoBollImg,
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
    image: zhangJikeImg,
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
    price: 21999,
    originalPrice: 24999,
    image: linYuJuImg,
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
    price: 17999,
    originalPrice: 20999,
    image: viscariaImg,
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
    price: 16999,
    originalPrice: 19499,
    image: innerforceImg,
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
    price: 19499,
    originalPrice: 22499,
    image: harimotoImg,
  },
  {
    id: 'butterfly-jun-mizutani-zlc',
    name: 'Butterfly Jun Mizutani ZLC',
    category: 'Blade',
    rating: 4.8,
    reviews: 167,
    composition: '5+2 (5 Wood + 2 ZL Carbon)',
    speed: 'OFF+',
    origin: 'Made in Japan',
    description: 'Olympic medalist Jun Mizutani\'s signature blade. ZL Carbon for lightweight explosive power.',
    price: 18499,
    originalPrice: 21499,
    image: mizutaniImg,
  },
  {
    id: 'butterfly-hadraw-shield',
    name: 'Butterfly Hadraw Shield',
    category: 'Blade',
    rating: 4.6,
    reviews: 89,
    composition: '5+2 (5 Wood + 2 Arylate)',
    speed: 'OFF-',
    origin: 'Made in Japan',
    description: 'Defensive blade with excellent control. Perfect for choppers and all-round defensive players.',
    price: 15999,
    originalPrice: 18499,
    image: hadrawImg,
  },
  {
    id: 'butterfly-primorac-carbon',
    name: 'Butterfly Primorac Carbon',
    category: 'Blade',
    rating: 4.7,
    reviews: 143,
    composition: '5+2 (5 Wood + 2 Carbon)',
    speed: 'OFF-',
    origin: 'Made in Japan',
    description: 'Classic defensive blade with carbon layers. Used by Zoran Primorac for decades.',
    price: 14999,
    originalPrice: 17499,
    image: primoracImg,
  },
  {
    id: 'butterfly-fan-zhendong-alc',
    name: 'Butterfly Fan Zhendong ALC',
    category: 'Blade',
    rating: 4.9,
    reviews: 201,
    composition: '5+2 (5 Wood + 2 Arylate-Carbon)',
    speed: 'OFF+',
    origin: 'Made in Japan',
    description: 'World #1 Fan Zhendong\'s blade. Perfect for powerful loops with exceptional control.',
    price: 16299,
    originalPrice: 18999,
    image: fanZhendongImg,
  },
  {
    id: 'butterfly-ma-long-carbon-2',
    name: 'Butterfly Ma Long Carbon 2',
    category: 'Blade',
    rating: 4.9,
    reviews: 278,
    composition: '5+2 (5 Wood + 2 Carbon)',
    speed: 'OFF',
    origin: 'Made in Japan',
    description: 'Updated version of legendary Ma Long\'s blade. Perfect balance for offensive play.',
    price: 21999,
    originalPrice: 24999,
    image: maLongImg,
  },
  {
    id: 'butterfly-garaydia-alc',
    name: 'Butterfly Garaydia ALC',
    category: 'Blade',
    rating: 4.7,
    reviews: 98,
    composition: '5+2 (5 Wood + 2 Arylate-Carbon)',
    speed: 'OFF',
    origin: 'Made in Japan',
    description: 'Thicker blade for powerful offensive play. Excellent for close-to-table aggressive loops.',
    price: 13299,
    originalPrice: 15499,
    image: garaydiaImg,
  },
  {
    id: 'butterfly-petr-korbel',
    name: 'Butterfly Petr Korbel',
    category: 'Blade',
    rating: 4.6,
    reviews: 123,
    composition: '7 Wood',
    speed: 'OFF-',
    origin: 'Made in Japan',
    description: 'Upgraded Korbel with 7-ply construction. More speed while maintaining excellent control.',
    price: 8499,
    originalPrice: 9999,
    image: korbelImg,
  },
  {
    id: 'butterfly-sardius',
    name: 'Butterfly Sardius',
    category: 'Blade',
    rating: 4.7,
    reviews: 91,
    composition: '7 Wood',
    speed: 'OFF-',
    origin: 'Made in Japan',
    description: '7-ply blade with excellent touch. Great for spin-oriented offensive play.',
    price: 9299,
    originalPrice: 10999,
    image: sardiusImg,
  },
  {
    id: 'stiga-carbonado-290',
    name: 'Stiga Carbonado 290',
    category: 'Blade',
    rating: 4.8,
    reviews: 167,
    composition: '5+2 (5 Wood + 2 Carbon)',
    speed: 'OFF++',
    origin: 'Made in Sweden',
    description: 'Premium carbon blade from Stiga. Exceptional speed and power for aggressive players.',
    price: 12999,
    originalPrice: 14999,
    image: carbonadoImg,
  },
  {
    id: 'stiga-cybershape-carbon',
    name: 'Stiga Cybershape Carbon',
    category: 'Blade',
    rating: 4.7,
    reviews: 134,
    composition: '5+2 (5 Wood + 2 Carbon)',
    speed: 'OFF+',
    origin: 'Made in Sweden',
    description: 'Innovative teardrop shape for larger sweet spot. Carbon power with enhanced control.',
    price: 11799,
    originalPrice: 13499,
    image: cybershapeImg,
  },
  {
    id: 'stiga-offensive-classic',
    name: 'Stiga Offensive Classic',
    category: 'Blade',
    rating: 4.6,
    reviews: 198,
    composition: '5 Wood',
    speed: 'OFF-',
    origin: 'Made in Sweden',
    description: 'Legendary Stiga blade. Used by champions for decades. Perfect offensive control.',
    price: 7999,
    originalPrice: 9499,
    image: offensiveClassicImg,
  },
  {
    id: 'stiga-clipper-wood',
    name: 'Stiga Clipper Wood',
    category: 'Blade',
    rating: 4.8,
    reviews: 245,
    composition: '7 Wood',
    speed: 'OFF',
    origin: 'Made in Sweden',
    description: 'Most famous 7-ply blade ever. Legendary control and feel for all-round play.',
    price: 9999,
    originalPrice: 11499,
    image: clipperWoodImg,
  },
  {
    id: 'stiga-clipper-cr',
    name: 'Stiga Clipper CR',
    category: 'Blade',
    rating: 4.8,
    reviews: 178,
    composition: '7+2 (7 Wood + 2 Carbon)',
    speed: 'OFF+',
    origin: 'Made in Sweden',
    description: 'Carbon version of legendary Clipper. More speed while keeping the famous feel.',
    price: 11499,
    originalPrice: 13299,
    image: clipperCRImg,
  },
  {
    id: 'yasaka-ma-lin-extra-offensive',
    name: 'Yasaka Ma Lin Extra Offensive',
    category: 'Blade',
    rating: 4.7,
    reviews: 143,
    composition: '5+2 (5 Wood + 2 Carbon)',
    speed: 'OFF+',
    origin: 'Made in Sweden',
    description: 'Ma Lin\'s legendary blade from Yasaka. Perfect for powerful penhold attacks.',
    price: 9299,
    originalPrice: 10999,
    image: maLinExtraImg,
  },
  {
    id: 'yasaka-sweden-extra',
    name: 'Yasaka Sweden Extra',
    category: 'Blade',
    rating: 4.6,
    reviews: 112,
    composition: '5 Wood',
    speed: 'ALL+',
    origin: 'Made in Sweden',
    description: 'Classic all-wood blade from Yasaka. Excellent for developing proper technique.',
    price: 6999,
    originalPrice: 8499,
    image: swedenExtraImg,
  },
  {
    id: 'donic-ovtcharov-carbospeed',
    name: 'Donic Ovtcharov Carbospeed',
    category: 'Blade',
    rating: 4.8,
    reviews: 156,
    composition: '5+2 (5 Wood + 2 Carbon)',
    speed: 'OFF+',
    origin: 'Made in Germany',
    description: 'Dimitrij Ovtcharov\'s blade. Incredible speed with AVS technology for reduced vibration.',
    price: 11999,
    originalPrice: 13999,
    image: ovtcharovImg,
  },
  {
    id: 'donic-waldner-senso-carbon',
    name: 'Donic Waldner Senso Carbon',
    category: 'Blade',
    rating: 4.7,
    reviews: 134,
    composition: '5+2 (5 Wood + 2 Carbon)',
    speed: 'OFF',
    origin: 'Made in Germany',
    description: 'Jan-Ove Waldner\'s signature blade with Senso technology for enhanced feel.',
    price: 10499,
    originalPrice: 12299,
    image: waldnerImg,
  },
  {
    id: 'tibhar-samsonov-force-pro',
    name: 'Tibhar Samsonov Force Pro',
    category: 'Blade',
    rating: 4.7,
    reviews: 98,
    composition: '5+2 (5 Wood + 2 Carbon)',
    speed: 'OFF+',
    origin: 'Made in Germany',
    description: 'Vladimir Samsonov\'s professional blade. Carbon power with outstanding control.',
    price: 10799,
    originalPrice: 12499,
    image: samsonovImg,
  },
  {
    id: 'xiom-vega-pro-blade',
    name: 'Xiom Vega Pro',
    category: 'Blade',
    rating: 4.6,
    reviews: 87,
    composition: '5+2 (5 Wood + 2 Carbon)',
    speed: 'OFF',
    origin: 'Made in Korea',
    description: 'Professional carbon blade from Xiom. Perfect balance of speed, spin and control.',
    price: 9499,
    originalPrice: 10999,
    image: xiomVegaProImg,
  },
  {
    id: 'victas-koki-niwa-wood',
    name: 'Victas Koki Niwa Wood',
    category: 'Blade',
    rating: 4.7,
    reviews: 123,
    composition: '5 Wood',
    speed: 'OFF-',
    origin: 'Made in Japan',
    description: 'Koki Niwa\'s all-wood blade. Exceptional feel and control for precise offensive play.',
    price: 9999,
    originalPrice: 11499,
    image: kokiNiwaImg,
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
    image: tenergy05Img,
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
    image: dignics09cImg,
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
    image: dignics05Img,
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
    image: tenergy64Img,
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
    image: tenergy80Img,
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
    image: rozenaImg,
  },
  {
    id: 'butterfly-tenergy-19',
    name: 'Butterfly Tenergy 19',
    category: 'Rubber',
    rating: 4.7,
    reviews: 145,
    type: 'Inverted (Tensioned)',
    hardness: '36° (Medium-Soft)',
    arc: 'High Arc',
    description: 'Latest addition to Tenergy series. Enhanced spin with softer feel for better control.',
    price: 4899,
    originalPrice: 5699,
    image: tenergy19Img,
  },
  {
    id: 'butterfly-dignics-80',
    name: 'Butterfly Dignics 80',
    category: 'Rubber',
    rating: 4.8,
    reviews: 167,
    type: 'Inverted (Tensioned)',
    hardness: '40° (Medium)',
    arc: 'Low-Medium Arc',
    description: 'Fast linear trajectory with Dignics quality. Perfect for aggressive flat hitting style.',
    price: 6549,
    originalPrice: 7499,
    image: dignics80Img,
  },
  {
    id: 'butterfly-dignics-64',
    name: 'Butterfly Dignics 64',
    category: 'Rubber',
    rating: 4.7,
    reviews: 134,
    type: 'Inverted (Tensioned)',
    hardness: '40° (Medium)',
    arc: 'Medium Arc',
    description: 'All-round Dignics rubber. Balanced performance for versatile playing styles.',
    price: 6299,
    originalPrice: 7299,
    image: dignics64Img,
  },
  {
    id: 'butterfly-sriver-fx',
    name: 'Butterfly Sriver FX',
    category: 'Rubber',
    rating: 4.4,
    reviews: 289,
    type: 'Inverted',
    hardness: '35° (Soft)',
    arc: 'High Arc',
    description: 'Classic soft rubber for beginners. Excellent control and forgiving for learning proper technique.',
    price: 2799,
    originalPrice: 3299,
    image: sriverFXImg,
  },
  {
    id: 'butterfly-bryce-speed',
    name: 'Butterfly Bryce Speed',
    category: 'Rubber',
    rating: 4.6,
    reviews: 178,
    type: 'Inverted (Tensioned)',
    hardness: '40° (Medium)',
    arc: 'Medium Arc',
    description: 'High-speed rubber with German technology. Excellent for powerful offensive play.',
    price: 3999,
    originalPrice: 4699,
    image: bryceSpeedImg,
  },
  {
    id: 'xiom-vega-euro-df',
    name: 'Xiom Vega Europe DF',
    category: 'Rubber',
    rating: 4.7,
    reviews: 201,
    type: 'Inverted (Tensioned)',
    hardness: '47.5° (Medium-Hard)',
    arc: 'Medium Arc',
    description: 'European style dynamic friction rubber. Excellent for topspin and counter play.',
    price: 3799,
    originalPrice: 4499,
    image: vegaEuropeImg,
  },
  {
    id: 'xiom-vega-pro-rubber',
    name: 'Xiom Vega Pro',
    category: 'Rubber',
    rating: 4.6,
    reviews: 189,
    type: 'Inverted (Tensioned)',
    hardness: '47.5° (Medium-Hard)',
    arc: 'Medium-High Arc',
    description: 'Professional level Vega rubber. Perfect balance of spin, speed and control.',
    price: 3599,
    originalPrice: 4299,
    image: vegaProRubberImg,
  },
  {
    id: 'donic-bluestorm-z1',
    name: 'Donic Bluestorm Z1',
    category: 'Rubber',
    rating: 4.7,
    reviews: 167,
    type: 'Inverted (Tensioned)',
    hardness: '47.5° (Medium-Hard)',
    arc: 'High Arc',
    description: 'Tournament level tensor rubber. Exceptional spin and speed for aggressive players.',
    price: 4299,
    originalPrice: 4999,
    image: bluestormZ1Img,
  },
  {
    id: 'tibhar-evolution-mx-p',
    name: 'Tibhar Evolution MX-P',
    category: 'Rubber',
    rating: 4.7,
    reviews: 198,
    type: 'Inverted (Tensioned)',
    hardness: '47.5° (Medium-Hard)',
    arc: 'High Arc',
    description: 'Power version of Evolution series. Maximum speed with excellent spin capability.',
    price: 3899,
    originalPrice: 4599,
    image: evolutionMXPImg,
  },
  {
    id: 'yasaka-mark-v',
    name: 'Yasaka Mark V',
    category: 'Rubber',
    rating: 4.4,
    reviews: 312,
    type: 'Inverted',
    hardness: '40° (Medium)',
    arc: 'High Arc',
    description: 'Legendary classic rubber. Perfect for learning fundamentals with excellent control.',
    price: 2299,
    originalPrice: 2799,
    image: markVImg,
  },
  {
    id: 'yasaka-rakza-7',
    name: 'Yasaka Rakza 7',
    category: 'Rubber',
    rating: 4.6,
    reviews: 234,
    type: 'Inverted (Tensioned)',
    hardness: '45° (Medium)',
    arc: 'Medium-High Arc',
    description: 'Popular tensor rubber. Great balance of speed, spin and control at affordable price.',
    price: 3199,
    originalPrice: 3799,
    image: rakza7Img,
  },
  {
    id: 'andro-rasant-powergrip',
    name: 'Andro Rasant Powergrip',
    category: 'Rubber',
    rating: 4.6,
    reviews: 156,
    type: 'Inverted (Tensioned)',
    hardness: '47.5° (Medium-Hard)',
    arc: 'High Arc',
    description: 'Grippy tensor rubber for maximum spin. Excellent for aggressive looping play.',
    price: 3499,
    originalPrice: 4199,
    image: rasantPowergripImg,
  },
  {
    id: 'victas-v15-extra',
    name: 'Victas V15 Extra',
    category: 'Rubber',
    rating: 4.7,
    reviews: 178,
    type: 'Inverted (Tensioned)',
    hardness: '47.5° (Medium-Hard)',
    arc: 'High Arc',
    description: 'High-end Japanese tensor rubber. Exceptional spin and speed for professional play.',
    price: 4399,
    originalPrice: 5199,
    image: v15ExtraImg,
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
      transition={{ delay: index * 0.05, duration: 0.5 }}
      whileHover={{ y: -8, transition: { duration: 0.3 } }}
      className="elegant-card overflow-hidden group cursor-pointer"
    >
      {/* Product Image */}
      <div className="aspect-square md:aspect-[4/3] bg-gradient-to-br from-muted/30 to-muted/50 relative overflow-hidden">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute top-1 right-1 md:top-2 md:right-2 lg:top-4 lg:right-4 bg-primary text-white px-1.5 py-0.5 md:px-2 md:py-1 lg:px-3 lg:py-1 rounded-full text-[10px] md:text-xs lg:text-sm font-bold">
          {Math.round(((originalPrice - price) / originalPrice) * 100)}% OFF
        </div>
      </div>

      {/* Content */}
      <div className="p-2 sm:p-3 md:p-4 lg:p-6">
        <h3 className="font-display font-bold text-xs sm:text-sm md:text-base lg:text-lg text-foreground mb-1 md:mb-2 line-clamp-2">
          {name}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-1 md:gap-2 mb-2 md:mb-3">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-2.5 h-2.5 md:w-3 md:h-3 lg:w-4 lg:h-4 ${
                  i < Math.floor(rating)
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          <span className="text-[10px] md:text-xs lg:text-sm text-muted-foreground">
            {rating}
          </span>
        </div>

        {/* Specifications - Hidden on mobile, shown on md+ */}
        <div className="hidden md:block space-y-2 mb-4">
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

        {/* Mobile: Show compact specs */}
        <div className="md:hidden mb-2 text-[10px] text-muted-foreground">
          {speed && <span className="block">{speed}</span>}
          {type && <span className="block">{type}</span>}
        </div>

        <p className="hidden md:block text-muted-foreground text-sm leading-relaxed mb-4 line-clamp-2">
          {description}
        </p>

        {/* Pricing */}
        <div className="flex flex-col md:flex-row md:items-center gap-0.5 md:gap-3 mb-2 md:mb-4">
          <span className="font-display font-bold text-sm sm:text-base md:text-lg lg:text-2xl text-foreground">
            ₹{price.toLocaleString('en-IN')}
          </span>
          <span className="text-muted-foreground line-through text-xs md:text-sm lg:text-lg">
            ₹{originalPrice.toLocaleString('en-IN')}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col md:flex-row gap-1.5 md:gap-2">
          <Link
            to={`/equipment/${id}`}
            className="elegant-button-outline flex-1 py-1.5 md:py-2 px-2 md:px-4 text-[10px] sm:text-xs md:text-sm inline-flex items-center justify-center group/btn"
          >
            <span className="hidden sm:inline">View Details</span>
            <span className="sm:hidden">View</span>
            <ArrowRight className="w-2.5 h-2.5 md:w-3 md:h-3 ml-1 md:ml-2 group-hover/btn:translate-x-1 transition-transform" />
          </Link>
          <button
            className="elegant-button py-1.5 md:py-2 px-2 md:px-4 text-[10px] sm:text-xs md:text-sm inline-flex items-center justify-center gap-1 md:gap-2 flex-1 md:flex-initial"
            onClick={() => {
              // Add to cart functionality will be implemented here
              alert(`Added ${name} to cart!`);
            }}
          >
            <ShoppingCart className="w-3 h-3 md:w-4 md:h-4" />
            <span className="hidden sm:inline">Add to Cart</span>
            <span className="sm:hidden">Add</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
}

export default Equipment;
