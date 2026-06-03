import type { Metadata } from 'next';
import Link from 'next/link';
import { ProductCard } from '@/components/ProductCard';
import { availableProducts, categoryFor } from '@/lib/catalog';
import { siteUrl } from '@/lib/feed';
import { getProducts } from '@/lib/shopify/products';

export const revalidate = 300;

export const metadata: Metadata = {
  title: 'Best Golf Accessories For Your Bag',
  description: 'Shop practical golf accessories for everyday rounds: towels, tees, ball markers, headcovers, club-care tools, and putting practice aids.',
  alternates: { canonical: '/best-golf-accessories' },
  openGraph: {
    title: 'Best Golf Accessories For Your Bag',
    description: 'Practical golf accessories curated for better rounds and easier cart decisions.',
    url: '/best-golf-accessories'
  }
};

export default async function BestGolfAccessories() {
  const products = availableProducts(await getProducts())
    .filter((product) => ['Accessories', 'Club Care', 'Training Aids', 'Towels'].includes(categoryFor(product)))
    .slice(0, 12);

  return (
    <>
      <section className="collection-hero">
        <div>
          <p className="eyebrow">Best Golf Accessories</p>
          <h1>Upgrade The Bag Without Overthinking It.</h1>
          <p>These are the practical pieces golfers reach for every round: clean towels, tees, ball markers, headcovers, club-care tools, and compact practice aids.</p>
          <div className="actions">
            <Link className="button primary" href="#accessory-grid">Shop Accessories</Link>
            <Link className="button secondary dark" href="/golf-gifts-under-60">Gifts Under $60</Link>
          </div>
        </div>
        <div className="collection-proof">
          <span>Bag-ready utility</span>
          <span>Strong add-to-cart price points</span>
          <span>WYX10 launch code</span>
        </div>
      </section>
      <section id="accessory-grid" className="section product-section">
        <div className="section-heading split">
          <div>
            <p className="eyebrow">{products.length} Accessory Picks</p>
            <h2>Useful First. Good Looking Second.</h2>
          </div>
          <Link className="text-link" href="/products">Browse Everything</Link>
        </div>
        <div className="product-grid">{products.map((product) => <ProductCard key={product.id} product={product} />)}</div>
      </section>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: 'Best Golf Accessories',
        description: metadata.description,
        url: `${siteUrl}/best-golf-accessories`,
        mainEntity: products.map((product) => ({ '@type': 'Product', name: product.title, url: `${siteUrl}/products/${product.handle}`, image: product.featuredImage?.url }))
      }) }} />
    </>
  );
}
