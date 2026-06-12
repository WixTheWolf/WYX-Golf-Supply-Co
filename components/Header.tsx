'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useCart } from './CartProvider';

const FATHERS_DAY_STANDARD_CUTOFF = '2026-06-17';
const FATHERS_DAY_LAST_MINUTE_CUTOFF = '2026-06-20';
const FATHERS_DAY_END = '2026-06-21';
const DEFAULT_ANNOUNCEMENT = 'WYX10 saves 10% on your first order.';
const FATHERS_DAY_ANNOUNCEMENT = "Father’s Day is June 21 — use WYX10 for 10% off dad’s golf gift.";
const LAST_MINUTE_ANNOUNCEMENT = "Last minute Father’s Day picks ship fast — order today for June 21 delivery.";
const LATE_GIFT_ANNOUNCEMENT = "Father’s Day is tomorrow — lightweight picks still ship fast. Use WYX10.";

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
          <Link href="/hidden-gems">Hidden Gems</Link>
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
  if (localDate <= FATHERS_DAY_STANDARD_CUTOFF) return FATHERS_DAY_ANNOUNCEMENT;
  if (localDate <= FATHERS_DAY_LAST_MINUTE_CUTOFF) return LAST_MINUTE_ANNOUNCEMENT;
  if (localDate <= FATHERS_DAY_END) return LATE_GIFT_ANNOUNCEMENT;
  return DEFAULT_ANNOUNCEMENT;
}

function formatLocalDate(date: Date) {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');
  return `${year}-${month}-${day}`;
}
