'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { fathersDayDaysLeft, isFathersDayWindow } from '@/lib/fathersDay';

const STORAGE_KEY = 'wyx_sticky_bar_dismissed_at';
const COOLDOWN_HOURS = 4;
const KIT_URL = '/weekend-golfer-bag-upgrade-kit?discount=WYX10';

const HIDE_ON = ['/cart', '/weekend-golfer-bag-upgrade-kit', '/lp/bag-kit', '/lp/fathers-day'];

export function StickySalesBar() {
  const [visible, setVisible] = useState(false);
  const daysLeft = fathersDayDaysLeft();
  const fathersDay = isFathersDayWindow();

  useEffect(() => {
    const path = window.location.pathname;
    if (HIDE_ON.some((p) => path.startsWith(p))) return;
    const dismissedAt = Number(sessionStorage.getItem(STORAGE_KEY) || 0);
    if (Date.now() - dismissedAt < COOLDOWN_HOURS * 60 * 60 * 1000) return;
    setVisible(true);
  }, []);

  function dismiss() {
    sessionStorage.setItem(STORAGE_KEY, String(Date.now()));
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="sticky-sales-bar" role="complementary" aria-label="Shop offer">
      <div className="sticky-sales-bar-copy">
        {fathersDay ? (
          <span><strong>Father&apos;s Day · {daysLeft}d left</strong> — Bag Upgrade Kit</span>
        ) : (
          <span><strong>WYX10</strong> — 10% off first order</span>
        )}
      </div>
      <div className="sticky-sales-bar-actions">
        <Link className="button primary compact" href={KIT_URL}>Get The Kit</Link>
        <button type="button" className="sticky-sales-bar-close" onClick={dismiss} aria-label="Dismiss offer bar">×</button>
      </div>
    </div>
  );
}