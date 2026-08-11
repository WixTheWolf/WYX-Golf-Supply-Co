import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { EditorialProductCard } from '@/components/EditorialProductCard';
import { EmailCapture } from '@/components/EmailCapture';
import { JudgeMeStoreBadge } from '@/components/JudgeMe';
import { ProductCarousel } from '@/components/ProductCarousel';
import { TrustBar } from '@/components/TrustBar';
import { availableProducts, categoryFor } from '@/lib/catalog';
import { imageMap } from '@/lib/demo';
import { productPrice } from '@/lib/feed';
import { createProductAllocator } from '@/lib/homeMerchandising';
import { coreMerchProducts, firstBuyProducts, giftableProducts, isHomepageProduct } from '@/lib/merchandisingFilters';
import { sortByQuality } from '@/lib/productQuality';
import { getProducts } from '@/lib/shopify/products';

export const revalidate = 300;

export const metadata: Metadata = {
  title: 'Weekend Golf Gifts & Bag Upgrades | WYX Golf Supply Co.',
  description: 'Practical golf gear for trips, weekend rounds, gifts, and better bags. Start with the Bag Upgrade Kit and save 10% on your first order with WYX10.',
  alternates: { canonical: '/' },
  openGraph: {
    title: 'Weekend Golf Gifts & Bag Upgrades | WYX Golf Supply Co.',
    description: 'Golf gear that stays in the bag — not the drawer. Curated trip gear, gifts, and the Bag Upgrade Kit. WYX10 saves 10%.',
    url: 'https://wyxgolfsupply.com',
    images: [{ url: '/images/boys-weekend-hero.png', width: 1536, height: 1024, alt: 'Weekend golfers on course' }],
  },
};

const kits = [
  { title: 'Trip Kit', href: '/kits/golf-trip-kit', image: imageMap.walk, copy: 'Packable gear for the golf trip.' },
  { title: 'Dad Kit', href: '/kits/dad-gift-kit', image: imageMap.care, copy: 'Useful gifts he will actually use.' },
  { title: 'Bag Kit', href: '/kits/bag-upgrade-kit', image: imageMap.leather, copy: 'Small upgrades. Better setup.' },
];

export default async function Home() {
  const catalog = sortByQuality(coreMerchProducts(availableProducts(await getProducts())));
  const allocator = createProductAllocator();
  const homepageCatalog = catalog
    .filter(isHomepageProduct)
    .filter((product) => Number(productPrice(product).amount) <= 250);

  function uniqueByHandle(products: typeof homepageCatalog) {
    const seen = new Set<string>();
    return products.filter((product) => {
      if (seen.has(product.handle)) return false;
      seen.add(product.handle);
      return true;
    });
  }

  const heroProducts = uniqueByHandle([
    ...firstBuyProducts(homepageCatalog),
    ...giftableProducts(homepageCatalog, 20),
  ].filter(Boolean) as typeof homepageCatalog);

  function diversifyByCategory(products: typeof homepageCatalog, maxPerCategory: number) {
    const categoryCounts = new Map<string, number>();
    return products.filter((product) => {
      const category = categoryFor(product);
      const count = categoryCounts.get(category) || 0;
      if (count >= maxPerCategory) return false;
      categoryCounts.set(category, count + 1);
      return true;
    });
  }

  const shortList = allocator.take(diversifyByCategory(heroProducts, 2), 8);
  const shortListHandles = new Set(shortList.map((product) => product.handle));
  const under60 = giftableProducts(homepageCatalog, 12)
    .filter(isHomepageProduct)
    .filter((product) => Number(productPrice(product).amount) < 60)
    .filter((product) => !shortListHandles.has(product.handle))
    .slice(0, 8);

  const situations = [
    { title: 'Golf Trip Gear', copy: 'Pack for the boys weekend', href: '/golf-trip-gear' },
    { title: 'Bag Upgrade Kit', copy: 'Five fixes. One order.', href: '/weekend-golfer-bag-upgrade-kit?discount=WYX10' },
    { title: 'Gifts Under $60', copy: 'Easy yes gifts', href: '/golf-gifts-under-60' },
    { title: 'Scramble Prizes', copy: 'Prizes they keep', href: '/scramble-prizes' },
    { title: 'The Bag Test', copy: 'Only gear worth keeping', href: '/the-bag-test' },
    { title: 'Shop All', copy: `${homepageCatalog.length} curated picks`, href: '/products' },
  ];

  return (
    <>
      <section className="hero launch-hero cinematic-hero">
        <Image src={imageMap.hero} alt="Weekend golfers walking the fairway at golden hour" fill priority sizes="100vw" />
        <div className="hero-copy launch-hero-copy">
          <p className="eyebrow">Built for the weekend</p>
          <h1>Golf Gear For Trips, Real Rounds &amp; Better Bags.</h1>
          <p>Useful golf gear without the junk-drawer filler. Start with the Bag Upgrade Kit, then build out the trip, gift, or bag from there. WYX10 saves 10% on your first order.</p>
          <div className="actions">
            <Link className="button primary" href="/weekend-golfer-bag-upgrade-kit?discount=WYX10">Shop The Bag Upgrade Kit</Link>
            <Link className="button secondary" href="/golf-trip-gear">Shop Trip Gear</Link>
          </div>
          <div className="hero-proof compact-proof">
            <span>Secure Shopify checkout</span>
            <span>WYX10 — 10% off</span>
            <span>Bag Test curated</span>
            <span>Ships US</span>
          </div>
        </div>
      </section>

      <TrustBar />

      {shortList.length > 0 && (
        <section id="short-list" className="section short-list-section reveal">
          <div className="section-heading split">
            <div>
              <p className="eyebrow">Weekend picks</p>
              <h2>Shop The Short List.</h2>
            </div>
            <Link className="text-link" href="/products">All products</Link>
          </div>
          <ProductCarousel label="Weekend product picks">
            {shortList.map((product, index) => (
              <div className="carousel-slide" key={product.id}>
                <EditorialProductCard product={product} featured={index === 0} />
              </div>
            ))}
          </ProductCarousel>
        </section>
      )}

      <section className="dark-section reveal kit-spotlight" aria-labelledby="kit-offer-heading">
        <div className="kit-spotlight-grid">
          <div>
            <p className="eyebrow">Start here</p>
            <h2 id="kit-offer-heading">The Bag Upgrade Kit.</h2>
            <p>Towel, marker, grip refresh, groove tool, accessory caddie — five small annoyances fixed in one cart. Use WYX10 for 10% off your first order.</p>
            <div className="actions">
              <Link className="button primary" href="/weekend-golfer-bag-upgrade-kit?discount=WYX10">Get The Kit — 10% Off</Link>
            </div>
          </div>
          <Image src={imageMap.towel} alt="Golf towel and bag accessories flat lay" width={900} height={675} className="kit-spotlight-image" />
        </div>
      </section>

      <section className="section reveal" aria-label="Shop by situation">
        <div className="section-heading">
          <p className="eyebrow">Shop fast</p>
          <h2>Find Your Lane.</h2>
        </div>
        <div className="category-grid">
          {situations.map((item) => (
            <Link key={item.href} href={item.href}>
              <span>{item.copy}</span>
              <strong>{item.title}</strong>
              <small>Shop →</small>
            </Link>
          ))}
        </div>
      </section>

      {under60.length > 0 && (
        <section className="section reveal">
          <div className="section-heading split">
            <div>
              <p className="eyebrow">Under $60</p>
              <h2>Easy Gift Yes.</h2>
            </div>
            <Link className="text-link" href="/golf-gifts-under-60">See all</Link>
          </div>
          <ProductCarousel label="Gifts under sixty dollars">
            {under60.map((product) => (
              <div className="carousel-slide" key={product.id}>
                <EditorialProductCard product={product} />
              </div>
            ))}
          </ProductCarousel>
        </section>
      )}

      <section id="kits" className="section kit-visual-section reveal">
        <div className="section-heading split">
          <div>
            <p className="eyebrow">Bundles</p>
            <h2>Pre-Built Kits.</h2>
          </div>
          <Link className="text-link" href="/kits/golf-trip-kit">Trip kit</Link>
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

      <section className="section reveal trust-review-section">
        <div className="section-heading">
          <p className="eyebrow">Trust</p>
          <h2>New Shop. Real Standards.</h2>
        </div>
        <p className="section-lead">No fake reviews. Every SKU has to pass The Bag Test: useful, giftable, or good enough to earn a permanent spot in the bag. Secure Shopify checkout, shipping shown before you pay.</p>
        <JudgeMeStoreBadge />
      </section>

      <section className="dark-section reveal" aria-labelledby="bag-test-promise-heading">
        <div>
          <p className="eyebrow">The Bag Test Promise</p>
          <h2 id="bag-test-promise-heading">Wrong order? We make it right.</h2>
          <div className="actions">
            <Link className="button primary" href="/the-bag-test">The Bag Test</Link>
            <Link className="button secondary dark" href="/shipping-returns">Shipping &amp; returns</Link>
          </div>
        </div>
      </section>

      <EmailCapture source="home" campaign="home_evergreen_list" title="Next drop before your foursome." body="Trip gear, gift picks, and Bag Test winners — one useful email at a time." />
    </>
  );
}
