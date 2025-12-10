import { Metadata } from 'next';
import ContactClient from './ContactClient';

export const metadata: Metadata = {
  title: 'Contact Us - Dream Sports Table Tennis Academy Pune',
  description: 'Get in touch with Dream Sports Table Tennis Academy in Pune. Visit our academy, call us, or WhatsApp for coaching inquiries and equipment questions.',
};

export default function ContactPage() {
  return <ContactClient />;
}
