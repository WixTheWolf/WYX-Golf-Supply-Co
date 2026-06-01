import type { Metadata } from 'next';
import Link from 'next/link';
import { ProductCard } from '@/components/ProductCard';
import { availableProducts, catalogCategories, categoryCount, matchesCategory } from '@/lib/catalog';
import { getProducts } from '@/lib/shopify/products';

export const metadata: Metadata = { title: 'Golf Gear & Accessories', description: 'Shop supplier-backed golf gear, golf balls, gloves, grips, towels, apparel, and accessories from WYX Golf Supply Co.' };

export default async function Products({ searchParams }: { searchParams: { category?: string } }) {
  const catalog = availableProducts(await getProducts());
  const category = searchParams.category;
  const products = catalog.filter((product) => matchesCategory(product, category));

  return (
    <>
      <section className="page-hero compact">
        <p className="eyebrow">The Supply Room</p>
        <h1>Golf Gear With A Point Of View.</h1>
        <p>Independent supplier finds, live inventory, and straightforward Shopify checkout. New products appear here as they are approved in the WYX catalog.</p>
      </section>
      <nav className="filter-row" aria-label="Product categories">
        {catalogCategories.map((item) => <Link className={(!category && item === 'All') || category === item ? 'active' : ''} key={item} href={item === 'All' ? '/products' : `/products?category=${encodeURIComponent(item)}`}>{item}<small>{item === 'All' ? catalog.length : categoryCount(catalog, item)}</small></Link>)}
      </nav>
      <section className="section product-section">
        <div className="results-heading"><p className="eyebrow">{category || 'All Products'}</p><span>{products.length} {products.length === 1 ? 'product' : 'products'}</span></div>
        {products.length ? <div className="product-grid">{products.map((product) => <ProductCard key={product.id} product={product} />)}</div> : <p>No products are available in this category yet. Check back as the supply room grows.</p>}
      </section>
    </>
  );
}
