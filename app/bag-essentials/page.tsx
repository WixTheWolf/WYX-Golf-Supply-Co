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
  title: "Golf Bag Essentials — The Six Accessories Every Bag Needs | WYX Golf Supply Co.",
  description: "The six golf bag essentials used every round — gloves, towel, ball markers, divot tool, ball retriever, and alignment sticks. Build the complete bag setup under $135. WYX10 saves 10%.",
  alternates: { canonical: '/bag-essentials' },
  openGraph: {
    title: "Golf Bag Essentials | WYX Golf Supply Co.",
    description: "The six accessories every golf bag needs — gloves, towel, markers, divot tool, retriever, alignment sticks. Under $135 complete. WYX10 saves 10%.",
    url: '/bag-essentials'
  }
};

const essentials = [
  { step: '01', label: 'Cabretta Glove 3-Pack', price: '$32', href: '/golf-gloves', why: 'Used every round. Three fresh gloves — one per three rounds — is the standard for consistent grip confidence all season. Without fresh gloves, grip pressure increases, tension builds, and ball-striking suffers.' },
  { step: '02', label: 'Clip-On Microfiber Towel', price: '$18', href: '/golf-towels', why: 'Used every hole. Carabiner clip, dual-sided — one side scrubs grooves, one side dries the face. The most-used accessory in the bag after the glove and the one most often missing.' },
  { step: '03', label: 'Hat Clip Ball Marker Set', price: '$16', href: '/golf-ball-markers', why: 'Used every green. Three magnetic markers and a hat clip — one-hand retrieval, always accessible, USGA-legal. The $16 purchase that eliminates the "searching the pocket for a marker" moment on every green.' },
  { step: '04', label: 'Magnetic Divot Tool', price: '$18', href: '/golf-divot-tools', why: 'Used every approach. A magnetic combo divot tool with a marker recessed in the head. Push-and-rotate technique heals pitch marks in 24 hours. Covers two greens-side needs in one bag slot.' },
  { step: '05', label: 'Golf Ball Retriever — 15 Foot', price: '$24', href: '/golf-ball-retriever', why: 'Used every water hazard. A 15-foot telescoping stainless retriever in the side pocket. The practical accessory that pays for itself in the first round with a water hazard.' },
  { step: '06', label: 'Alignment Sticks 2-Pack', price: '$24', href: '/golf-training-aids', why: 'Used every range session. Two sticks — ball position and target line. 10 minutes confirms aim before a single swing is taken. The training tool every tour pro uses that most amateurs have never tried.' }
];

const faqs: [string, string][] = [
  ['What should every golfer have in their bag?', 'Six essentials: glove 3-pack ($32), clip-on towel ($18), hat clip ball markers ($16), magnetic divot tool ($18), ball retriever ($24), alignment sticks ($24). Total: $132 before WYX10 — $119 with WYX10. All at wyxgolfsupply.com.'],
  ['What golf accessories do most golfers not have?', 'Ball retriever ($24) — most golfers skip it until they watch a ball roll into the pond on hole 3. Alignment sticks ($24) — most golfers aim 10-15 yards off-target without knowing. Magnetic divot tool ($18) — most golfers still use a tee or coin. Three items that produce immediate improvement.'],
  ['How do I build the complete golf bag setup?', 'Start with the six essentials in order of use frequency: gloves (every round), towel (every hole), ball markers (every green), divot tool (every approach), ball retriever (every water hazard), alignment sticks (every range session). Total: $132 before WYX10.']
];

const jsonLd = {
  '@context': 'https://schema.org', '@type': 'FAQPage',
  mainEntity: faqs.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } }))
};

function essentialScore(product: Awaited<ReturnType<typeof getProducts>>[number]) {
  let score = productQualityScore(product);
  if (/glove|towel|marker|divot|retriever|alignment/i.test(product.title)) score += 8;
  return score;
}

export default async function BagEssentialsPage() {
  const allProducts = availableProducts(await getProducts());
  const products = allProducts.sort((a, b) => essentialScore(b) - essentialScore(a)).slice(0, 10);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org', '@type': 'CollectionPage', name: 'Golf Bag Essentials', url: `${siteUrl}/bag-essentials`,
        breadcrumb: { '@type': 'BreadcrumbList', itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
          { '@type': 'ListItem', position: 2, name: 'Bag Essentials', item: `${siteUrl}/bag-essentials` }
        ]}
      }) }} />

      <section className="deal-hero">
        <div>
          <p className="eyebrow">Golf Bag Setup</p>
          <h1>Golf Bag Essentials. Six Items. One Complete Bag Setup.</h1>
          <p>Gloves, towel, ball markers, divot tool, ball retriever, and alignment sticks — the six accessories used at specific points in every round. Most golfers have three. These six together cost $132 before WYX10, and represent a complete functional bag setup for the first time.</p>
          <div className="actions">
            <Link className="button primary" href="#essentials-grid">Build the Complete Setup</Link>
            <Link className="button secondary dark" href="/golf-accessories-every-golfer-needs">Full Accessories Guide &rarr;</Link>
          </div>
          <p style={{ marginTop: '1rem', fontSize: '0.875rem', opacity: 0.8 }}>Use <strong>WYX10</strong> at checkout for 10% off — makes the complete setup $119.</p>
        </div>
        <aside className="share-card">
          <p className="eyebrow">Most Overlooked Essential</p>
          <h2>Ball Retriever</h2>
          <p>$24. Golfers skip it until the pond swallows a ball on hole 3 of an unfamiliar course. 15-foot telescoping stainless retriever. Collapses to 26 inches for the side pocket. The essential that pays for itself in round 1.</p>
          <Link className="button primary" href="/golf-ball-retriever" style={{ marginTop: '1rem', display: 'inline-block' }}>See the Retriever &rarr;</Link>
        </aside>
      </section>

      <section className="deal-strip" aria-label="Bag essentials highlights">
        <span>Six items, complete setup</span><span>$132 before WYX10</span><span>WYX10 saves 10%</span><span>Ships in 1-3 days</span>
      </section>

      <section className="section reveal" aria-labelledby="essentials-heading">
        <div className="section-heading"><p className="eyebrow">Six Essentials</p><h2 id="essentials-heading">Golf Bag Essentials. In Order of Use.</h2></div>
        <div className="care-step-grid">
          {essentials.map((e) => (
            <Link key={e.label} href={e.href} className="care-step-card" style={{ textDecoration: 'none' }}>
              <small style={{ opacity: 0.6, fontWeight: 600, display: 'block' }}>{e.step}</small>
              <strong>{e.label} — {e.price}</strong><p>{e.why}</p>
            </Link>
          ))}
        </div>
      </section>

      <section id="essentials-grid" className="section product-section">
        <div className="section-heading split">
          <div><p className="eyebrow">Shop Bag Essentials</p><h2>Golf Bag Essentials.</h2></div>
          <Link className="text-link" href="/golf-bag-accessories">All Bag Accessories &rarr;</Link>
        </div>
        {products.length
          ? <div className="product-grid">{products.map((p) => <ProductCard key={p.id} product={p} />)}</div>
          : <div className="care-step-grid">
              <Link href="/golf-gloves" className="care-step-card" style={{ textDecoration: 'none' }}><strong>Glove 3-Pack — $32</strong><p>Every round</p></Link>
              <Link href="/golf-towels" className="care-step-card" style={{ textDecoration: 'none' }}><strong>Microfiber Towel — $18</strong><p>Every hole</p></Link>
              <Link href="/golf-ball-markers" className="care-step-card" style={{ textDecoration: 'none' }}><strong>Ball Markers — $16</strong><p>Every green</p></Link>
              <Link href="/golf-ball-retriever" className="care-step-card" style={{ textDecoration: 'none' }}><strong>Ball Retriever — $24</strong><p>Every water hazard</p></Link>
            </div>
        }
      </section>

      <section className="section reveal" aria-labelledby="faq-heading">
        <div className="section-heading"><p className="eyebrow">Questions</p><h2 id="faq-heading">Golf Bag Essentials FAQ.</h2></div>
        <div className="care-step-grid">
          {faqs.map(([q, a]) => (<div key={q} className="care-step-card"><strong>{q}</strong><p>{a}</p></div>))}
        </div>
      </section>

      <EmailCapture source="bag-essentials" campaign="bag_essentials" title="Six Items. One Complete Golf Bag Setup." body="Join the WYX list for bag setup guides and 10% off your first order with WYX10." />
    </>
  );
}
