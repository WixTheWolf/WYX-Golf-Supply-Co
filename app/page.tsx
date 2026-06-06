import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { EditorialProductCard } from '@/components/EditorialProductCard';
import { EmailCapture } from '@/components/EmailCapture';
import { availableProducts } from '@/lib/catalog';
import { imageMap } from '@/lib/demo';
import { productPrice } from '@/lib/feed';
import { createProductAllocator } from '@/lib/homeMerchandising';
import { coreMerchProducts, firstBuyProducts, giftableProducts } from '@/lib/merchandisingFilters';
import { sortByQuality } from '@/lib/productQuality';
import { getProducts } from '@/lib/shopify/products';

export const revalidate = 300;

export const metadata: Metadata = {
  title: 'Golf Gifts, Trip Kits, Hats, Apparel & Bag Upgrades',
  description: 'Shop WYX Golf Supply Co. for golf gifts, trip gear, hats, apparel, balls, markers, and bag upgrades for weekend golfers.',
  alternates: { canonical: '/' }
};

const occasions = [
  { label: 'Golf Gifts', href: '/golf-gifts', image: imageMap.leather, copy: 'Easy wins for golfers who are hard to shop for.', cta: 'Shop Gifts' },
  { label: 'Hats', href: '/products?category=Headwear', image: imageMap.ropeHat, copy: 'Course-ready style that works after the round too.', cta: 'Shop Hats' },
  { label: 'Apparel', href: '/products?category=Apparel', image: imageMap.polo, copy: 'Wearable golf pieces for weekends, trips, and clubhouse stops.', cta: 'Shop Apparel' },
  { label: 'Trip Gear', href: '/golf-trip-gear', image: imageMap.walk, copy: 'Packable gear for buddy trips, bachelor weekends, and travel bags.', cta: 'Shop Trip Gear' },
  { label: 'Dad Gifts', href: '/golf-gifts-for-dad', image: imageMap.care, copy: 'Useful golf gifts he will actually keep in the bag.', cta: 'Shop Dad Gifts' },
  { label: 'Scramble Prizes', href: '/scramble-prizes', image: imageMap.iron, copy: 'Small prizes that beat another sleeve of forgettable logo balls.', cta: 'Shop Prizes' }
];

export default async function Home() {
  const catalog = sortByQuality(coreMerchProducts(availableProducts(await getProducts())));
  const allocator = createProductAllocator();
  const shortList = allocator.take(firstBuyProducts(catalog), 6);
  const under60 = giftableProducts(catalog, 8)
    .filter((product) => Number(productPrice(product).amount) < 60)
    .slice(0, 4);

  return (
    <>
      <section className="hero launch-hero">
        <Image src={imageMap.hero} alt="Golf friends walking a course at golden hour" fill priority />
        <div className="hero-copy launch-hero-copy">
          <p className="eyebrow">WYX Golf Supply Co.</p>
          <h1>Golf Gear For The Boys, The Trip, And The Bag.</h1>
          <p>Hats, apparel, golf gifts, balls, markers, and bag upgrades for weekend rounds, golf trips, dad gifts, and scramble crews.</p>
          <div className="actions">
            <Link className="button primary" href="#short-list">Shop The Short List</Link>
            <Link className="button secondary" href="/golf-gifts">Find A Golf Gift</Link>
          </div>
          <div className="hero-proof compact-proof">
            <span>Gifts under $60</span>
            <span>WYX10 saves 10%</span>
            <span>Shipping shown before payment</span>
            <span>Support by email</span>
          </div>
        </div>
      </section>

      {shortList.length > 0 && <section id="short-list" className="section short-list-section">
        <div className="section-heading split">
          <div>
            <p className="eyebrow">Shop The Short List</p>
            <h2>Start Here.</h2>
            <p>The easiest WYX picks to wear, gift, pack, or drop in the bag before the next round.</p>
          </div>
          <Link className="text-link" href="/products">Shop All</Link>
        </div>
        <div className="editorial-product-grid">
          {shortList.map((product, index) => <EditorialProductCard key={product.id} product={product} featured={index === 0} />)}
        </div>
      </section>}

      <section className="section occasion-section">
        <div className="section-heading">
          <p className="eyebrow">Shop By Occasion</p>
          <h2>Find The Right Golf Gift Faster.</h2>
        </div>
        <div className="occasion-grid">
          {occasions.map((occasion) => (
            <Link className="occasion-card" key={occasion.label} href={occasion.href}>
              <Image src={occasion.image} alt={`${occasion.label} golf gear`} width={900} height={675} loading="lazy" />
              <span>
                <strong>{occasion.label}</strong>
                <small>{occasion.copy}</small>
                <em>{occasion.cta}</em>
              </span>
            </Link>
          ))}
        </div>
      </section>

      {under60.length > 0 && <section className="section">
        <div className="section-heading split">
          <div>
            <p className="eyebrow">Best Gifts Under $60</p>
            <h2>Golf Gifts That Won't End Up In A Drawer.</h2>
            <p>Useful gear for players who already have enough polos, mugs, and bad swing advice.</p>
          </div>
          <Link className="text-link" href="/golf-gifts-under-60">Shop Gifts Under $60</Link>
        </div>
        <div className="product-grid">
          {under60.map((product) => <EditorialProductCard key={product.id} product={product} />)}
        </div>
      </section>}

      <section id="kits" className="section trip-kit-panel">
        <div>
          <p className="eyebrow">Trip Kit Builder</p>
          <h2>Build The Golf Trip Kit.</h2>
          <p>Everything you forgot to pack before pretending you're a tour pro for three days.</p>
        </div>
        <Link className="button secondary dark" href="/golf-trip-gear">Build A Trip Kit</Link>
      </section>

      <section className="section why-wyx">
        <div>
          <p className="eyebrow">Why WYX?</p>
          <h2>Golf Gear That Fits Real Rounds.</h2>
        </div>
        <p>We focus on golf gear that actually fits real rounds: wearable pieces, easy gifts, trip gear, prize-table picks, and small bag upgrades that make sense in the cart.</p>
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
