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
  title: "Golf Putting Mat — 9-Foot Velvet with Alignment Lines & Auto-Return | WYX Golf Supply Co.",
  description: "A 9-foot velvet golf putting mat with dual alignment channels, auto-return ball mechanism, and regulation-diameter cup. Folds up in 30 seconds. Under $55. WYX10 saves 10%.",
  alternates: { canonical: '/golf-putting-mat' },
  openGraph: {
    title: "Golf Putting Mat 9-Foot | WYX Golf Supply Co.",
    description: "9-foot velvet putting mat with alignment channels, auto-return, and regulation cup. The home putting studio that fits in any room. Under $55. WYX10 saves 10%.",
    url: '/golf-putting-mat'
  }
};

const details = [
  { head: '9-Foot Length', body: 'Long enough to practice lag putts and standard 4-8 foot conversion putts. Short enough to run along any hallway or living room wall without rearranging furniture.' },
  { head: 'Dual Alignment Channels', body: 'Two parallel guide rails down the mat show the ball tracking left or right of center. Instant path feedback without needing video or a coach.' },
  { head: 'Auto-Return Mechanism', body: 'Made putts roll back to you automatically. No bending over, no picking up between reps. Makes it easy to complete 30+ putts in a 10-minute session without losing focus.' },
  { head: 'Regulation-Diameter Cup', body: '4.25 inches — the same diameter as a course hole. Not a smaller practice cup that makes the course feel easy. Confidence built on the mat transfers to the green.' },
  { head: 'Velvet Surface', body: 'Rolls consistently at approximately 10 Stimpmeter — faster than most recreational greens, which trains a soft touch that handles fast greens with ease.' },
  { head: 'Rolls Up in 30 Seconds', body: 'Includes a cloth storage bag. Roll it up, slide it behind the door or under the bed. No permanent space required. Set up and put away before anyone objects.' }
];

const drills = [
  { name: 'Gate Drill', desc: 'Two coins 6 inches apart, 6 inches in front of the ball. Putter must pass between them. Builds square face and correct path at impact. Start at 3 feet, progress to 6.' },
  { name: 'Clock Drill', desc: 'Four balls at 3 feet around the cup — 12, 3, 6, 9 o\'clock. Sink all four in order. Builds confidence from every angle. Move to 4 feet when you run the clock clean.' },
  { name: 'Lag Drill', desc: 'From the full 9 feet, putt with the goal of stopping within 12 inches of the far end — no cup target. Builds pace judgment that reduces 3-putts from long range.' },
  { name: 'Mirror Check', desc: 'Set the Putting Alignment Mirror in front of the ball. Check eye position, shoulder line, and putter path before each practice stroke. Builds the correct setup by feel.' }
];

const faqs: [string, string][] = [
  ['Will the mat work on carpet?', 'Yes — the velvet surface sits on any flat floor including carpet. The foam backing prevents slipping on hard floors and compresses slightly on carpet without affecting roll consistency.'],
  ['How is it different from a cheap mat?', 'The 9-foot length allows real lag putt practice. The dual alignment channels show path deviation. The auto-return removes friction from repetition. Cheaper mats are shorter, have no feedback channels, and no return mechanism — they make practice feel like a chore after day three.'],
  ['Is it a good gift?', 'The putting mat is the home practice gift that gets used. Unlike range balls (need a range) or club headcovers (already owned), the putting mat creates a daily habit — 10 minutes before dinner — that produces visible improvement and builds the routine of practicing putting at home.'],
  ['Does it work with the Putting Alignment Mirror?', 'Yes. The WYX Putting Alignment Mirror ($32) sits in front of the ball on the mat. The combination of mat surface feedback (where the ball goes) and mirror feedback (why it went there) is the most efficient home putting setup available at any price.']
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

function puttingMatScore(product: Awaited<ReturnType<typeof getProducts>>[number]) {
  const title = product.title.toLowerCase();
  let score = productQualityScore(product);
  if (/putting mat/.test(title)) score += 30;
  if (/putting mirror|alignment mirror/.test(title)) score += 20;
  if (/putting|putt/.test(title)) score += 10;
  if (/training aid|training aids/.test(product.productType?.toLowerCase() ?? '')) score += 5;
  return score;
}

export default async function GolfPuttingMatPage() {
  const allProducts = availableProducts(await getProducts());
  const products = allProducts
    .sort((a, b) => puttingMatScore(b) - puttingMatScore(a))
    .slice(0, 8);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: 'Golf Putting Mat — 9-Foot Velvet with Alignment Lines',
        description: 'A 9-foot velvet putting mat with dual alignment channels, auto-return mechanism, and regulation cup.',
        brand: { '@type': 'Brand', name: 'WYX Golf Supply Co.' },
        offers: {
          '@type': 'Offer',
          price: '54.00',
          priceCurrency: 'USD',
          availability: 'https://schema.org/InStock',
          url: `${siteUrl}/golf-putting-mat`
        }
      }) }} />

      <section className="deal-hero">
        <div>
          <p className="eyebrow">Home Putting Practice</p>
          <h1>Golf Putting Mat. 10 Minutes Before Dinner. Fewer 3-Putts on Saturday.</h1>
          <p>Putting is 40% of your score. It is the only part of golf you can practice at full performance intensity in your living room. The 9-foot velvet mat, alignment channels, and auto-return make the routine easy enough to keep.</p>
          <div className="actions">
            <Link className="button primary" href="#mat-grid">See the Putting Mat</Link>
            <Link className="button secondary dark" href="/journal/golf-putting-practice-at-home">Putting Drills &rarr;</Link>
          </div>
          <p style={{ marginTop: '1rem', fontSize: '0.875rem', opacity: 0.8 }}>
            Use <strong>WYX10</strong> at checkout for 10% off. Works on carpet, hardwood, and tile.
          </p>
        </div>
        <aside className="share-card">
          <p className="eyebrow">WYX Putting Mat</p>
          <h2>$54</h2>
          <p>9 feet. Dual alignment channels. Auto-return. Regulation 4.25-inch cup. Velvet surface ~10 Stimp. Rolls up in 30 seconds. Use WYX10 for $5.40 off.</p>
          <Link className="button primary" href="#mat-grid" style={{ marginTop: '1rem', display: 'inline-block' }}>See the Mat &rarr;</Link>
        </aside>
      </section>

      <section className="deal-strip" aria-label="Putting mat highlights">
        <span>9-foot velvet surface</span>
        <span>Auto-return mechanism</span>
        <span>Dual alignment channels</span>
        <span>Rolls up in 30 seconds</span>
      </section>

      <section className="section reveal" aria-labelledby="details-heading">
        <div className="section-heading">
          <p className="eyebrow">What You Get</p>
          <h2 id="details-heading">Six Features That Make the Routine Easy to Keep.</h2>
        </div>
        <div className="care-step-grid">
          {details.map((d) => (
            <div key={d.head} className="care-step-card">
              <strong>{d.head}</strong>
              <p>{d.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="mat-grid" className="section product-section">
        <div className="section-heading split">
          <div>
            <p className="eyebrow">Shop Putting Practice</p>
            <h2>Putting Mat &amp; Training Aids.</h2>
          </div>
          <Link className="text-link" href="/golf-training-aids">All Training Aids &rarr;</Link>
        </div>
        {products.length
          ? <div className="product-grid">{products.map((p) => <ProductCard key={p.id} product={p} />)}</div>
          : (
            <div className="care-step-grid">
              <div className="care-step-card">
                <strong>Putting Mat 9-Foot &mdash; $54</strong>
                <p>Dual alignment channels, auto-return, regulation cup. Use WYX10 for $5.40 off.</p>
              </div>
              <div className="care-step-card">
                <strong>Putting Alignment Mirror &mdash; $32</strong>
                <p>Eye position, shoulder line, putter path — instant visual feedback. Use WYX10 for $3.20 off.</p>
              </div>
            </div>
          )
        }
      </section>

      <section className="section reveal" aria-labelledby="drills-heading">
        <div className="section-heading">
          <p className="eyebrow">Practice Drills</p>
          <h2 id="drills-heading">Four Drills. 10 Minutes. Results on Saturday.</h2>
        </div>
        <div className="care-step-grid">
          {drills.map((d) => (
            <div key={d.name} className="care-step-card">
              <strong>{d.name}</strong>
              <p>{d.desc}</p>
            </div>
          ))}
        </div>
        <p style={{ marginTop: '1.5rem', opacity: 0.8 }}>
          <Link href="/journal/golf-putting-practice-at-home" className="text-link">Read the full putting practice guide &rarr;</Link>
        </p>
      </section>

      <section className="section reveal" aria-labelledby="faq-heading">
        <div className="section-heading">
          <p className="eyebrow">Questions</p>
          <h2 id="faq-heading">Putting Mat FAQ.</h2>
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

      <section className="section reveal" aria-labelledby="gift-heading">
        <div className="section-heading">
          <p className="eyebrow">As a Golf Gift</p>
          <h2 id="gift-heading">The Putting Mat as a Golf Gift.</h2>
        </div>
        <div className="care-step-grid">
          <Link href="/golf-gifts-for-dad" className="care-step-card" style={{ textDecoration: 'none' }}>
            <strong>Golf Gift for Dad</strong>
            <p>The putting mat creates a daily practice habit. 10 minutes before dinner, every weeknight. The gift that builds the routine &mdash; and the handicap drop that comes with it.</p>
          </Link>
          <Link href="/golf-gifts-for-husband" className="care-step-card" style={{ textDecoration: 'none' }}>
            <strong>Gift for Husband</strong>
            <p>A golfer who plays but never practices putting benefits immediately from a mat. The auto-return makes the routine repeatable. The alignment channels make the improvement visible.</p>
          </Link>
          <Link href="/kits/dad-gift-kit" className="care-step-card" style={{ textDecoration: 'none' }}>
            <strong>In the Dad Gift Kit</strong>
            <p>The WYX Dad Gift Kit bundles four practical gifts &mdash; glove, towel, leather scorecard holder, and a training tool &mdash; for Father&apos;s Day or any occasion.</p>
          </Link>
          <Link href="/golf-gifts-under-75" className="care-step-card" style={{ textDecoration: 'none' }}>
            <strong>Under $75 Golf Gifts</strong>
            <p>The putting mat at $54 (or $48.60 with WYX10) sits in the "generous but practical" tier &mdash; the gift budget that feels considered without being excessive.</p>
          </Link>
        </div>
      </section>

      <EmailCapture
        source="golf-putting-mat"
        campaign="putting_mat_practice"
        title="Fewer 3-Putts Start at Home."
        body="Join the WYX list for putting practice guides, new training aids, and 10% off your first order with WYX10."
      />
    </>
  );
}
