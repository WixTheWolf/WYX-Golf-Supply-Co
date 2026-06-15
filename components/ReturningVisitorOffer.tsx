'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

const VISIT_KEY = 'wyx_visit_count';
const DISMISS_KEY = 'wyx_return_offer_dismissed';

export function ReturningVisitorOffer() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (window.location.pathname.startsWith('/cart')) return;
    if (sessionStorage.getItem(DISMISS_KEY)) return;
    const visits = Number(localStorage.getItem(VISIT_KEY) || 0) + 1;
    localStorage.setItem(VISIT_KEY, String(visits));
    if (visits >= 2) setVisible(true);
  }, []);

  if (!visible) return null;

  function dismiss() {
    sessionStorage.setItem(DISMISS_KEY, '1');
    setVisible(false);
  }

  return (
    <div className="return-offer" role="dialog" aria-label="Returning visitor offer">
      <button type="button" className="return-offer-close" onClick={dismiss} aria-label="Dismiss">×</button>
      <p className="eyebrow">Welcome back</p>
      <strong>Still thinking about it?</strong>
      <p>Father&apos;s Day is June 21. The Bag Upgrade Kit is the safest golf gift — WYX10 saves 10% at checkout.</p>
      <div className="actions">
        <Link className="button primary compact" href="/weekend-golfer-bag-upgrade-kit?discount=WYX10">Get The Kit</Link>
        <button type="button" className="button secondary compact" onClick={dismiss}>Later</button>
      </div>
    </div>
  );
}