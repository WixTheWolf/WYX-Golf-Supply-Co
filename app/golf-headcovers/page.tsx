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
  title: "Golf Headcovers — Driver, Fairway & Iron Headcovers | WYX Golf Supply Co.",
  description: "Golf headcovers for drivers, fairways, and irons — neoprene iron sets, knit driver covers, and fairway pairs that protect clubs in transit and the bag. WYX10 saves 10%.",
  alternates: { canonical: '/golf-headcovers' },
  openGraph: {
    title: "Golf Headcovers | WYX Golf Supply Co.",
    description: "Golf headcovers for drivers, fairways, and iron sets — protection in transit. WYX10 saves 10%.",
    url: '/golf-headcovers'
  }
};

const picks = [
  { label: 'Iron Head Cover Set — 4-Piece', price: '$34', href: '/golf-headcovers', tag: 'Iron Protection', why: 'Four neoprene iron covers for irons 3-6 — the clubs most likely to clank against each other in transit. Numbered with easy-pull tabs. The iron protection accessory for golfers who travel with their clubs or carry without an organizer bag.' },
  { label: 'Driver Headcover — Knit Sock Style', price: '$18', href: '/golf-headcovers', tag: 'Driver Cover', why: 'Knit sock-style driver cover with magnetic ball marker in the pom. Fits any standard 460cc driver head. The universal driver cover replacement — practical, flexible, and a cleaner look than most factory covers.' },
  { label: 'Fairway Wood Covers — Matched Set', price: '$28', href: '/golf-headcovers', tag: 'Fairway Set', why: 'Matching numbered neoprene covers for 3-wood and 5-wood. The fairway set that makes the bag look intentional rather than assembled over time from mismatched accessories.' }
];

const faqs: [string, string][] = [
  ['What are golf headcovers for?', 'Club head protection during transit and in the bag — prevents shaft damage from club-on-club impact and protects the club face from scratches during travel. Iron headcover sets ($34 for 4-piece) and driver covers ($18) are the most common types. Available at wyxgolfsupply.com with WYX10 for 10% off.'],
  ['Do I need iron headcovers?', 'For travel: yes. Irons clanking together in transit can damage shaft coatings and club faces over thousands of impacts per trip. A 4-piece neoprene set ($34) covers the four most at-risk long irons. For cart rounds at the home course: optional.'],
  ['What is a good golf headcover gift?', 'A driver headcover ($18) — fits any standard 460cc driver, universally needed, inexpensive. The iron set ($34) is the better gift for golfers who travel with their clubs or play frequently enough to care about club condition.']
];

const jsonLd = {
  '@context': 'https://schema.org', '@type': 'FAQPage',
  mainEntity: faqs.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } }))
};

function headcoverScore(product: Awaited<ReturnType<typeof getProducts>>[number]) {
  let score = productQualityScore(product);
  if (/headcover|head cover/i.test(product.title)) score += 15;
  return score;
}

export default async function GolfHeadcoversPage() {
  const allProducts = availableProducts(await getProducts());
  const products = allProducts.sort((a, b) => headcoverScore(b) - headcoverScore(a)).slice(0, 10);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org', '@type': 'CollectionPage', name: 'Golf Headcovers', url: `${siteUrl}/golf-headcovers`,
        breadcrumb: { '@type': 'BreadcrumbList', itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
          { '@type': 'ListItem', position: 2, name: 'Golf Headcovers', item: `${siteUrl}/golf-headcovers` }
        ]}
      }) }} />

      <section className="deal-hero">
        <div>
          <p className="eyebrow">Golf Headcovers</p>
          <h1>Golf Headcovers. Driver, Fairway &amp; Iron Protection.</h1>
          <p>Driver covers, iron 4-piece sets, and matched fairway pairs — club protection that matters most during travel and long days when the bag is loaded and unloaded repeatedly. Under $35 each. WYX10 saves 10%.</p>
          <div className="actions">
            <Link className="button primary" href="#covers-grid">Shop Headcovers</Link>
            <Link className="button secondary dark" href="/golf-travel-bag">Golf Travel Bag &rarr;</Link>
          </div>
          <p style={{ marginTop: '1rem', fontSize: '0.875rem', opacity: 0.8 }}>Use <strong>WYX10</strong> at checkout for 10% off every order.</p>
        </div>
        <aside className="share-card">
          <p className="eyebrow">Iron Set Protection</p>
          <h2>4-Piece Iron Cover Set</h2>
          <p>$34. Neoprene covers for irons 3-6. Easy-pull tabs, numbered. The iron protection pick for golfers who travel or carry without an organizer bag.</p>
          <Link className="button primary" href="#covers-grid" style={{ marginTop: '1rem', display: 'inline-block' }}>Shop Headcovers &rarr;</Link>
        </aside>
      </section>

      <section className="deal-strip" aria-label="Headcover highlights">
        <span>Driver covers — $18</span><span>Iron 4-piece sets — $34</span><span>Fairway matched sets — $28</span><span>WYX10 saves 10%</span>
      </section>

      <section className="section reveal" aria-labelledby="picks-heading">
        <div className="section-heading"><p className="eyebrow">Three Picks</p><h2 id="picks-heading">Golf Headcovers.</h2></div>
        <div className="care-step-grid">
          {picks.map((p) => (
            <Link key={p.label} href={p.href} className="care-step-card" style={{ textDecoration: 'none' }}>
              <small style={{ opacity: 0.6, fontWeight: 600, display: 'block' }}>{p.tag}</small>
              <strong>{p.label} — {p.price}</strong><p>{p.why}</p>
            </Link>
          ))}
        </div>
      </section>

      <section id="covers-grid" className="section product-section">
        <div className="section-heading split">
          <div><p className="eyebrow">Shop Headcovers</p><h2>Golf Headcovers.</h2></div>
          <Link className="text-link" href="/golf-bag-accessories">Bag Accessories &rarr;</Link>
        </div>
        {products.length
          ? <div className="product-grid">{products.map((p) => <ProductCard key={p.id} product={p} />)}</div>
          : <div className="care-step-grid">
              <Link href="/golf-headcovers" className="care-step-card" style={{ textDecoration: 'none' }}><strong>Iron Set 4-Piece — $34</strong><p>Neoprene, numbered</p></Link>
              <Link href="/golf-headcovers" className="care-step-card" style={{ textDecoration: 'none' }}><strong>Driver Cover — $18</strong><p>Knit sock, 460cc fit</p></Link>
              <Link href="/golf-headcovers" className="care-step-card" style={{ textDecoration: 'none' }}><strong>Fairway Set — $28</strong><p>3-wood + 5-wood matched</p></Link>
            </div>
        }
      </section>

      <section className="section reveal" aria-labelledby="faq-heading">
        <div className="section-heading"><p className="eyebrow">Questions</p><h2 id="faq-heading">Golf Headcover FAQ.</h2></div>
        <div className="care-step-grid">
          {faqs.map(([q, a]) => (<div key={q} className="care-step-card"><strong>{q}</strong><p>{a}</p></div>))}
        </div>
      </section>

      <EmailCapture source="golf-headcovers" campaign="golf_headcovers" title="Golf Headcovers for Every Club." body="Join the WYX list for gear picks and 10% off your first order with WYX10." />
    </>
  );
}
