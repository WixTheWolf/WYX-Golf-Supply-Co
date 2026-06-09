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
  title: "Golf Bag Upgrades — Accessories That Upgrade Any Existing Bag | WYX Golf Supply Co.",
  description: "Golf bag upgrades that improve any existing bag without buying a new one — GPS rangefinder, putter grip, leather scorecard holder, and the accessories that change how the bag performs. WYX10 saves 10%.",
  alternates: { canonical: '/bag-upgrades' },
  openGraph: {
    title: "Golf Bag Upgrades | WYX Golf Supply Co.",
    description: "Upgrade any golf bag without replacing it — GPS rangefinder, putter grip, scorecard holder, premium accessories. WYX10 saves 10%.",
    url: '/bag-upgrades'
  }
};

const upgrades = [
  { label: 'GPS Laser Rangefinder', price: '$119', href: '/golf-tech-gifts', tag: 'Performance Upgrade', why: 'The single accessory addition that changes how every approach is planned. Used on every hole, charged weekly, owned for years. The bag upgrade with the most direct score improvement connection available.' },
  { label: 'Putter Grip — Pistol Style', price: '$28', href: '/golf-grips', tag: 'Equipment Upgrade', why: 'A new putter grip restores the tacky feedback that worn rubber slowly removes over a season of play. Putting is 40% of score — the putter grip is the equipment upgrade with the fastest putting improvement ROI per dollar spent.' },
  { label: 'Leather Scorecard Holder', price: '$79', href: '/golf-gifts-for-men', tag: 'Prestige Upgrade', why: 'Full-grain leather scorecard holder with magnetic closure. The bag upgrade that signals a player who takes their game seriously — and replaces the bent cardboard scorecard that most golfers still carry in the back pocket.' },
  { label: 'Cart Organizer Caddie — 6-Pocket', price: '$38', href: '/bag-upgrades', tag: 'Organization Upgrade', why: 'A cart bag organizer with six separate pockets for balls, tees, markers, snacks, sunscreen, and valuables. Attaches to any cart rail in 30 seconds. The bag upgrade for golfers who spend 30 seconds searching for a tee before every hole.' }
];

const faqs: [string, string][] = [
  ['What are the best golf bag upgrades?', 'Four upgrades: GPS rangefinder ($119 — performance), putter grip ($28 — equipment), leather scorecard holder ($79 — prestige), cart organizer ($38 — organization). Together they change how the bag performs on every hole. All at wyxgolfsupply.com with WYX10 for 10% off.'],
  ['What is the best single upgrade for a golf bag?', 'A GPS laser rangefinder ($119) — used on every hole, reduces approach anxiety, and produces visible scoring improvement immediately. Second: a new putter grip ($28) — the equipment upgrade most golfers delay for too long and immediately notice when they finally make the change.'],
  ['What golf accessories upgrade the bag without replacing it?', 'The GPS rangefinder ($119) adds performance data to any bag. The putter grip ($28) upgrades the most-used club. The leather scorecard holder ($79) replaces the back-pocket cardboard. The cart organizer ($38) reorganizes any existing bag layout. All at wyxgolfsupply.com with WYX10.']
];

const jsonLd = {
  '@context': 'https://schema.org', '@type': 'FAQPage',
  mainEntity: faqs.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } }))
};

function upgradeScore(product: Awaited<ReturnType<typeof getProducts>>[number]) {
  let score = productQualityScore(product);
  if (/rangefinder|putter grip|scorecard|organizer/i.test(product.title)) score += 10;
  return score;
}

export default async function BagUpgradesPage() {
  const allProducts = availableProducts(await getProducts());
  const products = allProducts.sort((a, b) => upgradeScore(b) - upgradeScore(a)).slice(0, 10);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org', '@type': 'CollectionPage', name: 'Golf Bag Upgrades', url: `${siteUrl}/bag-upgrades`,
        breadcrumb: { '@type': 'BreadcrumbList', itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
          { '@type': 'ListItem', position: 2, name: 'Bag Upgrades', item: `${siteUrl}/bag-upgrades` }
        ]}
      }) }} />

      <section className="deal-hero">
        <div>
          <p className="eyebrow">Upgrade Any Golf Bag</p>
          <h1>Golf Bag Upgrades. Four Additions That Change How Any Bag Performs.</h1>
          <p>A GPS rangefinder for every approach, a new putter grip for the most-used club, a leather scorecard holder instead of bent cardboard, and a cart organizer that ends the 30-second tee search. Four upgrades, no new bag required. WYX10 saves 10%.</p>
          <div className="actions">
            <Link className="button primary" href="#upgrades-grid">Shop Bag Upgrades</Link>
            <Link className="button secondary dark" href="/golf-tech-gifts">Golf Tech Gifts &rarr;</Link>
          </div>
          <p style={{ marginTop: '1rem', fontSize: '0.875rem', opacity: 0.8 }}>Use <strong>WYX10</strong> at checkout for 10% off every order.</p>
        </div>
        <aside className="share-card">
          <p className="eyebrow">Biggest Performance Upgrade</p>
          <h2>GPS Rangefinder</h2>
          <p>$119. Every approach shot changes when you know the exact number. Slope compensation, 5-yard accuracy, USB-C rechargeable. The bag upgrade that makes the round feel different from hole 1.</p>
          <Link className="button primary" href="/golf-tech-gifts" style={{ marginTop: '1rem', display: 'inline-block' }}>See the Rangefinder &rarr;</Link>
        </aside>
      </section>

      <section className="deal-strip" aria-label="Bag upgrade highlights">
        <span>GPS rangefinder — $119</span><span>Putter grip — $28</span><span>Leather scorecard — $79</span><span>WYX10 saves 10%</span>
      </section>

      <section className="section reveal" aria-labelledby="upgrades-heading">
        <div className="section-heading"><p className="eyebrow">Four Upgrades</p><h2 id="upgrades-heading">Golf Bag Upgrades.</h2></div>
        <div className="care-step-grid">
          {upgrades.map((u) => (
            <Link key={u.label} href={u.href} className="care-step-card" style={{ textDecoration: 'none' }}>
              <small style={{ opacity: 0.6, fontWeight: 600, display: 'block' }}>{u.tag}</small>
              <strong>{u.label} — {u.price}</strong><p>{u.why}</p>
            </Link>
          ))}
        </div>
      </section>

      <section id="upgrades-grid" className="section product-section">
        <div className="section-heading split">
          <div><p className="eyebrow">Shop Bag Upgrades</p><h2>Golf Bag Upgrades.</h2></div>
          <Link className="text-link" href="/golf-gifts">All Golf Gifts &rarr;</Link>
        </div>
        {products.length
          ? <div className="product-grid">{products.map((p) => <ProductCard key={p.id} product={p} />)}</div>
          : <div className="care-step-grid">
              <Link href="/golf-tech-gifts" className="care-step-card" style={{ textDecoration: 'none' }}><strong>GPS Rangefinder — $119</strong><p>Performance upgrade</p></Link>
              <Link href="/golf-grips" className="care-step-card" style={{ textDecoration: 'none' }}><strong>Putter Grip — $28</strong><p>Equipment upgrade</p></Link>
              <Link href="/golf-gifts-for-men" className="care-step-card" style={{ textDecoration: 'none' }}><strong>Scorecard Holder — $79</strong><p>Prestige upgrade</p></Link>
              <Link href="/bag-upgrades" className="care-step-card" style={{ textDecoration: 'none' }}><strong>Cart Organizer — $38</strong><p>Organization upgrade</p></Link>
            </div>
        }
      </section>

      <section className="section reveal" aria-labelledby="faq-heading">
        <div className="section-heading"><p className="eyebrow">Questions</p><h2 id="faq-heading">Golf Bag Upgrade FAQ.</h2></div>
        <div className="care-step-grid">
          {faqs.map(([q, a]) => (<div key={q} className="care-step-card"><strong>{q}</strong><p>{a}</p></div>))}
        </div>
      </section>

      <EmailCapture source="bag-upgrades" campaign="bag_upgrades" title="Four Upgrades. Any Bag. Better Round." body="Join the WYX list for bag upgrade guides and 10% off your first order with WYX10." />
    </>
  );
}
