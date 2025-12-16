import type { Metadata } from 'next';
import { blades, rubbers } from '@/data/equipmentData';
import { enhanceBladeData, enhanceRubberData } from '@/lib/equipmentHelpers';
import HomeClient from './HomeClient';

export const metadata: Metadata = {
  title: 'All About Table Tennis - Premium Table Tennis Equipment & Accessories',
  description: 'Buy authentic table tennis equipment in India. Premium Butterfly Viscaria, Timo Boll, Tenergy rubbers. Stiga Carbonado, DHS Hurricane. Genuine products with warranty.',
  keywords: 'table tennis india, butterfly equipment, stiga blades, table tennis equipment, tt gear, table tennis shop',
  openGraph: {
    title: 'All About Table Tennis - Premium Table Tennis Equipment',
    description: 'Premium table tennis equipment and accessories',
    url: 'https://allabouttabletennis.in',
    siteName: 'All About Table Tennis',
    locale: 'en_IN',
    type: 'website',
  },
};

export default function Home() {
  const enhancedBlades = blades.map(enhanceBladeData);
  const enhancedRubbers = rubbers.map(enhanceRubberData);

  return (
    <HomeClient 
      blades={blades} 
      rubbers={rubbers}
      enhancedBlades={enhancedBlades}
      enhancedRubbers={enhancedRubbers}
    />
  );
}
