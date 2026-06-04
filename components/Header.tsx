'use client';

import Link from 'next/link';
import { useCart } from './CartProvider';

export function Header() {
  const { count, setOpen } = useCart();
  return (
    <>
      <div className="announcement">WYX10 saves 10% <span>/</span> Golf gifts, trip gear, and bag upgrades for weekend players</div>
      <header className="site-header">
        <Link className="brand" href="/"><strong>WYX</strong><span>Golf Supply Co.</span></Link>
        <nav className="nav-links" aria-label="Primary navigation">
          <Link href="/products">Shop</Link>
          <Link href="/golf-gifts">Gifts</Link>
          <Link href="/golf-trip-gear">Trip Gear</Link>
          <Link href="/golf-gifts-for-dad">Dad Gifts</Link>
          <Link href="/bag-upgrades">Bag Upgrades</Link>
        </nav>
        <button className="header-cta" onClick={() => setOpen(true)} aria-label={`Open cart with ${count} items`}>Bag ({count})</button>
      </header>
    </>
  );
}
