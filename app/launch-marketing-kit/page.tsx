import type { Metadata } from 'next';
import Link from 'next/link';
import { adCopyBlocks, campaignUrl, dailyGrowthChecklist, launchSocialCopy, paidSearchAngles, socialHashtags, supplierScoutingTargets } from '@/lib/marketing';

export const metadata: Metadata = {
  title: 'WYX Launch Marketing Kit',
  description: 'Ready-to-use WYX Golf Supply launch links, social captions, paid search angles, and campaign copy for driving shoppers into cart.',
  robots: { index: false, follow: true }
};

const campaignLinks = [
  ['First Sale Landing Page', campaignUrl('/first-sale', 'first_sale_push', 'social', 'bio')],
  ['Popular Golf Products 2026', campaignUrl('/popular-golf-products-2026', 'popular_golf_products_2026', 'social', 'bio')],
  ['Golf Gifts Under $60', campaignUrl('/golf-gifts-under-60', 'golf_gifts_under_60', 'social', 'bio')],
  ['Best Golf Accessories', campaignUrl('/best-golf-accessories', 'best_golf_accessories', 'social', 'bio')],
  ['Deals Under $60', campaignUrl('/deals', 'launch_deals', 'social', 'bio')],
  ['Club Care Essentials', campaignUrl('/collections/golf-club-care', 'club_care', 'social', 'bio')],
  ['Training Aids', campaignUrl('/collections/golf-training-aids', 'training_aids', 'social', 'bio')]
] as const;

export default function LaunchMarketingKit() {
  return (
    <>
      <section className="collection-hero">
        <div>
          <p className="eyebrow">Marketing Kit</p>
          <h1>Get WYX In Front Of Golfers.</h1>
          <p>Use these links and captions for Instagram bio, Facebook posts, Google Ads, Reddit/golf forums where allowed, email, text messages, and local golf groups.</p>
          <div className="actions">
            <Link className="button primary" href="/first-sale">View First-Sale Page</Link>
            <Link className="button secondary dark" href="/golf-gifts-under-60">Gift Landing Page</Link>
          </div>
        </div>
        <div className="collection-proof">
          <span>Use WYX10 in every caption</span>
          <span>Point paid traffic to focused pages</span>
          <span>Push small accessories first</span>
          <span>Scout under-$60 products daily</span>
        </div>
      </section>

      <section className="section">
        <div className="section-heading split">
          <div>
            <p className="eyebrow">Daily Operator Sprint</p>
            <h2>Do This Today.</h2>
          </div>
          <Link className="text-link" href="/popular-golf-products-2026">Share Popular Picks</Link>
        </div>
        <div className="marketing-grid">
          {dailyGrowthChecklist.map((item, index) => <article className="marketing-card" key={item}><span>Step {index + 1}</span><p>{item}</p></article>)}
        </div>
      </section>

      <section className="section">
        <div className="section-heading split">
          <div>
            <p className="eyebrow">Campaign Links</p>
            <h2>Use These URLs.</h2>
          </div>
          <Link className="text-link" href="/products">Shop Catalog</Link>
        </div>
        <div className="marketing-grid">
          {campaignLinks.map(([label, href]) => (
            <article className="marketing-card" key={label}>
              <span>{label}</span>
              <p>{href}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="section-heading split">
          <div>
            <p className="eyebrow">Organic Social</p>
            <h2>Captions To Post Today.</h2>
          </div>
        </div>
        <div className="marketing-grid">
          {launchSocialCopy.map((copy) => <article className="marketing-card" key={copy}><p>{copy}</p></article>)}
          <article className="marketing-card"><span>Hashtag Set</span><p>{socialHashtags.join(' ')}</p></article>
        </div>
      </section>

      <section className="section">
        <div className="section-heading split">
          <div>
            <p className="eyebrow">Paid Search</p>
            <h2>Ad Angles.</h2>
          </div>
        </div>
        <div className="marketing-grid">
          {adCopyBlocks.map(([headline, body]) => (
            <article className="marketing-card" key={headline}>
              <span>{headline}</span>
              <p>{body}</p>
            </article>
          ))}
          {paidSearchAngles.map((angle) => <article className="marketing-card" key={angle}><span>Keyword Angle</span><p>{angle}</p></article>)}
        </div>
      </section>

      <section className="section">
        <div className="section-heading split">
          <div>
            <p className="eyebrow">Supplier Hunt</p>
            <h2>Products To Import Next.</h2>
          </div>
          <Link className="text-link" href="/products">Current Catalog</Link>
        </div>
        <div className="marketing-grid">
          {supplierScoutingTargets.map(([priority, target, reason]) => (
            <article className="marketing-card" key={target}>
              <span>{priority}</span>
              <h3>{target}</h3>
              <p>{reason}</p>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
