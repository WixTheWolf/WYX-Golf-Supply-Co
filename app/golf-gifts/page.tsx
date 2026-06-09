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
  title: "Golf Gifts — The Best Golf Gift Ideas for Any Golfer | WYX Golf Supply Co.",
  description: "Golf gifts for every golfer, every budget, and every occasion — from $16 ball markers to $119 leather rangefinder cases. Practical accessories used every round. WYX10 saves 10%.",
  alternates: { canonical: '/golf-gifts' },
  openGraph: {
    title: "Golf Gifts | WYX Golf Supply Co.",
    description: "Golf gifts for him, her, dad, the boss — practical accessories used every round, not another sleeve of balls. WYX10 saves 10% at WYX Golf Supply Co.",
    url: '/golf-gifts'
  }
};

const budgets = [
  { label: 'Under $20', href: '/golf-gifts-under-25', desc: 'Ball markers, towels, tees — the bag essentials under $20 that every golfer uses and almost none have bought themselves.' },
  { label: '$20–$50', href: '/golf-gifts-under-50', desc: 'Alignment sticks, glove 3-packs, chipping nets — the sweet-spot practical gifts under $50 that produce real improvement.' },
  { label: '$50–$100', href: '/best-golf-gifts-under-100', desc: 'Putting mats, leather scorecard holders, night golf kits — the $100 golf gift tier that feels substantial without feeling extravagant.' },
  { label: '$100–$150', href: '/golf-gifts-under-150', desc: 'GPS rangefinders, premium leather accessories, the full practice setup — golf gifts for the serious golfer under $150.' }
];

const occasions = [
  { label: 'Golf Gifts for Dad', href: '/golf-gifts-for-dad' },
  { label: 'Golf Gifts for Him', href: '/golf-gifts-for-men' },
  { label: 'Golf Gifts for Her', href: '/golf-gifts-for-women' },
  { label: 'Golf Gifts for the Boss', href: '/golf-gifts-for-boss' },
  { label: 'Golf Birthday Gifts', href: '/golf-birthday-gifts' },
  { label: 'Golf Corporate Gifts', href: '/golf-corporate-gifts' },
  { label: 'Golf Tournament Prizes', href: '/golf-tournament-prizes' },
  { label: 'Golf Stocking Stuffers', href: '/golf-stocking-stuffers' }
];

const topPicks = [
  { label: 'Hat Clip Ball Marker Set', price: '$16', href: '/golf-ball-markers', tag: 'Under $20' },
  { label: 'Clip-On Microfiber Towel', price: '$18', href: '/golf-towels', tag: 'Most Used' },
  { label: 'Alignment Sticks 2-Pack', price: '$24', href: '/golf-training-aids', tag: 'Best Improvement' },
  { label: 'Cabretta Glove 3-Pack', price: '$32', href: '/golf-gloves', tag: 'Most Practical' },
  { label: 'Night Golf LED Ball Set', price: '$42', href: '/golf-balls', tag: 'Most Fun' },
  { label: 'Putting Mat — 9-Foot', price: '$54', href: '/golf-putting-mat', tag: 'Best Under $60' }
];

const faqs: [string, string][] = [
  ['What are the best golf gifts?', 'By budget: under $20 — hat clip ball marker set ($16) or microfiber towel ($18); $20–$50 — alignment sticks ($24), glove 3-pack ($32), or chipping net ($44); $50–$100 — putting mat ($54) or leather scorecard holder ($79); $100–$150 — GPS rangefinder ($119). All available at wyxgolfsupply.com with WYX10 for 10% off.'],
  ['What are golf gifts that every golfer actually uses?', 'The five accessories that live in every bag: gloves (used every round), a towel (used every hole), ball markers (used every green), a ball retriever (used every water hazard), and alignment sticks (used every range session). These are the practical gifts that earn permanent bag spots.'],
  ['What golf gift is the safest for someone you don&apos;t know well?', 'A clip-on microfiber towel ($18) — zero size risk, zero preference risk, zero equipment brand knowledge required. Every golfer needs one. Most are using the fraying towel that came with a bag purchase years ago. The microfiber upgrade is universally appreciated.']
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

function giftScore(product: Awaited<ReturnType<typeof getProducts>>[number]) {
  let score = productQualityScore(product);
  if (/glove|towel|marker|alignment|putting mat|retriever/i.test(product.title)) score += 8;
  return score;
}

export default async function GolfGiftsPage() {
  const allProducts = availableProducts(await getProducts());
  const products = allProducts
    .sort((a, b) => giftScore(b) - giftScore(a))
    .slice(0, 10);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: 'Golf Gifts',
        url: `${siteUrl}/golf-gifts`,
        breadcrumb: {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
            { '@type': 'ListItem', position: 2, name: 'Golf Gifts', item: `${siteUrl}/golf-gifts` }
          ]
        }
      }) }} />

      <section className="deal-hero">
        <div>
          <p className="eyebrow">Golf Gifts</p>
          <h1>Golf Gifts. The Practical Accessories That Earn a Permanent Bag Spot.</h1>
          <p>Not another sleeve of balls. Not a novelty putting cup. These are the six accessories used every round — the ones every golfer actually needs and few buy themselves. From $16 to $119. WYX10 saves 10% on every order.</p>
          <div className="actions">
            <Link className="button primary" href="#gifts-grid">Shop Golf Gifts</Link>
            <Link className="button secondary dark" href="/golf-gifts-for-dad">Golf Gifts for Dad &rarr;</Link>
          </div>
          <p style={{ marginTop: '1rem', fontSize: '0.875rem', opacity: 0.8 }}>
            Use <strong>WYX10</strong> at checkout for 10% off every order.
          </p>
        </div>
        <aside className="share-card">
          <p className="eyebrow">Safest Golf Gift</p>
          <h2>Microfiber Towel</h2>
          <p>$18. Zero size risk. Used every hole. Every golfer needs one and most are using the fraying one from years ago. The universal golf gift that is right for any golfer on any occasion.</p>
          <Link className="button primary" href="/golf-towels" style={{ marginTop: '1rem', display: 'inline-block' }}>See the Towel &rarr;</Link>
        </aside>
      </section>

      <section className="deal-strip" aria-label="Golf gift highlights">
        <span>From $16 to $119</span>
        <span>No size guesswork on most picks</span>
        <span>WYX10 saves 10%</span>
        <span>Ships in 1-3 days</span>
      </section>

      <section className="section reveal" aria-labelledby="budget-heading">
        <div className="section-heading">
          <p className="eyebrow">By Budget</p>
          <h2 id="budget-heading">Golf Gift Guides by Budget.</h2>
        </div>
        <div className="care-step-grid">
          {budgets.map((b) => (
            <Link key={b.label} href={b.href} className="care-step-card" style={{ textDecoration: 'none' }}>
              <strong>{b.label}</strong>
              <p>{b.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="section reveal" aria-labelledby="picks-heading">
        <div className="section-heading">
          <p className="eyebrow">Top Six Picks</p>
          <h2 id="picks-heading">Best Golf Gifts Across All Budgets.</h2>
        </div>
        <div className="care-step-grid">
          {topPicks.map((pick) => (
            <Link key={pick.label} href={pick.href} className="care-step-card" style={{ textDecoration: 'none' }}>
              <small style={{ opacity: 0.6, fontWeight: 600, display: 'block' }}>{pick.tag}</small>
              <strong>{pick.label} — {pick.price}</strong>
            </Link>
          ))}
        </div>
      </section>

      <section className="section reveal" aria-labelledby="occasions-heading">
        <div className="section-heading">
          <p className="eyebrow">By Recipient &amp; Occasion</p>
          <h2 id="occasions-heading">Golf Gifts for Every Occasion.</h2>
        </div>
        <div className="care-step-grid">
          {occasions.map((o) => (
            <Link key={o.label} href={o.href} className="care-step-card" style={{ textDecoration: 'none' }}>
              <strong>{o.label}</strong>
            </Link>
          ))}
        </div>
      </section>

      <section id="gifts-grid" className="section product-section">
        <div className="section-heading">
          <p className="eyebrow">Shop Now</p>
          <h2>Golf Gifts.</h2>
        </div>
        {products.length
          ? <div className="product-grid">{products.map((p) => <ProductCard key={p.id} product={p} />)}</div>
          : (
            <div className="care-step-grid">
              <Link href="/golf-ball-markers" className="care-step-card" style={{ textDecoration: 'none' }}><strong>Ball Markers — $16</strong><p>Hat clip + 3 markers</p></Link>
              <Link href="/golf-towels" className="care-step-card" style={{ textDecoration: 'none' }}><strong>Microfiber Towel — $18</strong><p>Used every hole</p></Link>
              <Link href="/golf-training-aids" className="care-step-card" style={{ textDecoration: 'none' }}><strong>Alignment Sticks — $24</strong><p>Fastest improvement</p></Link>
              <Link href="/golf-putting-mat" className="care-step-card" style={{ textDecoration: 'none' }}><strong>Putting Mat — $54</strong><p>Home putting studio</p></Link>
            </div>
          )
        }
      </section>

      <section className="section reveal" aria-labelledby="faq-heading">
        <div className="section-heading">
          <p className="eyebrow">Questions</p>
          <h2 id="faq-heading">Golf Gifts FAQ.</h2>
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
        source="golf-gifts"
        campaign="golf_gifts"
        title="Golf Gifts That Earn a Permanent Bag Spot."
        body="Join the WYX list for gift guides, new products, and 10% off your first order with WYX10."
      />
    </>
  );
}
