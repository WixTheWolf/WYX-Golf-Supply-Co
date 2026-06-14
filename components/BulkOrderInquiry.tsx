'use client';

import { useState } from 'react';

type Props = {
  source: string;
  title?: string;
  body?: string;
};

export function BulkOrderInquiry({
  source,
  title = 'Need 4+ kits or tournament prizes?',
  body = 'Tell us your event date and quantity — we\'ll reply with bundle pricing and ship timing.',
}: Props) {
  const [email, setEmail] = useState('');
  const [note, setNote] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'ok' | 'error'>('idle');
  const [message, setMessage] = useState('');

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setStatus('loading');
    try {
      const response = await fetch('/api/marketing/bulk-inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, note, source, consent: true }),
      });
      const json = await response.json();
      if (!response.ok) throw new Error(json.error || 'Failed');
      setStatus('ok');
      setMessage('Got it — we\'ll email you within 24 hours.');
      setEmail('');
      setNote('');
    } catch (error) {
      setStatus('error');
      setMessage(error instanceof Error ? error.message : 'Something went wrong.');
    }
  }

  return (
    <div className="bulk-inquiry conversion-panel">
      <strong>{title}</strong>
      <p>{body}</p>
      <form onSubmit={submit} className="bulk-inquiry-form">
        <label>
          Email
          <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@company.com" />
        </label>
        <label>
          Event / quantity
          <textarea required value={note} onChange={(e) => setNote(e.target.value)} placeholder="e.g. 12 scramble prizes, June 28 outing, $40 budget each" rows={3} />
        </label>
        <button className="button primary" type="submit" disabled={status === 'loading'}>
          {status === 'loading' ? 'Sending…' : 'Request Quote'}
        </button>
        {message && <p className={status === 'error' ? 'error' : 'promo-note'}>{message}</p>}
      </form>
    </div>
  );
}