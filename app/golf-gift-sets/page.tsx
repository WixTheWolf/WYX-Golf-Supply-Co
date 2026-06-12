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
  title: "Golf Gift Sets — Curated Golf Gift Bundles for Any Budget | WYX Golf Supply Co.",
  description: "Golf gift sets curated by budget — a $50 starter set, $100 course kit, and $150 premium bundle. The accessories golfers use every single round, not the ones that collect dust in the garage. WYX10 saves 10%.",
  alternates: { canonical: '/golf-gift-sets' },
  openGraph: {
    title: "Golf Gift Sets | WYX Golf Supply Co.",
    description: "Golf gift sets by budget — $50, $100, and $150 curated bundles. Accessories that get used every round. WYX10 saves 10%.",
    url: '/golf-gift-sets'
  }
};

const sets = [
  { label: 'The Starter Set — Under $50', price: '$46', href: '/golf-gifts', tag: 'Budget Pick', why: 'Towel ($18) + markers ($16) + divot tool ($18) = $52 before WYX10. The three accessories used every single round — groove care, ball marking on the green, and divot repair. The correct starter golf gift that every golfer actually uses, not the novelty item they will use twice.' },
  { label: 'The Course Kit — Under $100', price: '$90', href: '/golf-gifts', tag: 'Most Popular Set', why: 'Glove 3-pack ($32) + towel ($18) + markers ($16) + retriever ($24) = $90 before WYX10. Adds the ball retriever (used at every water hazard) and fresh gloves (used every round) to the starter set. Four accessories, all functional, all used consistently across every round of the season.' },
  { label: 'The Premium Bundle — Under $150', price: '$139', href: '/golf-gifts-under-150', tag: 'Gift Set', why: 'Gloves ($32) + towel ($18) + markers ($16) + retriever ($24) + arm sleeves ($22) + alignment sticks ($24) = $136 before WYX10. Adds sun protection and the most underused training tool in the bag. The premium gift set that covers every common-use case from round 1 through the full season.' }
];

const faqs: [string, string][] = [
  ['What is a good golf gift set?', 'Three gift set tiers: Starter ($46 — towel, markers, divot tool), Course Kit ($90 — adds glove 3-pack and retriever), Premium Bundle ($136 — adds arm sleeves and alignment sticks). All at wyxgolfsupply.com with WYX10 for 10% off. Avoid novelty gifts — these are all used every round.'],
  ['What golf accessories actually get used?', 'In order of use frequency: gloves (every round), towel (every hole), ball markers (every green), divot tool (every approach), ball retriever (every water hazard). These five accessories are used at specific, recurring points in every single round — unlike novelty gifts that get used twice and then stored.'],
  ['How do I buy a golf gift set for someone I don\'t know very well?', 'Start with the Starter Set ($46 — towel, markers, divot tool) — three accessories with no size dimension and no skill-level requirement. Every golfer needs them, every golfer uses them consistently, and none of them require knowing the recipient\'s handicap or skill level to be a useful gift.']
];

const jsonLd = {
  '@context': 'https://schema.org', '@type': 'FAQPage',
  mainEntity: faqs.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } }))
};

function giftSetScore(product: Awaited<ReturnType<typeof getProducts>>[number]) {
  let score = productQualityScore(product);
  if (/glove|towel|marker|divot|retriever|sleeve/i.test(product.title)) score += 8;
  return score;
}

export default async function GolfGiftSetsPage() {
  const allProducts = availableProducts(await getProducts());
  const products = allProducts.sort((a, b) => giftSetScore(b) - giftSetScore(a)).slice(0, 10);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org', '@type': 'CollectionPage', name: 'Golf Gift Sets', url: `${siteUrl}/golf-gift-sets`,
        breadcrumb: { '@type': 'BreadcrumbList', itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
          { '@type': 'ListItem', position: 2, name: 'Golf Gift Sets', item: `${siteUrl}/golf-gift-sets` }
        ]}
      }) }} />

      <section className="deal-hero">
        <div>
          <p className="eyebrow">Golf Gift Sets</p>
          <h1>Golf Gift Sets. Curated by Budget. Used Every Round.</h1>
          <p>A $46 starter set, a $90 course kit, and a $136 premium bundle — all built from accessories that get used at specific recurring points in every round. Not novelty gifts. Gear that golfers actually reach for every time they play. WYX10 saves 10%.</p>
          <div className="actions">
            <Link className="button primary" href="#gift-grid">Shop Gift Sets</Link>
            <Link className="button secondary dark" href="/golf-gifts">All Golf Gifts &rarr;</Link>
          </div>
          <p style={{ marginTop: '1rem', fontSize: '0.875rem', opacity: 0.8 }}>Use <strong>WYX10</strong> at checkout for 10% off every order.</p>
        </div>
        <aside className="share-card">
          <p className="eyebrow">Most Popular — $90</p>
          <h2>The Course Kit</h2>
          <p>Glove 3-pack + towel + ball markers + ball retriever. Four accessories used every round — fresh grip, clean grooves, marked ball, retrieved water hazard balls. The complete first gift set for any golfer at any level.</p>
          <Link className="button primary" href="/golf-gifts" style={{ marginTop: '1rem', display: 'inline-block' }}>See All Golf Gifts &rarr;</Link>
        </aside>
      </section>

      <section className="deal-strip" aria-label="Golf gift set highlights">
        <span>Starter Set — $46</span><span>Course Kit — $90</span><span>Premium Bundle — $136</span><span>WYX10 saves 10%</span>
      </section>

      <section className="section reveal" aria-labelledby="sets-heading">
        <div className="section-heading"><p className="eyebrow">Three Gift Tiers</p><h2 id="sets-heading">Golf Gift Sets. By Budget.</h2></div>
        <div className="care-step-grid">
          {sets.map((s) => (
            <Link key={s.label} href={s.href} className="care-step-card" style={{ textDecoration: 'none' }}>
              <small style={{ opacity: 0.6, fontWeight: 600, display: 'block' }}>{s.tag}</small>
              <strong>{s.label} — {s.price}</strong><p>{s.why}</p>
            </Link>
          ))}
        </div>
      </section>

      <section id="gift-grid" className="section product-section">
        <div className="section-heading split">
          <div><p className="eyebrow">Shop Golf Gift Sets</p><h2>Golf Gifts.</h2></div>
          <Link className="text-link" href="/golf-gifts-under-150">Gifts Under $150 &rarr;</Link>
        </div>
        {products.length
          ? <div className="product-grid">{products.map((p) => <ProductCard key={p.id} product={p} />)}</div>
          : <div className="care-step-grid">
              <Link href="/golf-gloves" className="care-step-card" style={{ textDecoration: 'none' }}><strong>Glove 3-Pack — $32</strong><p>Every round</p></Link>
              <Link href="/golf-towels" className="care-step-card" style={{ textDecoration: 'none' }}><strong>Clip-On Towel — $18</strong><p>Every hole</p></Link>
              <Link href="/golf-ball-markers" className="care-step-card" style={{ textDecoration: 'none' }}><strong>Hat Clip Markers — $16</strong><p>Every green</p></Link>
              <Link href="/golf-ball-retriever" className="care-step-card" style={{ textDecoration: 'none' }}><strong>Ball Retriever — $24</strong><p>Every water hazard</p></Link>
            </div>
        }
      </section>

      <section className="section reveal" aria-labelledby="faq-heading">
        <div className="section-heading"><p className="eyebrow">Questions</p><h2 id="faq-heading">Golf Gift Set FAQ.</h2></div>
        <div className="care-step-grid">
          {faqs.map(([q, a]) => (<div key={q} className="care-step-card"><strong>{q}</strong><p>{a}</p></div>))}
        </div>
      </section>

      <section className="section reveal" aria-labelledby="links-heading">
        <div className="section-heading"><p className="eyebrow">More Gift Ideas</p><h2 id="links-heading">Golf Gifts by Recipient and Budget.</h2></div>
        <div className="care-step-grid">
          <Link href="/golf-gifts-under-25" className="care-step-card" style={{ textDecoration: 'none' }}><strong>Golf Gifts Under $25</strong><p>Five practical picks all used every round</p></Link>
          <Link href="/golf-gifts-for-dad" className="care-step-card" style={{ textDecoration: 'none' }}><strong>Golf Gifts for Dad</strong><p>Practical picks at every budget</p></Link>
          <Link href="/golf-gifts-for-men" className="care-step-card" style={{ textDecoration: 'none' }}><strong>Golf Gifts for Men</strong><p>Practical picks at every budget</p></Link>
          <Link href="/golf-stocking-stuffers" className="care-step-card" style={{ textDecoration: 'none' }}><strong>Golf Stocking Stuffers</strong><p>All the picks that fit in a stocking</p></Link>
          <Link href="/golf-corporate-gifts" className="care-step-card" style={{ textDecoration: 'none' }}><strong>Corporate Golf Gifts</strong><p>Client gifts, tournament prizes, group orders</p></Link>
        </div>
      </section>

      <EmailCapture source="golf-gift-sets" campaign="golf_gift_sets" title="Golf Gift Sets. Used Every Round." body="Join the WYX list for gift guides and 10% off your first order with WYX10." />
    </>
  );
}
