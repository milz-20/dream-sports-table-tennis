'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus, ShoppingCart, AlertCircle, CheckCircle2, TrendingUp, Zap, Target, Info } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';

// Blade data with ratings
export interface BladeData {
  id: string;
  name: string;
  brand: string;
  price: number;
  image: string;
  speed: number; // 1-10
  control: number; // 1-10
  stiffness: number; // 1-10
  weight: number; // grams
  composition: string;
  playStyle: string[];
}

// Rubber data with ratings
export interface RubberData {
  id: string;
  name: string;
  price: number;
  image: string;
  speed: number; // 1-10
  spin: number; // 1-10
  control: number; // 1-10
  hardness: string;
  type: string;
  playStyle: string[];
}

interface CustomizeRacketProps {
  blades: BladeData[];
  rubbers: RubberData[];
}

interface CombinedRating {
  speed: number;
  spin: number;
  control: number;
  totalPrice: number;
  recommendation: {
    level: 'excellent' | 'good' | 'fair' | 'needs-improvement';
    message: string;
    tips: string[];
  };
}

const CustomizeRacket: React.FC<CustomizeRacketProps> = ({ blades, rubbers }) => {
  const [selectedBlade, setSelectedBlade] = useState<BladeData | null>(null);
  const [selectedForehandRubber, setSelectedForehandRubber] = useState<RubberData | null>(null);
  const [selectedBackhandRubber, setSelectedBackhandRubber] = useState<RubberData | null>(null);
  const [showBladeSelector, setShowBladeSelector] = useState(false);
  const [showForehandSelector, setShowForehandSelector] = useState(false);
  const [showBackhandSelector, setShowBackhandSelector] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  
  const { addToCart } = useCart();

  // Calculate combined ratings
  const calculateCombination = (): CombinedRating | null => {
    if (!selectedBlade || !selectedForehandRubber || !selectedBackhandRubber) {
      return null;
    }

    // Calculate average ratings
    const speed = Math.round(
      (selectedBlade.speed * 0.4 + 
       selectedForehandRubber.speed * 0.35 + 
       selectedBackhandRubber.speed * 0.25)
    );
    
    const spin = Math.round(
      (selectedForehandRubber.spin * 0.6 + 
       selectedBackhandRubber.spin * 0.4)
    );
    
    const control = Math.round(
      (selectedBlade.control * 0.4 + 
       selectedForehandRubber.control * 0.3 + 
       selectedBackhandRubber.control * 0.3)
    );

    const totalPrice = selectedBlade.price + selectedForehandRubber.price + selectedBackhandRubber.price;

    // Generate recommendation
    const recommendation = generateRecommendation(speed, spin, control, selectedBlade, selectedForehandRubber, selectedBackhandRubber);

    return { speed, spin, control, totalPrice, recommendation };
  };

  const generateRecommendation = (
    speed: number, 
    spin: number, 
    control: number,
    blade: BladeData,
    forehand: RubberData,
    backhand: RubberData
  ): CombinedRating['recommendation'] => {
    const overallRating = (speed + spin + control) / 3;
    const balance = Math.max(speed, spin, control) - Math.min(speed, spin, control);
    
    let level: 'excellent' | 'good' | 'fair' | 'needs-improvement';
    let message: string;
    let tips: string[] = [];

    // Check for excellent combinations
    if (overallRating >= 8 && balance <= 2) {
      level = 'excellent';
      message = '🎉 Excellent Choice! This is a professional-level combination with great balance.';
      tips = [
        'This setup is tournament-ready',
        'Perfect balance between attack and control',
        'Suitable for competitive play'
      ];
    } else if (overallRating >= 7 && balance <= 3) {
      level = 'good';
      message = '👍 Good Combination! This setup will work well for your game.';
      
      if (speed > 8) {
        tips.push('Very fast setup - requires good technique');
      }
      if (spin > 8) {
        tips.push('Excellent spin generation capability');
      }
      if (control < 6) {
        tips.push('Consider practicing control drills');
      } else {
        tips.push('Good control for consistent play');
      }
    } else if (overallRating >= 6 || balance <= 4) {
      level = 'fair';
      message = '⚠️ This combination can work, but consider these suggestions:';
      
      if (balance > 3) {
        tips.push('The ratings are unbalanced - consider a more balanced setup');
      }
      if (speed > 8 && control < 6) {
        tips.push('High speed with low control - might be difficult to use');
      }
      if (control < 5) {
        tips.push('Low overall control - consider softer rubbers');
      }
      if (spin < 6) {
        tips.push('Limited spin generation - consider tackier rubbers');
      }
    } else {
      level = 'needs-improvement';
      message = '💡 This combination needs improvement. Here are better options:';
      
      if (speed < 5 && blade.speed < 6) {
        tips.push('Too slow overall - consider a faster blade or rubbers');
      }
      if (control < 5) {
        tips.push('Very low control - try softer rubbers like Butterfly Rozena');
      }
      if (balance > 4) {
        tips.push('Highly unbalanced setup - choose components with similar characteristics');
      }
      tips.push('Consider consulting our coaches for personalized recommendations');
    }

    // Play style compatibility check
    const bladeStyles = blade.playStyle;
    const forehandStyles = forehand.playStyle;
    const backhandStyles = backhand.playStyle;
    
    const commonStyles = bladeStyles.filter(style => 
      forehandStyles.includes(style) && backhandStyles.includes(style)
    );

    if (commonStyles.length === 0) {
      tips.push('⚠️ Components have different play styles - may feel inconsistent');
    } else if (commonStyles.length >= 2) {
      tips.push(`✓ Perfect match for ${commonStyles[0]} play style`);
    }

    return { level, message, tips };
  };

  const combinedRating = calculateCombination();

  const handleAddCombinationToCart = () => {
    if (selectedBlade && selectedForehandRubber && selectedBackhandRubber) {
      const customizationId = `custom-${Date.now()}`;
      
      // Add blade
      addToCart({
        id: selectedBlade.id + '-' + customizationId,
        name: selectedBlade.name,
        category: 'Blade',
        price: selectedBlade.price,
        originalPrice: selectedBlade.price,
        image: selectedBlade.image,
        isCustomized: true,
        customizationNote: '🎯 Assembled racket - blade and rubbers will be pasted together',
      });

      // Add forehand rubber
      addToCart({
        id: selectedForehandRubber.id + '-forehand-' + customizationId,
        name: `${selectedForehandRubber.name} (Forehand)`,
        category: 'Rubber',
        price: selectedForehandRubber.price,
        originalPrice: selectedForehandRubber.price,
        image: selectedForehandRubber.image,
        isCustomized: true,
        customizationNote: '🎯 Assembled racket - blade and rubbers will be pasted together',
      });

      // Add backhand rubber
      addToCart({
        id: selectedBackhandRubber.id + '-backhand-' + customizationId,
        name: `${selectedBackhandRubber.name} (Backhand)`,
        category: 'Rubber',
        price: selectedBackhandRubber.price,
        originalPrice: selectedBackhandRubber.price,
        image: selectedBackhandRubber.image,
        isCustomized: true,
        customizationNote: '🎯 Assembled racket - blade and rubbers will be pasted together',
      });

      // Show success message
      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 4000);
    }
  };

  const RatingBar = ({ label, value, color = 'bg-primary' }: { label: string; value: number; color?: string }) => (
    <div className="space-y-1 md:space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-xs md:text-sm font-medium text-gray-700">{label}</span>
        <span className="text-base md:text-lg font-bold text-gray-900">{value}/10</span>
      </div>
      <div className="h-2 md:h-3 bg-gray-200 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${(value / 10) * 100}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className={`h-full ${color} rounded-full`}
        />
      </div>
    </div>
  );

  const RecommendationBadge = ({ level }: { level: CombinedRating['recommendation']['level'] }) => {
    const badges = {
      'excellent': { icon: CheckCircle2, text: 'Excellent', color: 'bg-green-100 text-green-800 border-green-300' },
      'good': { icon: TrendingUp, text: 'Good Choice', color: 'bg-blue-100 text-blue-800 border-blue-300' },
      'fair': { icon: Info, text: 'Fair', color: 'bg-yellow-100 text-yellow-800 border-yellow-300' },
      'needs-improvement': { icon: AlertCircle, text: 'Needs Improvement', color: 'bg-orange-100 text-orange-800 border-orange-300' },
    };

    const Badge = badges[level];
    const Icon = Badge.icon;

    return (
      <div className={`inline-flex items-center gap-1.5 md:gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-full border-2 ${Badge.color} font-semibold text-xs md:text-sm`}>
        <Icon className="w-4 h-4 md:w-5 md:h-5" />
        <span className="whitespace-nowrap">{Badge.text}</span>
      </div>
    );
  };

  return (
    <section className="py-8 md:py-12 lg:py-20 bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Success Message */}
        <AnimatePresence>
          {showSuccessMessage && (
            <motion.div
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              className="fixed top-24 right-6 z-50 bg-green-500 text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 max-w-md"
            >
              <CheckCircle2 className="w-6 h-6 flex-shrink-0" />
              <div>
                <p className="font-bold text-lg">Added to Cart! 🎉</p>
                <p className="text-sm text-green-100">Your customized racket will be assembled and ready to play!</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-6 md:mb-12"
        >
          <h2 className="font-display font-bold text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-black mb-3 md:mb-4">
            🎯 Customize Your Racket
          </h2>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto px-2">
            Build your perfect racket by selecting a blade and rubbers. Get instant feedback on your combination!
          </p>
        </motion.div>

        {/* Selection Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-12">
          {/* Blade Selection */}
          <div className="bg-white rounded-xl md:rounded-2xl p-4 md:p-6 border-2 border-gray-200 hover:border-primary transition-colors">
            <h3 className="font-display font-bold text-base md:text-xl mb-3 md:mb-4 flex items-center gap-2">
              <span className="bg-primary text-white w-6 h-6 md:w-8 md:h-8 rounded-full flex items-center justify-center text-xs md:text-sm">1</span>
              <span className="text-sm md:text-base">Select Blade</span>
            </h3>
            
            {selectedBlade ? (
              <div className="space-y-3 md:space-y-4">
                <img src={selectedBlade.image} alt={selectedBlade.name} className="w-full h-40 md:h-48 object-cover rounded-lg" />
                <h4 className="font-bold text-sm md:text-lg line-clamp-2">{selectedBlade.name}</h4>
                <p className="text-xs md:text-sm text-gray-600">{selectedBlade.brand} • {selectedBlade.composition}</p>
                <p className="text-xl md:text-2xl font-bold text-primary">₹{selectedBlade.price.toLocaleString('en-IN')}</p>
                <button
                  onClick={() => setShowBladeSelector(!showBladeSelector)}
                  className="w-full py-2 md:py-2.5 px-3 md:px-4 border-2 border-primary text-primary rounded-lg text-sm md:text-base font-medium hover:bg-primary hover:text-white transition-colors active:scale-95"
                >
                  Change Blade
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowBladeSelector(!showBladeSelector)}
                className="w-full h-48 md:h-64 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center gap-2 md:gap-3 hover:border-primary hover:bg-primary/5 transition-colors active:scale-95"
              >
                <Plus className="w-10 h-10 md:w-12 md:h-12 text-gray-400" />
                <span className="text-gray-600 font-medium text-sm md:text-base px-4">Click to select blade</span>
              </button>
            )}
          </div>

          {/* Forehand Rubber Selection */}
          <div className="bg-white rounded-xl md:rounded-2xl p-4 md:p-6 border-2 border-gray-200 hover:border-primary transition-colors">
            <h3 className="font-display font-bold text-base md:text-xl mb-3 md:mb-4 flex items-center gap-2">
              <span className="bg-primary text-white w-6 h-6 md:w-8 md:h-8 rounded-full flex items-center justify-center text-xs md:text-sm">2</span>
              <span className="text-sm md:text-base">Forehand Rubber</span>
            </h3>
            
            {selectedForehandRubber ? (
              <div className="space-y-3 md:space-y-4">
                <img src={selectedForehandRubber.image} alt={selectedForehandRubber.name} className="w-full h-40 md:h-48 object-cover rounded-lg" />
                <h4 className="font-bold text-sm md:text-lg line-clamp-2">{selectedForehandRubber.name}</h4>
                <p className="text-xs md:text-sm text-gray-600">{selectedForehandRubber.type} • {selectedForehandRubber.hardness}</p>
                <p className="text-xl md:text-2xl font-bold text-primary">₹{selectedForehandRubber.price.toLocaleString('en-IN')}</p>
                <button
                  onClick={() => setShowForehandSelector(!showForehandSelector)}
                  className="w-full py-2 md:py-2.5 px-3 md:px-4 border-2 border-primary text-primary rounded-lg text-sm md:text-base font-medium hover:bg-primary hover:text-white transition-colors active:scale-95"
                >
                  Change Rubber
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowForehandSelector(!showForehandSelector)}
                className="w-full h-48 md:h-64 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center gap-2 md:gap-3 hover:border-primary hover:bg-primary/5 transition-colors active:scale-95"
                disabled={!selectedBlade}
              >
                <Plus className="w-10 h-10 md:w-12 md:h-12 text-gray-400" />
                <span className="text-gray-600 font-medium text-sm md:text-base px-4 text-center">
                  {selectedBlade ? 'Click to select rubber' : 'Select blade first'}
                </span>
              </button>
            )}
          </div>

          {/* Backhand Rubber Selection */}
          <div className="bg-white rounded-xl md:rounded-2xl p-4 md:p-6 border-2 border-gray-200 hover:border-primary transition-colors">
            <h3 className="font-display font-bold text-base md:text-xl mb-3 md:mb-4 flex items-center gap-2">
              <span className="bg-primary text-white w-6 h-6 md:w-8 md:h-8 rounded-full flex items-center justify-center text-xs md:text-sm">3</span>
              <span className="text-sm md:text-base">Backhand Rubber</span>
            </h3>
            
            {selectedBackhandRubber ? (
              <div className="space-y-3 md:space-y-4">
                <img src={selectedBackhandRubber.image} alt={selectedBackhandRubber.name} className="w-full h-40 md:h-48 object-cover rounded-lg" />
                <h4 className="font-bold text-sm md:text-lg line-clamp-2">{selectedBackhandRubber.name}</h4>
                <p className="text-xs md:text-sm text-gray-600">{selectedBackhandRubber.type} • {selectedBackhandRubber.hardness}</p>
                <p className="text-xl md:text-2xl font-bold text-primary">₹{selectedBackhandRubber.price.toLocaleString('en-IN')}</p>
                <button
                  onClick={() => setShowBackhandSelector(!showBackhandSelector)}
                  className="w-full py-2 md:py-2.5 px-3 md:px-4 border-2 border-primary text-primary rounded-lg text-sm md:text-base font-medium hover:bg-primary hover:text-white transition-colors active:scale-95"
                >
                  Change Rubber
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowBackhandSelector(!showBackhandSelector)}
                className="w-full h-48 md:h-64 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center gap-2 md:gap-3 hover:border-primary hover:bg-primary/5 transition-colors active:scale-95"
                disabled={!selectedBlade}
              >
                <Plus className="w-10 h-10 md:w-12 md:h-12 text-gray-400" />
                <span className="text-gray-600 font-medium text-sm md:text-base px-4 text-center">
                  {selectedBlade ? 'Click to select rubber' : 'Select blade first'}
                </span>
              </button>
            )}
          </div>
        </div>

        {/* Blade Selector Modal */}
        {showBladeSelector && (
          <>
            {/* Backdrop overlay for mobile */}
            <div 
              className="fixed inset-0 bg-black/50 z-40 md:hidden"
              onClick={() => setShowBladeSelector(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="fixed md:relative bottom-0 md:bottom-auto left-0 right-0 md:mb-8 bg-white rounded-t-2xl md:rounded-2xl p-4 md:p-6 border-2 border-primary z-50 md:z-auto max-h-[85vh] md:max-h-none flex flex-col"
            >
              <div className="flex justify-between items-center mb-3 md:mb-4 flex-shrink-0">
                <h3 className="font-bold text-base md:text-xl">Select a Blade</h3>
                <button onClick={() => setShowBladeSelector(false)} className="text-gray-500 hover:text-gray-700 p-1 active:scale-95">
                  <Minus className="w-5 h-5 md:w-6 md:h-6" />
                </button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4 overflow-y-auto flex-1">
              {blades.map((blade) => (
                <button
                  key={blade.id}
                  onClick={() => {
                    setSelectedBlade(blade);
                    setShowBladeSelector(false);
                  }}
                  className="text-left bg-gray-50 rounded-lg p-3 md:p-4 hover:bg-primary/10 border-2 border-transparent hover:border-primary transition-all active:scale-95"
                >
                  <img src={blade.image} alt={blade.name} className="w-full h-24 md:h-32 object-cover rounded mb-2" />
                  <h4 className="font-bold text-xs md:text-sm mb-1 line-clamp-2">{blade.name}</h4>
                  <p className="text-[10px] md:text-xs text-gray-600 mb-1 md:mb-2 line-clamp-1">{blade.brand}</p>
                  <p className="text-sm md:text-lg font-bold text-primary">₹{blade.price.toLocaleString('en-IN')}</p>
                </button>
              ))}
            </div>
          </motion.div>
          </>
        )}

        {/* Forehand Rubber Selector Modal */}
        {showForehandSelector && (
          <>
            {/* Backdrop overlay for mobile */}
            <div 
              className="fixed inset-0 bg-black/50 z-40 md:hidden"
              onClick={() => setShowForehandSelector(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="fixed md:relative bottom-0 md:bottom-auto left-0 right-0 md:mb-8 bg-white rounded-t-2xl md:rounded-2xl p-4 md:p-6 border-2 border-primary z-50 md:z-auto max-h-[85vh] md:max-h-none flex flex-col"
            >
              <div className="flex justify-between items-center mb-3 md:mb-4 flex-shrink-0">
                <h3 className="font-bold text-base md:text-xl">Select Forehand Rubber</h3>
                <button onClick={() => setShowForehandSelector(false)} className="text-gray-500 hover:text-gray-700 p-1 active:scale-95">
                  <Minus className="w-5 h-5 md:w-6 md:h-6" />
                </button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4 overflow-y-auto flex-1">
              {rubbers.map((rubber) => (
                <button
                  key={rubber.id}
                  onClick={() => {
                    setSelectedForehandRubber(rubber);
                    setShowForehandSelector(false);
                  }}
                  className="text-left bg-gray-50 rounded-lg p-3 md:p-4 hover:bg-primary/10 border-2 border-transparent hover:border-primary transition-all active:scale-95"
                >
                  <img src={rubber.image} alt={rubber.name} className="w-full h-24 md:h-32 object-cover rounded mb-2" />
                  <h4 className="font-bold text-xs md:text-sm mb-1 line-clamp-2">{rubber.name}</h4>
                  <p className="text-[10px] md:text-xs text-gray-600 mb-1 md:mb-2 line-clamp-1">{rubber.type}</p>
                  <p className="text-sm md:text-lg font-bold text-primary">₹{rubber.price.toLocaleString('en-IN')}</p>
                </button>
              ))}
            </div>
          </motion.div>
          </>
        )}

        {/* Backhand Rubber Selector Modal */}
        {showBackhandSelector && (
          <>
            {/* Backdrop overlay for mobile */}
            <div 
              className="fixed inset-0 bg-black/50 z-40 md:hidden"
              onClick={() => setShowBackhandSelector(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="fixed md:relative bottom-0 md:bottom-auto left-0 right-0 md:mb-8 bg-white rounded-t-2xl md:rounded-2xl p-4 md:p-6 border-2 border-primary z-50 md:z-auto max-h-[85vh] md:max-h-none flex flex-col"
            >
              <div className="flex justify-between items-center mb-3 md:mb-4 flex-shrink-0">
                <h3 className="font-bold text-base md:text-xl">Select Backhand Rubber</h3>
                <button onClick={() => setShowBackhandSelector(false)} className="text-gray-500 hover:text-gray-700 p-1 active:scale-95">
                  <Minus className="w-5 h-5 md:w-6 md:h-6" />
                </button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4 overflow-y-auto flex-1">
              {rubbers.map((rubber) => (
                <button
                  key={rubber.id}
                  onClick={() => {
                    setSelectedBackhandRubber(rubber);
                    setShowBackhandSelector(false);
                  }}
                  className="text-left bg-gray-50 rounded-lg p-3 md:p-4 hover:bg-primary/10 border-2 border-transparent hover:border-primary transition-all active:scale-95"
                >
                  <img src={rubber.image} alt={rubber.name} className="w-full h-24 md:h-32 object-cover rounded mb-2" />
                  <h4 className="font-bold text-xs md:text-sm mb-1 line-clamp-2">{rubber.name}</h4>
                  <p className="text-[10px] md:text-xs text-gray-600 mb-1 md:mb-2 line-clamp-1">{rubber.type}</p>
                  <p className="text-sm md:text-lg font-bold text-primary">₹{rubber.price.toLocaleString('en-IN')}</p>
                </button>
              ))}
            </div>
          </motion.div>
          </>
        )}

        {/* Combined Rating Display */}
        {combinedRating && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl md:rounded-2xl p-4 md:p-6 lg:p-8 border-2 border-primary shadow-xl"
          >
            <div className="text-center mb-6 md:mb-8">
              <h3 className="font-display font-bold text-xl md:text-2xl lg:text-3xl mb-3 md:mb-4">Your Custom Racket</h3>
              <RecommendationBadge level={combinedRating.recommendation.level} />
            </div>

            {/* Ratings Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 lg:gap-8 mb-6 md:mb-8">
              <div className="space-y-2">
                <div className="flex items-center gap-1.5 md:gap-2 mb-2 md:mb-4">
                  <Zap className="w-5 h-5 md:w-6 md:h-6 text-primary" />
                  <span className="font-bold text-sm md:text-base lg:text-lg">Speed</span>
                </div>
                <RatingBar label="Overall Speed" value={combinedRating.speed} color="bg-red-500" />
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-1.5 md:gap-2 mb-2 md:mb-4">
                  <TrendingUp className="w-5 h-5 md:w-6 md:h-6 text-primary" />
                  <span className="font-bold text-sm md:text-base lg:text-lg">Spin</span>
                </div>
                <RatingBar label="Spin Generation" value={combinedRating.spin} color="bg-blue-500" />
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-1.5 md:gap-2 mb-2 md:mb-4">
                  <Target className="w-5 h-5 md:w-6 md:h-6 text-primary" />
                  <span className="font-bold text-sm md:text-base lg:text-lg">Control</span>
                </div>
                <RatingBar label="Ball Control" value={combinedRating.control} color="bg-green-500" />
              </div>
            </div>

            {/* Recommendation */}
            <div className="bg-gray-50 rounded-lg md:rounded-xl p-4 md:p-6 mb-4 md:mb-6">
              <p className="text-sm md:text-base lg:text-lg font-semibold mb-3 md:mb-4">{combinedRating.recommendation.message}</p>
              <ul className="space-y-2">
                {combinedRating.recommendation.tips.map((tip, index) => (
                  <li key={index} className="flex items-start gap-2 text-xs md:text-sm lg:text-base text-gray-700">
                    <span className="text-primary mt-1 flex-shrink-0">•</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Price and Add to Cart */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-4 md:pt-6 border-t-2">
              <div className="text-center md:text-left">
                <p className="text-sm md:text-base text-gray-600 mb-1">Total Price</p>
                <p className="text-2xl md:text-3xl lg:text-4xl font-bold text-primary">
                  ₹{combinedRating.totalPrice.toLocaleString('en-IN')}
                </p>
              </div>
              <button
                onClick={handleAddCombinationToCart}
                className="elegant-button w-full md:w-auto px-6 md:px-8 py-3 md:py-4 text-sm md:text-base lg:text-lg inline-flex items-center justify-center gap-2 md:gap-3 active:scale-95"
              >
                <ShoppingCart className="w-5 h-5 md:w-6 md:h-6" />
                <span className="whitespace-nowrap">Add Complete Set to Cart</span>
              </button>
            </div>
          </motion.div>
        )}

        {/* Help Text */}
        {!combinedRating && (
          <div className="text-center text-gray-600 bg-blue-50 rounded-lg md:rounded-xl p-6 md:p-8 border-2 border-blue-200">
            <Info className="w-10 h-10 md:w-12 md:h-12 text-blue-500 mx-auto mb-3 md:mb-4" />
            <p className="text-sm md:text-base lg:text-lg font-medium mb-2">Select all three components to see your racket's performance</p>
            <p className="text-xs md:text-sm">Choose a blade and two rubbers to get personalized recommendations</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default CustomizeRacket;
