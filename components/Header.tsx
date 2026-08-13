'use client';

import Link from 'next/link';
import { useCart } from './CartProvider';

export function Header() {
  const { count, setOpen } = useCart();

  return (
    <>
      <div className="announcement">
        <span>THE GOOD STUFF IN GOLF</span> · ONE SHARP EDIT · <Link href="/products">SHOP WHAT&apos;S LIVE</Link>
      </div>
      <header className="site-header">
        <Link className="brand" href="/"><strong>WYX</strong><span>GOLF SUPPLY</span></Link>
        <nav className="nav-links" aria-label="Primary navigation">
          <Link href="/products">Shop</Link>
          <Link href="/apparel">Apparel</Link>
          <Link href="/golf-headcovers">Headcovers</Link>
          <Link href="/products?category=Accessories">Accessories</Link>
          <Link href="/golf-gloves">Gloves</Link>
          <Link href="/golf-trip-gear">Trip</Link>
          <Link href="/golf-gifts">Gifts</Link>
        </nav>
        <button className="header-cta" onClick={() => setOpen(true)} aria-label={`Open cart with ${count} items`}>
          BAG {count}
        </button>
      </header>
    </>
  );
}
