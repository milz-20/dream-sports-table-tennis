import { Suspense } from 'react';
import { blades, rubbers, shoes, preOwnedRackets } from '@/data/equipmentData';
import { enhanceBladeData, enhanceRubberData } from '@/lib/equipmentHelpers';
import EquipmentClient from './EquipmentClient';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Table Tennis Equipment - Butterfly, Stiga, DHS, Yasaka Blades & Rubbers',
  description: 'Buy authentic table tennis equipment in India. Premium Butterfly Viscaria, Timo Boll, Tenergy rubbers. Stiga Carbonado, DHS Hurricane. Genuine products with warranty. Cash on delivery available.',
};

// Helper to merge DynamoDB data with static data
function mergeProductData(dbProduct: any, staticProducts: any[]) {
  const staticProduct = staticProducts.find(p => p.id === dbProduct.id);
  
  if (staticProduct) {
    // Merge: use DB prices/stock, keep static images and other details
    return {
      ...staticProduct,
      price: dbProduct.price || staticProduct.price,
      originalPrice: dbProduct.originalPrice || staticProduct.originalPrice,
      stock: dbProduct.stock || 0,
      // Only override image if DB has one
      image: dbProduct.image && dbProduct.image !== '/assets/images/timoBoll.jpg' 
        ? dbProduct.image 
        : staticProduct.image,
    };
  }
  
  return dbProduct; // New product only in DB
}

async function fetchProductsFromDB() {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
    const response = await fetch(`${apiUrl}/api/products`, {
      cache: 'no-store', // Always fetch fresh data
    });
    
    if (!response.ok) {
      console.error('Failed to fetch products from DB');
      return null;
    }
    
    const data = await response.json();
    return data.success ? data.products : null;
  } catch (error) {
    console.error('Error fetching products:', error);
    return null;
  }
}

export default async function EquipmentPage() {
  // Fetch products from DynamoDB
  const dbProducts = await fetchProductsFromDB();
  
  // Use static data with DB prices merged in
  let bladesData = blades;
  let rubbersData = rubbers;
  let shoesData = shoes;
  
  if (dbProducts && dbProducts.length > 0) {
    console.log('DB Products sample:', JSON.stringify(dbProducts[0], null, 2));
    
    // Create a map of DB products by NAME (since IDs don't match)
    const dbProductMap = new Map();
    dbProducts.forEach((p: any) => {
      const normalizedName = p.name?.toLowerCase().trim();
      if (normalizedName) {
        dbProductMap.set(normalizedName, p);
      }
    });
    
    console.log('DB Product Map size:', dbProductMap.size);
    
    // Merge prices from DB into static blades
    bladesData = blades.map(blade => {
      const normalizedName = blade.name?.toLowerCase().trim();
      const dbProduct = dbProductMap.get(normalizedName);
      if (dbProduct) {
        console.log(`Matched blade: ${blade.name} -> DB price: ${dbProduct.price}`);
        return {
          ...blade,
          price: dbProduct.price || blade.price,
          originalPrice: dbProduct.originalPrice || blade.originalPrice,
          stock: dbProduct.stock || 0,
        };
      }
      return blade;
    });
    
    // Merge prices from DB into static rubbers
    rubbersData = rubbers.map(rubber => {
      const normalizedName = rubber.name?.toLowerCase().trim();
      const dbProduct = dbProductMap.get(normalizedName);
      if (dbProduct) {
        console.log(`Matched rubber: ${rubber.name} -> DB price: ${dbProduct.price}`);
        return {
          ...rubber,
          price: dbProduct.price || rubber.price,
          originalPrice: dbProduct.originalPrice || rubber.originalPrice,
          stock: dbProduct.stock || 0,
        };
      }
      return rubber;
    });
    
    // Merge prices from DB into static shoes
    shoesData = shoes.map(shoe => {
      const normalizedName = shoe.name?.toLowerCase().trim();
      const dbProduct = dbProductMap.get(normalizedName);
      if (dbProduct) {
        return {
          ...shoe,
          price: dbProduct.price || shoe.price,
          originalPrice: dbProduct.originalPrice || shoe.originalPrice,
          stock: dbProduct.stock || 0,
        };
      }
      return shoe;
    });
    
    console.log(`Merged DB prices - Blades: ${bladesData.length}, Rubbers: ${rubbersData.length}, Shoes: ${shoesData.length}`);
  } else {
    console.log('Using static data as fallback');
  }
  
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
        preOwnedRackets={preOwnedRackets}
        enhancedBlades={enhancedBlades}
        enhancedRubbers={enhancedRubbers}
      />
    </Suspense>
  );
}
