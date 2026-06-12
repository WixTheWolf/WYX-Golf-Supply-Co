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
  title: 'Golf Apparel',
  description: 'Golf belts, layers, socks, and round-ready apparel. WYX10 saves 10%.',
  alternates: { canonical: '/golf-apparel' }
};

export default async function GolfApparelPage() {
  const catalog = sortByQuality(coreMerchProducts(availableProducts(await getProducts())));
  const products = departmentProducts(catalog, 'Apparel');

  return (
    <>
      <section className="page-hero compact">
        <p className="eyebrow">Apparel</p>
        <h1>Wear it all round.</h1>
        <p>Belts, socks, gaiters, and layers chosen for comfort, fit, and clean course style.</p>
      </section>

      <section className="section product-section">
        <div className="product-grid">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        <div className="actions">
          <Link className="button secondary" href="/golf-hats">Hats</Link>
          <Link className="button primary" href="/products?category=Apparel">All apparel</Link>
        </div>
      </section>
    </>
  );
}