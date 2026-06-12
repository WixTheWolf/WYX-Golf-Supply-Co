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
  title: 'Golf Tech',
  description: 'Rangefinders, GPS watches, and cart tech for smarter rounds. WYX10 saves 10%.',
  alternates: { canonical: '/golf-tech' }
};

export default async function GolfTechPage() {
  const catalog = sortByQuality(coreMerchProducts(availableProducts(await getProducts())));
  const products = departmentProducts(catalog, 'Golf Tech');

  return (
    <>
      <section className="page-hero compact">
        <p className="eyebrow">Golf Tech</p>
        <h1>Less guesswork. Better decisions.</h1>
        <p>Rangefinders, GPS watches, and cart tech that remove friction from every hole.</p>
      </section>

      <section className="section product-section">
        {products.length ? (
          <div className="product-grid">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <p>Tech products are publishing now. Check back shortly for rangefinders, GPS, and cart mounts.</p>
        )}
        <div className="actions">
          <Link className="button secondary" href="/products?category=Golf%20Tech">All tech</Link>
          <Link className="button primary" href="/products">Shop all</Link>
        </div>
      </section>
    </>
  );
}