import Image from 'next/image';
import Link from 'next/link';
import { ComingSoonCard } from '@/components/ComingSoonCard';
import { EditorialProductCard } from '@/components/EditorialProductCard';
import { EmailCapture } from '@/components/EmailCapture';
import { availableProducts } from '@/lib/catalog';
import { imageMap } from '@/lib/demo';
import { createProductAllocator, comingSoonCards } from '@/lib/homeMerchandising';
import { commerceKits } from '@/lib/kits';
import { coreMerchProducts, firstBuyProducts } from '@/lib/merchandisingFilters';
import { sortByQuality } from '@/lib/productQuality';
import { getProducts } from '@/lib/shopify/products';

export const revalidate = 300;

const categoryPills = [
  { label: 'Golf Gifts', href: '/golf-gifts', icon: 'GG' },
  { label: 'Trip Gear', href: '/golf-trip-gear', icon: 'TG' },
  { label: 'Dad Gifts', href: '/golf-gifts-for-dad', icon: 'DG' },
  { label: 'Scramble Prizes', href: '/scramble-prizes', icon: 'SP' },
  { label: 'Bag Upgrades', href: '/bag-upgrades', icon: 'BU' }
];

export default async function Home() {
  const catalog = sortByQuality(coreMerchProducts(availableProducts(await getProducts())));
  const allocator = createProductAllocator();
  const shortList = allocator.take(firstBuyProducts(catalog), 3);
  const justAdded = allocator.take(catalog, 4);
  const comingSoon = comingSoonCards(3 - shortList.length, ['The Roo Valuables Pouch', 'Divot Tool + Marker Set', 'Wet/Dry Trip Towel']);
  const justAddedComingSoon = comingSoonCards(4 - justAdded.length, ['Golf Trip Tee Pack', 'Scramble Prize Pack', 'Magnetic Club Brush', 'Bag Tag Drop']);

  return (
    <>
      <section className="hero">
        <Image src={imageMap.hero} alt="Coastal fairway at golden hour" fill priority />
        <div className="hero-copy">
          <p className="eyebrow">WYX Golf Co.</p>
          <h1>Golf Gear For The Boys, The Trip, And The Bag.</h1>
          <p>Useful golf gifts, trip kits, and bag upgrades for weekend players.</p>
          <div className="hero-proof">
            <span>Gifts under $60</span>
            <span>Shipping shown before payment</span>
            <span>Support by email</span>
            <span>WYX10 saves 10%</span>
          </div>
          <div className="actions">
            <Link className="button primary" href="/golf-gifts">Shop Golf Gifts</Link>
            <Link className="button secondary" href="/golf-trip-gear">Build A Trip Kit</Link>
          </div>
        </div>
      </section>

      <section className="section short-list-section">
        <div className="section-heading split">
          <div>
            <p className="eyebrow">The Short List</p>
            <h2>Three Picks Worth Putting In The Bag.</h2>
          </div>
          <Link className="text-link" href="/short-list">See The Full Short List</Link>
        </div>
        <div className="editorial-product-grid">
          {shortList.map((product, index) => <EditorialProductCard key={product.id} product={product} featured={index === 0} />)}
          {comingSoon.map((card) => <ComingSoonCard key={card.title} title={card.title} body={card.body} />)}
        </div>
      </section>

      <section className="category-strip-section" aria-label="Browse by category">
        <div className="category-strip">
          {categoryPills.map((category) => (
            <Link key={category.label} href={category.href}>
              <span aria-hidden="true">{category.icon}</span>
              <strong>{category.label}</strong>
            </Link>
          ))}
        </div>
      </section>

      <section id="kits" className="section">
        <div className="section-heading split">
          <div>
            <p className="eyebrow">Trip Kit Builder</p>
            <h2>The Golf Trip Survival Kit.</h2>
          </div>
          <Link className="text-link" href="/golf-trip-gear">Build A Trip Kit</Link>
        </div>
        <div className="kit-grid">
          {commerceKits.slice(0, 3).map((kit) => (
            <article className="kit-card kit-card-simple" key={kit.title}>
              <p className="eyebrow">{kit.eyebrow}</p>
              <h3>{kit.title}</h3>
              <p>{kit.description}</p>
              <p className="product-meta">{kit.complete ? 'Complete kit' : 'Coming soon / build from available picks'}</p>
              <Link className="text-link" href="/golf-trip-gear">View Kit</Link>
            </article>
          ))}
        </div>
        <div className="section-link-row"><Link className="button secondary dark" href="/golf-trip-gear">See All Kits</Link></div>
      </section>

      <section className="section">
        <div className="section-heading split">
          <div>
            <p className="eyebrow">Just Added</p>
            <h2>Fresh Finds, No Repeats.</h2>
          </div>
          <Link className="text-link" href="/products">Shop All</Link>
        </div>
        <div className="product-grid">
          {justAdded.map((product) => <EditorialProductCard key={product.id} product={product} />)}
          {justAddedComingSoon.map((card) => <ComingSoonCard key={card.title} title={card.title} body={card.body} />)}
        </div>
      </section>

      <section className="section why-wyx">
        <div>
          <p className="eyebrow">Why WYX</p>
          <h2>Golf Goods With A Little More Point Of View.</h2>
        </div>
        <div>
          <p>WYX Golf Co. is built for players who care about the ritual as much as the score. The early tee time. The clean towel. The worn-in hat. The small pieces of gear that make the round feel like yours.</p>
          <p>We keep the shop focused on useful gifts, trip gear, and bag upgrades with personality, because golf gear should be easy to buy and even easier to actually use.</p>
        </div>
      </section>

      <EmailCapture source="home" campaign="home_launch_list" title="Get The Next Drop Before Your Foursome Does." body="Join the WYX list for golf trip gear, useful gifts, new drops, and launch discounts." />

      <section className="section">
        <p className="eyebrow">Field Notes</p>
        <h2>Practice, Care, And Course Strategy.</h2>
        <div className="journal-grid">
          <Article href="/journal/ball-first-contact" img={imageMap.iron} title="3 Drills to Improve Ball-First Contact" />
          <Article href="/journal/keep-your-gear-ready" img={imageMap.care} title="How to Keep Your Gear Ready Every Week" />
          <Article href="/journal/pressure-holes" img={imageMap.strategy} title="A Calm Framework for Pressure Holes" />
        </div>
      </section>
    </>
  );
}

function Article({ href, img, title }: { href: string; img: string; title: string }) {
  return <article className="journal-card"><Image src={img} alt={title} width={900} height={675} /><div><h3>{title}</h3><Link className="text-link" href={href}>Read Field Note</Link></div></article>;
}
