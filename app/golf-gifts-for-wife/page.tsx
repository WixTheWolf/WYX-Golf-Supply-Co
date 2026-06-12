import type { Metadata } from 'next';
import Link from 'next/link';
import { EmailCapture } from '@/components/EmailCapture';
import { ProductCard } from '@/components/ProductCard';
import { availableProducts } from '@/lib/catalog';
import { productPrice, siteUrl } from '@/lib/feed';
import { productQualityScore } from '@/lib/productQuality';
import { getProducts } from '@/lib/shopify/products';

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Golf Gifts for Wife — Thoughtful Picks She Will Actually Use on the Course | WYX Golf Supply Co.",
  description: "Golf gifts for your wife that earn a permanent bag spot — gloves, leather accessories, alignment sticks, and the practical picks she would never buy herself. WYX10 saves 10%.",
  alternates: { canonical: '/golf-gifts-for-wife' },
  openGraph: {
    title: "Golf Gifts for Wife | WYX Golf Supply Co.",
    description: "Golf gifts for a wife who golfs — practical picks used every round. Gloves, leather holders, training aids. WYX10 saves 10%.",
    url: '/golf-gifts-for-wife'
  }
};

const picks = [
  { label: 'Clip-On Microfiber Towel', price: '$18', href: '/golf-towels', tag: 'Under $20', why: 'Used every hole. Carabiner clip attaches to any bag D-ring. The gift that earns a bag spot in round 1 — and stays there for years.' },
  { label: 'Alignment Sticks 2-Pack', price: '$24', href: '/golf-training-aids', tag: 'Under $25', why: 'The training tool every instructor uses and almost no golfer owns. Two sticks, 10 minutes at the range — aim and alignment confirmed, not guessed.' },
  { label: 'Cabretta Glove 3-Pack', price: '$32', href: '/golf-gloves', tag: 'Under $35', why: 'Three fresh cabretta gloves — the consumable gift she uses every round and almost never restocks. Pick S for smaller hands, M/ML for average.' },
  { label: 'Leather Scorecard Holder', price: '$38', href: '/golf-scorecard-holder', tag: 'Under $40', why: 'Full-grain leather, pencil loop, ball marker pocket, engraving-ready front panel. The kind of small detail that gets noticed in the group.' },
  { label: 'Putting Alignment Mirror', price: '$32', href: '/golf-training-aids', tag: 'Practice Gift', why: 'Eye position, shoulder line, and putter path simultaneously — the same feedback a coach charges $100/hour for. Fits in any bag pocket.' },
  { label: 'GPS Golf Watch', price: '$149', href: '/golf-gps-watch', tag: 'Premium Gift', why: '40,000+ courses, front/middle/back on every hole, shot tracking. The wearable golf gift — no aiming, no carrying a device. Worn every round.' }
];

const faqs: [string, string][] = [
  ['What is the best golf gift for a wife?', 'By budget: under $20 — microfiber towel ($18); under $25 — alignment sticks ($24); under $35 — glove 3-pack ($32); under $40 — leather scorecard holder ($38); under $150 — GPS watch ($149). Available at wyxgolfsupply.com with WYX10 for 10% off.'],
  ['What golf gift works if I do not know her glove size?', 'Stick to size-free gifts: towel ($18), alignment sticks ($24), leather scorecard holder ($38), putting mirror ($32), or GPS watch ($149). All completely size-free. If you want the glove 3-pack, pick S for smaller hands or M/ML for average.'],
  ['Is a golf gift romantic?', 'A specific golf gift says you notice what she actually does. The leather scorecard holder with her initials engraved, a fresh glove 3-pack, or a GPS watch she has been considering are received as thoughtful rather than generic.']
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

function wifeGiftScore(product: Awaited<ReturnType<typeof getProducts>>[number]) {
  const price = Number(productPrice(product).amount);
  let score = productQualityScore(product);
  if (/glove|towel|scorecard|alignment|gps watch|mirror/i.test(product.title)) score += 8;
  if (price <= 40) score += 5;
  return score;
}

export default async function GolfGiftsForWifePage() {
  const allProducts = availableProducts(await getProducts());
  const products = allProducts
    .sort((a, b) => wifeGiftScore(b) - wifeGiftScore(a))
    .slice(0, 10);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: 'Golf Gifts for Wife',
        url: `${siteUrl}/golf-gifts-for-wife`,
        breadcrumb: {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
            { '@type': 'ListItem', position: 2, name: 'Golf Gifts', item: `${siteUrl}/golf-gifts` },
            { '@type': 'ListItem', position: 3, name: 'Golf Gifts for Wife', item: `${siteUrl}/golf-gifts-for-wife` }
          ]
        }
      }) }} />

      <section className="deal-hero">
        <div>
          <p className="eyebrow">For the Wife Who Golfs</p>
          <h1>Golf Gifts for Wife. Thoughtful Picks She Uses Every Round.</h1>
          <p>Not a novelty — accessories she uses every single round, the ones she knows she should have but never orders for herself. Six picks from $18 to $149. Ships in 1-3 days.</p>
          <div className="actions">
            <Link className="button primary" href="#wife-grid">Shop Golf Gifts for Wife</Link>
            <Link className="button secondary dark" href="/golf-gifts-for-women">Golf Gifts for Women &rarr;</Link>
          </div>
          <p style={{ marginTop: '1rem', fontSize: '0.875rem', opacity: 0.8 }}>
            Use <strong>WYX10</strong> at checkout for 10% off every order.
          </p>
        </div>
        <aside className="share-card">
          <p className="eyebrow">Best Gift Under $40</p>
          <h2>Leather Scorecard Holder</h2>
          <p>$38. Engraving-ready front panel. Full-grain leather, pencil loop, ball marker pocket. Used every round. Playing partners ask about it in round 1. Lasts a decade.</p>
          <Link className="button primary" href="/golf-scorecard-holder" style={{ marginTop: '1rem', display: 'inline-block' }}>See the Holder &rarr;</Link>
        </aside>
      </section>

      <section className="deal-strip" aria-label="Golf wife gift highlights">
        <span>Engraving-ready leather pick</span>
        <span>No size guesswork on 5 of 6</span>
        <span>WYX10 saves 10%</span>
        <span>Ships in 1-3 days</span>
      </section>

      <section className="section reveal" aria-labelledby="picks-heading">
        <div className="section-heading">
          <p className="eyebrow">Six Picks at Every Budget</p>
          <h2 id="picks-heading">Golf Gifts for Wife. Used Every Round.</h2>
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

      <section id="wife-grid" className="section product-section">
        <div className="section-heading">
          <p className="eyebrow">Shop Now</p>
          <h2>Golf Gifts for Wife.</h2>
        </div>
        {products.length
          ? <div className="product-grid">{products.map((p) => <ProductCard key={p.id} product={p} />)}</div>
          : (
            <div className="care-step-grid">
              <Link href="/golf-towels" className="care-step-card" style={{ textDecoration: 'none' }}><strong>Microfiber Towel — $18</strong><p>Used every hole</p></Link>
              <Link href="/golf-gloves" className="care-step-card" style={{ textDecoration: 'none' }}><strong>Glove 3-Pack — $32</strong><p>Used every round</p></Link>
              <Link href="/golf-scorecard-holder" className="care-step-card" style={{ textDecoration: 'none' }}><strong>Leather Scorecard Holder — $38</strong><p>Engraving-ready, lasts a decade</p></Link>
              <Link href="/golf-gps-watch" className="care-step-card" style={{ textDecoration: 'none' }}><strong>GPS Watch — $149</strong><p>Worn to every round</p></Link>
            </div>
          )
        }
      </section>

      <section className="section reveal" aria-labelledby="faq-heading">
        <div className="section-heading">
          <p className="eyebrow">Questions</p>
          <h2 id="faq-heading">Golf Gift for Wife FAQ.</h2>
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

      <section className="section reveal" aria-labelledby="more-heading">
        <div className="section-heading">
          <p className="eyebrow">More Gift Ideas</p>
          <h2 id="more-heading">More Golf Gift Guides.</h2>
        </div>
        <div className="care-step-grid">
          <Link href="/golf-gifts-for-mom" className="care-step-card" style={{ textDecoration: 'none' }}><strong>Golf Gifts for Mom</strong><p>All under $50 — practical bag essentials</p></Link>
          <Link href="/golf-gifts-for-anniversary" className="care-step-card" style={{ textDecoration: 'none' }}><strong>Golf Anniversary Gifts</strong><p>Engraved and elevated for a milestone occasion</p></Link>
          <Link href="/golf-gifts-for-women" className="care-step-card" style={{ textDecoration: 'none' }}><strong>Golf Gifts for Women</strong><p>Full range of picks for any woman who golfs</p></Link>
          <Link href="/golf-gifts-for-girlfriend" className="care-step-card" style={{ textDecoration: 'none' }}><strong>Golf Gifts for Girlfriend</strong><p>Budget tiers from $18 to $149</p></Link>
          <Link href="/golf-gifts-under-50" className="care-step-card" style={{ textDecoration: 'none' }}><strong>Under $50</strong><p>The practical budget that works for every occasion</p></Link>
        </div>
      </section>

      <EmailCapture
        source="golf-gifts-for-wife"
        campaign="wife_golf_gifts"
        title="Golf Gifts for the Wife Who Golfs."
        body="Join the WYX list for gift guides, seasonal picks, and 10% off your first order with WYX10."
      />
    </>
  );
}
