'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useCart } from './CartProvider';

const FATHERS_DAY_CUTOFF = '2026-06-11';
const FATHERS_DAY_END = '2026-06-21';
const DEFAULT_ANNOUNCEMENT = 'WYX10 saves 10% on your first order.';
const FATHERS_DAY_ANNOUNCEMENT = "Father's Day gifts are live. Shop dad picks before June 11.";
const LATE_GIFT_ANNOUNCEMENT = 'Late gift plan: choose a gift card, then use WYX10 for his next round.';

export function Header() {
  const { count, setOpen } = useCart();
  const [announcement, setAnnouncement] = useState(DEFAULT_ANNOUNCEMENT);

  useEffect(() => {
    setAnnouncement(announcementForDate(new Date()));
  }, []);

  return (
    <>
      <div className="announcement">{announcement}</div>
      <header className="site-header">
        <Link className="brand" href="/"><strong>WYX</strong><span>Golf Co.</span></Link>
        <nav className="nav-links" aria-label="Primary navigation">
          <Link href="/products">Shop</Link>
          <Link href="/golf-gifts">Gifts</Link>
          <Link href="/golf-hats">Hats</Link>
          <Link href="/golf-apparel">Apparel</Link>
          <Link href="/golf-training-aids">Training</Link>
          <Link href="/golf-tech">Tech</Link>
          <Link href="/golf-gifts-for-dad">Dad Gifts</Link>
        </nav>
        <button className="header-cta" onClick={() => setOpen(true)} aria-label={`Open cart with ${count} items`}>Bag ({count})</button>
      </header>
    </>
  );
}

function announcementForDate(date: Date) {
  const localDate = formatLocalDate(date);
  if (localDate <= FATHERS_DAY_CUTOFF) return FATHERS_DAY_ANNOUNCEMENT;
  if (localDate <= FATHERS_DAY_END) return LATE_GIFT_ANNOUNCEMENT;
  return DEFAULT_ANNOUNCEMENT;
}

function formatLocalDate(date: Date) {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');
  return `${year}-${month}-${day}`;
}
