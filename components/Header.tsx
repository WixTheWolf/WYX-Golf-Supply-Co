'use client';

import Link from 'next/link';
import { useCart } from './CartProvider';

export function Header() {
  const { count, setOpen } = useCart();

  return (
    <>
      <div className="announcement">Use WYX10 for 10% off your first order.</div>
      <header className="site-header">
        <Link className="brand" href="/"><strong>WYX</strong><span>Golf Co.</span></Link>
        <nav className="nav-links" aria-label="Primary navigation">
          <Link href="/products">Shop</Link>
          <Link href="/golf-hats">Hats</Link>
          <Link href="/golf-apparel">Apparel</Link>
          <Link href="/golf-tech">Tech</Link>
          <Link href="/golf-training-aids">Practice</Link>
          <Link href="/swing-correction">Swing</Link>
        </nav>
        <button className="header-cta" onClick={() => setOpen(true)} aria-label={`Open cart with ${count} items`}>
          Bag ({count})
        </button>
      </header>
    </>
  );
}