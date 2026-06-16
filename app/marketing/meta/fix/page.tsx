import type { Metadata } from 'next';
import { metaAdsConfig } from '@/lib/marketing/metaCampaigns';

export const metadata: Metadata = {
  title: 'Meta Ads — Fix Errors',
  robots: { index: false, follow: false },
};

const links = {
  adsManager: metaAdsConfig.adsManagerUrl,
  billing: `https://business.facebook.com/billing_hub/payment_settings?asset_id=${metaAdsConfig.pageId}&business_id=${metaAdsConfig.businessId}`,
  accountStatus: `https://www.facebook.com/ads/manager/account_settings/account_status/?act=${metaAdsConfig.pageId}`,
  businessAdAccounts: `https://business.facebook.com/settings/ad-accounts?business_id=${metaAdsConfig.businessId}`,
  eventsManager: metaAdsConfig.eventsManagerUrl,
  landing: 'https://wyxgolfsupply.com/lp/fathers-day?utm_source=facebook&utm_medium=paid_social&utm_campaign=meta_fathers_day_2026',
};

export default function MetaFixPage() {
  return (
    <section className="page-hero" style={{ maxWidth: '46rem' }}>
      <p className="eyebrow">Internal — unblock ads</p>
      <h1>Fix Meta Ad Creation Errors</h1>
      <p>
        Your account shows <strong>Action Required</strong> and still has <strong>12 unpublished drafts</strong>.
        New ads fail until those are cleared.
      </p>

      <div className="care-step-card" style={{ marginTop: '1rem', textAlign: 'left' }}>
        <p>
          <strong>Account:</strong> {metaAdsConfig.pageId} · Wyx Golf Supply
        </p>
        <p>
          <strong>Pixel:</strong> {metaAdsConfig.pixelId}
        </p>
        <p>
          <strong>Landing page:</strong>{' '}
          <a href={links.landing}>{links.landing}</a> (verified 200 + pixel live)
        </p>
      </div>

      <h2 style={{ marginTop: '2rem' }}>Do these in order</h2>
      <ol style={{ textAlign: 'left', lineHeight: 1.7 }}>
        <li>
          <a href={links.accountStatus}>Open Account Status</a> — resolve every{' '}
          <strong>Action Required</strong> item (terms, identity, payment, policy).
        </li>
        <li>
          <a href={links.billing}>Add payment method</a> — card on file for ad account{' '}
          {metaAdsConfig.pageId}.
        </li>
        <li>
          <a href={links.adsManager}>Ads Manager</a> → <strong>Discard drafts</strong> again (12 remain) →
          confirm.
        </li>
        <li>
          Create <strong>one</strong> new campaign (not duplicate old Flavor Factory rows):
          <ul>
            <li>Objective: <strong>Sales</strong></li>
            <li>Conversion: <strong>Initiate checkout</strong> · Pixel {metaAdsConfig.pixelId}</li>
            <li>Page: WYX · URL: Fathers Day LP above</li>
            <li>Budget: $30/day · US · Ages 25–65 · Interest: Golf</li>
          </ul>
        </li>
      </ol>

      <h2 style={{ marginTop: '2rem' }}>If create still errors, check these</h2>
      <ul style={{ textAlign: 'left', lineHeight: 1.7 }}>
        <li>
          <strong>Logged in as mwixted1</strong> — if you see “Switch to Matt Wixted”, click Continue.
        </li>
        <li>
          <strong>Wrong Page on ad</strong> — Identity must be WYX Page, not Flavor Factory.
        </li>
        <li>
          <strong>Pixel not on ad set</strong> —{' '}
          <a href={links.eventsManager}>Events Manager</a> → confirm pixel active.
        </li>
        <li>
          <strong>Stuck on Loading…</strong> — hard refresh (Cmd+Shift+R) or try incognito logged in as
          mwixted1.
        </li>
      </ul>

      <h2 style={{ marginTop: '2rem' }}>Error: asset feed creative</h2>
      <div className="care-step-card" style={{ textAlign: 'left' }}>
        <p>
          <code>cannot get non assetfeed value for an asset feed creative</code>
        </p>
        <p>
          Meta bug/mismatch: an old draft uses <strong>Advantage+ / dynamic asset feed</strong> creative, but the
          editor expects a simple single-image ad. Duplicating &quot;New Sales Campaign&quot; or OUTCOME_SALES rows
          triggers this.
        </p>
        <p>
          <strong>Fix:</strong>
        </p>
        <ol>
          <li>Delete (trash) every old campaign — do not duplicate or edit them.</li>
          <li>Create a <strong>new campaign → Sales → Manual sales campaign</strong>.</li>
          <li>At ad level: turn <strong>OFF</strong> Advantage+ creative and Dynamic formats.</li>
          <li>Use <strong>one image</strong> + one headline + one URL (Fathers Day LP).</li>
          <li>Publish. If it still errors, try Safari/incognito as mwixted1.</li>
        </ol>
      </div>

      <p style={{ marginTop: '1.5rem' }}>
        Paste any other <strong>exact red error text</strong> and I will map it to the fix.
      </p>
    </section>
  );
}