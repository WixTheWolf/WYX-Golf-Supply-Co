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
  title: "Golf Practice Gear — Home Practice Equipment for Real Score Improvement | WYX Golf Supply Co.",
  description: "Golf practice gear that builds real habits — putting mat, backyard chipping net, alignment sticks, and putting alignment mirror. The home practice setup that produces visible handicap improvement. WYX10 saves 10%.",
  alternates: { canonical: '/golf-practice-gear' },
  openGraph: {
    title: "Golf Practice Gear | WYX Golf Supply Co.",
    description: "Home golf practice equipment — putting mat, chipping net, alignment sticks, putting mirror. Real improvement without a range visit. WYX10 saves 10%.",
    url: '/golf-practice-gear'
  }
};

const picks = [
  {
    label: 'Putting Mat — 9-Foot Velvet',
    price: '$54',
    href: '/golf-putting-mat',
    tag: 'Highest ROI',
    why: '40% of strokes come on the green. A 9-foot velvet putting mat with dual alignment channels and auto-return mechanism builds the daily putting routine that produces visible handicap improvement within two weeks. 10 minutes before dinner. The home practice investment with the most direct score-improvement connection.'
  },
  {
    label: 'Backyard Chipping Net — 4 Targets',
    price: '$44',
    href: '/golf-training-aids',
    tag: 'Short Game',
    why: 'Four targets, folds in 60 seconds, 20 minutes in the backyard. The short game practice that produces more score improvement per hour than any additional range session — and the one that removes the "drive to a range" barrier that kills the practice habit.'
  },
  {
    label: 'Alignment Sticks 2-Pack',
    price: '$24',
    href: '/golf-training-aids',
    tag: 'Range Essential',
    why: 'Every tour pro uses alignment sticks before every range session. Almost no amateur does. Two sticks — one for ball position, one for target line. 10 minutes confirms aim and ball position before a single swing is taken. The fastest practice improvement available at any price.'
  },
  {
    label: 'Putting Alignment Mirror',
    price: '$32',
    href: '/golf-training-aids',
    tag: 'Putting Setup',
    why: 'The folding mirror that shows eye position, shoulder line, and putter path simultaneously — the three setup elements that determine putting consistency. Folds to wallet size. The putting feedback tool that most golfers have never used and every scratch golfer has.'
  }
];

const faqs: [string, string][] = [
  ['What is the best home golf practice equipment?', 'Four picks: putting mat ($54 — highest ROI, 40% of strokes on green), backyard chipping net ($44 — removes range barrier for short game), alignment sticks ($24 — fastest range improvement), putting alignment mirror ($32 — objective setup feedback). All at wyxgolfsupply.com with WYX10 for 10% off.'],
  ['How do I practice golf at home?', 'Two setups: (1) Putting mat indoors — 10 minutes before dinner produces visible improvement within 2 weeks. (2) Chipping net in the backyard — 20 minutes produces the short game repetition that range sessions cannot replace. Together ($98 before WYX10) they cover the two highest-ROI practice areas without a range visit.'],
  ['What golf practice gear is worth buying?', 'A putting mat ($54) and chipping net ($44) together cover the two areas that produce the most score improvement per practice hour — putting and the 40-yard-and-in short game. Add alignment sticks ($24) for range sessions. All three together ($122, $110 with WYX10) is the complete home practice setup.']
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

function practiceScore(product: Awaited<ReturnType<typeof getProducts>>[number]) {
  let score = productQualityScore(product);
  if (/putting mat|chipping net|alignment|putting mirror/i.test(product.title)) score += 12;
  if (/practice|training/i.test(product.productType ?? '')) score += 5;
  return score;
}

export default async function GolfPracticeGearPage() {
  const allProducts = availableProducts(await getProducts());
  const products = allProducts
    .sort((a, b) => practiceScore(b) - practiceScore(a))
    .slice(0, 10);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: 'Golf Practice Gear',
        url: `${siteUrl}/golf-practice-gear`,
        breadcrumb: {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
            { '@type': 'ListItem', position: 2, name: 'Golf Practice Gear', item: `${siteUrl}/golf-practice-gear` }
          ]
        }
      }) }} />

      <section className="deal-hero">
        <div>
          <p className="eyebrow">Home Golf Practice</p>
          <h1>Golf Practice Gear. Real Improvement Without a Range Visit.</h1>
          <p>A putting mat for 10 minutes before dinner, a chipping net for 20 minutes in the backyard, and alignment sticks for every range session. The three-piece home practice setup that produces visible handicap improvement within two weeks of consistent daily use.</p>
          <div className="actions">
            <Link className="button primary" href="#practice-grid">Shop Practice Gear</Link>
            <Link className="button secondary dark" href="/golf-putting-mat">See the Putting Mat &rarr;</Link>
          </div>
          <p style={{ marginTop: '1rem', fontSize: '0.875rem', opacity: 0.8 }}>
            Use <strong>WYX10</strong> at checkout for 10% off every order.
          </p>
        </div>
        <aside className="share-card">
          <p className="eyebrow">Highest ROI Practice Tool</p>
          <h2>Putting Mat</h2>
          <p>$54. 40% of strokes come on the green. 10 minutes before dinner on a 9-foot velvet mat with alignment channels produces visible handicap improvement within two weeks. The home practice investment with the most direct score connection.</p>
          <Link className="button primary" href="/golf-putting-mat" style={{ marginTop: '1rem', display: 'inline-block' }}>See the Putting Mat &rarr;</Link>
        </aside>
      </section>

      <section className="deal-strip" aria-label="Golf practice gear highlights">
        <span>Home putting setup</span>
        <span>Backyard chipping net</span>
        <span>Range alignment tools</span>
        <span>WYX10 saves 10%</span>
      </section>

      <section className="section reveal" aria-labelledby="picks-heading">
        <div className="section-heading">
          <p className="eyebrow">Four Practice Picks</p>
          <h2 id="picks-heading">Golf Practice Gear. Putting, Short Game &amp; Aim.</h2>
        </div>
        <div className="care-step-grid">
          {picks.map((pick) => (
            <Link key={pick.label} href={pick.href} className="care-step-card" style={{ textDecoration: 'none' }}>
              <small style={{ opacity: 0.6, fontWeight: 600, display: 'block' }}>{pick.tag}</small>
              <strong>{pick.label} — {pick.price}</strong>
              <p>{pick.why}</p>
            </Link>
          ))}
        </div>
      </section>

      <section id="practice-grid" className="section product-section">
        <div className="section-heading split">
          <div>
            <p className="eyebrow">Shop Golf Practice Gear</p>
            <h2>Golf Practice Gear.</h2>
          </div>
          <Link className="text-link" href="/golf-training-aids">All Training Aids &rarr;</Link>
        </div>
        {products.length
          ? <div className="product-grid">{products.map((p) => <ProductCard key={p.id} product={p} />)}</div>
          : (
            <div className="care-step-grid">
              <Link href="/golf-putting-mat" className="care-step-card" style={{ textDecoration: 'none' }}><strong>Putting Mat — $54</strong><p>10 min/day, visible improvement</p></Link>
              <Link href="/golf-training-aids" className="care-step-card" style={{ textDecoration: 'none' }}><strong>Chipping Net — $44</strong><p>Backyard short game practice</p></Link>
              <Link href="/golf-training-aids" className="care-step-card" style={{ textDecoration: 'none' }}><strong>Alignment Sticks — $24</strong><p>Every range session</p></Link>
              <Link href="/golf-training-aids" className="care-step-card" style={{ textDecoration: 'none' }}><strong>Putting Mirror — $32</strong><p>Tour-standard setup feedback</p></Link>
            </div>
          )
        }
      </section>

      <section className="section reveal" aria-labelledby="faq-heading">
        <div className="section-heading">
          <p className="eyebrow">Questions</p>
          <h2 id="faq-heading">Golf Practice Gear FAQ.</h2>
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
        source="golf-practice-gear"
        campaign="golf_practice_gear"
        title="Golf Practice Gear for Real Home Improvement."
        body="Join the WYX list for practice guides, new products, and 10% off your first order with WYX10."
      />
    </>
  );
}
