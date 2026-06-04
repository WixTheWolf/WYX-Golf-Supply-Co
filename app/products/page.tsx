import type { Metadata } from 'next';
import Link from 'next/link';
import { ProductCard } from '@/components/ProductCard';
import { availableProducts, catalogCategories, categoryCount, matchesCategory } from '@/lib/catalog';
import { productPrice } from '@/lib/feed';
import { coreMerchProducts } from '@/lib/merchandisingFilters';
import { sortByQuality } from '@/lib/productQuality';
import { getProducts } from '@/lib/shopify/products';
import type { Product } from '@/types/shopify';

export const revalidate = 300;

export const metadata: Metadata = { title: 'Golf Gear & Accessories', description: 'Shop golf gear, golf balls, gloves, grips, towels, apparel, and accessories from WYX Golf Supply Co.' };

const intentFilters = [
  { label: 'Under $25', value: 'under-25' },
  { label: '$25-$60', value: '25-60' },
  { label: 'Over $60', value: 'over-60' },
  { label: 'Gift Ready', value: 'gift-ready' },
  { label: 'Trip Gear', value: 'trip-gear' }
];

export default async function Products({ searchParams }: { searchParams: { category?: string; filter?: string } }) {
  const catalog = sortByQuality(coreMerchProducts(availableProducts(await getProducts())));
  const category = searchParams.category;
  const filter = searchParams.filter;
  const visibleCategories = catalogCategories.filter((item) => item === 'All' || categoryCount(catalog, item) > 0);
  const products = catalog.filter((product) => matchesCategory(product, category)).filter((product) => matchesIntentFilter(product, filter));

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
      <nav className="filter-row intent-filter-row" aria-label="Shop filters">
        <Link className={!filter ? 'active' : ''} href={category ? `/products?category=${encodeURIComponent(category)}` : '/products'}>All Picks</Link>
        {intentFilters.map((item) => {
          const params = new URLSearchParams();
          if (category) params.set('category', category);
          params.set('filter', item.value);
          return <Link className={filter === item.value ? 'active' : ''} key={item.value} href={`/products?${params.toString()}`}>{item.label}</Link>;
        })}
      </nav>
      <section className="section product-section">
        <div className="results-heading"><p className="eyebrow">{filterLabel(filter) || category || 'All Products'}</p><span>{products.length} {products.length === 1 ? 'product' : 'products'}</span></div>
        {products.length ? <div className="product-grid">{products.map((product) => <ProductCard key={product.id} product={product} />)}</div> : <p>No products are available in this category yet. Check the full shop for current WYX picks.</p>}
      </section>
    </>
  );
}

function matchesIntentFilter(product: Product, filter?: string) {
  const price = Number(productPrice(product).amount);
  const haystack = `${product.title} ${product.productType} ${(product.tags || []).join(' ')}`.toLowerCase();
  if (!filter) return true;
  if (filter === 'under-25') return price < 25;
  if (filter === '25-60') return price >= 25 && price <= 60;
  if (filter === 'over-60') return price > 60;
  if (filter === 'gift-ready') return price <= 60 || /gift|marker|towel|balls|caddie|headcover/.test(haystack);
  if (filter === 'trip-gear') return /trip|marker|towel|balls|caddie|glove|grip|headcover/.test(haystack);
  return true;
}

function filterLabel(filter?: string) {
  return intentFilters.find((item) => item.value === filter)?.label;
}
