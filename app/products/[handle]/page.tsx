import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { EmailCapture } from '@/components/EmailCapture';
import { ProductCard } from '@/components/ProductCard';
import { ProductPurchaseControls } from '@/components/ProductPurchaseControls';
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
          offers: product.variants.filter((item) => item.availableForSale).map((item) => ({
            '@type': 'Offer',
            url: productUrl,
            priceCurrency: item.price.currencyCode,
            price: item.price.amount,
            availability: 'https://schema.org/InStock',
            itemCondition: 'https://schema.org/NewCondition',
            seller: { '@type': 'OnlineStore', name: 'WYX Golf Supply Co.' }
          }))
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
          <p className="promo-note">Use <strong>WYX10</strong> for 10% off your first order.</p>
          <div className="ai-answer-box">
            <strong>Quick take</strong>
            <p>{quickTakeFor(product.handle, productCategory, title)}</p>
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
          <ProductPurchaseControls variants={product.variants} productTitle={title} />
          <div className="detail-list">
            <section><h2>Best For</h2><ul>{bestFor.map((item) => <li key={item}>{item}</li>)}</ul></section>
            <section><h2>Gift Note</h2><p>{giftNoteFor(product.handle, productCategory)}</p></section>
            <section><h2>Pair It With</h2><p>{kitFit}</p></section>
            <section><h2>Why Buy From WYX?</h2><p>WYX keeps the shop focused on wearable golf gear, easy gifts, trip gear, prize-table picks, and small bag upgrades that fit real rounds.</p></section>
            <section><h2>Shipping & Returns</h2><p>Shipping rates and delivery estimates are shown before payment. If something arrives damaged or incorrect, contact WYX support at <a href={`mailto:${supportEmail}`}>{supportEmail}</a> with your order number and photos so we can help.</p></section>
            <section><h2>Quick Questions</h2>{faqs.map(([question, answer]) => <details key={question}><summary>{question}</summary><p>{answer}</p></details>)}</section>
          </div>
        </div>
      </section>
      <div className="mobile-sticky-atc" aria-label="Sticky mobile purchase bar">
        <div><strong>{money(product.priceRange.minVariantPrice)}</strong><span>{title}</span></div>
        <ProductPurchaseControls variants={product.variants} productTitle={title} compact />
      </div>
      {related.length > 0 && <section className="section"><p className="eyebrow">Pair It With</p><h2>Build The Bag Around It.</h2><div className="product-grid">{related.map((item) => <ProductCard key={item.id} product={item} />)}</div></section>}
      <EmailCapture source="product-page" campaign={`product_${product.handle}`} title="Save This Drop For Later." body="Join the launch list for WYX10 reminders, golf gift picks, and useful bag upgrades." />
    </>
  );
}

function quickTakeFor(handle: string, category: string, title: string) {
  if (/shockd|ball/.test(handle) || category === 'Golf Balls') return 'A loud, easy ball restock for trips, prize tables, and weekend rounds.';
  if (/marker/.test(handle)) return 'A small bag upgrade that works for gifts, scrambles, and golf-trip side bets.';
  if (/hat|cap/.test(handle) || category === 'Headwear') return 'An easy style piece for the course, the trip, and everything after the round.';
  if (category === 'Apparel') return 'A wearable golf piece that gives the cart more personality without feeling like novelty gear.';
  if (/towel/.test(handle) || category === 'Towels') return 'A bag-ready towel for wet grips, clean club faces, and everyday rounds.';
  if (/glove|grip/.test(handle)) return 'A practical bag upgrade golfers can use right away.';
  if (/caddie|magnet/.test(handle)) return 'A small organizer for the stuff that usually disappears in the bottom of the bag.';
  return `${title} is a useful add for weekend rounds, golf trips, and giftable bag upgrades.`;
}

function giftNoteFor(handle: string, category: string) {
  if (/shockd|ball/.test(handle) || category === 'Golf Balls') return 'Golf balls are an easy gift because they get used, lost, and restocked all season.';
  if (/marker/.test(handle)) return 'Ball markers are small, affordable, and easy to add to a golf gift without guessing a size.';
  if (/hat|cap/.test(handle) || category === 'Headwear') return 'Hats are one of the safest golf gifts when you want something personal without needing club specs.';
  if (category === 'Apparel') return 'Apparel works best when you know the golfer already likes course-ready weekend gear.';
  if (/towel/.test(handle) || category === 'Towels') return 'A towel is a useful golf gift because it goes straight on the bag and gets used every round.';
  if (/glove|grip/.test(handle)) return 'Gloves and grip accessories make strong add-on gifts because golfers burn through them over time.';
  return 'A good golf gift should be easy to understand, easy to use, and useful before the next tee time.';
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
