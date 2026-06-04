import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Privacy', description: 'Privacy information for WYX Golf Supply Co.' };

export default function Page() {
  return <section className="page-hero"><p className="eyebrow">Privacy</p><h1>Your Information Stays Protected.</h1><p>WYX Golf Supply Co. uses secure commerce services for product availability, cart, checkout, order processing, payments, and order updates. Information submitted during checkout is handled by the services needed to complete your order.</p><p>Payment details are not stored directly by this storefront.</p></section>;
}
