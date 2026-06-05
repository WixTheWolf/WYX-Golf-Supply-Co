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
  { label: 'Hats', href: '/products?category=Headwear', icon: '01' },
  { label: 'Apparel', href: '/products?category=Apparel', icon: '02' },
  { label: 'Golf Gifts', href: '/golf-gifts', icon: '03' },
  { label: 'Trip Gear', href: '/golf-trip-gear', icon: '04' },
  { label: 'Bag Upgrades', href: '/bag-upgrades', icon: '05' }
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
          <h1>Premium Golf Goods With Weekend Energy.</h1>
          <p>Hats, apparel, balls, gloves, towels, markers, and bag gear selected to feel good in the cart and better on the course.</p>
          <div className="hero-proof">
            <span>Curated suppliers</span>
            <span>Course-ready style</span>
            <span>Real product media</span>
            <span>WYX10 saves 10%</span>
          </div>
          <div className="actions">
            <Link className="button primary" href="/products">Shop WYX Select</Link>
            <Link className="button secondary" href="/products?category=Apparel">Shop Apparel</Link>
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
    </>
  );
}
