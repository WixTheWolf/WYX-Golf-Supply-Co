import type { Metadata } from 'next';
import Link from 'next/link';
import { supportEmail } from '@/lib/support';

export const metadata: Metadata = { title: 'Contact', description: 'Customer support information for WYX Golf Supply Co.', alternates: { canonical: '/contact' }, openGraph: { title: 'Contact | WYX Golf Supply Co.', description: 'Customer support information for WYX Golf Supply Co.', url: '/contact' } };

export default function Contact() {
  return <section className="page-hero"><p className="eyebrow">Customer Care</p><h1>Need A Hand?</h1><p>Email <a className="text-link" href={`mailto:${supportEmail}`}>{supportEmail}</a> for order help. Include your order number so support can get you the clearest answer.</p><p>Shipping rates and delivery estimates are available during checkout. For general policy details, review <Link className="text-link" href="/shipping-returns">Shipping & Returns</Link>.</p></section>;
}
