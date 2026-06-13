import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Page Not Found',
  description: 'The page you are looking for could not be found.',
  robots: { index: false, follow: true }
};

export default function NotFound() {
  return (
    <section className="page-hero">
      <p className="eyebrow">404</p>
      <h1>This Page Drifted Out Of Bounds.</h1>
      <p>The page you were looking for has moved, sold out, or never existed. Here&apos;s where most golfers start instead.</p>
      <div className="actions">
        <Link className="button primary" href="/weekend-golfer-bag-upgrade-kit">Shop The Bag Upgrade Kit</Link>
        <Link className="button secondary dark" href="/golf-gifts">Browse Golf Gifts</Link>
        <Link className="button secondary dark" href="/products">Shop All Gear</Link>
      </div>
    </section>
  );
}
