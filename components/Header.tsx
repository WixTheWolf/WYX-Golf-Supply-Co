'use client';

import Link from 'next/link';
import { useCart } from './CartProvider';

export function Header() {
  const { count, setOpen } = useCart();
  return (
    <>
      <div className="announcement">Live supplier inventory <span>/</span> Secure Shopify checkout</div>
      <header className="site-header">
        <Link className="brand" href="/"><strong>WYX</strong><span>Golf Supply Co.</span></Link>
        <nav className="nav-links" aria-label="Primary navigation">
          <Link href="/products">Shop</Link>
          <Link href="/story">Our Story</Link>
          <Link href="/journal">Field Notes</Link>
        </nav>
        <button className="header-cta" onClick={() => setOpen(true)} aria-label={`Open cart with ${count} items`}>Bag ({count})</button>
      </header>
    </>
  );
}
