import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { EmailCapture } from '@/components/EmailCapture';
import { KitAddButton } from '@/components/KitAddButton';
import { ProductCard } from '@/components/ProductCard';
import { ProductBadge } from '@/components/ProductBadge';
import { MobileProductStickyBar } from '@/components/MobileProductStickyBar';
import { ProductPriceDisplay } from '@/components/ProductPriceDisplay';
import { ProductPurchaseControls } from '@/components/ProductPurchaseControls';
import { ProductViewTracker } from '@/components/ProductViewTracker';
import { JudgeMeProductReviews } from '@/components/JudgeMe';
import { TrustBar } from '@/components/TrustBar';
import { SizingGuidePanel } from '@/components/SizingGuidePanel';
import { lifestyleImagesFor } from '@/lib/lifestyleImages';
import { sizingGuideFor } from '@/lib/sizingGuides';
import { availableProducts, categoryFor, hasSaleReadyMedia, supplierName } from '@/lib/catalog';
import { money } from '@/lib/demo';
import { fulfillmentTrustLabel } from '@/lib/fulfillment';
import { productPrice, siteUrl } from '@/lib/feed';
import { productBuyerPromise, productFaq, productValueBullets } from '@/lib/merchandising';
import { coreMerchProducts, isHiddenFromCoreStorefront } from '@/lib/merchandisingFilters';
import { hasKnownImageMismatch } from '@/lib/productReadiness';
import { productQualityScore } from '@/lib/productQuality';
import { getProduct, getProducts } from '@/lib/shopify/products';
import { supportEmail } from '@/lib/support';
import { cleanText } from '@/lib/text';
import type { Product } from '@/types/shopify';

export const revalidate = 300;

export async function generateMetadata({ params }: { params: { handle: string } }): Promise<Metadata> {
  const product = await getProduct(params.handle);
  if (!product) return { title: 'Product' };
  const description = productBuyerPromise(product);
  return {
    title: cleanText(product.title),
    description,
    alternates: { canonical: `/products/${product.handle}` },
    openGraph: {
      url: `/products/${product.handle}`,
      title: cleanText(product.title),
      description,
      images: product.featuredImage ? [product.featuredImage.url] : []
    },
    twitter: {
      card: 'summary_large_image',
      title: cleanText(product.title),
      description,
      images: product.featuredImage ? [product.featuredImage.url] : []
    }
  };
}

const relatedCategoryOrder: Record<string, string[]> = {
  Apparel: ['Headwear', 'Accessories', 'Towels', 'Gloves', 'Grips'],
  Headwear: ['Apparel', 'Accessories', 'Gloves', 'Towels', 'Grips'],
  Gloves: ['Headwear', 'Towels', 'Accessories', 'Apparel', 'Grips'],
  Towels: ['Accessories', 'Headwear', 'Gloves', 'Apparel', 'Grips'],
  Grips: ['Gloves', 'Towels', 'Accessories', 'Headwear', 'Apparel'],
  Accessories: ['Headwear', 'Gloves', 'Towels', 'Apparel', 'Grips']
};

function complementaryScore(sourceCategory: string, item: Product) {
  const category = categoryFor(item);
  const order = relatedCategoryOrder[sourceCategory] || ['Accessories', 'Headwear', 'Gloves', 'Towels', 'Apparel', 'Grips'];
  const position = order.indexOf(category);
  const categoryScore = position === -1 ? 0 : (order.length - position) * 25;
  return categoryScore + productQualityScore(item);
}

export default async function ProductPage({ params }: { params: { handle: string } }) {
  const product = await getProduct(params.handle);
  if (!product || !product.availableForSale || !hasSaleReadyMedia(product) || isHiddenFromCoreStorefront(product) || hasKnownImageMismatch(product)) notFound();

  const productCategory = categoryFor(product);
  const allProducts = coreMerchProducts(availableProducts(await getProducts()));
  const complementaryPool = allProducts
    .filter((item) => item.handle !== product.handle && item.availableForSale && categoryFor(item) !== productCategory)
    .sort((a, b) => complementaryScore(productCategory, b) - complementaryScore(productCategory, a));
  const related = complementaryPool
    .filter((item, index, items) => items.findIndex((candidate) => categoryFor(candidate) === categoryFor(item)) === index)
    .slice(0, 3);

  const availableVariants = product.variants.filter((item) => item.availableForSale && !item.id.startsWith('demo-'));
  const variant = availableVariants[0];
  const productAmount = Number(productPrice(product).amount);
  const canPairInline = availableVariants.length === 1 && productAmount <= 75 && productCategory !== 'Apparel';
  const pairProduct = canPairInline
    ? complementaryPool
        .filter((item) => {
          const available = item.variants.filter((v) => v.availableForSale && !v.id.startsWith('demo-'));
          const price = Number(productPrice(item).amount);
          return available.length === 1 && price >= 15 && price <= 35;
        })
        .find(Boolean)
    : undefined;
  const pairVariant = pairProduct?.variants.find((v) => v.availableForSale && !v.id.startsWith('demo-'));
  const pairTotal = pairProduct ? productAmount + Number(productPrice(pairProduct).amount) : 0;

  const title = cleanText(product.title);
  const shopifyUrls = (product.images.length ? product.images : product.featuredImage ? [product.featuredImage] : []).map((img) => img.url);
  const lifestyleUrls = lifestyleImagesFor(product.handle, productCategory, shopifyUrls);
  const images = lifestyleUrls.map((url) => {
    const existing = product.images.find((img) => img.url === url) || (product.featuredImage?.url === url ? product.featuredImage : null);
    return existing || { url, altText: title };
  }).slice(0, 6);
  const sizingGuide = sizingGuideFor(productCategory, title);
  const reasons = productValueBullets(product);
  const faqs = productFaq(product);
  const description = productBuyerPromise(product);
  const shipEstimate = fulfillmentTrustLabel(product);
  const productUrl = `${siteUrl}/products/${product.handle}`;
  const brand = supplierName(product);

  return (
    <>
      <ProductViewTracker productId={product.id} variantId={variant?.id} title={title} handle={product.handle} price={product.priceRange.minVariantPrice} category={productCategory} brand={brand} imageUrl={images[0]?.url} />
      <TrustBar compact />
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
          brand: { '@type': 'Brand', name: brand },
          seller: { '@type': 'OnlineStore', name: 'WYX Golf Supply Co.', url: siteUrl },
          offers: availableVariants.map((item) => ({
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

      <nav className="breadcrumbs" aria-label="Breadcrumb">
        <Link href="/products">Shop</Link><span>/</span>
        <Link href={`/products?category=${encodeURIComponent(productCategory)}`}>{productCategory}</Link><span>/</span>
        <span>{title}</span>
      </nav>

      <section className="product-detail">
        <div className="gallery">
          {images.map((image, index) => (
            <Image key={image.url} className={index === 0 ? 'gallery-main' : ''} src={image.url} alt={cleanText(image.altText) || title} width={1200} height={900} priority={index === 0} />
          ))}
          {!images.length && <div className="image-placeholder gallery-main">Product image coming soon</div>}
        </div>

        <div className="purchase-panel">
          <p className="eyebrow">{brand} / {productCategory}</p>
          <ProductBadge product={product} />
          <h1>{title}</h1>
          <ProductPriceDisplay price={product.priceRange.minVariantPrice} />
          <p>{description}</p>

          <div className="trust-list" aria-label="Purchase confidence">
            {shipEstimate && <span>{shipEstimate}</span>}
            <span>Clear shipping & returns</span>
            <span>Secure Shopify checkout</span>
            <span>WYX support after purchase</span>
          </div>

          <ProductPurchaseControls variants={product.variants} productTitle={title} />
          {sizingGuide && <SizingGuidePanel guide={sizingGuide} />}

          {canPairInline && pairProduct && variant && pairVariant && (
            <div className="conversion-panel" aria-label="Complete the pair bundle">
              <strong>Pair It</strong>
              <p>
                Add the <Link href={`/products/${pairProduct.handle}`}>{cleanText(pairProduct.title)}</Link> ({money(productPrice(pairProduct))}) — {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(pairTotal)} total before any eligible first-order offer.
              </p>
              <KitAddButton
                lines={[{ merchandiseId: variant.id, quantity: 1 }, { merchandiseId: pairVariant.id, quantity: 1 }]}
                label="Add Both To Bag"
              />
            </div>
          )}

          <div className="detail-list">
            <section>
              <h2>Why WYX Picked It</h2>
              <ul>{reasons.map((item) => <li key={item}>{item}</li>)}</ul>
            </section>
            <section>
              <h2>Shipping & Returns</h2>
              <p>Shipping options and delivery estimates are shown before payment. For return eligibility or help with an order, read the <Link className="text-link" href="/shipping-returns">WYX shipping & returns policy</Link> or contact <a className="text-link" href={`mailto:${supportEmail}`}>{supportEmail}</a>.</p>
            </section>
            <section>
              <h2>Quick Questions</h2>
              {faqs.map(([question, answer]) => <details key={question}><summary>{question}</summary><p>{answer}</p></details>)}
            </section>
          </div>
        </div>
      </section>

      <MobileProductStickyBar title={title} variants={product.variants} />

      {related.length > 0 && (
        <section className="section">
          <p className="eyebrow">PAIR IT WITH</p>
          <h2>BUILD THE BAG AROUND IT.</h2>
          <div className="product-grid">{related.map((item) => <ProductCard key={item.id} product={item} />)}</div>
        </section>
      )}

      <JudgeMeProductReviews productId={product.id} productTitle={title} />

      <EmailCapture source="product-page" campaign={`product_${product.handle}`} title="GET NEW WYX PICKS FIRST." body="New gear, premium brands, trip picks, and the products worth knowing about." />
    </>
  );
}
