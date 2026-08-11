'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

const VISIT_KEY = 'wyx_visit_count';
const DISMISS_KEY = 'wyx_return_offer_dismissed';

/** Kept as an optional future module; not mounted globally to avoid stacking offers. */
export function ReturningVisitorOffer() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (window.location.pathname.startsWith('/cart')) return;
    if (sessionStorage.getItem(DISMISS_KEY)) return;
    const visits = Number(localStorage.getItem(VISIT_KEY) || 0) + 1;
    localStorage.setItem(VISIT_KEY, String(visits));
    if (visits >= 3) setVisible(true);
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
      <strong>Still building the bag?</strong>
      <p>Start with the Bag Upgrade Kit or browse the Short List. WYX10 saves 10% on your first order.</p>
      <div className="actions">
        <Link className="button primary compact" href="/weekend-golfer-bag-upgrade-kit?discount=WYX10">Get The Kit</Link>
        <Link className="button secondary compact" href="/products">Shop The Short List</Link>
      </div>
    </div>
  );
}
