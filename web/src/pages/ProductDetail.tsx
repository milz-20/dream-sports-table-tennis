import React, { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Star, Package, Zap, MapPin, TrendingUp, ShoppingCart, MessageCircle, Shield, Truck } from 'lucide-react';

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
import xuXinImg from '../assets/images/xuXinSuperZlc.jpg';
import samsonovImg from '../assets/images/samsonovForce.jpg';
import vegaProBladeImg from '../assets/images/xiomVegaPro.jpg';
import niwaImg from '../assets/images/kokiNiwa.jpg';

// Import rubber images
import dignics05Img from '../assets/images/rubbers/dignicsO5.jpg';
import dignics09cImg from '../assets/images/rubbers/dignicsO9C.jpg';
import dignics80Img from '../assets/images/rubbers/dignics80.jpg';
import dignics64Img from '../assets/images/rubbers/dignics64.jpg';
import tenergy05Img from '../assets/images/rubbers/tnergy05.jpg';
import tenergy64Img from '../assets/images/rubbers/tenergy64.jpg';
import tenergy80Img from '../assets/images/rubbers/tenergy80.jpg';
import tenergy19Img from '../assets/images/rubbers/tenergy19.jpg';
import rozenaImg from '../assets/images/rubbers/rozena.jpg';
import sriverFXImg from '../assets/images/rubbers/sriverFX.jpg';
import bryceSpeedImg from '../assets/images/rubbers/bryceHighSpeed.jpg';
import vegaEuroDFImg from '../assets/images/rubbers/Xiom-Vega-Europe-DF-Cover.jpg';
import vegaProImg from '../assets/images/rubbers/vegapro.jpg';
import bluestormZ1Img from '../assets/images/rubbers/RDBZT-donic-bluestorm-z1-t-blue2.jpg';
import evolutionMXPImg from '../assets/images/rubbers/evolutionMXP.jpg';
import markVImg from '../assets/images/rubbers/yakasamark5.jpg';
import rakza7Img from '../assets/images/rubbers/razka7.jpg';
import rasantPowergripImg from '../assets/images/rubbers/rasantPowergrip.jpg';
import v15ExtraImg from '../assets/images/rubbers/victas-v-15.jpg';

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
    image: timoBollImg,
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
    image: zhangJikeImg,
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
    image: linYuJuImg,
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
    image: viscariaImg,
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
    image: innerforceImg,
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
    image: harimotoImg,
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
    image: tenergy05Img,
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
    image: dignics09cImg,
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
    image: dignics05Img,
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
    image: tenergy64Img,
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
    image: tenergy80Img,
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
    image: rozenaImg,
    features: [
      'Affordable tensioned rubber',
      'Easy to control',
      'Good spin for learning',
      'High arc for safety',
      'Great value for money',
      'Perfect for developing players'
    ]
  },

  // New Blades
  'butterfly-jun-mizutani-zlc': {
    name: 'Butterfly Jun Mizutani ZLC',
    category: 'Blade',
    rating: 4.8,
    reviews: 167,
    composition: '5+2 (5 Wood + 2 ZL Carbon)',
    speed: 'OFF+ (Very Fast)',
    control: '8/10',
    spin: '9/10',
    origin: 'Made in Japan',
    level: 'Advanced / Professional',
    playingStyle: 'Offensive',
    weight: '83g',
    thickness: '5.8mm',
    description: 'Olympic medalist Jun Mizutani\'s signature blade. ZL Carbon for lightweight explosive power.',
    fullDescription: 'The Butterfly Jun Mizutani ZLC is the signature blade of Olympic medalist Jun Mizutani. Featuring ZL Carbon fiber, this blade provides explosive power while maintaining a surprisingly light weight. The ZL Carbon layers offer excellent energy transfer and vibration dampening, making it easier to control powerful shots. Perfect for offensive players who want maximum speed without the heavy weight of traditional carbon blades.',
    price: 17899,
    originalPrice: 19999,
    image: mizutaniImg,
    features: [
      'ZL Carbon for lightweight power',
      'Used by Olympic medalist Jun Mizutani',
      'Excellent vibration dampening',
      'Fast offensive blade',
      'Premium Japanese craftsmanship',
      'Lighter than traditional carbon blades'
    ]
  },
  'butterfly-hadraw-shield': {
    name: 'Butterfly Hadraw Shield',
    category: 'Blade',
    rating: 4.6,
    reviews: 89,
    composition: '5+2 (5 Wood + 2 Arylate)',
    speed: 'OFF- (Medium-Fast)',
    control: '9.5/10',
    spin: '8/10',
    origin: 'Made in Japan',
    level: 'Intermediate / Advanced',
    playingStyle: 'Defensive / All-Round',
    weight: '82g',
    thickness: '5.5mm',
    description: 'Defensive blade with excellent control. Perfect for choppers and all-round defensive players.',
    fullDescription: 'The Butterfly Hadraw Shield is designed for defensive players who need exceptional control and feel. The Arylate fiber layers provide just enough speed for counterattacks while maintaining the soft touch needed for precise chopping. This blade offers excellent control for defensive techniques while still allowing offensive shots when opportunities arise. Perfect for choppers and all-round defensive players.',
    price: 11299,
    originalPrice: 12999,
    image: hadrawImg,
    features: [
      'Excellent control for defensive play',
      'Perfect for chopping techniques',
      'Soft feel with Arylate fiber',
      'Lightweight construction',
      'Allows counterattacking when needed',
      'Great for all-round defensive style'
    ]
  },
  'butterfly-primorac-carbon': {
    name: 'Butterfly Primorac Carbon',
    category: 'Blade',
    rating: 4.7,
    reviews: 143,
    composition: '5+2 (5 Wood + 2 Carbon)',
    speed: 'OFF- (Medium-Fast)',
    control: '9/10',
    spin: '8.5/10',
    origin: 'Made in Japan',
    level: 'Intermediate / Advanced',
    playingStyle: 'Defensive / All-Round',
    weight: '84g',
    thickness: '5.6mm',
    description: 'Classic defensive blade with carbon layers. Used by Zoran Primorac for decades.',
    fullDescription: 'The Butterfly Primorac Carbon is a legendary defensive blade used by Zoran Primorac throughout his illustrious career. This blade combines the control needed for defensive play with carbon layers that provide enough speed for powerful counterattacks. The construction offers excellent feel for chopping and blocking, while still maintaining the ability to attack when opportunities present themselves. A true classic for defensive and all-round players.',
    price: 10799,
    originalPrice: 12499,
    image: primoracImg,
    features: [
      'Used by Zoran Primorac',
      'Classic defensive blade',
      'Carbon layers for counterattacking',
      'Excellent control and feel',
      'Perfect balance for defensive play',
      'Premium Japanese quality'
    ]
  },
  'butterfly-fan-zhendong-alc': {
    name: 'Butterfly Fan Zhendong ALC',
    category: 'Blade',
    rating: 4.9,
    reviews: 201,
    composition: '5+2 (5 Wood + 2 Arylate-Carbon)',
    speed: 'OFF+ (Very Fast)',
    control: '8.5/10',
    spin: '9.5/10',
    origin: 'Made in Japan',
    level: 'Professional',
    playingStyle: 'Offensive',
    weight: '88g',
    thickness: '6.0mm',
    description: 'World #1 Fan Zhendong\'s blade. Perfect for powerful loops with exceptional control.',
    fullDescription: 'The Butterfly Fan Zhendong ALC is the signature blade of current world number one Fan Zhendong. This blade features a slightly thicker construction that provides incredible power while maintaining excellent control. The Arylate Carbon layers enable powerful loops from all distances, while the unique construction ensures consistency and precision. Used by one of the greatest players in history, this blade is perfect for players who want to dominate with heavy topspin and aggressive attacks.',
    price: 16299,
    originalPrice: 18999,
    image: fanZhendongImg,
    features: [
      'Used by world #1 Fan Zhendong',
      'Incredible power for loops',
      'Exceptional spin generation',
      'Thicker construction for stability',
      'Perfect for aggressive topspin play',
      'Premium Japanese construction'
    ]
  },
  'butterfly-ma-long-carbon-2': {
    name: 'Butterfly Ma Long Carbon 2',
    category: 'Blade',
    rating: 4.9,
    reviews: 278,
    composition: '5+2 (5 Wood + 2 Carbon)',
    speed: 'OFF (Fast)',
    control: '9/10',
    spin: '9/10',
    origin: 'Made in Japan',
    level: 'Advanced / Professional',
    playingStyle: 'Offensive All-Round',
    weight: '87g',
    thickness: '5.8mm',
    description: 'Updated version of legendary Ma Long\'s blade. Perfect balance for offensive play.',
    fullDescription: 'The Butterfly Ma Long Carbon 2 is the updated version of the legendary Olympic Champion Ma Long\'s blade. This blade offers the perfect balance of speed, control, and spin that Ma Long is famous for. The carbon layers provide excellent power for aggressive attacks while maintaining the soft feel needed for precise placement. This blade embodies Ma Long\'s playing style - powerful yet controlled, aggressive yet precise. Perfect for complete offensive players.',
    price: 15499,
    originalPrice: 17999,
    image: maLongImg,
    features: [
      'Used by Olympic Champion Ma Long',
      'Perfect balance of all attributes',
      'Excellent for all offensive techniques',
      'Carbon power with wood feel',
      'Consistent performance',
      'Suitable for tournament play'
    ]
  },
  'butterfly-xu-xin-super-zlc': {
    name: 'Butterfly Xu Xin Super ZLC',
    category: 'Blade',
    rating: 4.8,
    reviews: 134,
    composition: '5+2 (5 Wood + 2 Super ZL Carbon)',
    speed: 'OFF++ (Very Fast)',
    control: '7.5/10',
    spin: '9/10',
    origin: 'Made in Japan',
    level: 'Professional',
    playingStyle: 'Ultra Offensive',
    weight: '84g',
    thickness: '5.9mm',
    description: 'Xu Xin\'s signature blade with Super ZLC. Incredible speed for penhold players.',
    fullDescription: 'The Butterfly Xu Xin Super ZLC is designed for the unique playing style of Xu Xin, one of the best penhold players in the world. Featuring Super ZL Carbon fiber, this blade provides extreme speed and power while maintaining a light weight. The construction is optimized for the explosive attacks and creative shots that Xu Xin is famous for. Perfect for advanced penhold players or shakehand players who want maximum speed and aggression.',
    price: 24999,
    originalPrice: 27999,
    image: xuXinImg,
    features: [
      'Used by Xu Xin',
      'Super ZL Carbon for extreme speed',
      'Optimized for penhold play',
      'Lightweight construction',
      'Explosive power for creative shots',
      'Professional level blade'
    ]
  },
  'butterfly-garaydia-alc': {
    name: 'Butterfly Garaydia ALC',
    category: 'Blade',
    rating: 4.7,
    reviews: 98,
    composition: '5+2 (5 Wood + 2 Arylate-Carbon)',
    speed: 'OFF (Fast)',
    control: '8.5/10',
    spin: '9/10',
    origin: 'Made in Japan',
    level: 'Advanced',
    playingStyle: 'Aggressive Offensive',
    weight: '90g',
    thickness: '6.2mm',
    description: 'Thicker blade for powerful offensive play. Excellent for close-to-table aggressive loops.',
    fullDescription: 'The Butterfly Garaydia ALC features a thicker construction that provides incredible power for close-to-table aggressive play. The thicker blade offers a larger sweet spot and more stability for fast exchanges. The Arylate Carbon layers deliver explosive power for aggressive loops and counterloops. Perfect for players who like to play close to the table with fast, powerful attacks and quick exchanges.',
    price: 13299,
    originalPrice: 15499,
    image: garaydiaImg,
    features: [
      'Thicker construction for power',
      'Excellent for close-to-table play',
      'Large sweet spot',
      'Great for aggressive loops',
      'Stable for fast exchanges',
      'Premium Arylate Carbon layers'
    ]
  },
  'butterfly-corbor': {
    name: 'Butterfly Corbor',
    category: 'Blade',
    rating: 4.6,
    reviews: 87,
    composition: '5 Wood',
    speed: 'OFF- (Medium-Fast)',
    control: '9/10',
    spin: '8/10',
    origin: 'Made in Japan',
    level: 'Intermediate',
    playingStyle: 'All-Round Offensive',
    weight: '88g',
    thickness: '5.9mm',
    description: 'Classic 5-ply all-wood blade. Excellent feel and control for traditional players.',
    fullDescription: 'The Butterfly Corbor is a classic 5-ply all-wood blade that offers the pure feel that many traditional players prefer. Without any synthetic fibers, this blade provides excellent touch and control for all strokes. The all-wood construction gives a soft, forgiving feel that makes it easier to develop proper technique. Perfect for intermediate players who want to experience the traditional feel of an all-wood blade while still maintaining good offensive capabilities.',
    price: 8999,
    originalPrice: 10499,
    image: korbelImg,
    features: [
      'Classic 5-ply all-wood construction',
      'Excellent natural feel',
      'Great for learning proper technique',
      'Soft and forgiving',
      'Traditional playing experience',
      'Quality Japanese craftsmanship'
    ]
  },
  'butterfly-korbel': {
    name: 'Butterfly Korbel',
    category: 'Blade',
    rating: 4.5,
    reviews: 156,
    composition: '5 Wood',
    speed: 'ALL+ (Medium)',
    control: '9.5/10',
    spin: '7.5/10',
    origin: 'Made in Japan',
    level: 'Beginner / Intermediate',
    playingStyle: 'All-Round',
    weight: '85g',
    thickness: '5.7mm',
    description: 'Most popular all-wood blade for beginners. Perfect balance and excellent for learning.',
    fullDescription: 'The Butterfly Korbel is one of the most popular beginner and intermediate blades in the world. This 5-ply all-wood blade offers perfect balance and control that makes it ideal for learning fundamental techniques. The medium speed allows players to develop proper stroke mechanics without being overwhelmed by excessive speed. Used by coaches worldwide to teach proper table tennis fundamentals.',
    price: 6799,
    originalPrice: 7999,
    image: korbelImg,
    features: [
      'Most popular beginner blade',
      'Perfect for learning fundamentals',
      'Excellent control',
      'Balanced for all strokes',
      'Used by coaches worldwide',
      'Great value for money'
    ]
  },
  'butterfly-petr-korbel': {
    name: 'Butterfly Petr Korbel',
    category: 'Blade',
    rating: 4.6,
    reviews: 123,
    composition: '7 Wood',
    speed: 'OFF- (Medium-Fast)',
    control: '9/10',
    spin: '8/10',
    origin: 'Made in Japan',
    level: 'Intermediate / Advanced',
    playingStyle: 'Offensive All-Round',
    weight: '89g',
    thickness: '6.1mm',
    description: 'Upgraded Korbel with 7-ply construction. More speed while maintaining excellent control.',
    fullDescription: 'The Butterfly Petr Korbel is the upgraded version of the classic Korbel, featuring 7 plies of wood for increased speed and power. This blade maintains the excellent control that the Korbel series is famous for while providing more offensive capabilities. The 7-ply construction gives a slightly harder feel and faster tempo, making it perfect for intermediate players ready to transition to more aggressive play.',
    price: 8499,
    originalPrice: 9999,
    image: korbelImg,
    features: [
      '7-ply construction for more speed',
      'Upgrade from classic Korbel',
      'Maintains excellent control',
      'Perfect for developing players',
      'Good balance of speed and control',
      'Japanese premium quality'
    ]
  },
  'butterfly-sardius': {
    name: 'Butterfly Sardius',
    category: 'Blade',
    rating: 4.7,
    reviews: 91,
    composition: '7 Wood',
    speed: 'OFF- (Medium-Fast)',
    control: '9/10',
    spin: '8.5/10',
    origin: 'Made in Japan',
    level: 'Intermediate / Advanced',
    playingStyle: 'Spin-Oriented Offensive',
    weight: '87g',
    thickness: '6.0mm',
    description: '7-ply blade with excellent touch. Great for spin-oriented offensive play.',
    fullDescription: 'The Butterfly Sardius is a 7-ply all-wood blade designed for players who prioritize spin over raw speed. The construction provides excellent touch and feel, making it easier to generate heavy topspin. The softer feel compared to carbon blades allows better control for spin-oriented strokes. Perfect for offensive players who want to dominate with heavy loops and precise spin variation.',
    price: 9299,
    originalPrice: 10999,
    image: sardiusImg,
    features: [
      'Excellent for spin generation',
      'Great touch and feel',
      '7-ply all-wood construction',
      'Perfect for loop-heavy play',
      'Good control for spin variation',
      'Quality Japanese craftsmanship'
    ]
  },
  'stiga-carbonado-290': {
    name: 'Stiga Carbonado 290',
    category: 'Blade',
    rating: 4.8,
    reviews: 167,
    composition: '5+2 (5 Wood + 2 Carbon)',
    speed: 'OFF++ (Very Fast)',
    control: '7.5/10',
    spin: '8.5/10',
    origin: 'Made in Sweden',
    level: 'Advanced / Professional',
    playingStyle: 'Ultra Offensive',
    weight: '89g',
    thickness: '6.1mm',
    description: 'Premium carbon blade from Stiga. Exceptional speed and power for aggressive players.',
    fullDescription: 'The Stiga Carbonado 290 is one of the fastest blades in the Stiga lineup. Featuring carbon layers positioned for maximum speed, this blade provides exceptional power for aggressive attacking play. The Swedish craftsmanship ensures consistent performance and quality. Perfect for advanced players who want to overwhelm opponents with fast, powerful attacks and have the technique to control such a fast blade.',
    price: 12999,
    originalPrice: 14999,
    image: carbonadoImg,
    features: [
      'Exceptional speed and power',
      'Premium Swedish craftsmanship',
      'Carbon fiber for explosive attacks',
      'Perfect for aggressive play',
      'Consistent performance',
      'For advanced technique'
    ]
  },
  'stiga-cybershape-carbon': {
    name: 'Stiga Cybershape Carbon',
    category: 'Blade',
    rating: 4.7,
    reviews: 134,
    composition: '5+2 (5 Wood + 2 Carbon)',
    speed: 'OFF+ (Very Fast)',
    control: '8/10',
    spin: '8.5/10',
    origin: 'Made in Sweden',
    level: 'Advanced',
    playingStyle: 'Offensive',
    weight: '88g',
    thickness: '5.9mm',
    description: 'Innovative teardrop shape for larger sweet spot. Carbon power with enhanced control.',
    fullDescription: 'The Stiga Cybershape Carbon features an innovative teardrop-shaped blade head that provides a larger sweet spot and better weight distribution. This unique design makes it easier to hit consistent powerful shots. The carbon layers provide excellent speed while the shape enhances control. Perfect for players looking for something different that offers both power and consistency.',
    price: 11799,
    originalPrice: 13499,
    image: cybershapeImg,
    features: [
      'Innovative teardrop shape',
      'Larger sweet spot',
      'Better weight distribution',
      'Carbon power with control',
      'Unique playing experience',
      'Swedish engineering'
    ]
  },
  'stiga-offensive-classic': {
    name: 'Stiga Offensive Classic',
    category: 'Blade',
    rating: 4.6,
    reviews: 198,
    composition: '5 Wood',
    speed: 'OFF- (Medium-Fast)',
    control: '9/10',
    spin: '8/10',
    origin: 'Made in Sweden',
    level: 'Intermediate / Advanced',
    playingStyle: 'Offensive All-Round',
    weight: '86g',
    thickness: '5.8mm',
    description: 'Legendary Stiga blade. Used by champions for decades. Perfect offensive control.',
    fullDescription: 'The Stiga Offensive Classic is one of the most legendary blades in table tennis history. Used by champions for decades, this 5-ply all-wood blade offers the perfect balance of offensive speed and control. The Swedish craftsmanship ensures consistent performance and excellent feel. This blade has stood the test of time and continues to be a favorite among players who appreciate traditional quality.',
    price: 7499,
    originalPrice: 8999,
    image: offensiveClassicImg,
    features: [
      'Legendary classic blade',
      'Used by champions for decades',
      'Perfect offensive control',
      'All-wood construction',
      'Excellent feel',
      'Premium Swedish quality'
    ]
  },
  'stiga-clipper-wood': {
    name: 'Stiga Clipper Wood',
    category: 'Blade',
    rating: 4.8,
    reviews: 245,
    composition: '7 Wood',
    speed: 'OFF (Fast)',
    control: '9/10',
    spin: '8.5/10',
    origin: 'Made in Sweden',
    level: 'Intermediate / Advanced',
    playingStyle: 'Offensive All-Round',
    weight: '88g',
    thickness: '6.0mm',
    description: 'Most famous 7-ply blade ever. Legendary control and feel for all-round play.',
    fullDescription: 'The Stiga Clipper Wood is arguably the most famous 7-ply blade in table tennis history. This legendary blade has been used by countless world-class players and offers perfect balance for all-round offensive play. The 7-ply construction provides excellent speed while maintaining superb control and feel. A true classic that has proven its worth over decades of top-level competition.',
    price: 8999,
    originalPrice: 10499,
    image: clipperWoodImg,
    features: [
      'Most famous 7-ply blade',
      'Legendary performance',
      'Perfect all-round balance',
      'Used by world-class players',
      'Excellent feel and control',
      'Swedish craftsmanship'
    ]
  },
  'stiga-clipper-cr': {
    name: 'Stiga Clipper CR',
    category: 'Blade',
    rating: 4.8,
    reviews: 178,
    composition: '7+2 (7 Wood + 2 Carbon)',
    speed: 'OFF+ (Very Fast)',
    control: '8.5/10',
    spin: '8.5/10',
    origin: 'Made in Sweden',
    level: 'Advanced',
    playingStyle: 'Offensive',
    weight: '91g',
    thickness: '6.3mm',
    description: 'Carbon version of legendary Clipper. More speed while keeping the famous feel.',
    fullDescription: 'The Stiga Clipper CR (Crystal) is the carbon-enhanced version of the legendary Clipper Wood. This blade maintains the famous Clipper feel while adding carbon layers for increased speed and power. The 7+2 construction provides explosive offensive capabilities while retaining the control that made the original Clipper famous. Perfect for players who love the Clipper but want more speed.',
    price: 12299,
    originalPrice: 14299,
    image: clipperCRImg,
    features: [
      'Carbon upgrade of legendary Clipper',
      'Maintains famous Clipper feel',
      'Increased speed and power',
      'Excellent for offensive play',
      '7+2 construction',
      'Swedish quality with carbon technology'
    ]
  },
  'yasaka-ma-lin-extra-offensive': {
    name: 'Yasaka Ma Lin Extra Offensive',
    category: 'Blade',
    rating: 4.7,
    reviews: 143,
    composition: '5+2 (5 Wood + 2 Carbon)',
    speed: 'OFF+ (Very Fast)',
    control: '8/10',
    spin: '8.5/10',
    origin: 'Made in Sweden',
    level: 'Advanced / Professional',
    playingStyle: 'Aggressive Offensive',
    weight: '87g',
    thickness: '5.9mm',
    description: 'Ma Lin\'s legendary blade from Yasaka. Perfect for powerful penhold attacks.',
    fullDescription: 'The Yasaka Ma Lin Extra Offensive is the legendary blade used by Olympic Champion Ma Lin during his dominance of the penhold style. This blade features carbon layers that provide explosive power for aggressive attacks while maintaining enough control for precise placement. Although designed for penhold, it works excellently for shakehand players who want a fast offensive blade. Perfect for aggressive attacking styles.',
    price: 10299,
    originalPrice: 11999,
    image: maLinExtraImg,
    features: [
      'Used by Olympic Champion Ma Lin',
      'Perfect for aggressive penhold play',
      'Carbon power for explosive attacks',
      'Great for shakehand players too',
      'Fast offensive blade',
      'Swedish craftsmanship'
    ]
  },
  'yasaka-sweden-extra': {
    name: 'Yasaka Sweden Extra',
    category: 'Blade',
    rating: 4.6,
    reviews: 112,
    composition: '5 Wood',
    speed: 'ALL+ (Medium)',
    control: '9.5/10',
    spin: '7.5/10',
    origin: 'Made in Sweden',
    level: 'Beginner / Intermediate',
    playingStyle: 'All-Round',
    weight: '84g',
    thickness: '5.6mm',
    description: 'Classic all-wood blade from Yasaka. Excellent for developing proper technique.',
    fullDescription: 'The Yasaka Sweden Extra is a classic all-wood blade perfect for beginners and intermediate players. With excellent control and a medium speed, this blade makes it easy to develop proper stroke mechanics and learn fundamental techniques. The Swedish craftsmanship ensures quality and consistency. Perfect for players who want to build a solid foundation before moving to faster blades.',
    price: 5999,
    originalPrice: 6999,
    image: swedenExtraImg,
    features: [
      'Perfect for beginners',
      'Excellent control',
      'Classic all-wood construction',
      'Great for learning fundamentals',
      'Consistent performance',
      'Quality Swedish craftsmanship'
    ]
  },
  'donic-ovtcharov-carbospeed': {
    name: 'Donic Ovtcharov Carbospeed',
    category: 'Blade',
    rating: 4.8,
    reviews: 156,
    composition: '5+2 (5 Wood + 2 Carbon)',
    speed: 'OFF+ (Very Fast)',
    control: '8/10',
    spin: '8.5/10',
    origin: 'Made in Germany',
    level: 'Advanced / Professional',
    playingStyle: 'Aggressive Offensive',
    weight: '88g',
    thickness: '6.0mm',
    description: 'Dimitrij Ovtcharov\'s blade. Incredible speed with AVS technology for reduced vibration.',
    fullDescription: 'The Donic Ovtcharov Carbospeed is the signature blade of German superstar Dimitrij Ovtcharov. Featuring AVS (Anti Vibration System) technology, this blade provides incredible speed while reducing unwanted vibrations. The carbon layers deliver explosive power for aggressive attacks. Perfect for advanced players who want maximum speed with enhanced control through vibration dampening technology.',
    price: 13499,
    originalPrice: 15499,
    image: ovtcharovImg,
    features: [
      'Used by Dimitrij Ovtcharov',
      'AVS technology reduces vibration',
      'Incredible speed and power',
      'Carbon fiber construction',
      'Perfect for aggressive play',
      'German engineering quality'
    ]
  },
  'donic-waldner-senso-carbon': {
    name: 'Donic Waldner Senso Carbon',
    category: 'Blade',
    rating: 4.7,
    reviews: 134,
    composition: '5+2 (5 Wood + 2 Carbon)',
    speed: 'OFF (Fast)',
    control: '8.5/10',
    spin: '8.5/10',
    origin: 'Made in Germany',
    level: 'Advanced',
    playingStyle: 'Offensive All-Round',
    weight: '86g',
    thickness: '5.8mm',
    description: 'Jan-Ove Waldner\'s signature blade with Senso technology for enhanced feel.',
    fullDescription: 'The Donic Waldner Senso Carbon is the signature blade of the legendary Jan-Ove Waldner from Donic. Featuring Senso technology for enhanced feel and touch, this blade provides excellent speed with superior control. The carbon layers deliver power while the Senso technology ensures you maintain excellent ball contact sensation. Perfect for players who want offensive speed without sacrificing feel.',
    price: 11999,
    originalPrice: 13999,
    image: waldnerImg,
    features: [
      'Jan-Ove Waldner signature blade',
      'Senso technology for enhanced feel',
      'Excellent speed with control',
      'Carbon fiber layers',
      'Superior ball contact sensation',
      'German quality engineering'
    ]
  },
  'tibhar-samsonov-force-pro': {
    name: 'Tibhar Samsonov Force Pro',
    category: 'Blade',
    rating: 4.7,
    reviews: 98,
    composition: '5+2 (5 Wood + 2 Carbon)',
    speed: 'OFF+ (Very Fast)',
    control: '8/10',
    spin: '8.5/10',
    origin: 'Made in Germany',
    level: 'Advanced / Professional',
    playingStyle: 'Offensive',
    weight: '87g',
    thickness: '5.9mm',
    description: 'Vladimir Samsonov\'s professional blade. Carbon power with outstanding control.',
    fullDescription: 'The Tibhar Samsonov Force Pro is the signature blade of the legendary Vladimir Samsonov. This blade combines carbon fiber power with outstanding control, reflecting Samsonov\'s precise and powerful playing style. The construction provides excellent speed for offensive play while maintaining the control needed for precise shot placement. Perfect for advanced players who want professional-level performance.',
    price: 10799,
    originalPrice: 12499,
    image: samsonovImg,
    features: [
      'Used by Vladimir Samsonov',
      'Carbon power with control',
      'Professional level blade',
      'Excellent for precise attacks',
      'Fast offensive speed',
      'Premium German craftsmanship'
    ]
  },
  'xiom-vega-pro-blade': {
    name: 'Xiom Vega Pro',
    category: 'Blade',
    rating: 4.6,
    reviews: 87,
    composition: '5+2 (5 Wood + 2 Carbon)',
    speed: 'OFF (Fast)',
    control: '8.5/10',
    spin: '8.5/10',
    origin: 'Made in Korea',
    level: 'Intermediate / Advanced',
    playingStyle: 'Offensive All-Round',
    weight: '86g',
    thickness: '5.8mm',
    description: 'Professional carbon blade from Xiom. Perfect balance of speed, spin and control.',
    fullDescription: 'The Xiom Vega Pro is a professional carbon blade that offers perfect balance for all-round offensive play. Korean engineering ensures consistent quality and performance. The carbon layers provide good speed while the construction maintains excellent control and feel. Perfect for intermediate to advanced players who want a balanced offensive blade at a reasonable price.',
    price: 9499,
    originalPrice: 10999,
    image: vegaProBladeImg,
    features: [
      'Balanced offensive performance',
      'Korean engineering quality',
      'Good speed with control',
      'Carbon fiber construction',
      'Great value for money',
      'Versatile for various styles'
    ]
  },
  'victas-koki-niwa-wood': {
    name: 'Victas Koki Niwa Wood',
    category: 'Blade',
    rating: 4.7,
    reviews: 123,
    composition: '5 Wood',
    speed: 'OFF- (Medium-Fast)',
    control: '9/10',
    spin: '8.5/10',
    origin: 'Made in Japan',
    level: 'Intermediate / Advanced',
    playingStyle: 'Spin-Oriented Offensive',
    weight: '86g',
    thickness: '5.8mm',
    description: 'Koki Niwa\'s all-wood blade. Exceptional feel and control for precise offensive play.',
    fullDescription: 'The Victas Koki Niwa Wood is the all-wood blade used by Japanese star Koki Niwa. This blade offers exceptional feel and touch that only pure wood construction can provide. The design is optimized for spin-oriented offensive play with excellent control. Perfect for players who prefer the natural feel of wood and want to generate heavy spin with precise control.',
    price: 9999,
    originalPrice: 11499,
    image: niwaImg,
    features: [
      'Used by Koki Niwa',
      'All-wood construction',
      'Exceptional feel and touch',
      'Great for spin generation',
      'Precise offensive control',
      'Premium Japanese quality'
    ]
  },

  // New Rubbers
  'butterfly-tenergy-19': {
    name: 'Butterfly Tenergy 19',
    category: 'Rubber',
    rating: 4.7,
    reviews: 145,
    type: 'Inverted (Tensioned)',
    hardness: '36° (Medium-Soft)',
    arc: 'High Arc',
    speed: '8/10',
    control: '8.5/10',
    spin: '9.5/10',
    level: 'Intermediate to Advanced',
    playingStyle: 'Spin-Oriented Topspin',
    thickness: '1.9mm, 2.1mm, MAX',
    description: 'Latest addition to Tenergy series. Enhanced spin with softer feel for better control.',
    fullDescription: 'Butterfly Tenergy 19 is the latest addition to the legendary Tenergy series. This rubber features an enhanced topsheet that provides even better grip and spin generation compared to previous Tenergy models. The slightly softer feel makes it easier to control while maintaining excellent spin capability. Perfect for players who prioritize spin over raw speed and want the latest technology from Butterfly.',
    price: 4899,
    originalPrice: 5699,
    image: tenergy19Img,
    features: [
      'Latest Tenergy technology',
      'Enhanced spin capability',
      'Softer feel for control',
      'Spring Sponge X technology',
      'High arc trajectory',
      'Perfect for spin-oriented play'
    ]
  },
  'butterfly-dignics-80': {
    name: 'Butterfly Dignics 80',
    category: 'Rubber',
    rating: 4.8,
    reviews: 167,
    type: 'Inverted (Tensioned)',
    hardness: '40° (Medium)',
    arc: 'Low-Medium Arc',
    speed: '9.5/10',
    control: '8/10',
    spin: '8.5/10',
    level: 'Advanced / Professional',
    playingStyle: 'Speed Attack',
    thickness: '1.8mm, 2.0mm, MAX',
    description: 'Fast linear trajectory with Dignics quality. Perfect for aggressive flat hitting style.',
    fullDescription: 'Butterfly Dignics 80 is the fastest rubber in the Dignics series, designed for players who prefer linear, direct attacks. The low-medium arc trajectory keeps shots flat and fast, making it difficult for opponents to return. The 40-degree hardness provides excellent speed while the Dignics topsheet maintains good grip. Perfect for players who play close to the table with fast counterattacks and flat hits.',
    price: 6549,
    originalPrice: 7499,
    image: dignics80Img,
    features: [
      'Fastest Dignics rubber',
      'Linear trajectory for direct attacks',
      'Excellent for flat hitting',
      'Great for counterattacks',
      'Premium Dignics quality',
      'For aggressive close-to-table play'
    ]
  },
  'butterfly-dignics-64': {
    name: 'Butterfly Dignics 64',
    category: 'Rubber',
    rating: 4.7,
    reviews: 134,
    type: 'Inverted (Tensioned)',
    hardness: '40° (Medium)',
    arc: 'Medium Arc',
    speed: '9/10',
    control: '9/10',
    spin: '9/10',
    level: 'Intermediate to Professional',
    playingStyle: 'All-Round Offensive',
    thickness: '1.9mm, 2.1mm, MAX',
    description: 'All-round Dignics rubber. Balanced performance for versatile playing styles.',
    fullDescription: 'Butterfly Dignics 64 is the most versatile rubber in the Dignics series. With balanced speed, spin, and control, this rubber allows players to execute all offensive techniques effectively. The medium arc provides a good balance between safety and aggression. Perfect for all-round offensive players who want premium performance in all aspects without extreme characteristics.',
    price: 6299,
    originalPrice: 7299,
    image: dignics64Img,
    features: [
      'Most balanced Dignics',
      'Versatile for all techniques',
      'Excellent control',
      'Good speed and spin',
      'Medium arc trajectory',
      'Perfect for all-round play'
    ]
  },
  'butterfly-sriver-fx': {
    name: 'Butterfly Sriver FX',
    category: 'Rubber',
    rating: 4.4,
    reviews: 289,
    type: 'Inverted',
    hardness: '35° (Soft)',
    arc: 'High Arc',
    speed: '6.5/10',
    control: '9.5/10',
    spin: '7.5/10',
    level: 'Beginner / Intermediate',
    playingStyle: 'All-Round',
    thickness: '1.7mm, 1.9mm, 2.1mm',
    description: 'Classic soft rubber for beginners. Excellent control and forgiving for learning proper technique.',
    fullDescription: 'Butterfly Sriver FX is a classic soft rubber that has been helping beginners learn table tennis for decades. The soft 35-degree sponge makes it easy to control the ball and develop proper stroke mechanics. The high arc trajectory is forgiving and helps players learn topspin technique. Perfect for beginners and recreational players who prioritize control and consistency.',
    price: 2799,
    originalPrice: 3299,
    image: sriverFXImg,
    features: [
      'Classic beginner rubber',
      'Very soft and controllable',
      'High arc for safety',
      'Great for learning',
      'Forgiving for mistakes',
      'Excellent value for beginners'
    ]
  },
  'butterfly-bryce-speed': {
    name: 'Butterfly Bryce Speed',
    category: 'Rubber',
    rating: 4.6,
    reviews: 178,
    type: 'Inverted (Tensioned)',
    hardness: '40° (Medium)',
    arc: 'Medium Arc',
    speed: '9/10',
    control: '8/10',
    spin: '8/10',
    level: 'Intermediate to Advanced',
    playingStyle: 'Speed-Oriented Offensive',
    thickness: '1.9mm, 2.1mm, MAX',
    description: 'High-speed rubber with German technology. Excellent for powerful offensive play.',
    fullDescription: 'Butterfly Bryce Speed combines Butterfly quality with German engineering for a high-speed offensive rubber. The medium arc provides good control while maintaining excellent speed. The 40-degree hardness gives a solid feel for powerful attacks. Perfect for players who want speed-oriented offensive play without the premium price of Tenergy or Dignics.',
    price: 3999,
    originalPrice: 4699,
    image: bryceSpeedImg,
    features: [
      'German technology',
      'High speed for attacks',
      'Good control',
      'Medium arc trajectory',
      'Excellent value',
      'For speed-oriented play'
    ]
  },
  'butterfly-bryce-speed-fx': {
    name: 'Butterfly Bryce Speed FX',
    category: 'Rubber',
    rating: 4.5,
    reviews: 156,
    type: 'Inverted (Tensioned)',
    hardness: '37° (Medium-Soft)',
    arc: 'Medium-High Arc',
    speed: '8.5/10',
    control: '8.5/10',
    spin: '8/10',
    level: 'Intermediate',
    playingStyle: 'All-Round Offensive',
    thickness: '1.9mm, 2.1mm, MAX',
    description: 'Softer version of Bryce Speed. Better control while maintaining good speed.',
    fullDescription: 'Butterfly Bryce Speed FX is the softer version of Bryce Speed, designed for players who want better control without sacrificing too much speed. The 37-degree hardness provides a softer feel that makes it easier to control loops and place shots precisely. The medium-high arc helps with consistency. Perfect for intermediate players developing their offensive game.',
    price: 3999,
    originalPrice: 4699,
    image: bryceSpeedImg,
    features: [
      'Softer than regular Bryce Speed',
      'Better control',
      'Good speed maintained',
      'Medium-high arc',
      'Great for developing players',
      'German technology'
    ]
  },
  'xiom-vega-euro-df': {
    name: 'Xiom Vega Europe DF',
    category: 'Rubber',
    rating: 4.7,
    reviews: 201,
    type: 'Inverted (Tensioned)',
    hardness: '47.5° (Medium-Hard)',
    arc: 'Medium Arc',
    speed: '8.5/10',
    control: '8.5/10',
    spin: '9/10',
    level: 'Intermediate to Advanced',
    playingStyle: 'Dynamic Topspin',
    thickness: '2.0mm, MAX',
    description: 'European style dynamic friction rubber. Excellent for topspin and counter play.',
    fullDescription: 'Xiom Vega Europe DF features dynamic friction technology that provides excellent grip for topspin play. The medium arc trajectory makes it easier to control powerful shots while the harder sponge provides good speed. This rubber excels at both opening loops and counterloops. Perfect for European-style topspin play with emphasis on spin and control.',
    price: 3799,
    originalPrice: 4499,
    image: vegaEuroDFImg,
    features: [
      'Dynamic friction technology',
      'Excellent topspin capability',
      'Great for counterloops',
      'Medium arc control',
      'European playing style',
      'Good value for performance'
    ]
  },
  'xiom-vega-pro-rubber': {
    name: 'Xiom Vega Pro',
    category: 'Rubber',
    rating: 4.6,
    reviews: 189,
    type: 'Inverted (Tensioned)',
    hardness: '47.5° (Medium-Hard)',
    arc: 'Medium-High Arc',
    speed: '8.5/10',
    control: '8/10',
    spin: '9/10',
    level: 'Intermediate to Advanced',
    playingStyle: 'All-Round Offensive',
    thickness: '2.0mm, MAX',
    description: 'Professional level Vega rubber. Perfect balance of spin, speed and control.',
    fullDescription: 'Xiom Vega Pro is the professional version of the popular Vega series. This rubber offers an excellent balance of spin, speed, and control at a competitive price point. The medium-hard sponge provides good speed while the grippy topsheet generates heavy spin. Perfect for intermediate to advanced players who want professional-level performance without the premium price.',
    price: 3599,
    originalPrice: 4299,
    image: vegaProImg,
    features: [
      'Professional level performance',
      'Balanced characteristics',
      'Excellent spin generation',
      'Good speed and control',
      'Great value',
      'Popular among competitive players'
    ]
  },
  'donic-bluestorm-z1': {
    name: 'Donic Bluestorm Z1',
    category: 'Rubber',
    rating: 4.7,
    reviews: 167,
    type: 'Inverted (Tensioned)',
    hardness: '47.5° (Medium-Hard)',
    arc: 'High Arc',
    speed: '8.5/10',
    control: '8/10',
    spin: '9.5/10',
    level: 'Intermediate to Professional',
    playingStyle: 'Power Topspin',
    thickness: '2.0mm, MAX',
    description: 'Tournament level tensor rubber. Exceptional spin and speed for aggressive players.',
    fullDescription: 'Donic Bluestorm Z1 is a tournament-level tensor rubber designed for aggressive topspin play. The high arc trajectory provides safety on powerful loops while the exceptional grip generates heavy spin. The German engineering ensures consistent performance and durability. Perfect for players who want to dominate with powerful, spinny loops from all distances.',
    price: 4299,
    originalPrice: 4999,
    image: bluestormZ1Img,
    features: [
      'Tournament level quality',
      'Exceptional spin generation',
      'High arc for safety',
      'German engineering',
      'Great for aggressive loops',
      'Consistent performance'
    ]
  },
  'tibhar-evolution-mx-p': {
    name: 'Tibhar Evolution MX-P',
    category: 'Rubber',
    rating: 4.7,
    reviews: 198,
    type: 'Inverted (Tensioned)',
    hardness: '47.5° (Medium-Hard)',
    arc: 'High Arc',
    speed: '9/10',
    control: '7.5/10',
    spin: '9/10',
    level: 'Advanced / Professional',
    playingStyle: 'Power Offensive',
    thickness: '2.0mm, 2.1mm, MAX',
    description: 'Power version of Evolution series. Maximum speed with excellent spin capability.',
    fullDescription: 'Tibhar Evolution MX-P is the power version of the popular Evolution series. This rubber provides maximum speed while maintaining excellent spin capability. The high arc helps keep powerful shots on the table. The German engineering ensures quality and consistency. Perfect for advanced players who want to overwhelm opponents with powerful, fast attacks.',
    price: 3899,
    originalPrice: 4599,
    image: evolutionMXPImg,
    features: [
      'Power version of Evolution',
      'Maximum speed',
      'Excellent spin',
      'High arc trajectory',
      'German quality',
      'For advanced players'
    ]
  },
  'yasaka-mark-v': {
    name: 'Yasaka Mark V',
    category: 'Rubber',
    rating: 4.4,
    reviews: 312,
    type: 'Inverted',
    hardness: '40° (Medium)',
    arc: 'High Arc',
    speed: '7/10',
    control: '9/10',
    spin: '7/10',
    level: 'Beginner / Intermediate',
    playingStyle: 'All-Round',
    thickness: '1.5mm, 1.8mm, 2.0mm, MAX',
    description: 'Legendary classic rubber. Perfect for learning fundamentals with excellent control.',
    fullDescription: 'Yasaka Mark V is one of the most legendary rubbers in table tennis history. Used by countless players to learn the fundamentals, this rubber offers excellent control and consistency. The medium hardness and high arc make it forgiving and easy to use. Perfect for beginners and recreational players who want a reliable, classic rubber that has stood the test of time.',
    price: 2299,
    originalPrice: 2799,
    image: markVImg,
    features: [
      'Legendary classic rubber',
      'Perfect for beginners',
      'Excellent control',
      'Very consistent',
      'High arc trajectory',
      'Time-tested quality'
    ]
  },
  'yasaka-rakza-7': {
    name: 'Yasaka Rakza 7',
    category: 'Rubber',
    rating: 4.6,
    reviews: 234,
    type: 'Inverted (Tensioned)',
    hardness: '45° (Medium)',
    arc: 'Medium-High Arc',
    speed: '8.5/10',
    control: '8.5/10',
    spin: '8.5/10',
    level: 'Intermediate to Advanced',
    playingStyle: 'All-Round Offensive',
    thickness: '1.8mm, 2.0mm, MAX',
    description: 'Popular tensor rubber. Great balance of speed, spin and control at affordable price.',
    fullDescription: 'Yasaka Rakza 7 is one of the most popular tensor rubbers worldwide, offering excellent value for money. This rubber provides a great balance of speed, spin, and control that makes it suitable for various playing styles. The medium-high arc gives good safety while the tensor technology provides modern speed and spin. Perfect for players wanting tensor performance at an affordable price.',
    price: 3199,
    originalPrice: 3799,
    image: rakza7Img,
    features: [
      'Excellent value for money',
      'Balanced performance',
      'Tensor technology',
      'Versatile for various styles',
      'Medium-high arc',
      'Very popular worldwide'
    ]
  },
  'andro-rasant-powergrip': {
    name: 'Andro Rasant Powergrip',
    category: 'Rubber',
    rating: 4.6,
    reviews: 156,
    type: 'Inverted (Tensioned)',
    hardness: '47.5° (Medium-Hard)',
    arc: 'High Arc',
    speed: '8/10',
    control: '8/10',
    spin: '9.5/10',
    level: 'Intermediate to Advanced',
    playingStyle: 'Spin-Oriented Offensive',
    thickness: '2.0mm, 2.1mm, MAX',
    description: 'Grippy tensor rubber for maximum spin. Excellent for aggressive looping play.',
    fullDescription: 'Andro Rasant Powergrip features an extremely grippy topsheet designed for maximum spin generation. The high arc trajectory provides safety on powerful loops while the excellent grip allows for heavy topspin from any position. The German engineering ensures consistent performance. Perfect for players who prioritize spin above all else and want to dominate with heavy, spinny loops.',
    price: 3499,
    originalPrice: 4199,
    image: rasantPowergripImg,
    features: [
      'Maximum spin capability',
      'Extremely grippy topsheet',
      'High arc for safety',
      'German engineering',
      'Great for heavy loops',
      'Excellent control'
    ]
  },
  'victas-v15-extra': {
    name: 'Victas V15 Extra',
    category: 'Rubber',
    rating: 4.7,
    reviews: 178,
    type: 'Inverted (Tensioned)',
    hardness: '47.5° (Medium-Hard)',
    arc: 'High Arc',
    speed: '8.5/10',
    control: '8.5/10',
    spin: '9.5/10',
    level: 'Advanced / Professional',
    playingStyle: 'Power Topspin',
    thickness: '2.0mm, MAX',
    description: 'High-end Japanese tensor rubber. Exceptional spin and speed for professional play.',
    fullDescription: 'Victas V15 Extra is a premium Japanese tensor rubber designed for professional-level play. This rubber provides exceptional spin generation combined with good speed and excellent control. The high arc trajectory makes it easier to loop consistently from all distances. The Japanese quality ensures consistent performance and durability. Perfect for advanced players who want premium performance.',
    price: 4399,
    originalPrice: 5199,
    image: v15ExtraImg,
    features: [
      'Premium Japanese quality',
      'Exceptional spin generation',
      'Professional level performance',
      'High arc trajectory',
      'Excellent consistency',
      'Great for advanced players'
    ]
  }
};

const ProductDetail: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const product = productId ? allProducts[productId] : null;

  // Scroll to top when component mounts or product changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [productId]);

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
