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
  title: "Golf Apparel — Performance Hats, Arm Sleeves & Golf Belts | WYX Golf Supply Co.",
  description: "Golf apparel that works on the course — performance hats, UPF arm sleeves, compression socks, and the apparel accessories that make rounds more comfortable. WYX10 saves 10%.",
  alternates: { canonical: '/golf-apparel' },
  openGraph: {
    title: "Golf Apparel | WYX Golf Supply Co.",
    description: "Golf apparel for the course — performance hats, arm sleeves, compression socks, golf belts. WYX10 saves 10%.",
    url: '/golf-apparel'
  }
};

const picks = [
  { label: 'Performance Golf Hat', price: '$28', href: '/golf-hats', tag: 'Most Popular', why: 'UPF 30+ structured 5-panel cap with moisture-wicking sweatband. Adjustable closure fits all head sizes. Machine washable. The golf hat worn more rounds than any other format on any course dress code.' },
  { label: 'Arm Sleeves UPF 50+', price: '$22', href: '/golf-arm-sleeves', tag: 'Sun Protection', why: 'UPF 50+ compression sleeves for the full forearm and back of hand. Moisture-wicking, never sweats off, machine washable. The summer round apparel essential that replaces sunscreen application for every round.' },
  { label: 'Compression Sock Set — 3 Pairs', price: '$28', href: '/golf-apparel', tag: 'Walk Rounds', why: 'Three pairs of graduated compression golf socks — arch support, moisture-wicking, cushioned sole. For golfers walking 36 holes. The apparel upgrade that makes the back nine feel like the front nine.' },
  { label: 'Golf Belt — Stretch Fabric', price: '$24', href: '/golf-belts', tag: 'Course Essential', why: 'Stretch fabric golf belt with a ratchet micro-adjust buckle. No holes, infinite adjustment within the range, fits any golf pant waist. The belt that stays in place through a full swing without the bulk of a leather dress belt.' }
];

const faqs: [string, string][] = [
  ['What golf apparel do I need?', 'Four picks: performance hat ($28 — UPF 30+), arm sleeves ($22 — full-round sun protection), compression socks ($28 — walk round support), golf belt ($24 — micro-adjust for any swing). All at wyxgolfsupply.com with WYX10 for 10% off.'],
  ['Is golf apparel different from regular clothing?', 'Performance golf apparel is moisture-wicking, UPF-rated, and stretch-flexible for full swing motion. Standard athletic wear handles most of this — but golf-specific items like compression socks and stretch belts address needs that generic athletic apparel misses.'],
  ['What golf apparel gift is safe to buy?', 'Arm sleeves ($22 — one size fits most) and a golf belt ($24 — ratchet micro-adjust, no size guessing) are the two safest golf apparel gifts. The hat ($28) is adjustable-back and fits most adults. Compression socks require a size — skip if unknown.']
];

const jsonLd = {
  '@context': 'https://schema.org', '@type': 'FAQPage',
  mainEntity: faqs.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } }))
};

function apparelScore(product: Awaited<ReturnType<typeof getProducts>>[number]) {
  let score = productQualityScore(product);
  if (/hat|arm sleeve|sock|belt|apparel/i.test(product.title)) score += 8;
  if (/apparel|clothing/i.test(product.productType ?? '')) score += 5;
  return score;
}

export default async function GolfApparelPage() {
  const allProducts = availableProducts(await getProducts());
  const products = allProducts.sort((a, b) => apparelScore(b) - apparelScore(a)).slice(0, 10);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org', '@type': 'CollectionPage', name: 'Golf Apparel', url: `${siteUrl}/golf-apparel`,
        breadcrumb: { '@type': 'BreadcrumbList', itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
          { '@type': 'ListItem', position: 2, name: 'Golf Apparel', item: `${siteUrl}/golf-apparel` }
        ]}
      }) }} />

      <section className="deal-hero">
        <div>
          <p className="eyebrow">Golf Apparel</p>
          <h1>Golf Apparel. Hats, Arm Sleeves, Socks &amp; Belts.</h1>
          <p>Performance golf apparel that works on the course — UPF hats and arm sleeves for sun management, compression socks for walk rounds, and stretch belts that stay through a full swing. Under $30 each. WYX10 saves 10%.</p>
          <div className="actions">
            <Link className="button primary" href="#apparel-grid">Shop Golf Apparel</Link>
            <Link className="button secondary dark" href="/golf-summer-gear">Summer Gear &rarr;</Link>
          </div>
          <p style={{ marginTop: '1rem', fontSize: '0.875rem', opacity: 0.8 }}>Use <strong>WYX10</strong> at checkout for 10% off every order.</p>
        </div>
        <aside className="share-card">
          <p className="eyebrow">Most Popular Apparel</p>
          <h2>Performance Golf Hat</h2>
          <p>$28. UPF 30+, moisture-wicking sweatband, structured 5-panel. Adjustable back. Machine washable. The golf hat worn more rounds than any other format — fits every course dress code.</p>
          <Link className="button primary" href="/golf-hats" style={{ marginTop: '1rem', display: 'inline-block' }}>See Golf Hats &rarr;</Link>
        </aside>
      </section>

      <section className="deal-strip" aria-label="Golf apparel highlights">
        <span>UPF sun protection</span><span>Compression socks for walk rounds</span><span>Micro-adjust belts</span><span>WYX10 saves 10%</span>
      </section>

      <section className="section reveal" aria-labelledby="picks-heading">
        <div className="section-heading"><p className="eyebrow">Four Apparel Picks</p><h2 id="picks-heading">Golf Apparel.</h2></div>
        <div className="care-step-grid">
          {picks.map((p) => (
            <Link key={p.label} href={p.href} className="care-step-card" style={{ textDecoration: 'none' }}>
              <small style={{ opacity: 0.6, fontWeight: 600, display: 'block' }}>{p.tag}</small>
              <strong>{p.label} — {p.price}</strong><p>{p.why}</p>
            </Link>
          ))}
        </div>
      </section>

      <section id="apparel-grid" className="section product-section">
        <div className="section-heading split">
          <div><p className="eyebrow">Shop Golf Apparel</p><h2>Golf Apparel.</h2></div>
          <Link className="text-link" href="/golf-hats">Golf Hats &rarr;</Link>
        </div>
        {products.length
          ? <div className="product-grid">{products.map((p) => <ProductCard key={p.id} product={p} />)}</div>
          : <div className="care-step-grid">
              <Link href="/golf-hats" className="care-step-card" style={{ textDecoration: 'none' }}><strong>Performance Hat — $28</strong><p>UPF 30+, all dress codes</p></Link>
              <Link href="/golf-arm-sleeves" className="care-step-card" style={{ textDecoration: 'none' }}><strong>Arm Sleeves — $22</strong><p>UPF 50+, never sweats off</p></Link>
              <Link href="/golf-apparel" className="care-step-card" style={{ textDecoration: 'none' }}><strong>Compression Socks 3-Pair — $28</strong><p>Walk round support</p></Link>
              <Link href="/golf-belts" className="care-step-card" style={{ textDecoration: 'none' }}><strong>Stretch Belt — $24</strong><p>Micro-adjust, swing-friendly</p></Link>
            </div>
        }
      </section>

      <section className="section reveal" aria-labelledby="faq-heading">
        <div className="section-heading"><p className="eyebrow">Questions</p><h2 id="faq-heading">Golf Apparel FAQ.</h2></div>
        <div className="care-step-grid">
          {faqs.map(([q, a]) => (<div key={q} className="care-step-card"><strong>{q}</strong><p>{a}</p></div>))}
        </div>
      </section>

      <EmailCapture source="golf-apparel" campaign="golf_apparel" title="Golf Apparel Built for the Course." body="Join the WYX list for apparel picks, sun protection guides, and 10% off your first order with WYX10." />
    </>
  );
}
