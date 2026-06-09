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
  title: "Golf Gifts for Beginners — The Essentials That Make the First Rounds Better | WYX Golf Supply Co.",
  description: "Golf gifts for a beginner golfer — gloves, alignment sticks, a towel, a ball retriever, and the accessories that make the learning process faster and more enjoyable. WYX10 saves 10%.",
  alternates: { canonical: '/golf-gifts-for-beginners' },
  openGraph: {
    title: "Golf Gifts for Beginners | WYX Golf Supply Co.",
    description: "Golf gifts for a beginner that improve every round — gloves, alignment sticks, ball retriever, microfiber towel. Practical picks under $50. WYX10 saves 10%.",
    url: '/golf-gifts-for-beginners'
  }
};

const picks = [
  { label: 'Cabretta Glove 3-Pack', price: '$32', href: '/golf-gloves', tag: 'Most Needed', why: 'Beginners go through gloves faster than any other category — swinging hard with poor mechanics wears grip fabric quickly. Three fresh cabretta gloves means starting the next three rounds with real grip confidence. No size risk at ML for most men.' },
  { label: 'Clip-On Microfiber Towel', price: '$18', href: '/golf-towels', tag: 'Round 1 Gift', why: 'The bag essential that most beginners forget to add. A dual-sided towel clips to any bag D-ring and keeps the club face clean between shots. Clean contact on mishits makes the ball go straighter — even for a beginner.' },
  { label: 'Alignment Sticks 2-Pack', price: '$24', href: '/golf-training-aids', tag: 'Learning Tool', why: 'The number one beginner mistake is poor aim. Not swing flaws — aim. Two sticks, 10 minutes before a range session, confirm ball position and target line. The practice tool that produces the fastest visible improvement for any new golfer.' },
  { label: 'Golf Ball Retriever', price: '$24', href: '/golf-ball-retriever', tag: 'Cost Saver', why: '15-foot telescoping stainless retriever. Collapses to 26 inches for the bag pocket. Beginners lose 3-5 balls per round on average. A retriever pays for itself in balls recovered within two rounds. The practical gift for the new golfer.' },
  { label: 'Putting Alignment Mirror', price: '$32', href: '/golf-training-aids', tag: 'Skill Builder', why: 'Putting is 40% of score. A beginner with a fundamentally correct putting setup improves faster than any other practice investment. The folding mirror shows eye position, shoulder line, and putter path — the setup fundamentals that determine putting consistency.' },
  { label: 'Backyard Chipping Net', price: '$44', href: '/golf-training-aids', tag: 'Practice at Home', why: 'Four-target folding chipping net. Beginners improve fastest with short game repetition — and the range is 20 minutes away. A backyard net removes the barrier. 20 minutes before dinner, every weeknight, produces visible score improvement within two weeks.' }
];

const faqs: [string, string][] = [
  ['What are the best golf gifts for a beginner?', 'Best picks: glove 3-pack ($32 — every beginner needs fresh gloves), alignment sticks ($24 — the fastest way to fix poor aim), microfiber towel ($18 — clean contact on every shot), ball retriever ($24 — pays for itself in recovered balls). Use WYX10 for 10% off at wyxgolfsupply.com.'],
  ['What should I NOT buy a beginner golfer?', 'Avoid new clubs (they need to learn the basics first and may need a fitting), expensive balls (beginners lose 3-5 per round), novelty items, and anything that requires the beginner to already have a developed swing. Stick to accessories that improve the learning process — gloves, alignment tools, practice aids.'],
  ['What golf gift helps a beginner improve fastest?', 'Alignment sticks ($24) improve every range session immediately by showing the beginner whether they are aiming at the target — the most common beginner flaw that has nothing to do with swing technique. Second: a putting alignment mirror ($32) — putting improvement from correct fundamentals is the fastest handicap improvement available at any skill level.']
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

function beginnerGiftScore(product: Awaited<ReturnType<typeof getProducts>>[number]) {
  const price = Number(productPrice(product).amount);
  let score = productQualityScore(product);
  if (/glove|towel|alignment|retriever|putting mirror|chipping net/i.test(product.title)) score += 8;
  if (price <= 35) score += 5;
  return score;
}

export default async function GolfGiftsForBeginnersPage() {
  const allProducts = availableProducts(await getProducts());
  const products = allProducts
    .sort((a, b) => beginnerGiftScore(b) - beginnerGiftScore(a))
    .slice(0, 10);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: 'Golf Gifts for Beginners',
        url: `${siteUrl}/golf-gifts-for-beginners`,
        breadcrumb: {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
            { '@type': 'ListItem', position: 2, name: 'Golf Gifts', item: `${siteUrl}/golf-gifts` },
            { '@type': 'ListItem', position: 3, name: 'Golf Gifts for Beginners', item: `${siteUrl}/golf-gifts-for-beginners` }
          ]
        }
      }) }} />

      <section className="deal-hero">
        <div>
          <p className="eyebrow">For the New Golfer</p>
          <h1>Golf Gifts for Beginners. The Accessories That Make Learning Faster and More Fun.</h1>
          <p>Not clubs. Not balls they will lose in the first water hazard. These are the six accessories that make every beginner round better — fresh gloves, alignment tools, a ball retriever, and the practice equipment that builds the habits that actually stick.</p>
          <div className="actions">
            <Link className="button primary" href="#beginners-grid">Shop Beginner Picks</Link>
            <Link className="button secondary dark" href="/golf-accessories-for-beginners">Beginner Accessories &rarr;</Link>
          </div>
          <p style={{ marginTop: '1rem', fontSize: '0.875rem', opacity: 0.8 }}>
            Use <strong>WYX10</strong> at checkout for 10% off every order.
          </p>
        </div>
        <aside className="share-card">
          <p className="eyebrow">Most Important Beginner Gift</p>
          <h2>Alignment Sticks</h2>
          <p>$24. The number one beginner mistake is poor aim — not swing flaws. Two sticks, 10 minutes at the range, confirm target line before every swing. The fastest improvement available for any new golfer.</p>
          <Link className="button primary" href="/golf-training-aids" style={{ marginTop: '1rem', display: 'inline-block' }}>See the Alignment Sticks &rarr;</Link>
        </aside>
      </section>

      <section className="deal-strip" aria-label="Golf beginner gift highlights">
        <span>All under $50</span>
        <span>Improves every round</span>
        <span>WYX10 saves 10%</span>
        <span>Ships in 1-3 days</span>
      </section>

      <section className="section reveal" aria-labelledby="picks-heading">
        <div className="section-heading">
          <p className="eyebrow">Six Beginner Picks</p>
          <h2 id="picks-heading">Golf Gifts for Beginners. All Under $50.</h2>
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

      <section id="beginners-grid" className="section product-section">
        <div className="section-heading">
          <p className="eyebrow">Shop Now</p>
          <h2>Golf Gifts for Beginners.</h2>
        </div>
        {products.length
          ? <div className="product-grid">{products.map((p) => <ProductCard key={p.id} product={p} />)}</div>
          : (
            <div className="care-step-grid">
              <Link href="/golf-gloves" className="care-step-card" style={{ textDecoration: 'none' }}><strong>Glove 3-Pack — $32</strong><p>Used every round</p></Link>
              <Link href="/golf-training-aids" className="care-step-card" style={{ textDecoration: 'none' }}><strong>Alignment Sticks — $24</strong><p>Fastest improvement tool</p></Link>
              <Link href="/golf-ball-retriever" className="care-step-card" style={{ textDecoration: 'none' }}><strong>Ball Retriever — $24</strong><p>Pays for itself in round 1</p></Link>
              <Link href="/golf-towels" className="care-step-card" style={{ textDecoration: 'none' }}><strong>Microfiber Towel — $18</strong><p>Clean contact every shot</p></Link>
            </div>
          )
        }
      </section>

      <section className="section reveal" aria-labelledby="faq-heading">
        <div className="section-heading">
          <p className="eyebrow">Questions</p>
          <h2 id="faq-heading">Golf Gifts for Beginners FAQ.</h2>
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
        source="golf-gifts-for-beginners"
        campaign="beginner_golf_gifts"
        title="Golf Gifts for the New Golfer in Your Life."
        body="Join the WYX list for beginner guides, new products, and 10% off your first order with WYX10."
      />
    </>
  );
}
