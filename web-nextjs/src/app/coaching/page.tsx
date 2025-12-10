import type { Metadata } from 'next';
import CoachingClient from './CoachingClient';

// Static metadata for SEO
export const metadata: Metadata = {
  title: 'Table Tennis Coaching in Pune - Commonwealth Certified Coach',
  description: 'Expert table tennis coaching in Pune by Commonwealth certified coach Danish Aga. Beginner, intermediate, advanced & private lessons. 10+ years experience. Book your trial session today!',
  keywords: 'table tennis coaching pune, tt coach pune, danish aga coach, beginner table tennis, advanced coaching',
};

// Enable ISR - revalidate every hour
export const revalidate = 3600;

export default function CoachingPage() {
  return <CoachingClient />;
}
