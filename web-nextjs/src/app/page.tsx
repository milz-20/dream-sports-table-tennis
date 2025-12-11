import type { Metadata } from 'next';
import HomeClient from './HomeClient';

export const metadata: Metadata = {
  title: 'Pune Table Tennis - Professional Coaching & Equipment',
  description: 'Professional table tennis coaching and equipment in Pune. Expert coaches, premium Butterfly & Stiga equipment. Join our academy for world-class training.',
  keywords: 'table tennis pune, table tennis coaching pune, butterfly equipment pune, stiga blades pune, tt coaching, table tennis academy',
  openGraph: {
    title: 'Pune Table Tennis - Professional Coaching & Equipment',
    description: 'Professional table tennis coaching and equipment in Pune',
    url: 'https://dreamtabletennis.com',
    siteName: 'Pune Table Tennis',
    locale: 'en_IN',
    type: 'website',
  },
};

// Force dynamic rendering for SSR
export const dynamic = 'force-dynamic';

export default function Home() {
  return <HomeClient />;
}
