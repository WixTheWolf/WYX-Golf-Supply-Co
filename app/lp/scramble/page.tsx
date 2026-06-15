import type { Metadata } from 'next';
import Link from 'next/link';
import { BulkOrderInquiry } from '@/components/BulkOrderInquiry';
import { KitAddButton } from '@/components/KitAddButton';
import { MetaLandingTracker } from '@/components/MetaLandingTracker';
import { ProductCard } from '@/components/ProductCard';
import { availableProducts } from '@/lib/catalog';
import { productPrice } from '@/lib/feed';
import { formatPrice, wyx10Price } from '@/lib/pricing';
import { getProduct, getProducts } from '@/lib/shopify/products';

export const revalidate = 300;

const KIT_HANDLES = [
  'tri-fold-microfiber-golf-towel',
  'three-rail-ball-marker',
  'pulse-golf-overgrip-tape',
  'groove-sharpener-cleaner-tool',
  'glove-accessory-caddie-gray',
];

export const metadata: Metadata = {
  title: 'Golf Scramble Prizes — Tournament Prize Ideas | WYX',
  description: 'Scramble prize ideas golfers actually want — markers, towels, gloves, training aids. Bulk quotes for 4+ players. WYX10 saves 10%.',
  robots: { index: false, follow: true },
  alternates: { canonical: '/scramble-prizes' },
};

export default async function ScrambleMetaLandingPage() {
  const catalog = availableProducts(await getProducts());
  const prizes = catalog
    .filter((p) => Number(productPrice(p).amount) <= 50)
    .filter((p) => /marker|towel|glove|alignment|divot|tee/i.test(p.title))
    .slice(0, 6);

  const kitProducts = (await Promise.all(KIT_HANDLES.map((h) => getProduct(h))))
    .filter((p): p is NonNullable<typeof p> => Boolean(p) && p!.availableForSale);
  const kitLines = kitProducts
    .map((p) => p.variants.find((v) => v.availableForSale))
    .filter(Boolean)
    .map((v) => ({ merchandiseId: v!.id, quantity: 1 }));
  const kitTotal = kitProducts.reduce((s, p) => s + Number(productPrice(p).amount), 0);

  return (
    <>
      <MetaLandingTracker contentName="Meta Scramble LP" contentIds={prizes.map((p) => p.id)} />

      <section className="deal-hero">
        <div>
          <p className="eyebrow">Tournament organizers</p>
          <h1>Scramble Prizes Players Actually Want.</h1>
          <p>Skip the junk drawer prizes. Markers, towels, gloves, and bag upgrades that get used the next round — not re-gifted in 12 months.</p>
          {kitLines.length > 0 && (
            <KitAddButton
              lines={kitLines}
              label="Add Prize Kit"
              buyNowLabel={`Buy Kit — ${formatPrice(wyx10Price(kitTotal))}`}
              showBuyNow
            />
          )}
          <div className="actions" style={{ marginTop: '1rem' }}>
            <Link className="button secondary dark" href="#scramble-prizes">Browse picks</Link>
          </div>
        </div>
      </section>

      <section id="scramble-prizes" className="section product-section">
        <div className="section-heading">
          <p className="eyebrow">Under $50</p>
          <h2>Popular Prize Table Picks.</h2>
        </div>
        <div className="product-grid">
          {prizes.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>

      <section className="section reveal">
        <BulkOrderInquiry
          source="lp-scramble"
          title="Ordering 4+ prizes or full outing kits?"
          body="Scramble chair or league admin — tell us headcount, budget per player, and event date. We reply with bundle options and ship timing."
        />
      </section>
    </>
  );
}