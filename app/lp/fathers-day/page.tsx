import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { EditorialProductCard } from '@/components/EditorialProductCard';
import { KitAddButton } from '@/components/KitAddButton';
import { MetaLandingTracker } from '@/components/MetaLandingTracker';
import { availableProducts } from '@/lib/catalog';
import { productPrice } from '@/lib/feed';
import { fathersDayDaysLeft } from '@/lib/fathersDay';
import { coreMerchProducts } from '@/lib/merchandisingFilters';
import { sortByQuality } from '@/lib/productQuality';
import { imageMap } from '@/lib/demo';
import { getProduct, getProducts } from '@/lib/shopify/products';

export const revalidate = 300;

const KIT_HANDLES = [
  'tri-fold-microfiber-golf-towel',
  'three-rail-ball-marker',
  'pulse-golf-overgrip-tape',
  'groove-sharpener-cleaner-tool',
  'glove-accessory-caddie-gray'
];

export const metadata: Metadata = {
  title: 'Father\'s Day Golf Gifts 2026 — Ships Before June 21 | WYX',
  description: 'Practical golf gifts for Dad — bag upgrade kit, gloves, towels, markers. WYX10 saves 10%. Father\'s Day is June 21.',
  robots: { index: false, follow: true },
  alternates: { canonical: '/fathers-day-golf-gifts' }
};

export default async function FathersDayMetaLandingPage() {
  const daysLeft = fathersDayDaysLeft();
  const catalog = sortByQuality(coreMerchProducts(availableProducts(await getProducts())));
  const gifts = catalog
    .filter((p) => Number(productPrice(p).amount) <= 75)
    .slice(0, 6);

  const kitProducts = (await Promise.all(KIT_HANDLES.map((h) => getProduct(h))))
    .filter((p): p is NonNullable<typeof p> => Boolean(p) && p!.availableForSale);
  const kitLines = kitProducts
    .map((p) => p.variants.find((v) => v.availableForSale))
    .filter(Boolean)
    .map((v) => ({ merchandiseId: v!.id, quantity: 1 }));
  const kitTotal = kitProducts.reduce((s, p) => s + Number(productPrice(p).amount), 0);
  const kitSale = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(kitTotal * 0.9);

  return (
    <>
      <MetaLandingTracker contentName="Meta Fathers Day LP" contentIds={gifts.map((p) => p.id)} />

      <div className="urgency-strip" role="banner">
        <strong>Father&apos;s Day · June 21</strong> — {daysLeft} day{daysLeft !== 1 ? 's' : ''} left · WYX10 saves 10%
      </div>

      <section className="meta-lp-banner">
        <Image src={imageMap.hero} alt="Weekend golfers on course" width={1200} height={800} priority sizes="100vw" />
      </section>

      <section className="deal-hero">
        <div>
          <p className="eyebrow">Father&apos;s Day 2026</p>
          <h1>Golf Gifts Dad Will Actually Use.</h1>
          <p>Skip the novelty polo. Give him bag upgrades he&apos;ll reach for every round — towel, marker, grip tape, groove tool, and more.</p>
          <div className="actions">
            {kitLines.length > 0 && (
              <KitAddButton
                lines={kitLines}
                label="Add Bag Kit"
                buyNowLabel={`Buy Kit — ${kitSale}`}
                showBuyNow
              />
            )}
            <Link className="button secondary dark" href="#fd-products">Browse Picks</Link>
          </div>
        </div>
        <aside className="share-card">
          <p className="eyebrow">Launch Code</p>
          <h2>WYX10</h2>
          <p>10% off at checkout. Best on the Bag Upgrade Kit — five fixes, one order, under $80 after code.</p>
        </aside>
      </section>

      <section id="fd-products" className="section product-section">
        <div className="section-heading">
          <p className="eyebrow">Top Picks Under $75</p>
          <h2>Shop Dad Gifts.</h2>
        </div>
        <div className="editorial-product-grid">
          {gifts.map((product, i) => <EditorialProductCard key={product.id} product={product} featured={i === 0} />)}
        </div>
      </section>

      <section className="dark-section reveal">
        <h2>Running Out of Time?</h2>
        <p>Small accessories ship in lightweight packaging. Order the Bag Upgrade Kit now — WYX10 applied at checkout.</p>
        {kitLines.length > 0 && (
          <div style={{ marginTop: '1rem' }}>
            <KitAddButton lines={kitLines} label="Add Kit To Bag" buyNowLabel="Buy Kit Now" showBuyNow />
          </div>
        )}
      </section>
    </>
  );
}