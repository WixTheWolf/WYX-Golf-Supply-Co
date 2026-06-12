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
  title: "Golf Gifts for Coworkers — Group-Friendly Picks Under $35 | WYX Golf Supply Co.",
  description: "Golf gifts for coworkers that work for office gift exchanges and group events — microfiber towels, ball marker sets, glove packs. Under $35, no size guesswork. WYX10 saves 10%.",
  alternates: { canonical: '/golf-gifts-for-coworkers' },
  openGraph: {
    title: "Golf Gifts for Coworkers | WYX Golf Supply Co.",
    description: "Golf gifts for coworkers — practical picks for office exchanges, holiday gifts, and group events. All under $35. WYX10 saves 10%.",
    url: '/golf-gifts-for-coworkers'
  }
};

const picks = [
  { label: 'Hat Clip Ball Marker Set — 3 Markers', price: '$16', href: '/golf-ball-markers', tag: 'Under $20', why: '3 magnetic markers + magnetic hat clip. One-hand retrieval on the green. The coworker golf gift that fits any budget — practical, golf-specific, completely original at the office exchange.' },
  { label: 'Clip-On Microfiber Towel', price: '$18', href: '/golf-towels', tag: 'Under $20', why: 'Used every hole. Carabiner clip, dual-sided microfiber. The safe gift for any golf coworker — no size, no preference, no equipment knowledge required. Just a quality accessory used every round.' },
  { label: 'Golf Arm Sleeves UPF 50+', price: '$22', href: '/golf-arm-sleeves', tag: 'Under $25', why: 'A pair of UPF 50+ arm sleeves with compression and moisture-wicking. The summer golf gift that says you know they play — not just that you searched "golf gifts." One size fits most.' },
  { label: 'Alignment Sticks 2-Pack', price: '$24', href: '/golf-training-aids', tag: 'Under $25', why: 'The training tool every golf instructor uses, almost no amateur owns. The coworker golf gift for the player who is trying to improve — specific enough to impress, practical enough to use immediately.' },
  { label: 'Golf Ball Retriever', price: '$24', href: '/golf-ball-retriever', tag: 'Practical Pick', why: '15-foot telescoping stainless retriever. Collapses to 26 inches. The coworker gift with the clearest ROI of anything in the bag — and the one that makes them think of you every time they use it near a water hazard.' },
  { label: 'Cabretta Glove 3-Pack', price: '$32', href: '/golf-gloves', tag: 'Under $35', why: 'Three fresh cabretta gloves — the consumable coworker gift. If the budget is $35 and you want to give something they use immediately and finish within a season: this is it. Pick ML if unsure.' }
];

const faqs: [string, string][] = [
  ['What are the best golf gifts for coworkers?', 'For office exchanges under $25: hat clip ball marker set ($16), microfiber towel ($18), or alignment sticks ($24). For individual coworker gifts under $35: glove 3-pack ($32) or alignment sticks ($24). All are practical golf accessories used every round. Available at wyxgolfsupply.com with WYX10 for 10% off.'],
  ['What golf coworker gift has zero size risk?', 'Hat clip ball marker set ($16), microfiber towel ($18), arm sleeves ($22), alignment sticks ($24), and ball retriever ($24) are all completely size-free. Only the glove 3-pack requires a size — pick ML for most men if unsure.'],
  ['Good golf white elephant gift ideas?', 'Hat clip ball marker set ($16) — original, specific to golf, small enough for any stocking; microfiber towel ($18) — used every hole; alignment sticks ($24) — the "wait, I actually need this" white elephant gift. All under $25 and available at wyxgolfsupply.com with WYX10 for 10% off.']
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

function coworkerGiftScore(product: Awaited<ReturnType<typeof getProducts>>[number]) {
  const price = Number(productPrice(product).amount);
  if (price > 35) return 0;
  let score = productQualityScore(product);
  if (/marker|towel|alignment|retriever|glove|arm sleeve/i.test(product.title)) score += 8;
  if (price <= 25) score += 5;
  return score;
}

export default async function GolfGiftsForCoworkersPage() {
  const allProducts = availableProducts(await getProducts());
  const products = allProducts
    .filter((p) => Number(productPrice(p).amount) <= 35)
    .sort((a, b) => coworkerGiftScore(b) - coworkerGiftScore(a))
    .slice(0, 10);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: 'Golf Gifts for Coworkers',
        url: `${siteUrl}/golf-gifts-for-coworkers`,
        breadcrumb: {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
            { '@type': 'ListItem', position: 2, name: 'Golf Gifts', item: `${siteUrl}/golf-gifts` },
            { '@type': 'ListItem', position: 3, name: 'Golf Gifts for Coworkers', item: `${siteUrl}/golf-gifts-for-coworkers` }
          ]
        }
      }) }} />

      <section className="deal-hero">
        <div>
          <p className="eyebrow">Office Golf Gifts</p>
          <h1>Golf Gifts for Coworkers. All Under $35. All Actually Used.</h1>
          <p>Six picks for office exchanges, holiday gifts, and group events — from a $16 ball marker set to a $32 glove 3-pack. No sizing guesswork on five of six. All ship in 1-3 days.</p>
          <div className="actions">
            <Link className="button primary" href="#coworkers-grid">Shop Coworker Picks</Link>
            <Link className="button secondary dark" href="/golf-stocking-stuffers">Stocking Stuffers &rarr;</Link>
          </div>
          <p style={{ marginTop: '1rem', fontSize: '0.875rem', opacity: 0.8 }}>
            Use <strong>WYX10</strong> at checkout for 10% off every order.
          </p>
        </div>
        <aside className="share-card">
          <p className="eyebrow">Best Under $20</p>
          <h2>Microfiber Towel</h2>
          <p>$18. Used every hole of every round. Carabiner clip, dual-sided microfiber. The coworker golf gift with zero guesswork — no size, no preference knowledge, just a quality accessory everyone who golfs uses.</p>
          <Link className="button primary" href="/golf-towels" style={{ marginTop: '1rem', display: 'inline-block' }}>See the Towel &rarr;</Link>
        </aside>
      </section>

      <section className="deal-strip" aria-label="Golf coworker gift highlights">
        <span>All under $35</span>
        <span>No size guesswork on 5 of 6</span>
        <span>WYX10 saves 10%</span>
        <span>Ships in 1-3 days</span>
      </section>

      <section className="section reveal" aria-labelledby="picks-heading">
        <div className="section-heading">
          <p className="eyebrow">Six Picks Under $35</p>
          <h2 id="picks-heading">Golf Gifts for Coworkers.</h2>
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

      <section id="coworkers-grid" className="section product-section">
        <div className="section-heading">
          <p className="eyebrow">Shop Now</p>
          <h2>Golf Gifts for Coworkers Under $35.</h2>
        </div>
        {products.length
          ? <div className="product-grid">{products.map((p) => <ProductCard key={p.id} product={p} />)}</div>
          : (
            <div className="care-step-grid">
              <Link href="/golf-ball-markers" className="care-step-card" style={{ textDecoration: 'none' }}><strong>Hat Clip Markers — $16</strong><p>Original, specific, practical</p></Link>
              <Link href="/golf-towels" className="care-step-card" style={{ textDecoration: 'none' }}><strong>Microfiber Towel — $18</strong><p>Used every hole</p></Link>
              <Link href="/golf-training-aids" className="care-step-card" style={{ textDecoration: 'none' }}><strong>Alignment Sticks — $24</strong><p>The training tool they need</p></Link>
              <Link href="/golf-gloves" className="care-step-card" style={{ textDecoration: 'none' }}><strong>Glove 3-Pack — $32</strong><p>Used every round</p></Link>
            </div>
          )
        }
      </section>

      <section className="section reveal" aria-labelledby="faq-heading">
        <div className="section-heading">
          <p className="eyebrow">Questions</p>
          <h2 id="faq-heading">Golf Gifts for Coworkers FAQ.</h2>
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

      <section className="section reveal" aria-labelledby="links-heading">
        <div className="section-heading">
          <p className="eyebrow">More Gift Ideas</p>
          <h2 id="links-heading">Golf Gifts for Group Gifting and Beyond.</h2>
        </div>
        <div className="care-step-grid">
          <Link href="/golf-gifts-for-boss" className="care-step-card" style={{ textDecoration: 'none' }}><strong>Golf Gifts for Boss</strong><p>Professional, practical picks that land right</p></Link>
          <Link href="/golf-corporate-gifts" className="care-step-card" style={{ textDecoration: 'none' }}><strong>Corporate Golf Gifts</strong><p>Client gifts, tournament prizes, group orders</p></Link>
          <Link href="/golf-gift-sets" className="care-step-card" style={{ textDecoration: 'none' }}><strong>Golf Gift Sets</strong><p>Curated bundles by budget</p></Link>
          <Link href="/golf-birthday-gifts" className="care-step-card" style={{ textDecoration: 'none' }}><strong>Golf Birthday Gifts</strong><p>Budget-tiered picks for any birthday</p></Link>
          <Link href="/golf-gifts-under-25" className="care-step-card" style={{ textDecoration: 'none' }}><strong>Golf Gifts Under $25</strong><p>Five practical picks all used every round</p></Link>
        </div>
      </section>

      <EmailCapture
        source="golf-gifts-for-coworkers"
        campaign="coworker_golf_gifts"
        title="Golf Gifts for the Coworker Who Golfs."
        body="Join the WYX list for gift guides, office exchange picks, and 10% off your first order with WYX10."
      />
    </>
  );
}
