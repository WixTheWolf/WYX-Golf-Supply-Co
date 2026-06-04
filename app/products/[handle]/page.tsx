import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { AddToCartButton } from '@/components/AddToCartButton';
import { EmailCapture } from '@/components/EmailCapture';
import { ProductCard } from '@/components/ProductCard';
import { ProductViewTracker } from '@/components/ProductViewTracker';
import { availableProducts, categoryFor, hasSaleReadyMedia, supplierName } from '@/lib/catalog';
import { money } from '@/lib/demo';
import { productDescription } from '@/lib/feed';
import { productFaq, productValueBullets } from '@/lib/merchandising';
import { getProduct, getProducts } from '@/lib/shopify/products';
import { cleanText } from '@/lib/text';

export const revalidate = 300;

export async function generateMetadata({ params }: { params: { handle: string } }): Promise<Metadata> {
  const product = await getProduct(params.handle);
  return product ? {
    title: cleanText(product.title),
    description: productDescription(product),
    alternates: { canonical: `/products/${product.handle}` },
    openGraph: { url: `/products/${product.handle}`, images: product.featuredImage ? [product.featuredImage.url] : [] }
  } : { title: 'Product' };
}

export default async function ProductPage({ params }: { params: { handle: string } }) {
  const product = await getProduct(params.handle);
  if (!product || !product.availableForSale || !hasSaleReadyMedia(product)) notFound();
  const productCategory = categoryFor(product);
  const allProducts = availableProducts(await getProducts());
  const related = allProducts
    .filter((item) => item.handle !== product.handle && item.availableForSale)
    .sort((a, b) => Number(categoryFor(b) === productCategory) - Number(categoryFor(a) === productCategory))
    .slice(0, 3);
  const variant = product.variants.find((item) => item.availableForSale);
  const images = product.images.length ? product.images.slice(0, 4) : product.featuredImage ? [product.featuredImage] : [];
  const bullets = productValueBullets(product);
  const faqs = productFaq(product);
  const title = cleanText(product.title);
  const description = productDescription(product);

  return (
    <>
      <ProductViewTracker productId={product.id} variantId={variant?.id} title={title} handle={product.handle} price={product.priceRange.minVariantPrice} category={productCategory} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ '@context': 'https://schema.org', '@type': 'Product', name: title, image: images.map((image) => image.url), description, category: productCategory, brand: { '@type': 'Brand', name: supplierName(product) }, offers: { '@type': 'Offer', priceCurrency: variant?.price.currencyCode, price: variant?.price.amount, availability: variant ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock' } }) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: faqs.map(([question, answer]) => ({ '@type': 'Question', name: question, acceptedAnswer: { '@type': 'Answer', text: answer } })) }) }} />
      <nav className="breadcrumbs" aria-label="Breadcrumb"><Link href="/products">Supply Room</Link><span>/</span><span>{productCategory}</span></nav>
      <section className="product-detail">
        <div className="gallery">
          {images.map((image, index) => <Image key={image.url} className={index === 0 ? 'gallery-main' : ''} src={image.url} alt={cleanText(image.altText) || title} width={1200} height={900} priority={index === 0} />)}
          {!images.length && <div className="image-placeholder gallery-main">Product image coming soon</div>}
        </div>
        <div className="purchase-panel">
          <p className="eyebrow">{productCategory}</p>
          <h1>{title}</h1>
          <p className="supplier">Supplied by {supplierName(product)}</p>
          <p className="price large">{money(product.priceRange.minVariantPrice)}</p>
          <p>{description}</p>
          <div className="conversion-panel">
            <strong>Why it belongs in the bag</strong>
            <ul>{bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}</ul>
          </div>
          <div className="trust-list" aria-label="Purchase confidence">
            <span>Shipping timing shown at checkout</span>
            <span>Returns policy posted before purchase</span>
            <span>Secure payment</span>
            <span>Trusted golf supplier</span>
            <span>U.S. customer support</span>
            <span>Use WYX10 for 10% off</span>
          </div>
          <AddToCartButton variantId={variant?.id} />
          <AddToCartButton variantId={variant?.id} buyNow />
          <div className="purchase-points"><span>Active product availability</span><span>Easy checkout</span><span>Built for real rounds</span></div>
          <div className="detail-list">
            <section><h2>Player Notes</h2><p>Early WYX customer notes and reviews will appear here as orders come in. For launch, each item is screened for real product media, active availability, and useful golf intent.</p></section>
            <section><h2>Product Details</h2><p>Review the product description above for included items, sizing, color options, and fit notes before adding it to your bag.</p></section>
            <section><h2>Shipping & Returns</h2><p>Shipping rates and delivery timing are shown before payment. Review our <Link href="/shipping-returns">shipping and returns policy</Link> before ordering.</p></section>
            <section><h2>Quick Questions</h2>{faqs.map(([question, answer]) => <details key={question}><summary>{question}</summary><p>{answer}</p></details>)}</section>
          </div>
        </div>
      </section>
      <div className="mobile-sticky-atc" aria-label="Sticky mobile purchase bar">
        <div><strong>{money(product.priceRange.minVariantPrice)}</strong><span>{title}</span></div>
        <AddToCartButton variantId={variant?.id} buyNow />
      </div>
      {related.length > 0 && <section className="section"><p className="eyebrow">Keep Looking</p><h2>More From The Supply Room.</h2><div className="product-grid">{related.map((item) => <ProductCard key={item.id} product={item} />)}</div></section>}
      <EmailCapture source="product-page" campaign={`product_${product.handle}`} title="Save This Drop For Later." body="Join the launch list for WYX10 reminders, golf gift picks, and useful bag upgrades." />
    </>
  );
}
