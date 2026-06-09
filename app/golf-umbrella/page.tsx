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
  title: "Golf Umbrella — 62 Inch Auto-Open Wind-Vent Double Canopy | WYX Golf Supply Co.",
  description: "The best golf umbrella for the course — 62 inch double-canopy with auto-open, wind-vent system that won't invert in gusts, and UV50+ canopy. Covers you and the bag. WYX10 saves 10%.",
  alternates: { canonical: '/golf-umbrella' },
  openGraph: {
    title: "Golf Umbrella | WYX Golf Supply Co.",
    description: "62\" auto-open double-canopy golf umbrella — wind-vent system, UV50+, fiberglass ribs. Won't invert. Covers player and bag. WYX10 saves 10%.",
    url: '/golf-umbrella'
  }
};

const picks = [
  { label: '62" Auto-Open Double-Canopy Golf Umbrella', price: '$44', href: '/golf-umbrella', tag: 'Best Pick', why: 'A 62-inch double-canopy golf umbrella with a wind-vent system that releases pressure gusts instead of inverting — the single feature that separates a golf umbrella from a $10 convenience store version that turns inside-out on the 7th hole. Auto-open button deploys one-handed with a gloved hand. UV50+ canopy blocks sun on a 36-hole day. Fiberglass ribs flex instead of snapping.' }
];

const faqs: [string, string][] = [
  ['What makes a golf umbrella different from a regular umbrella?', 'Three things: size (62-inch arc covers you and the bag simultaneously — a standard umbrella covers only the person), the wind-vent double-canopy that prevents inversion in gusts (the most common failure of smaller umbrellas on exposed courses), and one-hand operation with a gloved hand. A 62-inch golf umbrella ($44) is built for on-course conditions; a standard umbrella is not.'],
  ['What size golf umbrella do I need?', 'Sixty-two inches arc length — this is the golf umbrella standard because it covers the player and the bag simultaneously. Smaller sizes (58 inches) only cover the player. The 62-inch arc is the minimum for keeping the bag and clubs dry in a sideway rain.'],
  ['Is a golf umbrella worth it?', 'Yes — if you play courses with exposed fairways or coastal wind. The double-canopy wind-vent design ($44) prevents the mid-round inversion that standard umbrellas suffer in crosswind. The UV50+ canopy also shades 36-hole summer days without sunscreen. One purchase that covers both rain and sun management.']
];

const jsonLd = {
  '@context': 'https://schema.org', '@type': 'FAQPage',
  mainEntity: faqs.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } }))
};

function umbrellaScore(product: Awaited<ReturnType<typeof getProducts>>[number]) {
  let score = productQualityScore(product);
  if (/umbrella/i.test(product.title)) score += 20;
  return score;
}

export default async function GolfUmbrellaPage() {
  const allProducts = availableProducts(await getProducts());
  const products = allProducts.sort((a, b) => umbrellaScore(b) - umbrellaScore(a)).slice(0, 10);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org', '@type': 'CollectionPage', name: 'Golf Umbrella', url: `${siteUrl}/golf-umbrella`,
        breadcrumb: { '@type': 'BreadcrumbList', itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
          { '@type': 'ListItem', position: 2, name: 'Golf Umbrella', item: `${siteUrl}/golf-umbrella` }
        ]}
      }) }} />

      <section className="deal-hero">
        <div>
          <p className="eyebrow">Golf Umbrellas</p>
          <h1>Golf Umbrella. 62 Inch. Won&apos;t Invert. Covers You and the Bag.</h1>
          <p>A 62-inch double-canopy golf umbrella with a wind-vent system that releases pressure gusts instead of turning inside out. Auto-open button, UV50+ canopy for sun as well as rain, fiberglass ribs that flex instead of snapping. The umbrella built for exposed fairways and coastal course wind. WYX10 saves 10%.</p>
          <div className="actions">
            <Link className="button primary" href="#umbrella-grid">Shop Golf Umbrellas</Link>
            <Link className="button secondary dark" href="/golf-rain-gear">All Rain Gear &rarr;</Link>
          </div>
          <p style={{ marginTop: '1rem', fontSize: '0.875rem', opacity: 0.8 }}>Use <strong>WYX10</strong> at checkout for 10% off every order.</p>
        </div>
        <aside className="share-card">
          <p className="eyebrow">The Key Feature</p>
          <h2>Double-Canopy Wind-Vent</h2>
          <p>The top vent releases pressure gusts — the gust passes through instead of flipping the canopy. The single design feature that separates a golf umbrella from a convenience store version that inverts on hole 7 of a coastal round.</p>
          <Link className="button primary" href="#umbrella-grid" style={{ marginTop: '1rem', display: 'inline-block' }}>Shop Umbrellas &rarr;</Link>
        </aside>
      </section>

      <section className="deal-strip" aria-label="Golf umbrella highlights">
        <span>62-inch arc — covers player and bag</span><span>Double-canopy wind-vent</span><span>UV50+ sun + rain</span><span>WYX10 saves 10%</span>
      </section>

      <section className="section reveal" aria-labelledby="picks-heading">
        <div className="section-heading"><p className="eyebrow">The Pick</p><h2 id="picks-heading">Golf Umbrella.</h2></div>
        <div className="care-step-grid">
          {picks.map((p) => (
            <Link key={p.label} href={p.href} className="care-step-card" style={{ textDecoration: 'none' }}>
              <small style={{ opacity: 0.6, fontWeight: 600, display: 'block' }}>{p.tag}</small>
              <strong>{p.label} — {p.price}</strong><p>{p.why}</p>
            </Link>
          ))}
        </div>
      </section>

      <section id="umbrella-grid" className="section product-section">
        <div className="section-heading split">
          <div><p className="eyebrow">Shop Golf Umbrellas</p><h2>Golf Umbrellas.</h2></div>
          <Link className="text-link" href="/golf-rain-gear">Rain Gear &rarr;</Link>
        </div>
        {products.length
          ? <div className="product-grid">{products.map((p) => <ProductCard key={p.id} product={p} />)}</div>
          : <div className="care-step-grid">
              <Link href="/golf-umbrella" className="care-step-card" style={{ textDecoration: 'none' }}><strong>62" Double-Canopy — $44</strong><p>Wind-vent, UV50+, auto-open</p></Link>
            </div>
        }
      </section>

      <section className="section reveal" aria-labelledby="faq-heading">
        <div className="section-heading"><p className="eyebrow">Questions</p><h2 id="faq-heading">Golf Umbrella FAQ.</h2></div>
        <div className="care-step-grid">
          {faqs.map(([q, a]) => (<div key={q} className="care-step-card"><strong>{q}</strong><p>{a}</p></div>))}
        </div>
      </section>

      <EmailCapture source="golf-umbrella" campaign="golf_umbrella" title="Golf Umbrella. Won&apos;t Invert. Covers the Bag." body="Join the WYX list for rain gear picks and 10% off your first order with WYX10." />
    </>
  );
}
