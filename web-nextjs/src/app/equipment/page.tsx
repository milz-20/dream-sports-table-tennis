import { redirect } from 'next/navigation';
import { Suspense } from 'react';
import { blades, rubbers, shoes, balls, accessories, preOwnedRackets } from '@/data/equipmentData';
import { enhanceBladeData, enhanceRubberData } from '@/lib/equipmentHelpers';
import EquipmentClient from './EquipmentClient';

export default async function EquipmentPage() {
  // Use static data directly (no DynamoDB fetch)
  const bladesData = blades;
  const rubbersData = rubbers;
  const shoesData = shoes;
  
  // Server-side data preparation (runs during SSR)
  const enhancedBlades = bladesData.map(enhanceBladeData);
  const enhancedRubbers = rubbersData.map(enhanceRubberData);

  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
    </div>}>
      <EquipmentClient 
        blades={bladesData} 
        rubbers={rubbersData}
        shoes={shoesData}
        balls={balls}
        accessories={accessories}
        preOwnedRackets={preOwnedRackets}
        enhancedBlades={enhancedBlades}
        enhancedRubbers={enhancedRubbers}
      />
    </Suspense>
  );
}
