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
  title: "Golf Training Aids for Beginners — 4 Tools That Fix the Fundamentals | WYX Golf Supply Co.",
  description: "Golf training aids for beginners — alignment sticks, putting mat, chipping net, and putting mirror. Four tools that fix the four fundamentals most beginners get wrong. Under $60 each. WYX10 saves 10%.",
  alternates: { canonical: '/golf-training-aids-for-beginners' },
  openGraph: {
    title: "Golf Training Aids for Beginners | WYX Golf Supply Co.",
    description: "Four golf training aids for beginners — alignment sticks, putting mat, chipping net, putting mirror. Fix the fundamentals under $60. WYX10 saves 10%.",
    url: '/golf-training-aids-for-beginners'
  }
};

const picks = [
  { label: 'Alignment Sticks 2-Pack', price: '$24', href: '/golf-training-aids', tag: 'Start Here', why: 'Two sticks — one for ball position, one for target line. 90% of beginners aim 10-15 yards left or right of their target without knowing it. Ten minutes of alignment stick work before a range session confirms aim before a single swing is taken. Tour pros use these every session; beginners almost never do.' },
  { label: 'Putting Mat — 9 Foot', price: '$48', href: '/golf-practice-gear', tag: 'Indoor Practice', why: 'A 9-foot indoor putting mat eliminates the need to drive to the course for putting practice. 20 minutes of daily home practice at 3-6 foot range produces measurable improvement in 30 days. Beginners lose 40% of their strokes on and around the green — the putting mat addresses the highest-ROI skill area.' },
  { label: 'Chipping Net — Foldable', price: '$38', href: '/golf-practice-gear', tag: 'Short Game', why: 'A foldable chipping net for backyard practice. The chipping motion (short swing, descending strike, clean contact) is the beginner skill that produces the fastest visible scoring improvement. 15 minutes of backyard chip shots 3x per week vs. a range session produces better scoring results for most beginners.' },
  { label: 'Putting Alignment Mirror', price: '$32', href: '/golf-training-aids', tag: 'Technique Aid', why: 'A mirror with alignment lines that shows face angle, eye position over the ball, and stroke path simultaneously — things no human coach can see in real time without video. The training aid that replaces hours of putting lessons for beginners who set up incorrectly without knowing it.' }
];

const faqs: [string, string][] = [
  ['What are the best golf training aids for beginners?', 'Four picks in order: alignment sticks ($24 — aim), putting mat ($48 — stroke volume), chipping net ($38 — short game), putting mirror ($32 — technique). Total: $142 before WYX10. The four tools that fix the four fundamentals most beginners get wrong. All at wyxgolfsupply.com.'],
  ['Do golf training aids actually help beginners?', 'Yes — alignment sticks and a putting mirror provide feedback that the human eye cannot give. A beginner can practice for months with a fundamentally incorrect aim or putting setup and never detect it without an alignment aid. These tools make the correct position visible and repeatable.'],
  ['What should a beginner golfer practice first?', 'Aim (alignment sticks — 10 minutes before every range session) and putting (putting mat — 20 minutes daily). Beginners lose more strokes to aim errors and missed short putts than to swing technique errors. Fix those two first, then add chipping (net) and putting technique (mirror).']
];

const jsonLd = {
  '@context': 'https://schema.org', '@type': 'FAQPage',
  mainEntity: faqs.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } }))
};

function beginnerTrainingScore(product: Awaited<ReturnType<typeof getProducts>>[number]) {
  let score = productQualityScore(product);
  if (/alignment|putting mat|chipping net|training/i.test(product.title)) score += 12;
  return score;
}

export default async function GolfTrainingAidsForBeginnersPage() {
  const allProducts = availableProducts(await getProducts());
  const products = allProducts.sort((a, b) => beginnerTrainingScore(b) - beginnerTrainingScore(a)).slice(0, 10);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org', '@type': 'CollectionPage', name: 'Golf Training Aids for Beginners', url: `${siteUrl}/golf-training-aids-for-beginners`,
        breadcrumb: { '@type': 'BreadcrumbList', itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
          { '@type': 'ListItem', position: 2, name: 'Golf Training Aids for Beginners', item: `${siteUrl}/golf-training-aids-for-beginners` }
        ]}
      }) }} />

      <section className="deal-hero">
        <div>
          <p className="eyebrow">Beginner Golf Training</p>
          <h1>Golf Training Aids for Beginners. Fix the Fundamentals First.</h1>
          <p>Alignment sticks for aim, a putting mat for stroke volume, a chipping net for the short game, and a putting mirror for technique. Four tools that address the four areas where most beginners lose the most strokes — before they spend hours on the full swing. Under $50 each. WYX10 saves 10%.</p>
          <div className="actions">
            <Link className="button primary" href="#training-grid">Shop Training Aids</Link>
            <Link className="button secondary dark" href="/golf-training-aids">All Training Aids &rarr;</Link>
          </div>
          <p style={{ marginTop: '1rem', fontSize: '0.875rem', opacity: 0.8 }}>Use <strong>WYX10</strong> at checkout for 10% off every order.</p>
        </div>
        <aside className="share-card">
          <p className="eyebrow">Start Here — $24</p>
          <h2>Alignment Sticks</h2>
          <p>Two sticks, ball position and target line. 90% of beginners aim significantly off-target without knowing it. This is the training aid that tour pros use every session and beginners almost never try — the fastest and cheapest fundamental fix available.</p>
          <Link className="button primary" href="/golf-training-aids" style={{ marginTop: '1rem', display: 'inline-block' }}>See Training Aids &rarr;</Link>
        </aside>
      </section>

      <section className="deal-strip" aria-label="Beginner training aid highlights">
        <span>Alignment sticks — $24</span><span>Putting mat — $48</span><span>Chipping net — $38</span><span>WYX10 saves 10%</span>
      </section>

      <section className="section reveal" aria-labelledby="picks-heading">
        <div className="section-heading"><p className="eyebrow">Four Tools</p><h2 id="picks-heading">Golf Training Aids for Beginners.</h2></div>
        <div className="care-step-grid">
          {picks.map((p) => (
            <Link key={p.label} href={p.href} className="care-step-card" style={{ textDecoration: 'none' }}>
              <small style={{ opacity: 0.6, fontWeight: 600, display: 'block' }}>{p.tag}</small>
              <strong>{p.label} — {p.price}</strong><p>{p.why}</p>
            </Link>
          ))}
        </div>
      </section>

      <section id="training-grid" className="section product-section">
        <div className="section-heading split">
          <div><p className="eyebrow">Shop Beginner Training Aids</p><h2>Golf Training Aids.</h2></div>
          <Link className="text-link" href="/golf-practice-gear">Golf Practice Gear &rarr;</Link>
        </div>
        {products.length
          ? <div className="product-grid">{products.map((p) => <ProductCard key={p.id} product={p} />)}</div>
          : <div className="care-step-grid">
              <Link href="/golf-training-aids" className="care-step-card" style={{ textDecoration: 'none' }}><strong>Alignment Sticks — $24</strong><p>Fix aim first</p></Link>
              <Link href="/golf-practice-gear" className="care-step-card" style={{ textDecoration: 'none' }}><strong>Putting Mat — $48</strong><p>Indoor putting volume</p></Link>
              <Link href="/golf-practice-gear" className="care-step-card" style={{ textDecoration: 'none' }}><strong>Chipping Net — $38</strong><p>Backyard short game</p></Link>
              <Link href="/golf-training-aids" className="care-step-card" style={{ textDecoration: 'none' }}><strong>Putting Mirror — $32</strong><p>Technique feedback</p></Link>
            </div>
        }
      </section>

      <section className="section reveal" aria-labelledby="faq-heading">
        <div className="section-heading"><p className="eyebrow">Questions</p><h2 id="faq-heading">Beginner Training Aid FAQ.</h2></div>
        <div className="care-step-grid">
          {faqs.map(([q, a]) => (<div key={q} className="care-step-card"><strong>{q}</strong><p>{a}</p></div>))}
        </div>
      </section>

      <EmailCapture source="golf-training-aids-for-beginners" campaign="beginner_training" title="Fix the Fundamentals First. Four Tools." body="Join the WYX list for beginner practice guides and 10% off your first order with WYX10." />
    </>
  );
}
