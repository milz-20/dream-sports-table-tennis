import { blades, rubbers, shoes, balls, accessories, preOwnedRackets } from '@/data/equipmentData';
import ProductDetailClient from './ProductDetailClient';
import { notFound } from 'next/navigation';

export async function generateStaticParams() {
  // Generate static pages for all products
  const allProducts = [...blades, ...rubbers, ...shoes, ...balls, ...accessories, ...preOwnedRackets];
  return allProducts.map((product) => ({
    productId: product.id,
  }));
}

export default function ProductDetailPage({ params }: { params: { productId: string } }) {
  const allProducts = [...blades, ...rubbers, ...shoes, ...balls, ...accessories, ...preOwnedRackets];
  const product = allProducts.find(p => p.id === params.productId);

  if (!product) {
    notFound();
  }

  return <ProductDetailClient product={product} allProducts={allProducts} />;
}
