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
  title: "Golf Travel Bag — What to Pack for a Golf Trip | WYX Golf Supply Co.",
  description: "Golf travel bag essentials — the 8 accessories every golfer needs to pack for a trip. Arm sleeves, rain gloves, microfiber towel, ball retriever, markers, divot tool, sunglasses, and a scorecard holder. WYX10 saves 10%.",
  alternates: { canonical: '/golf-travel-bag' },
  openGraph: {
    title: "Golf Travel Bag Essentials | WYX Golf Supply Co.",
    description: "What to pack in a golf travel bag — arm sleeves, rain gloves, towel, retriever, markers, divot tool, sunglasses, scorecard holder. WYX10 saves 10%.",
    url: '/golf-travel-bag'
  }
};

const items = [
  { step: '01', label: 'Arm Sleeves UPF 50+', price: '$22', href: '/golf-arm-sleeves', why: 'Sun protection for every round without reapplication. One pair per trip, machine washable the night before.' },
  { step: '02', label: 'Rain Gloves — 2-Pair', price: '$28', href: '/golf-rain-gear', why: 'Grip improves in the rain with rain gloves. Non-negotiable on a golf trip with outdoor tee times and unpredictable weather.' },
  { step: '03', label: 'Clip-On Microfiber Towel', price: '$18', href: '/golf-towels', why: 'Groove cleaning and face drying every hole. The most-used accessory on the course after the glove.' },
  { step: '04', label: 'Ball Retriever — 15 Foot', price: '$24', href: '/golf-ball-retriever', why: 'Unfamiliar courses have unfamiliar hazards. A retriever pays for itself in round 1 on an unknown layout.' },
  { step: '05', label: 'Hat Clip Ball Markers', price: '$16', href: '/golf-ball-markers', why: 'Three magnetic markers on a hat clip. Always accessible, USGA-legal, never left in the wrong pocket.' },
  { step: '06', label: 'Magnetic Divot Tool', price: '$18', href: '/golf-divot-tools', why: 'Covers divot repair and ball marking in one tool. The combo that eliminates two items from the travel checklist.' },
  { step: '07', label: 'Polarized Golf Sunglasses', price: '$48', href: '/golf-sunglasses', why: 'Polarized lenses track ball flight in bright sky conditions. Essential on open courses with no canopy.' },
  { step: '08', label: 'Leather Scorecard Holder', price: '$79', href: '/golf-gifts-for-men', why: 'The prestige travel item. Full-grain leather, magnetic closure. Keeps the round\'s scorecard protected across 18.' }
];

const faqs: [string, string][] = [
  ['What should I pack in my golf travel bag?', 'Eight essentials: arm sleeves ($22), rain gloves ($28), clip-on towel ($18), ball retriever ($24), hat clip ball markers ($16), magnetic divot tool ($18), polarized sunglasses ($48), leather scorecard holder ($79). Total: $253 before WYX10 — $228 with WYX10. All at wyxgolfsupply.com.'],
  ['What golf accessories do I need for a golf trip?', 'Sun protection (arm sleeves + sunglasses), wet weather (rain gloves), groove care (towel), hazard prep (retriever), green kit (markers + divot tool), and a scorecard holder. Eight items, all under $80 each, all at wyxgolfsupply.com with WYX10 for 10% off.'],
  ['What is the most important golf accessory for travel?', 'Rain gloves ($28) — unfamiliar courses often have more water hazards than your home course. Second: a ball retriever ($24) for the same reason. Third: arm sleeves ($22) — sunscreen is thick and needs reapplication; sleeves cover the full forearm all day with no maintenance.']
];

const jsonLd = {
  '@context': 'https://schema.org', '@type': 'FAQPage',
  mainEntity: faqs.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } }))
};

function travelScore(product: Awaited<ReturnType<typeof getProducts>>[number]) {
  let score = productQualityScore(product);
  if (/arm sleeve|rain glove|towel|retriever|marker|divot|sunglass|scorecard/i.test(product.title)) score += 10;
  return score;
}

export default async function GolfTravelBagPage() {
  const allProducts = availableProducts(await getProducts());
  const products = allProducts.sort((a, b) => travelScore(b) - travelScore(a)).slice(0, 10);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org', '@type': 'CollectionPage', name: 'Golf Travel Bag Essentials', url: `${siteUrl}/golf-travel-bag`,
        breadcrumb: { '@type': 'BreadcrumbList', itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
          { '@type': 'ListItem', position: 2, name: 'Golf Travel Bag', item: `${siteUrl}/golf-travel-bag` }
        ]}
      }) }} />

      <section className="deal-hero">
        <div>
          <p className="eyebrow">Golf Trip Packing</p>
          <h1>Golf Travel Bag. Eight Accessories for Any Golf Trip.</h1>
          <p>Arm sleeves for sun, rain gloves for wet weather, a clip-on towel for grooves, a ball retriever for unfamiliar hazards, hat clip markers, a magnetic divot tool, polarized sunglasses, and a leather scorecard holder. Eight items that cover every situation on an unfamiliar course. WYX10 saves 10%.</p>
          <div className="actions">
            <Link className="button primary" href="#travel-grid">Shop Travel Essentials</Link>
            <Link className="button secondary dark" href="/golf-trip-packing-list">Full Packing List &rarr;</Link>
          </div>
          <p style={{ marginTop: '1rem', fontSize: '0.875rem', opacity: 0.8 }}>Use <strong>WYX10</strong> at checkout for 10% off every order.</p>
        </div>
        <aside className="share-card">
          <p className="eyebrow">Most Important Travel Pick</p>
          <h2>Rain Gloves — 2-Pair</h2>
          <p>$28. Grip improves in the rain with rain gloves — standard leather gloves turn slick when wet. Two pairs for a multi-day trip. The single accessory most golfers forget and regret forgetting by hole 4 of a wet morning round.</p>
          <Link className="button primary" href="/golf-rain-gear" style={{ marginTop: '1rem', display: 'inline-block' }}>See Rain Gloves &rarr;</Link>
        </aside>
      </section>

      <section className="deal-strip" aria-label="Golf travel bag highlights">
        <span>Sun protection — arm sleeves + sunglasses</span><span>Rain gloves — wet weather grip</span><span>WYX10 saves 10%</span><span>Ships in 1-3 days</span>
      </section>

      <section className="section reveal" aria-labelledby="travel-picks-heading">
        <div className="section-heading"><p className="eyebrow">Eight Essentials</p><h2 id="travel-picks-heading">Golf Travel Bag. In Order of Need.</h2></div>
        <div className="care-step-grid">
          {items.map((item) => (
            <Link key={item.label} href={item.href} className="care-step-card" style={{ textDecoration: 'none' }}>
              <small style={{ opacity: 0.6, fontWeight: 600, display: 'block' }}>{item.step}</small>
              <strong>{item.label} — {item.price}</strong><p>{item.why}</p>
            </Link>
          ))}
        </div>
      </section>

      <section id="travel-grid" className="section product-section">
        <div className="section-heading split">
          <div><p className="eyebrow">Shop Travel Essentials</p><h2>Golf Travel Accessories.</h2></div>
          <Link className="text-link" href="/golf-trip-gear">Golf Trip Gear &rarr;</Link>
        </div>
        {products.length
          ? <div className="product-grid">{products.map((p) => <ProductCard key={p.id} product={p} />)}</div>
          : <div className="care-step-grid">
              <Link href="/golf-arm-sleeves" className="care-step-card" style={{ textDecoration: 'none' }}><strong>Arm Sleeves — $22</strong><p>UPF 50+, all day sun</p></Link>
              <Link href="/golf-rain-gear" className="care-step-card" style={{ textDecoration: 'none' }}><strong>Rain Gloves — $28</strong><p>Grip in wet weather</p></Link>
              <Link href="/golf-ball-retriever" className="care-step-card" style={{ textDecoration: 'none' }}><strong>Ball Retriever — $24</strong><p>Unfamiliar hazards</p></Link>
              <Link href="/golf-sunglasses" className="care-step-card" style={{ textDecoration: 'none' }}><strong>Polarized Sunglasses — $48</strong><p>Track ball flight</p></Link>
            </div>
        }
      </section>

      <section className="section reveal" aria-labelledby="faq-heading">
        <div className="section-heading"><p className="eyebrow">Questions</p><h2 id="faq-heading">Golf Travel Bag FAQ.</h2></div>
        <div className="care-step-grid">
          {faqs.map(([q, a]) => (<div key={q} className="care-step-card"><strong>{q}</strong><p>{a}</p></div>))}
        </div>
      </section>

      <EmailCapture source="golf-travel-bag" campaign="golf_travel_bag" title="Golf Trip Packing. Eight Essentials." body="Join the WYX list for golf trip guides and 10% off your first order with WYX10." />
    </>
  );
}
