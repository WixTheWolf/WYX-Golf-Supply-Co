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
  title: "Best Golf Gifts Under $100 — Practical Picks at the Sweet-Spot Budget | WYX Golf Supply Co.",
  description: "The best golf gifts under $100 — leather scorecard holders, glove 3-packs, backyard chipping nets, putting mats, and a rangefinder that lands just under the mark. WYX10 saves 10%.",
  alternates: { canonical: '/best-golf-gifts-under-100' },
  openGraph: {
    title: "Best Golf Gifts Under $100 | WYX Golf Supply Co.",
    description: "Best golf gifts under $100 that get used every round. Scorecard holders, glove packs, chipping nets, putting mats, rangefinders. WYX10 saves 10%.",
    url: '/best-golf-gifts-under-100'
  }
};

const picks = [
  { label: 'Cabretta Glove 3-Pack', price: '$32', href: '/golf-gloves', why: 'The consumable golf gift that lands immediately. Three fresh cabretta gloves — used within the first round. No size risk at ML for most men. Under $35.' },
  { label: 'Leather Scorecard Holder', price: '$38', href: '/golf-scorecard-holder', why: 'Full-grain leather, engraving-ready, used every round. The elegant under-$40 pick that playing partners ask about. Lasts a decade.' },
  { label: 'Backyard Chipping Net 4-Target', price: '$44', href: '/golf-training-aids', why: 'Four targets, folds flat in 60 seconds. The practice habit that sticks when it removes the "drive to a range" barrier. Under $45.' },
  { label: 'Putting Mat — 9-Foot Velvet', price: '$54', href: '/golf-putting-mat', why: 'Dual alignment channels, auto-return, regulation 4.25-inch cup. 10 minutes before dinner. The home putting studio for under $60 that produces visible handicap improvement.' },
  { label: 'Cord Grip Regrip Kit', price: '$48', href: '/golf-grips', why: 'Full-set regrip at home in an afternoon. The performance upgrade most golfers delay indefinitely. Everything included for under $50. The gift that improves every club in the bag.' },
  { label: 'Laser Rangefinder', price: '$119', href: '/golf-rangefinder', why: 'At $119 with WYX10 it lands at $107 — the stretch pick just over the mark that most golfers would gladly receive at any budget. If they do not own one, this is the gift.' }
];

const faqs: [string, string][] = [
  ['What is the best golf gift under $100?', 'The leather scorecard holder ($38) and glove 3-pack ($32) together land at $70 and cover the most-used daily accessories in one order. Solo picks: the putting mat ($54) is the best under-$60 home practice gift; the regrip kit ($48) is the performance upgrade they never buy themselves. For stretch: the rangefinder at $107 after WYX10 is the most impactful golf upgrade at any price.'],
  ['What golf gift is best at exactly $100?', 'The backyard chipping net ($44) and putting mat ($54) at $98 total is the best combination at exactly $100 — covers home practice for irons/wedges AND putting in one order. Stack with WYX10 for $88.20 total.'],
  ['Best golf gift under $100 with no size risk?', 'Every pick on this page except the glove 3-pack is completely size-free. The scorecard holder ($38), chipping net ($44), putting mat ($54), regrip kit ($48), and rangefinder ($119) all require no size knowledge and work for any golfer.']
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

function under100Score(product: Awaited<ReturnType<typeof getProducts>>[number]) {
  const price = Number(productPrice(product).amount);
  if (price > 100) return 0;
  let score = productQualityScore(product);
  if (/glove|scorecard|chipping net|putting mat|regrip|rangefinder/i.test(product.title)) score += 8;
  if (price <= 60) score += 5;
  return score;
}

export default async function BestGolfGiftsUnder100Page() {
  const allProducts = availableProducts(await getProducts());
  const products = allProducts
    .filter((p) => Number(productPrice(p).amount) <= 100)
    .sort((a, b) => under100Score(b) - under100Score(a))
    .slice(0, 10);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: 'Best Golf Gifts Under $100',
        url: `${siteUrl}/best-golf-gifts-under-100`,
        breadcrumb: {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
            { '@type': 'ListItem', position: 2, name: 'Golf Gifts', item: `${siteUrl}/golf-gifts` },
            { '@type': 'ListItem', position: 3, name: 'Best Golf Gifts Under $100', item: `${siteUrl}/best-golf-gifts-under-100` }
          ]
        }
      }) }} />

      <section className="deal-hero">
        <div>
          <p className="eyebrow">Best Golf Gifts Under $100</p>
          <h1>Best Golf Gifts Under $100. The Sweet-Spot Budget Done Right.</h1>
          <p>The $50-100 gift budget is the most versatile in golf. It covers three glove replenishments, a complete home practice setup, the bag upgrade that lasts a decade, or the stretch towards a rangefinder with WYX10. Six picks, all used every round.</p>
          <div className="actions">
            <Link className="button primary" href="#under100-grid">Shop All Picks</Link>
            <Link className="button secondary dark" href="/golf-rangefinder">See the Rangefinder &rarr;</Link>
          </div>
          <p style={{ marginTop: '1rem', fontSize: '0.875rem', opacity: 0.8 }}>
            Use <strong>WYX10</strong> at checkout for 10% off. Stretches every budget further.
          </p>
        </div>
        <aside className="share-card">
          <p className="eyebrow">Best Under $60</p>
          <h2>Putting Mat</h2>
          <p>$54. Dual alignment channels, auto-return mechanism, regulation 4.25-inch cup. 10 minutes before dinner. The home putting studio that produces visible improvement within a week of use.</p>
          <Link className="button primary" href="/golf-putting-mat" style={{ marginTop: '1rem', display: 'inline-block' }}>See the Mat &rarr;</Link>
        </aside>
      </section>

      <section className="deal-strip" aria-label="Golf gifts under 100 highlights">
        <span>All picks under $55</span>
        <span>Rangefinder under $108 with WYX10</span>
        <span>WYX10 saves 10%</span>
        <span>Ships in 1-3 days</span>
      </section>

      <section className="section reveal" aria-labelledby="picks-heading">
        <div className="section-heading">
          <p className="eyebrow">Six Best Picks</p>
          <h2 id="picks-heading">Best Golf Gifts Under $100.</h2>
        </div>
        <div className="care-step-grid">
          {picks.map((pick) => (
            <Link key={pick.label} href={pick.href} className="care-step-card" style={{ textDecoration: 'none' }}>
              <strong>{pick.label} — {pick.price}</strong>
              <p>{pick.why}</p>
            </Link>
          ))}
        </div>
      </section>

      <section id="under100-grid" className="section product-section">
        <div className="section-heading">
          <p className="eyebrow">Shop Now</p>
          <h2>Golf Gifts Under $100.</h2>
        </div>
        {products.length
          ? <div className="product-grid">{products.map((p) => <ProductCard key={p.id} product={p} />)}</div>
          : (
            <div className="care-step-grid">
              <Link href="/golf-gloves" className="care-step-card" style={{ textDecoration: 'none' }}><strong>Glove 3-Pack — $32</strong><p>Used every round</p></Link>
              <Link href="/golf-scorecard-holder" className="care-step-card" style={{ textDecoration: 'none' }}><strong>Scorecard Holder — $38</strong><p>Lasts a decade</p></Link>
              <Link href="/golf-putting-mat" className="care-step-card" style={{ textDecoration: 'none' }}><strong>Putting Mat — $54</strong><p>Home practice that translates</p></Link>
              <Link href="/golf-grips" className="care-step-card" style={{ textDecoration: 'none' }}><strong>Regrip Kit — $48</strong><p>Performance upgrade for every club</p></Link>
            </div>
          )
        }
      </section>

      <section className="section reveal" aria-labelledby="faq-heading">
        <div className="section-heading">
          <p className="eyebrow">Questions</p>
          <h2 id="faq-heading">Best Golf Gifts Under $100 FAQ.</h2>
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
          <p className="eyebrow">Other Budget Tiers</p>
          <h2 id="more-heading">Golf Gifts at Every Budget.</h2>
        </div>
        <div className="care-step-grid">
          <Link href="/golf-gifts-under-25" className="care-step-card" style={{ textDecoration: 'none' }}><strong>Under $25</strong><p>Alignment sticks and towels — the functional gifts that earn a bag spot immediately</p></Link>
          <Link href="/golf-gifts-under-50" className="care-step-card" style={{ textDecoration: 'none' }}><strong>Under $50</strong><p>Glove 3-packs, leather scorecard holders — the practical gift sweet spot</p></Link>
          <Link href="/golf-gifts-under-60" className="care-step-card" style={{ textDecoration: 'none' }}><strong>Under $60</strong><p>Easy gift picks and useful bag upgrades</p></Link>
          <Link href="/golf-gifts-under-75" className="care-step-card" style={{ textDecoration: 'none' }}><strong>Under $75</strong><p>Putting mat, chipping net, regrip kit — the generous-but-not-excessive tier</p></Link>
          <Link href="/golf-gifts-under-150" className="care-step-card" style={{ textDecoration: 'none' }}><strong>Under $150</strong><p>Rangefinder and GPS watch — the premium gift that changes how they play</p></Link>
        </div>
      </section>

      <EmailCapture
        source="best-golf-gifts-under-100"
        campaign="golf_gifts_under_100"
        title="Best Golf Gifts Under $100. Delivered in 1-3 Days."
        body="Join the WYX list for seasonal gift guides, new product alerts, and 10% off your first order with WYX10."
      />
    </>
  );
}
