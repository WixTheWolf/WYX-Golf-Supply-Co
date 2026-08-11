'use client';

import Link from 'next/link';
import { useCart } from './CartProvider';

export function Header() {
  const { count, setOpen } = useCart();

  return (
    <>
      <div className="announcement">
        <span>WYX / 26</span> · FIRST ORDER -10% WITH WYX10 · <Link href="/products">ENTER THE DROP</Link>
      </div>
      <header className="site-header">
        <Link className="brand" href="/"><strong>WYX</strong><span>GOLF SUPPLY / 2026</span></Link>
        <nav className="nav-links" aria-label="Primary navigation">
          <Link href="/products">The Drop</Link>
          <Link href="/weekend-golfer-bag-upgrade-kit?discount=WYX10">The Kit</Link>
          <Link href="/golf-trip-gear">Trip Mode</Link>
          <Link href="/golf-gifts">Gifts</Link>
          <Link href="/the-bag-test">Bag Test</Link>
        </nav>
        <button className="header-cta" onClick={() => setOpen(true)} aria-label={`Open cart with ${count} items`}>
          BAG / {count}
        </button>
      </header>
    </>
  );
}
