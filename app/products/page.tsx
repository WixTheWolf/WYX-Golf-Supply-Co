import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLink } from '@/components/ArrowLink';
import { ProductCard } from '@/components/ProductCard';
import { catalogCategories, categoryCount, matchesCategory, saleReadyProducts } from '@/lib/catalog';
import { coreMerchProducts, firstBuyProducts } from '@/lib/merchandisingFilters';
import { sortByQuality } from '@/lib/productQuality';
import { getProducts } from '@/lib/shopify/products';

export const revalidate = 300;
const MIN_CATEGORY_CHIP_COUNT = 1;

export const metadata: Metadata = {
  title: 'Shop WYX — Golf Apparel & Gear | WYX Golf Supply Co.',
  description: 'Shop the WYX edit of modern golf apparel, headwear, gloves, headcovers, trip gear and useful bag accessories.',
  alternates: { canonical: '/products' }
};

export default async function Products({ searchParams }: { searchParams: Promise<{ category?: string; filter?: string }> }) {
  const resolvedSearchParams = await searchParams;
  const catalog = sortByQuality(coreMerchProducts(saleReadyProducts(await getProducts())));
  const preferred = firstBuyProducts(catalog);
  const rankedCatalog = [...preferred, ...catalog.filter((product) => !preferred.some((pick) => pick.handle === product.handle))];
  const category = resolvedSearchParams.category;
  const visibleCategories = catalogCategories.filter(
    (item) => item === 'All' || categoryCount(rankedCatalog, item) >= MIN_CATEGORY_CHIP_COUNT || item === category
  );
  const products = rankedCatalog.filter((product) => matchesCategory(product, category));

  return (
    <>
      <section className="lux-shop-hero">
        <div><p className="lux-kicker">Shop WYX / Available now</p><h1 className="lux-display">{category && category !== 'All' ? category : 'The full edit.'}</h1></div>
        <div><p>A smaller, sharper selection of golf apparel, headwear, headcovers, gloves, trip gear and bag upgrades. Everything here is live and has a reason to be here.</p>{!category && <ArrowLink href="/the-bag-test">See the WYX standard</ArrowLink>}</div>
      </section>

      <nav className="lux-filter" aria-label="Product categories">
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

      <section className="lux-shop-grid lux-section">
        <div className="lux-shop-grid__head">
          <p>{category && category !== 'All' ? category : 'WYX right now'}</p>
          <p>{String(products.length).padStart(2, '0')} pieces / Selected, not stocked</p>
        </div>
        {products.length ? <div className="lux-shop-grid__products">{products.map((product, index) => <ProductCard key={product.id} product={product} index={index} priority={index < 4} />)}</div> : <div className="lux-shop-empty"><p className="lux-kicker">Nothing here yet</p><h2 className="lux-display">The shelf stays<br />empty until it&apos;s right.</h2><Link className="lux-button-dark" href="/products">Return to the full edit</Link></div>}
      </section>
    </>
  );
}
