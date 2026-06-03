import type { Metadata } from 'next';
import Link from 'next/link';
import { EmailCapture } from '@/components/EmailCapture';
import { ProductCard } from '@/components/ProductCard';
import { availableProducts } from '@/lib/catalog';
import { imageMap } from '@/lib/demo';
import { isImpulseProduct, productPriceLabel, siteUrl } from '@/lib/feed';
import { getProducts } from '@/lib/shopify/products';

export const revalidate = 300;

export const metadata: Metadata = {
  title: 'Golf Deals Under $60',
  description: 'Shop WYX Golf Supply Co. golf deals, bag upgrades, ball markers, grips, gloves, and accessories under $60 with secure Shopify checkout.'
};

export default async function Deals() {
  const catalog = availableProducts(await getProducts());
  const deals = catalog.filter(isImpulseProduct).slice(0, 12);
  const topPicks = deals.slice(0, 3);

  return (
    <>
      <section className="deal-hero">
        <div>
          <p className="eyebrow">WYX Launch Deals</p>
          <h1>Golf Finds Under $60.</h1>
          <p>Fast cart builders, bag upgrades, and giftable golf gear selected for low-friction checkout. Use code <strong>WYX10</strong> for 10% off at Shopify checkout.</p>
          <div className="actions">
            <Link className="button primary" href="#deal-grid">Shop The Deals</Link>
            <Link className="button secondary dark" href="/products">Browse All Gear</Link>
          </div>
        </div>
        <div className="deal-card-stack" aria-label="Featured launch deal picks">
          {topPicks.map((product) => (
            <Link className="deal-pick" href={`/products/${product.handle}`} key={product.id}>
              {product.featuredImage && <img src={product.featuredImage.url} alt={product.featuredImage.altText || product.title} />}
              <span>{product.title}</span>
              <strong>{productPriceLabel(product)}</strong>
            </Link>
          ))}
        </div>
      </section>

      <section className="deal-strip" aria-label="Why shop WYX deals">
        <span>Launch code WYX10</span>
        <span>Secure Shopify checkout</span>
        <span>Live supplier inventory</span>
        <span>Golf-first product curation</span>
      </section>

      <section id="deal-grid" className="section product-section">
        <div className="section-heading split">
          <div>
            <p className="eyebrow">Low-Friction Cart Builders</p>
            <h2>Small Gear. Easy Yes.</h2>
          </div>
          <Link className="text-link" href="/products">Shop Full Catalog</Link>
        </div>
        {deals.length ? <div className="product-grid">{deals.map((product) => <ProductCard key={product.id} product={product} />)}</div> : <p>Deal products are being synced from Shopify.</p>}
      </section>

      <EmailCapture source="deals" campaign="deals_launch_list" title="Want The Next Deal Drop?" body="Join the list for practical golf accessories, under-$60 picks, and launch offers." />

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: 'WYX Golf Deals Under $60',
        description: metadata.description,
        url: `${siteUrl}/deals`,
        image: `${siteUrl}${imageMap.hero}`,
        mainEntity: deals.map((product) => ({
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
