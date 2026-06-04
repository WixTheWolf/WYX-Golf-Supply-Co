import Image from 'next/image';
import Link from 'next/link';
import curatedPicks from '@/data/curated-picks.json';
import { ComingSoonCard } from '@/components/ComingSoonCard';
import { CuratedPickCard } from '@/components/CuratedPickCard';
import { EditorialProductCard } from '@/components/EditorialProductCard';
import { EmailCapture } from '@/components/EmailCapture';
import { KitAddButton } from '@/components/KitAddButton';
import { availableProducts, catalogCategories, categoryCount, categoryFor } from '@/lib/catalog';
import { imageMap } from '@/lib/demo';
import { createProductAllocator, comingSoonCards } from '@/lib/homeMerchandising';
import { commerceKits, kitCategorySummary, kitLines, kitProducts } from '@/lib/kits';
import { coreMerchProducts, firstBuyProducts } from '@/lib/merchandisingFilters';
import { sortByQuality } from '@/lib/productQuality';
import { getProducts } from '@/lib/shopify/products';
import type { CuratedPick } from '@/types/curated';

export const revalidate = 300;

export default async function Home() {
  const catalog = sortByQuality(coreMerchProducts(availableProducts(await getProducts())));
  const allocator = createProductAllocator();
  const shortList = allocator.take(firstBuyProducts(catalog), 3);
  const tripKitProducts = kitProducts(catalog, commerceKits[0]?.handles || []);
  allocator.mark(tripKitProducts);
  const justAdded = allocator.take(catalog, 4);
  const categories = catalogCategories.slice(1).filter((category) => categoryCount(catalog, category) > 0);
  const comingSoon = comingSoonCards(3 - shortList.length, ['The Roo Valuables Pouch', 'Divot Tool + Marker Set', 'Wet/Dry Trip Towel']);
  const justAddedComingSoon = comingSoonCards(4 - justAdded.length, ['Golf Trip Tee Pack', 'Scramble Prize Pack', 'Magnetic Club Brush', 'Bag Tag Drop']);
  const externalPicks = curatedPicks as CuratedPick[];

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
          {categories.slice(0, 8).map((category) => (
            <Link key={category} href={`/products?category=${encodeURIComponent(category)}`}>
              <span aria-hidden="true">{categoryIcon(category)}</span>
              <strong>{category}</strong>
              <small>{categoryCount(catalog, category)} picks</small>
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
          {commerceKits.slice(0, 3).map((kit) => {
            const products = kitProducts(catalog, kit.handles);
            const lines = kitLines(products);
            return (
              <article className="kit-card" key={kit.title}>
                <p className="eyebrow">{kit.eyebrow}</p>
                <h3>{kit.title}</h3>
                <p>{kit.description}</p>
                <p className="product-meta">{kit.complete ? 'Complete kit' : 'Build this kit'} / {kitCategorySummary(products)}</p>
                <ul>{products.map((product) => <li key={product.id}>{product.title}</li>)}</ul>
                <KitAddButton lines={lines} kitName={kit.title} label={kit.complete ? 'Add Full Kit' : 'Build This Kit'} />
              </article>
            );
          })}
        </div>
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

      <section className="section">
        <div className="section-heading split">
          <div>
            <p className="eyebrow">Curated Picks</p>
            <h2>Outside Finds We Are Watching.</h2>
          </div>
          <Link className="text-link" href="/short-list">Open The Short List</Link>
        </div>
        <div className="product-grid">
          {externalPicks.slice(0, 4).map((pick) => <CuratedPickCard key={pick.url} pick={pick} />)}
        </div>
      </section>

      <section className="section">
        <p className="eyebrow">Field Notes</p>
        <h2>Practice, Care, And Course Strategy.</h2>
        <div className="journal-grid">
          <Article href="/journal/ball-first-contact" img={imageMap.iron} title="3 Drills to Improve Ball-First Contact" />
          <Article href="/journal/keep-your-gear-ready" img={imageMap.care} title="How to Keep Your Gear Ready Every Week" />
          <Article href="/journal/pressure-holes" img={imageMap.strategy} title="A Calm Framework for Pressure Holes" />
        </div>
      </section>

      <EmailCapture source="home" campaign="home_launch_list" title="Get The Next Drop Before Your Foursome Does." body="Join the WYX list for golf trip gear, useful gifts, new drops, and launch discounts." />
    </>
  );
}

function Article({ href, img, title }: { href: string; img: string; title: string }) {
  return <article className="journal-card"><Image src={img} alt={title} width={900} height={675} /><div><h3>{title}</h3><Link className="text-link" href={href}>Read Field Note</Link></div></article>;
}

function categoryIcon(category: string) {
  if (category === 'Golf Balls') return 'GB';
  if (category === 'Gloves') return 'GL';
  if (category === 'Grips') return 'GR';
  if (category === 'Towels') return 'TW';
  if (category === 'Club Care') return 'CC';
  if (category === 'Accessories') return 'AX';
  return categoryFor({ title: category, productType: category, vendor: '', tags: [] }).slice(0, 2).toUpperCase();
}
