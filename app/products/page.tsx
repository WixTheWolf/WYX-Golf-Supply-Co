import type { Metadata } from 'next';
import Link from 'next/link';
import { ProductCard } from '@/components/ProductCard';
import { catalogCategories, categoryCount, matchesCategory, saleReadyProducts } from '@/lib/catalog';
import { coreMerchProducts } from '@/lib/merchandisingFilters';
import { sortByQuality } from '@/lib/productQuality';
import { getProducts } from '@/lib/shopify/products';
import type { Product } from '@/types/shopify';

export const revalidate = 300;

// A category chip only earns a spot once it has enough depth to feel like a
// real section — below this, clicking it lands on a near-empty page that reads
// as broken. Thin-category products still appear under "All" and on their
// keyword-matched landing pages; they just don't get a promoted filter chip.
const MIN_CATEGORY_CHIP_COUNT = 3;

export const metadata: Metadata = {
  title: 'Shop',
  description: 'Shop practical golf gifts, trip gear, bag upgrades, and accessories — every product passes The Bag Test.',
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
        <p className="eyebrow">Shop</p>
        <h1>Everything in one place.</h1>
        <p>Practical golf gifts, trip gear, and bag upgrades — filtered by category, sorted by what is worth adding to the bag.</p>
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