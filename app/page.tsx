import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { EditorialProductCard } from '@/components/EditorialProductCard';
import { EmailCapture } from '@/components/EmailCapture';
import { availableProducts } from '@/lib/catalog';
import { money } from '@/lib/demo';
import { productPrice } from '@/lib/feed';
import { coreMerchProducts, firstBuyProducts } from '@/lib/merchandisingFilters';
import { sortByQuality } from '@/lib/productQuality';
import { getProducts } from '@/lib/shopify/products';

export const revalidate = 300;

export const metadata: Metadata = {
  title: 'Future Golf Gear',
  description: 'The WYX current drop: a hard edit of modern headcovers, grips, gloves, trip gear and bag upgrades. No filler. Secure Shopify checkout.',
  alternates: { canonical: '/' },
  openGraph: {
    title: 'WYX Golf Supply Co. | Future Golf Gear',
    description: 'Less golf shop. More gear drop. A hard edit of modern golf gear for real rounds.',
    url: 'https://wyxgolfsupply.com',
  },
};

export default async function Home() {
  const catalog = sortByQuality(coreMerchProducts(availableProducts(await getProducts())));
  const preferred = firstBuyProducts(catalog);
  const drop = [...preferred, ...catalog.filter((product) => !preferred.some((pick) => pick.handle === product.handle))].slice(0, 8);
  const feature = drop.find((product) => product.handle === 'evil-ape') || drop[0];

  const modes = [
    {
      index: '01 / BAG',
      title: 'Upgrade Mode',
      copy: 'Fix the small stuff that makes a bag feel dialed: towel, marker, grip, tees and organization.',
      href: '/weekend-golfer-bag-upgrade-kit?discount=WYX10',
      action: 'Build the bag',
    },
    {
      index: '02 / TRIP',
      title: 'Trip Mode',
      copy: 'Gear that survives airports, rental carts, 36-hole days and the group-chat expectations.',
      href: '/golf-trip-gear',
      action: 'Pack the trip',
    },
    {
      index: '03 / GIFT',
      title: 'Gift Mode',
      copy: 'Headcovers, games, markers and useful golf gear with enough personality to not feel generic.',
      href: '/golf-gifts',
      action: 'Find a gift',
    },
  ];

  const ticker = ['CURATED / NOT CROWDED', 'LIVE SHOPIFY INVENTORY', 'FULFILLMENT GATED', 'WYX10 / FIRST ORDER', 'BUILT FOR REAL ROUNDS'];

  return (
    <div className="future-home">
      <section className="future-hero">
        <div className="future-hero-copy">
          <p className="eyebrow">WYX // GOLF SYSTEM 2026</p>
          <h1>LESS GOLF SHOP. <em>MORE GEAR DROP.</em></h1>
          <p className="future-hero-lede">
            A hard edit of headcovers, grips, gloves, trip gear and bag upgrades that are actually worth carrying. No endless supplier wall. No mystery fulfillment. Just the stuff that makes golf look and feel better.
          </p>
          <div className="future-actions">
            <Link className="button primary" href="/products">SHOP THE DROP</Link>
            <Link className="button secondary" href="/weekend-golfer-bag-upgrade-kit?discount=WYX10">BUILD THE KIT</Link>
          </div>
          <div className="future-telemetry" aria-label="WYX store status">
            <span>{catalog.length} product edit</span>
            <span>Shopify checkout</span>
            <span>Fulfillment gated</span>
            <span>Live price sync</span>
          </div>
        </div>

        {feature?.featuredImage && (
          <div className="future-feature">
            <Link className="future-feature-card" href={`/products/${feature.handle}`}>
              <Image
                src={feature.featuredImage.url}
                alt={feature.featuredImage.altText || feature.title}
                fill
                priority
                sizes="(max-width: 1050px) 92vw, 38vw"
              />
              <div className="future-feature-info">
                <small>CURRENT SIGNAL / 001</small>
                <strong>{feature.title}</strong>
                <span>{money(productPrice(feature))} · VIEW PRODUCT →</span>
              </div>
            </Link>
          </div>
        )}
      </section>

      <div className="future-marquee" aria-hidden="true">
        <div className="future-marquee-track">
          {[...ticker, ...ticker].map((item, index) => <span key={`${item}-${index}`}><b>●</b> {item}</span>)}
        </div>
      </div>

      {drop.length > 0 && (
        <section className="future-section" id="drop">
          <div className="future-section-head">
            <div>
              <p className="eyebrow">THE CURRENT DROP</p>
              <h2>{drop.length} THINGS WORTH WANTING.</h2>
            </div>
            <p>Personality first. Utility required. Everything below is live, purchasable, and inside the WYX curated storefront gate.</p>
          </div>
          <div className="drop-grid">
            {drop.map((product, index) => <EditorialProductCard key={product.id} product={product} featured={index === 0} />)}
          </div>
          <div className="future-actions">
            <Link className="button primary" href="/products">SEE THE FULL EDIT</Link>
            <Link className="button secondary" href="/the-bag-test">HOW WE CUT PRODUCTS</Link>
          </div>
        </section>
      )}

      <section className="future-section">
        <div className="future-section-head">
          <div>
            <p className="eyebrow">SELECT A MODE</p>
            <h2>SHOP LIKE A GOLFER.</h2>
          </div>
          <p>Skip the department-store maze. Start with what you are actually doing next.</p>
        </div>
        <div className="future-mode-grid">
          {modes.map((mode) => (
            <Link href={mode.href} className="future-mode" key={mode.title}>
              <span className="future-mode-index">{mode.index}</span>
              <div>
                <h3>{mode.title}</h3>
                <p>{mode.copy}</p>
              </div>
              <strong>{mode.action} →</strong>
            </Link>
          ))}
        </div>
      </section>

      <section className="future-system-band">
        <p className="eyebrow">THE STORE RUNS LIKE A SYSTEM</p>
        <h2>COOL IS USELESS IF THE ORDER BREAKS.</h2>
        <p>WYX is built to stay lean: live Shopify inventory and prices, a hard fulfillment gate, automated catalog checks and scheduled operations reviews. The storefront gets the fun part. The system handles the boring part.</p>
        <div className="future-system-grid">
          <div><span>01 / INVENTORY</span><strong>Live Shopify data</strong></div>
          <div><span>02 / FULFILLMENT</span><strong>Unsafe SKUs blocked</strong></div>
          <div><span>03 / CURATION</span><strong>Tight public assortment</strong></div>
          <div><span>04 / OPERATIONS</span><strong>Scheduled health checks</strong></div>
        </div>
      </section>

      <EmailCapture
        source="home"
        campaign="drop_signal"
        title="GET THE NEXT SIGNAL."
        body="New drops, golf-trip gear and the rare product that earns a place in the WYX edit. No inbox landfill."
      />
    </div>
  );
}
