'use client';

import { useEffect, useState } from 'react';
import { shareMessages } from '@/lib/referral';

type Props = {
  messageKey?: keyof ReturnType<typeof shareMessages>;
};

export function ShareButtons({ messageKey = 'short' }: Props) {
  const [canNativeShare, setCanNativeShare] = useState(false);
  const text = shareMessages()[messageKey];
  const encoded = encodeURIComponent(text);

  useEffect(() => {
    setCanNativeShare(typeof navigator !== 'undefined' && 'share' in navigator);
  }, []);

  const channels = [
    { id: 'whatsapp', label: 'WhatsApp', href: `https://wa.me/?text=${encoded}` },
    { id: 'sms', label: 'Text (SMS)', href: `sms:?&body=${encoded}` },
    { id: 'email', label: 'Email', href: `mailto:?subject=${encodeURIComponent('Golf gift idea — WYX10 saves 10%')}&body=${encoded}` },
    { id: 'twitter', label: 'Post on X', href: `https://twitter.com/intent/tweet?text=${encoded}` },
    { id: 'facebook', label: 'Facebook', href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent('https://wyxgolfsupply.com/go?ref=share')}` },
    { id: 'linkedin', label: 'LinkedIn', href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent('https://wyxgolfsupply.com/go?ref=share')}` },
  ];

  async function nativeShare() {
    if (!navigator.share) return;
    try {
      await navigator.share({ title: 'WYX Golf Supply', text, url: 'https://wyxgolfsupply.com/go?ref=share' });
    } catch {
      /* user cancelled */
    }
  }

  return (
    <div className="share-buttons" aria-label="Share WYX">
      <div className="share-buttons-grid">
        {channels.map((ch) => (
          <a key={ch.id} className="button secondary compact" href={ch.href} target="_blank" rel="noopener noreferrer">
            {ch.label}
          </a>
        ))}
        {canNativeShare && (
          <button type="button" className="button primary compact" onClick={() => nativeShare()}>
            Share…
          </button>
        )}
      </div>
    </div>
  );
}