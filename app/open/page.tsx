import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { EmailCapture } from '@/components/EmailCapture';
import { EditorialProductCard } from '@/components/EditorialProductCard';
import { ShareWyx } from '@/components/ShareWyx';
import { availableProducts } from '@/lib/catalog';
import { imageMap } from '@/lib/demo';
import { campaignUrl } from '@/lib/marketing';
import { fathersDayDaysLeft, isFathersDayWindow } from '@/lib/fathersDay';
import { coreMerchProducts } from '@/lib/merchandisingFilters';
import { sortByQuality } from '@/lib/productQuality';
import { getProducts } from '@/lib/shopify/products';

export const revalidate = 300;

export const metadata: Metadata = {
  title: 'WYX Is Open — Golf Gifts That Stay In The Bag',
  description: 'WYX Golf Supply Co. is live. Practical golf gifts, bag upgrades, and trip gear for weekend players. WYX10 saves 10% on your first order.',
  alternates: { canonical: '/open' },
  openGraph: {
    title: 'WYX Is Open — Golf Gifts That Stay In The Bag',
    description: 'Practical golf gear curated for weekend players. Shop the Bag Upgrade Kit and use WYX10.',
    url: 'https://wyxgolfsupply.com/open',
  },
};

const pillars = [
  { title: 'Curated, not cluttered', body: '93 products that pass The Bag Test — not 10,000 dropship SKUs.' },
  { title: 'Gifts that work', body: 'Towels, markers, grip tape, cart gear — stuff golfers keep after round one.' },
  { title: 'Secure checkout', body: 'Shopify checkout, WYX10 on first order, shipping shown before you pay.' },
  { title: 'Built to grow', body: 'Every share and every order helps us add better suppliers and faster US ship options.' },
];

export default async function OpenPage() {
  const catalog = sortByQuality(coreMerchProducts(availableProducts(await getProducts())));
  const heroes = catalog.filter((p) => /hidden-gem|cart|marker|towel|kit/i.test(`${p.title} ${p.handle} ${(p.tags || []).join(' ')}`)).slice(0, 4);
  const picks = heroes.length >= 3 ? heroes : catalog.slice(0, 4);
  const kitUrl = campaignUrl('/weekend-golfer-bag-upgrade-kit', 'grand_opening', 'wyx', 'open');
  const daysLeft = fathersDayDaysLeft();
  const fathersDay = isFathersDayWindow();

  return (
    <>
      {fathersDay && (
        <div className="urgency-strip" role="banner">
          <strong>Father&apos;s Day · June 21</strong> — {daysLeft} days left · <Link href="/fathers-day-golf-gifts">Shop dad gifts</Link>
        </div>
      )}
      <section className="hero launch-hero">
        <Image src={imageMap.hero} alt="Golfers on course at golden hour" fill priority sizes="100vw" />
        <div className="hero-copy launch-hero-copy">
          <p className="eyebrow">Now Open</p>
          <h1>WYX Golf Supply Is Live.</h1>
          <p>We built the golf gift shop we wished existed — practical gear for weekend players, trip groups, and anyone tired of novelty junk.</p>
          <div className="actions">
            <Link className="button primary" href={`${kitUrl}&discount=WYX10`}>Shop The Bag Upgrade Kit — WYX10</Link>
            <Link className="button secondary" href="/fathers-day-golf-gifts">Father&apos;s Day Gifts</Link>
          </div>
          <div className="hero-proof compact-proof">
            <span>WYX10 — 10% off first order</span>
            <span>Secure Shopify checkout</span>
            <span>Shipping before payment</span>
          </div>
        </div>
      </section>

      <section className="section reveal">
        <div className="section-heading">
          <p className="eyebrow">Why WYX</p>
          <h2>Built For Opening Week — And The Long Game.</h2>
        </div>
        <div className="care-step-grid">
          {pillars.map((p) => (
            <div className="care-step" key={p.title}>
              <strong>{p.title}</strong>
              <p>{p.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section reveal">
        <div className="section-heading split">
          <div>
            <p className="eyebrow">Start Here</p>
            <h2>First-Cart Picks.</h2>
          </div>
          <Link className="text-link" href="/products">Shop all</Link>
        </div>
        <div className="editorial-product-grid">
          {picks.map((product, i) => <EditorialProductCard key={product.id} product={product} featured={i === 0} />)}
        </div>
      </section>

      <section className="section reveal">
        <ShareWyx />
      </section>

      <section className="section reveal">
        <div className="section-heading">
          <p className="eyebrow">Stay in the loop</p>
          <h2>Bag Test Drops & Launch Deals</h2>
        </div>
        <EmailCapture
          source="open-page"
          campaign="grand-opening"
          title="Get the next drop"
          body="New Bag Test winners, launch deals, and gift guides — no spam."
        />
      </section>
    </>
  );
}