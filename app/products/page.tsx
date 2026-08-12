import type { Metadata } from 'next';
import Link from 'next/link';
import { ProductCard } from '@/components/ProductCard';
import { catalogCategories, categoryCount, matchesCategory, saleReadyProducts } from '@/lib/catalog';
import { coreMerchProducts, firstBuyProducts } from '@/lib/merchandisingFilters';
import { sortByQuality } from '@/lib/productQuality';
import { getProducts } from '@/lib/shopify/products';

export const revalidate = 300;
const MIN_CATEGORY_CHIP_COUNT = 1;

export const metadata: Metadata = {
  title: 'Shop WYX — Golf Apparel & Gear',
  description: 'Shop the WYX edit of modern golf apparel, headwear, gloves, headcovers, trip gear and useful bag accessories.',
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
      <section className="page-hero compact shop-fashion-hero">
        <p className="eyebrow">SHOP WYX</p>
        <h1>{category && category !== 'All' ? category.toUpperCase() : 'THE FULL EDIT.'}</h1>
        <p>A smaller, sharper selection of golf apparel, headwear, headcovers, gloves, trip gear and bag upgrades. Everything here is available now and has a reason to be here.</p>
        {!category && <div className="actions shop-hero-actions"><Link className="button ink" href="/apparel">SHOP APPAREL</Link><Link className="text-link" href="/golf-trip-gear">PACK THE TRIP →</Link></div>}
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
            <h2>{category && category !== 'All' ? category : 'WYX right now'}</h2>
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
