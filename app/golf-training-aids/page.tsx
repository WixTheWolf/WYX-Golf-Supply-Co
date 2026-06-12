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
  title: 'Practice Gear',
  description: 'Putting mats, chipping nets, and backyard practice tools. WYX10 saves 10%.',
  alternates: { canonical: '/golf-training-aids' }
};

export default async function GolfTrainingAidsPage() {
  const catalog = sortByQuality(coreMerchProducts(availableProducts(await getProducts())));
  const products = departmentProducts(catalog, 'Practice Gear');

  return (
    <>
      <section className="page-hero compact">
        <p className="eyebrow">Practice Gear</p>
        <h1>Repetition that sticks.</h1>
        <p>Putting mats, chipping nets, portable cups, and backyard tools for real at-home practice.</p>
      </section>

      <section className="section product-section">
        {products.length ? (
          <div className="product-grid">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <p>Practice gear is publishing now. Check back for putting mats, chipping nets, and portable trainers.</p>
        )}
        <div className="actions">
          <Link className="button secondary" href="/swing-correction">Swing correction</Link>
          <Link className="button primary" href="/products?category=Training%20Aids">All training aids</Link>
        </div>
      </section>
    </>
  );
}