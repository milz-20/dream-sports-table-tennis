import { Metadata } from 'next';
import OrderSuccessClient from './OrderSuccessClient';

export const metadata: Metadata = {
  title: 'Order Confirmed - Dream Sports Table Tennis',
  description: 'Your order has been successfully placed!',
};

export default function OrderSuccessPage() {
  return <OrderSuccessClient />;
}
