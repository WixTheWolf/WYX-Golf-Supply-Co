import type { Metadata } from 'next';
import Link from 'next/link';
import { EmailCapture } from '@/components/EmailCapture';
import { ProductCard } from '@/components/ProductCard';
import { availableProducts, categoryFor } from '@/lib/catalog';
import { productPrice, siteUrl } from '@/lib/feed';
import { productQualityScore } from '@/lib/productQuality';
import { getProducts } from '@/lib/shopify/products';

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Father's Day Golf Gifts 2026",
  description: "Shop Father's Day golf gifts for 2026 from WYX Golf Supply Co., including golf towels, gloves, ball markers, grips, headcovers, golf balls, and useful bag upgrades.",
  alternates: { canonical: '/fathers-day-golf-gifts' },
  openGraph: {
    title: "Father's Day Golf Gifts 2026 | WYX Golf Supply Co.",
    description: 'Useful golf gifts for Dad with practical bag upgrades and launch code WYX10.',
    url: '/fathers-day-golf-gifts'
  }
};

function dadGiftScore(product: Awaited<ReturnType<typeof getProducts>>[number]) {
  const price = Number(productPrice(product).amount);
  const category = categoryFor(product);
  let score = productQualityScore(product);
  if (price <= 60) score += 4;
  if (price <= 35) score += 2;
  if (['Towels', 'Accessories', 'Golf Balls', 'Gloves', 'Grips'].includes(category)) score += 3;
  if (/marker|towel|glove|grip|headcover|ball|caddie|bag/i.test(product.title)) score += 2;
  return score;
}

export default async function FathersDayGolfGifts() {
  const products = availableProducts(await getProducts()).sort((a, b) => dadGiftScore(b) - dadGiftScore(a)).slice(0, 12);
  const underSixty = products.filter((product) => Number(productPrice(product).amount) <= 60).length;

  return (
    <>
      <section className="deal-hero">
        <div>
          <p className="eyebrow">Father's Day 2026</p>
          <h1>Golf Gifts Dad Will Actually Use.</h1>
          <p>Father's Day lands Sunday, June 21, 2026. WYX is pushing useful golf gifts now: towels, ball markers, gloves, grips, golf balls, headcovers, and bag upgrades for real rounds.</p>
          <div className="actions">
            <Link className="button primary" href="#dad-gift-grid">Shop Dad Gifts</Link>
            <Link className="button secondary dark" href="/golf-gifts-under-60">Under $60 Picks</Link>
          </div>
        </div>
        <aside className="share-card">
          <p className="eyebrow">Launch Code</p>
          <h2>Use WYX10</h2>
          <p>Take 10% off at checkout during the launch window. Best bet: build a small gift bundle with a towel, marker, glove, or ball restock.</p>
        </aside>
      </section>

      <section className="deal-strip" aria-label="Father's Day shopping benefits">
        <span>Father's Day June 21</span>
        <span>{underSixty} under-$60 picks</span>
        <span>Useful golf gifts</span>
        <span>Easy gift bundle</span>
      </section>

      <section id="dad-gift-grid" className="section product-section">
        <div className="section-heading split">
          <div>
            <p className="eyebrow">Giftable Picks</p>
            <h2>Start With The Easy Wins.</h2>
          </div>
          <Link className="text-link" href="/popular-golf-products-2026">Popular Golf Products</Link>
        </div>
        {products.length ? <div className="product-grid">{products.map((product) => <ProductCard key={product.id} product={product} />)}</div> : <p>Products are syncing from Shopify.</p>}
      </section>

      <EmailCapture source="fathers-day-golf-gifts" campaign="fathers_day_2026" title="Need A Golf Gift Reminder?" body="Join the WYX list for Father's Day golf picks, launch code reminders, and useful bag upgrades." />

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: "Father's Day Golf Gifts 2026",
        description: metadata.description,
        url: `${siteUrl}/fathers-day-golf-gifts`,
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
