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
  title: "Golf Arm Sleeves — UPF 50+ Compression Sleeves for Sun Protection | WYX Golf Supply Co.",
  description: "Golf arm sleeves with UPF 50+ sun protection and moisture-wicking compression — the summer round essential that replaces sunscreen on the arms. $22 a pair. WYX10 saves 10%.",
  alternates: { canonical: '/golf-arm-sleeves' },
  openGraph: {
    title: "Golf Arm Sleeves | WYX Golf Supply Co.",
    description: "UPF 50+ golf arm sleeves — sun protection, moisture-wicking compression, summer round essential. $22 a pair. WYX10 saves 10%.",
    url: '/golf-arm-sleeves'
  }
};

const picks = [
  {
    label: 'Golf Arm Sleeves UPF 50+ — A Pair',
    price: '$22',
    href: '/golf-arm-sleeves',
    tag: 'Summer Essential',
    why: 'UPF 50+ rated compression fabric covers the entire forearm and back of the hand. Moisture-wicking, machine washable, one size fits most adults. The summer round essential that replaces applying sunscreen to the arms before every round — lighter, more consistent coverage, and never sweats off during the back nine.'
  },
  {
    label: 'Golf Rain Gloves Pair',
    price: '$34',
    href: '/golf-gloves',
    tag: 'Pairs Well',
    why: 'Rain gloves with moisture-activated grip for both hands — the wet-weather companion to arm sleeves for the golfer who plays in any weather. Together ($56 total, $50 with WYX10), arm sleeves and rain gloves cover every weather scenario from summer UV to morning rain without redundant coverage.'
  }
];

const faqs: [string, string][] = [
  ['What are golf arm sleeves for?', 'UPF 50+ sun protection for the arms and back of the hand during summer rounds. Compression fabric wicks moisture away from the skin and keeps the arm cool. The practical alternative to applying sunscreen every 90 minutes — more consistent, never sweats off, and eliminates the sunscreen-on-the-grip problem.'],
  ['Are golf arm sleeves worth it?', 'Yes for any golfer playing 2+ rounds per week during summer. At $22 for a pair, they pay for themselves in the first 4-5 rounds compared to sunscreen cost — and provide consistent UPF 50+ coverage throughout the entire round without reapplication. Dermatologists recommend the sleeve over spray for golfers in high-UV climates.'],
  ['Do golf arm sleeves help performance?', 'Compression fabric can reduce arm fatigue over 36-hole days by improving circulation. The primary benefit is sun protection — but the compression benefit during walk-the-course rounds is a documented secondary effect. For cart rounds, the sun protection benefit dominates.']
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

function sleeveScore(product: Awaited<ReturnType<typeof getProducts>>[number]) {
  let score = productQualityScore(product);
  if (/arm sleeve/i.test(product.title)) score += 15;
  if (/upf|compression/i.test(product.title)) score += 5;
  return score;
}

export default async function GolfArmSleevesPage() {
  const allProducts = availableProducts(await getProducts());
  const products = allProducts
    .sort((a, b) => sleeveScore(b) - sleeveScore(a))
    .slice(0, 10);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: 'Golf Arm Sleeves',
        url: `${siteUrl}/golf-arm-sleeves`,
        breadcrumb: {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
            { '@type': 'ListItem', position: 2, name: 'Golf Arm Sleeves', item: `${siteUrl}/golf-arm-sleeves` }
          ]
        }
      }) }} />

      <section className="deal-hero">
        <div>
          <p className="eyebrow">Golf Arm Sleeves</p>
          <h1>Golf Arm Sleeves. UPF 50+ Sun Protection That Stays On All Round.</h1>
          <p>A pair of UPF 50+ compression arm sleeves ($22) replaces the sunscreen application that sweats off by hole 7. Moisture-wicking fabric, machine washable, one size fits most. The summer round essential for anyone playing 2+ rounds a week under serious sun.</p>
          <div className="actions">
            <Link className="button primary" href="#sleeves-grid">Shop Arm Sleeves</Link>
            <Link className="button secondary dark" href="/golf-summer-gear">Summer Golf Gear &rarr;</Link>
          </div>
          <p style={{ marginTop: '1rem', fontSize: '0.875rem', opacity: 0.8 }}>
            Use <strong>WYX10</strong> at checkout for 10% off every order.
          </p>
        </div>
        <aside className="share-card">
          <p className="eyebrow">UPF 50+ — $22 a pair</p>
          <h2>Golf Arm Sleeves</h2>
          <p>Full forearm and back-of-hand coverage. Never sweats off. Machine washable. One size fits most. The summer round purchase that pays for itself in the first 5 rounds versus sunscreen cost — with more consistent coverage throughout.</p>
          <Link className="button primary" href="#sleeves-grid" style={{ marginTop: '1rem', display: 'inline-block' }}>Shop Arm Sleeves &rarr;</Link>
        </aside>
      </section>

      <section className="deal-strip" aria-label="Golf arm sleeve highlights">
        <span>UPF 50+ rated</span>
        <span>Moisture-wicking compression</span>
        <span>$22 a pair</span>
        <span>WYX10 saves 10%</span>
      </section>

      <section className="section reveal" aria-labelledby="picks-heading">
        <div className="section-heading">
          <p className="eyebrow">Sun &amp; Weather Coverage</p>
          <h2 id="picks-heading">Golf Arm Sleeves &amp; Wet-Weather Companions.</h2>
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

      <section id="sleeves-grid" className="section product-section">
        <div className="section-heading split">
          <div>
            <p className="eyebrow">Shop Golf Arm Sleeves</p>
            <h2>Golf Arm Sleeves.</h2>
          </div>
          <Link className="text-link" href="/golf-summer-gear">Summer Gear &rarr;</Link>
        </div>
        {products.length
          ? <div className="product-grid">{products.map((p) => <ProductCard key={p.id} product={p} />)}</div>
          : (
            <div className="care-step-grid">
              <Link href="/golf-arm-sleeves" className="care-step-card" style={{ textDecoration: 'none' }}><strong>Arm Sleeves UPF 50+ — $22</strong><p>A pair, one size fits most</p></Link>
              <Link href="/golf-gloves" className="care-step-card" style={{ textDecoration: 'none' }}><strong>Rain Gloves — $34</strong><p>Wet-weather companion</p></Link>
            </div>
          )
        }
      </section>

      <section className="section reveal" aria-labelledby="faq-heading">
        <div className="section-heading">
          <p className="eyebrow">Questions</p>
          <h2 id="faq-heading">Golf Arm Sleeves FAQ.</h2>
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
        source="golf-arm-sleeves"
        campaign="golf_arm_sleeves"
        title="Golf Arm Sleeves. UPF 50+ That Stays On All Round."
        body="Join the WYX list for summer gear picks, sun protection guides, and 10% off your first order with WYX10."
      />
    </>
  );
}
