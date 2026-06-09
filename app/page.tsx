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
  title: "Golf Gifts, Father's Day Golf Gifts, Hats & Bag Upgrades | WYX Golf Supply Co.",
  description: "Shop WYX Golf Supply Co. for Father's Day golf gifts, golf gloves, balls, alignment sticks, hats, apparel, and bag upgrades for weekend golfers. Use WYX10 for 10% off.",
  alternates: { canonical: '/' },
  openGraph: {
    title: "Golf Gifts & Father's Day Golf Gifts | WYX Golf Supply Co.",
    description: "Father's Day golf gifts, training aids, gloves, balls, and bag upgrades. Curated for weekend golfers. Use WYX10 for 10% off your first order.",
    url: 'https://wyxgolfsupply.com'
  }
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
  ["Dad Gifts 🎁", '/fathers-day-golf-gifts'],
  ["Last Minute ⏰", '/last-minute-fathers-day-golf-gifts'],
  ['Golf Gifts', '/golf-gifts'],
  ['Gloves', '/golf-gloves'],
  ['Ball Markers', '/golf-ball-markers'],
  ['Towels', '/golf-towels'],
  ['Hats', '/golf-hats'],
  ['Training', '/golf-practice-gear'],
  ['Under $25', '/golf-gifts-under-25'],
  ['Under $60', '/golf-gifts-under-60'],
  ['Bag Upgrades', '/bag-upgrades'],
  ['Belts', '/golf-belts'],
  ['Headcovers', '/golf-headcovers'],
  ['GPS Watch', '/golf-gps-watch'],
  ['Sunglasses', '/golf-sunglasses'],
  ['Arm Sleeves', '/golf-arm-sleeves'],
  ['Trip Gear', '/golf-trip-gear']
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

  function uniqueByHandle(products: typeof homepageCatalog) {
    const seen = new Set<string>();
    return products.filter((product) => {
      if (seen.has(product.handle)) return false;
      seen.add(product.handle);
      return true;
    });
  }

  const beltProduct = homepageCatalog.find((product) => /\bbelt\b/i.test(product.title));
  const lineMarkerProduct = homepageCatalog.find((product) => /(three[- ]rail|^3[- ]line|line marker|ball marker)/i.test(`${product.title} ${product.handle}`));

  const heroProducts = uniqueByHandle([
    ...firstBuyProducts(homepageCatalog),
    beltProduct,
    lineMarkerProduct,
    ...giftableProducts(homepageCatalog, 20)
  ].filter(Boolean) as typeof homepageCatalog);

  const shortList = allocator.take(heroProducts, 6);
  const shortListHandles = new Set(shortList.map((product) => product.handle));
  const under60 = giftableProducts(homepageCatalog, 12)
    .filter(isHomepageProduct)
    .filter((product) => Number(productPrice(product).amount) < 60)
    .filter((product) => !shortListHandles.has(product.handle))
    .slice(0, 4);

  return (
    <>
      {(() => {
        const fathersDay = new Date('2026-06-21T00:00:00');
        const now = new Date();
        const daysLeft = Math.ceil((fathersDay.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        if (daysLeft <= 0 || daysLeft > 21) return null;
        return (
          <div className="urgency-strip" role="banner" aria-label="Father's Day shopping deadline">
            ⏰ <strong>Father&apos;s Day is June 21</strong> — {daysLeft} day{daysLeft !== 1 ? 's' : ''} left. {daysLeft <= 5 ? <Link href="/last-minute-fathers-day-golf-gifts">Last minute picks →</Link> : <Link href="/fathers-day-golf-gifts">See golf gifts for dad →</Link>}
          </div>
        );
      })()}
      <section className="hero launch-hero">
        <Image src={imageMap.hero} alt="Golf friends walking a course at golden hour" fill priority sizes="100vw" />
        <div className="hero-copy launch-hero-copy">
          <p className="eyebrow">WYX Golf Supply Co.</p>
          <h1>Gear For The Boys Weekend.</h1>
          <p>Golf gifts, trip kits, hats, apparel, and bag upgrades built for real rounds.</p>
          <div className="actions">
            <Link className="button primary" href="/fathers-day-golf-gifts">Father&apos;s Day Gifts</Link>
            <Link className="button secondary" href="#short-list">Shop Best Picks</Link>
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

      <div className="proof-numbers reveal" aria-label="WYX by the numbers">
        <div><strong>74+</strong><span>Products in catalog</span></div>
        <div><strong>$10</strong><span>Lowest priced pick</span></div>
        <div><strong>WYX10</strong><span>10% off first order</span></div>
        <div><strong>June 21</strong><span>Father&apos;s Day deadline</span></div>
      </div>

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

      <section className="section why-wyx reveal" aria-labelledby="why-wyx-heading">
        <div className="section-heading">
          <p className="eyebrow">Why WYX?</p>
          <h2 id="why-wyx-heading">No Random Golf Junk.</h2>
        </div>
        <div className="care-step-grid">
          <div className="care-step-card">
            <strong>Curated for Weekend Golfers</strong>
            <p>Every product passes the bag test — if it does not earn a permanent spot in the bag, it does not make the catalog. No novelty gear, no branded tchotchkes, no items that get used once and re-gifted.</p>
          </div>
          <div className="care-step-card">
            <strong>Practical Over Flashy</strong>
            <p>The golfer who uses a quality microfiber towel, a milled ball marker, and fresh cabretta gloves every round plays better than one with a premium bag full of gear they never use. WYX stocks the former.</p>
          </div>
          <div className="care-step-card">
            <strong>Real Prices, No Markup Theater</strong>
            <p>Transparent pricing across the catalog. Use WYX10 for 10% off your first order. Everything ships via secure Shopify checkout — no account required, shipping shown before payment.</p>
          </div>
          <div className="care-step-card">
            <strong>Built for Gifts That Land</strong>
            <p>Every item in the WYX catalog is chosen because it is the thing the golfer in your life wants but would not buy for themselves. If it fails the &quot;will he actually use this&quot; test, it does not ship from WYX.</p>
          </div>
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
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: 'WYX Golf Supply Co.',
        url: 'https://wyxgolfsupply.com',
        logo: 'https://wyxgolfsupply.com/images/hero-coastal-fairway.png',
        description: 'Curated golf gifts, hats, apparel, training aids, and bag upgrades for weekend golfers.',
        sameAs: []
      }) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: [
          { '@type': 'Question', name: 'What are the best golf gifts under $60?', acceptedAnswer: { '@type': 'Answer', text: 'The best golf gifts under $60 include golf gloves, golf balls, alignment sticks, ball markers, golf towels, scorecard holders, and magnetic hat clips. WYX Golf Supply Co. carries all of these with free shipping thresholds and a 10% launch discount with code WYX10.' } },
          { '@type': 'Question', name: 'What golf training aids actually work?', acceptedAnswer: { '@type': 'Answer', text: 'Alignment sticks and putting mirrors are the two training aids proven to improve most golfers fastest. Alignment sticks fix stance and swing path; a putting mirror fixes eye position and face angle at setup. Both are under $40.' } },
          { '@type': 'Question', name: 'What should I put in a golf gift bag?', acceptedAnswer: { '@type': 'Answer', text: 'A good golf gift bag starts with a glove, a sleeve of balls, a ball marker, and a towel. Add a scorecard holder or alignment sticks for golfers who practice. WYX Golf Supply Co. has all of these and ships together.' } }
        ]
      }) }} />
    </>
  );
}
