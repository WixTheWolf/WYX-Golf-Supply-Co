import type { Metadata } from 'next';
import Link from 'next/link';
import { ProductCard } from '@/components/ProductCard';
import { catalogCategories, categoryCount, matchesCategory, saleReadyProducts } from '@/lib/catalog';
import { coreMerchProducts } from '@/lib/merchandisingFilters';
import { sortByQuality } from '@/lib/productQuality';
import { getProducts } from '@/lib/shopify/products';

export const revalidate = 300;
const MIN_CATEGORY_CHIP_COUNT = 2;

export const metadata: Metadata = {
  title: 'The Current Drop',
  description: 'Shop the WYX current drop — a tight edit of modern headcovers, grips, gloves, trip gear, markers and bag upgrades.',
  alternates: { canonical: '/products' }
};

export default async function Products({ searchParams }: { searchParams: { category?: string; filter?: string } }) {
  const catalog = sortByQuality(coreMerchProducts(saleReadyProducts(await getProducts())));
  const category = searchParams.category;
  const visibleCategories = catalogCategories.filter(
    (item) => item === 'All' || categoryCount(catalog, item) >= MIN_CATEGORY_CHIP_COUNT || item === category
  );
  const products = catalog.filter((product) => matchesCategory(product, category));

  return (
    <>
      <section className="page-hero compact">
        <p className="eyebrow">WYX // CURRENT DROP</p>
        <h1>{catalog.length} PRODUCTS. THAT&apos;S THE POINT.</h1>
        <p>We cut the endless-scroll catalog. What is left has a clear golf use case, enough personality to deserve a click, and a safe path to checkout.</p>
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
          <div>
            <p className="eyebrow">LIVE / SHOPIFY SYNCED</p>
            <h2>{category && category !== 'All' ? category : 'The full edit'}</h2>
          </div>
          <p>{products.length} live products</p>
        </div>
        <div className="product-grid">
          {products.map((product) => <ProductCard key={product.id} product={product} />)}
        </div>
      </section>
    </>
  );
}
