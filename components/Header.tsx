'use client';

import { List, X } from '@phosphor-icons/react';
import { AnimatePresence, m } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { motionTokens } from '@/lib/motion';
import { useCart } from './CartProvider';

const links = [
  { href: '/products', label: 'Shop' },
  { href: '/apparel', label: 'Apparel' },
  { href: '/golf-headcovers', label: 'Headcovers' },
  { href: '/products?category=Accessories', label: 'Accessories' },
  { href: '/journal', label: 'The Edit' },
  { href: '/the-bag-test', label: 'The Standard' },
];

export function Header() {
  const { count, setOpen } = useCart();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => setMenuOpen(false), [pathname]);
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  return (
    <>
      <div className="lux-announcement">
        <span>Free shipping over $100</span><i aria-hidden="true" />
        <span>Easy 30-day returns</span><i aria-hidden="true" />
        <Link href="/products">Shop the live edit</Link>
      </div>
      <header className="lux-header">
        <button className="lux-header__menu" onClick={() => setMenuOpen(true)} aria-label="Open menu" aria-expanded={menuOpen}>
          <List size={22} weight="bold" />
        </button>
        <Link className="lux-brand" href="/" aria-label="WYX Golf Supply home"><strong>WYX</strong><span>Golf Supply</span></Link>
        <nav className="lux-header__nav" aria-label="Primary navigation">
          {links.map((link) => <Link href={link.href} key={link.label}>{link.label}</Link>)}
        </nav>
        <button className="lux-header__bag" onClick={() => setOpen(true)} aria-label={`Open bag with ${count} items`}>
          Bag <span>{String(count).padStart(2, '0')}</span>
        </button>
      </header>
      <AnimatePresence>
        {menuOpen && (
          <m.div className="lux-menu" role="dialog" aria-modal="true" aria-label="Navigation menu" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <m.div className="lux-menu__panel" initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }} transition={motionTokens.spring.tactile}>
              <div className="lux-menu__head"><span>WYX / Menu</span><button onClick={() => setMenuOpen(false)} aria-label="Close menu"><X size={22} /></button></div>
              <nav>{links.map((link, index) => <Link href={link.href} key={link.label}><span>0{index + 1}</span>{link.label}</Link>)}</nav>
              <p>The good stuff in golf.<br />One sharp edit.</p>
            </m.div>
            <button className="lux-menu__backdrop" aria-label="Close menu" onClick={() => setMenuOpen(false)} />
          </m.div>
        )}
      </AnimatePresence>
    </>
  );
}
