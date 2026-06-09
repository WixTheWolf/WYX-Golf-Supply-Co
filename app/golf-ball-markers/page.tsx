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
  title: "Golf Ball Markers — Hat Clip Sets, Poker Chip Markers & More | WYX Golf Supply Co.",
  description: "Golf ball markers for every style — magnetic hat clip sets, poker chip markers, and novelty picks. Used every green of every round. Under $20. WYX10 saves 10%.",
  alternates: { canonical: '/golf-ball-markers' },
  openGraph: {
    title: "Golf Ball Markers | WYX Golf Supply Co.",
    description: "Golf ball markers used every green — magnetic hat clip sets, poker chip markers. Under $20. WYX10 saves 10%.",
    url: '/golf-ball-markers'
  }
};

const picks = [
  {
    label: 'Hat Clip Ball Marker Set — 3 Markers',
    price: '$16',
    href: '/golf-ball-markers',
    tag: 'Best Seller',
    why: 'Three brushed aluminum magnetic markers + matching magnetic hat clip. USGA-compliant, one-hand retrieval on any green. The $16 golf accessory with the highest rounds-of-use-per-dollar ratio in any bag. Used every green of every round for multiple seasons without replacement.'
  },
  {
    label: 'Poker Chip Ball Marker Set',
    price: '$14',
    href: '/golf-ball-markers',
    tag: 'Classic Style',
    why: 'Standard-format poker chip markers in a set of six — the USGA-legal, bag-pocket-friendly alternative to coin marking. Large enough to see from the fringe, slim enough to carry in the back pocket. The classic marker format that most golfers used before magnetic clips existed.'
  }
];

const faqs: [string, string][] = [
  ['What is the best golf ball marker?', 'A magnetic hat clip set ($16) with 3 markers — the marker is always accessible, the clip keeps it visible on the hat, and one-hand retrieval eliminates the fumble on the green. Used every single round with no replacement cost for multiple seasons. Available at wyxgolfsupply.com with WYX10 for 10% off.'],
  ['Are golf ball markers USGA legal?', 'Any small artificial object placed to mark the ball position is legal. Magnetic metal markers on a hat clip are universally used on tour and at every skill level — there is no size, weight, or shape restriction in USGA rules for ball markers.'],
  ['What golf ball marker is the best gift?', 'The hat clip ball marker set ($16) — the best golf gift under $20 with zero size risk and immediate practical use in round 1. Every golfer uses markers on every round. Most golfers are still using the plastic coin from a bag of tees they bought years ago.']
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

function markerScore(product: Awaited<ReturnType<typeof getProducts>>[number]) {
  let score = productQualityScore(product);
  if (/marker|ball marker/i.test(product.title)) score += 15;
  if (/hat clip|magnetic|poker chip/i.test(product.title)) score += 5;
  return score;
}

export default async function GolfBallMarkersPage() {
  const allProducts = availableProducts(await getProducts());
  const products = allProducts
    .sort((a, b) => markerScore(b) - markerScore(a))
    .slice(0, 10);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: 'Golf Ball Markers',
        url: `${siteUrl}/golf-ball-markers`,
        breadcrumb: {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
            { '@type': 'ListItem', position: 2, name: 'Golf Ball Markers', item: `${siteUrl}/golf-ball-markers` }
          ]
        }
      }) }} />

      <section className="deal-hero">
        <div>
          <p className="eyebrow">Golf Ball Markers</p>
          <h1>Golf Ball Markers. Magnetic Hat Clip Sets &amp; Poker Chip Picks.</h1>
          <p>Used every green of every round. A magnetic hat clip set ($16) gives you three markers and a hat clip — one-hand retrieval, USGA-legal, multiple seasons of use. Under $20, zero size risk, the most-used $16 accessory in any bag.</p>
          <div className="actions">
            <Link className="button primary" href="#markers-grid">Shop Ball Markers</Link>
            <Link className="button secondary dark" href="/golf-gifts-under-25">Gifts Under $25 &rarr;</Link>
          </div>
          <p style={{ marginTop: '1rem', fontSize: '0.875rem', opacity: 0.8 }}>
            Use <strong>WYX10</strong> at checkout for 10% off every order.
          </p>
        </div>
        <aside className="share-card">
          <p className="eyebrow">Best Seller Under $20</p>
          <h2>Hat Clip Marker Set</h2>
          <p>$16. Three magnetic markers + hat clip. One-hand retrieval on any green. USGA-compliant. Used every round for multiple seasons without replacement. The best golf gift under $20 — no size risk, no preference guesswork.</p>
          <Link className="button primary" href="#markers-grid" style={{ marginTop: '1rem', display: 'inline-block' }}>Shop Markers &rarr;</Link>
        </aside>
      </section>

      <section className="deal-strip" aria-label="Golf ball marker highlights">
        <span>Magnetic hat clip</span>
        <span>USGA-legal</span>
        <span>Under $20</span>
        <span>WYX10 saves 10%</span>
      </section>

      <section className="section reveal" aria-labelledby="picks-heading">
        <div className="section-heading">
          <p className="eyebrow">Two Marker Picks</p>
          <h2 id="picks-heading">Golf Ball Markers.</h2>
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

      <section id="markers-grid" className="section product-section">
        <div className="section-heading split">
          <div>
            <p className="eyebrow">Shop Ball Markers</p>
            <h2>Golf Ball Markers.</h2>
          </div>
          <Link className="text-link" href="/golf-accessories-every-golfer-needs">All Bag Essentials &rarr;</Link>
        </div>
        {products.length
          ? <div className="product-grid">{products.map((p) => <ProductCard key={p.id} product={p} />)}</div>
          : (
            <div className="care-step-grid">
              <Link href="/golf-ball-markers" className="care-step-card" style={{ textDecoration: 'none' }}><strong>Hat Clip Set — $16</strong><p>3 markers + clip, best seller</p></Link>
              <Link href="/golf-ball-markers" className="care-step-card" style={{ textDecoration: 'none' }}><strong>Poker Chip Set — $14</strong><p>6 markers, classic format</p></Link>
            </div>
          )
        }
      </section>

      <section className="section reveal" aria-labelledby="faq-heading">
        <div className="section-heading">
          <p className="eyebrow">Questions</p>
          <h2 id="faq-heading">Golf Ball Marker FAQ.</h2>
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
        source="golf-ball-markers"
        campaign="golf_ball_markers"
        title="Golf Ball Markers Used Every Green. Under $20."
        body="Join the WYX list for bag essential picks and 10% off your first order with WYX10."
      />
    </>
  );
}
