import type { Metadata } from 'next';
import { carouselCardCopy, metaAdsConfig, metaCampaigns, metaLandingUrl } from '@/lib/marketing/metaCampaigns';

export const metadata: Metadata = {
  title: 'Meta Campaign Copy — Internal',
  robots: { index: false, follow: false }
};

export default function MetaMarketingReferencePage() {
  return (
    <section className="page-hero" style={{ maxWidth: '52rem' }}>
      <p className="eyebrow">Internal — Meta Ads</p>
      <h1>Campaign Copy Board</h1>
      <p>Copy/paste into Meta Ads Manager. Full playbook: <code>docs/meta-ad-creative.md</code></p>
      <div className="care-step-card" style={{ marginTop: '1rem', textAlign: 'left' }}>
        <p><strong>Account:</strong> {metaAdsConfig.accountName}</p>
        <p><strong>Ad account:</strong> act_{metaAdsConfig.adAccountId} — <a href={metaAdsConfig.adsManagerUrl}>Open Ads Manager</a></p>
        <p><strong>Facebook Page:</strong> {metaAdsConfig.pageId}</p>
        <p><strong>Pixel:</strong> {metaAdsConfig.pixelId} — <a href={metaAdsConfig.eventsManagerUrl}>Events Manager</a></p>
        <p><strong>Launch first:</strong> Father&apos;s Day 2026 → <a href={metaLandingUrl('/lp/fathers-day', 'meta_fathers_day_2026')}>LP URL</a></p>
      </div>
      <div style={{ display: 'grid', gap: '1.5rem', marginTop: '2rem' }}>
        {metaCampaigns.map((creative) => {
          const card = carouselCardCopy(creative);
          return (
            <article key={creative.id} className="care-step-card" style={{ textAlign: 'left' }}>
              <strong>{creative.name}</strong>
              <p><em>{creative.angle}</em></p>
              <p><strong>Primary:</strong> {card.primary_text}</p>
              <p><strong>Headline:</strong> {card.headline}</p>
              <p><strong>Description:</strong> {card.link_description}</p>
              <p><strong>CTA:</strong> {card.call_to_action}</p>
              <p><strong>URL:</strong>{' '}
                <a href={card.website_url}>{metaLandingUrl(creative.landingPath, creative.utmCampaign)}</a>
              </p>
            </article>
          );
        })}
      </div>
    </section>
  );
}