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
  title: "Golf Training Aids — Alignment Sticks, Putting Mat, Chipping Net & More | WYX Golf Supply Co.",
  description: "Golf training aids that produce real improvement — alignment sticks, backyard chipping net, 9-foot putting mat, and the folding alignment mirror. All under $55. WYX10 saves 10%.",
  alternates: { canonical: '/golf-training-aids' },
  openGraph: {
    title: "Golf Training Aids | WYX Golf Supply Co.",
    description: "Golf training aids that build real habits — alignment sticks, chipping net, putting mat, alignment mirror. Under $55. WYX10 saves 10%.",
    url: '/golf-training-aids'
  }
};

const aids = [
  {
    label: 'Alignment Sticks 2-Pack',
    price: '$24',
    href: '/golf-training-aids',
    why: 'The training tool every instructor uses and almost no amateur owns. Two sticks — one for ball position, one for target line. 10 minutes before every range session confirms aim before a single swing is taken. The fastest improvement available at any price.',
    improvement: 'Aim & Alignment'
  },
  {
    label: 'Backyard Chipping Net 4-Target',
    price: '$44',
    href: '/golf-training-aids',
    why: 'Four targets, folds flat in 60 seconds. 20 minutes in the backyard before dinner. Removes the "drive to a range" barrier for short game practice. The short game repetition that produces more score improvement than additional range time.',
    improvement: 'Short Game'
  },
  {
    label: 'Putting Mat — 9-Foot Velvet',
    price: '$54',
    href: '/golf-putting-mat',
    why: 'Dual alignment channels, auto-return mechanism, regulation 4.25-inch cup. 10 minutes before dinner. The home putting studio that produces visible handicap improvement within a week. 40% of strokes come on the green — this is where most improvement lives.',
    improvement: 'Putting'
  },
  {
    label: 'Putting Alignment Mirror',
    price: '$32',
    href: '/golf-training-aids',
    why: 'Shows eye position, shoulder line, and putter path simultaneously — the same setup check tour coaches use on every putting green. Folds to wallet size. The putting feedback tool that most golfers have never used and every scratch golfer has.',
    improvement: 'Putting Setup'
  }
];

const faqs: [string, string][] = [
  ['What are the most effective golf training aids?', 'Alignment sticks ($24 — fastest improvement for any golfer by fixing aim before fixing swing), putting mat ($54 — 40% of strokes happen on the green), backyard chipping net ($44 — short game practice at home builds the habit), putting alignment mirror ($32 — objective setup feedback). All available at wyxgolfsupply.com with WYX10 for 10% off.'],
  ['What golf training aid works at home?', 'The putting mat ($54) and backyard chipping net ($44) are the two home training aids that produce real course improvement. The putting mat rolls up for storage; the chipping net folds flat in 60 seconds. Together ($98 before WYX10) they cover the two highest-ROI practice areas in golf — putting and short game.'],
  ['What training aid is the best gift for a golfer?', 'Alignment sticks ($24) are the best gift under $25 — used every range session from day one. The putting mat ($54) is the best gift under $60 — used nightly and produces visible handicap improvement within weeks. The chipping net ($44) is the best gift for the golfer with a backyard.']
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

function trainingScore(product: Awaited<ReturnType<typeof getProducts>>[number]) {
  let score = productQualityScore(product);
  if (/alignment|chipping net|putting mat|putting mirror|training/i.test(product.title)) score += 10;
  if (/training aid/i.test(product.productType ?? '')) score += 5;
  return score;
}

export default async function GolfTrainingAidsPage() {
  const allProducts = availableProducts(await getProducts());
  const products = allProducts
    .sort((a, b) => trainingScore(b) - trainingScore(a))
    .slice(0, 10);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: 'Golf Training Aids',
        url: `${siteUrl}/golf-training-aids`,
        breadcrumb: {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
            { '@type': 'ListItem', position: 2, name: 'Golf Training Aids', item: `${siteUrl}/golf-training-aids` }
          ]
        }
      }) }} />

      <section className="deal-hero">
        <div>
          <p className="eyebrow">Golf Practice Gear</p>
          <h1>Golf Training Aids That Produce Real Improvement.</h1>
          <p>Four aids, four improvement areas — aim and alignment, short game, putting, putting setup. Under $55 each. These are the tools that build the daily practice habits that produce visible score improvement within two weeks of consistent use.</p>
          <div className="actions">
            <Link className="button primary" href="#training-grid">Shop Training Aids</Link>
            <Link className="button secondary dark" href="/golf-putting-mat">See the Putting Mat &rarr;</Link>
          </div>
          <p style={{ marginTop: '1rem', fontSize: '0.875rem', opacity: 0.8 }}>
            Use <strong>WYX10</strong> at checkout for 10% off every order.
          </p>
        </div>
        <aside className="share-card">
          <p className="eyebrow">Most-Used Training Aid</p>
          <h2>Alignment Sticks</h2>
          <p>$24. Every tour pro uses these. Almost no amateur does. Two sticks, 10 minutes, target line confirmed. The fastest range improvement available at any price point.</p>
          <Link className="button primary" href="#training-grid" style={{ marginTop: '1rem', display: 'inline-block' }}>See All Training Aids &rarr;</Link>
        </aside>
      </section>

      <section className="deal-strip" aria-label="Golf training aids highlights">
        <span>Aim &amp; alignment</span>
        <span>Short game home practice</span>
        <span>Putting improvement</span>
        <span>WYX10 saves 10%</span>
      </section>

      <section className="section reveal" aria-labelledby="aids-heading">
        <div className="section-heading">
          <p className="eyebrow">Four Aids, Four Improvement Areas</p>
          <h2 id="aids-heading">Golf Training Aids That Work.</h2>
        </div>
        <div className="care-step-grid">
          {aids.map((aid) => (
            <Link key={aid.label} href={aid.href} className="care-step-card" style={{ textDecoration: 'none' }}>
              <small style={{ opacity: 0.6, fontWeight: 600, display: 'block' }}>{aid.improvement}</small>
              <strong>{aid.label} — {aid.price}</strong>
              <p>{aid.why}</p>
            </Link>
          ))}
        </div>
      </section>

      <section id="training-grid" className="section product-section">
        <div className="section-heading split">
          <div>
            <p className="eyebrow">Shop Training Aids</p>
            <h2>Golf Training Aids.</h2>
          </div>
          <Link className="text-link" href="/golf-practice-gear">All Practice Gear &rarr;</Link>
        </div>
        {products.length
          ? <div className="product-grid">{products.map((p) => <ProductCard key={p.id} product={p} />)}</div>
          : (
            <div className="care-step-grid">
              <Link href="/golf-training-aids" className="care-step-card" style={{ textDecoration: 'none' }}><strong>Alignment Sticks — $24</strong><p>Every range session</p></Link>
              <Link href="/golf-training-aids" className="care-step-card" style={{ textDecoration: 'none' }}><strong>Chipping Net — $44</strong><p>Backyard short game practice</p></Link>
              <Link href="/golf-putting-mat" className="care-step-card" style={{ textDecoration: 'none' }}><strong>Putting Mat — $54</strong><p>10 minutes before dinner</p></Link>
              <Link href="/golf-training-aids" className="care-step-card" style={{ textDecoration: 'none' }}><strong>Alignment Mirror — $32</strong><p>Tour-standard putting setup</p></Link>
            </div>
          )
        }
      </section>

      <section className="section reveal" aria-labelledby="faq-heading">
        <div className="section-heading">
          <p className="eyebrow">Questions</p>
          <h2 id="faq-heading">Golf Training Aids FAQ.</h2>
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
        source="golf-training-aids"
        campaign="golf_training_aids"
        title="Golf Training Aids That Build Real Habits."
        body="Join the WYX list for practice guides, new training aids, and 10% off your first order with WYX10."
      />
    </>
  );
}
