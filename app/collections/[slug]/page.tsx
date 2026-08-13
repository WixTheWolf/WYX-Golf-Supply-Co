import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ProductCard } from '@/components/ProductCard';
import { availableProducts } from '@/lib/catalog';
import { getLandingCollection, landingCollections } from '@/lib/collections';
import { imageMap } from '@/lib/demo';
import { siteUrl } from '@/lib/feed';
import { sortByQuality } from '@/lib/productQuality';
import { getProducts } from '@/lib/shopify/products';

export const revalidate = 300;

export function generateStaticParams() {
  return landingCollections.map((collection) => ({ slug: collection.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const collection = getLandingCollection(params.slug);
  return collection ? {
    title: `${collection.seoTitle} | WYX Golf Supply Co.`,
    description: collection.metaDescription,
    alternates: { canonical: `/collections/${collection.slug}` }
  } : { title: 'Collection' };
}

export default async function CollectionPage({ params }: { params: { slug: string } }) {
  const collection = getLandingCollection(params.slug);
  if (!collection) notFound();
  const catalog = sortByQuality(availableProducts(await getProducts()));
  const products = catalog.filter(collection.match);

  return (
    <>
      <section className="collection-hero">
        <div>
          <p className="eyebrow">{collection.eyebrow}</p>
          <h1>{collection.title}</h1>
          <p>{collection.description}</p>
          <div className="actions">
            <Link className="button primary" href="#collection-products">Shop This Collection</Link>
            <Link className="button secondary dark" href="/deals">Shop Launch Deals</Link>
          </div>
        </div>
        <div className="collection-proof">
          {collection.bullets.map((bullet) => <span key={bullet}>{bullet}</span>)}
        </div>
      </section>

      <section id="collection-products" className="section product-section">
        <div className="section-heading split">
          <div>
            <p className="eyebrow">{products.length} Current Picks</p>
            <h2>Ready For The Bag.</h2>
          </div>
          <Link className="text-link" href="/products">Browse Everything</Link>
        </div>
        {products.length ? <div className="product-grid">{products.map((product) => <ProductCard key={product.id} product={product} />)}</div> : <p>This collection is being prepared. Check the full shop for available products.</p>}
      </section>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: collection.title,
        description: collection.metaDescription,
        url: `${siteUrl}/collections/${collection.slug}`,
        image: `${siteUrl}${imageMap.hero}`,
        mainEntity: products.map((product) => ({
          '@type': 'Product',
          name: product.title,
          url: `${siteUrl}/products/${product.handle}`,
          image: product.featuredImage?.url
        }))
      }) }} />
    </>
  );
}
