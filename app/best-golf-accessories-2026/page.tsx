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
  title: "Best Golf Accessories 2026 — The 10 Accessories Worth Buying This Year | WYX Golf Supply Co.",
  description: "The best golf accessories for 2026 — 10 picks across every category that produce real improvement and genuine use every round. GPS rangefinder, cabretta gloves, UPF sleeves, and more. WYX10 saves 10%.",
  alternates: { canonical: '/best-golf-accessories-2026' },
  openGraph: {
    title: "Best Golf Accessories 2026 | WYX Golf Supply Co.",
    description: "10 best golf accessories for 2026 — every category, every use case, every budget. WYX10 saves 10% at wyxgolfsupply.com.",
    url: '/best-golf-accessories-2026'
  }
};

const picks = [
  { rank: '#1', label: 'GPS Laser Rangefinder', price: '$119', href: '/golf-tech-gifts', cat: 'Performance', why: 'Used on every approach shot across every round. The accessory that changes how the entire game feels from hole 1. Slope-compensating, 5-yard accuracy, USB-C rechargeable.' },
  { rank: '#2', label: 'Cabretta Glove 3-Pack', price: '$32', href: '/golf-gloves', cat: 'Grip', why: 'Three cabretta leather gloves per season — one per three rounds. Consistent grip confidence all season. The accessory used every round, more than any other item in the bag.' },
  { rank: '#3', label: 'Arm Sleeves UPF 50+', price: '$22', href: '/golf-arm-sleeves', cat: 'Sun Protection', why: 'Full forearm and back-of-hand coverage, no reapplication. The summer round essential that replaces sunscreen for all-day rounds in open conditions.' },
  { rank: '#4', label: 'Clip-On Microfiber Towel', price: '$18', href: '/golf-towels', cat: 'Club Care', why: 'Used every hole. The on-course groove care and face-drying tool that most golfers skip and then watch every experienced golfer use for 18 holes.' },
  { rank: '#5', label: 'Polarized Golf Sunglasses', price: '$48', href: '/golf-sunglasses', cat: 'Visibility', why: 'Polarized lenses track ball flight in high-sun conditions. The sunglasses format most golfers wear casually that actual course conditions require in a performance lens.' },
  { rank: '#6', label: 'Ball Retriever — 15 Foot', price: '$24', href: '/golf-ball-retriever', cat: 'Practical', why: 'The most overlooked accessory in any bag. Pays for itself in round 1 at any course with a water hazard. 15-foot telescoping stainless, collapses to 26 inches.' },
  { rank: '#7', label: 'Alignment Sticks 2-Pack', price: '$24', href: '/golf-training-aids', cat: 'Training', why: 'The training tool every tour pro uses that most amateurs have never tried. 10 minutes of alignment work per range session reveals and fixes aim errors most golfers carry for years without knowing it.' },
  { rank: '#8', label: 'Magnetic Divot Tool', price: '$18', href: '/golf-divot-tools', cat: 'Etiquette', why: 'A combo tool with a ball marker recessed in the head. Covers two greens-side needs in one bag slot. The etiquette accessory that signals a player who respects the course and follows the push-and-rotate repair technique.' },
  { rank: '#9', label: 'Putter Grip — Pistol Style', price: '$28', href: '/golf-grips', cat: 'Equipment', why: 'The equipment upgrade most golfers delay for too long. A worn putter grip removes the tactile feedback that confident putting requires. New grip restores that feedback immediately — the equipment change with the fastest score ROI per dollar.' },
  { rank: '#10', label: 'Putting Mat — 9 Foot', price: '$48', href: '/golf-practice-gear', cat: 'Home Practice', why: 'The home practice tool that addresses the highest-ROI skill in golf. 20 minutes per day at 3-6 foot range produces measurable putting improvement in 30 days — without leaving the house.' }
];

const faqs: [string, string][] = [
  ['What are the best golf accessories to buy in 2026?', 'Ten picks: GPS rangefinder ($119), glove 3-pack ($32), arm sleeves ($22), clip-on towel ($18), polarized sunglasses ($48), ball retriever ($24), alignment sticks ($24), magnetic divot tool ($18), putter grip ($28), putting mat ($48). All at wyxgolfsupply.com with WYX10 for 10% off.'],
  ['What golf accessory improves your game the most in 2026?', 'A GPS laser rangefinder ($119) — used on every approach shot, reduces approach anxiety immediately, and produces visible scoring improvement from round 1. Second: alignment sticks ($24) — fixes the aim problem most golfers carry for years without knowing it, costs less than a range bucket.'],
  ['What golf accessories are worth the money in 2026?', 'Every item on this list meets a simple test: used at a specific recurring point in every round, not purchased once and stored. The GPS rangefinder (every approach), towel (every hole), glove (every round), retriever (every water hazard), and divot tool (every approach) all clear this bar. These are the accessories that justify their price through frequency of use.']
];

const jsonLd = {
  '@context': 'https://schema.org', '@type': 'FAQPage',
  mainEntity: faqs.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } }))
};

function bestOfScore(product: Awaited<ReturnType<typeof getProducts>>[number]) {
  let score = productQualityScore(product);
  if (/rangefinder|glove|sleeve|towel|sunglass|retriever|alignment|divot|putter grip|putting mat/i.test(product.title)) score += 10;
  return score;
}

export default async function BestGolfAccessories2026Page() {
  const allProducts = availableProducts(await getProducts());
  const products = allProducts.sort((a, b) => bestOfScore(b) - bestOfScore(a)).slice(0, 12);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org', '@type': 'CollectionPage', name: 'Best Golf Accessories 2026', url: `${siteUrl}/best-golf-accessories-2026`,
        breadcrumb: { '@type': 'BreadcrumbList', itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
          { '@type': 'ListItem', position: 2, name: 'Best Golf Accessories 2026', item: `${siteUrl}/best-golf-accessories-2026` }
        ]}
      }) }} />

      <section className="deal-hero">
        <div>
          <p className="eyebrow">Best Golf Accessories 2026</p>
          <h1>The 10 Best Golf Accessories for 2026. Ranked by Use and Impact.</h1>
          <p>Ten accessories across every category — ranked by how frequently they are actually used, how directly they improve scoring, and how long they remain useful per dollar spent. GPS rangefinder to putting mat, gloves to alignment sticks. WYX10 saves 10% on every item.</p>
          <div className="actions">
            <Link className="button primary" href="#best-of-grid">Shop the Best 10</Link>
            <Link className="button secondary dark" href="/golf-gifts">Gift Ideas &rarr;</Link>
          </div>
          <p style={{ marginTop: '1rem', fontSize: '0.875rem', opacity: 0.8 }}>Use <strong>WYX10</strong> at checkout for 10% off every order.</p>
        </div>
        <aside className="share-card">
          <p className="eyebrow">#1 Pick — $119</p>
          <h2>GPS Laser Rangefinder</h2>
          <p>Every approach shot, every round. Slope-compensating, 5-yard accuracy, USB-C rechargeable. The accessory that makes the entire game feel different from hole 1 — and continues to deliver value across years of use.</p>
          <Link className="button primary" href="/golf-tech-gifts" style={{ marginTop: '1rem', display: 'inline-block' }}>See the Rangefinder &rarr;</Link>
        </aside>
      </section>

      <section className="deal-strip" aria-label="Best accessories 2026 highlights">
        <span>GPS rangefinder — #1 pick</span><span>10 accessories ranked</span><span>Every budget covered</span><span>WYX10 saves 10%</span>
      </section>

      <section className="section reveal" aria-labelledby="picks-heading">
        <div className="section-heading"><p className="eyebrow">10 Best Picks for 2026</p><h2 id="picks-heading">Best Golf Accessories 2026.</h2></div>
        <div className="care-step-grid">
          {picks.map((p) => (
            <Link key={p.label} href={p.href} className="care-step-card" style={{ textDecoration: 'none' }}>
              <small style={{ opacity: 0.6, fontWeight: 600, display: 'block' }}>{p.rank} {p.cat}</small>
              <strong>{p.label} — {p.price}</strong><p>{p.why}</p>
            </Link>
          ))}
        </div>
      </section>

      <section id="best-of-grid" className="section product-section">
        <div className="section-heading split">
          <div><p className="eyebrow">Shop the Best 10</p><h2>Best Golf Accessories 2026.</h2></div>
          <Link className="text-link" href="/golf-accessories-every-golfer-needs">Full Accessories Guide &rarr;</Link>
        </div>
        {products.length
          ? <div className="product-grid">{products.map((p) => <ProductCard key={p.id} product={p} />)}</div>
          : <div className="care-step-grid">
              <Link href="/golf-tech-gifts" className="care-step-card" style={{ textDecoration: 'none' }}><strong>GPS Rangefinder — $119</strong><p>#1 — used every approach</p></Link>
              <Link href="/golf-gloves" className="care-step-card" style={{ textDecoration: 'none' }}><strong>Glove 3-Pack — $32</strong><p>#2 — used every round</p></Link>
              <Link href="/golf-arm-sleeves" className="care-step-card" style={{ textDecoration: 'none' }}><strong>Arm Sleeves — $22</strong><p>#3 — all-day sun protection</p></Link>
              <Link href="/golf-ball-retriever" className="care-step-card" style={{ textDecoration: 'none' }}><strong>Ball Retriever — $24</strong><p>#6 — overlooked essential</p></Link>
            </div>
        }
      </section>

      <section className="section reveal" aria-labelledby="faq-heading">
        <div className="section-heading"><p className="eyebrow">Questions</p><h2 id="faq-heading">Best Golf Accessories 2026 FAQ.</h2></div>
        <div className="care-step-grid">
          {faqs.map(([q, a]) => (<div key={q} className="care-step-card"><strong>{q}</strong><p>{a}</p></div>))}
        </div>
      </section>

      <EmailCapture source="best-golf-accessories-2026" campaign="best_2026" title="The 10 Best Golf Accessories for 2026." body="Join the WYX list for seasonal picks and 10% off your first order with WYX10." />
    </>
  );
}
