'use client';

import { useState } from 'react';
import { metaAdsConfig } from '@/lib/marketing/metaCampaigns';

export default function MetaLaunchPage() {
  const [token, setToken] = useState('');
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setStatus(null);
    try {
      const res = await fetch('/api/meta/activate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accessToken: token.trim() }),
      });
      const json = await res.json();
      if (!res.ok || !json.ok) throw new Error(json.error || 'Activation failed');
      setStatus(`Live as ${json.user?.name}. Campaign ${json.activated?.campaignId} → ACTIVE.`);
    } catch (err) {
      setStatus((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="page-hero" style={{ maxWidth: '40rem' }}>
      <p className="eyebrow">Internal — Go Live</p>
      <h1>Activate Meta Campaign</h1>
      <p>
        Your draft campaign is already in Ads Manager. Paste a short-lived token from{' '}
        <a href={metaAdsConfig.graphExplorerUrl} target="_blank" rel="noreferrer">
          Graph API Explorer
        </a>{' '}
        and we turn it on.
      </p>
      <div className="care-step-card" style={{ marginTop: '1rem', textAlign: 'left' }}>
        <p>
          <strong>Campaign:</strong> {metaAdsConfig.existingCampaignId}
        </p>
        <p>
          <strong>Ad:</strong> {metaAdsConfig.existingAdId}
        </p>
        <p>
          <a href={metaAdsConfig.adsManagerUrl}>Open in Ads Manager</a>
        </p>
      </div>
      <form onSubmit={onSubmit} style={{ marginTop: '1.5rem', display: 'grid', gap: '0.75rem' }}>
        <label>
          <strong>Access token (EAA…)</strong>
          <textarea
            value={token}
            onChange={(e) => setToken(e.target.value)}
            rows={4}
            style={{ width: '100%', marginTop: '0.35rem', fontFamily: 'monospace' }}
            placeholder="Paste token from Graph API Explorer"
            required
          />
        </label>
        <button className="button" type="submit" disabled={loading || !token.trim()}>
          {loading ? 'Activating…' : 'Activate campaign'}
        </button>
      </form>
      {status ? (
        <p className="care-step-card" style={{ marginTop: '1rem', textAlign: 'left' }}>
          {status}
        </p>
      ) : null}
      <div className="care-step-card" style={{ marginTop: '1.5rem', textAlign: 'left' }}>
        <p>
          <strong>No token? Skip API entirely.</strong>
        </p>
        <p>
          Your campaign already exists in Ads Manager. Open it, click <strong>Publish</strong> (or toggle
          campaign/ad to <strong>On</strong>). No developer app or token required.
        </p>
        <p>
          <a href={metaAdsConfig.adsManagerUrl}>Open your campaign in Ads Manager →</a>
        </p>
      </div>
      <details style={{ marginTop: '1.5rem', textAlign: 'left' }}>
        <summary>
          <strong>Token troubleshooting</strong> (Access Token Tool page often shows nothing)
        </summary>
        <ol style={{ lineHeight: 1.6, marginTop: '0.75rem' }}>
          <li>
            <code>developers.facebook.com/tools/accesstoken</code> only lists tokens for apps you own — if you
            have zero apps, the page is empty. Create one first:{' '}
            <a href="https://developers.facebook.com/apps/create/" target="_blank" rel="noreferrer">
              Create Meta App
            </a>{' '}
            (type: <strong>Business</strong>).
          </li>
          <li>
            Use <strong>Graph API Explorer</strong>, not Access Token Tool:{' '}
            <a href={metaAdsConfig.graphExplorerUrl} target="_blank" rel="noreferrer">
              Graph API Explorer
            </a>
          </li>
          <li>Top-right: Meta App dropdown → pick your new app</li>
          <li>
            Click <strong>Generate Access Token</strong> → check{' '}
            <code>ads_management</code> + <code>business_management</code> → Continue as mwixted1
          </li>
          <li>Copy the <code>EAA…</code> string → paste above</li>
        </ol>
      </details>
    </section>
  );
}