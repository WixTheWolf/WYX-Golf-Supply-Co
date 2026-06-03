import type { Metadata } from 'next';
import Link from 'next/link';
import { ProductCard } from '@/components/ProductCard';
import { availableProducts } from '@/lib/catalog';
import { productPrice, siteUrl } from '@/lib/feed';
import { campaignUrl } from '@/lib/marketing';
import { getProducts } from '@/lib/shopify/products';

export const revalidate = 300;

export const metadata: Metadata = {
  title: 'Golf Gifts Under $60',
  description: 'Shop useful golf gifts under $60, including towels, tees, gloves, ball markers, club-care tools, and practice aids from WYX Golf Supply Co.',
  alternates: { canonical: '/golf-gifts-under-60' },
  openGraph: {
    title: 'Golf Gifts Under $60',
    description: 'Useful golf gifts and bag upgrades selected for fast checkout.',
    url: '/golf-gifts-under-60'
  }
};

export default async function GolfGiftsUnder60() {
  const products = availableProducts(await getProducts())
    .filter((product) => Number(productPrice(product).amount) <= 60)
    .slice(0, 12);

  return (
    <>
      <section className="deal-hero">
        <div>
          <p className="eyebrow">Golf Gifts Under $60</p>
          <h1>Small Golf Gifts That Actually Get Used.</h1>
          <p>Skip the novelty clutter. These are useful golf gifts: towels, tees, gloves, ball markers, club-care tools, and compact practice aids that belong in the bag.</p>
          <div className="actions">
            <Link className="button primary" href="#gift-grid">Shop Gift Picks</Link>
            <Link className="button secondary dark" href="/first-sale">Use WYX10</Link>
          </div>
        </div>
        <aside className="share-card">
          <p className="eyebrow">Launch Code</p>
          <h2>WYX10 Saves 10%</h2>
          <p>Use the launch code at Shopify checkout. Great for golfers, coaches, league partners, and last-minute gifts.</p>
        </aside>
      </section>
      <section className="deal-strip" aria-label="Gift shopping benefits">
        <span>Under-$60 golf gifts</span>
        <span>Secure Shopify checkout</span>
        <span>Useful bag upgrades</span>
        <span>Fast first-order picks</span>
      </section>
      <section id="gift-grid" className="section product-section">
        <div className="section-heading split">
          <div>
            <p className="eyebrow">{products.length} Giftable Picks</p>
            <h2>Ready To Add To Cart.</h2>
          </div>
          <Link className="text-link" href={campaignUrl('/deals', 'golf_gifts_under_60')}>Shop All Deals</Link>
        </div>
        <div className="product-grid">{products.map((product) => <ProductCard key={product.id} product={product} />)}</div>
      </section>
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
