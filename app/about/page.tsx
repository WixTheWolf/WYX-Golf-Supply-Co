import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'About WYX Golf Supply Co.',
  description: 'WYX Golf Supply Co. curates useful golf gear, gift-ready picks, and better bag essentials for weekend golfers.'
};

export default function About() {
  return (
    <section className="page-hero">
      <p className="eyebrow">About WYX</p>
      <h1>Built For The Golfer Who Keeps Looking.</h1>
      <p>WYX Golf Supply Co. is a practical golf shop for weekend players, golf dads, range regulars, and anyone who likes a bag that feels intentional.</p>
      <p>We prioritize useful golf gear first: towels, gloves, grips, markers, balls, club-care tools, giftable accessories, and select premium upgrades when the product earns the shelf.</p>
      <div className="actions">
        <Link className="button primary" href="/bag-essentials">Shop Bag Essentials</Link>
        <Link className="button secondary dark" href="/golf-gifts">Shop Golf Gifts</Link>
      </div>
    </section>
  );
}
