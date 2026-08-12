import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { EmailCapture } from '@/components/EmailCapture';
import { ProductCard } from '@/components/ProductCard';
import { availableProducts } from '@/lib/catalog';
import { isImpulseProduct, productPriceLabel, siteUrl } from '@/lib/feed';
import { getProducts } from '@/lib/shopify/products';

export const revalidate = 300;

export const metadata: Metadata = {
  title: 'Golf Gear Under $60',
  description: 'Shop WYX golf gear, bag upgrades, ball markers, grips, gloves, headcovers and accessories under $60.',
  alternates: { canonical: '/deals' },
  openGraph: {
    title: 'Golf Gear Under $60 | WYX Golf Supply Co.',
    description: 'Useful golf gear, gifts and bag upgrades under $60 from the current WYX edit.',
    url: '/deals'
  }
};

export default async function Deals() {
  const catalog = availableProducts(await getProducts());
  const deals = catalog.filter(isImpulseProduct).slice(0, 12);
  const topPicks = deals.slice(0, 3);

  return (
    <>
      <section className="deal-hero">
        <div>
          <p className="eyebrow">WYX UNDER $60</p>
          <h1>SMALLER GEAR. EASY YES.</h1>
          <p>Useful golf gifts, bag upgrades and accessories that do not require a major equipment decision. First WYX order? WYX10 requests 10% off when eligible.</p>
          <div className="actions">
            <Link className="button primary" href="#deal-grid">Shop Under $60</Link>
            <Link className="button secondary dark" href="/products">Browse All Gear</Link>
          </div>
        </div>
        <div className="deal-card-stack" aria-label="Featured under-$60 picks">
          {topPicks.map((product) => (
            <Link className="deal-pick" href={`/products/${product.handle}`} key={product.id}>
              {product.featuredImage && <Image src={product.featuredImage.url} alt={product.featuredImage.altText || product.title} width={110} height={110} />}
              <span>{product.title}</span>
              <strong>{productPriceLabel(product)}</strong>
            </Link>
          ))}
        </div>
      </section>

      <section className="deal-strip" aria-label="Why shop WYX under $60">
        <span>Useful golf gifts</span>
        <span>Easy first cart</span>
        <span>Bag upgrades</span>
        <span>Available now</span>
      </section>

      <section id="deal-grid" className="section product-section">
        <div className="section-heading split">
          <div><p className="eyebrow">UNDER $60</p><h2>GOOD GEAR WITHOUT A BIG COMMITMENT.</h2></div>
          <Link className="text-link" href="/products">Shop Full Catalog</Link>
        </div>
        {deals.length ? <div className="product-grid">{deals.map((product) => <ProductCard key={product.id} product={product} />)}</div> : <p>No under-$60 picks are available right now.</p>}
      </section>

      <EmailCapture source="deals" campaign="under_60" title="GET NEW WYX VALUE PICKS FIRST." body="Useful golf accessories, gifts, and premium finds when they earn a spot." />

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org', '@type': 'CollectionPage', name: 'WYX Golf Gear Under $60', description: metadata.description,
        url: `${siteUrl}/deals`,
        mainEntity: deals.map((product) => ({ '@type': 'Product', name: product.title, url: `${siteUrl}/products/${product.handle}`, image: product.featuredImage?.url,
          offers: { '@type': 'Offer', price: product.priceRange.minVariantPrice.amount, priceCurrency: product.priceRange.minVariantPrice.currencyCode, availability: 'https://schema.org/InStock' } }))
      }) }} />
    </>
  );
}
