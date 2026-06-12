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
  title: 'Swing Correction | Alignment, Tempo & Path Training',
  description: 'Swing correction tools for weekend golfers — divot boards, alignment mirrors, tempo trainers, and alignment sticks. WYX10 saves 10%.',
  alternates: { canonical: '/swing-correction' }
};

export default async function SwingCorrectionPage() {
  const catalog = sortByQuality(coreMerchProducts(availableProducts(await getProducts())));
  const products = departmentProducts(catalog, 'Swing Correction');

  return (
    <>
      <section className="page-hero compact">
        <p className="eyebrow">Swing Correction</p>
        <h1>Train the pattern, not the guess.</h1>
        <p>Alignment mirrors, divot boards, tempo trainers, and setup tools that give you immediate feedback between range sessions.</p>
      </section>

      <section className="section product-section">
        {products.length ? (
          <div className="product-grid">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <p>No swing correction products are live yet. Check back after the next catalog drop.</p>
        )}
        <div className="actions">
          <Link className="button secondary" href="/golf-training-aids">Practice gear</Link>
          <Link className="button primary" href="/products">Shop all</Link>
        </div>
      </section>
    </>
  );
}