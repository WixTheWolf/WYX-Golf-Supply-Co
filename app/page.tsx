import Image from 'next/image';
import Link from 'next/link';
import { EmailCapture } from '@/components/EmailCapture';
import { ProductCard } from '@/components/ProductCard';
import { KitAddButton } from '@/components/KitAddButton';
import { availableProducts, catalogCategories, categoryCount } from '@/lib/catalog';
import { imageMap } from '@/lib/demo';
import { landingCollections } from '@/lib/collections';
import { commerceKits, kitCategorySummary, kitLines, kitProducts } from '@/lib/kits';
import { bagUpgradeProducts, coreMerchProducts, firstBuyProducts, giftableProducts, tripProducts } from '@/lib/merchandisingFilters';
import { sortByQuality } from '@/lib/productQuality';
import { getProducts } from '@/lib/shopify/products';

export const revalidate = 300;

export default async function Home() {
  const catalog = sortByQuality(coreMerchProducts(availableProducts(await getProducts())));
  const firstBuys = firstBuyProducts(catalog).slice(0, 6);
  const tripGear = tripProducts(catalog, 6);
  const underSixty = giftableProducts(catalog, 6);
  const bagEssentials = bagUpgradeProducts(catalog, 6);
  const categories = catalogCategories.slice(1).filter((category) => categoryCount(catalog, category) > 0);

  return (
    <>
      <section className="hero">
        <Image src={imageMap.hero} alt="Coastal fairway at golden hour" fill priority />
        <div className="hero-copy">
          <p className="eyebrow">WYX Golf Supply Co.</p>
          <h1>Golf Gifts, Trip Gear, And Bag Upgrades For Weekend Players.</h1>
          <p>Useful, gift-ready golf gear for dads, buddies, bachelor parties, scramble teams, and players who want their bag more dialed before the next round.</p>
          <div className="actions">
            <Link className="button primary" href="/golf-gifts">Shop Golf Gifts</Link>
            <Link className="button secondary" href="/golf-trip-gear">Build A Trip Kit</Link>
          </div>
        </div>
      </section>

      <section className="trust-strip" aria-label="Store benefits">
        <span>WYX10 Saves 10%</span>
        <span>Gifts Under $60</span>
        <span>Shipping Shown Before Payment</span>
        <span>Support By Email</span>
      </section>

      <section className="launch-offer">
        <div>
          <p className="eyebrow">Launch Offer</p>
          <h2>Useful Gear For The Round, The Trip, And The Guys Who Make Both Memorable.</h2>
        </div>
        <p>Use code <strong>WYX10</strong> at checkout. Start with towels, markers, balls, caddies, gloves, and small upgrades golfers actually bring to the course.</p>
        <Link className="button primary" href="/golf-gifts-for-dad">Shop Dad Gifts</Link>
      </section>

      <section className="section">
        <div className="section-heading split">
          <div>
            <p className="eyebrow">Best First Buys</p>
            <h2>The Safest First Cart.</h2>
          </div>
          <Link className="text-link" href="/first-sale">Use WYX10</Link>
        </div>
        {firstBuys.length ? <div className="product-grid">{firstBuys.map((product) => <ProductCard key={product.id} product={product} />)}</div> : <p>First-buy picks are being prepared.</p>}
      </section>

      <section id="kits" className="section">
        <div className="section-heading split">
          <div>
            <p className="eyebrow">Better Bag Kits</p>
            <h2>Golf Trip Kits.</h2>
          </div>
          <Link className="text-link" href="/golf-trip-gear">Build A Trip Kit</Link>
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
            <p className="eyebrow">Gear Worth Keeping In The Bag.</p>
            <h2>Gifts Under $60.</h2>
          </div>
          <Link className="text-link" href="/golf-gifts-under-60">Shop Under $60</Link>
        </div>
        {underSixty.length ? <div className="product-grid">{underSixty.map((product) => <ProductCard key={product.id} product={product} />)}</div> : <p>New gift picks are being prepared in Shopify.</p>}
      </section>

      <section className="section">
        <div className="section-heading split">
          <div>
            <p className="eyebrow">Golf Trip Gear</p>
            <h2>For The Guys Who Almost Remembered Everything.</h2>
          </div>
          <Link className="text-link" href="/golf-trip-gear">Shop Trip Gear</Link>
        </div>
        {tripGear.length ? <div className="product-grid">{tripGear.map((product) => <ProductCard key={product.id} product={product} />)}</div> : <p>Trip gear is being prepared.</p>}
      </section>

      <section className="section">
        <div className="section-heading split">
          <div>
            <p className="eyebrow">Bag Essentials</p>
            <h2>Small Bag Upgrades. Better Rounds.</h2>
          </div>
          <Link className="text-link" href="/bag-upgrades">Shop Bag Upgrades</Link>
        </div>
        {bagEssentials.length ? <div className="product-grid">{bagEssentials.map((product) => <ProductCard key={product.id} product={product} />)}</div> : <p>Bag upgrades are being prepared.</p>}
      </section>

      <section className="dark-section">
        <div>
          <p className="eyebrow">Why WYX</p>
          <h2>Small Upgrades. Better Rounds.</h2>
        </div>
        <p>WYX is built around golf gifts, trip gear, and small bag upgrades that make real rounds easier. No mystery gadgets. No overbuilt nonsense. Just useful things golfers can throw in the bag and use this weekend.</p>
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
            <p className="eyebrow">Shop The Round</p>
            <h2>Find The Right Bag Upgrade.</h2>
          </div>
          <Link className="text-link" href="/golf-gifts-under-60">Golf Gifts Under $60</Link>
        </div>
        <div className="intent-grid">
          <Link href="/golf-gifts-under-60">
            <span>Gift-Ready Picks</span>
            <strong>Golf Gifts Under $60</strong>
            <small>Useful towels, tees, gloves, tools, and accessories for gift shoppers.</small>
          </Link>
          <Link href="/fathers-day-golf-gifts">
            <span>Golf Dad Approved</span>
            <strong>Father's Day Golf Gifts</strong>
            <small>Dad-ready towels, markers, gloves, balls, grips, headcovers, and bag upgrades.</small>
          </Link>
          <Link href="/golf-trip-gear">
            <span>Trip Gear</span>
            <strong>Golf Trip Gear</strong>
            <small>Towels, markers, balls, caddies, and small upgrades for group weekends.</small>
          </Link>
          <Link href="/bag-upgrades">
            <span>Bag Upgrades</span>
            <strong>Small Bag Upgrades</strong>
            <small>Cleaner, easier, more ready before the next round.</small>
          </Link>
          <Link href="/the-roo">
            <span>Coming Soon</span>
            <strong>The Roo Valuables Pouch</strong>
            <small>A better home for the tiny stuff that disappears in every golf bag.</small>
          </Link>
          <Link href="/best-golf-accessories">
            <span>Bag Upgrades</span>
            <strong>Best Golf Accessories</strong>
            <small>Practical bag upgrades selected for fast add-to-cart decisions.</small>
          </Link>
          <Link href="/popular-golf-products-2026">
            <span>Popular Picks</span>
            <strong>Popular Golf Products</strong>
            <small>Fresh gifts, useful accessories, and practical products worth scouting now.</small>
          </Link>
          <Link href="/golf-gifts">
            <span>Gift Shoppers</span>
            <strong>Golf Gifts</strong>
            <small>Gift-ready picks for golf dads, weekend players, and last-minute buyers.</small>
          </Link>
          <Link href="/bag-essentials">
            <span>Weekend Essentials</span>
            <strong>Bag Essentials</strong>
            <small>Balls, gloves, towels, markers, grips, and useful add-ons.</small>
          </Link>
          <Link href="/clean-contact-kit">
            <span>Club Care</span>
            <strong>Clean Contact Kit</strong>
            <small>Towels and care tools for cleaner clubs and better range habits.</small>
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
