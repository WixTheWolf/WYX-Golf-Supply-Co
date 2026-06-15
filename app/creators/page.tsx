import type { Metadata } from 'next';
import Link from 'next/link';
import { EmailCapture } from '@/components/EmailCapture';
import { campaignUrl } from '@/lib/marketing';

export const metadata: Metadata = {
  title: 'WYX Creators & Ambassadors',
  description: 'Partner with WYX Golf Supply — golf creators, podcasts, and foursome organizers. Kit seeding, affiliate commissions, and co-branded trip packs.',
  alternates: { canonical: '/creators' },
};

const tiers = [
  {
    title: 'Foursome Partner',
    body: 'Share your referral link. Friends get WYX10 (10% off). You get credit toward free gear after 3 referred orders.',
    perk: 'Best for: league captains, trip organizers, golf group chats',
  },
  {
    title: 'Creator Seed',
    body: 'Golf TikTok, YouTube, podcast, or newsletter with 2k+ engaged followers? We send a Bag Upgrade Kit for an honest Bag Test review.',
    perk: 'Best for: micro-creators who play real rounds',
  },
  {
    title: 'Affiliate',
    body: 'Custom commission on sales through your link. Co-branded scramble prize packs and trip gift bundles at scale.',
    perk: 'Best for: established golf media — apply below',
  },
];

export default function CreatorsPage() {
  const kit = campaignUrl('/weekend-golfer-bag-upgrade-kit', 'creators', 'wyx', 'partners');

  return (
    <>
      <section className="page-hero">
        <p className="eyebrow">Build With Us</p>
        <h1>Help Grow WYX Into The Golf Gift Brand.</h1>
        <p>We are opening week — no fake hype, no invented reviews. We want real golfers and real creators who care about useful gear.</p>
        <div className="actions">
          <Link className="button primary" href={kit}>See the hero kit</Link>
          <Link className="button secondary" href="/open">Grand opening</Link>
        </div>
      </section>

      <section className="section">
        <div className="care-step-grid">
          {tiers.map((t) => (
            <div className="care-step" key={t.title}>
              <strong>{t.title}</strong>
              <p>{t.body}</p>
              <p><em>{t.perk}</em></p>
            </div>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="section-heading">
          <p className="eyebrow">Apply</p>
          <h2>Creator & Ambassador Applications</h2>
        </div>
        <EmailCapture
          source="creators-page"
          campaign="creator-apply"
          title="Apply to partner"
          body="Tell us your handle/channel in the notes field at checkout if you order — or email mwixted1@gmail.com with your audience size and content links."
        />
        <p style={{ marginTop: '1rem' }}>
          Or email directly: <a href="mailto:mwixted1@gmail.com?subject=WYX%20Creator%20Application">mwixted1@gmail.com</a>
        </p>
      </section>
    </>
  );
}