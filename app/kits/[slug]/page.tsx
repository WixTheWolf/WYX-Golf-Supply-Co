import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { KitAddButton } from '@/components/KitAddButton';
import { ProductCard } from '@/components/ProductCard';
import { availableProducts } from '@/lib/catalog';
import { productPrice } from '@/lib/feed';
import { kitBySlug, kitDefinitions, kitProducts } from '@/lib/kits';
import { coreMerchProducts } from '@/lib/merchandisingFilters';
import { sortByQuality } from '@/lib/productQuality';
import { getProducts } from '@/lib/shopify/products';

export const revalidate = 300;

export function generateStaticParams() {
  return kitDefinitions.map((kit) => ({ slug: kit.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const kit = kitBySlug(params.slug);
  if (!kit) return { title: 'Kit' };
  return {
    title: `${kit.title} | WYX Golf Supply Co.`,
    description: kit.description,
    alternates: { canonical: `/kits/${kit.slug}` }
  };
}

export default async function KitPage({ params }: { params: { slug: string } }) {
  const kit = kitBySlug(params.slug);
  if (!kit) notFound();
  const catalog = sortByQuality(coreMerchProducts(availableProducts(await getProducts())));
  const products = kitProducts(catalog, kit, 4);
  const lines = products
    .map((product) => product.variants.find((variant) => variant.availableForSale))
    .filter(Boolean)
    .map((variant) => ({ merchandiseId: variant!.id, quantity: 1 }));
  const total = products.reduce((sum, product) => sum + Number(productPrice(product).amount), 0);

  return (
    <>
      <section className="page-hero compact">
        <p className="eyebrow">{kit.eyebrow}</p>
        <h1>{kit.title}</h1>
        <p>{kit.description}</p>
        <div className="intent-proof-grid" aria-label="Kit benefits">
          <span>{products.length} current picks</span>
          <span>WYX10 saves 10%</span>
          <span>Review before checkout</span>
          <span>Shipping shown before payment</span>
        </div>
      </section>

      <section className="section product-section">
        <div className="section-heading split">
          <div>
            <p className="eyebrow">Kit Total</p>
            <h2>{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(total)}</h2>
            <p>These are individual products added together, so customers can remove, swap, or adjust quantities in the bag.</p>
          </div>
          {products.length > 0 && <KitAddButton lines={lines} label={kit.cta} />}
        </div>
        {products.length ? <div className="product-grid">{products.map((product) => <ProductCard key={product.id} product={product} />)}</div> : <p>Kit products are being prepared. Browse the full shop for current picks.</p>}
      </section>

      <section className="section kit-grid">
        {kitDefinitions.filter((item) => item.slug !== kit.slug).map((item) => (
          <article className="kit-card" key={item.slug}>
            <p className="eyebrow">{item.eyebrow}</p>
            <h2>{item.title}</h2>
            <p>{item.description}</p>
            <Link className="button secondary dark" href={`/kits/${item.slug}`}>View Kit</Link>
          </article>
        ))}
      </section>
    </>
  );
}
