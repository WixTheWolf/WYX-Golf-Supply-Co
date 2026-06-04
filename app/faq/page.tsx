import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'FAQ',
  description: 'Frequently asked questions about WYX Golf Supply Co. products, checkout, shipping, returns, and launch discount WYX10.'
};

const faqs = [
  ['What should I buy first?', 'Start with useful products that fit most golfers: towels, gloves, grips, ball markers, golf balls, caddies, and club-care tools.'],
  ['Does WYX10 work?', 'WYX10 is the launch discount code. Enter it at checkout for 10% off eligible products while the launch offer is active.'],
  ['When do I see shipping timing?', 'Shipping options, rates, and delivery estimates are shown before payment during checkout.'],
  ['Are the products actually purchasable?', 'Customer-facing product pages only show active products with images, variants, pricing, and checkout availability.'],
  ['Who do I contact for order help?', 'Use the contact information in your order confirmation and include your order number for the fastest help.']
];

export default function FAQ() {
  return (
    <section className="page-hero">
      <p className="eyebrow">FAQ</p>
      <h1>Before You Add To Bag.</h1>
      <div className="detail-list">
        {faqs.map(([question, answer]) => <details key={question}><summary>{question}</summary><p>{answer}</p></details>)}
      </div>
      <p>Need policy details? Read <Link className="text-link" href="/shipping-returns">Shipping & Returns</Link>.</p>
    </section>
  );
}
