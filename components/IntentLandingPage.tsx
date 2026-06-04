import Link from 'next/link';
import { EmailCapture } from '@/components/EmailCapture';
import { ProductCard } from '@/components/ProductCard';
import { availableProducts } from '@/lib/catalog';
import { siteUrl } from '@/lib/feed';
import type { IntentPageConfig } from '@/lib/intentPages';
import { sortByQuality } from '@/lib/productQuality';
import { getProducts } from '@/lib/shopify/products';

export async function IntentLandingPage({ config }: { config: IntentPageConfig }) {
  const catalog = sortByQuality(availableProducts(await getProducts()));
  const products = catalog.filter(config.match).slice(0, 12);

  return (
    <>
      <section className="collection-hero">
        <div>
          <p className="eyebrow">{config.eyebrow}</p>
          <h1>{config.title}</h1>
          <p>{config.description}</p>
          <div className="actions">
            <Link className="button primary" href="#intent-products">{config.primaryCta}</Link>
            <Link className="button secondary dark" href={config.secondaryHref}>{config.secondaryCta}</Link>
          </div>
        </div>
        <div className="collection-proof">
          {config.proof.map((item) => <span key={item}>{item}</span>)}
        </div>
      </section>

      <section className="deal-strip" aria-label={`${config.title} benefits`}>
        <span>WYX10 launch offer</span>
        <span>Trusted golf suppliers</span>
        <span>Mobile-first cart</span>
        <span>U.S. customer support</span>
      </section>

      <section id="intent-products" className="section product-section">
        <div className="section-heading split">
          <div>
            <p className="eyebrow">{products.length} Current Picks</p>
            <h2>Ready To Add To The Bag.</h2>
          </div>
          <Link className="text-link" href="/products">Browse Full Shop</Link>
        </div>
        {products.length ? <div className="product-grid">{products.map((product) => <ProductCard key={product.id} product={product} />)}</div> : <p>Products are being prepared. Browse the full shop for current picks.</p>}
      </section>

      <section className="section faq-section">
        <p className="eyebrow">Quick Questions</p>
        <h2>Before You Buy.</h2>
        <div className="detail-list">
          {config.faq.map(([question, answer]) => <details key={question}><summary>{question}</summary><p>{answer}</p></details>)}
        </div>
      </section>

      <EmailCapture source={config.slug} campaign={`${config.slug}_intent`} title="Want More Useful Golf Picks?" body="Join the WYX list for launch offers, gift ideas, and bag upgrades golfers actually use." />

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: config.title,
        description: config.metaDescription,
        url: `${siteUrl}/${config.slug}`,
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
