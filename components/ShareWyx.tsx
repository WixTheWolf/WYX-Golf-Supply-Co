'use client';

import { useMemo, useState } from 'react';
import { shareMessages } from '@/lib/referral';

type Props = {
  path?: string;
  label?: string;
};

export function ShareWyx({ path = '/weekend-golfer-bag-upgrade-kit', label = 'Share WYX with your foursome' }: Props) {
  const messages = useMemo(() => shareMessages(path), [path]);
  const [copied, setCopied] = useState<string | null>(null);

  async function copy(key: keyof typeof messages) {
    await navigator.clipboard.writeText(messages[key]);
    setCopied(key);
    window.setTimeout(() => setCopied(null), 2000);
  }

  return (
    <div className="conversion-panel" aria-label="Share WYX">
      <strong>{label}</strong>
      <p>Help us grow: share the Bag Upgrade Kit with golfers you know. They get WYX10 (10% off); you help build the brand.</p>
      <div className="actions" style={{ flexWrap: 'wrap', gap: '0.5rem' }}>
        <button type="button" className="button secondary" onClick={() => copy('short')}>
          {copied === 'short' ? 'Copied!' : 'Copy short link'}
        </button>
        <button type="button" className="button secondary" onClick={() => copy('golfer')}>
          {copied === 'golfer' ? 'Copied!' : 'Copy golfer text'}
        </button>
        <button type="button" className="button secondary" onClick={() => copy('gift')}>
          {copied === 'gift' ? 'Copied!' : 'Copy gift text'}
        </button>
      </div>
    </div>
  );
}