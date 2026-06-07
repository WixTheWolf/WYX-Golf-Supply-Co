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

const visualStories = [
  { title: 'Wear It', href: '/products?category=Headwear', image: imageMap.ropeHat, copy: 'Hats and apparel for the course and the stop after.' },
  { title: 'Pack It', href: '/golf-trip-gear', image: imageMap.walk, copy: 'Trip-ready pieces for buddy weekends and scramble crews.' },
  { title: 'Clip It', href: '/bag-upgrades', image: imageMap.leather, copy: 'Markers, caddies, covers, towels, and bag upgrades.' }
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
            <Link className="button primary" href="/kits/golf-trip-kit">Shop Trip Kits</Link>
            <Link className="button secondary" href="/golf-gifts-for-dad">Shop Dad Gifts</Link>
          </div>
          <div className="hero-proof compact-proof">
            {trustSignals.map((item) => <span key={item}>{item}</span>)}
          </div>
        </div>
      </section>

      <section className="section visual-story-section">
        <div className="section-heading">
          <p className="eyebrow">Shop By Occasion</p>
          <h2>Start With The Round You Are Buying For.</h2>
        </div>
        <div className="visual-story-grid">
          {visualStories.map((story) => (
            <Link className="visual-story-card" key={story.title} href={story.href}>
              <Image src={story.image} alt={`${story.title} golf gear`} width={900} height={675} loading="lazy" sizes="(max-width: 650px) 92vw, (max-width: 900px) 46vw, 31vw" />
              <span>
                <strong>{story.title}</strong>
                <small>{story.copy}</small>
                <em>Shop Now</em>
              </span>
            </Link>
          ))}
        </div>
      </section>

      {shortList.length > 0 && <section id="short-list" className="section short-list-section">
        <div className="section-heading split">
          <div>
            <p className="eyebrow">Short List</p>
            <h2>Four Easy Wins.</h2>
          </div>
          <Link className="text-link" href="/products">Shop All</Link>
        </div>
        <div className="editorial-product-grid">
          {shortList.map((product, index) => <EditorialProductCard key={product.id} product={product} featured={index === 0} />)}
        </div>
      </section>}

      <section id="kits" className="section kit-visual-section">
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

      {under60.length > 0 && <section className="section">
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

      <section className="section why-wyx">
        <div>
          <p className="eyebrow">Why WYX?</p>
          <h2>Curated For Weekend Golfers.</h2>
        </div>
        <p>WYX keeps the shop tight: golf gifts, trip gear, hats, apparel, and small bag upgrades that make sense for real rounds.</p>
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
