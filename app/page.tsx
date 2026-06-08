import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { EditorialProductCard } from '@/components/EditorialProductCard';
import { EmailCapture } from '@/components/EmailCapture';
import { availableProducts } from '@/lib/catalog';
import { imageMap } from '@/lib/demo';
import { productPrice } from '@/lib/feed';
import { createProductAllocator } from '@/lib/homeMerchandising';
import { coreMerchProducts, firstBuyProducts, giftableProducts, isHomepageProduct } from '@/lib/merchandisingFilters';
import { sortByQuality } from '@/lib/productQuality';
import { getProducts } from '@/lib/shopify/products';

export const revalidate = 300;

export const metadata: Metadata = {
  title: 'Golf Gifts, Trip Kits, Hats, Apparel & Bag Upgrades',
  description: 'Shop WYX Golf Supply Co. for golf gifts, trip gear, hats, apparel, balls, markers, and bag upgrades for weekend golfers.',
  alternates: { canonical: '/' }
};

const kits = [
  { title: 'Trip Kit', href: '/kits/golf-trip-kit', image: imageMap.walk, copy: 'Packable gear for the boys weekend.' },
  { title: 'Dad Kit', href: '/kits/dad-gift-kit', image: imageMap.care, copy: 'Useful gifts he will actually use.' },
  { title: 'Bag Kit', href: '/kits/bag-upgrade-kit', image: imageMap.leather, copy: 'Small upgrades. Better setup.' }
];

const trustSignals = [
  'Secure Shopify checkout',
  'Shipping shown before payment',
  'Real supplier product photos',
  'Support by email'
];

const quickPaths = [
  ['Golf Gifts', '/golf-gifts'],
  ['Dad Gifts', '/golf-gifts-for-dad'],
  ['Hats', '/products?category=Headwear'],
  ['Apparel', '/products?category=Apparel'],
  ['Training Aids', '/products?category=Training%20Aids'],
  ['Bag Upgrades', '/bag-upgrades']
];

const cartBoosts = [
  'WYX10 saves 10% on your first order',
  'Low-risk gifts under $60',
  'Checkout is live and secured by Shopify',
  'Curated for weekend golfers'
];

export default async function Home() {
  const catalog = sortByQuality(coreMerchProducts(availableProducts(await getProducts())));
  const allocator = createProductAllocator();
  const homepageCatalog = catalog
    .filter(isHomepageProduct)
    .filter((product) => Number(productPrice(product).amount) <= 250);
  const shortList = allocator.take(firstBuyProducts(homepageCatalog), 4);
  const shortListHandles = new Set(shortList.map((product) => product.handle));
  const under60 = giftableProducts(homepageCatalog, 12)
    .filter(isHomepageProduct)
    .filter((product) => Number(productPrice(product).amount) < 60)
    .filter((product) => !shortListHandles.has(product.handle))
    .slice(0, 4);

  return (
    <>
      <section className="hero launch-hero">
        <Image src={imageMap.hero} alt="Golf friends walking a course at golden hour" fill priority sizes="100vw" />
        <div className="hero-copy launch-hero-copy">
          <p className="eyebrow">WYX Golf Supply Co.</p>
          <h1>Gear For The Boys Weekend.</h1>
          <p>Golf gifts, trip kits, hats, apparel, and bag upgrades built for real rounds.</p>
          <div className="actions">
            <Link className="button primary" href="#short-list">Shop Best Picks</Link>
            <Link className="button secondary" href="/golf-gifts-for-dad">Shop Dad Gifts</Link>
          </div>
          <div className="hero-proof compact-proof">
            {trustSignals.map((item) => <span key={item}>{item}</span>)}
          </div>
        </div>
      </section>

      {shortList.length > 0 && <section id="short-list" className="section short-list-section reveal">
        <div className="section-heading split">
          <div>
            <p className="eyebrow">Start Here</p>
            <h2>Best First-Cart Picks.</h2>
          </div>
          <Link className="text-link" href="/products">Shop All</Link>
        </div>
        <div className="editorial-product-grid">
          {shortList.map((product, index) => <EditorialProductCard key={product.id} product={product} featured={index === 0} />)}
        </div>
      </section>}

      <section className="conversion-strip reveal" aria-label="Shop WYX categories">
        <div>
          <p className="eyebrow">Quick Shop</p>
          <h2>Find The Right Gift Fast.</h2>
        </div>
        <nav className="quick-paths" aria-label="Popular shopping paths">
          {quickPaths.map(([label, href]) => <Link key={href} href={href}>{label}</Link>)}
        </nav>
      </section>

      <section className="trust-badge-section reveal" aria-label="Shopping trust signals">
        {cartBoosts.map((item) => <span key={item}>{item}</span>)}
      </section>

      <section id="kits" className="section kit-visual-section reveal">
        <div className="section-heading split">
          <div>
            <p className="eyebrow">Bundles</p>
            <h2>Start With A Kit.</h2>
          </div>
          <Link className="text-link" href="/kits/golf-trip-kit">Build A Trip Kit</Link>
        </div>
        <div className="kit-visual-grid">
          {kits.map((kit) => (
            <Link className="kit-visual-card" key={kit.href} href={kit.href}>
              <Image src={kit.image} alt={`${kit.title} golf bundle`} width={900} height={675} loading="lazy" sizes="(max-width: 650px) 92vw, (max-width: 900px) 46vw, 31vw" />
              <span><strong>{kit.title}</strong><small>{kit.copy}</small><em>Build Kit</em></span>
            </Link>
          ))}
        </div>
      </section>

      {under60.length > 0 && <section className="section reveal">
        <div className="section-heading split">
          <div>
            <p className="eyebrow">Under $60</p>
            <h2>Easy Golf Gifts.</h2>
          </div>
          <Link className="text-link" href="/golf-gifts-under-60">Shop Gifts Under $60</Link>
        </div>
        <div className="product-grid">
          {under60.map((product) => <EditorialProductCard key={product.id} product={product} />)}
        </div>
      </section>}

      <section className="section why-wyx reveal">
        <div>
          <p className="eyebrow">Why WYX?</p>
          <h2>No Random Golf Junk.</h2>
        </div>
      </section>

      <EmailCapture source="home" campaign="home_launch_list" title="Get The Next Drop Before Your Foursome Does." body="Join the WYX list for new golf gifts, trip gear, and launch discounts." />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        name: 'WYX Golf Supply Co. featured golf gear',
        itemListElement: shortList.map((product, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          url: `https://wyxgolfsupply.com/products/${product.handle}`,
          name: product.title
        }))
      }) }} />
    </>
  );
}
