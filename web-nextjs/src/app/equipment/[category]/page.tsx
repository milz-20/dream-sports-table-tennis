import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { blades, rubbers, shoes, preOwnedRackets } from '@/data/equipmentData';
import { enhanceBladeData, enhanceRubberData } from '@/lib/equipmentHelpers';
import EquipmentClient from '../EquipmentClient';
import { Metadata } from 'next';

const validCategories = ['blades', 'rubbers', 'shoes', 'balls', 'tables', 'accessories', 'preowned'];

type Props = {
  params: { category: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const category = params.category;
  
  const categoryTitles: Record<string, string> = {
    blades: 'Table Tennis Blades - Butterfly, Stiga, Yasaka, Donic',
    rubbers: 'Table Tennis Rubbers - Premium Tenergy, Hurricane, Rozena',
    shoes: 'Table Tennis Shoes - Professional Footwear',
    balls: 'Table Tennis Balls - Competition Grade',
    tables: 'Table Tennis Tables - Professional Quality',
    accessories: 'Table Tennis Accessories - Edge Tape, Cleaners, Grips',
    preowned: 'Pre-Owned Table Tennis Rackets - Quality Used Equipment'
  };

  const categoryDescriptions: Record<string, string> = {
    blades: 'Shop authentic table tennis blades from top brands. Butterfly Viscaria, Timo Boll, Stiga Carbonado. Premium blades for every playing style.',
    rubbers: 'Premium table tennis rubbers. Butterfly Tenergy, DHS Hurricane, Yasaka Rakza. High-performance rubbers for maximum spin and control.',
    shoes: 'Professional table tennis shoes designed for optimal performance. Lightweight, grippy, and comfortable footwear for serious players.',
    balls: 'Competition grade table tennis balls for training and tournaments. ITTF approved balls for the best playing experience.',
    tables: 'Professional quality table tennis tables. Durable, regulation-size tables for home and club use.',
    accessories: 'Essential table tennis accessories including edge tape, racket cleaners, and handle grips to maintain and enhance your equipment.',
    preowned: 'Quality inspected pre-owned table tennis rackets at great prices. Final sale, no returns. Affordable equipment for players on a budget.'
  };

  return {
    title: categoryTitles[category] || 'Table Tennis Equipment',
    description: categoryDescriptions[category] || 'Shop premium table tennis equipment in India.',
  };
}

export async function generateStaticParams() {
  return validCategories.map((category) => ({
    category: category,
  }));
}

export default function CategoryPage({ params }: Props) {
  const { category } = params;

  // Validate category
  if (!validCategories.includes(category)) {
    notFound();
  }

  // Server-side data preparation (runs during SSR)
  const enhancedBlades = blades.map(enhanceBladeData);
  const enhancedRubbers = rubbers.map(enhanceRubberData);

  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
    </div>}>
      <EquipmentClient 
        blades={blades} 
        rubbers={rubbers}
        shoes={shoes}
        preOwnedRackets={preOwnedRackets}
        enhancedBlades={enhancedBlades}
        enhancedRubbers={enhancedRubbers}
        initialCategory={category as any}
      />
    </Suspense>
  );
}
