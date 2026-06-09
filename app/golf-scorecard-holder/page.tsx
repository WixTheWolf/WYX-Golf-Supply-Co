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
  title: "Leather Golf Scorecard Holder — Full-Grain with Pencil Loop | WYX Golf Supply Co.",
  description: "A full-grain leather golf scorecard holder with pencil loop, ball marker pocket, and snap closure. Fits any USGA scorecard. The bag side-pocket upgrade that lasts a decade. Under $40. WYX10 saves 10%.",
  alternates: { canonical: '/golf-scorecard-holder' },
  openGraph: {
    title: "Leather Golf Scorecard Holder | WYX Golf Supply Co.",
    description: "Full-grain leather scorecard holder with pencil loop and ball marker pocket. The elegant, practical bag upgrade. Under $40. WYX10 saves 10%.",
    url: '/golf-scorecard-holder'
  }
};

const details = [
  { head: 'Full-Grain Vegetable-Tanned Leather', body: 'Develops a rich patina with rounds — not the worn-out look of cheaper bonded leather. The front panel gets better with every season.' },
  { head: 'Pencil Loop on the Spine', body: 'A standard golf pencil sits flat against the spine inside the pencil loop. One-hand access on the green, no rooting through the bag between holes.' },
  { head: 'Ball Marker Pocket', body: 'Interior pocket holds one ball marker flat against the inside cover. The marker is always with the scorecard — not lost at the bottom of the bag.' },
  { head: 'Snap Closure', body: 'A solid brass snap keeps the scorecard inside on windy cart rides and light rain. Opens and closes with one hand in a glove.' },
  { head: 'Fits Any USGA Scorecard', body: 'Accommodates standard USGA scorecards plus yardage books. No trimming, no folding to fit. The holder fits the card, not the other way around.' },
  { head: 'Engraving-Ready Front Panel', body: 'The smooth front panel accepts engraving at any trophy shop. Initials, a logo, or a message — the leather gifts well as a monogrammed present.' }
];

const faqs: [string, string][] = [
  ['What size scorecard fits?', 'The holder fits standard USGA scorecards (typically 4" x 3.5" folded) and most yardage books (4" x 5.5"). It does not fit oversized resort scorecards that are larger than 5" x 6" — those are the exception, not the norm.'],
  ['Is the leather real?', 'Full-grain vegetable-tanned cowhide leather — the highest-quality grade, before the surface is sanded or buffed. This is the leather used in quality wallets and watchstraps. It develops a patina over time instead of wearing to a dull grey.'],
  ['Can I get it monogrammed?', 'The front panel is smooth and accepts laser or hand engraving at any local trophy shop or online leather engraving service. The holder is not pre-monogrammed — it arrives blank so you can choose the personalization.'],
  ['Is this a good golf gift?', 'The leather scorecard holder passes both tests for a good golf gift: (1) used within 2 rounds of receiving, (2) earns a permanent bag spot. It is elegant enough to feel like a considered gift and practical enough to be used immediately.']
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

function scorecardScore(product: Awaited<ReturnType<typeof getProducts>>[number]) {
  const title = product.title.toLowerCase();
  let score = productQualityScore(product);
  if (/scorecard holder/.test(title)) score += 30;
  if (/leather/.test(title)) score += 10;
  if (/ball marker|divot|accessory/.test(title)) score += 3;
  return score;
}

export default async function GolfScorecardHolderPage() {
  const allProducts = availableProducts(await getProducts());
  const products = allProducts
    .sort((a, b) => scorecardScore(b) - scorecardScore(a))
    .slice(0, 8);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: 'Leather Golf Scorecard Holder — Full-Grain with Pencil Loop',
        description: 'A full-grain leather golf scorecard holder with pencil loop, ball marker pocket, and snap closure.',
        brand: { '@type': 'Brand', name: 'WYX Golf Supply Co.' },
        offers: {
          '@type': 'Offer',
          price: '38.00',
          priceCurrency: 'USD',
          availability: 'https://schema.org/InStock',
          url: `${siteUrl}/golf-scorecard-holder`
        }
      }) }} />

      <section className="deal-hero">
        <div>
          <p className="eyebrow">Bag Upgrade</p>
          <h1>Leather Golf Scorecard Holder. The Bag Upgrade That Lasts a Decade.</h1>
          <p>Full-grain leather. Pencil loop on the spine. Ball marker pocket inside. Snap closure. The scorecard holder replaces the folded card stuffed in the back pocket — and stays in the bag for years.</p>
          <div className="actions">
            <Link className="button primary" href="#scorecard-grid">See the Holder</Link>
            <Link className="button secondary dark" href="/golf-bag-setup">Bag Setup Guide &rarr;</Link>
          </div>
          <p style={{ marginTop: '1rem', fontSize: '0.875rem', opacity: 0.8 }}>
            Use <strong>WYX10</strong> at checkout for 10% off. Engraving-ready front panel.
          </p>
        </div>
        <aside className="share-card">
          <p className="eyebrow">Full-Grain Leather</p>
          <h2>$38</h2>
          <p>Pencil loop. Ball marker pocket. Snap closure. Fits any USGA scorecard. Vegetable-tanned leather develops a patina over seasons &mdash; not worn, aged. Use WYX10 for $3.80 off.</p>
          <Link className="button primary" href="#scorecard-grid" style={{ marginTop: '1rem', display: 'inline-block' }}>See the Holder &rarr;</Link>
        </aside>
      </section>

      <section className="deal-strip" aria-label="Scorecard holder highlights">
        <span>Full-grain leather</span>
        <span>Pencil loop included</span>
        <span>Ball marker pocket</span>
        <span>Engraving-ready</span>
      </section>

      <section className="section reveal" aria-labelledby="details-heading">
        <div className="section-heading">
          <p className="eyebrow">What You Get</p>
          <h2 id="details-heading">Six Details That Make the Difference.</h2>
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

      <section id="scorecard-grid" className="section product-section">
        <div className="section-heading split">
          <div>
            <p className="eyebrow">Shop Bag Accessories</p>
            <h2>Scorecard Holders &amp; Bag Upgrades.</h2>
          </div>
          <Link className="text-link" href="/golf-bag-setup">Bag Setup Guide &rarr;</Link>
        </div>
        {products.length
          ? <div className="product-grid">{products.map((p) => <ProductCard key={p.id} product={p} />)}</div>
          : (
            <div className="care-step-grid">
              <div className="care-step-card">
                <strong>Leather Scorecard Holder &mdash; $38</strong>
                <p>Full-grain leather, pencil loop, ball marker pocket, snap closure. Engraving-ready. Use WYX10 for $3.80 off.</p>
              </div>
              <Link href="/golf-ball-markers" className="care-step-card" style={{ textDecoration: 'none' }}>
                <strong>Ball Marker Set &mdash; $28</strong>
                <p>Milled stainless markers in a gift box. Perfect companion to the scorecard holder.</p>
              </Link>
            </div>
          )
        }
      </section>

      <section className="section reveal" aria-labelledby="faq-heading">
        <div className="section-heading">
          <p className="eyebrow">Questions</p>
          <h2 id="faq-heading">Scorecard Holder FAQ.</h2>
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
          <h2 id="gift-heading">The Leather Scorecard Holder as a Golf Gift.</h2>
        </div>
        <div className="care-step-grid">
          <Link href="/golf-gifts-for-dad" className="care-step-card" style={{ textDecoration: 'none' }}>
            <strong>Golf Gift for Dad</strong>
            <p>The leather scorecard holder is the elegant practical gift &mdash; elegant enough to feel considered, practical enough to be used within 2 rounds. Under $40, no sizing risk.</p>
          </Link>
          <Link href="/golf-gifts-for-husband" className="care-step-card" style={{ textDecoration: 'none' }}>
            <strong>Gift for Husband</strong>
            <p>A golfer who has been using paper scorecards will notice the leather holder immediately. The engraving-ready front panel makes it a personalized gift without a trophy shop minimum order.</p>
          </Link>
          <Link href="/kits/bag-upgrade-kit" className="care-step-card" style={{ textDecoration: 'none' }}>
            <strong>In the Bag Upgrade Kit</strong>
            <p>The WYX Bag Upgrade Kit includes the leather scorecard holder alongside a club brush, grip regrip kit, and alignment sticks &mdash; four upgrades that make every round smoother.</p>
          </Link>
          <Link href="/golf-gifts-under-50" className="care-step-card" style={{ textDecoration: 'none' }}>
            <strong>Under $40 Golf Gifts</strong>
            <p>The scorecard holder at $38 is the best leather gift in the under-$40 tier &mdash; a category where most picks are plastic or disposable.</p>
          </Link>
        </div>
      </section>

      <EmailCapture
        source="golf-scorecard-holder"
        campaign="scorecard_holder_leather"
        title="The Bag Upgrade That Lasts a Decade."
        body="Join the WYX list for bag upgrade guides, new leather accessories, and 10% off your first order with WYX10."
      />
    </>
  );
}
