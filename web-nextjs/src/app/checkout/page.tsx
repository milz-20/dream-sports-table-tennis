import { Metadata } from 'next';
import CheckoutClient from './CheckoutClient';

export const metadata: Metadata = {
  title: 'Checkout - Dream Sports Table Tennis',
  description: 'Complete your order for premium table tennis equipment in Pune.',
};

export default function CheckoutPage() {
  return <CheckoutClient />;
}
