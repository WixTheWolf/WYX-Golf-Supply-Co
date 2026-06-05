import Image from 'next/image';
import Link from 'next/link';
import { EditorialProductCard } from '@/components/EditorialProductCard';
import { EmailCapture } from '@/components/EmailCapture';
import { availableProducts } from '@/lib/catalog';
import { imageMap } from '@/lib/demo';
import { createProductAllocator } from '@/lib/homeMerchandising';
import { commerceKits } from '@/lib/kits';
import { coreMerchProducts, firstBuyProducts } from '@/lib/merchandisingFilters';
import { sortByQuality } from '@/lib/productQuality';
import { getProducts } from '@/lib/shopify/products';

export const revalidate = 300;

const categoryPills = [
  { label: 'Golf Gifts', href: '/golf-gifts', icon: 'Gift' },
  { label: 'Trip Gear', href: '/golf-trip-gear', icon: 'Trip' },
  { label: 'Dad Gifts', href: '/golf-gifts-for-dad', icon: 'Dad' },
  { label: 'Scramble Prizes', href: '/scramble-prizes', icon: 'Win' },
  { label: 'Bag Upgrades', href: '/bag-upgrades', icon: 'Bag' }
];

export default async function Home() {
  const catalog = sortByQuality(coreMerchProducts(availableProducts(await getProducts())));
  const allocator = createProductAllocator();
  const shortList = allocator.take(firstBuyProducts(catalog), 3);
  const justAdded = allocator.take(catalog, 4);

  return (
    <>
      <section className="hero">
        <Image src={imageMap.hero} alt="Coastal fairway at golden hour" fill priority />
        <div className="hero-copy">
          <p className="eyebrow">WYX Golf Co.</p>
          <h1>Useful Golf Gear For The Bag, Trip, And Gift Table.</h1>
          <p>Curated golf towels, gloves, balls, markers, and bag upgrades a weekend golfer can actually use today.</p>
          <div className="hero-proof">
            <span>Buyable picks only</span>
            <span>Giftable under $60</span>
            <span>Shipping shown before payment</span>
            <span>WYX10 saves 10%</span>
          </div>
          <div className="actions">
            <Link className="button primary" href="/products">Shop Buy-Ready Gear</Link>
            <Link className="button secondary" href="/golf-gifts">Find A Golf Gift</Link>
          </div>
        </div>
      </section>

      {shortList.length > 0 && <section className="section short-list-section">
        <div className="section-heading split">
          <div>
            <p className="eyebrow">The Short List</p>
            <h2>Three Picks A Golfer Would Actually Put In The Bag.</h2>
          </div>
          <Link className="text-link" href="/short-list">See The Full Short List</Link>
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

      <section id="kits" className="section">
        <div className="section-heading split">
          <div>
            <p className="eyebrow">Trip Kit Builder</p>
            <h2>Build A Small Kit That Solves Real Round Problems.</h2>
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
                <p className="product-meta">{isBuildableKit ? 'Buildable from current picks' : 'Use current WYX picks'}</p>
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
            <p className="eyebrow">Buy-Ready Picks</p>
            <h2>Fresh Finds With A Clear Reason To Buy.</h2>
          </div>
          <Link className="text-link" href="/products">Shop All</Link>
        </div>
        <div className="product-grid">
          {justAdded.map((product) => <EditorialProductCard key={product.id} product={product} />)}
        </div>
      </section>}

      <section className="section why-wyx">
        <div>
          <p className="eyebrow">Why WYX</p>
          <h2>Fewer Products. Better Reasons To Buy.</h2>
        </div>
        <div>
          <p>WYX Golf Co. is built around useful golf goods that make sense for real rounds: clean towels, fresh gloves, ball restocks, markers, trip gear, and bag upgrades.</p>
          <p>If a product does not have inventory, real product media, a fair price, and a clear use case for a weekend golfer, it should not lead the storefront.</p>
        </div>
      </section>

      <EmailCapture source="home" campaign="home_launch_list" title="Get The Next Buy-Ready Drop." body="Join the WYX list for useful golf gifts, trip gear, bag upgrades, and launch discounts." />
    </>
  );
}
