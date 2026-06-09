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
  title: "Golf Accessories for Beginners — 6 Things Every New Golfer Needs | WYX Golf Supply Co.",
  description: "Golf accessories for beginners — the 6 items new golfers actually need before round 1. Gloves, towel, ball markers, divot tool, ball retriever, and alignment sticks. Under $140 complete. WYX10 saves 10%.",
  alternates: { canonical: '/golf-accessories-for-beginners' },
  openGraph: {
    title: "Golf Accessories for Beginners | WYX Golf Supply Co.",
    description: "What every new golfer needs — gloves, towel, markers, divot tool, retriever, alignment sticks. Complete beginner setup under $140. WYX10 saves 10%.",
    url: '/golf-accessories-for-beginners'
  }
};

const essentials = [
  { step: '01', label: 'Cabretta Glove 3-Pack', price: '$32', href: '/golf-gloves', why: 'The first accessory a beginner needs. Gloves prevent blisters during the high-repetition learning phase and teach natural grip pressure — new golfers often grip too tightly without a glove. Three gloves covers a full month of learning.' },
  { step: '02', label: 'Clip-On Microfiber Towel', price: '$18', href: '/golf-towels', why: 'The accessory beginners skip and then watch every experienced golfer use for 18 holes. One side scrubs grooves, one side dries the face. Attaches to the bag with a carabiner clip. The most-used accessory in any serious player\'s bag.' },
  { step: '03', label: 'Hat Clip Ball Markers', price: '$16', href: '/golf-ball-markers', why: 'Required for every green. USGA rules require you to mark your ball before lifting it on the putting surface. Three magnetic markers and a hat clip — always accessible, USGA-legal, and eliminates the "searching every pocket for a coin" moment before every putt.' },
  { step: '04', label: 'Magnetic Divot Tool', price: '$18', href: '/golf-divot-tools', why: 'Required golf course etiquette. New golfers often skip divot repair because they don\'t have a tool — and watch other golfers notice. A magnetic divot tool with a ball marker recessed in the head covers both green-side needs in one tool. The etiquette item that signals a golfer who respects the course.' },
  { step: '05', label: 'Ball Retriever — 15 Foot', price: '$24', href: '/golf-ball-retriever', why: 'Beginners lose more balls than experienced golfers — a retriever is more important, not less, when you\'re starting out. A 15-foot telescoping retriever in the side pocket saves balls from water hazards that every beginner hits during the learning phase. Pays for itself in round 1.' },
  { step: '06', label: 'Alignment Sticks 2-Pack', price: '$24', href: '/golf-training-aids', why: 'The training aid beginners almost never try and immediately benefit from. 90% of new golfers aim significantly off-target without knowing it — alignment sticks reveal and fix this immediately. 10 minutes before every range session, two sticks show you exactly where you\'re aimed.' }
];

const faqs: [string, string][] = [
  ['What golf accessories does a beginner need?', 'Six items: glove 3-pack ($32), clip-on towel ($18), hat clip ball markers ($16), magnetic divot tool ($18), ball retriever ($24), alignment sticks ($24). Total: $132 before WYX10. These six cover every recurring accessory need from round 1 through the full learning phase. All at wyxgolfsupply.com.'],
  ['What should a beginner golfer buy first?', 'A glove 3-pack ($32) and ball markers ($16). The glove is used every round from the first shot and teaches natural grip pressure. Ball markers are required equipment on the putting green — you cannot play a round without them. These two purchases are genuinely necessary before round 1.'],
  ['What golf accessories help beginners improve?', 'Alignment sticks ($24) produce the fastest visible improvement — most beginners aim significantly off-target without knowing it, and alignment sticks reveal this immediately. Ball retriever ($24) removes the score and pace-of-play friction of lost balls. Together they address the two biggest beginner frustration points per round.']
];

const jsonLd = {
  '@context': 'https://schema.org', '@type': 'FAQPage',
  mainEntity: faqs.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } }))
};

function beginnerScore(product: Awaited<ReturnType<typeof getProducts>>[number]) {
  let score = productQualityScore(product);
  if (/glove|towel|marker|divot|retriever|alignment/i.test(product.title)) score += 10;
  return score;
}

export default async function GolfAccessoriesForBeginnersPage() {
  const allProducts = availableProducts(await getProducts());
  const products = allProducts.sort((a, b) => beginnerScore(b) - beginnerScore(a)).slice(0, 10);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org', '@type': 'CollectionPage', name: 'Golf Accessories for Beginners', url: `${siteUrl}/golf-accessories-for-beginners`,
        breadcrumb: { '@type': 'BreadcrumbList', itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
          { '@type': 'ListItem', position: 2, name: 'Golf Accessories for Beginners', item: `${siteUrl}/golf-accessories-for-beginners` }
        ]}
      }) }} />

      <section className="deal-hero">
        <div>
          <p className="eyebrow">Beginner Golf Accessories</p>
          <h1>Golf Accessories for Beginners. Six Items Before Round One.</h1>
          <p>Gloves so your hands don&apos;t blister. A towel for grooves. Ball markers because the rules require them. A divot tool for course etiquette. A ball retriever for the learning phase. Alignment sticks to reveal where you&apos;re actually aimed. Six items, $132 before WYX10, and a complete accessory setup from the first tee shot. WYX10 saves 10%.</p>
          <div className="actions">
            <Link className="button primary" href="#beginner-grid">Shop Beginner Accessories</Link>
            <Link className="button secondary dark" href="/bag-essentials">All Bag Essentials &rarr;</Link>
          </div>
          <p style={{ marginTop: '1rem', fontSize: '0.875rem', opacity: 0.8 }}>Use <strong>WYX10</strong> at checkout for 10% off — complete setup $119.</p>
        </div>
        <aside className="share-card">
          <p className="eyebrow">Biggest Improvement Pick — $24</p>
          <h2>Alignment Sticks</h2>
          <p>90% of beginners aim significantly off their target and don&apos;t know it. Alignment sticks reveal and fix this in 10 minutes. The training tool that produces the fastest visible improvement for new golfers — and the one most beginners have never tried.</p>
          <Link className="button primary" href="/golf-training-aids" style={{ marginTop: '1rem', display: 'inline-block' }}>See Training Aids &rarr;</Link>
        </aside>
      </section>

      <section className="deal-strip" aria-label="Beginner accessory highlights">
        <span>Six items before round 1</span><span>$132 before WYX10</span><span>WYX10 saves 10%</span><span>Ships in 1-3 days</span>
      </section>

      <section className="section reveal" aria-labelledby="essentials-heading">
        <div className="section-heading"><p className="eyebrow">Six Beginner Essentials</p><h2 id="essentials-heading">Golf Accessories for Beginners.</h2></div>
        <div className="care-step-grid">
          {essentials.map((e) => (
            <Link key={e.label} href={e.href} className="care-step-card" style={{ textDecoration: 'none' }}>
              <small style={{ opacity: 0.6, fontWeight: 600, display: 'block' }}>{e.step}</small>
              <strong>{e.label} — {e.price}</strong><p>{e.why}</p>
            </Link>
          ))}
        </div>
      </section>

      <section id="beginner-grid" className="section product-section">
        <div className="section-heading split">
          <div><p className="eyebrow">Shop Beginner Accessories</p><h2>Beginner Golf Accessories.</h2></div>
          <Link className="text-link" href="/golf-accessories-every-golfer-needs">Full Accessories Guide &rarr;</Link>
        </div>
        {products.length
          ? <div className="product-grid">{products.map((p) => <ProductCard key={p.id} product={p} />)}</div>
          : <div className="care-step-grid">
              <Link href="/golf-gloves" className="care-step-card" style={{ textDecoration: 'none' }}><strong>Glove 3-Pack — $32</strong><p>Every round</p></Link>
              <Link href="/golf-ball-markers" className="care-step-card" style={{ textDecoration: 'none' }}><strong>Ball Markers — $16</strong><p>Required equipment</p></Link>
              <Link href="/golf-ball-retriever" className="care-step-card" style={{ textDecoration: 'none' }}><strong>Ball Retriever — $24</strong><p>Save lost balls</p></Link>
              <Link href="/golf-training-aids" className="care-step-card" style={{ textDecoration: 'none' }}><strong>Alignment Sticks — $24</strong><p>Fix aim immediately</p></Link>
            </div>
        }
      </section>

      <section className="section reveal" aria-labelledby="faq-heading">
        <div className="section-heading"><p className="eyebrow">Questions</p><h2 id="faq-heading">Beginner Golf Accessories FAQ.</h2></div>
        <div className="care-step-grid">
          {faqs.map(([q, a]) => (<div key={q} className="care-step-card"><strong>{q}</strong><p>{a}</p></div>))}
        </div>
      </section>

      <EmailCapture source="golf-accessories-for-beginners" campaign="beginner_accessories" title="Beginner Golf Accessories. Six Items Before Round One." body="Join the WYX list for beginner guides and 10% off your first order with WYX10." />
    </>
  );
}
