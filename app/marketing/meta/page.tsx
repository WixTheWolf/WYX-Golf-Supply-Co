import type { Metadata } from 'next';
import { currentMetaCampaigns, currentMetaLandingUrl } from '@/lib/marketing/currentMetaCampaigns';

export const metadata: Metadata = {
  title: 'Meta Campaign Copy — Internal',
  robots: { index: false, follow: false }
};

export default function MetaMarketingReferencePage() {
  return (
    <section className="page-hero" style={{ maxWidth: '52rem' }}>
      <p className="eyebrow">Internal — Meta Ads</p>
      <h1>Current Campaign Board</h1>
      <p>Current WYX campaign concepts only. Do not launch paid spend until Meta account assets, tracking, and the live catalog are verified.</p>
      <div style={{ display: 'grid', gap: '1.5rem', marginTop: '2rem' }}>
        {currentMetaCampaigns.map((creative) => {
          const websiteUrl = currentMetaLandingUrl(creative.landingPath, creative.utmCampaign);
          return (
            <article key={creative.id} className="care-step-card" style={{ textAlign: 'left' }}>
              <strong>{creative.name}</strong>
              <p><em>{creative.angle}</em></p>
              <p><strong>Primary:</strong> {creative.primaryText}</p>
              <p><strong>Headline:</strong> {creative.headline}</p>
              <p><strong>Description:</strong> {creative.description}</p>
              <p><strong>CTA:</strong> {creative.cta}</p>
              <p><strong>URL:</strong> <a href={websiteUrl}>{websiteUrl}</a></p>
            </article>
          );
        })}
      </div>
    </section>
  );
}
