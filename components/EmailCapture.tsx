'use client';

import { FormEvent, useState } from 'react';
import { identifyEmail, trackEvent } from '@/lib/analytics';

type EmailCaptureProps = {
  source: string;
  campaign: string;
  title?: string;
  body?: string;
};

export function EmailCapture({
  source,
  campaign,
  title = 'JOIN THE WYX LIST.',
  body = 'Get new premium golf finds, useful gear, and the products worth knowing about.'
}: EmailCaptureProps) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus('loading');
    setMessage('');
    const form = new FormData(event.currentTarget);
    const submittedEmail = email.trim().toLowerCase();
    const response = await fetch('/api/marketing/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: submittedEmail,
        source,
        campaign,
        consent: form.get('consent') === 'on',
        website: form.get('website') || ''
      })
    });
    const json = await response.json();
    if (!response.ok) {
      setStatus('error');
      setMessage(json.error || 'Unable to subscribe right now.');
      return;
    }
    identifyEmail(submittedEmail, { source, campaign, WYXSubscriber: true });
    trackEvent('Lead', { content_name: campaign, source, klaviyo: { Source: source, Campaign: campaign } });
    setStatus('success');
    setMessage('You are on the WYX list.');
    setEmail('');
  }

  return (
    <section className="email-capture" aria-label="Join the WYX email list">
      <div>
        <p className="eyebrow">WYX Notes</p>
        <h2>{title}</h2>
        <p>{body}</p>
      </div>
      <form onSubmit={submit}>
        <label htmlFor={`email-${source}`}>Email address</label>
        <input id={`email-${source}`} type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" required />
        <input className="honeypot" type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" />
        <label className="consent-line">
          <input type="checkbox" name="consent" required />
          <span>I agree to receive marketing emails from WYX Golf Supply Co.</span>
        </label>
        <button className="button primary" disabled={status === 'loading'} type="submit">{status === 'loading' ? 'Joining...' : 'Join The List'}</button>
        {message && <p className={status === 'error' ? 'error' : 'muted'} role="status" aria-live="polite">{message}</p>}
      </form>
    </section>
  );
}
