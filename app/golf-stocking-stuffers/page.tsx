import type { Metadata } from 'next';
import Link from 'next/link';
import { EmailCapture } from '@/components/EmailCapture';
import { ProductCard } from '@/components/ProductCard';
import { availableProducts } from '@/lib/catalog';
import { productPrice, siteUrl } from '@/lib/feed';
import { productQualityScore } from '@/lib/productQuality';
import { getProducts } from '@/lib/shopify/products';

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Golf Stocking Stuffers — Practical Picks Under $30 | WYX Golf Supply Co.",
  description: "Golf stocking stuffers that actually get used — ball markers, microfiber towels, alignment sticks, gloves, hat clips. All under $35. WYX10 saves 10%.",
  alternates: { canonical: '/golf-stocking-stuffers' },
  openGraph: {
    title: "Golf Stocking Stuffers | WYX Golf Supply Co.",
    description: "Golf stocking stuffers under $35 that earn a bag spot — ball markers, towels, gloves, alignment sticks. WYX10 saves 10%.",
    url: '/golf-stocking-stuffers'
  }
};

const stuffers = [
  { label: 'Hat Clip Ball Marker Set — 3 Markers', price: '$16', href: '/golf-ball-markers', why: '3 magnetic markers + magnetic hat clip. One-hand retrieval, USGA-compliant, brushed aluminum. The $16 stocking stuffer that upgrades every round permanently.' },
  { label: 'Clip-On Microfiber Towel', price: '$18', href: '/golf-towels', why: 'Used every hole. Carabiner clip, dual-sided microfiber. The bag essential that gets used every round — impossible to have too many.' },
  { label: 'Golf Arm Sleeves UPF 50+', price: '$22', href: '/golf-arm-sleeves', why: 'A pair of UPF 50+ arm sleeves with moisture-wicking compression. The summer golf stocking stuffer — in the bag whenever the sun is out.' },
  { label: 'Alignment Sticks 2-Pack', price: '$24', href: '/golf-training-aids', why: 'The training tool every instructor uses. Two sticks, 10 minutes at the range. He or she will use these every session and wonder why they waited.' },
  { label: 'Golf Ball Retriever', price: '$24', href: '/golf-ball-retriever', why: '15-foot telescoping stainless retriever. Collapses to 26 inches. The stocking stuffer with an ROI payable in recovered balls within one round.' },
  { label: 'Cabretta Glove 3-Pack', price: '$32', href: '/golf-gloves', why: 'Three fresh cabretta gloves — the consumable stocking stuffer that gets used within one round. The most practical golf gift under $35.' }
];

const faqs: [string, string][] = [
  ['What are the best golf stocking stuffers?', 'The best golf stocking stuffers are small, practical, and used every round: hat clip ball marker set ($16), microfiber towel ($18), alignment sticks ($24), ball retriever ($24), glove 3-pack ($32). All available at wyxgolfsupply.com with WYX10 for 10% off.'],
  ['What golf stocking stuffer has no size risk?', 'Ball markers ($16), towels ($18), arm sleeves ($22), alignment sticks ($24), and ball retrievers ($24) are all completely size-free. Gloves require a size — pick ML for most men, M for women.'],
  ['How many golf stocking stuffers should I buy?', 'Two or three small picks stack well: a towel ($18) + alignment sticks ($24) + ball marker set ($16) = $58 total, or about $52 with WYX10. The three gifts cover the three things a golfer uses every single round.']
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

function stufferScore(product: Awaited<ReturnType<typeof getProducts>>[number]) {
  const price = Number(productPrice(product).amount);
  if (price > 35) return 0;
  let score = productQualityScore(product);
  if (/marker|towel|alignment|retriever|glove|arm sleeve/i.test(product.title)) score += 8;
  if (price <= 20) score += 5;
  return score;
}

export default async function GolfStockingStuffersPage() {
  const allProducts = availableProducts(await getProducts());
  const products = allProducts
    .filter((p) => Number(productPrice(p).amount) <= 35)
    .sort((a, b) => stufferScore(b) - stufferScore(a))
    .slice(0, 10);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: 'Golf Stocking Stuffers',
        url: `${siteUrl}/golf-stocking-stuffers`,
        breadcrumb: {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
            { '@type': 'ListItem', position: 2, name: 'Golf Gifts', item: `${siteUrl}/golf-gifts` },
            { '@type': 'ListItem', position: 3, name: 'Golf Stocking Stuffers', item: `${siteUrl}/golf-stocking-stuffers` }
          ]
        }
      }) }} />

      <section className="deal-hero">
        <div>
          <p className="eyebrow">Golf Stocking Stuffers</p>
          <h1>Golf Stocking Stuffers Under $35. Used Every Round, Not Just Christmas Morning.</h1>
          <p>Six practical picks from $16 to $32 — the accessories a golfer uses every single round and never thinks to buy for themselves. Stack two or three for the perfect golf stocking this holiday season.</p>
          <div className="actions">
            <Link className="button primary" href="#stuffers-grid">Shop Stocking Stuffers</Link>
            <Link className="button secondary dark" href="/golf-gifts-under-25">Under $25 Golf Gifts &rarr;</Link>
          </div>
          <p style={{ marginTop: '1rem', fontSize: '0.875rem', opacity: 0.8 }}>
            Use <strong>WYX10</strong> at checkout for 10% off every order.
          </p>
        </div>
        <aside className="share-card">
          <p className="eyebrow">Best Stocking Stuffer Under $20</p>
          <h2>Microfiber Clip-On Towel</h2>
          <p>$18. Used every hole of every round. Carabiner clip attaches to any bag. Dual-sided microfiber. The most-used golf accessory that most golfers never replace — until someone gives it to them.</p>
          <Link className="button primary" href="/golf-towels" style={{ marginTop: '1rem', display: 'inline-block' }}>See the Towel &rarr;</Link>
        </aside>
      </section>

      <section className="deal-strip" aria-label="Golf stocking stuffer highlights">
        <span>All under $35</span>
        <span>Used every round</span>
        <span>WYX10 saves 10%</span>
        <span>Ships in 1-3 days</span>
      </section>

      <section className="section reveal" aria-labelledby="picks-heading">
        <div className="section-heading">
          <p className="eyebrow">Six Picks</p>
          <h2 id="picks-heading">Golf Stocking Stuffers. All Under $35.</h2>
        </div>
        <div className="care-step-grid">
          {stuffers.map((s) => (
            <Link key={s.label} href={s.href} className="care-step-card" style={{ textDecoration: 'none' }}>
              <strong>{s.label} — {s.price}</strong>
              <p>{s.why}</p>
            </Link>
          ))}
        </div>
      </section>

      <section id="stuffers-grid" className="section product-section">
        <div className="section-heading">
          <p className="eyebrow">Shop Now</p>
          <h2>Golf Stocking Stuffers Under $35.</h2>
        </div>
        {products.length
          ? <div className="product-grid">{products.map((p) => <ProductCard key={p.id} product={p} />)}</div>
          : (
            <div className="care-step-grid">
              <Link href="/golf-ball-markers" className="care-step-card" style={{ textDecoration: 'none' }}><strong>Hat Clip Markers — $16</strong><p>3 magnetic markers + hat clip</p></Link>
              <Link href="/golf-towels" className="care-step-card" style={{ textDecoration: 'none' }}><strong>Microfiber Towel — $18</strong><p>Used every hole</p></Link>
              <Link href="/golf-training-aids" className="care-step-card" style={{ textDecoration: 'none' }}><strong>Alignment Sticks — $24</strong><p>Every range session</p></Link>
              <Link href="/golf-gloves" className="care-step-card" style={{ textDecoration: 'none' }}><strong>Glove 3-Pack — $32</strong><p>Used every round</p></Link>
            </div>
          )
        }
      </section>

      <section className="section reveal" aria-labelledby="faq-heading">
        <div className="section-heading">
          <p className="eyebrow">Questions</p>
          <h2 id="faq-heading">Golf Stocking Stuffer FAQ.</h2>
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
        source="golf-stocking-stuffers"
        campaign="golf_stocking_stuffers"
        title="Golf Stocking Stuffers. Practical. Used Every Round."
        body="Join the WYX list for holiday gift guides, new products, and 10% off your first order with WYX10."
      />
    </>
  );
}
