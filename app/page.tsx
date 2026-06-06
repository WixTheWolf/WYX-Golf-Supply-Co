import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { EditorialProductCard } from '@/components/EditorialProductCard';
import { EmailCapture } from '@/components/EmailCapture';
import { availableProducts } from '@/lib/catalog';
import { imageMap } from '@/lib/demo';
import { createProductAllocator } from '@/lib/homeMerchandising';
import { commerceKits } from '@/lib/kits';
import { channelPlan } from '@/lib/marketing';
import { coreMerchProducts, firstBuyProducts } from '@/lib/merchandisingFilters';
import { sortByQuality } from '@/lib/productQuality';
import { getProducts } from '@/lib/shopify/products';

export const revalidate = 300;

export const metadata: Metadata = {
  title: 'Golf Gifts, Trip Kits, Hats, Apparel & Bag Upgrades',
  description: 'Shop WYX Golf Supply Co. for curated golf gifts, trip gear, hats, apparel, towels, markers, gloves, balls, training aids, and bag upgrades for weekend golfers.',
  alternates: { canonical: '/' }
};

const shopIntents = [
  { label: 'Trip Kits', href: '/golf-trip-gear', kicker: 'Bachelor weekends, buddy trips, prize tables', icon: '01' },
  { label: 'Golf Gifts', href: '/golf-gifts', kicker: 'Useful picks under $60 when possible', icon: '02' },
  { label: 'Hats', href: '/products?category=Headwear', kicker: 'Low-risk style, easy add-to-cart', icon: '03' },
  { label: 'Apparel', href: '/products?category=Apparel', kicker: 'Course-ready weekend wear', icon: '04' },
  { label: 'Bag Upgrades', href: '/bag-upgrades', kicker: 'Markers, gloves, towels, caddies, balls', icon: '05' },
  { label: 'Training', href: '/products?category=Training%20Aids', kicker: 'Putting, contact, setup, practice gear', icon: '06' }
];

const proofPoints = [
  'Checkout tested live',
  'Real product media only',
  'Curated golf suppliers',
  'WYX10 saves 10%',
  'Mobile-first shopping',
  'No random filler'
];

const bundleCards = [
  {
    title: 'Golf Trip Survival Kit',
    copy: 'Build a cart for the weekend: balls, glove, towel, caddie, marker, and one wearable piece.',
    href: '/golf-trip-gear'
  },
  {
    title: 'Dad Gift Kit',
    copy: 'Low-risk golf gifts that feel useful immediately: hat, glove, marker, towel, or ball restock.',
    href: '/golf-gifts-for-dad'
  },
  {
    title: 'Bag Reset Kit',
    copy: 'Clean up the bag with small accessories that get used every round instead of sitting in a drawer.',
    href: '/bag-upgrades'
  }
];

const reviewSignals = [
  ['Weekend golfer filter', 'Products have to be useful for real rounds, gifts, trips, or the bag.'],
  ['Image discipline', 'Mockups and starter WYX images are blocked from sale-ready merchandising.'],
  ['Fast decision paths', 'Shop by intent first, then product category, then price or gift fit.']
];

export default async function Home() {
  const catalog = sortByQuality(coreMerchProducts(availableProducts(await getProducts())));
  const allocator = createProductAllocator();
  const shortList = allocator.take(firstBuyProducts(catalog), 4);
  const cartBuilders = allocator.take(catalog, 8);
  const channelHighlights = channelPlan.slice(0, 3);

  return (
    <>
      <section className="hero launch-hero">
        <Image src={imageMap.hero} alt="Coastal fairway at golden hour" fill priority />
        <div className="hero-copy launch-hero-copy">
          <p className="eyebrow">WYX Golf Supply Co.</p>
          <h1>Golf Gear For The Boys, The Trip, And The Bag.</h1>
          <p>Giftable hats, apparel, trip gear, ball markers, gloves, balls, and bag upgrades selected for weekend golfers who want the cart to feel fun and useful.</p>
          <div className="actions">
            <Link className="button primary" href="/golf-trip-gear">Shop Trip Kits</Link>
            <Link className="button secondary" href="/products">Build Your Bag</Link>
          </div>
          <div className="hero-proof compact-proof">
            <span>WYX10 saves 10%</span>
            <span>Secure Shopify checkout</span>
            <span>Useful gifts</span>
            <span>Real product media</span>
          </div>
        </div>
      </section>

      <section className="home-intent-band" aria-label="Shop by intent">
        <div className="home-intent-grid">
          {shopIntents.map((intent) => (
            <Link key={intent.label} href={intent.href}>
              <span aria-hidden="true">{intent.icon}</span>
              <strong>{intent.label}</strong>
              <small>{intent.kicker}</small>
            </Link>
          ))}
        </div>
      </section>

      {shortList.length > 0 && <section className="section short-list-section">
        <div className="section-heading split">
          <div>
            <p className="eyebrow">Best First Cart</p>
            <h2>Start With The Products A Golfer Would Actually Buy Today.</h2>
          </div>
          <Link className="text-link" href="/products">Shop All</Link>
        </div>
        <div className="editorial-product-grid home-feature-grid">
          {shortList.map((product, index) => <EditorialProductCard key={product.id} product={product} featured={index === 0} />)}
        </div>
      </section>}

      <section className="section bundle-section">
        <div className="section-heading split">
          <div>
            <p className="eyebrow">Bundles That Raise AOV</p>
            <h2>Give The Customer A Cart, Not A Catalog.</h2>
          </div>
          <Link className="text-link" href="/golf-trip-gear">View Kits</Link>
        </div>
        <div className="bundle-grid">
          {bundleCards.map((bundle) => (
            <article className="bundle-card" key={bundle.title}>
              <h3>{bundle.title}</h3>
              <p>{bundle.copy}</p>
              <Link className="button secondary dark" href={bundle.href}>Shop The Kit</Link>
            </article>
          ))}
        </div>
      </section>

      <section className="conversion-proof-band">
        {proofPoints.map((point) => <span key={point}>{point}</span>)}
      </section>

      {cartBuilders.length > 0 && <section className="section">
        <div className="section-heading split">
          <div>
            <p className="eyebrow">Easy Cart Builders</p>
            <h2>Small Adds That Make The Bag Better.</h2>
          </div>
          <Link className="text-link" href="/products?filter=25-60">Shop $25-$60</Link>
        </div>
        <div className="product-grid">
          {cartBuilders.map((product) => <EditorialProductCard key={product.id} product={product} />)}
        </div>
      </section>}

      <section className="section seo-guide premium-proof-section">
        <div>
          <p className="eyebrow">Why WYX Converts</p>
          <h2>A Premium Golf Shop Has To Say No.</h2>
          <p>WYX should feel curated, not like a swap meet. Every product needs a reason to be here: giftable, useful, wearable, trip-ready, or a real bag upgrade.</p>
        </div>
        <div className="seo-guide-grid">
          {reviewSignals.map(([title, copy]) => (
            <article className="seo-guide-card" key={title}>
              <h3>{title}</h3>
              <p>{copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="kits" className="section">
        <div className="section-heading split">
          <div>
            <p className="eyebrow">Kit Builder</p>
            <h2>Merchandise Around Real Buying Moments.</h2>
          </div>
          <Link className="text-link" href="/golf-trip-gear">Build A Trip Kit</Link>
        </div>
        <div className="kit-grid">
          {commerceKits.slice(0, 3).map((kit) => (
            <article className="kit-card kit-card-simple" key={kit.title}>
              <p className="eyebrow">{kit.eyebrow}</p>
              <h3>{kit.title}</h3>
              <p>{kit.description}</p>
              <p className="product-meta">Bundle-ready WYX Select</p>
              <Link className="text-link" href="/golf-trip-gear">View Kit</Link>
            </article>
          ))}
        </div>
      </section>

      <section className="section channel-home-section">
        <div className="section-heading split">
          <div>
            <p className="eyebrow">More Places To Sell</p>
            <h2>Turn The Same Products Into More Buying Paths.</h2>
          </div>
          <Link className="text-link" href="/sell-more-places">Open Channel Hub</Link>
        </div>
        <div className="channel-mini-grid">
          {channelHighlights.map((channel) => <article key={channel.channel}>
            <p className="eyebrow">{channel.channel}</p>
            <h3>{channel.audience}</h3>
            <p>{channel.promise}</p>
            <Link className="text-link" href={channel.href}>{channel.cta}</Link>
          </article>)}
        </div>
      </section>

      <EmailCapture source="home" campaign="home_launch_list" title="Get The Next WYX Select Drop." body="Join the list for better golf hats, apparel, trip gear, gifts, and launch discounts." />
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
