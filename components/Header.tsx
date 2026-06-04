'use client';

import Link from 'next/link';
import { useCart } from './CartProvider';

export function Header() {
  const { count, setOpen } = useCart();
  return (
    <>
      <div className="announcement">Launch offer: 10% off with code WYX10 <span>/</span> Useful golf gear for real rounds</div>
      <header className="site-header">
        <Link className="brand" href="/"><strong>WYX</strong><span>Golf Supply Co.</span></Link>
        <nav className="nav-links" aria-label="Primary navigation">
          <Link href="/products">Shop</Link>
          <Link href="/golf-gifts">Gifts</Link>
          <Link href="/golf-gifts-for-dad">Dad Gifts</Link>
          <Link href="/best-golf-accessories">Accessories</Link>
          <Link href="/bag-essentials">Essentials</Link>
          <Link href="/weekend-golfer">Weekend</Link>
          <Link href="/popular-golf-products-2026">Popular</Link>
          <Link href="/deals">Deals</Link>
        </nav>
        <button className="header-cta" onClick={() => setOpen(true)} aria-label={`Open cart with ${count} items`}>Bag ({count})</button>
      </header>
    </>
  );
}
