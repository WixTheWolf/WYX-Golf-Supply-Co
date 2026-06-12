import type { Metadata } from 'next';
import Link from 'next/link';
import { EmailCapture } from '@/components/EmailCapture';
import { ProductCard } from '@/components/ProductCard';
import { availableProducts } from '@/lib/catalog';
import { productPrice, siteUrl } from '@/lib/feed';
import { coreMerchProducts } from '@/lib/merchandisingFilters';
import { getProducts } from '@/lib/shopify/products';

export const revalidate = 300;

export const metadata: Metadata = {
  title: 'First Sale Launch Offer',
  description: 'A focused WYX Golf Supply Co. launch offer for giftable golf gear, bag upgrades, and under-$60 golf essentials.',
  alternates: { canonical: '/first-sale' },
  openGraph: {
    title: 'First Sale Launch Offer | WYX Golf Supply Co.',
    description: 'A focused launch offer for giftable golf gear, bag upgrades, and under-$60 golf essentials. Use WYX10 for 10% off.',
    url: '/first-sale'
  }
};

const preferredHandles = [
  'blue-ridge-golf-co-golf-towels',
  'two-sided-metal-golf-ball-marker-5-color-combo-pack',
  'three-rail-ball-marker',
  'glove-accessory-caddie-gray',
  'stick-grips-golf-camo-golf-grip',
  'shockd-golf-balls',
  'pulse-golf-overgrip-tape',
  'park-paisley-womens-gold-golf-glove',
  'classic-leather-edition-walnut-brown-midnight-black',
  'topographic-edition-pure-white-embroidered-carolina-blue'
];

export default async function FirstSale() {
  const products = coreMerchProducts(availableProducts(await getProducts()));
  const picks = preferredHandles.flatMap((handle) => products.find((product) => product.handle === handle) ?? []).slice(0, 6);
  const fallback = products.filter((product) => Number(productPrice(product).amount) <= 60).slice(0, 6);
  const featured = picks.length >= 3 ? picks : fallback;
  const shareUrl = `${siteUrl}/first-sale`;

  return (
    <>
      <section className="first-sale-hero">
        <div>
          <p className="eyebrow">WYX Launch</p>
          <h1>Help Launch WYX Golf Supply Co.</h1>
          <p>We're building a golf shop around useful bag upgrades, gift-ready picks, and small accessories golfers actually use. Use <strong>WYX10</strong> for 10% off your first order.</p>
          <div className="actions">
            <Link className="button primary" href="#first-sale-products">Shop The Launch Picks</Link>
            <Link className="button secondary dark" href="/deals">See All Deals</Link>
          </div>
        </div>
        <aside className="share-card">
          <p className="eyebrow">Share WYX With A Golf Buddy</p>
          <h2>Copy/Paste This</h2>
          <p>WYX Golf Supply Co. just launched with useful golf towels, markers, grips, gloves, balls, hats, apparel, and bag accessories. Use WYX10 for 10% off your first order.</p>
          <p><strong>Share link:</strong><br /><span>{shareUrl}</span></p>
        </aside>
      </section>

      <section className="deal-strip" aria-label="Launch offer benefits">
        <span>Use WYX10 today</span>
        <span>Under-$60 picks</span>
        <span>Easy first cart</span>
        <span>Useful golf gear</span>
      </section>

      <section id="first-sale-products" className="section product-section">
        <div className="section-heading split">
          <div>
            <p className="eyebrow">Best First-Order Picks</p>
            <h2>Start Here.</h2>
          </div>
          <Link className="text-link" href="/products">Browse Full Catalog</Link>
        </div>
        {featured.length ? <div className="product-grid">{featured.map((product) => <ProductCard key={product.id} product={product} />)}</div> : <p>Launch picks are being prepared.</p>}
      </section>

      <EmailCapture source="first-sale" campaign="first_sale_launch_list" title="Not Ready To Buy Yet?" body="Join the launch list and keep WYX10 close. We will send useful golf drops, deals, and bag-builder picks." />
    </>
  );
}
