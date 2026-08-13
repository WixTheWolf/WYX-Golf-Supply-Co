import type { Metadata } from 'next';
import Link from 'next/link';
import { EmailCapture } from '@/components/EmailCapture';
import { ProductCard } from '@/components/ProductCard';
import { availableProducts } from '@/lib/catalog';
import { siteUrl } from '@/lib/feed';
import { coreMerchProducts } from '@/lib/merchandisingFilters';
import { sortByQuality } from '@/lib/productQuality';
import { getProducts } from '@/lib/shopify/products';
import type { Product } from '@/types/shopify';

export const revalidate = 300;

export const metadata: Metadata = {
  title: 'Golf Headcovers | WYX Golf Supply Co.',
  description: 'Shop the live WYX edit of driver and putter headcovers with current images, prices, options, and availability.',
  alternates: { canonical: '/golf-headcovers' },
  openGraph: {
    title: 'Golf Headcovers | WYX Golf Supply Co.',
    description: 'Driver and putter headcovers from the current WYX edit.',
    url: '/golf-headcovers'
  }
};

const faqs: Array<[string, string]> = [
  ['What should I check before buying a headcover?', 'Confirm the club type and any size or style option on the live product page. Driver, fairway, blade-putter, and mallet-putter covers are not interchangeable.'],
  ['Are these headcovers actually available?', 'This page is built from the live curated Shopify catalog. If a product or option is sold out, it cannot be added to the bag.'],
  ['Is a headcover a good golf gift?', 'Yes, when the cover type matches the golfer’s club. It avoids apparel sizing while still adding personality to the bag.'],
  ['How does WYX10 work?', 'WYX10 requests 10% off a first order when eligible. Shopify confirms the discount before payment.']
];

function isHeadcover(product: Product) {
  const text = [product.title, product.description, product.productType, ...(product.tags || [])].join(' ');
  return /head\s?cover|putter cover|driver cover|mallet cover|fairway cover/i.test(text);
}

export default async function GolfHeadcoversPage() {
  const products = sortByQuality(coreMerchProducts(availableProducts(await getProducts())))
    .filter(isHeadcover);

  return (
    <>
      <section className="deal-hero">
        <div>
          <p className="eyebrow">Golf Headcovers</p>
          <h1>Headcovers Worth Looking At Every Round.</h1>
          <p>Driver and putter covers with real personality, pulled from the current WYX catalog. Review the live club type and option before adding one to the bag.</p>
          <div className="actions">
            <Link className="button primary" href="#headcovers-grid">Shop Live Headcovers</Link>
            <Link className="button secondary dark" href="/golf-gifts">Shop Golf Gifts</Link>
          </div>
        </div>
        <aside className="share-card">
          <p className="eyebrow">The Fit Check</p>
          <h2>Match The Club Type</h2>
          <p>Driver, fairway, blade-putter, and mallet-putter covers fit differently. The live product option is the source of truth.</p>
        </aside>
      </section>

      <section className="deal-strip" aria-label="Headcover shopping benefits">
        <span>Live Shopify inventory</span><span>Real product imagery</span><span>Club type up front</span><span>Secure checkout</span>
      </section>

      <section id="headcovers-grid" className="section product-section">
        <div className="section-heading split">
          <div><p className="eyebrow">{products.length} Live Picks</p><h2>Headcovers Available Now.</h2></div>
          <Link className="text-link" href="/products">Shop All WYX</Link>
        </div>
        {products.length > 0
          ? <div className="product-grid">{products.map((product) => <ProductCard key={product.id} product={product} />)}</div>
          : <p>Headcover inventory is being refreshed. Browse the live shop for currently available gear.</p>}
      </section>

      <section className="section reveal" aria-labelledby="headcover-faq-heading">
        <div className="section-heading"><p className="eyebrow">Quick Questions</p><h2 id="headcover-faq-heading">Golf Headcover FAQ.</h2></div>
        <div className="care-step-grid">
          {faqs.map(([question, answer]) => <div className="care-step-card" key={question}><strong>{question}</strong><p>{answer}</p></div>)}
        </div>
      </section>

      <EmailCapture source="golf-headcovers" campaign="golf_headcovers" title="GET NEW HEADCOVERS FIRST." body="New headcovers, gifts, trip gear, and the products that make the WYX cut." />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: 'Golf Headcovers',
        url: `${siteUrl}/golf-headcovers`,
        mainEntity: products.map((product) => ({ '@type': 'Product', name: product.title, url: `${siteUrl}/products/${product.handle}`, image: product.featuredImage?.url }))
      }) }} />
    </>
  );
}
