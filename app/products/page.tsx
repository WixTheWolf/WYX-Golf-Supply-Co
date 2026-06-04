import type { Metadata } from 'next';
import Link from 'next/link';
import { ProductCard } from '@/components/ProductCard';
import { availableProducts, catalogCategories, categoryCount, matchesCategory } from '@/lib/catalog';
import { coreMerchProducts } from '@/lib/merchandisingFilters';
import { sortByQuality } from '@/lib/productQuality';
import { getProducts } from '@/lib/shopify/products';

export const revalidate = 300;

export const metadata: Metadata = { title: 'Golf Gear & Accessories', description: 'Shop golf gear, golf balls, gloves, grips, towels, apparel, and accessories from WYX Golf Supply Co.' };

export default async function Products({ searchParams }: { searchParams: { category?: string } }) {
  const catalog = sortByQuality(coreMerchProducts(availableProducts(await getProducts())));
  const category = searchParams.category;
  const visibleCategories = catalogCategories.filter((item) => item === 'All' || categoryCount(catalog, item) > 0);
  const products = catalog.filter((product) => matchesCategory(product, category));

  return (
    <>
      <section className="page-hero compact">
        <p className="eyebrow">Shop WYX</p>
        <h1>Golf Gear Worth Keeping In The Bag.</h1>
        <p>Useful towels, grips, gloves, markers, balls, and accessories for weekend golfers, range sessions, and giftable bag upgrades.</p>
      </section>
      <nav className="filter-row" aria-label="Product categories">
        {visibleCategories.map((item) => <Link className={(!category && item === 'All') || category === item ? 'active' : ''} key={item} href={item === 'All' ? '/products' : `/products?category=${encodeURIComponent(item)}`}>{item}<small>{item === 'All' ? catalog.length : categoryCount(catalog, item)}</small></Link>)}
      </nav>
      <section className="section product-section">
        <div className="results-heading"><p className="eyebrow">{category || 'All Products'}</p><span>{products.length} {products.length === 1 ? 'product' : 'products'}</span></div>
        {products.length ? <div className="product-grid">{products.map((product) => <ProductCard key={product.id} product={product} />)}</div> : <p>No products are available in this category yet. Check the full shop for current WYX picks.</p>}
      </section>
    </>
  );
}
