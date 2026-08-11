'use client';

import { useEffect, useState } from 'react';
import { EmailCapture } from './EmailCapture';

const STORAGE_KEY = 'wyx_email_slidein_dismissed_at';
const SHOW_AFTER_MS = 20000;
const SCROLL_TRIGGER = 0.5;
const COOLDOWN_DAYS = 14;

/**
 * Low-pressure email slide-in: appears after meaningful engagement rather than
 * interrupting a first impression. Dismissal snoozes it for two weeks.
 * Never shows on cart or kit pages where the shopper already has a clear next step.
 */
export function EmailSlideIn() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const path = window.location.pathname;
    if (path.startsWith('/cart') || path.startsWith('/weekend-golfer-bag-upgrade-kit')) return;

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
    <div className="email-slidein" role="dialog" aria-label="WYX email offer">
      <button className="email-slidein-close" onClick={dismiss} aria-label="Close email offer">
        Close
      </button>
      <EmailCapture
        source="slidein"
        campaign="evergreen_wyx10"
        title="Take 10% off your first bag upgrade."
        body="Get WYX10 plus occasional golf-trip picks, useful gifts, and Bag Test winners. No daily junk mail."
      />
    </div>
  );
}
