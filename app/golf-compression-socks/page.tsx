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
  title: "Golf Compression Socks — 3-Pair Set for Walk Rounds | WYX Golf Supply Co.",
  description: "Golf compression socks with graduated compression, arch support, and moisture-wicking merino blend — 3-pair set for walking 18 or 36 holes. The sock that makes the back nine feel like the front nine. WYX10 saves 10%.",
  alternates: { canonical: '/golf-compression-socks' },
  openGraph: {
    title: "Golf Compression Socks | WYX Golf Supply Co.",
    description: "Golf compression socks — graduated compression, arch support, merino blend. 3-pair set for walk rounds. WYX10 saves 10%.",
    url: '/golf-compression-socks'
  }
};

const picks = [
  { label: 'Golf Compression Sock Set — 3 Pairs', price: '$28', href: '/golf-compression-socks', tag: 'Walk Round Essential', why: 'Three pairs of golf compression socks with graduated compression (15-20 mmHg), arch support band, merino-blend moisture-wicking fabric, and cushioned heel and toe. For golfers walking 18 holes — compression reduces foot and calf fatigue so the back nine feels like the front nine, not a forced march on already-tired legs. Machine washable, sized S/M (US 6-9) and L/XL (US 10-13).' }
];

const faqs: [string, string][] = [
  ['What are the best golf socks for walking?', 'Compression golf socks with graduated compression (15-20 mmHg) and arch support. The 3-pair compression sock set ($28) has merino-blend moisture-wicking fabric that reduces blister risk across 18 holes, and cushioned heel and toe for impact absorption on hard cart paths. Available at wyxgolfsupply.com with WYX10 for 10% off.'],
  ['Do compression socks help during golf?', 'Yes — specifically for golfers who walk. Graduated compression (15-20 mmHg) reduces blood pooling in the calf and foot during 4+ hours of walking, which reduces the muscular fatigue that causes the back nine to feel harder than the front nine. The arch support also prevents the plantar fasciitis flare-up that walking golfers often experience on long days.'],
  ['What size golf compression socks do I need?', 'S/M fits US men\'s shoe size 6-9 and most women\'s sizes. L/XL fits US men\'s 10-13. Compression socks should be snug but not painful — if the sock bunches or leaves deep marks, size up. The 3-pair set at WYX comes in both sizes — check the size chart in the product listing.']
];

const jsonLd = {
  '@context': 'https://schema.org', '@type': 'FAQPage',
  mainEntity: faqs.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } }))
};

function sockScore(product: Awaited<ReturnType<typeof getProducts>>[number]) {
  let score = productQualityScore(product);
  if (/sock|compression/i.test(product.title)) score += 20;
  return score;
}

export default async function GolfCompressionSocksPage() {
  const allProducts = availableProducts(await getProducts());
  const products = allProducts.sort((a, b) => sockScore(b) - sockScore(a)).slice(0, 10);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org', '@type': 'CollectionPage', name: 'Golf Compression Socks', url: `${siteUrl}/golf-compression-socks`,
        breadcrumb: { '@type': 'BreadcrumbList', itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
          { '@type': 'ListItem', position: 2, name: 'Golf Compression Socks', item: `${siteUrl}/golf-compression-socks` }
        ]}
      }) }} />

      <section className="deal-hero">
        <div>
          <p className="eyebrow">Walk Round Socks</p>
          <h1>Golf Compression Socks. Back Nine Feels Like the Front Nine.</h1>
          <p>A 3-pair set of graduated compression golf socks (15-20 mmHg) with arch support, merino-blend moisture-wicking fabric, and cushioned heel and toe. For golfers who walk 18 holes and feel the difference in their legs and feet by the 13th hole. WYX10 saves 10%.</p>
          <div className="actions">
            <Link className="button primary" href="#socks-grid">Shop Compression Socks</Link>
            <Link className="button secondary dark" href="/golf-apparel">All Golf Apparel &rarr;</Link>
          </div>
          <p style={{ marginTop: '1rem', fontSize: '0.875rem', opacity: 0.8 }}>Use <strong>WYX10</strong> at checkout for 10% off every order.</p>
        </div>
        <aside className="share-card">
          <p className="eyebrow">Walk Round Essential — $28</p>
          <h2>3-Pair Compression Set</h2>
          <p>Graduated compression reduces calf and foot fatigue across 4+ hours of walking. Arch support prevents plantar fasciitis flare-up on long days. Merino-blend wicks moisture for 18 blister-free holes. Three pairs covers a full month of rounds.</p>
          <Link className="button primary" href="#socks-grid" style={{ marginTop: '1rem', display: 'inline-block' }}>Shop Socks &rarr;</Link>
        </aside>
      </section>

      <section className="deal-strip" aria-label="Compression socks highlights">
        <span>15-20 mmHg graduated compression</span><span>Arch support band</span><span>3 pairs — $28</span><span>WYX10 saves 10%</span>
      </section>

      <section className="section reveal" aria-labelledby="picks-heading">
        <div className="section-heading"><p className="eyebrow">The Pick</p><h2 id="picks-heading">Golf Compression Socks.</h2></div>
        <div className="care-step-grid">
          {picks.map((p) => (
            <Link key={p.label} href={p.href} className="care-step-card" style={{ textDecoration: 'none' }}>
              <small style={{ opacity: 0.6, fontWeight: 600, display: 'block' }}>{p.tag}</small>
              <strong>{p.label} — {p.price}</strong><p>{p.why}</p>
            </Link>
          ))}
        </div>
      </section>

      <section id="socks-grid" className="section product-section">
        <div className="section-heading split">
          <div><p className="eyebrow">Shop Compression Socks</p><h2>Golf Compression Socks.</h2></div>
          <Link className="text-link" href="/golf-apparel">Golf Apparel &rarr;</Link>
        </div>
        {products.length
          ? <div className="product-grid">{products.map((p) => <ProductCard key={p.id} product={p} />)}</div>
          : <div className="care-step-grid">
              <Link href="/golf-compression-socks" className="care-step-card" style={{ textDecoration: 'none' }}><strong>Compression Socks 3-Pair — $28</strong><p>Walk round support, merino blend</p></Link>
            </div>
        }
      </section>

      <section className="section reveal" aria-labelledby="faq-heading">
        <div className="section-heading"><p className="eyebrow">Questions</p><h2 id="faq-heading">Golf Compression Socks FAQ.</h2></div>
        <div className="care-step-grid">
          {faqs.map(([q, a]) => (<div key={q} className="care-step-card"><strong>{q}</strong><p>{a}</p></div>))}
        </div>
      </section>

      <EmailCapture source="golf-compression-socks" campaign="golf_socks" title="Golf Compression Socks. Walk Round Ready." body="Join the WYX list for apparel picks and 10% off your first order with WYX10." />
    </>
  );
}
