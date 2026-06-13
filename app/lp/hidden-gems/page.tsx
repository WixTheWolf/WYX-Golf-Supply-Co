import type { Metadata } from 'next';
import Link from 'next/link';
import { EditorialProductCard } from '@/components/EditorialProductCard';
import { MetaLandingTracker } from '@/components/MetaLandingTracker';
import { EmailCapture } from '@/components/EmailCapture';
import { availableProducts } from '@/lib/catalog';
import { coreMerchProducts } from '@/lib/merchandisingFilters';
import { sortByQuality } from '@/lib/productQuality';
import { getProducts } from '@/lib/shopify/products';

export const revalidate = 300;

export const metadata: Metadata = {
  title: 'Cart Upgrades & Training Aids — WYX Hidden Gems',
  description: 'Golf accessories you didn\'t know you needed: cart phone mount, divot board, chipping net, ball retriever. WYX10 saves 10% on your first order.',
  robots: { index: false, follow: true },
  alternates: { canonical: '/hidden-gems' }
};

const proof = [
  'WYX10 — 10% off first order',
  'Secure Shopify checkout',
  '30-day Bag Test Promise',
  'US shipping shown at checkout'
];

export default async function MetaHiddenGemsLandingPage() {
  const catalog = sortByQuality(coreMerchProducts(availableProducts(await getProducts())));
  const gems = catalog
    .filter((p) => (p.tags || []).some((t) => t.toLowerCase() === 'hidden-gem'))
    .slice(0, 6);
  const fallback = catalog
    .filter((p) => /cart|retriever|chipping|divot|putting arc|cup holder/i.test(`${p.title} ${p.handle}`))
    .slice(0, 6);
  const products = gems.length ? gems : fallback;

  return (
    <>
      <MetaLandingTracker contentName="Meta Hidden Gems LP" contentIds={products.map((p) => p.id)} />
      <section className="deal-hero">
        <div>
          <p className="eyebrow">WYX Hidden Gems</p>
          <h1>The Cart Upgrades Golfers Copy After One Round.</h1>
          <p>Phone mount. Cup holders. Divot board. Chipping net. Ball retriever. Small gear that fixes visible problems — under $50 each. <strong>WYX10</strong> saves 10% at checkout.</p>
          <div className="actions">
            <Link className="button primary" href="#lp-products">Shop Hidden Gems</Link>
          </div>
          <div className="collection-proof" style={{ marginTop: '1.25rem' }}>
            {proof.map((item) => <span key={item}>{item}</span>)}
          </div>
        </div>
      </section>

      <section id="lp-products" className="section product-section">
        <div className="section-heading">
          <p className="eyebrow">In Stock Now</p>
          <h2>Pick Your First Upgrade.</h2>
        </div>
        <div className="editorial-product-grid">
          {products.map((product, index) => (
            <EditorialProductCard key={product.id} product={product} featured={index === 0} />
          ))}
        </div>
      </section>

      <section className="dark-section reveal">
        <p className="eyebrow">Why WYX</p>
        <h2>If It Doesn&apos;t Pass The Bag Test, It Doesn&apos;t Ship.</h2>
        <p>We pull gear apart the way weekend golfers actually use it — cart, pocket, rain, backyard. No junk catalog. No fake reviews.</p>
        <div className="actions" style={{ marginTop: '1rem' }}>
          <Link className="button secondary dark" href="/the-bag-test">The Bag Test</Link>
        </div>
      </section>

      <EmailCapture
        source="meta-lp-hidden-gems"
        campaign="meta_hidden_gems_lead"
        title="Get the next hidden gem before ads do."
        body="One email when we drop new cart upgrades and training aids. WYX10 included."
      />
    </>
  );
}