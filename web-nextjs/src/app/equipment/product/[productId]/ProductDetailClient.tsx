'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Star, ShoppingCart, Package, Zap, MapPin, TrendingUp, ArrowLeft, Plus, Minus, CheckCircle } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';

interface ProductDetailClientProps {
  product: any;
  allProducts: any[];
}

export default function ProductDetailClient({ product, allProducts }: ProductDetailClientProps) {
  const router = useRouter();
  const { addToCart, updateQuantity, items } = useCart();
  const [showAddedMessage, setShowAddedMessage] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState(product);
  const [selectedColorIndex, setSelectedColorIndex] = useState(0);
  const [selectedRubberColor, setSelectedRubberColor] = useState<'red' | 'black' | null>(null);
  const [selectedShoeSize, setSelectedShoeSize] = useState<number | null>(null);

  // Check if product has colorVariants array (new format)
  const hasColorVariants = product.colorVariants && product.colorVariants.length > 0;
  
  // Check if this is a rubber product
  const isRubber = product.category === 'Rubber';
  
  // Check if this is a shoe product (and not coming soon)
  const isShoe = product.category === 'Shoes' && product.brand === 'Xiom';
  
  // Available shoe sizes (Indian sizes)
  const shoeSizes = [6, 7, 8, 9, 10, 11];
  const unavailableSizes = [6, 11];

  // Find color variants based on product name pattern (old format)
  const getColorVariants = () => {
    if (!product.name) return [];
    
    // Extract base name without color
    const baseName = product.name
      .replace(/- (Pink|Navy Blue|Navy|Blue|Light Blue|Grey|Purple|Dark Blue|White|Magenta|Orange|Red|Black)/gi, '')
      .trim();
    
    // Find all products with the same base name
    const variants = allProducts.filter(p => {
      const pBaseName = p.name
        .replace(/- (Pink|Navy Blue|Navy|Blue|Light Blue|Grey|Purple|Dark Blue|White|Magenta|Orange|Red|Black)/gi, '')
        .trim();
      return pBaseName === baseName && p.category === product.category;
    });
    
    return variants.length > 1 ? variants : [];
  };

  const colorVariants = getColorVariants();

  let cartItemId = selectedVariant.id;
  if (isRubber && selectedRubberColor) {
    cartItemId = `${selectedVariant.id}-${selectedRubberColor}`;
  } else if (isShoe && selectedShoeSize) {
    cartItemId = `${selectedVariant.id}-size${selectedShoeSize}`;
  }
  
  const cartItem = items.find(item => item.id === cartItemId);
  const quantity = cartItem?.quantity || 0;

  const handleAddToCart = () => {
    if (isRubber && !selectedRubberColor) return; // Prevent adding rubbers without color selection
    if (isShoe && !selectedShoeSize) return; // Prevent adding shoes without size selection
    
    let itemId = selectedVariant.id;
    let itemName = selectedVariant.name;
    
    if (isRubber && selectedRubberColor) {
      itemId = `${selectedVariant.id}-${selectedRubberColor}`;
      itemName = `${selectedVariant.name} (${selectedRubberColor.toUpperCase()})`;
    } else if (isShoe && selectedShoeSize) {
      itemId = `${selectedVariant.id}-size${selectedShoeSize}`;
      itemName = `${selectedVariant.name} (Size ${selectedShoeSize})`;
    }
    
    addToCart({
      id: itemId,
      name: itemName,
      category: selectedVariant.category,
      price: selectedVariant.price,
      originalPrice: selectedVariant.originalPrice,
      image: selectedVariant.image,
      rubberColor: isRubber && selectedRubberColor ? selectedRubberColor : undefined,
      shoeSize: isShoe && selectedShoeSize ? selectedShoeSize : undefined,
    });
    setShowAddedMessage(true);
    setTimeout(() => setShowAddedMessage(false), 3000);
  };

  const handleIncrement = () => {
    if (isRubber && !selectedRubberColor) return; // Prevent adding rubbers without color selection
    if (isShoe && !selectedShoeSize) return; // Prevent adding shoes without size selection
    
    if (cartItem) {
      updateQuantity(cartItemId, quantity + 1);
    } else {
      handleAddToCart();
    }
  };

  const handleDecrement = () => {
    if (quantity > 0) {
      updateQuantity(cartItemId, quantity - 1);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 py-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="mb-8 inline-flex items-center gap-2 text-gray-600 hover:text-primary transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Equipment</span>
        </button>

        {/* Added to Cart Message */}
        {showAddedMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="fixed top-24 right-6 bg-green-500 text-white px-6 py-4 rounded-lg shadow-lg z-50 flex items-center gap-2"
          >
            <CheckCircle className="w-5 h-5" />
            <span>Added to cart!</span>
          </motion.div>
        )}

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Product Image */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-3xl p-8 shadow-lg border-2 border-gray-100"
          >
            <img
              src={hasColorVariants ? product.colorVariants[selectedColorIndex].image : selectedVariant.image}
              alt={hasColorVariants ? `${product.name} - ${product.colorVariants[selectedColorIndex].color}` : selectedVariant.name}
              className="w-full h-auto object-contain rounded-2xl mb-6"
            />
            
            {/* Variant Image Gallery - New format with colorVariants */}
            {hasColorVariants && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {product.colorVariants.map((colorVariant: any, index: number) => (
                  <button
                    key={index}
                    onClick={() => setSelectedColorIndex(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg border-2 overflow-hidden transition-all ${
                      selectedColorIndex === index
                        ? 'border-primary shadow-md'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <img
                      src={colorVariant.image}
                      alt={`${product.name} - ${colorVariant.color}`}
                      className="w-full h-full object-contain"
                    />
                  </button>
                ))}
              </div>
            )}
            
            {/* Variant Image Gallery - Old format with separate products */}
            {!hasColorVariants && colorVariants.length > 0 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {colorVariants.map((variant) => (
                  <button
                    key={variant.id}
                    onClick={() => setSelectedVariant(variant)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg border-2 overflow-hidden transition-all ${
                      selectedVariant.id === variant.id
                        ? 'border-primary shadow-md'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <img
                      src={variant.image}
                      alt={variant.name}
                      className="w-full h-full object-contain"
                    />
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          {/* Product Details */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="inline-block bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4">
              {product.category}
            </div>

            <h1 className="font-display font-bold text-4xl lg:text-5xl text-black mb-4">
              {selectedVariant.name}
            </h1>

            {/* Color Selector - New format with colorVariants */}
            {hasColorVariants && (
              <div className="mb-6">
                <p className="text-sm font-medium text-gray-700 mb-3">Available Colors:</p>
                <div className="flex flex-wrap gap-2">
                  {product.colorVariants.map((colorVariant: any, index: number) => {
                    const isSelected = selectedColorIndex === index;
                    
                    return (
                      <button
                        key={index}
                        onClick={() => setSelectedColorIndex(index)}
                        className={`px-4 py-2 rounded-lg border-2 transition-all ${
                          isSelected
                            ? 'border-primary bg-primary text-white shadow-md'
                            : 'border-gray-300 bg-white text-gray-700 hover:border-primary/50'
                        }`}
                      >
                        {colorVariant.color}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Color Selector - Old format with separate products */}
            {!hasColorVariants && colorVariants.length > 0 && (
              <div className="mb-6">
                <p className="text-sm font-medium text-gray-700 mb-3">Available Colors:</p>
                <div className="flex flex-wrap gap-2">
                  {colorVariants.map((variant) => {
                    const colorMatch = variant.name.match(/- (Pink|Navy Blue|Navy|Blue|Light Blue|Grey|Purple|Dark Blue|White|Magenta|Orange|Red|Black)/i);
                    const colorName = colorMatch ? colorMatch[1] : 'Default';
                    const isSelected = selectedVariant.id === variant.id;
                    
                    return (
                      <button
                        key={variant.id}
                        onClick={() => setSelectedVariant(variant)}
                        className={`px-4 py-2 rounded-lg border-2 transition-all ${
                          isSelected
                            ? 'border-primary bg-primary text-white shadow-md'
                            : 'border-gray-300 bg-white text-gray-700 hover:border-primary/50'
                        }`}
                      >
                        {colorName}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Rating */}
            <div className="flex items-center gap-4 mb-6">
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
              <span className="text-gray-600">
                {product.rating} ({product.reviews} reviews)
              </span>
            </div>

            <p className="text-gray-600 text-lg mb-8 leading-relaxed">
              {product.description}
            </p>

            {/* Rubber Color Selection */}
            {isRubber && (
              <div className="mb-8">
                <p className="text-sm font-medium text-gray-700 mb-3">
                  Select Rubber Color: <span className="text-red-500">*</span>
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setSelectedRubberColor('red')}
                    className={`flex items-center gap-2 px-4 py-3 rounded-lg border-2 transition-all ${
                      selectedRubberColor === 'red'
                        ? 'border-primary ring-2 ring-primary ring-offset-2 bg-primary/5'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <div
                      className="w-6 h-6 rounded-full"
                      style={{ backgroundColor: '#DC2626' }}
                    />
                    <span className="font-medium">Red</span>
                  </button>
                  <button
                    onClick={() => setSelectedRubberColor('black')}
                    className={`flex items-center gap-2 px-4 py-3 rounded-lg border-2 transition-all ${
                      selectedRubberColor === 'black'
                        ? 'border-primary ring-2 ring-primary ring-offset-2 bg-primary/5'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <div
                      className="w-6 h-6 rounded-full border border-gray-300"
                      style={{ backgroundColor: '#1F2937' }}
                    />
                    <span className="font-medium">Black</span>
                  </button>
                </div>
                {!selectedRubberColor && (
                  <p className="text-sm text-red-500 mt-2">Please select a rubber color to add to cart</p>
                )}
              </div>
            )}

            {/* Shoe Size Selection */}
            {isShoe && (
              <div className="mb-8">
                <p className="text-sm font-medium text-gray-700 mb-3">
                  Select Size (IND): <span className="text-red-500">*</span>
                </p>
                <div className="grid grid-cols-5 sm:grid-cols-9 gap-2">
                  {shoeSizes.map((size) => {
                    const isUnavailable = unavailableSizes.includes(size);
                    return (
                      <button
                        key={size}
                        onClick={() => !isUnavailable && setSelectedShoeSize(size)}
                        disabled={isUnavailable}
                        className={`px-3 py-2.5 rounded-lg border-2 transition-all font-medium ${
                          isUnavailable
                            ? 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed line-through'
                            : selectedShoeSize === size
                            ? 'border-primary bg-primary text-white ring-2 ring-primary ring-offset-2'
                            : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                        }`}
                      >
                        {size}
                      </button>
                    );
                  })}
                </div>
                {!selectedShoeSize && (
                  <p className="text-sm text-red-500 mt-2">Please select a shoe size to add to cart</p>
                )}
              </div>
            )}

            {/* Specifications */}
            <div className="bg-gray-50 rounded-2xl p-6 mb-8 space-y-4">
              <h3 className="font-bold text-xl mb-4">
                {product.category === 'Pre-Owned Racket' ? 'Condition Report' : 'Specifications'}
              </h3>
              
              {/* Pre-Owned Specific Fields */}
              {product.category === 'Pre-Owned Racket' && (
                <>
                  {product.condition && (
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-amber-600 mt-0.5" />
                      <div>
                        <span className="text-gray-500 text-sm">Overall Condition:</span>
                        <p className="font-medium text-amber-700">{product.condition}</p>
                      </div>
                    </div>
                  )}

                  {product.bladeCondition && (
                    <div className="flex items-start gap-3">
                      <Package className="w-5 h-5 text-primary" />
                      <div>
                        <span className="text-gray-500 text-sm">Blade Condition:</span>
                        <p className="font-medium">{product.bladeCondition}</p>
                      </div>
                    </div>
                  )}

                  {product.rubberCondition && (
                    <div className="flex items-start gap-3">
                      <Zap className="w-5 h-5 text-primary" />
                      <div>
                        <span className="text-gray-500 text-sm">Rubber Condition:</span>
                        <p className="font-medium">{product.rubberCondition}</p>
                      </div>
                    </div>
                  )}

                  {product.inspection && (
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <div>
                        <span className="text-gray-500 text-sm">Inspection:</span>
                        <p className="font-medium text-green-700">{product.inspection}</p>
                      </div>
                    </div>
                  )}

                  {product.quantity && (
                    <div className="flex items-start gap-3">
                      <Package className="w-5 h-5 text-orange-600" />
                      <div>
                        <span className="text-gray-500 text-sm">Availability:</span>
                        <p className="font-medium text-orange-700">{product.quantity}</p>
                      </div>
                    </div>
                  )}

                  {product.warranty && (
                    <div className="flex items-start gap-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                      <span className="text-amber-600 font-bold text-lg">⚠️</span>
                      <div>
                        <span className="text-gray-500 text-sm">Warranty Policy:</span>
                        <p className="font-bold text-amber-800">{product.warranty}</p>
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* Regular Product Fields */}
              {product.category !== 'Pre-Owned Racket' && (
                <>
                  {/* Accessory-specific fields */}
                  {product.category === 'Accessories' && (
                    <>
                      {product.capacity && (
                        <div className="flex items-center gap-3">
                          <Package className="w-5 h-5 text-primary" />
                          <div>
                            <span className="text-gray-500 text-sm">Capacity:</span>
                            <p className="font-medium">{product.capacity}</p>
                          </div>
                        </div>
                      )}

                      {product.features && (
                        <div className="flex items-start gap-3">
                          <CheckCircle className="w-5 h-5 text-primary mt-0.5" />
                          <div>
                            <span className="text-gray-500 text-sm">Features:</span>
                            <p className="font-medium">{product.features}</p>
                          </div>
                        </div>
                      )}

                      {product.material && (
                        <div className="flex items-center gap-3">
                          <Package className="w-5 h-5 text-primary" />
                          <div>
                            <span className="text-gray-500 text-sm">Material:</span>
                            <p className="font-medium">{product.material}</p>
                          </div>
                        </div>
                      )}
                    </>
                  )}

                  {product.composition && (
                    <div className="flex items-center gap-3">
                      <Package className="w-5 h-5 text-primary" />
                      <div>
                        <span className="text-gray-500 text-sm">Composition:</span>
                        <p className="font-medium">{product.composition}</p>
                      </div>
                    </div>
                  )}

                  {product.speed && (
                    <div className="flex items-center gap-3">
                      <Zap className="w-5 h-5 text-primary" />
                      <div>
                        <span className="text-gray-500 text-sm">Speed:</span>
                        <p className="font-medium">{product.speed}</p>
                      </div>
                    </div>
                  )}

                  {product.origin && (
                    <div className="flex items-center gap-3">
                      <MapPin className="w-5 h-5 text-primary" />
                      <div>
                        <span className="text-gray-500 text-sm">Origin:</span>
                        <p className="font-medium">{product.origin}</p>
                      </div>
                    </div>
                  )}

                  {product.type && (
                    <div className="flex items-center gap-3">
                      <Package className="w-5 h-5 text-primary" />
                      <div>
                        <span className="text-gray-500 text-sm">Type:</span>
                        <p className="font-medium">{product.type}</p>
                      </div>
                    </div>
                  )}

                  {product.hardness && (
                    <div className="flex items-center gap-3">
                      <Zap className="w-5 h-5 text-primary" />
                      <div>
                        <span className="text-gray-500 text-sm">Hardness:</span>
                        <p className="font-medium">{product.hardness}</p>
                      </div>
                    </div>
                  )}

                  {product.arc && (
                    <div className="flex items-center gap-3">
                      <TrendingUp className="w-5 h-5 text-primary" />
                      <div>
                        <span className="text-gray-500 text-sm">Arc:</span>
                        <p className="font-medium">{product.arc}</p>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Pricing */}
            <div className="flex items-center gap-6 mb-8">
              <span className="font-display font-bold text-5xl text-primary">
                ₹{selectedVariant.price.toLocaleString('en-IN')}
              </span>
              <div>
                <span className="text-gray-400 line-through text-2xl block">
                  ₹{selectedVariant.originalPrice.toLocaleString('en-IN')}
                </span>
                <span className="text-green-600 font-bold text-sm">
                  Save {Math.round(((selectedVariant.originalPrice - selectedVariant.price) / selectedVariant.originalPrice) * 100)}%
                </span>
              </div>
            </div>

            {/* Add to Cart */}
            <div className="flex gap-4 mb-8">
              {quantity === 0 ? (
                <button
                  onClick={handleAddToCart}
                  disabled={(isRubber && !selectedRubberColor) || (isShoe && !selectedShoeSize)}
                  className={`elegant-button flex-1 py-4 text-lg inline-flex items-center justify-center gap-3 ${
                    (isRubber && !selectedRubberColor) || (isShoe && !selectedShoeSize) ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                  title={
                    isRubber && !selectedRubberColor 
                      ? 'Please select a rubber color first' 
                      : isShoe && !selectedShoeSize 
                      ? 'Please select a shoe size first' 
                      : ''
                  }
                >
                  <ShoppingCart className="w-6 h-6" />
                  <span>Add to Cart</span>
                </button>
              ) : (
                <div className="flex items-center gap-4 border-2 border-primary rounded-lg px-6 py-4 flex-1 bg-white">
                  <button
                    onClick={handleDecrement}
                    className="text-primary hover:bg-primary/10 rounded p-2 transition-colors"
                  >
                    <Minus className="w-6 h-6" />
                  </button>
                  <span className="font-bold text-2xl px-6 text-foreground">
                    {quantity}
                  </span>
                  <button
                    onClick={handleIncrement}
                    disabled={(isRubber && !selectedRubberColor) || (isShoe && !selectedShoeSize)}
                    className={`text-primary hover:bg-primary/10 rounded p-2 transition-colors ${
                      (isRubber && !selectedRubberColor) || (isShoe && !selectedShoeSize) ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    <Plus className="w-6 h-6" />
                  </button>
                </div>
              )}
            </div>

            {/* Delivery Info */}
            <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-6">
              <h4 className="font-bold text-lg mb-3">🚚 Fast Delivery Across India</h4>
              <ul className="space-y-2 text-gray-700">
                <li>✓ Standard Delivery: 3-7 business days (FREE)</li>
                <li>✓ Instant Delivery: 3 hours</li>
                <li>✓ Cash on Delivery available</li>
              </ul>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
