import type { Metadata } from 'next';
import Link from 'next/link';
import { EmailCapture } from '@/components/EmailCapture';
import { ProductCard } from '@/components/ProductCard';
import { availableProducts, categoryFor } from '@/lib/catalog';
import { siteUrl } from '@/lib/feed';
import { productQualityScore } from '@/lib/productQuality';
import { getProducts } from '@/lib/shopify/products';

export const revalidate = 300;

export const metadata: Metadata = {
  title: 'Golf Trip Gear for Weekend Golf Trips | WYX Golf Supply Co.',
  description: 'Shop live golf-trip gear for travel days, long rounds, changing weather, and better-organized bags. WYX10 saves 10% on your first order.',
  alternates: { canonical: '/golf-trip-gear' },
  openGraph: {
    title: 'Golf Trip Gear | WYX Golf Supply Co.',
    description: 'Useful golf-trip gear selected for real travel, long rounds, and better bags. Live inventory and secure Shopify checkout.',
    url: '/golf-trip-gear'
  }
};

const tripNeeds = [
  {
    title: 'Pack Smaller',
    copy: 'Favor gear that earns its luggage space: compact accessories, bag organization, weather backup, and things you will actually use during multiple rounds.'
  },
  {
    title: 'Prepare For The Weird Round',
    copy: 'Golf trips expose you to unfamiliar courses and changing conditions. A few practical backups beat overpacking half the golf shop.'
  },
  {
    title: 'Make The Bag Easier',
    copy: 'The best trip gear reduces friction: fewer loose items, cleaner clubs, easier access, and less digging through pockets on the first tee.'
  }
];

const faqs: [string, string][] = [
  ['What golf gear is worth packing for a trip?', 'Prioritize items with a clear job across multiple rounds: towels, markers, weather gear, bag organization, small club-care tools, travel accessories, and compact practice or tech items you already know how to use.'],
  ['How do I avoid overpacking golf accessories?', 'Use one rule: if an item does not solve a likely trip problem or get used during a normal round, leave it home. WYX calls that The Bag Test.'],
  ['Are golf-trip gifts different from normal golf gifts?', 'Usually they should be easier to pack and easier to use without knowing someone’s exact club setup. Small accessories, headwear, towels, organizers, and useful bag upgrades are safer than highly personal equipment.']
];

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map(([question, answer]) => ({
    '@type': 'Question',
    name: question,
    acceptedAnswer: { '@type': 'Answer', text: answer }
  }))
};

function tripGearScore(product: Awaited<ReturnType<typeof getProducts>>[number]) {
  let score = productQualityScore(product);
  const text = `${product.title} ${product.productType} ${(product.tags || []).join(' ')}`;
  const category = categoryFor(product);

  if (/travel|trip|rain|retriever|organizer|pouch|shoe bag|sunglasses|arm sleeve|weather/i.test(text)) score += 24;
  if (/towel|marker|caddie|headcover|brush|groove|tee|glove/i.test(text)) score += 12;
  if (['Towels', 'Accessories', 'Club Care', 'Headwear'].includes(category)) score += 6;
  if (category === 'Apparel') score += 2;
  return score;
}

export default async function GolfTripGearPage() {
  const allProducts = availableProducts(await getProducts());
  const products = [...allProducts]
    .sort((a, b) => tripGearScore(b) - tripGearScore(a))
    .slice(0, 12);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: 'Golf Trip Gear',
        url: `${siteUrl}/golf-trip-gear`,
        breadcrumb: {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
            { '@type': 'ListItem', position: 2, name: 'Golf Trip Gear', item: `${siteUrl}/golf-trip-gear` }
          ]
        }
      }) }} />

      <section className="deal-hero">
        <div>
          <p className="eyebrow">Golf Trip Gear</p>
          <h1>Pack For The Rounds You Are Actually Going To Play.</h1>
          <p>WYX trip gear is built around a simple idea: bring fewer things, but make each one useful. Shop live picks for travel, weather, bag organization, club care, and long golf days.</p>
          <div className="actions">
            <Link className="button primary" href="#trip-grid">Shop Live Trip Picks</Link>
            <Link className="button secondary dark" href="/golf-trip-packing-list">Golf Trip Packing List</Link>
          </div>
          <p style={{ marginTop: '1rem', fontSize: '0.875rem', opacity: 0.8 }}>
            Use <strong>WYX10</strong> for 10% off your first order.
          </p>
        </div>
        <aside className="share-card">
          <p className="eyebrow">The Trip Rule</p>
          <h2>Earn The Luggage Space.</h2>
          <p>If a golf accessory will not help across multiple rounds, travel days, or changing conditions, it probably does not need to make the trip.</p>
          <Link className="button primary" href="/the-bag-test" style={{ marginTop: '1rem', display: 'inline-block' }}>See The Bag Test</Link>
        </aside>
      </section>

      <section className="deal-strip" aria-label="Golf trip shopping highlights">
        <span>Live Shopify inventory</span>
        <span>Trip-ready useful gear</span>
        <span>WYX10 saves 10%</span>
        <span>Shipping shown before payment</span>
      </section>

      <section className="section reveal" aria-labelledby="trip-needs-heading">
        <div className="section-heading">
          <p className="eyebrow">Trip Checklist</p>
          <h2 id="trip-needs-heading">Three Rules Before You Pack.</h2>
        </div>
        <div className="care-step-grid">
          {tripNeeds.map((item) => (
            <div key={item.title} className="care-step-card">
              <strong>{item.title}</strong>
              <p>{item.copy}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="trip-grid" className="section product-section">
        <div className="section-heading split">
          <div>
            <p className="eyebrow">Live Picks</p>
            <h2>Golf Trip Gear Available Now.</h2>
          </div>
          <Link className="text-link" href="/products">Shop all</Link>
        </div>
        {products.length > 0
          ? <div className="product-grid">{products.map((product) => <ProductCard key={product.id} product={product} />)}</div>
          : <p>Trip picks are being refreshed. Browse the full shop for currently available gear.</p>
        }
      </section>

      <section className="section reveal" aria-labelledby="faq-heading">
        <div className="section-heading">
          <p className="eyebrow">Questions</p>
          <h2 id="faq-heading">Golf Trip Gear FAQ.</h2>
        </div>
        <div className="care-step-grid">
          {faqs.map(([question, answer]) => (
            <div key={question} className="care-step-card">
              <strong>{question}</strong>
              <p>{answer}</p>
            </div>
          ))}
        </div>
      </section>

      <EmailCapture
        source="golf-trip-gear"
        campaign="golf_trip_gear"
        title="Build A Better Golf Trip Bag."
        body="Get WYX trip picks, packing ideas, and Bag Test winners plus 10% off your first order with WYX10."
      />
    </>
  );
}
