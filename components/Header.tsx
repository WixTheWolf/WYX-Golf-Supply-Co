'use client';

import Link from 'next/link';
import { useCart } from './CartProvider';

export function Header() {
  const { count, setOpen } = useCart();
  return (
    <>
      <div className="announcement">Launch offer: WYX10 saves 10% on your first order.</div>
      <header className="site-header">
        <Link className="brand" href="/"><strong>WYX</strong><span>Golf Co.</span></Link>
        <nav className="nav-links" aria-label="Primary navigation">
          <Link href="/golf-gifts">Gifts</Link>
          <Link href="/golf-trip-gear">Trip Kits</Link>
          <Link href="/golf-gifts-for-dad">Dad Gifts</Link>
          <Link href="/scramble-prizes">Scramble Prizes</Link>
          <Link href="/the-roo">The Roo</Link>
          <Link href="/products">Shop</Link>
        </nav>
        <button className="header-cta" onClick={() => setOpen(true)} aria-label={`Open cart with ${count} items`}>Bag ({count})</button>
      </header>
    </>
  );
}
