import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { AddToCartButton } from '@/components/AddToCartButton';
import { ProductCard } from '@/components/ProductCard';
import { categoryFor, supplierName } from '@/lib/catalog';
import { money } from '@/lib/demo';
import { getProduct, getProducts } from '@/lib/shopify/products';

export async function generateMetadata({ params }: { params: { handle: string } }): Promise<Metadata> {
  const product = await getProduct(params.handle);
  return product ? { title: product.title, description: product.description, openGraph: { images: product.featuredImage ? [product.featuredImage.url] : [] } } : { title: 'Product' };
}

export default async function ProductPage({ params }: { params: { handle: string } }) {
  const product = await getProduct(params.handle);
  if (!product) notFound();
  const related = (await getProducts()).filter((item) => item.handle !== product.handle && item.availableForSale).slice(0, 3);
  const variant = product.variants.find((item) => item.availableForSale);
  const images = product.images.length ? product.images.slice(0, 4) : product.featuredImage ? [product.featuredImage] : [];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ '@context': 'https://schema.org', '@type': 'Product', name: product.title, image: images.map((image) => image.url), description: product.description, brand: { '@type': 'Brand', name: supplierName(product) }, offers: { '@type': 'Offer', priceCurrency: variant?.price.currencyCode, price: variant?.price.amount, availability: variant ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock' } }) }} />
      <nav className="breadcrumbs" aria-label="Breadcrumb"><Link href="/products">Supply Room</Link><span>/</span><span>{categoryFor(product)}</span></nav>
      <section className="product-detail">
        <div className="gallery">
          {images.map((image, index) => <Image key={image.url} className={index === 0 ? 'gallery-main' : ''} src={image.url} alt={image.altText || product.title} width={1200} height={900} priority={index === 0} />)}
          {!images.length && <div className="image-placeholder gallery-main">Product image coming soon</div>}
        </div>
        <div className="purchase-panel">
          <p className="eyebrow">{categoryFor(product)}</p>
          <h1>{product.title}</h1>
          <p className="supplier">Supplied by {supplierName(product)}</p>
          <p className="price large">{money(product.priceRange.minVariantPrice)}</p>
          <p>{product.description}</p>
          <AddToCartButton variantId={variant?.id} />
          <div className="purchase-points"><span>Live supplier inventory</span><span>Secure checkout powered by Shopify</span><span>Fulfilled by the product supplier</span></div>
          <div className="detail-list">
            <section><h2>Product Details</h2><p>The supplier listing above is the source of truth for this product. Review the product description for included items, sizing, and available options.</p></section>
            <section><h2>Shipping & Returns</h2><p>Shipping rates and delivery timing are shown at Shopify checkout. Review our <Link href="/shipping-returns">shipping and returns policy</Link> before ordering.</p></section>
          </div>
        </div>
      </section>
      {related.length > 0 && <section className="section"><p className="eyebrow">Keep Looking</p><h2>More From The Supply Room.</h2><div className="product-grid">{related.map((item) => <ProductCard key={item.id} product={item} />)}</div></section>}
    </>
  );
}
