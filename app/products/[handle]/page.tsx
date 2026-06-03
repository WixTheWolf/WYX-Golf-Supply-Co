import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { AddToCartButton } from '@/components/AddToCartButton';
import { ProductCard } from '@/components/ProductCard';
import { categoryFor, supplierName } from '@/lib/catalog';
import { money } from '@/lib/demo';
import { productFaq, productValueBullets } from '@/lib/merchandising';
import { getProduct, getProducts } from '@/lib/shopify/products';
import { cleanText } from '@/lib/text';

export async function generateMetadata({ params }: { params: { handle: string } }): Promise<Metadata> {
  const product = await getProduct(params.handle);
  return product ? { title: cleanText(product.title), description: cleanText(product.description), openGraph: { images: product.featuredImage ? [product.featuredImage.url] : [] } } : { title: 'Product' };
}

export default async function ProductPage({ params }: { params: { handle: string } }) {
  const product = await getProduct(params.handle);
  if (!product) notFound();
  const productCategory = categoryFor(product);
  const allProducts = await getProducts();
  const related = allProducts
    .filter((item) => item.handle !== product.handle && item.availableForSale)
    .sort((a, b) => Number(categoryFor(b) === productCategory) - Number(categoryFor(a) === productCategory))
    .slice(0, 3);
  const variant = product.variants.find((item) => item.availableForSale);
  const images = product.images.length ? product.images.slice(0, 4) : product.featuredImage ? [product.featuredImage] : [];
  const bullets = productValueBullets(product);
  const faqs = productFaq(product);
  const title = cleanText(product.title);
  const description = cleanText(product.description);

  return (
    <>
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
          <AddToCartButton variantId={variant?.id} />
          <div className="purchase-points"><span>Live supplier inventory</span><span>Secure checkout powered by Shopify</span><span>Fulfilled by the product supplier</span></div>
          <div className="detail-list">
            <section><h2>Product Details</h2><p>The supplier listing above is the source of truth for this product. Review the product description for included items, sizing, and available options.</p></section>
            <section><h2>Shipping & Returns</h2><p>Shipping rates and delivery timing are shown at Shopify checkout. Review our <Link href="/shipping-returns">shipping and returns policy</Link> before ordering.</p></section>
            <section><h2>Quick Questions</h2>{faqs.map(([question, answer]) => <details key={question}><summary>{question}</summary><p>{answer}</p></details>)}</section>
          </div>
        </div>
      </section>
      {related.length > 0 && <section className="section"><p className="eyebrow">Keep Looking</p><h2>More From The Supply Room.</h2><div className="product-grid">{related.map((item) => <ProductCard key={item.id} product={item} />)}</div></section>}
    </>
  );
}
