import type { Metadata } from 'next';
import Link from 'next/link';
import { KitAddButton } from '@/components/KitAddButton';
import { MetaLandingTracker } from '@/components/MetaLandingTracker';
import { productPrice } from '@/lib/feed';
import { fathersDayDaysLeft } from '@/lib/fathersDay';
import { getProduct } from '@/lib/shopify/products';

export const revalidate = 300;

const KIT_HANDLES = [
  'tri-fold-microfiber-golf-towel',
  'three-rail-ball-marker',
  'pulse-golf-overgrip-tape',
  'groove-sharpener-cleaner-tool',
  'glove-accessory-caddie-gray'
];

export const metadata: Metadata = {
  title: 'Bag Upgrade Kit — Father\'s Day Golf Gift | WYX',
  description: 'Five practical bag upgrades in one kit. Towel, marker, grip tape, groove tool, accessory caddie. WYX10 saves 10% at checkout.',
  robots: { index: false, follow: true },
  alternates: { canonical: '/weekend-golfer-bag-upgrade-kit' }
};

const proof = [
  'WYX10 auto-applied',
  'Secure Shopify checkout',
  '5 items in stock',
  'Shipping shown before payment'
];

export default async function BagKitMetaLandingPage() {
  const products = (await Promise.all(KIT_HANDLES.map((handle) => getProduct(handle))))
    .filter((p): p is NonNullable<typeof p> => Boolean(p) && p!.availableForSale);

  const lines = products
    .map((p) => p.variants.find((v) => v.availableForSale))
    .filter(Boolean)
    .map((v) => ({ merchandiseId: v!.id, quantity: 1 }));

  const total = products.reduce((sum, p) => sum + Number(productPrice(p).amount), 0);
  const withDiscount = total * 0.9;
  const formattedTotal = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(total);
  const formattedSale = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(withDiscount);
  const daysLeft = fathersDayDaysLeft();

  return (
    <>
      <MetaLandingTracker contentName="Meta Bag Kit LP" contentIds={products.map((p) => p.id)} />

      {daysLeft > 0 && daysLeft <= 14 && (
        <div className="urgency-strip" role="banner">
          <strong>Father&apos;s Day · June 21</strong> — {daysLeft} day{daysLeft !== 1 ? 's' : ''} left to order
        </div>
      )}

      <section className="deal-hero">
        <div>
          <p className="eyebrow">The #1 Gift Pick</p>
          <h1>Five Bag Fixes. One Kit. Done.</h1>
          <p>Towel, marker, grip refresh, groove sharpener, accessory caddie — the practical golf gift that stays in the bag after round one. Not novelty junk.</p>
          <div className="lp-price-block">
            <span className="lp-price-sale">{formattedSale}</span>
            <span className="lp-price-was">{formattedTotal}</span>
            <span className="lp-price-code">with WYX10</span>
          </div>
          {lines.length > 0 && (
            <KitAddButton
              lines={lines}
              label="Add Kit To Bag"
              buyNowLabel={`Buy Kit Now — ${formattedSale}`}
              showBuyNow
            />
          )}
          <div className="collection-proof" style={{ marginTop: '1.25rem' }}>
            {proof.map((item) => <span key={item}>{item}</span>)}
          </div>
        </div>
      </section>

      <section className="section reveal">
        <div className="section-heading">
          <p className="eyebrow">What&apos;s Inside</p>
          <h2>{products.length} Items · {formattedTotal}</h2>
        </div>
        <div className="care-step-grid">
          {products.map((p) => (
            <div className="care-step" key={p.id}>
              <strong>{p.title}</strong>
              <p>{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(Number(productPrice(p).amount))}</p>
            </div>
          ))}
        </div>
        {lines.length > 0 && (
          <div style={{ marginTop: '1.5rem' }}>
            <KitAddButton lines={lines} label="Add Kit To Bag" buyNowLabel="Buy Kit Now" showBuyNow />
          </div>
        )}
      </section>

      <section className="dark-section reveal">
        <p className="eyebrow">Why WYX</p>
        <h2>Every Product Passes The Bag Test.</h2>
        <p>Would a weekend golfer keep this after round one? If no, it doesn&apos;t list. Secure Shopify checkout. WYX10 saves 10% on your first order.</p>
        <div className="actions" style={{ marginTop: '1rem' }}>
          <Link className="button secondary dark" href="/the-bag-test">The Bag Test</Link>
        </div>
      </section>
    </>
  );
}