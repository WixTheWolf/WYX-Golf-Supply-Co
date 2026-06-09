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
  title: "Golf Grips — Regrip Kits, Putter Grips & Grip Tools | WYX Golf Supply Co.",
  description: "Golf grips and regripping supplies — putter grips, iron grip kits, grip tape, and grip solvent. The most overlooked equipment upgrade in golf. WYX10 saves 10%.",
  alternates: { canonical: '/golf-grips' },
  openGraph: {
    title: "Golf Grips | WYX Golf Supply Co.",
    description: "Golf grips that restore contact confidence — putter grips, iron grip kits, grip tape, and solvent. The most overlooked equipment upgrade. WYX10 saves 10%.",
    url: '/golf-grips'
  }
};

const picks = [
  {
    label: 'Putter Grip — Pistol Style',
    price: '$28',
    href: '/golf-grips',
    tag: 'Most Impactful',
    why: 'Putting is 40% of score. A new putter grip restores the tactile feedback that worn rubber slowly removes over months of use. The pistol-style profile locks the wrist angle and eliminates excess rotation through impact. The single equipment upgrade with the fastest putting improvement ROI.'
  },
  {
    label: 'Iron Grip Regrip Kit — 13 Grips',
    price: '$64',
    href: '/golf-grips',
    tag: 'Full Set Upgrade',
    why: '13 midsize rubber grips + tape + solvent. Complete iron set regrip for the golfer who has been playing on worn rubber for a season or more. Worn grips create grip pressure anxiety — the overgripping habit that destroys consistent ball-striking. A full regrip removes the problem at the source.'
  },
  {
    label: 'Golf Grip Tape Roll — 72 Strips',
    price: '$18',
    href: '/golf-grips',
    tag: 'DIY Regrip',
    why: '72 strips of double-sided grip tape — enough for a full set regrip and two additional clubs. The supply for the golfer who regrips at home. Pairs with grip solvent for a 20-minute full regrip job that restores contact confidence without a club shop visit.'
  }
];

const faqs: [string, string][] = [
  ['How often should golf grips be replaced?', 'Every 40 rounds or once per season — whichever comes first. Worn grips lose tackiness, which leads to grip pressure increases, which leads to tension in the forearms, which destroys ball-striking consistency. A new grip set ($64 for 13 grips) is the most overlooked equipment upgrade in golf.'],
  ['What is the best golf putter grip?', 'A pistol-style putter grip ($28) — the profile locks the wrist angle and eliminates excess rotation through impact. The best putter grip is also the freshest one: worn putter rubber loses the tacky feedback that enables light-pressure putting. Replace annually for consistent results.'],
  ['Is regripping golf clubs worth it?', 'Yes — it is the highest-ROI equipment upgrade available per dollar spent. A full iron set regrip ($64) restores the contact confidence that worn grips slowly remove over a season. Most golfers who have never regripped are playing on grips 2-3 seasons past replacement — the improvement in grip feel is immediate and significant.']
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

function gripScore(product: Awaited<ReturnType<typeof getProducts>>[number]) {
  let score = productQualityScore(product);
  if (/grip/i.test(product.title)) score += 15;
  if (/putter grip|regrip|grip tape|grip kit/i.test(product.title)) score += 8;
  return score;
}

export default async function GolfGripsPage() {
  const allProducts = availableProducts(await getProducts());
  const products = allProducts
    .sort((a, b) => gripScore(b) - gripScore(a))
    .slice(0, 10);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: 'Golf Grips',
        url: `${siteUrl}/golf-grips`,
        breadcrumb: {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
            { '@type': 'ListItem', position: 2, name: 'Golf Grips', item: `${siteUrl}/golf-grips` }
          ]
        }
      }) }} />

      <section className="deal-hero">
        <div>
          <p className="eyebrow">Golf Grips</p>
          <h1>Golf Grips. The Most Overlooked Equipment Upgrade in Golf.</h1>
          <p>Worn grips create grip pressure anxiety. Grip pressure anxiety creates forearm tension. Forearm tension destroys ball-striking. A new putter grip ($28) or a full iron regrip kit ($64) removes the problem at the source — and is the most overlooked equipment improvement available per dollar spent.</p>
          <div className="actions">
            <Link className="button primary" href="#grips-grid">Shop Golf Grips</Link>
            <Link className="button secondary dark" href="/golf-club-care">Club Care Guide &rarr;</Link>
          </div>
          <p style={{ marginTop: '1rem', fontSize: '0.875rem', opacity: 0.8 }}>
            Use <strong>WYX10</strong> at checkout for 10% off every order.
          </p>
        </div>
        <aside className="share-card">
          <p className="eyebrow">Most Impactful Upgrade</p>
          <h2>Putter Grip</h2>
          <p>$28. Putting is 40% of score. A new pistol-style putter grip locks wrist angle, restores tacky feedback, and eliminates the grip pressure anxiety that worn rubber slowly builds over a season. The single equipment upgrade with the fastest putting ROI.</p>
          <Link className="button primary" href="#grips-grid" style={{ marginTop: '1rem', display: 'inline-block' }}>Shop Grips &rarr;</Link>
        </aside>
      </section>

      <section className="deal-strip" aria-label="Golf grip highlights">
        <span>Putter grips</span>
        <span>Full iron regrip kits</span>
        <span>DIY grip tape</span>
        <span>WYX10 saves 10%</span>
      </section>

      <section className="section reveal" aria-labelledby="picks-heading">
        <div className="section-heading">
          <p className="eyebrow">Three Grip Picks</p>
          <h2 id="picks-heading">Golf Grips. Putter, Iron Set &amp; DIY.</h2>
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

      <section id="grips-grid" className="section product-section">
        <div className="section-heading split">
          <div>
            <p className="eyebrow">Shop Golf Grips</p>
            <h2>Golf Grips.</h2>
          </div>
          <Link className="text-link" href="/golf-club-care">Club Care Guide &rarr;</Link>
        </div>
        {products.length
          ? <div className="product-grid">{products.map((p) => <ProductCard key={p.id} product={p} />)}</div>
          : (
            <div className="care-step-grid">
              <Link href="/golf-grips" className="care-step-card" style={{ textDecoration: 'none' }}><strong>Putter Grip — $28</strong><p>Pistol style, wrist-locking profile</p></Link>
              <Link href="/golf-grips" className="care-step-card" style={{ textDecoration: 'none' }}><strong>Iron Regrip Kit — $64</strong><p>13 grips + tape + solvent</p></Link>
              <Link href="/golf-grips" className="care-step-card" style={{ textDecoration: 'none' }}><strong>Grip Tape Roll — $18</strong><p>72 strips, full set supply</p></Link>
            </div>
          )
        }
      </section>

      <section className="section reveal" aria-labelledby="faq-heading">
        <div className="section-heading">
          <p className="eyebrow">Questions</p>
          <h2 id="faq-heading">Golf Grips FAQ.</h2>
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
        source="golf-grips"
        campaign="golf_grips"
        title="Golf Grips. The Equipment Upgrade Most Golfers Skip."
        body="Join the WYX list for regripping guides, new product drops, and 10% off your first order with WYX10."
      />
    </>
  );
}
