import type { Metadata } from 'next';
import Link from 'next/link';
import { EmailCapture } from '@/components/EmailCapture';
import { ProductCard } from '@/components/ProductCard';
import { availableProducts } from '@/lib/catalog';
import { productPrice, siteUrl } from '@/lib/feed';
import { campaignUrl } from '@/lib/marketing';
import { coreMerchProducts } from '@/lib/merchandisingFilters';
import { getProducts } from '@/lib/shopify/products';

export const revalidate = 300;

export const metadata: Metadata = {
  title: 'Golf Gifts Under $60 | WYX Golf Supply Co.',
  description: 'Shop the current WYX edit of useful golf gifts under $60, including gloves, headcovers, towels, markers, and compact bag accessories.',
  alternates: { canonical: '/golf-gifts-under-60' },
  openGraph: {
    title: 'Golf Gifts Under $60',
    description: 'Useful golf gifts and bag upgrades selected for weekend golfers.',
    url: '/golf-gifts-under-60'
  }
};

export default async function GolfGiftsUnder60() {
  const products = coreMerchProducts(availableProducts(await getProducts()))
    .filter((product) => Number(productPrice(product).amount) <= 60)
    .slice(0, 12);

  return (
    <>
      <section className="deal-hero">
        <div>
          <p className="eyebrow">Golf Gifts Under $60</p>
          <h1>Golf Gifts Under $60 That Actually Get Used.</h1>
          <p>Easy golf gifts for players who already have enough polos and bad swing advice. Start with gloves, headcovers, towels, markers, and small bag upgrades that are live now.</p>
          <div className="actions">
            <Link className="button primary" href="#gift-grid">Shop Gift Picks</Link>
            <Link className="button secondary dark" href="/products">Browse The Live Edit</Link>
          </div>
        </div>
        <aside className="share-card">
          <p className="eyebrow">Launch Code</p>
          <h2>WYX10 Saves 10%</h2>
          <p>Use the launch code at checkout. Great for golfers, coaches, league partners, and last-minute gifts.</p>
        </aside>
      </section>
      <section className="deal-strip" aria-label="Gift shopping benefits">
        <span>Under-$60 golf gifts</span>
        <span>Easy gift picks</span>
        <span>Useful bag upgrades</span>
        <span>Fast first-order picks</span>
      </section>
      <section id="gift-grid" className="section product-section">
        <div className="section-heading split">
          <div>
            <p className="eyebrow">{products.length} Giftable Picks</p>
            <h2>Ready To Add To Cart.</h2>
          </div>
          <Link className="text-link" href={campaignUrl('/products', 'golf_gifts_under_60')}>Shop All WYX</Link>
        </div>
        <div className="product-grid">{products.map((product) => <ProductCard key={product.id} product={product} />)}</div>
      </section>
      <section className="section reveal" aria-labelledby="tiers-heading">
        <div className="section-heading">
          <p className="eyebrow">Other Budgets</p>
          <h2 id="tiers-heading">All Price Ranges.</h2>
        </div>
        <div className="care-step-grid">
          <Link href="/products?category=Accessories" className="care-step-card" style={{ textDecoration: 'none' }}>
            <strong>Accessories</strong>
            <p>Small bag upgrades with no apparel sizing decision.</p>
          </Link>
          <Link href="/golf-headcovers" className="care-step-card" style={{ textDecoration: 'none' }}>
            <strong>Headcovers</strong>
            <p>Driver and putter covers with more personality.</p>
          </Link>
          <Link href="/golf-gloves" className="care-step-card" style={{ textDecoration: 'none' }}>
            <strong>Golf Gloves</strong>
            <p>Live hand and size options shown before checkout.</p>
          </Link>
          <Link href="/apparel" className="care-step-card" style={{ textDecoration: 'none' }}>
            <strong>Apparel</strong>
            <p>Course-to-weekend pieces from the current WYX edit.</p>
          </Link>
        </div>
      </section>

      <section className="section reveal" aria-labelledby="links-heading">
        <div className="section-heading">
          <p className="eyebrow">More Gift Ideas</p>
          <h2 id="links-heading">Golf Gifts by Recipient.</h2>
        </div>
        <div className="care-step-grid">
          <Link href="/golf-trip-gear" className="care-step-card" style={{ textDecoration: 'none' }}><strong>Golf Trip Gear</strong><p>Packable picks for the round and the flight home.</p></Link>
          <Link href="/products?category=Accessories" className="care-step-card" style={{ textDecoration: 'none' }}><strong>Easy Group Gifts</strong><p>Non-sized accessories that are simpler to buy for a foursome.</p></Link>
          <Link href="/weekend-golfer-bag-upgrade-kit" className="care-step-card" style={{ textDecoration: 'none' }}><strong>The Bag Upgrade Kit</strong><p>Five live products grouped into one editable cart.</p></Link>
          <Link href="/golf-gifts" className="care-step-card" style={{ textDecoration: 'none' }}><strong>The Full Gift Edit</strong><p>All currently selected WYX gift picks.</p></Link>
        </div>
      </section>

      <EmailCapture source="golf-gifts-under-60" campaign="golf_gifts_launch_list" title="Need Golf Gift Ideas Later?" body="Join the WYX list for under-$60 gift picks, useful bag upgrades, and launch offers." />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: 'Golf Gifts Under $60',
        description: metadata.description,
        url: `${siteUrl}/golf-gifts-under-60`,
        mainEntity: products.map((product) => ({ '@type': 'Product', name: product.title, url: `${siteUrl}/products/${product.handle}`, image: product.featuredImage?.url }))
      }) }} />
    </>
  );
}
