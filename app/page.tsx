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
  title: 'Curated Golf Gifts, Hats, Apparel & Bag Gear',
  description: 'Shop WYX Golf Supply Co. for curated golf gifts, hats, apparel, trip gear, towels, markers, gloves, balls, and bag upgrades for weekend golfers.',
  alternates: { canonical: '/' }
};

const categoryPills = [
  { label: 'Hats', href: '/products?category=Headwear', icon: '01' },
  { label: 'Apparel', href: '/products?category=Apparel', icon: '02' },
  { label: 'Golf Gifts', href: '/golf-gifts', icon: '03' },
  { label: 'Trip Gear', href: '/golf-trip-gear', icon: '04' },
  { label: 'Bag Upgrades', href: '/bag-upgrades', icon: '05' }
];

const buyerGuide = [
  {
    title: 'Best first cart',
    copy: 'Start with one wearable piece and one useful bag item: a hat, shirt, towel, marker, glove, or ball restock.',
    links: [['Shop Hats', '/products?category=Headwear'], ['Shop Gifts', '/golf-gifts']]
  },
  {
    title: 'Best golf gifts',
    copy: 'Choose products with low sizing risk, clear utility, and strong gift value under $60 whenever possible.',
    links: [['Under $60 Gifts', '/golf-gifts-under-60'], ['Dad Gifts', '/golf-gifts-for-dad']]
  },
  {
    title: 'Best trip gear',
    copy: 'For group golf weekends, prioritize packable accessories, towels, markers, balls, caddies, hats, and simple prizes.',
    links: [['Trip Gear', '/golf-trip-gear'], ['Scramble Prizes', '/scramble-prizes']]
  }
];

export default async function Home() {
  const catalog = sortByQuality(coreMerchProducts(availableProducts(await getProducts())));
  const allocator = createProductAllocator();
  const shortList = allocator.take(firstBuyProducts(catalog), 3);
  const justAdded = allocator.take(catalog, 4);
  const channelHighlights = channelPlan.slice(0, 3);

  return (
    <>
      <section className="hero">
        <Image src={imageMap.hero} alt="Coastal fairway at golden hour" fill priority />
        <div className="hero-copy">
          <p className="eyebrow">WYX Golf Supply Co.</p>
          <h1>Premium Golf Goods With Weekend Energy.</h1>
          <p>Hats, apparel, golf gifts, trip gear, and bag upgrades selected to feel good in the cart and better on the course.</p>
          <div className="hero-proof">
            <span>Curated suppliers</span>
            <span>Course-ready style</span>
            <span>Real product media</span>
            <span>WYX10 saves 10%</span>
          </div>
          <div className="actions">
            <Link className="button primary" href="/products">Shop WYX Select</Link>
            <Link className="button secondary" href="/golf-gifts">Find A Golf Gift</Link>
          </div>
        </div>
      </section>

      {shortList.length > 0 && <section className="section short-list-section">
        <div className="section-heading split">
          <div>
            <p className="eyebrow">WYX Select</p>
            <h2>Start With The Pieces That Make The Whole Shop Feel Better.</h2>
          </div>
          <Link className="text-link" href="/products">Shop All</Link>
        </div>
        <div className="editorial-product-grid">
          {shortList.map((product, index) => <EditorialProductCard key={product.id} product={product} featured={index === 0} />)}
        </div>
      </section>}

      <section className="category-strip-section" aria-label="Browse by buying intent">
        <div className="category-strip">
          {categoryPills.map((category) => (
            <Link key={category.label} href={category.href}>
              <span aria-hidden="true">{category.icon}</span>
              <strong>{category.label}</strong>
            </Link>
          ))}
        </div>
      </section>

      <section className="section seo-guide">
        <div>
          <p className="eyebrow">Buyer's Guide</p>
          <h2>What Should A Golfer Buy From WYX First?</h2>
          <p>WYX is built around high-confidence golf purchases: things golfers can wear, gift, pack for a trip, or drop in the bag without needing club specs or a fitting session.</p>
        </div>
        <div className="seo-guide-grid">
          {buyerGuide.map((item) => <article className="seo-guide-card" key={item.title}>
            <h3>{item.title}</h3>
            <p>{item.copy}</p>
            <ul>{item.links.map(([label, href]) => <li key={href}><Link className="text-link" href={href}>{label}</Link></li>)}</ul>
          </article>)}
        </div>
      </section>

      <section className="section channel-home-section">
        <div className="section-heading split">
          <div>
            <p className="eyebrow">More Ways To Buy</p>
            <h2>Meet Customers Where They Already Are.</h2>
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

      <section id="kits" className="section">
        <div className="section-heading split">
          <div>
            <p className="eyebrow">Trip Kit Builder</p>
            <h2>Build A Kit That Looks Intentional, Not Random.</h2>
          </div>
          <Link className="text-link" href="/golf-trip-gear">Build A Trip Kit</Link>
        </div>
        <div className="kit-grid">
          {commerceKits.slice(0, 3).map((kit, index) => {
            const isBuildableKit = index < 2;
            return (
              <article className="kit-card kit-card-simple" key={kit.title}>
                <p className="eyebrow">{kit.eyebrow}</p>
                <h3>{kit.title}</h3>
                <p>{kit.description}</p>
                <p className="product-meta">{isBuildableKit ? 'Buildable from WYX Select' : 'Use current WYX picks'}</p>
                <Link className="text-link" href="/golf-trip-gear">View Kit</Link>
              </article>
            );
          })}
        </div>
        <div className="section-link-row"><Link className="button secondary dark" href="/golf-trip-gear">See All Kits</Link></div>
      </section>

      {justAdded.length > 0 && <section className="section">
        <div className="section-heading split">
          <div>
            <p className="eyebrow">Cart Builders</p>
            <h2>Easy Adds That Still Feel Like The Same Shop.</h2>
          </div>
          <Link className="text-link" href="/products">Shop All</Link>
        </div>
        <div className="product-grid">
          {justAdded.map((product) => <EditorialProductCard key={product.id} product={product} />)}
        </div>
      </section>}

      <section className="section why-wyx">
        <div>
          <p className="eyebrow">Assortment Rule</p>
          <h2>No Swap Meet Energy.</h2>
        </div>
        <div>
          <p>WYX should feel like a tight golf shop: good hats, wearable apparel, useful accessories, sharp gifts, and bag gear that belongs together.</p>
          <p>Products need inventory, real media, a fair price, and a reason a golfer would add them today. If it feels random, cheap, or disconnected from the rest of the cart, it should not lead the storefront.</p>
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
