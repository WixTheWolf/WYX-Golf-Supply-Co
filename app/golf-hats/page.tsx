import type { Metadata } from 'next';
import Link from 'next/link';
import { ProductCard } from '@/components/ProductCard';
import { availableProducts } from '@/lib/catalog';
import { departmentProducts } from '@/lib/merchandisingCategories';
import { coreMerchProducts } from '@/lib/merchandisingFilters';
import { sortByQuality } from '@/lib/productQuality';
import { getProducts } from '@/lib/shopify/products';

export const revalidate = 300;

export const metadata: Metadata = {
  title: 'Golf Hats',
  description: 'Performance caps, rope hats, and sun coverage for the course. WYX10 saves 10%.',
  alternates: { canonical: '/golf-hats' }
};

export default async function GolfHatsPage() {
  const catalog = sortByQuality(coreMerchProducts(availableProducts(await getProducts())));
  const products = departmentProducts(catalog, 'Hats');

  return (
    <>
      <section className="page-hero compact">
        <p className="eyebrow">Hats</p>
        <h1>Course-ready caps.</h1>
        <p>Structured performance hats, rope trims, and sun coverage built for long rounds and clean weekend style.</p>
      </section>

      <section className="section product-section">
        {products.length ? (
          <div className="product-grid">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <p>No hats are live yet. Browse apparel and accessories while the next hat drop publishes.</p>
        )}
        <div className="actions">
          <Link className="button secondary" href="/golf-apparel">Apparel</Link>
          <Link className="button primary" href="/products?category=Headwear">All headwear</Link>
        </div>
      </section>
    </>
  );
}