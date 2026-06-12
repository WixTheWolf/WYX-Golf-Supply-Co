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
  title: "Golf Club Care Kit — Groove Cleaning, Grip Regrip & Shaft Polish | WYX Golf Supply Co.",
  description: "Golf club care kit — a microfiber towel, groove brush, iron regrip kit with grip tape, and shaft polish. The four tools that maintain club performance between seasons. Under $80 complete. WYX10 saves 10%.",
  alternates: { canonical: '/golf-club-care-kit' },
  openGraph: {
    title: "Golf Club Care Kit | WYX Golf Supply Co.",
    description: "Golf club care — towel, groove brush, regrip kit, shaft polish. Complete club maintenance under $80. WYX10 saves 10%.",
    url: '/golf-club-care-kit'
  }
};

const items = [
  { step: '01', label: 'Clip-On Microfiber Towel', price: '$18', href: '/golf-towels', why: 'The on-course care tool used every hole. One side for groove scrubbing, one side for face drying. The baseline club care item — without it, dirt and grass compound in the grooves across 18 holes.' },
  { step: '02', label: 'Groove Brush with Pick', price: '$12', href: '/golf-club-care-kit', why: 'A stiff-bristle brush with a groove pick for deep cleaning after rounds. Removes compacted mud and grass from irons that a towel alone cannot reach. Used once per round at the bag. Keeps iron launch conditions consistent.' },
  { step: '03', label: 'Iron Regrip Kit — Full Set', price: '$38', href: '/golf-grips', why: 'A full iron regrip kit with new grip tape and 9 replacement grips. Worn grips lose tackiness over time, which can affect feel and grip pressure. A full set regrip costs $38 DIY vs. $80-150 at a shop — about 45 minutes of work for a fresh set of grips.' },
  { step: '04', label: 'Shaft Polish — Stainless & Chrome', price: '$14', href: '/golf-club-care-kit', why: 'Polish removes oxidation and micro-scratches from steel shafts and club heads that accumulate over a season. A polished iron set makes any bag look well-maintained — the visible care that signals a golfer who respects their equipment.' }
];

const faqs: [string, string][] = [
  ['What do I need to clean my golf clubs?', 'Four items: clip-on towel ($18 — on-course groove care), groove brush ($12 — post-round deep clean), regrip kit ($38 — for regripping at home), shaft polish ($14 — removes seasonal oxidation). Total: $82 before WYX10. All at wyxgolfsupply.com with WYX10 for 10% off.'],
  ['How often should I regrip my golf clubs?', 'Most teaching professionals recommend regripping once a year for regular golfers, or more often for golfers playing 40+ rounds. Worn grips can feel slick and may affect grip pressure and feel. A full regrip kit ($38) is a low-cost way to refresh a set at home.'],
  ['Does cleaning golf clubs help during a round?', 'Clean grooves can help produce more consistent contact on approach shots, while packed grooves can lead to unpredictable launch and spin. A towel ($18) and a groove brush ($12) make it easy to wipe clubs down between shots.']
];

const jsonLd = {
  '@context': 'https://schema.org', '@type': 'FAQPage',
  mainEntity: faqs.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } }))
};

function careScore(product: Awaited<ReturnType<typeof getProducts>>[number]) {
  let score = productQualityScore(product);
  if (/towel|grip|brush|polish|care/i.test(product.title)) score += 10;
  return score;
}

export default async function GolfClubCareKitPage() {
  const allProducts = availableProducts(await getProducts());
  const products = allProducts.sort((a, b) => careScore(b) - careScore(a)).slice(0, 10);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org', '@type': 'CollectionPage', name: 'Golf Club Care Kit', url: `${siteUrl}/golf-club-care-kit`,
        breadcrumb: { '@type': 'BreadcrumbList', itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
          { '@type': 'ListItem', position: 2, name: 'Golf Club Care Kit', item: `${siteUrl}/golf-club-care-kit` }
        ]}
      }) }} />

      <section className="deal-hero">
        <div>
          <p className="eyebrow">Club Care &amp; Maintenance</p>
          <h1>Golf Club Care Kit. Four Tools For Keeping Clubs In Shape.</h1>
          <p>A clip-on towel for on-course groove care, a groove brush for post-round deep cleaning, an iron regrip kit for regripping at home, and shaft polish for protecting the steel. Complete club care for $82 before WYX10. WYX10 saves 10%.</p>
          <div className="actions">
            <Link className="button primary" href="#care-grid">Shop Club Care</Link>
            <Link className="button secondary dark" href="/golf-grips">Golf Grips &rarr;</Link>
          </div>
          <p style={{ marginTop: '1rem', fontSize: '0.875rem', opacity: 0.8 }}>Use <strong>WYX10</strong> at checkout for 10% off every order.</p>
        </div>
        <aside className="share-card">
          <p className="eyebrow">Best Value Care Item — $38</p>
          <h2>Iron Regrip Kit</h2>
          <p>Full set of 9 replacement grips + grip tape. Shop regrip: $80-150. DIY: $38. Worn grips can feel slick and affect grip pressure over time — an easy fix most golfers put off longer than they should.</p>
          <Link className="button primary" href="/golf-grips" style={{ marginTop: '1rem', display: 'inline-block' }}>See Grip Kits &rarr;</Link>
        </aside>
      </section>

      <section className="deal-strip" aria-label="Club care highlights">
        <span>Groove brush — $12</span><span>Regrip kit — $38</span><span>Complete care — $82 before WYX10</span><span>WYX10 saves 10%</span>
      </section>

      <section className="section reveal" aria-labelledby="care-picks-heading">
        <div className="section-heading"><p className="eyebrow">Four Care Items</p><h2 id="care-picks-heading">Golf Club Care Kit.</h2></div>
        <div className="care-step-grid">
          {items.map((item) => (
            <Link key={item.label} href={item.href} className="care-step-card" style={{ textDecoration: 'none' }}>
              <small style={{ opacity: 0.6, fontWeight: 600, display: 'block' }}>{item.step}</small>
              <strong>{item.label} — {item.price}</strong><p>{item.why}</p>
            </Link>
          ))}
        </div>
      </section>

      <section id="care-grid" className="section product-section">
        <div className="section-heading split">
          <div><p className="eyebrow">Shop Club Care</p><h2>Golf Club Care.</h2></div>
          <Link className="text-link" href="/golf-grips">Golf Grips &rarr;</Link>
        </div>
        {products.length
          ? <div className="product-grid">{products.map((p) => <ProductCard key={p.id} product={p} />)}</div>
          : <div className="care-step-grid">
              <Link href="/golf-towels" className="care-step-card" style={{ textDecoration: 'none' }}><strong>Microfiber Towel — $18</strong><p>On-course groove care</p></Link>
              <Link href="/golf-grips" className="care-step-card" style={{ textDecoration: 'none' }}><strong>Regrip Kit — $38</strong><p>Full set, DIY</p></Link>
            </div>
        }
      </section>

      <section className="section reveal" aria-labelledby="faq-heading">
        <div className="section-heading"><p className="eyebrow">Questions</p><h2 id="faq-heading">Golf Club Care FAQ.</h2></div>
        <div className="care-step-grid">
          {faqs.map(([q, a]) => (<div key={q} className="care-step-card"><strong>{q}</strong><p>{a}</p></div>))}
        </div>
      </section>

      <EmailCapture source="golf-club-care-kit" campaign="club_care" title="Club Care Kit. Four Tools. All Season Performance." body="Join the WYX list for club care guides and 10% off your first order with WYX10." />
    </>
  );
}
