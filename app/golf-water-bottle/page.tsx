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
  title: "Golf Water Bottle — Insulated 32oz & Golf Flask with Ball Marker Lid | WYX Golf Supply Co.",
  description: "Golf water bottles and flasks for the course — 32oz insulated bottles that fit cart holders, and the stainless steel golf flask with a ball marker built into the lid. WYX10 saves 10%.",
  alternates: { canonical: '/golf-water-bottle' },
  openGraph: {
    title: "Golf Water Bottle | WYX Golf Supply Co.",
    description: "Golf water bottles and flasks — insulated 32oz, stainless flask with ball marker lid. WYX10 saves 10%.",
    url: '/golf-water-bottle'
  }
};

const picks = [
  { label: 'Golf Stainless Flask — 8oz with Ball Marker Lid', price: '$38', href: '/golf-water-bottle', tag: 'Unique Pick', why: 'An 8oz stainless steel vacuum flask with a magnetized ball marker recessed into the lid cap. Cold 4 hours, hot 3 hours. The golf flask that replaces the plastic cooler cup most cart golfers use — and the ball marker is always accessible. A practical golf gift under $40 with a function most golfers have not seen before.' },
  { label: 'Insulated Golf Water Bottle — 32oz', price: '$28', href: '/golf-water-bottle', tag: 'Full Round Hydration', why: 'A 32oz double-wall insulated bottle that fits standard golf cart cup holders. Keeps water cold for 9+ hours in summer heat. The full-round hydration solution for golfers who walk or play 36-hole days in summer conditions. Wide mouth for ice, narrow spout for drinking without removing the cap.' }
];

const faqs: [string, string][] = [
  ['What is the best golf water bottle?', 'A 32oz insulated bottle ($28) for full-round hydration — fits standard cart cup holders, keeps cold for 9+ hours. The stainless flask with ball marker lid ($38) is the gift pick — practical, unique, combines two bag needs in one accessory. Both at wyxgolfsupply.com with WYX10 for 10% off.'],
  ['How much water should I drink during a round of golf?', 'At least one full bottle per 9 holes in summer conditions (roughly 32oz per 9, 64oz per 18). A 32oz insulated bottle covers 9 holes; refill at the turn for the back nine. In temperatures above 85°F, hydration directly affects focus and decision quality on approach shots after hole 12.'],
  ['Is a golf flask a good gift?', 'The stainless golf flask with ball marker lid ($38) is a practical golf gift under $40 — it combines the flask and ball marker into one accessory, and most golfers have never seen this format before. A more memorable gift than another sleeve of balls or a standard mug.']
];

const jsonLd = {
  '@context': 'https://schema.org', '@type': 'FAQPage',
  mainEntity: faqs.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } }))
};

function bottleScore(product: Awaited<ReturnType<typeof getProducts>>[number]) {
  let score = productQualityScore(product);
  if (/flask|water bottle|hydration/i.test(product.title)) score += 15;
  return score;
}

export default async function GolfWaterBottlePage() {
  const allProducts = availableProducts(await getProducts());
  const products = allProducts.sort((a, b) => bottleScore(b) - bottleScore(a)).slice(0, 10);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org', '@type': 'CollectionPage', name: 'Golf Water Bottle', url: `${siteUrl}/golf-water-bottle`,
        breadcrumb: { '@type': 'BreadcrumbList', itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
          { '@type': 'ListItem', position: 2, name: 'Golf Water Bottle', item: `${siteUrl}/golf-water-bottle` }
        ]}
      }) }} />

      <section className="deal-hero">
        <div>
          <p className="eyebrow">Golf Hydration</p>
          <h1>Golf Water Bottle &amp; Flask. Stay Sharp Through 18.</h1>
          <p>A 32oz insulated bottle that fits any cart cup holder and keeps water cold for 9+ hours. Plus: the stainless flask with a magnetic ball marker built into the lid — the golf accessory that combines two bag needs in one. Under $40. WYX10 saves 10%.</p>
          <div className="actions">
            <Link className="button primary" href="#bottle-grid">Shop Golf Bottles</Link>
            <Link className="button secondary dark" href="/golf-accessories-every-golfer-needs">All Bag Essentials &rarr;</Link>
          </div>
          <p style={{ marginTop: '1rem', fontSize: '0.875rem', opacity: 0.8 }}>Use <strong>WYX10</strong> at checkout for 10% off every order.</p>
        </div>
        <aside className="share-card">
          <p className="eyebrow">Unique Gift Pick — $38</p>
          <h2>Golf Flask + Ball Marker Lid</h2>
          <p>8oz stainless flask with a magnetized ball marker recessed into the lid. Cold 4 hours. The golf gift that combines two bag needs in one accessory — a format most golfers have never seen.</p>
          <Link className="button primary" href="#bottle-grid" style={{ marginTop: '1rem', display: 'inline-block' }}>Shop Flasks &rarr;</Link>
        </aside>
      </section>

      <section className="deal-strip" aria-label="Golf water bottle highlights">
        <span>32oz insulated — fits cart holders</span><span>Flask with ball marker lid — $38</span><span>WYX10 saves 10%</span><span>Ships in 1-3 days</span>
      </section>

      <section className="section reveal" aria-labelledby="picks-heading">
        <div className="section-heading"><p className="eyebrow">Two Picks</p><h2 id="picks-heading">Golf Water Bottles &amp; Flasks.</h2></div>
        <div className="care-step-grid">
          {picks.map((p) => (
            <Link key={p.label} href={p.href} className="care-step-card" style={{ textDecoration: 'none' }}>
              <small style={{ opacity: 0.6, fontWeight: 600, display: 'block' }}>{p.tag}</small>
              <strong>{p.label} — {p.price}</strong><p>{p.why}</p>
            </Link>
          ))}
        </div>
      </section>

      <section id="bottle-grid" className="section product-section">
        <div className="section-heading split">
          <div><p className="eyebrow">Shop Golf Water Bottles</p><h2>Golf Water Bottles.</h2></div>
          <Link className="text-link" href="/golf-bag-accessories">All Bag Accessories &rarr;</Link>
        </div>
        {products.length
          ? <div className="product-grid">{products.map((p) => <ProductCard key={p.id} product={p} />)}</div>
          : <div className="care-step-grid">
              <Link href="/golf-water-bottle" className="care-step-card" style={{ textDecoration: 'none' }}><strong>Stainless Flask + Marker — $38</strong><p>Unique gift pick</p></Link>
              <Link href="/golf-water-bottle" className="care-step-card" style={{ textDecoration: 'none' }}><strong>Insulated Bottle 32oz — $28</strong><p>Full round, fits cart holder</p></Link>
            </div>
        }
      </section>

      <section className="section reveal" aria-labelledby="faq-heading">
        <div className="section-heading"><p className="eyebrow">Questions</p><h2 id="faq-heading">Golf Water Bottle FAQ.</h2></div>
        <div className="care-step-grid">
          {faqs.map(([q, a]) => (<div key={q} className="care-step-card"><strong>{q}</strong><p>{a}</p></div>))}
        </div>
      </section>

      <EmailCapture source="golf-water-bottle" campaign="golf_water_bottle" title="Golf Water Bottles. Stay Sharp Through 18." body="Join the WYX list for hydration picks and 10% off your first order with WYX10." />
    </>
  );
}
