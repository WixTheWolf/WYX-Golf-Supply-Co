import type { Metadata } from 'next';
import Link from 'next/link';
import { EmailCapture } from '@/components/EmailCapture';

export const metadata: Metadata = {
  title: 'The Roo Valuables Pouch',
  description: 'Join the interest list for The Roo, a WYX valuables-pouch concept for keys, wallet, tees, markers, cash, and small golf-bag essentials.',
  alternates: { canonical: '/the-roo' },
  openGraph: {
    title: 'The Roo Valuables Pouch | WYX Golf Supply Co.',
    description: 'Join the interest list for The Roo, a valuables-pouch concept for keys, wallet, tees, markers, and small bag essentials.',
    url: '/the-roo'
  }
};

export default function TheRoo() {
  return (
    <>
      <section className="collection-hero">
        <div>
          <p className="eyebrow">WYX CONCEPT</p>
          <h1>The Roo Valuables Pouch</h1>
          <p>A better home for keys, wallet, tees, markers, cash, and the tiny stuff that disappears in every golf bag.</p>
          <div className="actions">
            <Link className="button primary" href="#roo-waitlist">Join The Interest List</Link>
            <Link className="button secondary dark" href="/golf-trip-gear">Shop Trip Gear</Link>
          </div>
        </div>
        <div className="collection-proof">
          <span>Concept only</span>
          <span>Nothing charged today</span>
          <span>No preorder</span>
          <span>We&apos;ll email if it becomes real</span>
        </div>
      </section>

      <section className="dark-section">
        <div>
          <p className="eyebrow">Why It Exists</p>
          <h2>The Little Stuff Needs A Home.</h2>
        </div>
        <p>The Roo is a WYX concept for golfers who want one compact place for valuables and loose bag essentials. It will not become a product until the design, materials, pricing, photography, fulfillment, and return experience are good enough to put the WYX name on.</p>
      </section>

      <section id="roo-waitlist">
        <EmailCapture source="the-roo" campaign="the_roo_interest" title="Interested In The Roo?" body="Leave your email and we&apos;ll send one note if The Roo becomes a real WYX product." />
      </section>
    </>
  );
}
