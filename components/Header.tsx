'use client';

import Link from 'next/link';
import { useCart } from './CartProvider';

export function Header() {
  const { count, setOpen } = useCart();

  return (
    <>
      <div className="announcement">WYX10 saves 10% on your first order.</div>
      <header className="site-header">
        <Link className="brand" href="/"><strong>WYX</strong><span>Golf Co.</span></Link>
        <nav className="nav-links" aria-label="Primary navigation">
          <Link href="/weekend-golfer-bag-upgrade-kit">The Kit</Link>
          <Link href="/golf-gifts">Golf Gifts</Link>
          <Link href="/golf-trip-gear">Trip Gear</Link>
          <Link href="/golf-gifts-under-60">Under $60</Link>
          <Link href="/the-bag-test">The Bag Test</Link>
          <Link href="/products">Shop All</Link>
        </nav>
        <button className="header-cta" onClick={() => setOpen(true)} aria-label={`Open cart with ${count} items`}>
          Bag ({count})
        </button>
      </header>
    </>
  );
}