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
  title: "Golf Summer Gear — Sun Protection, Cooling Accessories & Hot Round Essentials | WYX Golf Supply Co.",
  description: "Golf summer gear for hot rounds — UPF 50+ arm sleeves, polarized sunglasses, performance hats, and the accessories that make 36-hole summer days manageable. WYX10 saves 10%.",
  alternates: { canonical: '/golf-summer-gear' },
  openGraph: {
    title: "Golf Summer Gear | WYX Golf Supply Co.",
    description: "Summer golf accessories — arm sleeves, sunglasses, performance hats, cooling towels. WYX10 saves 10% at WYX Golf Supply Co.",
    url: '/golf-summer-gear'
  }
};

const picks = [
  { label: 'Arm Sleeves UPF 50+', price: '$22', href: '/golf-arm-sleeves', tag: 'Must-Have', why: 'Full forearm coverage with UPF 50+ rated compression fabric. Moisture-wicking, never sweats off, machine washable. The summer round essential that replaces sunscreen application on the arms for every round from May through September.' },
  { label: 'Polarized Sport Wrap Sunglasses', price: '$42', href: '/golf-sunglasses', tag: 'Glare Control', why: 'Polarized lenses eliminate the reflective fairway and green glare that gets significantly worse in high-sun summer conditions. Sport wrap stays secured in the cart. The visual upgrade that makes summer afternoon rounds as readable as morning ones.' },
  { label: 'Performance Golf Hat', price: '$28', href: '/golf-hats', tag: 'Sun Management', why: 'UPF 30+ structured 5-panel cap with moisture-wicking sweatband. Keeps overhead UV managed and absorbs forehead sweat before it reaches the eyes. The summer round standard — worn more often than any other golf hat format.' },
  { label: 'Cooling Microfiber Towel', price: '$22', href: '/golf-towels', tag: 'Heat Relief', why: 'Soaks in cold water and retains cooling properties for 20-30 minutes. Drapes over the neck between shots for instant temperature management. The summer round comfort accessory that makes 36-hole days in high heat more than manageable.' }
];

const faqs: [string, string][] = [
  ['What golf gear do I need for hot weather?', 'Four picks: arm sleeves UPF 50+ ($22 — sun protection all round), polarized sunglasses ($42 — glare elimination in high sun), performance golf hat ($28 — overhead UV management), cooling towel ($22 — neck cooling between shots). All at wyxgolfsupply.com with WYX10 for 10% off.'],
  ['How do I stay cool while playing golf in summer?', 'Equipment approach: UPF arm sleeves instead of spray sunscreen (more consistent, never sweats off), a cooling towel soaked in cold water for between-shot neck draping, and a moisture-wicking hat with a breathable structure. Drink a full water bottle per 9 holes in temperatures above 85°F.'],
  ['Best golf accessories for summer rounds?', 'Arm sleeves ($22) for full-round sun protection, sunglasses ($42) for afternoon glare elimination, and a cooling towel ($22) for heat management. Together they cover the three variables that make summer golf harder than it needs to be — UV exposure, visual glare, and heat fatigue.']
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

function summerScore(product: Awaited<ReturnType<typeof getProducts>>[number]) {
  let score = productQualityScore(product);
  if (/arm sleeve|sunglasses|hat|towel|upf/i.test(product.title)) score += 8;
  return score;
}

export default async function GolfSummerGearPage() {
  const allProducts = availableProducts(await getProducts());
  const products = allProducts.sort((a, b) => summerScore(b) - summerScore(a)).slice(0, 10);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org', '@type': 'CollectionPage', name: 'Golf Summer Gear', url: `${siteUrl}/golf-summer-gear`,
        breadcrumb: { '@type': 'BreadcrumbList', itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
          { '@type': 'ListItem', position: 2, name: 'Golf Summer Gear', item: `${siteUrl}/golf-summer-gear` }
        ]}
      }) }} />

      <section className="deal-hero">
        <div>
          <p className="eyebrow">Summer Golf Accessories</p>
          <h1>Golf Summer Gear. Sun, Glare &amp; Heat — All Covered.</h1>
          <p>Four picks for four summer variables — UPF arm sleeves for all-day sun protection, polarized sunglasses for afternoon glare, a performance hat for overhead UV, and a cooling towel for between-shot heat management. Under $45 each. WYX10 saves 10%.</p>
          <div className="actions">
            <Link className="button primary" href="#summer-grid">Shop Summer Gear</Link>
            <Link className="button secondary dark" href="/golf-arm-sleeves">Arm Sleeves &rarr;</Link>
          </div>
          <p style={{ marginTop: '1rem', fontSize: '0.875rem', opacity: 0.8 }}>Use <strong>WYX10</strong> at checkout for 10% off every order.</p>
        </div>
        <aside className="share-card">
          <p className="eyebrow">Summer Essential #1</p>
          <h2>Arm Sleeves UPF 50+</h2>
          <p>$22 a pair. Full forearm coverage that never sweats off. The summer round essential that replaces spray sunscreen for every round from May through September.</p>
          <Link className="button primary" href="/golf-arm-sleeves" style={{ marginTop: '1rem', display: 'inline-block' }}>See Arm Sleeves &rarr;</Link>
        </aside>
      </section>

      <section className="deal-strip" aria-label="Summer gear highlights">
        <span>UPF 50+ arm coverage</span><span>Polarized glare control</span><span>Cooling towel included</span><span>WYX10 saves 10%</span>
      </section>

      <section className="section reveal" aria-labelledby="picks-heading">
        <div className="section-heading"><p className="eyebrow">Four Summer Picks</p><h2 id="picks-heading">Golf Summer Gear.</h2></div>
        <div className="care-step-grid">
          {picks.map((p) => (
            <Link key={p.label} href={p.href} className="care-step-card" style={{ textDecoration: 'none' }}>
              <small style={{ opacity: 0.6, fontWeight: 600, display: 'block' }}>{p.tag}</small>
              <strong>{p.label} — {p.price}</strong><p>{p.why}</p>
            </Link>
          ))}
        </div>
      </section>

      <section id="summer-grid" className="section product-section">
        <div className="section-heading split"><div><p className="eyebrow">Shop Summer Gear</p><h2>Golf Summer Gear.</h2></div><Link className="text-link" href="/golf-trip-gear">Golf Trip Gear &rarr;</Link></div>
        {products.length
          ? <div className="product-grid">{products.map((p) => <ProductCard key={p.id} product={p} />)}</div>
          : <div className="care-step-grid">
              <Link href="/golf-arm-sleeves" className="care-step-card" style={{ textDecoration: 'none' }}><strong>Arm Sleeves — $22</strong><p>UPF 50+, all-day coverage</p></Link>
              <Link href="/golf-sunglasses" className="care-step-card" style={{ textDecoration: 'none' }}><strong>Sunglasses — $42</strong><p>Polarized afternoon glare control</p></Link>
              <Link href="/golf-hats" className="care-step-card" style={{ textDecoration: 'none' }}><strong>Performance Hat — $28</strong><p>UPF 30+, moisture-wicking</p></Link>
              <Link href="/golf-towels" className="care-step-card" style={{ textDecoration: 'none' }}><strong>Cooling Towel — $22</strong><p>Between-shot heat management</p></Link>
            </div>
        }
      </section>

      <section className="section reveal" aria-labelledby="faq-heading">
        <div className="section-heading"><p className="eyebrow">Questions</p><h2 id="faq-heading">Golf Summer Gear FAQ.</h2></div>
        <div className="care-step-grid">
          {faqs.map(([q, a]) => (<div key={q} className="care-step-card"><strong>{q}</strong><p>{a}</p></div>))}
        </div>
      </section>

      <EmailCapture source="golf-summer-gear" campaign="golf_summer_gear" title="Golf Summer Gear. Built for Hot Rounds." body="Join the WYX list for summer picks, sun protection guides, and 10% off your first order with WYX10." />
    </>
  );
}
