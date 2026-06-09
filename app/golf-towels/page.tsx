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
  title: "Golf Towels — Clip-On Microfiber & Waffle Weave | WYX Golf Supply Co.",
  description: "Golf towels that clip, clean, and dry — dual-sided microfiber clip-on towels and waffle weave options for every bag. Under $22. WYX10 saves 10% at WYX Golf Supply Co.",
  alternates: { canonical: '/golf-towels' },
  openGraph: {
    title: "Golf Towels | WYX Golf Supply Co.",
    description: "Golf towels that clip to any bag and last the full round — microfiber dual-sided and waffle weave. Under $22. WYX10 saves 10%.",
    url: '/golf-towels'
  }
};

const picks = [
  {
    label: 'Clip-On Microfiber Towel',
    price: '$18',
    href: '/golf-towels',
    tag: 'Most Popular',
    why: 'The bag essential most golfers forget to add until their third season. Carabiner clip fits any bag D-ring. Dual-sided microfiber — one side scrubs grooves, one side dries the club face. Used every hole, every round, every season. The $18 golf gift that earns a permanent bag spot in round 1.'
  },
  {
    label: 'Waffle Weave Golf Towel',
    price: '$22',
    href: '/golf-towels',
    tag: 'Premium Pick',
    why: 'Waffle texture provides more surface area per square inch than standard microfiber — better on mud, wet grips, and dirty club faces in humid conditions. The upgrade towel for the serious golfer who replaces their standard microfiber after one season.'
  }
];

const faqs: [string, string][] = [
  ['What is the best golf towel?', 'A clip-on dual-sided microfiber towel ($18) — one side scrubs grooves, one side dries the club face. The carabiner clip fits any bag D-ring. Used every hole of every round, it is the most-used accessory in the bag after the glove. Available at wyxgolfsupply.com with WYX10 for 10% off.'],
  ['Where does a golf towel clip on?', 'Most golf towels use a carabiner or hook clip that attaches to the D-ring on the outside of any golf bag. The clip-on towel ($18) at WYX fits every standard bag — cart bags, stand bags, Sunday bags. It hangs outside and swings free while you walk.'],
  ['What do golfers use towels for?', 'Three uses: (1) scrubbing groove lines clean between shots for maximum spin, (2) drying the club face before impact in wet conditions, (3) cleaning the ball before placing it on the green. A dual-sided towel handles all three — rough microfiber for scrubbing, smooth side for drying.'],
  ['Golf towel as a gift — is it a good idea?', 'Yes — it is the safest, most practical golf gift at any price. Under $20, zero sizing risk, used every single round. No golf bag is complete without one, and most golfers are still using the fraying towel they got with a bag purchase years ago.']
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

function towelScore(product: Awaited<ReturnType<typeof getProducts>>[number]) {
  let score = productQualityScore(product);
  if (/towel/i.test(product.title)) score += 15;
  if (/microfiber|waffle/i.test(product.title)) score += 5;
  return score;
}

export default async function GolfTowelsPage() {
  const allProducts = availableProducts(await getProducts());
  const products = allProducts
    .sort((a, b) => towelScore(b) - towelScore(a))
    .slice(0, 10);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: 'Golf Towels',
        url: `${siteUrl}/golf-towels`,
        breadcrumb: {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
            { '@type': 'ListItem', position: 2, name: 'Golf Towels', item: `${siteUrl}/golf-towels` }
          ]
        }
      }) }} />

      <section className="deal-hero">
        <div>
          <p className="eyebrow">Golf Towels</p>
          <h1>Golf Towels. Clean Grooves. Dry Club Face. Every Hole.</h1>
          <p>A clip-on microfiber towel is the most-used accessory in the bag — used every hole of every round. Dual-sided: one side scrubs grooves, one side dries. Under $22. All at WYX with WYX10 for 10% off.</p>
          <div className="actions">
            <Link className="button primary" href="#towels-grid">Shop Golf Towels</Link>
            <Link className="button secondary dark" href="/golf-accessories-every-golfer-needs">All Bag Essentials &rarr;</Link>
          </div>
          <p style={{ marginTop: '1rem', fontSize: '0.875rem', opacity: 0.8 }}>
            Use <strong>WYX10</strong> at checkout for 10% off every order.
          </p>
        </div>
        <aside className="share-card">
          <p className="eyebrow">Most-Used Bag Accessory</p>
          <h2>Clip-On Microfiber Towel</h2>
          <p>$18. Carabiner clip, dual-sided microfiber, fits any bag D-ring. Used every hole. The safest, most practical golf gift at any budget — and most golfers are still using the old fraying one they got with a bag purchase.</p>
          <Link className="button primary" href="#towels-grid" style={{ marginTop: '1rem', display: 'inline-block' }}>Shop Towels &rarr;</Link>
        </aside>
      </section>

      <section className="deal-strip" aria-label="Golf towel highlights">
        <span>Dual-sided microfiber</span>
        <span>Carabiner clip — fits any bag</span>
        <span>Under $22</span>
        <span>WYX10 saves 10%</span>
      </section>

      <section className="section reveal" aria-labelledby="picks-heading">
        <div className="section-heading">
          <p className="eyebrow">Two Towel Picks</p>
          <h2 id="picks-heading">Golf Towels. Microfiber &amp; Waffle Weave.</h2>
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

      <section id="towels-grid" className="section product-section">
        <div className="section-heading split">
          <div>
            <p className="eyebrow">Shop Golf Towels</p>
            <h2>Golf Towels.</h2>
          </div>
          <Link className="text-link" href="/golf-accessories-every-golfer-needs">All Bag Essentials &rarr;</Link>
        </div>
        {products.length
          ? <div className="product-grid">{products.map((p) => <ProductCard key={p.id} product={p} />)}</div>
          : (
            <div className="care-step-grid">
              <Link href="/golf-towels" className="care-step-card" style={{ textDecoration: 'none' }}><strong>Microfiber Clip-On — $18</strong><p>Dual-sided, every bag D-ring</p></Link>
              <Link href="/golf-towels" className="care-step-card" style={{ textDecoration: 'none' }}><strong>Waffle Weave — $22</strong><p>More surface area, better in mud</p></Link>
            </div>
          )
        }
      </section>

      <section className="section reveal" aria-labelledby="faq-heading">
        <div className="section-heading">
          <p className="eyebrow">Questions</p>
          <h2 id="faq-heading">Golf Towel FAQ.</h2>
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
        source="golf-towels"
        campaign="golf_towels"
        title="Golf Towels That Clip and Last the Full Round."
        body="Join the WYX list for bag essentials, care guides, and 10% off your first order with WYX10."
      />
    </>
  );
}
