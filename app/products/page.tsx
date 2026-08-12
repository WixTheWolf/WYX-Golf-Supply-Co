import type { Metadata } from 'next';
import Link from 'next/link';
import { ProductCard } from '@/components/ProductCard';
import { catalogCategories, categoryCount, matchesCategory, saleReadyProducts } from '@/lib/catalog';
import { coreMerchProducts, firstBuyProducts } from '@/lib/merchandisingFilters';
import { sortByQuality } from '@/lib/productQuality';
import { getProducts } from '@/lib/shopify/products';

export const revalidate = 300;
const MIN_CATEGORY_CHIP_COUNT = 2;

export const metadata: Metadata = {
  title: 'Drop 01 — Modern Golf Gear',
  description: 'Shop WYX Drop 01 — a tight edit of headcovers, gloves, golf gifts, trip gear, markers, towels and bag upgrades selected for real rounds.',
  alternates: { canonical: '/products' }
};

export default async function Products({ searchParams }: { searchParams: { category?: string; filter?: string } }) {
  const catalog = sortByQuality(coreMerchProducts(saleReadyProducts(await getProducts())));
  const preferred = firstBuyProducts(catalog);
  const rankedCatalog = [...preferred, ...catalog.filter((product) => !preferred.some((pick) => pick.handle === product.handle))];
  const category = searchParams.category;
  const visibleCategories = catalogCategories.filter(
    (item) => item === 'All' || categoryCount(rankedCatalog, item) >= MIN_CATEGORY_CHIP_COUNT || item === category
  );
  const products = rankedCatalog.filter((product) => matchesCategory(product, category));

  return (
    <>
      <section className="page-hero compact">
        <p className="eyebrow">WYX / DROP 01</p>
        <h1>{rankedCatalog.length} PIECES. NO FILLER.</h1>
        <p>A deliberately small golf assortment. Personality up front, utility underneath, and the inexpensive restock pieces where they belong: supporting the bag instead of defining the brand.</p>
      </section>

      <nav className="filter-row" aria-label="Product categories">
        {visibleCategories.map((item) => (
          <Link
            className={(!category && item === 'All') || category === item ? 'active' : ''}
            key={item}
            href={item === 'All' ? '/products' : `/products?category=${encodeURIComponent(item)}`}
          >
            {item}
            <small>{item === 'All' ? rankedCatalog.length : categoryCount(rankedCatalog, item)}</small>
          </Link>
        ))}
      </nav>

      <section className="section product-section">
        <div className="results-heading">
          <div>
            <p className="eyebrow">AVAILABLE NOW</p>
            <h2>{category && category !== 'All' ? category : 'The full edit'}</h2>
          </div>
          <p>{products.length} pieces</p>
        </div>
        <div className="product-grid">
          {products.map((product) => <ProductCard key={product.id} product={product} />)}
        </div>
      </section>
    </>
  );
}
