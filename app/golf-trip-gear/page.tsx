import type { Metadata } from 'next';
import Link from 'next/link';
import { EmailCapture } from '@/components/EmailCapture';
import { ProductCard } from '@/components/ProductCard';
import { availableProducts } from '@/lib/catalog';
import { siteUrl } from '@/lib/feed';
import { productQualityScore } from '@/lib/productQuality';
import { getProducts } from '@/lib/shopify/products';

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Golf Trip Gear — Packing List Essentials for Any Golf Trip | WYX Golf Supply Co.",
  description: "Golf trip gear that survives travel — arm sleeves, rain gloves, ball retriever, polarized sunglasses, and the accessories that make a 36-hole day in the sun manageable. WYX10 saves 10%.",
  alternates: { canonical: '/golf-trip-gear' },
  openGraph: {
    title: "Golf Trip Gear | WYX Golf Supply Co.",
    description: "Golf trip packing essentials — sun protection, rain gloves, towel, ball retriever, sunglasses. WYX10 saves 10% at WYX Golf Supply Co.",
    url: '/golf-trip-gear'
  }
};

const picks = [
  {
    label: 'Golf Arm Sleeves UPF 50+',
    price: '$22',
    href: '/golf-arm-sleeves',
    tag: 'Sun Protection',
    why: 'Four days in the Florida sun without arm sleeves is a dermatologist appointment. UPF 50+ compression sleeves cover the forearm and back of the hand. The golf trip essential that replaces applying sunscreen to the arms before every round — lighter, faster, and more effective.'
  },
  {
    label: 'Rain Glove Pair',
    price: '$34',
    href: '/golf-gloves',
    tag: 'Weather Insurance',
    why: 'The golf trip always includes one morning with a weather window. Rain gloves with moisture-activated grip turn a wet-weather round from a grind to a fun challenge. Both hands covered. The trip accessory that transforms the unpredictable morning tee time into a playable round.'
  },
  {
    label: 'Golf Sunglasses Polarized Sport Wrap',
    price: '$42',
    href: '/golf-sunglasses',
    tag: 'Glare Control',
    why: 'Polarized sport wrap lenses eliminate fairway and green glare on courses you have never played. The read-every-break advantage on unfamiliar greens. Stays secured during the cart ride, fits under any cap. The golf trip visual upgrade that makes the investment in the flight worth the round.'
  },
  {
    label: 'Clip-On Microfiber Towel',
    price: '$18',
    href: '/golf-towels',
    tag: 'Trip Essential',
    why: 'Used every hole of every round — more so on a trip where 36 holes per day means twice the contact with grass, bunker sand, and course debris. A dual-sided microfiber towel clips to the bag and keeps every face clean for consistent contact all day. The travel round essential.'
  },
  {
    label: 'Golf Ball Retriever — 15 Foot',
    price: '$24',
    href: '/golf-ball-retriever',
    tag: 'Ball Saver',
    why: 'Golf trips mean unfamiliar courses with unfamiliar water hazards. A 15-foot retriever in the side pocket ensures that the approach shot to the island green on hole 12 does not cost $5. Collapses to 26 inches. The trip insurance that pays for itself before the back nine.'
  },
  {
    label: 'Hat Clip Ball Marker Set',
    price: '$16',
    href: '/golf-ball-markers',
    tag: 'Always Carry',
    why: 'Three magnetic markers on a hat clip — never misplace a marker on an unfamiliar course again. The $16 golf trip essential that earns permanent hat space after the first round and travels in 3 square centimeters of bag space.'
  }
];

const faqs: [string, string][] = [
  ['What should I pack for a golf trip?', 'Six essentials: arm sleeves UPF 50+ ($22), rain glove pair ($34), polarized sunglasses ($42), microfiber towel ($18), ball retriever ($24), hat clip ball markers ($16). Total: $156 before WYX10. All at wyxgolfsupply.com with WYX10 for 10% off.'],
  ['What golf accessories are worth bringing on a golf trip?', 'Rain gloves for the unpredictable morning, arm sleeves for full-day sun protection, polarized sunglasses for unfamiliar greens, and a ball retriever for unfamiliar water hazards. These four accessories handle 90% of the situations that golf trips throw at you that a standard round does not.'],
  ['What is the most important golf trip accessory?', 'Rain gloves ($34 for a pair) — a trip without them is one weather window away from an unplayable round. Second: arm sleeves ($22) for multi-day sun protection without repeated sunscreen application. Both are compact and add nothing meaningful to packing weight.']
];

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map(([q, a]) => ({
    '@type': 'Question',
    name: q,
    acceptedAnswer: { '@type': 'Answer', text: a }
  }))
};

function tripGearScore(product: Awaited<ReturnType<typeof getProducts>>[number]) {
  let score = productQualityScore(product);
  const text = `${product.title} ${(product.tags || []).join(' ')}`;
  // True travel gear outranks generic accessories on this page.
  if (/travel bag|shoe bag|rain hood|rain cover|organizer|trip|luggage|packing/i.test(text)) score += 30;
  if (/rain glove|arm sleeve|sunglasses|retriever|rangefinder case|valuables|pouch/i.test(text)) score += 22;
  if (/towel|umbrella|tee holder|tee dispenser/i.test(text)) score += 12;
  if (/marker/i.test(text)) score += 4;
  return score;
}

export default async function GolfTripGearPage() {
  const allProducts = availableProducts(await getProducts());
  const products = allProducts
    .sort((a, b) => tripGearScore(b) - tripGearScore(a))
    .slice(0, 10);

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
          <p className="eyebrow">Golf Trip Accessories</p>
          <h1>Golf Trip Gear. Six Accessories for Any Golf Trip.</h1>
          <p>Four days of golf means four days of sun, one morning of weather, and at least one unfamiliar water hazard. These six accessories handle all of it — arm sleeves, rain gloves, polarized sunglasses, a towel, ball retriever, and hat clip markers. $156 total before WYX10.</p>
          <div className="actions">
            <Link className="button primary" href="#trip-grid">Shop Trip Gear</Link>
            <Link className="button secondary dark" href="/golf-trip-packing-list">Full Packing List &rarr;</Link>
          </div>
          <p style={{ marginTop: '1rem', fontSize: '0.875rem', opacity: 0.8 }}>
            Use <strong>WYX10</strong> at checkout for 10% off every order.
          </p>
        </div>
        <aside className="share-card">
          <p className="eyebrow">Most Important Trip Accessory</p>
          <h2>Rain Gloves</h2>
          <p>$34 for a pair. Every golf trip includes one morning weather window. Rain gloves with moisture-activated grip turn a wet round from a grind to a fun challenge. The single accessory that saves the worst morning of the trip.</p>
          <Link className="button primary" href="/golf-gloves" style={{ marginTop: '1rem', display: 'inline-block' }}>See Rain Gloves &rarr;</Link>
        </aside>
      </section>

      <section className="deal-strip" aria-label="Golf trip gear highlights">
        <span>Six essential picks</span>
        <span>Sun, rain, and water covered</span>
        <span>WYX10 saves 10%</span>
        <span>Ships in 1-3 days</span>
      </section>

      <section className="section reveal" aria-labelledby="picks-heading">
        <div className="section-heading">
          <p className="eyebrow">Six Trip Essentials</p>
          <h2 id="picks-heading">Golf Trip Gear That Covers Every Situation.</h2>
        </div>
        <div className="care-step-grid">
          {picks.map((pick) => (
            <Link key={pick.label} href={pick.href} className="care-step-card" style={{ textDecoration: 'none' }}>
              <small style={{ opacity: 0.6, fontWeight: 600, display: 'block' }}>{pick.tag}</small>
              <strong>{pick.label} — {pick.price}</strong>
              <p>{pick.why}</p>
            </Link>
          ))}
        </div>
      </section>

      <section id="trip-grid" className="section product-section">
        <div className="section-heading split">
          <div>
            <p className="eyebrow">Shop Golf Trip Gear</p>
            <h2>Golf Trip Accessories.</h2>
          </div>
          <Link className="text-link" href="/golf-trip-packing-list">Full Packing List &rarr;</Link>
        </div>
        {products.length
          ? <div className="product-grid">{products.map((p) => <ProductCard key={p.id} product={p} />)}</div>
          : (
            <div className="care-step-grid">
              <Link href="/golf-arm-sleeves" className="care-step-card" style={{ textDecoration: 'none' }}><strong>Arm Sleeves UPF 50+ — $22</strong><p>Full-day sun protection</p></Link>
              <Link href="/golf-gloves" className="care-step-card" style={{ textDecoration: 'none' }}><strong>Rain Gloves — $34</strong><p>Weather window insurance</p></Link>
              <Link href="/golf-sunglasses" className="care-step-card" style={{ textDecoration: 'none' }}><strong>Polarized Sunglasses — $42</strong><p>Unfamiliar green reads</p></Link>
              <Link href="/golf-ball-retriever" className="care-step-card" style={{ textDecoration: 'none' }}><strong>Ball Retriever — $24</strong><p>Unfamiliar water hazards</p></Link>
            </div>
          )
        }
      </section>

      <section className="section reveal" aria-labelledby="faq-heading">
        <div className="section-heading">
          <p className="eyebrow">Questions</p>
          <h2 id="faq-heading">Golf Trip Gear FAQ.</h2>
        </div>
        <div className="care-step-grid">
          {faqs.map(([q, a]) => (
            <div key={q} className="care-step-card">
              <strong>{q}</strong>
              <p>{a}</p>
            </div>
          ))}
        </div>
      </section>

      <EmailCapture
        source="golf-trip-gear"
        campaign="golf_trip_gear"
        title="Golf Trip Gear for Every Situation."
        body="Join the WYX list for trip packing guides, new products, and 10% off your first order with WYX10."
      />
    </>
  );
}
