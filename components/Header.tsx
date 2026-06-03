'use client';

import Link from 'next/link';
import { useCart } from './CartProvider';

export function Header() {
  const { count, setOpen } = useCart();
  return (
    <>
      <div className="announcement">Launch offer: 10% off with code WYX10 <span>/</span> Secure Shopify checkout</div>
      <header className="site-header">
        <Link className="brand" href="/"><strong>WYX</strong><span>Golf Supply Co.</span></Link>
        <nav className="nav-links" aria-label="Primary navigation">
          <Link href="/products">Shop</Link>
          <Link href="/golf-gifts-under-60">Gifts</Link>
          <Link href="/best-golf-accessories">Accessories</Link>
          <Link href="/popular-golf-products-2026">Popular</Link>
          <Link href="/first-sale">First Sale</Link>
          <Link href="/deals">Deals</Link>
        </nav>
        <button className="header-cta" onClick={() => setOpen(true)} aria-label={`Open cart with ${count} items`}>Bag ({count})</button>
      </header>
    </>
  );
}
