import { Metadata } from 'next';
import CheckoutClient from './CheckoutClient';

export const metadata: Metadata = {
  title: 'Checkout - All about Table Tennis',
  description: 'Complete your order for premium table tennis equipment across India.',
};

export default function CheckoutPage() {
  return <CheckoutClient />;
}
