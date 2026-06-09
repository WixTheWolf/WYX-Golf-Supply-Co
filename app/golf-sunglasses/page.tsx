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
  title: "Golf Sunglasses — Polarized Sport Wrap Lenses for the Course | WYX Golf Supply Co.",
  description: "Golf sunglasses with polarized lenses that eliminate fairway and green glare — sport wrap fit, secure on cart rides, compatible with any cap. $42. WYX10 saves 10%.",
  alternates: { canonical: '/golf-sunglasses' },
  openGraph: {
    title: "Golf Sunglasses | WYX Golf Supply Co.",
    description: "Polarized golf sunglasses for the course — sport wrap fit, glare elimination on fairways and greens. $42. WYX10 saves 10%.",
    url: '/golf-sunglasses'
  }
};

const picks = [
  {
    label: 'Polarized Sport Wrap Sunglasses',
    price: '$42',
    href: '/golf-sunglasses',
    tag: 'Best Seller',
    why: 'Polarized lenses eliminate reflective glare on fairways and greens — the surface glare that makes uphill reads and sidehill breaks harder to see. Sport wrap frame stays secured through cart rides and swing motion. Fits under any standard golf cap brim. The visual upgrade that makes the investment in the round worthwhile.'
  },
  {
    label: 'Interchangeable Lens Golf Glasses',
    price: '$58',
    href: '/golf-sunglasses',
    tag: 'All Conditions',
    why: 'Three lens sets: dark polarized for full sun, amber for overcast conditions that improve contrast on the fairway, and clear for dawn/dusk rounds. The multi-condition golf sunglasses for players who tee off across the full day. One frame, three visual environments covered.'
  }
];

const faqs: [string, string][] = [
  ['Are polarized sunglasses better for golf?', 'Yes — polarized lenses eliminate the reflective surface glare from fairways, greens, and water that standard tinted lenses do not filter. The glare reduction makes subtle break reads on the green easier to see and reduces eye fatigue over 18 holes. Available at wyxgolfsupply.com for $42 with WYX10 for 10% off.'],
  ['What sunglasses are best for golf?', 'A sport wrap polarized lens ($42) — secured during cart rides, fits under cap brims, eliminates fairway and green glare. For multi-condition play, interchangeable lens glasses ($58) with dark, amber, and clear lens sets cover full sun, overcast, and dawn/dusk conditions in one frame.'],
  ['Do golf sunglasses affect your swing?', 'Well-fitted sport wrap sunglasses do not affect the swing — they stay in place through full rotation and do not shift on the bridge of the nose during the downswing. Ill-fitting sunglasses can cause micro-adjustments mid-swing that affect head position. The sport wrap fit eliminates this.']
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

function glassesScore(product: Awaited<ReturnType<typeof getProducts>>[number]) {
  let score = productQualityScore(product);
  if (/sunglasses|glasses/i.test(product.title)) score += 15;
  if (/polarized|sport wrap/i.test(product.title)) score += 6;
  return score;
}

export default async function GolfSunglassesPage() {
  const allProducts = availableProducts(await getProducts());
  const products = allProducts
    .sort((a, b) => glassesScore(b) - glassesScore(a))
    .slice(0, 10);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: 'Golf Sunglasses',
        url: `${siteUrl}/golf-sunglasses`,
        breadcrumb: {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
            { '@type': 'ListItem', position: 2, name: 'Golf Sunglasses', item: `${siteUrl}/golf-sunglasses` }
          ]
        }
      }) }} />

      <section className="deal-hero">
        <div>
          <p className="eyebrow">Golf Sunglasses</p>
          <h1>Golf Sunglasses. Polarized Lenses That Eliminate Fairway Glare.</h1>
          <p>Polarized sport wrap sunglasses ($42) eliminate the reflective glare on fairways and greens that standard tinted lenses do not filter. Secured through cart rides, fits under any cap brim, improves subtle break reads on unfamiliar greens. The visual upgrade that makes the round easier to play.</p>
          <div className="actions">
            <Link className="button primary" href="#glasses-grid">Shop Golf Sunglasses</Link>
            <Link className="button secondary dark" href="/golf-hats">Golf Hats &rarr;</Link>
          </div>
          <p style={{ marginTop: '1rem', fontSize: '0.875rem', opacity: 0.8 }}>
            Use <strong>WYX10</strong> at checkout for 10% off every order.
          </p>
        </div>
        <aside className="share-card">
          <p className="eyebrow">Polarized Sport Wrap — $42</p>
          <h2>Golf Sunglasses</h2>
          <p>Eliminates fairway and green glare. Sport wrap fit stays secured through full swing. Fits under any standard cap brim. The visual upgrade that makes subtle break reads and approach shots easier to execute.</p>
          <Link className="button primary" href="#glasses-grid" style={{ marginTop: '1rem', display: 'inline-block' }}>Shop Sunglasses &rarr;</Link>
        </aside>
      </section>

      <section className="deal-strip" aria-label="Golf sunglasses highlights">
        <span>Polarized glare elimination</span>
        <span>Sport wrap fit</span>
        <span>Cap-compatible</span>
        <span>WYX10 saves 10%</span>
      </section>

      <section className="section reveal" aria-labelledby="picks-heading">
        <div className="section-heading">
          <p className="eyebrow">Two Lens Options</p>
          <h2 id="picks-heading">Golf Sunglasses. Standard &amp; All-Conditions.</h2>
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

      <section id="glasses-grid" className="section product-section">
        <div className="section-heading split">
          <div>
            <p className="eyebrow">Shop Golf Sunglasses</p>
            <h2>Golf Sunglasses.</h2>
          </div>
          <Link className="text-link" href="/golf-trip-gear">Golf Trip Gear &rarr;</Link>
        </div>
        {products.length
          ? <div className="product-grid">{products.map((p) => <ProductCard key={p.id} product={p} />)}</div>
          : (
            <div className="care-step-grid">
              <Link href="/golf-sunglasses" className="care-step-card" style={{ textDecoration: 'none' }}><strong>Polarized Sport Wrap — $42</strong><p>Full sun, fairway glare eliminated</p></Link>
              <Link href="/golf-sunglasses" className="care-step-card" style={{ textDecoration: 'none' }}><strong>Interchangeable Lens — $58</strong><p>Three lens sets, all conditions</p></Link>
            </div>
          )
        }
      </section>

      <section className="section reveal" aria-labelledby="faq-heading">
        <div className="section-heading">
          <p className="eyebrow">Questions</p>
          <h2 id="faq-heading">Golf Sunglasses FAQ.</h2>
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
        source="golf-sunglasses"
        campaign="golf_sunglasses"
        title="Golf Sunglasses That Eliminate Fairway Glare."
        body="Join the WYX list for sun protection guides, new products, and 10% off your first order with WYX10."
      />
    </>
  );
}
