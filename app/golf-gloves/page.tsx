import type { Metadata } from 'next';
import Link from 'next/link';
import { EmailCapture } from '@/components/EmailCapture';
import { ProductCard } from '@/components/ProductCard';
import { availableProducts, categoryFor } from '@/lib/catalog';
import { siteUrl } from '@/lib/feed';
import { coreMerchProducts } from '@/lib/merchandisingFilters';
import { sortByQuality } from '@/lib/productQuality';
import { getProducts } from '@/lib/shopify/products';

export const revalidate = 300;

export const metadata: Metadata = {
  title: 'Golf Gloves | WYX Golf Supply Co.',
  description: 'Shop the live WYX edit of golf gloves with current hand, size, price, and availability options pulled from Shopify.',
  alternates: { canonical: '/golf-gloves' },
  openGraph: {
    title: 'Golf Gloves | WYX Golf Supply Co.',
    description: 'Golf gloves selected for real rounds, with live options shown before checkout.',
    url: '/golf-gloves'
  }
};

const faqs: Array<[string, string]> = [
  ['How should a golf glove fit?', 'A golf glove should fit close to the hand without loose material at the fingertips. Use the live size and hand options on each product page, and contact WYX if you need exact measurements.'],
  ['Which hand option should I choose?', 'Most golfers wear a glove on the lead hand: left-hand glove for a right-handed golfer, and right-hand glove for a left-handed golfer. Confirm the wording shown on the selected product before ordering.'],
  ['Are sold-out sizes hidden?', 'Sold-out variants remain visible but disabled so you can see exactly which hand and size combinations are currently available.'],
  ['How does WYX10 work?', 'WYX10 requests 10% off a first order when eligible. Shopify confirms the discount before payment.']
];

export default async function GolfGlovesPage() {
  const products = sortByQuality(coreMerchProducts(availableProducts(await getProducts())))
    .filter((product) => categoryFor(product) === 'Gloves');

  return (
    <>
      <section className="deal-hero">
        <div>
          <p className="eyebrow">Golf Gloves</p>
          <h1>Golf Gloves With The Options Shown Up Front.</h1>
          <p>Choose the hand and size before adding to the bag. The products below are pulled from the current Shopify catalog, so sold-out combinations are disabled instead of being promised.</p>
          <div className="actions">
            <Link className="button primary" href="#gloves-grid">Shop Live Gloves</Link>
            <Link className="button secondary dark" href="/apparel">Shop Apparel</Link>
          </div>
        </div>
        <aside className="share-card">
          <p className="eyebrow">First Order</p>
          <h2>Try WYX10</h2>
          <p>WYX requests the 10% first-order offer automatically. Shopify confirms eligibility before payment.</p>
        </aside>
      </section>

      <section className="deal-strip" aria-label="Golf glove shopping benefits">
        <span>Live Shopify inventory</span><span>Hand options shown</span><span>Size buttons</span><span>Secure checkout</span>
      </section>

      <section id="gloves-grid" className="section product-section">
        <div className="section-heading split">
          <div><p className="eyebrow">{products.length} Live Picks</p><h2>Golf Gloves Available Now.</h2></div>
          <Link className="text-link" href="/products">Shop All WYX</Link>
        </div>
        {products.length > 0
          ? <div className="product-grid">{products.map((product) => <ProductCard key={product.id} product={product} />)}</div>
          : <p>Glove inventory is being refreshed. Browse the live shop for currently available gear.</p>}
      </section>

      <section className="section reveal" aria-labelledby="glove-faq-heading">
        <div className="section-heading"><p className="eyebrow">Quick Questions</p><h2 id="glove-faq-heading">Golf Glove FAQ.</h2></div>
        <div className="care-step-grid">
          {faqs.map(([question, answer]) => <div className="care-step-card" key={question}><strong>{question}</strong><p>{answer}</p></div>)}
        </div>
      </section>

      <EmailCapture source="golf-gloves" campaign="golf_gloves" title="GET NEW GLOVE PICKS FIRST." body="New glove options, apparel, and the products that make the WYX cut." />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: 'Golf Gloves',
        url: `${siteUrl}/golf-gloves`,
        mainEntity: products.map((product) => ({ '@type': 'Product', name: product.title, url: `${siteUrl}/products/${product.handle}`, image: product.featuredImage?.url }))
      }) }} />
    </>
  );
}
