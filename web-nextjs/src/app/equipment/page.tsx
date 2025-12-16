import { blades, rubbers } from '@/data/equipmentData';
import { enhanceBladeData, enhanceRubberData } from '@/lib/equipmentHelpers';
import EquipmentClient from './EquipmentClient';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Table Tennis Equipment - Butterfly, Stiga, DHS, Yasaka Blades & Rubbers',
  description: 'Buy authentic table tennis equipment in India. Premium Butterfly Viscaria, Timo Boll, Tenergy rubbers. Stiga Carbonado, DHS Hurricane. Genuine products with warranty. Cash on delivery available.',
};

export default function EquipmentPage() {
  // Server-side data preparation (runs during SSR)
  const enhancedBlades = blades.map(enhanceBladeData);
  const enhancedRubbers = rubbers.map(enhanceRubberData);

  return (
    <EquipmentClient 
      blades={blades} 
      rubbers={rubbers}
      enhancedBlades={enhancedBlades}
      enhancedRubbers={enhancedRubbers}
    />
  );
}
