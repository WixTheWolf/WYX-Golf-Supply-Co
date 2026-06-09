import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { KitAddButton } from '@/components/KitAddButton';
import { ProductCard } from '@/components/ProductCard';
import { availableProducts, categoryFor } from '@/lib/catalog';
import { productPrice, siteUrl } from '@/lib/feed';
import { kitBySlug, kitDefinitions, kitProducts } from '@/lib/kits';
import { coreMerchProducts } from '@/lib/merchandisingFilters';
import { sortByQuality } from '@/lib/productQuality';
import { getProducts } from '@/lib/shopify/products';
import { cleanText } from '@/lib/text';

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
    alternates: { canonical: `/kits/${kit.slug}` },
    openGraph: { title: `${kit.title} | WYX Golf Supply Co.`, description: kit.description }
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
  const kitUrl = `${siteUrl}/kits/${kit.slug}`;
  const categories = [...new Set(products.map((p) => categoryFor(p)))];

  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: kit.title,
      description: kit.description,
      url: kitUrl,
      numberOfItems: products.length,
      itemListElement: products.map((product, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: cleanText(product.title),
        url: `${siteUrl}/products/${product.handle}`,
        item: {
          '@type': 'Product',
          name: cleanText(product.title),
          url: `${siteUrl}/products/${product.handle}`,
          image: product.featuredImage?.url,
          offers: {
            '@type': 'Offer',
            price: productPrice(product).amount,
            priceCurrency: productPrice(product).currencyCode,
            availability: 'https://schema.org/InStock'
          }
        }
      }))
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
        { '@type': 'ListItem', position: 2, name: 'Kits', item: `${siteUrl}/kits/golf-trip-kit` },
        { '@type': 'ListItem', position: 3, name: kit.title, item: kitUrl }
      ]
    }
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <section className="page-hero compact">
        <p className="eyebrow">{kit.eyebrow}</p>
        <h1>{kit.title}</h1>
        <p>{kit.description}</p>
        {categories.length > 0 && (
          <div className="kit-categories" aria-label="Categories covered by this kit">
            {categories.map((cat) => <span key={cat} className="kit-cat-chip">{cat}</span>)}
          </div>
        )}
        <div className="intent-proof-grid" aria-label="Kit benefits">
          <span>{products.length} curated picks</span>
          <span>WYX10 saves 10%</span>
          <span>Swap items before checkout</span>
          <span>Ships via Shopify checkout</span>
        </div>
      </section>

      <section className="section product-section">
        <div className="section-heading split">
          <div>
            <p className="eyebrow">Kit Total — {products.length} Items</p>
            <h2>{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(total)}</h2>
            <p>Each item is added separately so you can remove, swap, or adjust quantities before paying.</p>
          </div>
          {products.length > 0 && <KitAddButton lines={lines} label={kit.cta} />}
        </div>
        {products.length
          ? <div className="product-grid">{products.map((product) => <ProductCard key={product.id} product={product} />)}</div>
          : <p>Kit products are being prepared — check back shortly or <Link href="/products">browse the full shop</Link>.</p>}
        {products.length > 0 && (
          <div className="kit-add-footer">
            <KitAddButton lines={lines} label={`Add All ${products.length} to Cart`} />
            <p className="kit-add-note">Items land in the cart individually — remove anything that does not fit before checkout.</p>
          </div>
        )}
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
