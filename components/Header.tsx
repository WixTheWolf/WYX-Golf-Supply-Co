'use client';

import Link from 'next/link';
import { useCart } from './CartProvider';

export function Header() {
  const { count, setOpen } = useCart();

  return (
    <>
      <div className="announcement"><span>WYX10</span> · 10% off your first order · <Link href="/weekend-golfer-bag-upgrade-kit?discount=WYX10" style={{ color: 'inherit' }}>Start with the Bag Upgrade Kit</Link></div>
      <header className="site-header">
        <Link className="brand" href="/"><strong>WYX</strong><span>Golf Co.</span></Link>
        <nav className="nav-links" aria-label="Primary navigation">
          <Link href="/weekend-golfer-bag-upgrade-kit?discount=WYX10">The Kit</Link>
          <Link href="/products">Shop</Link>
          <Link href="/golf-trip-gear">Trip Gear</Link>
          <Link href="/golf-gifts">Golf Gifts</Link>
          <Link href="/the-bag-test">The Bag Test</Link>
        </nav>
        <button className="header-cta" onClick={() => setOpen(true)} aria-label={`Open cart with ${count} items`}>
          Bag ({count})
        </button>
      </header>
    </>
  );
}
