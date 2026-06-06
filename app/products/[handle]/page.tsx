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
import { productDescription, siteUrl } from '@/lib/feed';
import { productBestFor, productBuyerPromise, productFaq, productValueBullets } from '@/lib/merchandising';
import { coreMerchProducts, isHiddenFromCoreStorefront } from '@/lib/merchandisingFilters';
import { getProduct, getProducts } from '@/lib/shopify/products';
import { supportEmail } from '@/lib/support';
import { cleanText } from '@/lib/text';

export const revalidate = 300;

export async function generateMetadata({ params }: { params: { handle: string } }): Promise<Metadata> {
  const product = await getProduct(params.handle);
  return product ? {
    title: cleanText(product.title),
    description: productDescription(product) || productBuyerPromise(product),
    alternates: { canonical: `/products/${product.handle}` },
    openGraph: { url: `/products/${product.handle}`, title: cleanText(product.title), description: productBuyerPromise(product), images: product.featuredImage ? [product.featuredImage.url] : [] },
    twitter: { card: 'summary_large_image', title: cleanText(product.title), description: productBuyerPromise(product), images: product.featuredImage ? [product.featuredImage.url] : [] }
  } : { title: 'Product' };
}

export default async function ProductPage({ params }: { params: { handle: string } }) {
  const product = await getProduct(params.handle);
  if (!product || !product.availableForSale || !hasSaleReadyMedia(product) || isHiddenFromCoreStorefront(product)) notFound();
  const productCategory = categoryFor(product);
  const allProducts = coreMerchProducts(availableProducts(await getProducts()));
  const related = allProducts
    .filter((item) => item.handle !== product.handle && item.availableForSale)
    .sort((a, b) => Number(categoryFor(b) === productCategory) - Number(categoryFor(a) === productCategory))
    .slice(0, 3);
  const variant = product.variants.find((item) => item.availableForSale);
  const images = product.images.length ? product.images.slice(0, 4) : product.featuredImage ? [product.featuredImage] : [];
  const bullets = productValueBullets(product);
  const bestFor = productBestFor(product);
  const faqs = productFaq(product);
  const title = cleanText(product.title);
  const description = productBuyerPromise(product);
  const kitFit = kitFitFor(product.handle, productCategory);
  const productUrl = `${siteUrl}/products/${product.handle}`;

  return (
    <>
      <ProductViewTracker productId={product.id} variantId={variant?.id} title={title} handle={product.handle} price={product.priceRange.minVariantPrice} category={productCategory} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([
        {
          '@context': 'https://schema.org',
          '@type': 'Product',
          '@id': `${productUrl}#product`,
          name: title,
          url: productUrl,
          image: images.map((image) => image.url),
          description,
          category: productCategory,
          brand: { '@type': 'Brand', name: supplierName(product) },
          seller: { '@type': 'OnlineStore', name: 'WYX Golf Supply Co.', url: siteUrl },
          offers: {
            '@type': 'Offer',
            url: productUrl,
            priceCurrency: variant?.price.currencyCode,
            price: variant?.price.amount,
            availability: variant ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
            itemCondition: 'https://schema.org/NewCondition',
            seller: { '@type': 'OnlineStore', name: 'WYX Golf Supply Co.' }
          }
        },
        {
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: faqs.map(([question, answer]) => ({ '@type': 'Question', name: question, acceptedAnswer: { '@type': 'Answer', text: answer } }))
        },
        {
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
            { '@type': 'ListItem', position: 2, name: 'Shop', item: `${siteUrl}/products` },
            { '@type': 'ListItem', position: 3, name: title, item: productUrl }
          ]
        }
      ]) }} />
      <nav className="breadcrumbs" aria-label="Breadcrumb"><Link href="/products">Shop</Link><span>/</span><Link href={`/products?category=${encodeURIComponent(productCategory)}`}>{productCategory}</Link><span>/</span><span>{title}</span></nav>
      <section className="product-detail">
        <div className="gallery">
          {images.map((image, index) => <Image key={image.url} className={index === 0 ? 'gallery-main' : ''} src={image.url} alt={cleanText(image.altText) || title} width={1200} height={900} priority={index === 0} />)}
          {!images.length && <div className="image-placeholder gallery-main">Product image coming soon</div>}
        </div>
        <div className="purchase-panel">
          <p className="eyebrow">{productCategory}</p>
          <h1>{title}</h1>
          <p className="price large">{money(product.priceRange.minVariantPrice)}</p>
          <p>{description}</p>
          <div className="ai-answer-box">
            <strong>Quick take</strong>
            <p>{title} is best for {bestFor.slice(0, 3).join(', ').toLowerCase()}. It fits WYX because it is useful, giftable, and easy to pair with other golf gear.</p>
          </div>
          <div className="conversion-panel">
            <strong>Why golfers use it</strong>
            <ul>{bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}</ul>
          </div>
          <div className="trust-list" aria-label="Purchase confidence">
            <span>Shipping shown before payment</span>
            <span>Returns help from WYX</span>
            <span>Secure Shopify checkout</span>
            <span>Trusted golf gear</span>
            <span>U.S. customer support</span>
            <span>Use WYX10 for 10% off</span>
          </div>
          <AddToCartButton variantId={variant?.id} />
          <AddToCartButton variantId={variant?.id} buyNow />
          <div className="detail-list">
            <section><h2>Best For</h2><ul>{bestFor.map((item) => <li key={item}>{item}</li>)}</ul></section>
            <section><h2>Who This Is For</h2><p>{whoThisIsFor(productCategory)}</p></section>
            <section><h2>Gift & Kit Fit</h2><p>{kitFit}</p></section>
            <section><h2>Product Details</h2><p>Review the product description above for included items, sizing, color options, and fit notes before adding it to your bag.</p></section>
            <section><h2>Why Buy From WYX?</h2><p>WYX keeps the offer focused on practical golf gifts, hats, apparel, trip gear, and bag upgrades. Checkout runs through Shopify, support is by email, and shipping is shown before payment.</p></section>
            <section><h2>Shipping & Returns</h2><p>Shipping rates and delivery estimates are shown before payment. If something arrives damaged or incorrect, contact WYX support at <a href={`mailto:${supportEmail}`}>{supportEmail}</a> with your order number and photos so we can help.</p></section>
            <section><h2>Launch Reviews</h2><p>WYX is new, so reviews are still coming in. Every launch product is selected because it solves a real bag, range, style, trip, or gift problem for everyday golfers.</p></section>
            <section><h2>Quick Questions</h2>{faqs.map(([question, answer]) => <details key={question}><summary>{question}</summary><p>{answer}</p></details>)}</section>
          </div>
        </div>
      </section>
      <div className="mobile-sticky-atc" aria-label="Sticky mobile purchase bar">
        <div><strong>{money(product.priceRange.minVariantPrice)}</strong><span>{title}</span></div>
        <AddToCartButton variantId={variant?.id} buyNow />
      </div>
      {related.length > 0 && <section className="section"><p className="eyebrow">Pair It With</p><h2>Build The Bag Around It.</h2><div className="product-grid">{related.map((item) => <ProductCard key={item.id} product={item} />)}</div></section>}
      <EmailCapture source="product-page" campaign={`product_${product.handle}`} title="Save This Drop For Later." body="Join the launch list for WYX10 reminders, golf gift picks, and useful bag upgrades." />
    </>
  );
}

function whoThisIsFor(category: string) {
  if (category === 'Headwear') return 'Golfers who want course-ready style, trip groups building matching carts, and gift shoppers who want low-risk golf apparel.';
  if (category === 'Apparel') return 'Weekend golfers, golf dads, and trip groups who want wearable golf gear that feels more premium than random novelty apparel.';
  if (category === 'Golf Balls') return 'Golfers restocking before a round, group-trip buyers, prize tables, and anyone buying a practical golf gift.';
  if (category === 'Towels' || category === 'Club Care') return 'Golfers who care about clean clubs, dry grips, and small bag habits that make rounds feel more prepared.';
  return 'Weekend players, golf dads, trip groups, league golfers, and gift shoppers who want useful gear without guessing at clubs or complicated specs.';
}

function kitFitFor(handle: string, category: string) {
  if (category === 'Headwear') return 'A strong style piece for golf trips, dad gifts, bachelor party carts, and course-to-weekend rotation.';
  if (category === 'Apparel') return 'Best paired with hats, towels, markers, or balls so the cart feels like a complete golf fit and bag upgrade.';
  if (/towel/.test(handle)) return 'Giftable and useful in the Golf Trip Survival Kit, Dad Golf Gift Kit, and Clean Contact Kit.';
  if (/marker/.test(handle)) return 'A strong fit for golf trip groups, bachelor party gifts, scramble prize tables, and first-tee kits.';
  if (/ball|shockd/.test(handle)) return 'Best as a trip-pack, prize-table, or first-tee chaos add-on.';
  if (/caddie|magnet/.test(handle)) return 'Best for bag organization, golf trip gear, and the First Tee Chaos Kit.';
  if (/glove|grip/.test(handle)) return 'Best as a practical bag-essential add-on or golf dad gift.';
  if (/headcover/.test(handle)) return 'Best as a giftable bag-upgrade piece for golfers who like their setup to have personality.';
  return 'Best as a practical WYX bag upgrade and build-your-own kit item.';
}
