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
  title: 'Modern Golf Gear, Gifts & Bag Upgrades',
  description: 'Less golf shop. More gear drop. Shop a tight edit of headcovers, gloves, golf gifts, trip gear and bag upgrades selected for real rounds.',
  alternates: { canonical: '/' },
  openGraph: {
    title: 'WYX Golf Supply Co. | Less Golf Shop. More Gear Drop.',
    description: 'The stuff worth putting in your bag: modern headcovers, gloves, golf gifts, trip gear and small upgrades selected by golfers.',
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
      index: '01 / THE BAG',
      title: 'Make The Bag Better.',
      copy: 'Useful upgrades, personality pieces, and the small stuff you notice every single round.',
      href: '/weekend-golfer-bag-upgrade-kit',
      action: 'Start with the kit',
    },
    {
      index: '02 / THE TRIP',
      title: 'Pack For The Weekend.',
      copy: 'Golf-trip gear for airports, rental carts, 36-hole days, and everything after the last putt drops.',
      href: '/golf-trip-gear',
      action: 'Shop trip gear',
    },
    {
      index: '03 / THE GIFT',
      title: 'Give Golf Better.',
      copy: 'Headcovers, games, markers, gloves, and useful golf gear that does not feel like a panic buy.',
      href: '/golf-gifts',
      action: 'Find a gift',
    },
  ];

  const ticker = ['HEADCOVERS', 'GLOVES', 'TRIP GEAR', 'BAG UPGRADES', 'GOLF GIFTS', 'NO FILLER'];

  return (
    <div className="future-home">
      <section className="future-hero">
        <div className="future-hero-copy">
          <p className="eyebrow">WYX GOLF SUPPLY</p>
          <h1>LESS GOLF SHOP. <em>MORE GEAR DROP.</em></h1>
          <p className="future-hero-lede">
            The stuff worth putting in your bag. Headcovers, gloves, gifts, trip gear, and small upgrades selected for golfers who would rather buy fewer things and like them more.
          </p>
          <div className="future-actions">
            <Link className="button primary" href="/products">SHOP DROP 01</Link>
            <Link className="button secondary" href="/golf-trip-gear">EXPLORE TRIP GEAR</Link>
          </div>
          <div className="future-proof" aria-label="WYX shopping principles">
            <span>{catalog.length}-piece edit</span>
            <span>Curated by use, not catalog size</span>
            <span>Secure Shopify checkout</span>
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
                <small>DROP 01 / FEATURED</small>
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
              <p className="eyebrow">DROP 01 / THE EIGHT</p>
              <h2>THE EIGHT WE&apos;D SHOW A FRIEND FIRST.</h2>
            </div>
            <p>Some fix a problem. Some make the bag look better. The best do both. These are the first pieces we would put in front of a golfer.</p>
          </div>
          <div className="drop-grid">
            {drop.map((product, index) => <EditorialProductCard key={product.id} product={product} featured={index === 0} />)}
          </div>
          <div className="future-actions">
            <Link className="button primary" href="/products">SHOP THE FULL DROP</Link>
            <Link className="button secondary" href="/the-bag-test">READ THE BAG TEST</Link>
          </div>
        </section>
      )}

      <section className="future-section">
        <div className="future-section-head">
          <div>
            <p className="eyebrow">SHOP THE SITUATION</p>
            <h2>START WITH WHAT YOU&apos;RE DOING NEXT.</h2>
          </div>
          <p>No department-store maze. Build the bag, pack the trip, or find a golf gift that actually lands.</p>
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

      <section className="future-editorial-band">
        <p className="eyebrow">THE BAG TEST</p>
        <h2>IF IT DOESN&apos;T EARN A SPOT, IT DOESN&apos;T MAKE THE STORE.</h2>
        <p>WYX is not trying to carry everything in golf. We look for products with a clear job, enough personality to deserve the purchase, and a reason to stay in the bag after the novelty wears off.</p>
        <div className="future-editorial-grid">
          <div>
            <span>01 / USEFUL</span>
            <strong>It needs a job.</strong>
            <p>Clean something, protect something, organize something, improve the trip, or make the round more fun.</p>
          </div>
          <div>
            <span>02 / GOOD LOOKING</span>
            <strong>It should feel worth owning.</strong>
            <p>Golf gear lives in public. If it makes the bag look cheaper, it is not helping.</p>
          </div>
          <div>
            <span>03 / EASY TO BUY</span>
            <strong>No mystery purchase.</strong>
            <p>Clear product, clear price, visible options, secure checkout, and a real support path if something goes wrong.</p>
          </div>
        </div>
      </section>

      <EmailCapture
        source="home"
        campaign="drop_signal"
        title="GET DROP 02 FIRST."
        body="New gear, golf-trip picks, and the rare product that earns a place in the WYX edit. No inbox landfill."
      />
    </div>
  );
}
