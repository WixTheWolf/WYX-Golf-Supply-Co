import type { Metadata } from 'next';
import Link from 'next/link';
import { ProductCard } from '@/components/ProductCard';
import { catalogCategories, categoryCount, matchesCategory, saleReadyProducts } from '@/lib/catalog';
import { sortByQuality } from '@/lib/productQuality';
import { getProducts } from '@/lib/shopify/products';
import type { Product } from '@/types/shopify';

export const revalidate = 300;

export const metadata: Metadata = {
  title: 'Shop',
  description: 'Shop curated golf hats, apparel, tech, practice gear, and swing correction tools.',
  alternates: { canonical: '/products' }
};

export default async function Products({ searchParams }: { searchParams: { category?: string; filter?: string } }) {
  const catalog = sortByQuality(saleReadyProducts(await getProducts()));
  const category = searchParams.category;
  const visibleCategories = catalogCategories.filter((item) => item === 'All' || categoryCount(catalog, item) > 0);
  const products = catalog.filter((product) => matchesCategory(product, category));

  return (
    <>
      <section className="page-hero compact">
        <p className="eyebrow">Shop</p>
        <h1>Everything in one place.</h1>
        <p>Hats, apparel, tech, practice gear, and swing correction — filtered by category, sorted by what is worth adding to the bag.</p>
      </section>

      <nav className="filter-row" aria-label="Product categories">
        {visibleCategories.map((item) => (
          <Link
            className={(!category && item === 'All') || category === item ? 'active' : ''}
            key={item}
            href={item === 'All' ? '/products' : `/products?category=${encodeURIComponent(item)}`}
          >
            {item}
            <small>{item === 'All' ? catalog.length : categoryCount(catalog, item)}</small>
          </Link>
        ))}
      </nav>

      <section className="section product-section">
        <div className="results-heading">
          <h2>{category && category !== 'All' ? category : 'All products'}</h2>
          <p>{products.length} items</p>
        </div>
        <div className="product-grid">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </>
  );
}