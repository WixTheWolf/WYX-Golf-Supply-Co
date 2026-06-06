import type { Metadata } from 'next';
import Link from 'next/link';
import { EmailCapture } from '@/components/EmailCapture';
import { ProductCard } from '@/components/ProductCard';
import { availableProducts, categoryFor } from '@/lib/catalog';
import { productPrice } from '@/lib/feed';
import { siteUrl } from '@/lib/marketing';
import { productQualityScore, sortByQuality } from '@/lib/productQuality';
import { getProducts } from '@/lib/shopify/products';

export const revalidate = 300;

export const metadata: Metadata = {
  title: 'Popular Golf Products 2026',
  description: 'Shop popular 2026 golf products from WYX Golf Supply Co., including useful golf gifts, towels, gloves, grips, ball markers, headcovers, and bag accessories.',
  alternates: { canonical: '/popular-golf-products-2026' },
  openGraph: {
    title: 'Popular Golf Products 2026 | WYX Golf Supply Co.',
    description: 'Useful golf gifts and bag upgrades selected for weekend golfers.',
    url: '/popular-golf-products-2026'
  }
};

const scoutingBoard = [
  ["Women's Golf Apparel", 'Stretch skorts, polos, hoodies, and everyday golf layers with easy sizing and strong lifestyle appeal.'],
  ['Useful Gifts Under $50', 'Ball markers, towels, gloves, tees, divot tools, club-care tools, and small upgrades golfers actually keep in the bag.'],
  ['Club-Care Add-Ons', 'Brush cleaners, groove tools, microfiber towels, and weekly bag-reset products with strong add-to-cart potential.'],
  ['Practice & Training Aids', 'Putting mirrors, alignment tools, range-session helpers, and compact scoring-improvement gear.'],
  ['Headcovers & Bag Style', 'Driver headcovers, leather-style details, valuables pouches, and sharp accessories that make a bag feel intentional.']
] as const;

function scoreProduct(product: Awaited<ReturnType<typeof getProducts>>[number]) {
  const price = Number(productPrice(product).amount);
  const category = categoryFor(product);
  let score = productQualityScore(product);
  if (price <= 60) score += 3;
  if (price <= 35) score += 2;
  if (['Accessories', 'Towels', 'Gloves', 'Grips', 'Golf Balls'].includes(category)) score += 2;
  if (/marker|towel|glove|grip|headcover|ball|caddie/i.test(product.title)) score += 2;
  return score;
}

export default async function PopularGolfProducts2026() {
  const catalog = sortByQuality(availableProducts(await getProducts()));
  const topProducts = catalog.sort((a, b) => scoreProduct(b) - scoreProduct(a)).slice(0, 9);
  const underSixty = topProducts.filter((product) => Number(productPrice(product).amount) <= 60);

  return (
    <>
      <section className="collection-hero">
        <div>
          <p className="eyebrow">Popular Golf Gear</p>
          <h1>Popular Golf Products Worth Putting In The Bag.</h1>
          <p>Start with the products golfers reach for often: useful gifts, course essentials, bag upgrades, towels, gloves, grips, ball markers, headcovers, and compact practice gear.</p>
          <div className="actions">
            <Link className="button primary" href="#popular-picks">Shop Popular Picks</Link>
            <Link className="button secondary dark" href="/deals">Use WYX10</Link>
          </div>
        </div>
        <div className="collection-proof">
          <span>Useful golf gear</span>
          <span>Secure checkout</span>
          <span>WYX10 launch discount</span>
          <span>Built for everyday rounds</span>
        </div>
      </section>

      <section className="deal-strip" aria-label="Popular golf product focus">
        <span>Gifts under $60</span>
        <span>Small bag upgrades</span>
        <span>Useful accessories</span>
        <span>Easy first cart</span>
      </section>

      <section id="popular-picks" className="section product-section">
        <div className="section-heading split">
          <div>
            <p className="eyebrow">Best Current Picks</p>
            <h2>Ready To Buy Now.</h2>
          </div>
          <Link className="text-link" href="/products">Browse Full Catalog</Link>
        </div>
        {topProducts.length ? <div className="product-grid">{topProducts.map((product) => <ProductCard key={product.id} product={product} />)}</div> : <p>Products are being prepared.</p>}
      </section>

      <section className="section">
        <div className="section-heading split">
          <div>
            <p className="eyebrow">Better Bag Basics</p>
            <h2>Why Golfers Keep These Around.</h2>
          </div>
          <Link className="text-link" href="/golf-gifts-under-60">{underSixty.length} Under-$60 Picks</Link>
        </div>
        <div className="intent-grid">
          {scoutingBoard.map(([title, description]) => (
            <article className="marketing-card" key={title}>
              <span>{title}</span>
              <p>{description}</p>
            </article>
          ))}
        </div>
      </section>

      <EmailCapture source="popular-products-2026" campaign="popular_golf_products_2026" title="Want The Next WYX Drop?" body="Join the list for fresh golf accessories, useful finds, and launch discount reminders." />

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: 'Popular Golf Products 2026',
        description: metadata.description,
        url: `${siteUrl}/popular-golf-products-2026`,
        mainEntity: topProducts.map((product) => ({
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
