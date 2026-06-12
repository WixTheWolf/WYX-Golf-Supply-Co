import type { Metadata } from 'next';
import Link from 'next/link';
import { ProductCard } from '@/components/ProductCard';
import { availableProducts } from '@/lib/catalog';
import { productsForDepartment, storeDepartments } from '@/lib/merchandisingCategories';
import { coreMerchProducts } from '@/lib/merchandisingFilters';
import { sortByQuality } from '@/lib/productQuality';
import { getProducts } from '@/lib/shopify/products';

export const revalidate = 300;

export const metadata: Metadata = {
  title: 'WYX Golf Supply Co. | Hats, Apparel, Tech & Practice Gear',
  description: 'Curated golf hats, apparel, tech, practice gear, and swing correction tools for weekend players. Clean gear. Real stock. WYX10 saves 10% on your first order.',
  alternates: { canonical: '/' },
  openGraph: {
    title: 'WYX Golf Supply Co.',
    description: 'Golf hats, apparel, tech, practice gear, and swing correction — curated like it should have been all along.',
    url: 'https://wyxgolfsupply.com'
  }
};

export default async function Home() {
  const catalog = sortByQuality(coreMerchProducts(availableProducts(await getProducts())));

  return (
    <>
      <section className="store-hero">
        <p className="eyebrow">WYX Golf Supply Co.</p>
        <h1>Golf gear, curated.</h1>
        <p>
          Hats, apparel, tech, practice tools, and swing correction — organized by what you actually shop for, not by marketing noise.
        </p>
        <div className="actions" style={{ justifyContent: 'center' }}>
          <Link className="button primary" href="/products">Shop all</Link>
          <Link className="button secondary" href="/golf-hats">Shop hats</Link>
        </div>
      </section>

      <div className="store-promo">
        Use <strong>WYX10</strong> at checkout for 10% off your first order. Secure Shopify checkout. Shipping shown before you pay.
      </div>

      <section className="store-section">
        {storeDepartments.map((department) => {
          const products = productsForDepartment(catalog, department.id, 4);
          if (!products.length) return null;

          return (
            <div className="store-row" key={department.id}>
              <div className="store-row-head">
                <div>
                  <p className="eyebrow">{department.title}</p>
                  <h2>{department.title}</h2>
                  <p>{department.copy}</p>
                </div>
                <Link className="text-link" href={department.href}>Shop {department.title.toLowerCase()}</Link>
              </div>
              <div className="store-grid">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          );
        })}
      </section>
    </>
  );
}