import type { Metadata } from 'next';
import Link from 'next/link';
import { EmailCapture } from '@/components/EmailCapture';
import { ProductCard } from '@/components/ProductCard';
import { availableProducts } from '@/lib/catalog';
import { siteUrl } from '@/lib/feed';
import { isPremiumGolfBag, sortByQuality } from '@/lib/productQuality';
import { getProducts } from '@/lib/shopify/products';

export const revalidate = 300;

export const metadata: Metadata = {
  title: 'Premium Golf Bags',
  description: 'Shop premium supplier-backed golf bags from WYX Golf Supply Co. with real product photography, live Shopify inventory, and secure checkout.',
  alternates: { canonical: '/premium-golf-bags' },
  openGraph: {
    title: 'Premium Golf Bags | WYX Golf Supply Co.',
    description: 'Real supplier-backed golf bags for players ready to upgrade the whole setup.',
    url: '/premium-golf-bags'
  }
};

export default async function PremiumGolfBags() {
  const products = sortByQuality(availableProducts(await getProducts()).filter(isPremiumGolfBag));

  return (
    <>
      <section className="collection-hero">
        <div>
          <p className="eyebrow">Premium Golf Bags</p>
          <h1>The Whole Setup Starts With The Bag.</h1>
          <p>These are higher-ticket, real supplier-backed golf bags with live inventory and real product media. They are for golfers ready to upgrade the full setup, not just add another small accessory.</p>
          <div className="actions">
            <Link className="button primary" href="#bag-grid">Shop Premium Bags</Link>
            <Link className="button secondary dark" href="/fathers-day-golf-gifts">Gift Picks</Link>
          </div>
        </div>
        <div className="collection-proof">
          <span>Real supplier inventory</span>
          <span>Premium upgrade product</span>
          <span>Secure Shopify checkout</span>
          <span>WYX10 launch code</span>
        </div>
      </section>

      <section className="deal-strip" aria-label="Premium golf bag proof points">
        <span>Real product photos</span>
        <span>Published from Shopify</span>
        <span>Premium buyer intent</span>
        <span>Supplier fulfilled</span>
      </section>

      <section id="bag-grid" className="section product-section">
        <div className="section-heading split">
          <div>
            <p className="eyebrow">{products.length} Premium Bag Picks</p>
            <h2>Upgrade The Setup.</h2>
          </div>
          <Link className="text-link" href="/products">Browse Full Supply Room</Link>
        </div>
        {products.length ? <div className="product-grid">{products.map((product) => <ProductCard key={product.id} product={product} />)}</div> : <p>Premium golf bags are syncing from Shopify.</p>}
      </section>

      <EmailCapture source="premium-golf-bags" campaign="premium_bags" title="Watching For The Right Bag?" body="Join the WYX list for premium golf bags, useful bag upgrades, and launch offers." />

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: 'Premium Golf Bags',
        description: metadata.description,
        url: `${siteUrl}/premium-golf-bags`,
        mainEntity: products.map((product) => ({
          '@type': 'Product',
          name: product.title,
          url: `${siteUrl}/products/${product.handle}`,
          image: product.featuredImage?.url,
          offers: {
            '@type': 'Offer',
            price: product.priceRange.minVariantPrice.amount,
            priceCurrency: product.priceRange.minVariantPrice.currencyCode,
            availability: 'https://schema.org/InStock'
          }
        }))
      }) }} />
    </>
  );
}
