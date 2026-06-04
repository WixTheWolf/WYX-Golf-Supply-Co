import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = { title: 'Contact', description: 'Customer support information for WYX Golf Supply Co.' };

export default function Contact() {
  return <section className="page-hero"><p className="eyebrow">Customer Care</p><h1>Need A Hand?</h1><p>For help with an order, use the contact details included in your order confirmation. Include your order number so support can get you the clearest answer.</p><p>Shipping rates and delivery estimates are available during checkout. For general policy details, review <Link className="text-link" href="/shipping-returns">Shipping & Returns</Link>.</p></section>;
}
