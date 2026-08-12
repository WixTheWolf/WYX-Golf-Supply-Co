import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { EmailCapture } from '@/components/EmailCapture';
import { ProductCard } from '@/components/ProductCard';
import { availableProducts, categoryFor } from '@/lib/catalog';
import { siteUrl } from '@/lib/feed';
import { coreMerchProducts, tripProducts } from '@/lib/merchandisingFilters';
import { productQualityScore } from '@/lib/productQuality';
import { getProducts } from '@/lib/shopify/products';

export const revalidate = 300;

const tripPhoto = 'https://images.unsplash.com/photo-1713729372679-7feb052d74a6?auto=format&fit=crop&w=2200&q=86';

export const metadata: Metadata = {
  title: 'Golf Trip Gear for Weekend Golf Trips',
  description: 'A tight edit of golf-trip gear for travel days, long rounds, changing conditions, and better-organized bags.',
  alternates: { canonical: '/golf-trip-gear' },
  openGraph: {
    title: 'Golf Trip Gear | WYX Golf Supply Co.',
    description: 'Fewer things. Better golf trip. Shop WYX gear selected for travel days, carts, long rounds and the weekend away.',
    url: '/golf-trip-gear',
    images: [{ url: tripPhoto }]
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
  ['What golf gear is worth packing for a trip?', 'Prioritize items with a clear job across multiple rounds: towels, markers, weather gear, bag organization, small club-care tools, travel accessories, and gear you already know how to use.'],
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

  if (/travel|trip|organizer|pouch|caddie|game|headcover|hat|belt/i.test(text)) score += 24;
  if (/towel|marker|glove|grip|tee/i.test(text)) score += 10;
  if (['Towels', 'Accessories', 'Headwear'].includes(category)) score += 6;
  return score;
}

export default async function GolfTripGearPage() {
  const curated = coreMerchProducts(availableProducts(await getProducts()));
  const products = tripProducts([...curated].sort((a, b) => tripGearScore(b) - tripGearScore(a)), 12);

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

      <section className="trip-photo-hero">
        <Image src={tripPhoto} alt="Golf cart and golf bag on the course during a golf trip" fill priority sizes="100vw" />
        <span className="trip-photo-hero-overlay" />
        <div className="trip-photo-hero-copy">
          <p className="eyebrow">TRIP MODE / WYX</p>
          <h1>PACK FOR THE WEEKEND, NOT THE CATALOG.</h1>
          <p>Airports. Rental carts. 36-hole days. Strange weather. One hotel room full of golf bags. Bring fewer things, but make every one of them earn the luggage space.</p>
          <div className="actions">
            <Link className="button primary" href="#trip-grid">SHOP THE TRIP EDIT</Link>
            <Link className="button secondary" href="/golf-trip-packing-list">PACKING LIST</Link>
          </div>
        </div>
      </section>

      <section className="section reveal" aria-labelledby="trip-needs-heading">
        <div className="section-heading">
          <p className="eyebrow">THE TRIP RULES</p>
          <h2 id="trip-needs-heading">THREE RULES BEFORE IT MAKES THE DUFFLE.</h2>
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
            <p className="eyebrow">THE CURRENT TRIP EDIT</p>
            <h2>GEAR WE&apos;D ACTUALLY PACK.</h2>
          </div>
          <Link className="text-link" href="/products">Shop All WYX</Link>
        </div>
        {products.length > 0
          ? <div className="product-grid">{products.map((product) => <ProductCard key={product.id} product={product} />)}</div>
          : <p>Trip picks are being refreshed. Browse the live WYX shop for currently available gear.</p>
        }
      </section>

      <section className="section reveal" aria-labelledby="faq-heading">
        <div className="section-heading">
          <p className="eyebrow">QUICK QUESTIONS</p>
          <h2 id="faq-heading">GOLF TRIP GEAR FAQ.</h2>
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
        title="GET NEW TRIP GEAR FIRST."
        body="New travel gear, premium picks, and the pieces that make the next golf weekend easier."
      />
    </>
  );
}
