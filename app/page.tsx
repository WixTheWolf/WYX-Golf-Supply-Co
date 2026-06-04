import Image from 'next/image';
import Link from 'next/link';
import { EmailCapture } from '@/components/EmailCapture';
import { ProductCard } from '@/components/ProductCard';
import { KitAddButton } from '@/components/KitAddButton';
import { availableProducts, catalogCategories, categoryCount } from '@/lib/catalog';
import { imageMap } from '@/lib/demo';
import { landingCollections } from '@/lib/collections';
import { commerceKits, kitCategorySummary, kitLines, kitProducts } from '@/lib/kits';
import { sortByQuality } from '@/lib/productQuality';
import { getProducts } from '@/lib/shopify/products';

export const revalidate = 300;

export default async function Home() {
  const catalog = sortByQuality(availableProducts(await getProducts()));
  const featured = catalog.slice(0, 6);
  const categories = catalogCategories.slice(1).filter((category) => categoryCount(catalog, category) > 0);

  return (
    <>
      <section className="hero">
        <Image src={imageMap.hero} alt="Coastal fairway at golden hour" fill priority />
        <div className="hero-copy">
          <p className="eyebrow">WYX Golf Supply Co.</p>
          <h1>Find Your Edge.</h1>
          <p>Useful golf gear from independent makers, selected for the range, the first tee, and the rounds that keep calling you back.</p>
          <div className="actions">
            <Link className="button primary" href="/first-sale">Shop Launch Picks</Link>
            <Link className="button secondary" href="/story">The WYX Approach</Link>
          </div>
        </div>
      </section>

      <section className="trust-strip" aria-label="Store benefits">
        <span>Independent Golf Brands</span>
        <span>Use WYX10 For 10% Off</span>
        <span>Secure Shopify Checkout</span>
        <span>Supplier-Backed Fulfillment</span>
      </section>

      <section className="launch-offer">
        <div>
          <p className="eyebrow">Launch Offer</p>
          <h2>Take 10% Off The First Bag Build.</h2>
        </div>
        <p>Use code <strong>WYX10</strong> at checkout on golf balls, gloves, grips, towels, and approved supply-room finds. Father's Day is June 21, so the gift window is open now.</p>
        <Link className="button primary" href="/fathers-day-golf-gifts">Shop Dad Gifts</Link>
      </section>

      <section className="section">
        <div className="section-heading split">
          <div>
            <p className="eyebrow">Built To Convert</p>
            <h2>One-Click Golf Kits.</h2>
          </div>
          <Link className="text-link" href="/products">Build Your Own</Link>
        </div>
        <div className="kit-grid">
          {commerceKits.map((kit) => {
            const products = kitProducts(catalog, kit.handles);
            const lines = kitLines(products);
            return (
              <article className="kit-card" key={kit.title}>
                <p className="eyebrow">{kit.eyebrow}</p>
                <h3>{kit.title}</h3>
                <p>{kit.description}</p>
                <p className="product-meta">{kitCategorySummary(products)}</p>
                <ul>{products.map((product) => <li key={product.id}>{product.title}</li>)}</ul>
                <KitAddButton lines={lines} />
              </article>
            );
          })}
        </div>
      </section>

      <section className="section">
        <div className="section-heading split">
          <div>
            <p className="eyebrow">Fresh From The Supply Room</p>
            <h2>Gear Worth Putting In The Bag.</h2>
          </div>
          <Link className="text-link" href="/products">Shop All Products</Link>
        </div>
        {featured.length ? <div className="product-grid">{featured.map((product) => <ProductCard key={product.id} product={product} />)}</div> : <p>New products are being prepared in Shopify.</p>}
      </section>

      <section className="dark-section">
        <div>
          <p className="eyebrow">Built For Discovery</p>
          <h2>Small Brands. Smart Finds. Better Rounds.</h2>
        </div>
        <p>WYX brings together practical golf gear and personality-driven course essentials from supplier partners. Inventory stays synced through Shopify, so the catalog can keep moving as new finds land.</p>
      </section>

      <EmailCapture source="home" campaign="home_launch_list" />

      <section className="section">
        <p className="eyebrow">Shop The Bag</p>
        <h2>Browse By Category.</h2>
        <div className="category-grid">
          {categories.map((category) => (
            <Link key={category} href={`/products?category=${encodeURIComponent(category)}`}>
              <span>{String(categoryCount(catalog, category)).padStart(2, '0')}</span>
              <strong>{category}</strong>
              <small>Explore collection</small>
            </Link>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="section-heading split">
          <div>
            <p className="eyebrow">SEO-Ready Collections</p>
            <h2>Shop By Intent.</h2>
          </div>
          <Link className="text-link" href="/golf-gifts-under-60">Golf Gifts Under $60</Link>
        </div>
        <div className="intent-grid">
          <Link href="/golf-gifts-under-60">
            <span>High-Intent Search</span>
            <strong>Golf Gifts Under $60</strong>
            <small>Useful towels, tees, gloves, tools, and accessories for gift shoppers.</small>
          </Link>
          <Link href="/fathers-day-golf-gifts">
            <span>Seasonal Push</span>
            <strong>Father's Day Golf Gifts</strong>
            <small>Dad-ready towels, markers, gloves, balls, grips, headcovers, and bag upgrades.</small>
          </Link>
          <Link href="/best-golf-accessories">
            <span>Buyer Intent</span>
            <strong>Best Golf Accessories</strong>
            <small>Practical bag upgrades selected for fast add-to-cart decisions.</small>
          </Link>
          <Link href="/popular-golf-products-2026">
            <span>2026 Demand</span>
            <strong>Popular Golf Products</strong>
            <small>Fresh gifts, useful accessories, and supplier-backed products worth scouting now.</small>
          </Link>
          <Link href="/premium-golf-bags">
            <span>Premium Upgrade</span>
            <strong>Premium Golf Bags</strong>
            <small>Real supplier-backed cart bags for golfers ready to upgrade the whole setup.</small>
          </Link>
          {landingCollections.map((collection) => (
            <Link href={`/collections/${collection.slug}`} key={collection.slug}>
              <span>{collection.eyebrow}</span>
              <strong>{collection.seoTitle}</strong>
              <small>{collection.description}</small>
            </Link>
          ))}
        </div>
      </section>

      <section className="story-panel">
        <Image src={imageMap.walk} alt="Golfer walking a coastal fairway in soft light" width={1200} height={900} />
        <div>
          <p className="eyebrow">The Long Game</p>
          <h2>A Supply Shop For Golfers Who Keep Looking.</h2>
          <p>Golf rewards curiosity. WYX is built around that same instinct: find the useful thing, bring a little character to the bag, and head back out.</p>
          <Link className="button primary" href="/story">Read Our Story</Link>
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
    </>
  );
}

function Article({ href, img, title }: { href: string; img: string; title: string }) {
  return <article className="journal-card"><Image src={img} alt={title} width={900} height={675} /><div><h3>{title}</h3><Link className="text-link" href={href}>Read Field Note</Link></div></article>;
}
