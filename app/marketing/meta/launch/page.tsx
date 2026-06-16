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
      <ol style={{ marginTop: '1.5rem', textAlign: 'left', lineHeight: 1.6 }}>
        <li>
          Open{' '}
          <a href={metaAdsConfig.graphExplorerUrl} target="_blank" rel="noreferrer">
            Graph API Explorer
          </a>
        </li>
        <li>Select your Meta app (or create one — Business type)</li>
        <li>Get User Access Token → allow ads_management + business_management</li>
        <li>Paste token above → Activate</li>
      </ol>
    </section>
  );
}