import { Metadata } from 'next';
import ContactClient from './ContactClient';

export const metadata: Metadata = {
  title: 'Contact Us - All About Table Tennis',
  description: 'Get in touch with All About Table Tennis. Call us or WhatsApp for equipment questions and inquiries.',
};

export default function ContactPage() {
  return <ContactClient />;
}
