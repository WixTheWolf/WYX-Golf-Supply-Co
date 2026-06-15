import type { Metadata } from 'next';
import Link from 'next/link';
import { ShareButtons } from '@/components/ShareButtons';
import { ShareWyx } from '@/components/ShareWyx';
import { fathersDayDaysLeft } from '@/lib/fathersDay';

export const metadata: Metadata = {
  title: 'Share WYX — Help Us Launch',
  description: 'Copy-paste links and messages to share WYX Golf Supply. WYX10 saves 10% on first orders.',
  robots: { index: false, follow: true },
};

const links = [
  { label: 'Kit (best convert)', url: 'https://wyxgolfsupply.com/go?ref=share', note: 'Short link → Bag Upgrade Kit + WYX10' },
  { label: 'Father\'s Day gifts', url: 'https://wyxgolfsupply.com/gift?ref=share', note: 'Short link → Dad gift page + WYX10' },
  { label: 'Grand opening', url: 'https://wyxgolfsupply.com/open?ref=share', note: 'Launch page for foursomes' },
  { label: 'Full kit page', url: 'https://wyxgolfsupply.com/weekend-golfer-bag-upgrade-kit?discount=WYX10', note: 'Direct kit URL with code' },
];

export default function SharePage() {
  const daysLeft = fathersDayDaysLeft();

  return (
    <>
      <div className="urgency-strip" role="banner">
        <strong>Goal: 10 orders this week</strong> — Father&apos;s Day in {daysLeft} days
      </div>

      <section className="page-hero compact">
        <p className="eyebrow">Sales Blitz</p>
        <h1>Share WYX. Get Sales.</h1>
        <p>Zero traffic = zero sales. Copy a link or message below and send to golfers you know. Every click helps.</p>
      </section>

      <section className="section reveal">
        <div className="section-heading">
          <p className="eyebrow">Links</p>
          <h2>Copy These URLs.</h2>
        </div>
        <div className="care-step-grid">
          {links.map((item) => (
            <div className="care-step" key={item.url}>
              <strong>{item.label}</strong>
              <p>{item.note}</p>
              <p style={{ wordBreak: 'break-all', fontSize: '0.85rem', marginTop: '0.5rem' }}>
                <a href={item.url}>{item.url}</a>
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="section reveal">
        <div className="section-heading">
          <p className="eyebrow">One tap</p>
          <h2>Share Via App.</h2>
        </div>
        <ShareButtons />
      </section>

      <section className="section reveal">
        <ShareWyx label="Copy-paste messages" />
      </section>

      <section className="section reveal">
        <div className="section-heading">
          <p className="eyebrow">Full playbook</p>
          <h2>More Templates.</h2>
        </div>
        <p>More templates: <code>data/blitz-outreach/COPY-PASTE.txt</code> (texts/social) · <code>data/channel-outreach/COPY-PASTE.txt</code> (Reddit, Nextdoor, PH, creators)</p>
        <div className="actions" style={{ marginTop: '1rem' }}>
          <Link className="button primary" href="/weekend-golfer-bag-upgrade-kit?discount=WYX10">Test The Kit Yourself</Link>
          <Link className="button secondary dark" href="/marketing/meta">Meta Ad Copy</Link>
        </div>
      </section>
    </>
  );
}