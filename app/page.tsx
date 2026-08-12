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

const golfPhotography = {
  hero: 'https://images.unsplash.com/photo-1684599995533-3ffecba8fb81?auto=format&fit=crop&w=2400&q=86',
  walking: 'https://images.unsplash.com/photo-1693163532134-5ea6c80b58a3?auto=format&fit=crop&w=1900&q=86',
  cart: 'https://images.unsplash.com/photo-1713729372679-7feb052d74a6?auto=format&fit=crop&w=1900&q=86',
};

export const metadata: Metadata = {
  title: 'Modern Golf Gear, Gifts & Bag Upgrades',
  description: 'Less golf shop. More gear drop. Shop a tight edit of headcovers, gloves, golf gifts, trip gear and bag upgrades selected for real rounds.',
  alternates: { canonical: '/' },
  openGraph: {
    title: 'WYX Golf Supply Co. | Less Golf Shop. More Gear Drop.',
    description: 'The stuff worth putting in your bag: modern headcovers, gloves, golf gifts, trip gear and small upgrades selected by golfers.',
    url: 'https://wyxgolfsupply.com',
    images: [{ url: golfPhotography.hero }],
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
      image: golfPhotography.walking,
      alt: 'Golfer walking a golf course carrying a golf bag',
    },
    {
      index: '02 / THE TRIP',
      title: 'Pack For The Weekend.',
      copy: 'Gear for airports, rental carts, 36-hole days, and everything after the last putt drops.',
      href: '/golf-trip-gear',
      action: 'Shop trip gear',
      image: golfPhotography.cart,
      alt: 'Golf cart and golf bag on the course',
    },
    {
      index: '03 / THE GIFT',
      title: 'Give Golf Better.',
      copy: 'Headcovers, games, markers, gloves, and useful gear that does not feel like a panic buy.',
      href: '/golf-gifts',
      action: 'Find a gift',
      image: golfPhotography.hero,
      alt: 'Golf bag and cart at sunset on a golf course',
    },
  ];

  const ticker = ['FIRST TEE', 'THE BAG', 'THE TRIP', 'THE CART', 'THE CLUBHOUSE', 'DROP 01'];

  return (
    <div className="future-home">
      <section className="future-hero">
        <Image
          className="future-hero-environment"
          src={golfPhotography.hero}
          alt="Golf bag and cart on a golf course at sunset"
          fill
          priority
          sizes="100vw"
        />
        <div className="future-hero-shade" />

        <div className="future-hero-copy">
          <p className="eyebrow">WYX GOLF SUPPLY</p>
          <h1>LESS GOLF SHOP. <em>MORE GEAR DROP.</em></h1>
          <p className="future-hero-lede">
            Golf gear should look right where it actually lives — on the bag, in the cart, at the first tee, and on the weekend away. We keep the pieces worth carrying and leave the catalog filler behind.
          </p>
          <div className="future-actions">
            <Link className="button primary" href="/products">SHOP DROP 01</Link>
            <Link className="button secondary" href="/golf-trip-gear">PACK THE TRIP</Link>
          </div>
          <div className="future-proof" aria-label="WYX shopping principles">
            <span>{catalog.length}-piece edit</span>
            <span>Selected for real rounds</span>
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
                sizes="(max-width: 1050px) 82vw, 31vw"
              />
              <div className="future-feature-info">
                <small>DROP 01 / BAG PERSONALITY</small>
                <strong>{feature.title}</strong>
                <span>{money(productPrice(feature))} · SHOP IT →</span>
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

      <section className="future-field-story" aria-label="WYX golf environment">
        <div className="future-field-photo future-field-photo-main">
          <Image src={golfPhotography.walking} alt="Golfer walking the golf course with a golf bag" fill sizes="(max-width: 900px) 100vw, 58vw" />
        </div>
        <div className="future-field-copy">
          <p className="eyebrow">WHERE THE PRODUCT HAS TO WORK</p>
          <h2>THE COURSE IS THE SHOWROOM.</h2>
          <p>A headcover is not a product tile. A towel is not a spec sheet. A hat is not a dropdown. Golf gear gets dragged through dew, airports, cart paths, 36-hole days, and the group photo after the round. That is the standard we buy against.</p>
          <Link className="text-link" href="/the-bag-test">SEE HOW WYX PICKS GEAR →</Link>
        </div>
        <div className="future-field-photo future-field-photo-detail">
          <Image src={golfPhotography.cart} alt="Golf cart and golf bag beside the course" fill sizes="(max-width: 900px) 100vw, 34vw" />
        </div>
      </section>

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

      <section className="future-section future-situation-section">
        <div className="future-section-head">
          <div>
            <p className="eyebrow">SHOP THE SITUATION</p>
            <h2>START WITH WHAT YOU&apos;RE DOING NEXT.</h2>
          </div>
          <p>Build the bag, pack the trip, or find a golf gift that actually lands. The context matters more than the category name.</p>
        </div>
        <div className="future-mode-grid">
          {modes.map((mode) => (
            <Link href={mode.href} className="future-mode future-mode-photo" key={mode.title}>
              <Image src={mode.image} alt={mode.alt} fill sizes="(max-width: 900px) 100vw, 33vw" />
              <span className="future-mode-overlay" />
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
