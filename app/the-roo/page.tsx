import type { Metadata } from 'next';
import Link from 'next/link';
import { EmailCapture } from '@/components/EmailCapture';

export const metadata: Metadata = {
  title: 'The Roo Valuables Pouch',
  description: 'Join the waitlist for The Roo, a WYX valuables pouch concept for keys, wallet, tees, markers, cash, and small golf-bag essentials.',
  alternates: { canonical: '/the-roo' }
};

export default function TheRoo() {
  return (
    <>
      <section className="collection-hero">
        <div>
          <p className="eyebrow">Coming Soon</p>
          <h1>The Roo Valuables Pouch</h1>
          <p>A better home for keys, wallet, tees, markers, cash, and the tiny stuff that disappears in every golf bag.</p>
          <div className="actions">
            <Link className="button primary" href="#roo-waitlist">Join The Roo Waitlist</Link>
            <Link className="button secondary dark" href="/golf-trip-gear">Shop Trip Gear</Link>
          </div>
        </div>
        <div className="collection-proof">
          <span>Waitlist only</span>
          <span>No preorder yet</span>
          <span>Golf trip concept</span>
          <span>Sourcing in progress</span>
        </div>
      </section>

      <section className="dark-section">
        <div>
          <p className="eyebrow">Why It Exists</p>
          <h2>The Little Stuff Needs A Home.</h2>
        </div>
        <p>The Roo is being sourced as a compact valuables pouch for golf trips, bachelor party weekends, league nights, and anyone tired of digging for keys under loose tees and receipts. It will stay waitlist-only until supplier terms, photos, margin, shipping, and returns are confirmed.</p>
      </section>

      <section id="roo-waitlist">
        <EmailCapture source="the-roo" campaign="the_roo_waitlist" title="Join The Roo Waitlist." body="Get the first note when The Roo sourcing is confirmed and the first pouch drop is ready." />
      </section>
    </>
  );
}

