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
  title: "Golf Rain Gear — Rain Gloves, Wet Weather Accessories & More | WYX Golf Supply Co.",
  description: "Golf rain gear that makes wet rounds playable — moisture-activated rain gloves, waterproof towels, and the accessories that convert a weather-window round into a fun challenge. WYX10 saves 10%.",
  alternates: { canonical: '/golf-rain-gear' },
  openGraph: {
    title: "Golf Rain Gear | WYX Golf Supply Co.",
    description: "Golf wet-weather gear — rain gloves with moisture-activated grip, waterproof accessories, rain-ready picks. WYX10 saves 10%.",
    url: '/golf-rain-gear'
  }
};

const picks = [
  {
    label: 'Rain Glove Pair — Moisture-Activated Grip',
    price: '$34',
    href: '/golf-gloves',
    tag: 'Most Important',
    why: 'The rain glove pair that makes a wet round playable. Moisture-activated grip that actually improves as conditions worsen — the opposite of standard cabretta leather that becomes slippery when wet. Both hands. The wet-weather purchase that converts a frustrating morning round into a legitimate competitive round.'
  },
  {
    label: 'Waterproof Microfiber Towel',
    price: '$22',
    href: '/golf-towels',
    tag: 'Rain Companion',
    why: 'A towel that wrings dry and returns to useful absorption within seconds — the rain-round essential that keeps the club face clean between shots in persistent wet conditions. Waterproof outer shell, microfiber inner layer. The towel upgrade for the golfer who plays in any weather, not just ideal conditions.'
  },
  {
    label: 'Golf Ball Retriever — 15 Foot',
    price: '$24',
    href: '/golf-ball-retriever',
    tag: 'Rain Round Essential',
    why: 'Rain rounds mean more water hazard contact — wet conditions push the ball left and right of intended lines on approach shots. A 15-foot telescoping retriever in the bag pocket makes the difference between a recovered ball and a penalty drop. The rain-round insurance that pays for itself.'
  }
];

const faqs: [string, string][] = [
  ['What golf rain gear do I need?', 'Three items: rain gloves ($34 pair — moisture-activated grip that improves in wet conditions), waterproof towel ($22 — keeps club faces dry between shots), ball retriever ($24 — wet rounds mean more water hazard contact). All at wyxgolfsupply.com with WYX10 for 10% off.'],
  ['Are rain gloves worth it for golf?', 'Yes — they are the difference between a wet round and an unplayable wet round. Standard cabretta leather becomes slippery when wet; rain gloves use moisture-activated materials that grip harder in wet conditions. A $34 pair converts the weather-window round into a legitimate competitive format.'],
  ['How do I play golf in the rain?', 'Three equipment changes: (1) Switch to rain gloves before the first drop — do not wait until the cabretta is already soaked. (2) Clean the club face more frequently with a wringing towel between shots. (3) Play for center of the green on approaches — wet greens do not hold as aggressively, and pin-hunting in rain adds risk without reward.']
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

function rainGearScore(product: Awaited<ReturnType<typeof getProducts>>[number]) {
  let score = productQualityScore(product);
  if (/rain glove|waterproof|wet weather/i.test(product.title)) score += 12;
  if (/towel|retriever|glove/i.test(product.title)) score += 5;
  return score;
}

export default async function GolfRainGearPage() {
  const allProducts = availableProducts(await getProducts());
  const products = allProducts
    .sort((a, b) => rainGearScore(b) - rainGearScore(a))
    .slice(0, 10);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: 'Golf Rain Gear',
        url: `${siteUrl}/golf-rain-gear`,
        breadcrumb: {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
            { '@type': 'ListItem', position: 2, name: 'Golf Rain Gear', item: `${siteUrl}/golf-rain-gear` }
          ]
        }
      }) }} />

      <section className="deal-hero">
        <div>
          <p className="eyebrow">Golf Wet Weather</p>
          <h1>Golf Rain Gear. Convert the Wet Round from a Grind to a Format.</h1>
          <p>Three wet-weather picks — rain gloves with moisture-activated grip that improves in rain, a waterproof towel that wrings dry between shots, and a ball retriever for the increased water hazard contact that wet conditions produce. Under $35 each. WYX10 saves 10%.</p>
          <div className="actions">
            <Link className="button primary" href="#rain-grid">Shop Rain Gear</Link>
            <Link className="button secondary dark" href="/golf-gloves">All Golf Gloves &rarr;</Link>
          </div>
          <p style={{ marginTop: '1rem', fontSize: '0.875rem', opacity: 0.8 }}>
            Use <strong>WYX10</strong> at checkout for 10% off every order.
          </p>
        </div>
        <aside className="share-card">
          <p className="eyebrow">Most Important Rain Pick</p>
          <h2>Rain Glove Pair</h2>
          <p>$34 for both hands. Moisture-activated grip that improves as conditions worsen. Switch to these before the first drop — not after the cabretta is already slippery. The wet round essential that makes the difference between playable and frustrating.</p>
          <Link className="button primary" href="/golf-gloves" style={{ marginTop: '1rem', display: 'inline-block' }}>See Rain Gloves &rarr;</Link>
        </aside>
      </section>

      <section className="deal-strip" aria-label="Golf rain gear highlights">
        <span>Moisture-activated grip gloves</span>
        <span>Waterproof towel</span>
        <span>Ball retriever for rain rounds</span>
        <span>WYX10 saves 10%</span>
      </section>

      <section className="section reveal" aria-labelledby="picks-heading">
        <div className="section-heading">
          <p className="eyebrow">Three Rain Picks</p>
          <h2 id="picks-heading">Golf Rain Gear. The Three Wet-Round Essentials.</h2>
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

      <section id="rain-grid" className="section product-section">
        <div className="section-heading split">
          <div>
            <p className="eyebrow">Shop Golf Rain Gear</p>
            <h2>Golf Wet Weather Gear.</h2>
          </div>
          <Link className="text-link" href="/golf-trip-gear">Golf Trip Gear &rarr;</Link>
        </div>
        {products.length
          ? <div className="product-grid">{products.map((p) => <ProductCard key={p.id} product={p} />)}</div>
          : (
            <div className="care-step-grid">
              <Link href="/golf-gloves" className="care-step-card" style={{ textDecoration: 'none' }}><strong>Rain Gloves — $34</strong><p>Moisture-activated grip, both hands</p></Link>
              <Link href="/golf-towels" className="care-step-card" style={{ textDecoration: 'none' }}><strong>Waterproof Towel — $22</strong><p>Wrings dry between shots</p></Link>
              <Link href="/golf-ball-retriever" className="care-step-card" style={{ textDecoration: 'none' }}><strong>Ball Retriever — $24</strong><p>Rain round insurance</p></Link>
            </div>
          )
        }
      </section>

      <section className="section reveal" aria-labelledby="faq-heading">
        <div className="section-heading">
          <p className="eyebrow">Questions</p>
          <h2 id="faq-heading">Golf Rain Gear FAQ.</h2>
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

      <section className="section reveal" aria-labelledby="links-heading">
        <div className="section-heading"><p className="eyebrow">More Wet Weather Gear</p><h2 id="links-heading">Stay Dry From Bag to Grip.</h2></div>
        <div className="care-step-grid">
          <Link href="/golf-bag-rain-cover" className="care-step-card" style={{ textDecoration: 'none' }}><strong>Golf Bag Rain Cover</strong><p>Universal waterproof hood, packs into its own pocket</p></Link>
          <Link href="/golf-rain-gloves" className="care-step-card" style={{ textDecoration: 'none' }}><strong>Golf Rain Gloves</strong><p>Moisture-activated grip in wet conditions</p></Link>
          <Link href="/golf-umbrella" className="care-step-card" style={{ textDecoration: 'none' }}><strong>Golf Umbrella</strong><p>62-inch double canopy, covers you and the bag</p></Link>
          <Link href="/golf-headcovers" className="care-step-card" style={{ textDecoration: 'none' }}><strong>Golf Headcovers</strong><p>Driver, fairway, and iron protection</p></Link>
          <Link href="/golf-club-care-kit" className="care-step-card" style={{ textDecoration: 'none' }}><strong>Golf Club Care Kit</strong><p>Clean grooves and grips after a wet round</p></Link>
        </div>
      </section>

      <EmailCapture
        source="golf-rain-gear"
        campaign="golf_rain_gear"
        title="Golf Rain Gear. Play in Any Weather."
        body="Join the WYX list for wet-weather guides, new products, and 10% off your first order with WYX10."
      />
    </>
  );
}
