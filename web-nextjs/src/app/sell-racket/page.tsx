import { Metadata } from 'next';
import SellRacketClient from './SellRacketClient';

export const metadata: Metadata = {
  title: 'Sell Your Used Racket - Get Fair Price for Pre-Owned Equipment',
  description: 'Sell your used table tennis racket to All About Table Tennis. We offer fair prices for pre-owned Butterfly, Stiga, and other premium rackets. Quick evaluation and fast payment.',
};

export default function SellRacketPage() {
  return <SellRacketClient />;
}
