'use client';

import { useEffect, useState } from 'react';
import { EmailCapture } from './EmailCapture';

const STORAGE_KEY = 'wyx_email_slidein_dismissed_at';
const SHOW_AFTER_MS = 14000;
const SCROLL_TRIGGER = 0.35;
const COOLDOWN_DAYS = 7;

/**
 * Deferred email slide-in: appears after 14s on page or 35% scroll depth,
 * whichever comes first. Dismissal (or signup view) snoozes it for 7 days.
 * Never shows on cart/checkout-adjacent pages to avoid purchase interference.
 */
export function EmailSlideIn() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (window.location.pathname.startsWith('/cart')) return;
    const dismissedAt = Number(localStorage.getItem(STORAGE_KEY) || 0);
    if (Date.now() - dismissedAt < COOLDOWN_DAYS * 24 * 60 * 60 * 1000) return;

    let shown = false;
    const show = () => {
      if (shown) return;
      shown = true;
      setVisible(true);
      window.removeEventListener('scroll', onScroll);
    };
    const timer = window.setTimeout(show, SHOW_AFTER_MS);
    const onScroll = () => {
      const depth = (window.scrollY + window.innerHeight) / document.documentElement.scrollHeight;
      if (depth >= SCROLL_TRIGGER) show();
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  function dismiss() {
    localStorage.setItem(STORAGE_KEY, String(Date.now()));
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="email-slidein" role="dialog" aria-label="Free Bag Audit Checklist offer">
      <button className="email-slidein-close" onClick={dismiss} aria-label="Close email offer">
        Close
      </button>
      <EmailCapture
        source="slidein"
        campaign="bag_audit_checklist"
        title="Free: The Bag Audit Checklist."
        body="A 2-minute checklist for what belongs in a weekend bag — plus WYX10 for 10% off your first order. No spam, just the next drop."
      />
    </div>
  );
}
