import type { Metadata } from 'next';
import Link from 'next/link';
import { EmailCapture } from '@/components/EmailCapture';
import { ProductCard } from '@/components/ProductCard';
import { availableProducts } from '@/lib/catalog';
import { productPrice } from '@/lib/feed';
import { getProducts } from '@/lib/shopify/products';

export const revalidate = 300;

export const metadata: Metadata = {
  title: 'First Sale Launch Offer',
  description: 'A focused WYX Golf Supply Co. launch offer for giftable golf gear, bag upgrades, and under-$60 golf essentials.'
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
  const products = availableProducts(await getProducts());
  const picks = preferredHandles.flatMap((handle) => products.find((product) => product.handle === handle) ?? []).slice(0, 6);
  const fallback = products.filter((product) => Number(productPrice(product).amount) <= 60).slice(0, 6);
  const featured = picks.length >= 3 ? picks : fallback;

  return (
    <>
      <section className="first-sale-hero">
        <div>
          <p className="eyebrow">First Sale Push</p>
          <h1>Help Launch WYX Golf Supply.</h1>
          <p>We are opening the supply room with useful golf gear, quick bag upgrades, and a launch code. Use <strong>WYX10</strong> for 10% off at Shopify checkout today.</p>
          <div className="actions">
            <Link className="button primary" href="#first-sale-products">Shop The Launch Picks</Link>
            <Link className="button secondary dark" href="/deals">See All Deals</Link>
          </div>
        </div>
        <aside className="share-card">
          <p className="eyebrow">Post This Today</p>
          <h2>Quick Share Copy</h2>
          <p>New golf supply shop is live. WYX has useful bag upgrades, towels, markers, grips, gloves, and golf balls. Use WYX10 for 10% off today.</p>
          <p><strong>Share link:</strong><br /><span>https://wyx-golf-supply-co.vercel.app/first-sale</span></p>
        </aside>
      </section>

      <section className="deal-strip" aria-label="Launch offer benefits">
        <span>Use WYX10 today</span>
        <span>Under-$60 picks</span>
        <span>Secure Shopify checkout</span>
        <span>Supplier-backed fulfillment</span>
      </section>

      <section id="first-sale-products" className="section product-section">
        <div className="section-heading split">
          <div>
            <p className="eyebrow">Best First-Order Picks</p>
            <h2>Start Here.</h2>
          </div>
          <Link className="text-link" href="/products">Browse Full Catalog</Link>
        </div>
        {featured.length ? <div className="product-grid">{featured.map((product) => <ProductCard key={product.id} product={product} />)}</div> : <p>Products are syncing from Shopify.</p>}
      </section>

      <EmailCapture source="first-sale" campaign="first_sale_launch_list" title="Not Ready To Buy Yet?" body="Join the launch list and keep WYX10 close. We will send useful golf drops, deals, and bag-builder picks." />
    </>
  );
}
