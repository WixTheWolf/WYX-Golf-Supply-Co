'use client';

import Link from 'next/link';
import { useCart } from './CartProvider';

export function Header() {
  const { count, setOpen } = useCart();

  return (
    <>
      <div className="announcement">
        <span>NEW / THE APPAREL EDIT</span> · FIRST WYX ORDER? WYX10 · <Link href="/apparel">SHOP APPAREL</Link>
      </div>
      <header className="site-header">
        <Link className="brand" href="/"><strong>WYX</strong><span>GOLF SUPPLY</span></Link>
        <nav className="nav-links" aria-label="Primary navigation">
          <Link href="/products">Shop</Link>
          <Link href="/apparel">Apparel</Link>
          <Link href="/products?category=Headwear">Headwear</Link>
          <Link href="/products?category=Accessories">Accessories</Link>
          <Link href="/golf-trip-gear">Trip Gear</Link>
          <Link href="/golf-gifts">Gifts</Link>
        </nav>
        <button className="header-cta" onClick={() => setOpen(true)} aria-label={`Open cart with ${count} items`}>
          BAG {count}
        </button>
      </header>
    </>
  );
}
