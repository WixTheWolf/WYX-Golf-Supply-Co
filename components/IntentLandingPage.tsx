import Link from 'next/link';
import { EmailCapture } from '@/components/EmailCapture';
import { ProductCard } from '@/components/ProductCard';
import { availableProducts } from '@/lib/catalog';
import { productDescription, productPriceLabel, siteUrl } from '@/lib/feed';
import type { IntentPageConfig } from '@/lib/intentPages';
import { coreMerchProducts } from '@/lib/merchandisingFilters';
import { qualityReason, sortByQuality } from '@/lib/productQuality';
import { getProducts } from '@/lib/shopify/products';

export async function IntentLandingPage({ config }: { config: IntentPageConfig }) {
  const catalog = sortByQuality(coreMerchProducts(availableProducts(await getProducts())));
  const products = catalog.filter(config.match).slice(0, 12);
  const featured = products.slice(0, 3);

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
        <span>Trusted golf gear</span>
        <span>Mobile-first cart</span>
        <span>U.S. customer support</span>
      </section>

      <section className="section seo-guide">
        <div>
          <p className="eyebrow">Shopping Guide</p>
          <h2>How To Pick The Right One.</h2>
          <p>For this collection, WYX prioritizes products with real golf utility, clear product media, available inventory, and a reason to add them to the cart today.</p>
        </div>
        <div className="collection-copy-grid">
          <article>
            <h3>Best first pick</h3>
            <p>Choose the item that solves a common round problem: cleaner clubs, better organization, easy group gifting, or a better-looking golf fit.</p>
          </article>
          <article>
            <h3>Best cart builder</h3>
            <p>Pair a wearable piece with a small bag upgrade. Hats, towels, markers, gloves, and balls make the cart feel more intentional.</p>
          </article>
          <article>
            <h3>Best gift rule</h3>
            <p>When in doubt, avoid complicated sizing and buy useful gear under $60. It is easier to gift and more likely to make it to the course.</p>
          </article>
        </div>
      </section>

      {featured.length > 0 && <section className="section">
        <div className="section-heading split">
          <div>
            <p className="eyebrow">Recommended Starting Points</p>
            <h2>High-Confidence Picks From This Collection.</h2>
          </div>
          <Link className="text-link" href="#intent-products">See All</Link>
        </div>
        <div className="product-recommendation-grid">
          {featured.map((product) => <Link key={product.id} href={`/products/${product.handle}`}>
            <strong>{productPriceLabel(product)}</strong>
            <span>{product.title}</span>
            <span>{qualityReason(product)}</span>
          </Link>)}
        </div>
      </section>}

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

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([
        {
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          name: config.title,
          description: config.metaDescription,
          url: `${siteUrl}/${config.slug}`,
          mainEntity: {
            '@type': 'ItemList',
            itemListElement: products.map((product, index) => ({
              '@type': 'ListItem',
              position: index + 1,
              url: `${siteUrl}/products/${product.handle}`,
              item: {
                '@type': 'Product',
                name: product.title,
                description: productDescription(product),
                url: `${siteUrl}/products/${product.handle}`,
                image: product.featuredImage?.url,
                offers: {
                  '@type': 'Offer',
                  price: product.priceRange.minVariantPrice.amount,
                  priceCurrency: product.priceRange.minVariantPrice.currencyCode,
                  availability: 'https://schema.org/InStock'
                }
              }
            }))
          }
        },
        {
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: config.faq.map(([question, answer]) => ({
            '@type': 'Question',
            name: question,
            acceptedAnswer: { '@type': 'Answer', text: answer }
          }))
        },
        {
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
            { '@type': 'ListItem', position: 2, name: config.title, item: `${siteUrl}/${config.slug}` }
          ]
        }
      ]) }} />
    </>
  );
}
