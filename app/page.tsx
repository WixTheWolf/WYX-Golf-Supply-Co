import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { EditorialProductCard } from '@/components/EditorialProductCard';
import { EmailCapture } from '@/components/EmailCapture';
import { availableProducts, categoryFor } from '@/lib/catalog';
import { imageMap } from '@/lib/demo';
import { productPrice } from '@/lib/feed';
import { createProductAllocator } from '@/lib/homeMerchandising';
import { coreMerchProducts, firstBuyProducts, giftableProducts, isHomepageProduct } from '@/lib/merchandisingFilters';
import { sortByQuality } from '@/lib/productQuality';
import { getProducts } from '@/lib/shopify/products';

export const revalidate = 300;

export const metadata: Metadata = {
  title: 'Golf Gifts He Will Actually Keep In The Bag | WYX Golf Supply Co.',
  description: "Practical golf gifts, trip kits, and bag upgrades for weekend golfers. Every product passes The Bag Test before it makes the catalog. Use WYX10 for 10% off your first order.",
  alternates: { canonical: '/' },
  openGraph: {
    title: 'Golf Gifts He Will Actually Keep In The Bag | WYX Golf Supply Co.',
    description: "Practical golf gear for weekend golfers, built around The Weekend Golfer's Bag Upgrade Kit. Use WYX10 for 10% off your first order.",
    url: 'https://wyxgolfsupply.com'
  }
};

const trustSignals = [
  'Practical gifts under $60',
  'Shipping shown before payment',
  'Support by email',
  'WYX10 saves 10%'
];

const mechanismSteps = [
  {
    title: '1. We Pull It Apart',
    body: 'Every product on WYX gets pulled apart and used the way a weekend golfer would actually use it — in a cart, in a pocket, in the rain.'
  },
  {
    title: '2. We Ask One Question',
    body: 'Would this earn a permanent spot in a real bag, or would it end up in a drawer after one round? If the answer is "drawer," it does not get listed.'
  },
  {
    title: '3. We Skip The Filler',
    body: 'No novelty gear, no branded tchotchkes, no "as seen on TV" gimmicks. If it does not solve a real problem on the course, it does not make the catalog.'
  },
  {
    title: '4. We Keep It Honest',
    body: 'Real prices, real photos, real stock. Use WYX10 for 10% off your first order, and every order ships through secure Shopify checkout.'
  }
];

const situations = [
  { title: 'Gifts Under $60', copy: 'Practical picks for any golfer on your list.', href: '/golf-gifts-under-60' },
  { title: 'Dad Gifts', copy: "Things he'll actually use, not display.", href: '/golf-gifts-for-dad' },
  { title: 'Golf Trip Gear', copy: 'Pack light. Forget nothing that matters.', href: '/golf-trip-gear' },
  { title: 'Bachelor Party Gifts', copy: 'Group gear and gag-free favors.', href: '/bachelor-party-golf-gifts' },
  { title: 'Scramble Prizes', copy: 'Prize-table picks people actually want.', href: '/scramble-prizes' },
  { title: 'Bag Upgrades', copy: 'Small swaps that fix real annoyances.', href: '/bag-upgrades' }
];

const bonusTools = [
  {
    title: "The Gift-Giver's Cheat Sheet",
    body: "A short guide to picking a golf gift when you don't golf — what matters, what doesn't, and what to skip entirely."
  },
  {
    title: 'The Bag Audit Checklist',
    body: 'A 2-minute checklist for what should be in a weekend bag right now, and what is probably expired, broken, or missing.'
  },
  {
    title: 'Optional Gift Reminder',
    body: "Add your details at checkout and we'll send a quiet reminder before the next gifting date — Father's Day, birthdays, holidays. Skip it if you don't need it."
  }
];

const proofStats = [
  { stat: 'WYX10', label: '10% off your first order' },
  { stat: '5', label: 'Items in The Bag Upgrade Kit' },
  { stat: '30 Days', label: 'The Bag Test Promise window' },
  { stat: '$60', label: 'Most gifts ship under this price' }
];

const kits = [
  { title: 'Trip Kit', href: '/kits/golf-trip-kit', image: imageMap.walk, copy: 'Packable gear for the golf trip.' },
  { title: 'Dad Kit', href: '/kits/dad-gift-kit', image: imageMap.care, copy: 'Useful gifts he will actually use.' },
  { title: 'Bag Kit', href: '/kits/bag-upgrade-kit', image: imageMap.leather, copy: 'Small upgrades. Better setup.' }
];

export default async function Home() {
  const catalog = sortByQuality(coreMerchProducts(availableProducts(await getProducts())));
  const allocator = createProductAllocator();
  const homepageCatalog = catalog
    .filter(isHomepageProduct)
    .filter((product) => Number(productPrice(product).amount) <= 250);

  function uniqueByHandle(products: typeof homepageCatalog) {
    const seen = new Set<string>();
    return products.filter((product) => {
      if (seen.has(product.handle)) return false;
      seen.add(product.handle);
      return true;
    });
  }

  const beltProduct = homepageCatalog.find((product) => /\bbelt\b/i.test(product.title));
  const lineMarkerProduct = homepageCatalog.find((product) => /(three[- ]rail|^3[- ]line|line marker|ball marker)/i.test(`${product.title} ${product.handle}`));

  const heroProducts = uniqueByHandle([
    ...firstBuyProducts(homepageCatalog),
    beltProduct,
    lineMarkerProduct,
    ...giftableProducts(homepageCatalog, 20)
  ].filter(Boolean) as typeof homepageCatalog);

  // Cap each category at 2 so the row reads "practical gifts", not a single-department store.
  function diversifyByCategory(products: typeof homepageCatalog, maxPerCategory: number) {
    const categoryCounts = new Map<string, number>();
    return products.filter((product) => {
      const category = categoryFor(product);
      const count = categoryCounts.get(category) || 0;
      if (count >= maxPerCategory) return false;
      categoryCounts.set(category, count + 1);
      return true;
    });
  }

  const shortList = allocator.take(diversifyByCategory(heroProducts, 2), 6);
  const shortListHandles = new Set(shortList.map((product) => product.handle));
  const under60 = giftableProducts(homepageCatalog, 12)
    .filter(isHomepageProduct)
    .filter((product) => Number(productPrice(product).amount) < 60)
    .filter((product) => !shortListHandles.has(product.handle))
    .slice(0, 4);

  return (
    <>
      <div className="urgency-strip" role="banner" aria-label="WYX is open">
        <strong>WYX is open.</strong> Shop the Bag Upgrade Kit or share <Link href="/open">our launch page</Link> with your foursome — <strong>WYX10</strong> saves 10%.
      </div>
      {(() => {
        const fathersDay = new Date('2026-06-21T00:00:00');
        const now = new Date();
        const daysLeft = Math.ceil((fathersDay.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        if (daysLeft <= 0 || daysLeft > 21) return null;
        return (
          <div className="urgency-strip" role="banner" aria-label="Father's Day shopping deadline">
            <strong>Father&apos;s Day is June 21</strong> — {daysLeft} day{daysLeft !== 1 ? 's' : ''} left. {daysLeft <= 5 ? <Link href="/last-minute-fathers-day-golf-gifts">Last minute picks →</Link> : <Link href="/fathers-day-golf-gifts">See golf gifts for dad →</Link>}
          </div>
        );
      })()}

      <section className="hero launch-hero">
        <Image src={imageMap.hero} alt="Golf friends walking a course at golden hour" fill priority sizes="100vw" />
        <div className="hero-copy launch-hero-copy">
          <p className="eyebrow">WYX Golf Supply Co.</p>
          <h1>Golf Gifts He&apos;ll Actually Keep In The Bag.</h1>
          <p>Practical golf gear for weekend players, dads, golf trips, bachelor parties, scrambles, and anyone tired of novelty gifts that end up in a drawer.</p>
          <div className="actions">
            <Link className="button primary" href="/weekend-golfer-bag-upgrade-kit">Shop The Bag Upgrade Kit</Link>
            <Link className="button secondary" href="/the-bag-test">Take The Bag Test</Link>
          </div>
          <div className="hero-proof compact-proof">
            {trustSignals.map((item) => <span key={item}>{item}</span>)}
          </div>
        </div>
      </section>

      {shortList.length > 0 && <section id="short-list" className="section short-list-section reveal">
        <div className="section-heading split">
          <div>
            <p className="eyebrow">Start Here</p>
            <h2>Best First-Cart Picks.</h2>
          </div>
          <Link className="text-link" href="/products">Shop All</Link>
        </div>
        <div className="editorial-product-grid">
          {shortList.map((product, index) => <EditorialProductCard key={product.id} product={product} featured={index === 0} />)}
        </div>
      </section>}

      <section className="section reveal" aria-labelledby="bag-test-heading">
        <div className="section-heading">
          <p className="eyebrow">The Mechanism</p>
          <h2 id="bag-test-heading">If It Doesn&apos;t Pass The Bag Test, It Doesn&apos;t Belong Here.</h2>
        </div>
        <div className="care-step-grid">
          {mechanismSteps.map((step) => (
            <div className="care-step" key={step.title}>
              <strong>{step.title}</strong>
              <p>{step.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="dark-section reveal" aria-labelledby="kit-offer-heading">
        <div>
          <p className="eyebrow">The Core Offer</p>
          <h2 id="kit-offer-heading">The Weekend Golfer&apos;s Bag Upgrade Kit.</h2>
          <div className="actions">
            <Link className="button primary" href="/weekend-golfer-bag-upgrade-kit">Get The Kit</Link>
            <Link className="button secondary dark" href="/bag-upgrades">Shop Bag Upgrades</Link>
          </div>
        </div>
        <p>Five practical pieces that fix the small annoyances every weekend bag has — a clean towel, a marker that does not get lost, an at-home grip refresh, a groove sharpener, and a place for the small stuff that always ends up loose in the bottom pocket. Built only from gear that is in stock right now. Use WYX10 for 10% off.</p>
      </section>

      <section className="dark-section reveal" aria-labelledby="not-a-golfer-heading">
        <div>
          <p className="eyebrow">For Gift Buyers</p>
          <h2 id="not-a-golfer-heading">Not A Golfer? Good. We Made This Easier.</h2>
          <div className="actions">
            <Link className="button primary" href="/golf-gifts">Shop Golf Gifts</Link>
            <Link className="button secondary dark" href="/golf-gifts-for-dad">Gifts For Dad</Link>
          </div>
        </div>
        <p>You don&apos;t need to know what a 56° wedge is. Every product on WYX is picked because it is useful to almost any golfer, regardless of skill level — and every gift ships with a clear reason why it belongs in the bag. If you&apos;re not sure, start with the Bag Upgrade Kit or anything under $60.</p>
      </section>

      <section className="section reveal" aria-label="Shop by situation">
        <div className="section-heading">
          <p className="eyebrow">Shop By Situation</p>
          <h2>Find The Right Gift Fast.</h2>
        </div>
        <div className="category-grid">
          {situations.map((item) => (
            <Link key={item.href} href={item.href}>
              <span>{item.copy}</span>
              <strong>{item.title}</strong>
              <small>Shop Now</small>
            </Link>
          ))}
        </div>
      </section>

      {under60.length > 0 && <section className="section reveal">
        <div className="section-heading split">
          <div>
            <p className="eyebrow">Under $60</p>
            <h2>Practical Golf Gifts Under $60.</h2>
          </div>
          <Link className="text-link" href="/golf-gifts-under-60">Shop Gifts Under $60</Link>
        </div>
        <div className="product-grid">
          {under60.map((product) => <EditorialProductCard key={product.id} product={product} />)}
        </div>
      </section>}

      <section id="kits" className="section kit-visual-section reveal">
        <div className="section-heading split">
          <div>
            <p className="eyebrow">More Kits</p>
            <h2>Other Ways To Bundle Up.</h2>
          </div>
          <Link className="text-link" href="/kits/golf-trip-kit">Build A Trip Kit</Link>
        </div>
        <div className="kit-visual-grid">
          {kits.map((kit) => (
            <Link className="kit-visual-card" key={kit.href} href={kit.href}>
              <Image src={kit.image} alt={`${kit.title} golf bundle`} width={900} height={675} loading="lazy" sizes="(max-width: 650px) 92vw, (max-width: 900px) 46vw, 31vw" />
              <span><strong>{kit.title}</strong><small>{kit.copy}</small><em>Build Kit</em></span>
            </Link>
          ))}
        </div>
      </section>

      <section className="section reveal" aria-labelledby="bonus-tools-heading">
        <div className="section-heading">
          <p className="eyebrow">Free With Every Order</p>
          <h2 id="bonus-tools-heading">A Few Free Tools That Make Gift-Giving Easier.</h2>
        </div>
        <div className="care-step-grid">
          {bonusTools.map((tool) => (
            <div className="care-step" key={tool.title}>
              <strong>{tool.title}</strong>
              <p>{tool.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section reveal" aria-label="How WYX builds trust">
        <div className="section-heading">
          <p className="eyebrow">No Fake Reviews</p>
          <h2>Built For First Orders, Not Fake Hype.</h2>
        </div>
        <div className="care-step-grid">
          <div className="care-step">
            <strong>Real Gear, Real Checkout</strong>
            <p>Every product ships from a verified supplier. No fake reviews, no inflated stock counts — just practical golf gear with secure Shopify checkout and WYX10 on your first order.</p>
          </div>
          <div className="care-step">
            <strong>The Bag Test Standard</strong>
            <p>Every product listed has been checked against one question: would a weekend golfer keep this in the bag after the first round? If we are not confident, it stays off the site.</p>
          </div>
          <div className="care-step">
            <strong>Secure, Familiar Checkout</strong>
            <p>Every order runs through Shopify&apos;s standard checkout — the same system used by thousands of stores. Your payment details never touch our servers.</p>
          </div>
          <div className="care-step">
            <strong>WYX10 For Your First Order</strong>
            <p>Use code WYX10 at checkout for 10% off. Shipping is shown before you pay, and there are no surprise charges between cart and confirmation.</p>
          </div>
        </div>
      </section>

      <section className="dark-section reveal" aria-labelledby="bag-test-promise-heading">
        <div>
          <p className="eyebrow">The Bag Test Promise</p>
          <h2 id="bag-test-promise-heading">If It&apos;s Wrong, We&apos;ll Make It Right.</h2>
          <div className="actions">
            <Link className="button primary" href="/the-bag-test">Read The Bag Test</Link>
          </div>
        </div>
        <p>We build kits and gift picks around gear golfers actually use. If your order arrives damaged, incorrect, or does not match what you expected, contact us within 30 days and we&apos;ll help make it right.</p>
      </section>

      <div className="proof-numbers reveal" aria-label="WYX at a glance">
        {proofStats.map((item) => (
          <div key={item.label}><strong>{item.stat}</strong><span>{item.label}</span></div>
        ))}
      </div>

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
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: 'WYX Golf Supply Co.',
        url: 'https://wyxgolfsupply.com',
        logo: 'https://wyxgolfsupply.com/images/hero-coastal-fairway.png',
        description: 'Practical golf gifts, trip kits, and bag upgrades for weekend golfers, picked using The Bag Test.',
        sameAs: []
      }) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: [
          { '@type': 'Question', name: 'What is The Bag Test?', acceptedAnswer: { '@type': 'Answer', text: 'The Bag Test is the standard WYX uses to decide what makes the catalog: would a weekend golfer keep this item in their bag after the first round? If the answer is no, the product is not listed.' } },
          { '@type': 'Question', name: 'What are the best golf gifts under $60?', acceptedAnswer: { '@type': 'Answer', text: 'The best golf gifts under $60 include golf gloves, golf balls, alignment sticks, ball markers, golf towels, scorecard holders, and magnetic hat clips. WYX Golf Supply Co. carries all of these with a 10% first-order discount with code WYX10.' } },
          { '@type': 'Question', name: 'What is in the Weekend Golfer’s Bag Upgrade Kit?', acceptedAnswer: { '@type': 'Answer', text: 'The Weekend Golfer’s Bag Upgrade Kit is built from currently in-stock gear that solves common bag annoyances: a microfiber towel, a ball marker, an at-home grip refresh, a club groove sharpener, and a small accessory caddie. Every item is confirmed in stock before it is included.' } }
        ]
      }) }} />
    </>
  );
}
